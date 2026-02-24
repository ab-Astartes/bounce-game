# 🚀 游戏部署完整指南

## 方案一：GitHub Pages 部署（100%免费，推荐）

### 步骤1：创建GitHub账号
1. 访问 https://github.com
2. 点击 Sign up 创建账号
3. 验证邮箱

### 步骤2：创建新仓库
1. 点击右上角 + → New repository
2. 仓库名称填写：`bounce-game`
3. 选择 Public（公开）
4. 勾选 Add a README file
5. 点击 Create repository

### 步骤3：上传游戏文件

#### 方法A：网页上传（简单）
1. 在仓库页面点击 Add file → Upload files
2. 拖拽以下文件到页面：
   - `index.html`
   - `assets/` 文件夹（包含所有子文件）
   - `README.md`
3. 填写提交信息
4. 点击 Commit changes

#### 方法B：Git命令上传（推荐）
```bash
# 1. 安装Git（如果未安装）
# 访问 https://git-scm.com/downloads 下载安装

# 2. 在游戏目录打开命令行
cd C:\Users\13631\bounce-game

# 3. 初始化Git仓库
git init

# 4. 添加所有文件
git add .

# 5. 提交更改
git commit -m "Initial commit"

# 6. 关联远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/bounce-game.git

# 7. 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤4：启用GitHub Pages
1. 进入仓库页面
2. 点击 Settings
3. 左侧菜单找到 Pages
4. 在 Source 下选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击 Save

### 步骤5：获取游戏链接
等待1-2分钟后，刷新页面，顶部会显示：
```
Your site is live at https://YOUR_USERNAME.github.io/bounce-game/
```

点击这个链接，你的游戏就上线了！🎉

---

## 方案二：Vercel 部署（100%免费，速度更快）

### 步骤1：注册Vercel
1. 访问 https://vercel.com
2. 点击 Sign Up
3. 使用GitHub账号登录

### 步骤2：导入项目
1. 点击 New Project
2. 选择你的 `bounce-game` 仓库
3. 点击 Import

### 步骤3：配置项目
- Framework Preset: Other
- Root Directory: `./`
- Build Command: 留空
- Output Directory: `./`
- 点击 Deploy

### 步骤4：获取链接
部署完成后，Vercel会提供一个链接：
```
https://bounce-game.vercel.app
```

---

## 方案三：Netlify 部署（拖拽部署，最简单）

### 步骤1：注册Netlify
1. 访问 https://netlify.com
2. 点击 Sign up

### 步骤2：拖拽部署
1. 登录后，在首页找到 "Want to deploy a new site without connecting to Git?"
2. 点击 Browse（或直接拖拽 `bounce-game` 文件夹）
3. 选择 `C:\Users\13631\bounce-game` 文件夹
4. 等待上传完成

### 步骤3：修改域名（可选）
1. 进入 Site settings
2. 点击 Change site name
3. 输入你想要的域名
4. 点击 Save

---

## 📊 部署后检查清单

- [ ] 游戏可以正常打开
- [ ] 在手机浏览器中测试
- [ ] 在不同浏览器中测试（Chrome、Firefox、Safari）
- [ ] 检查所有按钮是否工作
- [ ] 检查分数保存功能
- [ ] 检查商店系统

---

## 🌐 推广游戏

### 1. 社交媒体
- 发到朋友圈、微信群
- 录制游戏视频发抖音
- 在小红书分享

### 2. 游戏平台
- **4399小游戏** - 提交H5游戏
- **7k7k小游戏** - 提交H5游戏
- **CrazyGames** - 国际平台
- ** itch.io** - 独立游戏平台

### 3. SEO优化
在 `index.html` 中修改：
```html
<meta name="description" content="你的游戏描述">
<meta name="keywords" content="弹跳,小游戏,休闲游戏">
```

---

## 💰 开始赚钱

### 第一周：测试期
1. 观察玩家数据
2. 收集反馈
3. 优化游戏体验

### 第二周：接入广告
1. 注册广告平台账号
2. 创建广告位
3. 集成SDK（参考 README.md）

### 第三周：推广
1. 分享到各大平台
2. 邀请好友玩
3. 投放少量广告（可选）

### 第四周：优化迭代
1. 分析数据
2. 更新内容
3. 增加新功能

---

## 📞 获取帮助

如有问题，可以：
1. 查看 README.md
2. 搜索相关问题
3. 在GitHub提Issue
