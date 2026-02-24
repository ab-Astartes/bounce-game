# 🚀 游戏更新部署指南

## 📁 完整文件列表

### 核心文件（必需）
```
bounce-game/
├── index.html                          ✅ 主页面
├── assets/
│   ├── css/
│   │   ├── style.css                  ✅ 主样式
│   │   └── systems.css               ✅ 系统样式
│   ├── js/
│   │   ├── game.js                   ✅ 游戏逻辑（已更新）
│   │   └── systems.js                ✅ 系统功能
│   └── images/                         图片资源目录
```

### 文档文件（可选）
```
├── README.md                          ✅ 项目说明
├── FEATURES-ADDED.md                  ✅ 新功能说明
├── POST-LAUNCH.md                    ✅ 运营指南
├── README-CN.md                       ✅ 中文指南
└── DEPLOY.md                          ✅ 部署说明
```

---

## 🔄 上传更新步骤

### 方案一：GitHub Pages（推荐）

#### 如果之前已经上传过：
1. 打开命令行/终端
2. 进入项目目录：
   ```bash
   cd C:\Users\13631\bounce-game
   ```

3. 查看修改状态：
   ```bash
   git status
   ```

4. 添加所有修改的文件：
   ```bash
   git add .
   ```

5. 提交更新：
   ```bash
   git commit -m "feat: 添加签到、任务、成就、挑战、反馈系统；修复连击和皮肤覆盖问题"
   ```

6. 推送到GitHub：
   ```bash
   git push
   ```

7. 等待1-2分钟，GitHub Pages会自动更新！

---

#### 如果是第一次上传：
1. 打开 https://github.com
2. 登录后点击右上角 `+` → `New repository`
3. 仓库名称：`bounce-game`
4. 选择 `Public`（公开）
5. 勾选 `Add a README file`
6. 点击 `Create repository`

7. 然后打开命令行：
   ```bash
   cd C:\Users\13631\bounce-game
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/bounce-game.git
   git push -u origin main
   ```

8. 进入仓库 Settings → Pages
9. Source 选择 `main` branch
10. 点击 Save

---

### 方案二：Vercel（最快速）

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 `New Project`
4. 选择 `Import`
5. 输入仓库地址或直接拖拽 `C:\Users\13631\bounce-game` 文件夹
6. 点击 `Deploy`
7. 等待1-2分钟，完成！

---

### 方案三：Netlify（拖拽上传）

1. 访问 https://netlify.com
2. 登录后，在首页找到 `Want to deploy a new site without connecting to Git?`
3. 拖拽 `bounce-game` 文件夹到页面
4. 等待上传完成

**更新方法：**
- 直接拖拽替换，覆盖旧文件
- Netlify 会自动更新

---

## ✅ 最新更新内容

### 🎮 新增功能
- ✅ 每日签到系统（连续签到奖励递增）
- ✅ 每日任务系统（4个任务，每日刷新）
- ✅ 成就系统（8个成就可解锁）
- ✅ 排行榜系统（记录前100名）
- ✅ 挑战系统（创建挑战，分享给好友）
- ✅ 反馈系统（4种反馈类型）
- ✅ 金币系统（签到、任务、成就获取）

### 🐛 Bug修复
- ✅ 菜单按钮可滚动（修复按钮过多无法查看）
- ✅ 弹窗自动清除（修复返回后弹窗遮挡）
- ✅ 皮肤完全覆盖（智能缩放算法）
- ✅ 连击正确增加（成功落地+1，失败清零）
- ✅ 蓄力条逐渐加速（慢→快循环）

### 🎨 UI优化
- ✅ 响应式菜单布局
- ✅ 按钮自动换行
- ✅ 优雅的滚动条样式
- ✅ 调试信息显示（左上角）

---

## 📊 版本信息

**当前版本：** v1.1.0
**更新日期：** 2025-02-24
**更新内容：** 添加6大系统 + 多项优化

---

## 🎯 上传后检查清单

- [ ] 游戏能正常打开
- [ ] 菜单按钮可以滚动查看
- [ ] 签到功能正常
- [ ] 任务显示正常
- [ ] 成就显示正常
- [ ] 挑战创建正常
- [ ] 反馈弹窗正常
- [ ] 皮肤完全覆盖小球
- [ ] 连击正确增加
- [ ] 游戏难度渐进

---

## 🚨 常见问题

### Q1: 上传后还是旧版本？
A:
- GitHub Pages: 可能需要等待5-10分钟
- Vercel/Netlify: 应该立即生效
- 尝试硬刷新：Ctrl + F5

### Q2: 菜单还是无法滚动？
A:
- 清除浏览器缓存
- 硬刷新：Ctrl + Shift + R
- 检查 network 面板，确认 CSS 文件已更新

### Q3: 如何查看更新是否生效？
A:
1. 打开开发者工具（F12）
2. 进入 Console
3. 输入：`localStorage.clear()` 清空缓存
4. 刷新页面

---

## 💡 快速上传命令

### 一次性上传所有修改
```bash
cd C:\Users\13631\bounce-game
git add .
git commit -m "更新：添加完整系统，修复所有bug"
git push
```

### 查看上传状态
```bash
git log --oneline -5
```

---

## 🎉 更新完成标志

当你看到以下内容，说明更新成功：

1. ✅ 菜单按钮可以上下滚动
2. ✅ 看到"每日签到"按钮在顶部
3. ✅ 看到金币显示
4. ✅ 所有6个系统按钮都可以点击
5. ✅ 皮肤图标完全覆盖小球

---

**准备好了吗？现在就上传吧！** 🚀
