/*
 * 右下角「小新客服」。
 *
 * 使用 Dify 官方公开聊天页的 iframe 地址：https://实例/chatbot/公开Token
 * 不注入 Dify 气泡脚本，也不调用服务端接口，因此这里不需要、也不接受 API 密钥。
 * 人设由 Dify 的系统提示词决定，不在本文件里。
 *
 * 脚本路径是相对的，可同时用于本地预览和 GitHub Pages 的 /jerry-personal-site/。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;
  const start = () => {
    try {
      api.mount(document, root.JERRY_DIFY_CHAT);
    } catch {
      console.warn("小新客服未能启动。");
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const TOKEN = /^[A-Za-z0-9_-]{8,64}$/;
  const SECRET_PREFIX = /^(?:app|sk|dataset|pat)-/i;
  const PLACEHOLDER = /^(?:your[_-]?token|your[_-]?app[_-]?token|public[_-]?token|replace[_-]?me|changeme|exampletoken|xxxxxxxx+|token)$/i;
  const COPY = {
    unconfigured: "小新客服还没准备好。公开嵌入地址填好之后，才能在这里聊天。现在没有加载外部页面。",
    invalid: "小新客服的地址还不能用，所以没有打开聊天页，也没有加载外部页面。",
    caption: "由 Dify 公开聊天页提供。",
    openReady: "已打开小新客服。聊天页来自已填写的 Dify 公开地址。",
    openIdle: "已打开小新客服。当前不能聊天，也没有加载外部页面。",
    closed: "已关闭小新客服。"
  };

  function clean(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function usableToken(token) {
    return TOKEN.test(token) && !SECRET_PREFIX.test(token) && !PLACEHOLDER.test(token);
  }

  function isPublicHostname(hostname) {
    const host = String(hostname || "").replace(/^\[|\]$/g, "").toLowerCase();
    if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return false;
    if (host === "0.0.0.0" || host === "::" || host === "::1") return false;
    if (host.includes(":")) return false;

    const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (match) {
      const parts = match.slice(1).map(Number);
      if (parts.some(part => part > 255)) return false;
      const a = parts[0];
      const b = parts[1];
      if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
      if (a === 169 && b === 254) return false;
      if (a === 172 && b >= 16 && b <= 31) return false;
      if (a === 192 && b === 168) return false;
      if (a === 100 && b >= 64 && b <= 127) return false;
      return true;
    }

    return host.includes(".");
  }

  function parseUrl(value) {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  }

  function ready(url, token) {
    if (!usableToken(token)) return { state: "invalid", code: "rejected" };
    url.pathname = "/chatbot/" + token;
    url.search = "";
    url.hash = "";
    return { state: "ready", url: url.href };
  }

  function acceptChatUrl(url) {
    if (!url || url.protocol !== "https:" || url.username || url.password) return { state: "invalid", code: "rejected" };
    if (url.search || url.hash || !isPublicHostname(url.hostname)) return { state: "invalid", code: "rejected" };
    const match = url.pathname.match(/^\/chatbot\/([A-Za-z0-9_-]{8,64})\/?$/);
    if (!match) return { state: "invalid", code: "rejected" };
    return ready(url, match[1]);
  }

  function resolveEmbedUrl(config) {
    if (!config || typeof config !== "object") return { state: "unconfigured" };
    const embedUrl = clean(config.embedUrl);
    const baseUrl = clean(config.baseUrl);
    const token = clean(config.token);
    if (embedUrl) return acceptChatUrl(parseUrl(embedUrl));
    if (!baseUrl && !token) return { state: "unconfigured" };
    if (!baseUrl || !token) return { state: "invalid", code: "incomplete" };

    const base = parseUrl(baseUrl);
    if (!base || base.protocol !== "https:" || base.username || base.password || base.search || base.hash) {
      return { state: "invalid", code: "rejected" };
    }
    if (base.pathname !== "/" && base.pathname !== "") return { state: "invalid", code: "rejected" };
    if (!isPublicHostname(base.hostname) || !usableToken(token)) return { state: "invalid", code: "rejected" };
    return ready(base, token);
  }

  function svgIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 16.8V19.4L9.1 17.2H18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6.8");
    svg.append(path);
    return svg;
  }

  function mount(doc, config) {
    if (!doc || !doc.body || doc.getElementById("shin-chat")) return null;
    const result = resolveEmbedUrl(config);
    const root = doc.createElement("div");
    root.id = "shin-chat";
    root.className = "shin-chat";
    root.dataset.state = result.state;
    if (result.code) root.dataset.reason = result.code;

    const panel = doc.createElement("div");
    panel.id = "shin-chat-panel";
    panel.className = "shin-chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "shin-chat-title");
    panel.hidden = true;

    const bar = doc.createElement("div");
    bar.className = "shin-chat-bar";
    const title = doc.createElement("h2");
    title.id = "shin-chat-title";
    title.textContent = "小新客服";
    const close = doc.createElement("button");
    close.type = "button";
    close.className = "shin-chat-close";
    close.setAttribute("aria-label", "关闭小新客服");
    close.textContent = "关闭";
    bar.append(title, close);

    const body = doc.createElement("div");
    body.className = "shin-chat-body";
    let frame = null;
    if (result.state === "ready") {
      panel.classList.add("is-ready");
      const caption = doc.createElement("p");
      caption.className = "shin-chat-caption";
      caption.id = "shin-chat-status";
      caption.textContent = COPY.caption;
      frame = doc.createElement("iframe");
      frame.className = "shin-chat-frame";
      frame.title = "小新客服对话";
      frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      frame.setAttribute("allow", "microphone;clipboard-write");
      body.append(caption, frame);
      panel.setAttribute("aria-describedby", "shin-chat-status");
    } else {
      const note = doc.createElement("p");
      note.className = "shin-chat-note";
      note.id = "shin-chat-status";
      note.textContent = result.state === "unconfigured" ? COPY.unconfigured : COPY.invalid;
      body.append(note);
      panel.setAttribute("aria-describedby", "shin-chat-status");
    }

    const live = doc.createElement("p");
    live.className = "shin-chat-sr";
    live.setAttribute("aria-live", "polite");

    const toggle = doc.createElement("button");
    toggle.type = "button";
    toggle.className = "shin-chat-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "shin-chat-panel");
    toggle.setAttribute("aria-haspopup", "dialog");
    const label = doc.createElement("span");
    label.textContent = "小新客服";
    toggle.append(svgIcon(), label);

    panel.append(bar, body);
    root.append(panel, live, toggle);
    doc.body.append(root);

    if (result.state === "invalid") console.warn("小新客服没有加载外部页面（" + result.code + "）。");

    let loaded = false;

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        if (frame && !loaded) {
          frame.src = result.url;
          loaded = true;
        }
        live.textContent = result.state === "ready" ? COPY.openReady : COPY.openIdle;
        close.focus();
        return;
      }
      live.textContent = COPY.closed;
      toggle.focus();
    }

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    close.addEventListener("click", () => setOpen(false));
    doc.addEventListener("keydown", event => {
      if (event.key !== "Escape" || panel.hidden) return;
      event.preventDefault();
      setOpen(false);
    });

    return root;
  }

  return { resolveEmbedUrl, mount };
});
