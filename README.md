# Portfolio Site

A bilingual personal portfolio for backend, AI, and machine-learning engineering roles.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run test:sites
```

The site is built with React and Vite. It includes English and Chinese content, responsive project layouts, and a cursor-reactive visual background on desktop devices.


## Fitness Tracker（60 天饮食训练打卡）

在线页面：[`/fitness-tracker/`](https://linhongjin.com/fitness-tracker/)。记录每日三餐（照片 · 卡路里 · 蛋白质）、体重与训练内容，目标 2000 kcal / 蛋白质 120–140 g，周期 60 天。

### 每日打卡的三种方式

1. **网页编辑器（推荐）**：打开 `/fitness-tracker/`，点击底部「✎ 打卡 / 编辑」。
   - 首次使用需配置 GitHub Fine-grained Token：仅授权 `portfolio-site` 仓库、`Contents: Read and write`、有效期建议 90 天。Token 只保存在浏览器本地，不会进入仓库。
   - 照片在浏览器内自动压缩（长边 1600px · JPEG 82），与数据合并为**单个原子提交**写入默认分支，Vercel 自动部署（约 1–2 分钟生效）。
   - 选择已有日期会载入旧记录，保存即覆盖更新。
2. **交给 AI 助手**：把「三餐内容 + kcal / 蛋白质 + 照片 + 体重 + 训练」发给助手，由助手提交到仓库。
3. **命令行**：

   ```bash
   npm run fitness:import -- --date 2026-10-09 --photos ./inbox/2026-10-09
   ```

   照片文件名以 `breakfast / 早`、`lunch / 午`、`dinner / 晚` 开头会自动归类到对应餐次，否则按早 → 午 → 晚顺序轮流分配；脚本自动压缩照片到 `public/fitness/<日期>/` 并创建/合并当日记录，补全数值字段后再提交推送。

### 数据结构

- `src/data/fitness/config.json` — 目标与仓库配置（起始日期 `startDate` 默认自动取第一条记录所在周）
- `src/data/fitness/entries.json` — 每日记录数组（按日期升序）
- `public/fitness/<YYYY-MM-DD>/*.jpg` — 餐食照片
- 说明：网页编辑器删除照片只从记录中移除，仓库中的旧图片文件会保留（不影响页面）。

本地开发：`npm run dev` 后访问 `http://localhost:5173/fitness-tracker/`。
