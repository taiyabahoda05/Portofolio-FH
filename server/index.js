import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { MongoClient } from "mongodb";

const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const production = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3001);

app.disable("x-powered-by");
app.set("trust proxy", 1);

for (const key of ["MONGODB_URI", "ANALYTICS_ADMIN_TOKEN", "VISITOR_HASH_SECRET"]) {
  if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`);
}
if (process.env.ANALYTICS_ADMIN_TOKEN.length < 32 || process.env.VISITOR_HASH_SECRET.length < 32) {
  throw new Error("ANALYTICS_ADMIN_TOKEN and VISITOR_HASH_SECRET must each be at least 32 characters.");
}

app.use((req, res, next) => {
  const origin = req.get("Origin");
  const allowed = process.env.FRONTEND_ORIGIN;
  if (allowed && origin === allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") return res.sendStatus(!allowed || origin === allowed ? 204 : 403);
  next();
});

app.use(helmet({
  contentSecurityPolicy: { directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'", "mailto:"],
    frameAncestors: ["'self'"],
    upgradeInsecureRequests: production ? [] : null
  }},
  crossOriginEmbedderPolicy: false,
  hsts: production ? { maxAge: 31536000, includeSubDomains: true } : false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

app.use(express.json({ limit: "8kb", type: "application/json" }));
const visitLimiter = rateLimit({ windowMs: 60_000, limit: 25, standardHeaders: "draft-8", legacyHeaders: false });
const adminLimiter = rateLimit({ windowMs: 60_000, limit: 8, standardHeaders: "draft-8", legacyHeaders: false });

const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 });
let visits;

const clean = (v, max = 250) => typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) : "";
function classify(ua = "") {
  const browser = /Edg\//i.test(ua) ? "Edge" : /Firefox\//i.test(ua) ? "Firefox" : /Chrome\//i.test(ua) ? "Chrome" : /Safari\//i.test(ua) ? "Safari" : "Other";
  const device = /ipad|tablet|playbook|silk/i.test(ua) ? "Tablet" : /mobile|android|iphone|ipod|windows phone/i.test(ua) ? "Mobile" : "Desktop";
  const os = /Windows/i.test(ua) ? "Windows" : /Android/i.test(ua) ? "Android" : /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Mac OS X|Macintosh/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "Other";
  return { browser, device, os };
}
function visitorHash(req, ua) {
  const address = req.ip || req.socket.remoteAddress || "unknown";
  return crypto.createHmac("sha256", process.env.VISITOR_HASH_SECRET).update(`${address}|${ua}`).digest("hex").slice(0, 24);
}
function adminOnly(req, res, next) {
  const supplied = req.get("authorization") || "";
  const expected = `Bearer ${process.env.ANALYTICS_ADMIN_TOKEN}`;
  const a = Buffer.from(supplied), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.post("/api/analytics/visit", visitLimiter, async (req, res) => {
  try {
    const ua = clean(req.get("user-agent"), 500);
    const { browser, device, os } = classify(ua);
    let referrer = "";
    try {
      const u = new URL(clean(req.body?.referrer, 500));
      if (["http:", "https:"].includes(u.protocol)) referrer = u.origin;
    } catch {}
    await visits.insertOne({
      visitorId: visitorHash(req, ua), visitedAt: new Date(),
      page: clean(req.body?.page, 120) || "/", referrer, browser, device,
      operatingSystem: os
    });
    res.status(202).json({ recorded: true });
  } catch (error) {
    console.error("Visit tracking failed:", error.message);
    res.status(503).json({ error: "Analytics temporarily unavailable" });
  }
});

app.get("/api/analytics/summary", adminLimiter, adminOnly, async (_req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 86400000);
    const [total, unique, last30, recent, devices, browsers, pages] = await Promise.all([
      visits.countDocuments(),
      visits.distinct("visitorId"),
      visits.countDocuments({ visitedAt: { $gte: since } }),
      visits.find({}, { projection: { _id: 0, visitorId: 1, visitedAt: 1, page: 1, referrer: 1, browser: 1, device: 1, operatingSystem: 1 } }).sort({ visitedAt: -1 }).limit(100).toArray(),
      visits.aggregate([{ $group: { _id: "$device", count: { $sum: 1 } } }]).toArray(),
      visits.aggregate([{ $group: { _id: "$browser", count: { $sum: 1 } } }]).toArray(),
      visits.aggregate([{ $group: { _id: "$page", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]).toArray()
    ]);
    res.set("Cache-Control", "no-store");
    res.json({ total, uniqueVisitors: unique.length, last30, recent, devices, browsers, pages });
  } catch (error) {
    console.error("Analytics summary failed:", error.message);
    res.status(503).json({ error: "Analytics temporarily unavailable" });
  }
});

app.use(express.static(dist, { index: "index.html", maxAge: production ? "1h" : 0, setHeaders(res, file) {
  if (file.endsWith("index.html") || file.endsWith("analytics.html")) res.setHeader("Cache-Control", "no-store");
}}));
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(dist, "index.html"), error => error && next(error));
});
app.use((err, _req, res, _next) => { console.error(err.message); res.status(500).json({ error: "Internal server error" }); });

async function start() {
  await client.connect();
  visits = client.db(process.env.MONGODB_DB || "farazul_portfolio").collection("visits");
  await visits.createIndex({ visitedAt: -1 });
  await visits.createIndex({ visitorId: 1, visitedAt: -1 });
  await visits.createIndex({ visitedAt: 1 }, { expireAfterSeconds: 15552000 });
  app.listen(port, "0.0.0.0", () => console.log(`Farazul portfolio listening on ${port}`));
}
start().catch(error => { console.error("Startup failed:", error.message); process.exit(1); });
async function shutdown() { await client.close(); process.exit(0); }
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
