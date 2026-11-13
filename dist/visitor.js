(() => {
  if (location.pathname === "/analytics.html" || navigator.doNotTrack === "1") return;
  const payload = { page: location.pathname.slice(0, 120) || "/", referrer: document.referrer || "" };
  const send = () => fetch("/api/analytics/visit", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), keepalive: true, credentials: "same-origin"
  }).catch(() => {});
  if (document.readyState === "complete") send();
  else addEventListener("load", send, { once: true });
})();