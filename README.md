# 厦门工运主题展馆 360°漫游演示

本项目是投标演示用的本地网页：

- `360漫游`：右侧平面图热点点击切换展区，主视窗可拖拽上下左右查看。
- `效果视频`：内置 60 秒 1080P MP4 效果视频。
- 素材来源：`E:\nvida\厦门工运效果图-高清`，未接入外部素材。

## 启动

```powershell
cd E:\nvida\museum-360-demo
npm install
npm run dev -- --port 5173
```

打开：

```text
http://127.0.0.1:5173
```

## 打包

```powershell
npm run build
```

打包结果在 `dist` 目录。
