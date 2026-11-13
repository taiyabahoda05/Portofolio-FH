(() => {
  const $ = id => document.getElementById(id);
  let token = "";

  const login = $("login");
  const dashboard = $("dashboard");

  $("login-form").addEventListener("submit", async event => {
    event.preventDefault();
    token = $("token").value.trim();
    await load();
  });

  $("refresh").addEventListener("click", load);

  async function load() {
    $("login-error").textContent = "";

    try {
      const response = await fetch("/api/analytics/summary", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      });

      if (response.status === 401) {
        throw new Error("Invalid admin token.");
      }

      if (!response.ok) {
        throw new Error("Analytics could not be loaded. Check server configuration.");
      }

      const data = await response.json();

      login.classList.add("hidden");
      dashboard.classList.remove("hidden");

      $("total").textContent = Number(data.total || 0).toLocaleString();
      $("unique").textContent = Number(data.uniqueVisitors || 0).toLocaleString();
      $("last30").textContent = Number(data.last30 || 0).toLocaleString();

      renderBars("devices", data.devices || []);
      renderBars("browsers", data.browsers || []);
      renderBars("pages", data.pages || []);

      $("recent").innerHTML = (data.recent || []).map(visit => {
        const referrer = renderReferrer(visit.referrer);

        return `
          <tr>
            <td>${escapeHtml(new Date(visit.visitedAt).toLocaleString())}</td>
            <td>${escapeHtml(visit.device || "Other")}</td>
            <td>${escapeHtml(visit.browser || "Other")}</td>
            <td>${escapeHtml(visit.operatingSystem || "Other")}</td>
            <td>${escapeHtml(visit.page || "/")}</td>
            <td>${referrer}</td>
          </tr>
        `;
      }).join("");
    } catch (error) {
      $("login-error").textContent = error.message;
      dashboard.classList.add("hidden");
      login.classList.remove("hidden");
    }
  }

  function renderReferrer(value) {
    if (!value) return '<span class="direct-referrer">Direct</span>';

    try {
      const url = new URL(value);

      if (!["http:", "https:"].includes(url.protocol)) {
        return escapeHtml(value);
      }

      const safeUrl = escapeHtml(url.href);
      const label = escapeHtml(url.origin);

      return `<a class="referrer-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    } catch {
      return escapeHtml(value);
    }
  }

  function renderBars(id, rows) {
    const max = Math.max(1, ...rows.map(row => Number(row.count) || 0));

    $(id).innerHTML = rows.length
      ? rows.map(row => {
          const count = Number(row.count) || 0;
          const width = Math.round((count / max) * 100);

          return `
            <div class="bar-row">
              <div class="bar-label">
                <span>${escapeHtml(row._id || "Unknown")}</span>
                <b>${count.toLocaleString()}</b>
              </div>
              <div class="bar">
                <i style="width:${width}%"></i>
              </div>
            </div>
          `;
        }).join("")
      : "<p>No data yet.</p>";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }
})();
