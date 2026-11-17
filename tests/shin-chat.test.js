const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { resolveEmbedUrl } = require("../docs/shin-chat.js");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const PUBLIC_EMBED = "https://udify.app/chatbot/uat8zkSb436j2lFW";

test("shipped config uses the public embed URL and no API secret", () => {
  const context = {};
  vm.createContext(context);
  vm.runInContext(read("docs/dify-chat.config.js"), context);
  const shipped = context.JERRY_DIFY_CHAT;
  assert.deepEqual(Object.keys(shipped).sort(), ["baseUrl", "embedUrl", "token"]);
  assert.equal(shipped.embedUrl, PUBLIC_EMBED);
  assert.equal(shipped.baseUrl, "");
  assert.equal(shipped.token, "");
  assert.deepEqual(resolveEmbedUrl({
    embedUrl: shipped.embedUrl,
    baseUrl: shipped.baseUrl,
    token: shipped.token
  }), { state: "ready", url: PUBLIC_EMBED });
  assert.doesNotMatch(read("docs/dify-chat.config.js"), /app-[A-Za-z0-9]{8,}|sk-[A-Za-z0-9]/);
});

test("accepts one public chatbot URL and ignores split fields when it is set", () => {
  const result = resolveEmbedUrl({
    embedUrl: "  https://Dify.Example.com/chatbot/AbcdEf1234567890/  ",
    baseUrl: "https://other.example.com",
    token: "shouldNotUse1"
  });
  assert.deepEqual(result, {
    state: "ready",
    url: "https://dify.example.com/chatbot/AbcdEf1234567890"
  });
});

test("composes baseUrl and public token when embedUrl is empty", () => {
  assert.deepEqual(resolveEmbedUrl({
    embedUrl: "",
    baseUrl: "https://udify.example.com/",
    token: "AbcdEf1234567890"
  }), {
    state: "ready",
    url: "https://udify.example.com/chatbot/AbcdEf1234567890"
  });
});

test("keeps the entry unconfigured until both halves are present", () => {
  assert.deepEqual(resolveEmbedUrl({}), { state: "unconfigured" });
  assert.deepEqual(resolveEmbedUrl(null), { state: "unconfigured" });
  assert.deepEqual(resolveEmbedUrl({ embedUrl: "  ", baseUrl: "", token: 16 }), { state: "unconfigured" });
  assert.deepEqual(resolveEmbedUrl({ baseUrl: "https://dify.example.com" }), {
    state: "invalid",
    code: "incomplete"
  });
  assert.deepEqual(resolveEmbedUrl({ token: "AbcdEf1234567890" }), {
    state: "invalid",
    code: "incomplete"
  });
});

test("rejects secrets, private hosts, and non-chatbot URLs without echoing them", () => {
  const rejected = [
    "http://dify.example.com/chatbot/AbcdEf1234567890",
    "javascript:alert(1)",
    "https://user:pass@dify.example.com/chatbot/AbcdEf1234567890",
    "https://dify.example.com/chatbot/AbcdEf1234567890?api_key=app-secretvalue",
    "https://dify.example.com/v1/chat-messages",
    "https://127.0.0.1/chatbot/AbcdEf1234567890",
    "https://10.1.2.3/chatbot/AbcdEf1234567890",
    "https://192.168.0.8/chatbot/AbcdEf1234567890",
    "https://172.16.4.4/chatbot/AbcdEf1234567890",
    "https://dify.local/chatbot/AbcdEf1234567890",
    "https://localhost/chatbot/AbcdEf1234567890",
    "https://dify.example.com/chatbot/app-abcdefghijklmnop",
    "https://dify.example.com/chatbot/YOUR_TOKEN",
    "https://dify.example.com/chat/AbcdEf1234567890"
  ];
  for (const embedUrl of rejected) {
    const result = resolveEmbedUrl({ embedUrl });
    assert.equal(result.state, "invalid", embedUrl);
    assert.equal(result.code, "rejected", embedUrl);
    assert.equal("url" in result, false);
    assert.equal(JSON.stringify(result).includes("app-"), false);
    assert.equal(JSON.stringify(result).includes("secret"), false);
  }

  assert.deepEqual(resolveEmbedUrl({
    baseUrl: "https://dify.example.com/console",
    token: "AbcdEf1234567890"
  }), { state: "invalid", code: "rejected" });
  assert.deepEqual(resolveEmbedUrl({
    baseUrl: "https://10.2.3.4",
    token: "app-abcdefghijklmnop"
  }), { state: "invalid", code: "rejected" });
});

test("pages use relative scripts and do not embed a service client", () => {
  const index = read("docs/index.html");
  const pages = [
    "docs/projects/ai-learning.html",
    "docs/projects/ai-news.html",
    "docs/projects/pelican.html"
  ].map(read);
  const source = read("docs/shin-chat.js");

  assert.match(index, /src="dify-chat\.config\.js"/);
  assert.match(index, /src="shin-chat\.js"/);
  for (const page of pages) {
    assert.match(page, /src="\.\.\/dify-chat\.config\.js"/);
    assert.match(page, /src="\.\.\/shin-chat\.js"/);
  }
  const site = [index, ...pages, source, read("docs/dify-chat.config.js"), read("docs/styles.css")].join("\n");
  assert.doesNotMatch(site, /src="\/(?:dify-chat|shin-chat)/);
  assert.doesNotMatch(site, /embed\.min\.js|\/v1\/chat-messages|api[_-]?key/i);
  assert.match(read("README.md"), /dify-chat\.config\.js/);
  assert.match(read("README.md"), /系统提示词/);
  assert.match(source, /小新客服/);
  assert.match(source, /关闭小新客服/);
  assert.match(source, /microphone;clipboard-write/);
  assert.doesNotMatch(source + "\n" + read("docs/styles.css"), /min-height:\s*700px|height:\s*700px/);
});
