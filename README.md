# Caolingzhi 作品集 · 改版站点

> 曹静致 · 个人求职作品集改版站点  
> 旧站原样保留在 `backup/`，新站点文件直接位于仓库根

## 本地预览

```bash
python -m http.server 8899
# 浏览器打开 http://127.0.0.1:8899/
```

零依赖、零构建，静态 HTML/CSS/JS，可直接部署到任何静态站点服务（GitHub Pages / Vercel / Netlify / Nginx）。

## 目录结构

```
portfolio/
├── README.md       ← 你正在看
├── .gitignore
├── index.html      ← 主页（GitHub Pages 根目录访问）
├── posters.html
├── social.html
├── assets/
│   ├── style.css        ← 主题与排版
│   ├── motion.js        ← 弹跳粒子 / 光标光晕 / 滚动进度
│   ├── app.js           ← 主题 + 中英双语 + 渐显 + lightbox
│   ├── gallery.js       ← 子页 masonry
│   ├── portrait.png
│   ├── 7月到岗中国传媒大学.pdf
│   ├── posters/{work,fandom,school}/*.png
│   └── social/*.png
├── backup/         ← 旧站完整备份（不上线）
└── tools/          ← 一次性爬图脚本（不上线，可删）
```

## 主要特性

- **暗色电影感主题**：默认 dark，可切 light（点右上角"日间/夜间"按钮）
- **中英双语**：点右上角"EN/中"按钮，所有正文即时切换
- **纯黑体**：Instrument Sans + Noto Sans SC（无任何宋体回落）
- **弹跳粒子背景**：canvas 粒子在看不见的"地面"上做阻尼弹跳
- **首屏 hero 光雾 + 入场动画**
- **masonry 画廊**：海报 / 自媒体作品按 CSS columns 自然瀑布流

## 字体来源

通过 jsDelivr fontsource 合并请求，不走 Google Fonts（国内稳定）：
`https://cdn.jsdelivr.net/combine/npm/@fontsource/...`

## License

仅作个人求职展示，请勿转载作品素材。