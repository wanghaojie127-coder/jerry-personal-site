# Jerry · AI 产品探索

个人网站，记录 AI 产品学习、项目实践与创意实验。

网站地址：https://wanghaojie127-coder.github.io/jerry-personal-site/

## 本地预览

在仓库目录执行：

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

然后打开 http://127.0.0.1:4173 。无需安装依赖或构建。

## 修改与发布

- `docs/index.html`：个人介绍、项目与学习内容。
- `docs/styles.css`：颜色、字体、排版、移动端样式。
- `docs/app.js`：项目筛选等交互。
- `docs/assets/`：本站使用的图片与字体。

GitHub Pages 使用 `main` 分支的 `/docs` 目录。提交并推送该目录的修改后，GitHub 自动发布更新。

```sh
git add docs README.md
git commit -m "Update personal website"
git push origin main
```

## 内容来源

- AI 产品经理资讯：基于 AIHOT 开源框架的本地定制实践。
- AI 产品学习：课程资源来自 [Harry-LYL/ai-pm-qieman-academy](https://github.com/Harry-LYL/ai-pm-qieman-academy)，不作为本站作者的原创课程。
- 骑自行车的鹈鹕：个人与 AI 协作的 SVG 创意练习。
- 字体：Noto Serif SC，遵循随附的 SIL Open Font License。

网站不使用分析追踪、第三方运行脚本或表单服务。姓名暂用展示名 Jerry。
