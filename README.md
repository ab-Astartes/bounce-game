# 🎱 弹跳小球 - 趣味休闲游戏

一款基于HTML5 Canvas的物理弹射小游戏，支持网页和移动端游玩。

![游戏截图](https://via.placeholder.com/400x300/667eea/ffffff?text=弹跳小球)

## ✨ 游戏特色

- 🎯 **简单易上手** - 单指操作，3秒上手
- 🎨 **精美画面** - 渐变色彩，流畅动画
- 💎 **多样皮肤** - 6种角色皮肤可解锁
- 🏆 **排行榜** - 挑战历史最高分
- 💰 **虚拟商店** - 赚取金币解锁道具
- 📱 **响应式设计** - 完美适配手机和电脑

## 🎮 玩法说明

1. **按住屏幕** 蓄力
2. **松开** 发射小球
3. **跳到平台** 得分
4. **连续跳跃** 获得连击加分

## 🚀 本地运行

1. 下载游戏文件
2. 用浏览器打开 `index.html`
3. 开始游戏！

## 🌐 在线部署

### GitHub Pages（推荐，免费）

1. 创建GitHub账号：https://github.com
2. 创建新仓库（命名为 `bounce-game`）
3. 上传所有游戏文件到仓库
4. 进入仓库 Settings → Pages
5. 在 Source 选择 `main` branch
6. 点击 Save
7. 几分钟后，游戏会发布在：`https://你的用户名.github.io/bounce-game/`

### Vercel（推荐，免费）

1. 访问 https://vercel.com
2. 用GitHub账号登录
3. 导入游戏仓库
4. 自动部署完成

### Netlify（推荐，免费）

1. 访问 https://netlify.com
2. 拖拽游戏文件夹到页面
3. 自动部署完成

## 💰 变现指南

### 广告变现

#### 微信广告（中国区）
1. 注册微信小程序：https://mp.weixin.qq.com
2. 申请微信广告
3. 集成广告SDK
4. 在 `game.js` 的 `watchAdRevive()` 函数中调用广告API

#### Google AdMob（国际区）
1. 注册AdMob账号
2. 创建广告单元
3. 集成AdMob SDK
4. 实现激励视频和横幅广告

#### 穿山甲（中国区）
1. 注册穿山甲账号
2. 创建应用和广告位
3. 集成SDK到H5
4. 调用广告API

### 内购变现

1. **微信支付** - 适用于微信小程序
2. **支付宝** - 适用于网页H5
3. **第三方支付** - 如Ping++、Stripe

在 `game.js` 的商店系统中，已经预留了支付接口。

## 📊 游戏数据统计

推荐接入：
- **Google Analytics** - 免费
- **友盟统计** - 中国区
- **Firebase Analytics** - Google出品

## 🎨 自定义配置

在 `game.js` 的 `CONFIG` 对象中可以修改：
- 重力加速度
- 平台大小和间距
- 小球大小
- 颜色主题

## 📱 分发渠道

### 中国市场
- 微信小游戏（需转换为小程序）
- 抖音小游戏
- QQ小游戏
- 快手小游戏
- H5游戏平台（如4399、7k7k）

### 国际市场
- Google Play（需打包为APK）
- Apple App Store（需打包为iOS）
- Facebook Instant Games
- CrazyGames
- Poki

## 🛠️ 技术栈

- HTML5 Canvas - 游戏渲染
- 原生JavaScript - 游戏逻辑
- CSS3 - 界面样式
- LocalStorage - 数据存储

## 📝 版权说明

本游戏由AI辅助开发，可供学习和商业使用。

---

**开始赚钱吧！** 💰
