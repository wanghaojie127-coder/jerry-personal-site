/*
 * 小新客服 · 唯一配置处
 *
 * 只填写 Dify「嵌入网站」给出的公开聊天地址，或公开 Token。
 * 不要填写 API 密钥。Dify 的 API 密钥通常以 app- 开头，不能出现在 GitHub Pages 的静态文件里。
 *
 * 写法一（推荐）：embedUrl 填 iframe 的 src，另外两项留空。
 *   https://你的实例/chatbot/公开Token
 * 写法二：embedUrl 留空，baseUrl 填 https 根地址，token 填公开 Token。
 *   云端实例的根地址以嵌入代码为准，常见为 https://udify.app
 *
 * 当前使用已发布的公开嵌入地址。单独打开的对话页是
 * https://udify.app/chat/uat8zkSb436j2lFW ，不要把它当作 iframe 地址。
 * 两项都空着时，按钮仍会显示，但不会请求任何外部地址，也不能聊天。
 */
(function (root) {
  root.JERRY_DIFY_CHAT = {
    embedUrl: "https://udify.app/chatbot/uat8zkSb436j2lFW",
    baseUrl: "",
    token: ""
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
