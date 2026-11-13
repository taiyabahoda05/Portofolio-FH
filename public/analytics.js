(() => {
  const $ = id => document.getElementById(id);
  let token = "";
  const login = $("login"), dashboard = $("dashboard");
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
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store"
      });
      if (response.status === 401) throw new Error("Invalid admin token.");
      if (!response.ok) throw new Error("Analytics could not be loaded. Check server configuration.");
      const data = await response.json();
      login.classList.add("hidden"); dashboard.classList.remove("hidden");
      $("total").textContent = data.total.toLocaleString();
      $("unique").textContent = data.uniqueVisitors.toLocaleString();
      $("last30").textContent = data.last30.toLocaleString();
      renderBars("devices", data.devices);
      renderBars("browsers", data.browsers);
      renderBars("pages", data.pages);
      $("recent").innerHTML = data.recent.map(v => `<tr><td>${escapeHtml(new Date(v.visitedAt).toLocaleString())}</td><td>${escapeHtml(v.device)}</td><td>${escapeHtml(v.browser)}</td><td>${escapeHtml(v.operatingSystem)}</td><td>${escapeHtml(v.page)}</td><td>${escapeHtml(v.referrer || "Direct")}</td></tr>`).join("");
    } catch (error) {
      $("login-error").textContent = error.message;
      dashboard.classList.add("hidden"); login.classList.remove("hidden");
    }
  }
  function renderBars(id, rows) {
    const max = Math.max(1, ...rows.map(x => x.count));
    $(id).innerHTML = rows.length ? rows.map(row => `<div class="bar-row"><div class="bar-label"><span>${escapeHtml(row._id || "Unknown")}</span><b>${row.count}</b></div><div class="bar"><i style="width:${Math.round(row.count/max*100)}%"></i></div></div>`).join("") : "<p>No data yet.</p>";
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
  }
})();