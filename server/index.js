import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { MongoClient } from "mongodb";

const app = express();

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const dist = path.join(root, "dist");
const production = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3001);

// --------------------------------------------------
// ENVIRONMENT VALIDATION
// --------------------------------------------------

for (const key of [
  "MONGODB_URI",
  "ANALYTICS_ADMIN_TOKEN",
  "VISITOR_HASH_SECRET"
]) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

if (
  process.env.ANALYTICS_ADMIN_TOKEN.length < 32 ||
  process.env.VISITOR_HASH_SECRET.length < 32
) {
  throw new Error(
    "ANALYTICS_ADMIN_TOKEN and VISITOR_HASH_SECRET must each be at least 32 characters."
  );
}

// --------------------------------------------------
// EXPRESS CONFIGURATION
// --------------------------------------------------

app.disable("x-powered-by");
app.set("trust proxy", 1);

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use((req, res, next) => {
  const origin = req.get("Origin");
  const allowed = process.env.FRONTEND_ORIGIN;

  if (allowed && origin === allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(
      !allowed || origin === allowed ? 204 : 403
    );
  }

  next();
});

// --------------------------------------------------
// SECURITY HEADERS
// --------------------------------------------------

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'", "mailto:"],
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: production ? [] : null
      }
    },

    crossOriginEmbedderPolicy: false,

    hsts: production
      ? {
          maxAge: 31536000,
          includeSubDomains: true
        }
      : false,

    referrerPolicy: {
      policy: "strict-origin-when-cross-origin"
    }
  })
);

// --------------------------------------------------
// REQUEST PARSING
// --------------------------------------------------

app.use(
  express.json({
    limit: "8kb",
    type: "application/json"
  })
);

// --------------------------------------------------
// RATE LIMITING
// --------------------------------------------------

const visitLimiter = rateLimit({
  windowMs: 60_000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const adminLimiter = rateLimit({
  windowMs: 60_000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

// --------------------------------------------------
// MONGODB CONNECTION
// --------------------------------------------------

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10
});

let visits;
let server;

// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

const clean = (value, max = 250) =>
  typeof value === "string"
    ? value
        .replace(/[\u0000-\u001f\u007f]/g, "")
        .trim()
        .slice(0, max)
    : "";

// --------------------------------------------------
// BROWSER, DEVICE AND OS DETECTION
// --------------------------------------------------

function classify(ua = "") {
  const browser =
    /Edg\//i.test(ua)
      ? "Edge"
      : /Firefox\//i.test(ua)
        ? "Firefox"
        : /(?:Chrome|CriOS)\//i.test(ua)
          ? "Chrome"
          : /(?:OPR|Opera)\//i.test(ua)
            ? "Opera"
            : /(?:Safari|Version)\//i.test(ua)
              ? "Safari"
              : "Other";

  const device =
    /ipad|tablet|playbook|silk/i.test(ua)
      ? "Tablet"
      : /mobile|android|iphone|ipod|windows phone/i.test(ua)
        ? "Mobile"
        : "Desktop";

  const os =
    /Windows/i.test(ua)
      ? "Windows"
      : /Android/i.test(ua)
        ? "Android"
        : /iPhone|iPad|iPod/i.test(ua)
          ? "iOS"
          : /Mac OS X|Macintosh/i.test(ua)
            ? "macOS"
            : /Linux/i.test(ua)
              ? "Linux"
              : "Other";

  return { browser, device, os };
}

// --------------------------------------------------
// VISITOR HASHING
// --------------------------------------------------

function visitorHash(req, ua) {
  const address =
    req.ip ||
    req.socket.remoteAddress ||
    "unknown";

  return crypto
    .createHmac("sha256", process.env.VISITOR_HASH_SECRET)
    .update(`${address}|${ua}`)
    .digest("hex")
    .slice(0, 24);
}

// --------------------------------------------------
// ADMIN AUTHENTICATION
// --------------------------------------------------

function adminOnly(req, res, next) {
  const supplied = req.get("authorization") || "";

  const expected =
    `Bearer ${process.env.ANALYTICS_ADMIN_TOKEN}`;

  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);

  if (
    a.length !== b.length ||
    !crypto.timingSafeEqual(a, b)
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  next();
}

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok"
  });
});

// --------------------------------------------------
// VISITOR TRACKING API
// --------------------------------------------------

app.post(
  "/api/analytics/visit",
  visitLimiter,
  async (req, res) => {
    try {
      const ua = clean(req.get("user-agent"), 500);

      const { browser, device, os } = classify(ua);

      let referrer = "";

      try {
        const url = new URL(
          clean(req.body?.referrer, 500)
        );

        if (["http:", "https:"].includes(url.protocol)) {
          referrer = url.origin;
        }
      } catch {
        // Invalid referrer is ignored.
      }

      await visits.insertOne({
        visitorId: visitorHash(req, ua),
        visitedAt: new Date(),
        page: clean(req.body?.page, 120) || "/",
        referrer,
        browser,
        device,
        operatingSystem: os
      });

      res.status(202).json({
        recorded: true
      });

    } catch (error) {
      console.error(
        "Visit tracking failed:",
        error.message
      );

      res.status(503).json({
        error: "Analytics temporarily unavailable"
      });
    }
  }
);

// --------------------------------------------------
// ANALYTICS SUMMARY API
// --------------------------------------------------

app.get(
  "/api/analytics/summary",
  adminLimiter,
  adminOnly,
  async (_req, res) => {
    try {
      const since = new Date(
        Date.now() - 30 * 86400000
      );

      const [
        total,
        unique,
        last30,
        recent,
        devices,
        browsers,
        pages
      ] = await Promise.all([
        visits.countDocuments(),

        visits.aggregate([
          { $group: { _id: "$visitorId" } },
          { $count: "total" }
        ]).toArray(),

        visits.countDocuments({
          visitedAt: { $gte: since }
        }),

        visits.find(
          {},
          {
            projection: {
              _id: 0,
              visitorId: 1,
              visitedAt: 1,
              page: 1,
              referrer: 1,
              browser: 1,
              device: 1,
              operatingSystem: 1
            }
          }
        )
          .sort({ visitedAt: -1 })
          .limit(100)
          .toArray(),

        visits.aggregate([
          {
            $group: {
              _id: "$device",
              count: { $sum: 1 }
            }
          }
        ]).toArray(),

        visits.aggregate([
          {
            $group: {
              _id: "$browser",
              count: { $sum: 1 }
            }
          }
        ]).toArray(),

        visits.aggregate([
          {
            $group: {
              _id: "$page",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 8 }
        ]).toArray()
      ]);

      res.set("Cache-Control", "no-store");

      res.json({
        total,
        uniqueVisitors: unique[0]?.total || 0,
        last30,
        recent,
        devices,
        browsers,
        pages
      });

    } catch (error) {
      console.error(
        "Analytics summary failed:",
        error.message
      );

      res.status(503).json({
        error: "Analytics temporarily unavailable"
      });
    }
  }
);

// --------------------------------------------------
// SERVE REACT + VITE FRONTEND
// --------------------------------------------------

app.use(
  express.static(dist, {
    index: "index.html",

    maxAge: production ? "1h" : 0,

    setHeaders(res, file) {
      if (
        file.endsWith("index.html") ||
        file.endsWith("analytics.html")
      ) {
        res.setHeader("Cache-Control", "no-store");
      }
    }
  })
);

// --------------------------------------------------
// FRONTEND ROUTING FALLBACK
// --------------------------------------------------

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "Not found"
    });
  }

  res.sendFile(
    path.join(dist, "index.html"),
    (error) => {
      if (error) next(error);
    }
  );
});

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use((err, _req, res, _next) => {
  console.error(err.message);

  res.status(500).json({
    error: "Internal server error"
  });
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

async function start() {
  await client.connect();

  console.log("MongoDB connected successfully.");

  const db = client.db(
    process.env.MONGODB_DB || "portfolio"
  );

  visits = db.collection("visits");

  // Database indexes
  await visits.createIndex({
    visitedAt: -1
  });

  await visits.createIndex({
    visitorId: 1,
    visitedAt: -1
  });

  // Automatically expire records after 180 days
  await visits.createIndex(
    { visitedAt: 1 },
    { expireAfterSeconds: 15552000 }
  );

  server = app.listen(port, "0.0.0.0", () => {
    console.log(
      `Farazul portfolio listening on port ${port}`
    );
  });
}

// --------------------------------------------------
// GRACEFUL SHUTDOWN
// --------------------------------------------------

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;

  shuttingDown = true;

  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await client.close();

    console.log("Server shutdown completed.");
    process.exit(0);

  } catch (error) {
    console.error("Shutdown failed:", error.message);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// --------------------------------------------------
// INITIALIZE APPLICATION
// --------------------------------------------------

start().catch(async (error) => {
  console.error("Startup failed:", error.message);

  await client.close().catch(() => {});

  process.exit(1);
});
