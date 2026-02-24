@echo off
echo ========================================
echo   弹跳小球 - 快速更新脚本
echo ========================================
echo.
echo 正在检查文件...
echo.

cd /d "%~dp0"

REM 检查是否存在git仓库
if exist ".git" (
    echo [1/5] Git仓库已存在
    echo.
) else (
    echo [1/5] 初始化Git仓库...
    git init
    echo.
)

REM 检查是否有修改
echo [2/5] 检查文件修改...
git status
echo.

echo [3/5] 添加所有修改...
git add .
echo.

echo [4/5] 提交更新...
git commit -m "feat: 添加签到/任务/成就/挑战/反馈系统，修复连击和皮肤覆盖问题"
echo.

echo [5/5] 推送到GitHub...
echo.
echo 请选择上传方式：
echo.
echo 1. GitHub Pages - 推荐，免费托管
echo 2. Vercel      - 最快，自动部署
echo 3. Netlify     - 拖拽上传
echo.
set /p choice="请输入选项 (1-3): "

if "%choice%"=="1" (
    echo.
    echo 推送到 GitHub Pages...
    git push
    echo.
    echo ========================================
    echo   上传完成！
    echo ========================================
    echo.
    echo 游戏链接：https://你的用户名.github.io/bounce-game/
    echo.
    echo 请等待1-2分钟让GitHub Pages更新...
) else if "%choice%"=="2" (
    echo.
    echo 正在打开 Vercel...
    start https://vercel.com/new
    echo.
    echo 在 Vercel 页面：
    echo 1. 点击 "Import"
    echo 2. 拖拽此文件夹到页面
    echo 3. 点击 "Deploy"
) else if "%choice%"=="3" (
    echo.
    echo 正在打开 Netlify...
    start https://netlify.com
    echo.
    echo 在 Netlify 页面：
    echo 1. 拖拽此文件夹到页面
    echo 2. 等待上传完成
)

echo.
pause
