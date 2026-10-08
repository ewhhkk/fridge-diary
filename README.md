# 冰箱日记

食材库存 + 到期提醒 + 能做什么菜。纯离线，数据只存在手机浏览器里，不需要服务器和 AI。

## 放到 GitHub Pages

1. GitHub 新建一个仓库，比如 `fridge-diary`，设成 Public
2. 点 **Add file → Upload files**，把这个文件夹里的所有文件拖进去（不要套一层文件夹），Commit
3. 仓库 **Settings → Pages**，Source 选 `Deploy from a branch`，Branch 选 `main` / `(root)`，Save
4. 等一两分钟，地址是 `https://你的用户名.github.io/fridge-diary/`

## 装到手机桌面

- iPhone：用 Safari 打开地址 → 分享 → 添加到主屏幕
- 安卓：用 Chrome 打开 → 菜单 → 添加到主屏幕 / 安装应用

装好之后断网也能打开。第一次打开需要能访问 github.io，国内打不开就多试几次或换个网络。

## 以后更新

改完文件重新上传覆盖，同时把 `sw.js` 第一行末尾的版本号 +1（比如 `v2` 改成 `v3`），手机下次打开就会更新。数据不会丢。

## 注意

- 数据只在这台手机的这个浏览器里。清除浏览器数据、卸载桌面图标都可能清掉数据
- 扫条形码只有安卓 Chrome 支持，iPhone 上可以手动输入条码数字
- 菜谱做法步骤目前只有中文
