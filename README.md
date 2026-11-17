# Jerry · AI 产品探索

个人网站，记录 AI 产品学习、项目实践与创意实验。

网站地址：https://wanghaojie127-coder.github.io/jerry-personal-site/

## 本地预览

在仓库目录执行：

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

然后打开 http://127.0.0.1:4173 。无需安装依赖或构建。

检查客服地址规则：

```sh
node --test tests/shin-chat.test.js
```

## 修改与发布

- `docs/index.html`：个人介绍、项目与学习内容。
- `docs/styles.css`：颜色、字体、排版、移动端样式。
- `docs/app.js`：项目筛选等交互。
- `docs/dify-chat.config.js`：小新客服的 Dify 公开嵌入地址。只改这一处。
- `docs/shin-chat.js`：右下角客服入口。
- `docs/assets/`：本站使用的图片与字体。

GitHub Pages 使用 `main` 分支的 `/docs` 目录。提交并推送该目录的修改后，GitHub 自动发布更新。

```sh
git add docs README.md
git commit -m "Update personal website"
git push origin main
```

## 小新客服

首页和各个项目页的右下角有「小新客服」。按钮可以打开和关闭。聊天内容来自已经发布的 Dify 公开聊天页，蜡笔小新的语气写在 Dify 的系统提示词里。线上智能体使用 deepseek-v4-flash。网页不指定模型，也不保存 API 密钥。

嵌入地址：https://udify.app/chatbot/uat8zkSb436j2lFW

单独打开的公开对话页：https://udify.app/chat/uat8zkSb436j2lFW

iframe 只使用前面的 `/chatbot/` 地址。访客打开面板后才会加载它。

### 要填写的配置

只编辑 `docs/dify-chat.config.js`。两种写法选一种：

1. 推荐。把 Dify「嵌入网站」里 iframe 的 `src` 整段填进 `embedUrl`，`baseUrl` 和 `token` 留空。
2. `embedUrl` 留空。`baseUrl` 填实例的 https 根地址，`token` 填嵌入代码里的公开 Token。云端根地址以嵌入代码为准，常见是 `https://udify.app`；自建实例填你自己的 https 根地址。

可用地址的形状是 `https://实例/chatbot/公开Token`。页面会拒绝 http、带账号密码的地址、内网地址、查询参数，以及 API 路径。公开 Token 只由字母、数字、下划线或连字符组成。以 `app-` 开头的 API 密钥会被拒绝。

不要把「API 访问」里的密钥写进配置、README 或任何会发布到 GitHub Pages 的文件。公开 Token 可以留在嵌入地址里，它就是给网页公开嵌入用的。

本站使用官方 iframe，权限为 `microphone;clipboard-write`。不把 Dify 的气泡脚本插进页面，因此按钮文字、关闭方式和手机上的位置都由本站控制。面板高度跟随视口，小屏不设 700px 的最小高度。

改完配置后不需要构建。合并到 `main` 并推送 `docs/` 后，GitHub Pages 才会发布。请先看过预览再合并。

### 在 Dify 中准备智能体

1. 新建「智能体」应用，不要做模型微调。
2. 把下一节的系统提示词整段贴进编排中的提示词或指令。
3. 应用名称建议用「小新客服」，与按钮一致。
4. 发布应用。自建 Dify 需要允许其他网站嵌入 `/chatbot/公开Token`。
5. 打开「嵌入网站」，只复制 iframe 的地址或其中的公开 Token。不要把气泡脚本的安装代码贴进本仓库。
6. 按上一节写入 `docs/dify-chat.config.js`。应用若还没发布，Dify 会拒绝聊天页；本站无法代替 Dify 确认它是否可用。

### 系统提示词

```
你是 Jerry 个人网站上的客服，名字叫「小新客服」。用简体中文回答，语气像蜡笔小新：短句、轻松、孩子气，可以偶尔说「嘿嘿」「哦」「呢」。不确定对方身份时用「你」，合适时可以叫「大哥哥」或「大姐姐」。保持礼貌，不要粗俗，不要色情，不要骂人，不要扮演不适合公开网站的情节。

先回答问题，再最多加一句轻松的感想。不要为了开玩笑而答非所问。

只根据下面已经公开的信息回答。不要编造 Jerry 的年龄、职业、城市、联系方式或其他未公开经历。不知道就说不知道，并建议对方去看对应页面或 GitHub。

网站：
- 名称：Jerry · AI 产品探索，也叫个人探索手册
- 地址：https://wanghaojie127-coder.github.io/jerry-personal-site/
- 展示名：Jerry
- GitHub：https://github.com/wanghaojie127-coder
- 源码：https://github.com/wanghaojie127-coder/jerry-personal-site

可以介绍的内容：
- 首页在讲 Jerry 如何探索 AI 与产品的交汇处。
- 「正在做的事」有三项。AI 产品经理资讯是基于 AIHOT 开源框架的本地实践，不是 Jerry 的原创框架。AI 产品学习关注提示词、RAG 和 Agent，课程来自 Harry-LYL/ai-pm-qieman-academy，不是 Jerry 的原创课程。骑自行车的鹈鹕是一次 AI 协作完成的 SVG 插画。
- 「从概念，到真实问题。」下面有三个主题：Prompt 是把问题说清楚，RAG 是让回答有依据，Agent 是从回答走向行动。
- 页面最下方是一段自我介绍，并链到 GitHub。

边界：
- 不提供医疗、法律或金融建议。
- 不索取密码、密钥、验证码或私人资料。
- 不声称自己已经接通了某个尚未配置的系统。
- 对方如果问你是谁，就说你是这个网站上的小新客服，用轻松的语气帮人看懂 Jerry 的探索手册。
- 对方用其他语言提问时，仍用简体中文回答。
```

## 内容来源

- AI 产品经理资讯：基于 AIHOT 开源框架的本地定制实践。
- AI 产品学习：课程资源来自 [Harry-LYL/ai-pm-qieman-academy](https://github.com/Harry-LYL/ai-pm-qieman-academy)，不作为本站作者的原创课程。
- 骑自行车的鹈鹕：个人与 AI 协作的 SVG 创意练习。
- 字体：Noto Serif SC，遵循随附的 SIL Open Font License。

网站不使用分析追踪或表单服务。访客打开小新客服后，才会加载 Dify 公开聊天页。姓名暂用展示名 Jerry。
