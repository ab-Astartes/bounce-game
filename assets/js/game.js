/**
 * 弹跳小球 - 游戏核心逻辑
 * 一个基于HTML5 Canvas的物理弹射游戏
 */

// ===== 游戏配置 =====
const CONFIG = {
    gravity: 0.4,              // 重力
    powerSpeed: 0.5,           // 蓄力基础速度（更慢）
    powerAcceleration: 0.02,   // 蓄力加速度
    maxPower: 100,
    ballRadius: 15,
    platformWidth: 90,         // 平台宽度（适中）
    platformHeight: 20,
    minPlatformGap: 100,       // 最小间距（增大）
    maxPlatformGap: 180,       // 最大间距（增大）
    colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181']
};

// ===== 游戏状态 =====
const GameState = {
    LOADING: 'loading',
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAMEOVER: 'gameover',
    SHOP: 'shop',
    RANKINGS: 'rankings'
};

// ===== 游戏类 =====
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GameState.LOADING;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.combo = 0;
        this.coins = parseInt(localStorage.getItem('coins')) || 100;
        this.unlockedSkins = JSON.parse(localStorage.getItem('unlockedSkins')) || ['ball'];
        this.currentSkin = localStorage.getItem('currentSkin') || 'ball';

        // 游戏对象
        this.ball = null;
        this.platforms = [];
        this.particles = [];
        this.power = 0;
        this.powerVelocity = 0; // 蓄力速度（用于加速度）
        this.isCharging = false;
        this.powerDirection = 1; // 恢复蓄力方向
        this.platformCount = 0; // 记录平台数量，用于难度渐进

        // 角色皮肤配置
        this.skins = {
            ball: { name: '经典球', icon: '🔴', price: 0, color: '#ff6b6b' },
            smile: { name: '笑脸球', icon: '😊', price: 50, color: '#ffd93d' },
            star: { name: '星星球', icon: '⭐', price: 100, color: '#6c5ce7' },
            heart: { name: '爱心球', icon: '💖', price: 150, color: '#fd79a8' },
            fire: { name: '火焰球', icon: '🔥', price: 200, color: '#e17055' },
            ice: { name: '冰霜球', icon: '❄️', price: 250, color: '#74b9ff' }
        };

        this.init();
    }

    // 初始化游戏
    init() {
        this.resizeCanvas();
        this.bindEvents();
        this.loadAssets();
        this.updateUI();
    }

    // 调整画布大小
    resizeCanvas() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    // 绑定事件
    bindEvents() {
        // 窗口大小调整
        window.addEventListener('resize', () => this.resizeCanvas());

        // 触摸/鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.handleInputStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleInputMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleInputEnd(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleInputEnd(e));

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInputStart(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleInputMove(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleInputEnd(e);
        });

        // 按钮事件
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resume-btn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('home-btn').addEventListener('click', () => this.goToMenu());
        document.getElementById('play-again-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('revive-btn').addEventListener('click', () => this.watchAdRevive());
        document.getElementById('share-btn').addEventListener('click', () => this.shareScore());
        document.getElementById('shop-btn').addEventListener('click', () => this.openShop());
        document.getElementById('shop-back-btn').addEventListener('click', () => this.goToMenu());
        document.getElementById('rankings-btn').addEventListener('click', () => this.openRankings());
        document.getElementById('rankings-back-btn').addEventListener('click', () => this.goToMenu());
    }

    // 加载资源
    loadAssets() {
        // 模拟资源加载
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('start-screen').classList.remove('hidden');
            this.state = GameState.MENU;
        }, 500);
    }

    // 处理输入开始
    handleInputStart(e) {
        // 基本状态检查
        if (this.state !== GameState.PLAYING) return;
        if (this.isCharging) return; // 已经在蓄力中
        if (!this.ball) return;

        // 检查小球是否可以发射
        if (this.ball.isMoving) {
            // 小球还在移动，不能蓄力
            console.log('小球还在移动中，无法蓄力');
            return;
        }

        // 检查小球是否稳定在平台上
        if (this.ball.velocity.y !== 0 || this.ball.velocity.x !== 0) {
            // 小球还有速度，不稳定
            console.log('小球速度不为零，无法蓄力', this.ball.velocity);
            return;
        }

        // 所有检查通过，开始蓄力
        console.log('开始蓄力');
        this.isCharging = true;
        this.power = 0;
        this.powerVelocity = CONFIG.powerSpeed; // 初始化速度
        this.powerDirection = 1;
    }

    // 处理输入移动
    handleInputMove(e) {
        // 可以用于瞄准功能
    }

    // 处理输入结束
    handleInputEnd(e) {
        if (this.state !== GameState.PLAYING) return;
        if (!this.isCharging) return;

        // 发射小球
        this.launchBall();
    }

    // 发射小球
    launchBall() {
        if (!this.ball) return;

        // 如果蓄力太小，取消发射（降低阈值从10到3）
        if (this.power < 3) {
            console.log('蓄力太小，取消发射');
            this.isCharging = false;
            this.power = 0;
            this.powerVelocity = CONFIG.powerSpeed;
            this.updatePowerBar();
            return;
        }

        // 发射小球
        console.log('发射小球！蓄力值:', this.power.toFixed(1));
        const angle = -Math.PI / 4; // 45度角
        const velocity = this.power * 0.4;

        this.ball.velocity.x = Math.cos(angle) * velocity;
        this.ball.velocity.y = Math.sin(angle) * velocity;
        this.ball.isMoving = true;

        // 重置蓄力状态
        this.isCharging = false;
        this.power = 0;
        this.powerVelocity = CONFIG.powerSpeed;
        this.updatePowerBar();
    }

    // 开始游戏
    startGame() {
        this.state = GameState.PLAYING;
        this.score = 0;
        this.combo = 0;

        // 隐藏开始界面
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');

        // 创建游戏对象
        this.createBall();
        this.createPlatforms();

        // 开始游戏循环
        this.gameLoop();
    }

    // 创建小球
    createBall() {
        const skin = this.skins[this.currentSkin];
        this.ball = {
            x: 100,
            y: this.canvas.height - 150,
            radius: CONFIG.ballRadius,
            color: skin.color,
            icon: skin.icon,
            velocity: { x: 0, y: 0 },
            isMoving: false,
            isJumping: false
        };
    }

    // 创建平台
    createPlatforms() {
        this.platforms = [];
        this.platformCount = 0;

        // 起始平台
        this.platforms.push({
            x: 50,
            y: this.canvas.height - 100,
            width: CONFIG.platformWidth * 1.5,
            height: CONFIG.platformHeight,
            color: CONFIG.colors[0]
        });
        this.platformCount++;

        // 生成后续平台
        let currentX = 200;
        let currentY = this.canvas.height - 100;

        for (let i = 0; i < 10; i++) {
            const difficulty = this.getDifficulty(i); // 获取当前难度系数
            const gap = this.getPlatformGap(difficulty);
            const heightChange = this.getHeightChange(difficulty);

            currentX += gap;
            currentY += heightChange;
            currentY = Math.max(150, Math.min(this.canvas.height - 100, currentY));

            this.platforms.push({
                x: currentX,
                y: currentY,
                width: CONFIG.platformWidth,
                height: CONFIG.platformHeight,
                color: CONFIG.colors[i % CONFIG.colors.length]
            });
            this.platformCount++;
        }
    }

    // 获取难度系数（0-1，0最简单，1最难）
    getDifficulty(platformIndex) {
        // 前5个平台非常简单，之后逐渐增加难度
        if (platformIndex < 5) return 0.1; // 非常简单
        if (platformIndex < 10) return 0.3; // 简单
        if (platformIndex < 20) return 0.5; // 中等
        if (platformIndex < 30) return 0.7; // 较难
        return 0.9; // 困难
    }

    // 根据难度获取平台间距
    getPlatformGap(difficulty) {
        const minGap = CONFIG.minPlatformGap;
        const maxGap = CONFIG.maxPlatformGap;
        const range = maxGap - minGap;
        // 难度越高，间距越大
        return minGap + range * difficulty;
    }

    // 根据难度获取高度变化
    getHeightChange(difficulty) {
        // 难度越高，高度变化越大
        const maxHeightChange = 80;
        const minHeightChange = 20;
        const range = maxHeightChange - minHeightChange;
        const changeRange = minHeightChange + range * difficulty;

        // 随机方向和大小
        return (Math.random() - 0.5) * changeRange * 2;
    }

    // 游戏主循环
    gameLoop() {
        if (this.state !== GameState.PLAYING) return;

        this.update();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    // 更新游戏状态
    update() {
        // 更新蓄力 - 逐渐加速来回摆动
        if (this.isCharging) {
            // 应用加速度
            this.powerVelocity += CONFIG.powerAcceleration * this.powerDirection;
            // 确保速度在合理范围内
            this.powerVelocity = Math.max(-3, Math.min(3, this.powerVelocity));

            // 更新蓄力值
            this.power += this.powerVelocity;

            // 边界检测和反向
            if (this.power >= CONFIG.maxPower) {
                this.power = CONFIG.maxPower;
                this.powerDirection = -1;
                this.powerVelocity = -CONFIG.powerSpeed; // 重置速度
            } else if (this.power <= 0) {
                this.power = 0;
                this.powerDirection = 1;
                this.powerVelocity = CONFIG.powerSpeed; // 重置速度
            }

            this.updatePowerBar();
        }

        // 更新小球
        if (this.ball && this.ball.isMoving) {
            // 应用重力
            this.ball.velocity.y += CONFIG.gravity;
            this.ball.x += this.ball.velocity.x;
            this.ball.y += this.ball.velocity.y;

            // 检测平台碰撞
            this.checkPlatformCollision();

            // 检测是否掉落
            if (this.ball.y - this.ball.radius > this.canvas.height) {
                this.gameOver();
                return;
            }

            // 检测是否超出右边界
            if (this.ball.x - this.ball.radius > this.canvas.width) {
                this.gameOver();
                return;
            }

            // 生成新平台
            this.generatePlatforms();
        }

        // 更新粒子效果
        this.updateParticles();
    }

    // 检测平台碰撞
    checkPlatformCollision() {
        if (!this.ball) return;

        // 小球不在移动中，不需要检测碰撞
        if (!this.ball.isMoving) return;

        for (let i = 0; i < this.platforms.length; i++) {
            const platform = this.platforms[i];

            // 小球底部和中心位置
            const ballBottom = this.ball.y + this.ball.radius;
            const ballCenter = this.ball.x;

            // 碰撞检测条件
            const hitVertical = ballBottom >= platform.y && ballBottom <= platform.y + 25; // 垂直方向碰撞（增加容错）
            const hitHorizontal = ballCenter >= platform.x && ballCenter <= platform.x + platform.width; // 水平方向在平台内
            const falling = this.ball.velocity.y > 0; // 必须是下落状态

            if (hitVertical && hitHorizontal && falling) {
                // === 碰撞发生，强制重置所有状态 ===

                console.log('碰撞发生！重置状态'); // 调试日志

                // 1. 修正小球位置到平台上方
                this.ball.y = platform.y - this.ball.radius;

                // 2. 强制停止运动
                this.ball.velocity = { x: 0, y: 0 };
                this.ball.isMoving = false;
                this.ball.isJumping = false;

                // 3. 重置蓄力系统
                this.isCharging = false;
                this.power = 0;
                this.powerVelocity = CONFIG.powerSpeed;
                this.powerDirection = 1;
                this.updatePowerBar();

                // 4. 计算得分
                const landingPos = this.ball.x - platform.x;
                const accuracy = 1 - Math.abs(landingPos - platform.width / 2) / (platform.width / 2);
                const points = Math.round(10 + accuracy * 90);

                this.score += points;
                this.combo++;

                // 5. 视觉效果
                this.createParticles(this.ball.x, this.ball.y, platform.color);

                if (this.combo > 1) {
                    this.showCombo();
                }

                // 6. 更新UI
                document.getElementById('current-score').textContent = this.score;

                // 7. 滚动相机
                this.scrollCamera(platform);

                // 8. 碰撞后立即返回，避免重复检测
                return;
            }
        }
    }

    // 滚动相机
    scrollCamera(currentPlatform) {
        // 当小球超过屏幕中间位置时，开始滚动
        const screenCenter = this.canvas.width / 2;

        if (this.ball.x > screenCenter) {
            const offset = this.ball.x - screenCenter;

            // 移动所有平台
            for (let platform of this.platforms) {
                platform.x -= offset;
            }

            // 移动小球
            this.ball.x -= offset;

            // 移除屏幕左侧外的平台
            this.platforms = this.platforms.filter(p => p.x + p.width > -100);
        }
    }

    // 生成新平台
    generatePlatforms() {
        const lastPlatform = this.platforms[this.platforms.length - 1];

        // 当最后一个平台进入屏幕可视范围时，生成新平台
        if (lastPlatform.x < this.canvas.width + 100) {
            const difficulty = this.getDifficulty(this.platformCount);
            const gap = this.getPlatformGap(difficulty);
            const heightChange = this.getHeightChange(difficulty);
            const newY = Math.max(150, Math.min(this.canvas.height - 100, lastPlatform.y + heightChange));

            this.platforms.push({
                x: lastPlatform.x + lastPlatform.width + gap,
                y: newY,
                width: CONFIG.platformWidth,
                height: CONFIG.platformHeight,
                color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)]
            });
            this.platformCount++;
        }
    }

    // 创建粒子效果
    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                radius: Math.random() * 5 + 2,
                color: color,
                life: 1
            });
        }
    }

    // 更新粒子
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;
            particle.life -= 0.02;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 显示连击
    showCombo() {
        const comboEl = document.getElementById('combo-display');
        const comboCountEl = document.getElementById('combo-count');

        // 安全检查：确保元素存在
        if (!comboEl || !comboCountEl) {
            console.warn('连击显示元素未找到');
            return;
        }

        comboCountEl.textContent = this.combo;
        comboEl.classList.remove('hidden');

        setTimeout(() => {
            if (comboEl) {
                comboEl.classList.add('hidden');
            }
        }, 1000);
    }

    // 更新蓄力条
    updatePowerBar() {
        const percentage = (this.power / CONFIG.maxPower) * 100;
        document.getElementById('power-fill').style.width = percentage + '%';
    }

    // 渲染游戏
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制背景
        this.drawBackground();

        // 绘制平台
        this.drawPlatforms();

        // 绘制小球
        this.drawBall();

        // 绘制粒子
        this.drawParticles();

        // 绘制轨迹预测（蓄力时）
        if (this.isCharging && this.ball && !this.ball.isMoving) {
            this.drawTrajectory();
        }

        // 绘制调试信息
        this.drawDebugInfo();
    }

    // 绘制背景
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制平台
    drawPlatforms() {
        for (let platform of this.platforms) {
            // 平台阴影
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(platform.x + 5, platform.y + 5, platform.width, platform.height);

            // 平台本体
            this.ctx.fillStyle = platform.color;
            this.ctx.beginPath();
            this.ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 5);
            this.ctx.fill();

            // 平台高光
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillRect(platform.x + 5, platform.y + 2, platform.width - 10, 3);
        }
    }

    // 绘制小球
    drawBall() {
        if (!this.ball) return;

        // 小球阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x + 3, this.ball.y + 3, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 小球本体
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 小球高光
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - 5, this.ball.y - 5, this.ball.radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制图标
        this.ctx.font = `${this.ball.radius}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.ball.icon, this.ball.x, this.ball.y);
    }

    // 绘制粒子
    drawParticles() {
        for (let particle of this.particles) {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    // 绘制轨迹预测
    drawTrajectory() {
        const angle = -Math.PI / 4;
        const velocity = this.power * 0.4;  // 与实际发射保持一致
        let x = this.ball.x;
        let y = this.ball.y;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        // 使用更多的模拟点数，预测更准确
        for (let i = 0; i < 50; i++) {
            // 与实际物理更新完全相同的顺序
            vy += CONFIG.gravity;
            x += vx;
            y += vy;
            this.ctx.lineTo(x, y);

            // 如果预测到掉出屏幕，停止绘制
            if (y > this.canvas.height + 50) break;
        }

        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 在预测终点画一个标记点
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 绘制调试信息
    drawDebugInfo() {
        if (!this.ball) return;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // 获取当前难度
        const difficulty = this.getDifficulty(this.platformCount);
        const difficultyText = this.getDifficultyText(difficulty);

        const debugInfo = [
            `状态: ${this.state}`,
            `isMoving: ${this.ball.isMoving ? '是' : '否'}`,
            `isCharging: ${this.isCharging ? '是' : '否'}`,
            `平台数: ${this.platformCount}`,
            `难度: ${difficultyText} (${(difficulty * 100).toFixed(0)}%)`,
            `velocity: (${this.ball.velocity.x.toFixed(1)}, ${this.ball.velocity.y.toFixed(1)})`
        ];

        debugInfo.forEach((info, index) => {
            this.ctx.fillText(info, 10, 10 + index * 20);
        });
    }

    // 获取难度文本
    getDifficultyText(difficulty) {
        if (difficulty < 0.2) return '🟢 简单';
        if (difficulty < 0.4) return '🔵 普通';
        if (difficulty < 0.6) return '🟡 中等';
        if (difficulty < 0.8) return '🟠 困难';
        return '🔴 地狱';
    }

    // 游戏结束
    gameOver() {
        this.state = GameState.GAMEOVER;

        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            document.getElementById('new-record').classList.remove('hidden');
        } else {
            document.getElementById('new-record').classList.add('hidden');
        }

        // 显示结束界面
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;

        // 奖励金币
        const earnedCoins = Math.floor(this.score / 10);
        this.coins += earnedCoins;
        localStorage.setItem('coins', this.coins);
    }

    // 看广告复活
    watchAdRevive() {
        // 这里应该集成真实的广告SDK
        // 现在是模拟广告
        alert('模拟广告播放中...\n\n实际项目中这里会显示激励视频广告');

        // 复活
        if (this.ball) {
            this.ball.y = 100;
            this.ball.x = this.platforms[0].x + this.platforms[0].width / 2;
            this.ball.velocity = { x: 0, y: 0 };
            this.ball.isMoving = false;
        }

        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        this.state = GameState.PLAYING;
        this.gameLoop();
    }

    // 分享成绩
    shareScore() {
        const text = `我在《弹跳小球》中获得了 ${this.score} 分！快来挑战我吧！`;

        if (navigator.share) {
            navigator.share({
                title: '弹跳小球',
                text: text
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(text).then(() => {
                alert('成绩已复制到剪贴板，快去分享给好友吧！');
            });
        }
    }

    // 暂停游戏
    pauseGame() {
        this.state = GameState.PAUSED;
        document.getElementById('pause-screen').classList.remove('hidden');
    }

    // 继续游戏
    resumeGame() {
        this.state = GameState.PLAYING;
        document.getElementById('pause-screen').classList.add('hidden');
        this.gameLoop();
    }

    // 重新开始
    restartGame() {
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        this.startGame();
    }

    // 返回菜单
    goToMenu() {
        this.state = GameState.MENU;
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('shop-screen').classList.add('hidden');
        document.getElementById('rankings-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        this.updateUI();
    }

    // 打开商店
    openShop() {
        this.state = GameState.SHOP;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('shop-screen').classList.remove('hidden');
        this.renderShop();
    }

    // 渲染商店
    renderShop() {
        const shopGrid = document.querySelector('.shop-grid');
        shopGrid.innerHTML = '';

        for (let [key, skin] of Object.entries(this.skins)) {
            const isUnlocked = this.unlockedSkins.includes(key);
            const isSelected = this.currentSkin === key;

            const item = document.createElement('div');
            item.className = `shop-item ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
            item.innerHTML = `
                <div class="shop-item-icon">${skin.icon}</div>
                <div class="shop-item-name">${skin.name}</div>
                <div class="shop-item-price">${isUnlocked ? (isSelected ? '已选择' : '点击使用') : `💰 ${skin.price}`}</div>
            `;

            item.addEventListener('click', () => {
                if (isUnlocked) {
                    this.currentSkin = key;
                    localStorage.setItem('currentSkin', key);
                    this.renderShop();
                } else if (this.coins >= skin.price) {
                    if (confirm(`花费 ${skin.price} 金币解锁 ${skin.name}？`)) {
                        this.coins -= skin.price;
                        this.unlockedSkins.push(key);
                        localStorage.setItem('coins', this.coins);
                        localStorage.setItem('unlockedSkins', JSON.stringify(this.unlockedSkins));
                        this.currentSkin = key;
                        localStorage.setItem('currentSkin', key);
                        this.renderShop();
                        this.updateUI();
                    }
                } else {
                    alert('金币不足！');
                }
            });

            shopGrid.appendChild(item);
        }
    }

    // 打开排行榜
    openRankings() {
        this.state = GameState.RANKINGS;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('rankings-screen').classList.remove('hidden');
        this.renderRankings();
    }

    // 渲染排行榜
    renderRankings() {
        const rankingsList = document.querySelector('.rankings-list');
        rankingsList.innerHTML = '';

        // 模拟排行榜数据
        const rankings = [
            { name: '玩家1', score: 1000 },
            { name: '玩家2', score: 800 },
            { name: '玩家3', score: 600 },
            { name: '我', score: this.highScore },
            { name: '玩家5', score: 200 }
        ].sort((a, b) => b.score - a.score);

        rankings.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';
            item.innerHTML = `
                <div class="ranking-rank top-${index + 1}">${index + 1}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${player.name}</div>
                    <div class="ranking-score">${player.score} 分</div>
                </div>
            `;
            rankingsList.appendChild(item);
        });
    }

    // 更新UI
    updateUI() {
        document.getElementById('best-score-display').textContent = this.highScore;
    }
}

// ===== 启动游戏 =====
window.addEventListener('load', () => {
    window.game = new Game();
});
