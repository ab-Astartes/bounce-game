/**
 * 游戏系统管理
 * 包含：每日任务、成就、签到、排行榜、反馈、挑战
 */

class GameSystems {
    constructor(game) {
        this.game = game;

        // 加载保存的数据
        this.data = this.loadData();

        // 初始化系统
        this.initDailyTasks();
        this.initAchievements();
        this.initSignIn();
        this.initLeaderboard();
        this.initChallenges();
    }

    // ===== 数据管理 =====
    loadData() {
        const saved = localStorage.getItem('gameSystemsData');
        if (saved) {
            return JSON.parse(saved);
        }

        // 默认数据
        return {
            signIn: {
                lastSignInDate: null,
                consecutiveDays: 0,
                totalSignInDays: 0,
                claimedRewards: []
            },
            tasks: {
                date: null,
                completed: [],
                claimed: []
            },
            achievements: {
                unlocked: [],
                claimed: []
            },
            stats: {
                totalGames: 0,
                totalScore: 0,
                maxPlatforms: 0,
                maxCombo: 0,
                totalPlayTime: 0
            },
            challenges: {
                completed: [],
                sent: [],
                received: []
            }
        };
    }

    saveData() {
        localStorage.setItem('gameSystemsData', JSON.stringify(this.data));
    }

    // ===== 签到系统 =====
    initSignIn() {
        // 检查是否需要重置连续签到（跨天）
        const today = this.getToday();
        const lastDate = this.data.signIn.lastSignInDate;

        if (lastDate && lastDate !== today) {
            const yesterday = this.getYesterday();
            if (lastDate !== yesterday) {
                // 中断了，重置连续天数
                this.data.signIn.consecutiveDays = 0;
            }
        }

        this.updateSignInUI();
    }

    getToday() {
        return new Date().toISOString().split('T')[0];
    }

    getYesterday() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split('T')[0];
    }

    signIn() {
        const today = this.getToday();

        // 检查今天是否已签到
        if (this.data.signIn.lastSignInDate === today) {
            return { success: false, message: '今天已经签到过了' };
        }

        // 签到成功
        this.data.signIn.lastSignInDate = today;
        this.data.signIn.consecutiveDays++;
        this.data.signIn.totalSignInDays++;

        // 计算奖励
        const reward = this.calculateSignInReward(this.data.signIn.consecutiveDays);
        this.game.coins += reward.coins;

        this.saveData();
        this.updateSignInUI();

        return {
            success: true,
            message: `签到成功！获得 ${reward.coins} 金币`,
            reward: reward
        };
    }

    calculateSignInReward(days) {
        // 连续签到奖励递增
        const baseReward = 10;
        const bonus = Math.min(days * 5, 100); // 最多加100
        const totalCoins = baseReward + bonus;

        // 特殊奖励
        let specialReward = null;
        if (days === 7) {
            specialReward = { type: 'skin', id: 'special', name: '连续签到7天奖励' };
        } else if (days === 30) {
            specialReward = { type: 'skin', id: 'premium', name: '连续签到30天奖励' };
        }

        return { coins: totalCoins, special: specialReward };
    }

    updateSignInUI() {
        const today = this.getToday();
        const signedIn = this.data.signIn.lastSignInDate === today;
        const days = this.data.signIn.consecutiveDays;

        const signInBtn = document.getElementById('signin-btn');
        const signInStatus = document.getElementById('signin-status');
        const signInReward = document.getElementById('signin-reward');

        if (signInBtn) {
            if (signedIn) {
                signInBtn.textContent = '✅ 已签到';
                signInBtn.disabled = true;
            } else {
                signInBtn.textContent = '📅 立即签到';
                signInBtn.disabled = false;
            }
        }

        if (signInStatus) {
            signInStatus.textContent = `已连续签到 ${days} 天`;
        }

        if (signInReward) {
            const nextReward = this.calculateSignInReward(days + 1);
            signInReward.textContent = `下次签到：+${nextReward.coins} 金币`;
        }
    }

    // ===== 每日任务系统 =====
    initDailyTasks() {
        // 检查是否需要刷新每日任务
        const today = this.getToday();
        if (this.data.tasks.date !== today) {
            this.refreshDailyTasks();
        }

        this.updateTasksUI();
    }

    refreshDailyTasks() {
        const today = this.getToday();
        this.data.tasks.date = today;
        this.data.tasks.completed = [];
        this.data.tasks.claimed = [];
        this.saveData();
    }

    getDailyTasks() {
        return [
            {
                id: 'play_3_games',
                name: '进行3次游戏',
                description: '完成3局游戏',
                target: 3,
                reward: 50,
                icon: '🎮'
            },
            {
                id: 'reach_10_platforms',
                name: '跳过10个平台',
                description: '单局跳过10个平台',
                target: 10,
                reward: 30,
                icon: '🎯'
            },
            {
                id: 'score_500',
                name: '获得500分',
                description: '单局得分达到500',
                target: 500,
                reward: 40,
                icon: '⭐'
            },
            {
                id: 'combo_3',
                name: '达成3连击',
                description: '单局达成3连击',
                target: 3,
                reward: 20,
                icon: '💥'
            }
        ];
    }

    updateTaskProgress(taskId, progress) {
        if (!this.data.tasks.completed.includes(taskId)) {
            const task = this.getDailyTasks().find(t => t.id === taskId);
            if (task && progress >= task.target) {
                this.data.tasks.completed.push(taskId);
                this.saveData();
                this.updateTasksUI();

                // 显示通知
                this.showNotification(`任务完成：${task.name}`);
            }
        }
    }

    claimTaskReward(taskId) {
        if (this.data.tasks.completed.includes(taskId) && !this.data.tasks.claimed.includes(taskId)) {
            const task = this.getDailyTasks().find(t => t.id === taskId);
            if (task) {
                this.game.coins += task.reward;
                this.data.tasks.claimed.push(taskId);
                this.saveData();
                this.updateTasksUI();

                this.showNotification(`获得 ${task.reward} 金币`);
                return true;
            }
        }
        return false;
    }

    updateTasksUI() {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) return;

        tasksList.innerHTML = '';
        const tasks = this.getDailyTasks();

        tasks.forEach(task => {
            const isCompleted = this.data.tasks.completed.includes(task.id);
            const isClaimed = this.data.tasks.claimed.includes(task.id);

            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${isCompleted ? 'completed' : ''} ${isClaimed ? 'claimed' : ''}`;
            taskEl.innerHTML = `
                <div class="task-icon">${task.icon}</div>
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-desc">${task.description}</div>
                    <div class="task-reward">奖励: ${task.reward} 金币</div>
                </div>
                <button class="task-claim-btn"
                    onclick="window.game.systems.claimTaskReward('${task.id}')"
                    ${!isCompleted || isClaimed ? 'disabled' : ''}>
                    ${isClaimed ? '已领取' : isCompleted ? '领取' : '未完成'}
                </button>
            `;
            tasksList.appendChild(taskEl);
        });
    }

    // ===== 成就系统 =====
    initAchievements() {
        this.updateAchievementsUI();
    }

    getAchievements() {
        return [
            {
                id: 'first_game',
                name: '初出茅庐',
                description: '完成第1局游戏',
                condition: (stats) => stats.totalGames >= 1,
                reward: 10,
                icon: '🌱'
            },
            {
                id: 'play_10_games',
                name: '游戏爱好者',
                description: '完成10局游戏',
                condition: (stats) => stats.totalGames >= 10,
                reward: 50,
                icon: '🎮'
            },
            {
                id: 'score_1000',
                name: '千分达成',
                description: '单局得分达到1000',
                condition: (stats) => stats.maxScore >= 1000,
                reward: 100,
                icon: '🏆'
            },
            {
                id: 'platforms_50',
                name: '跳跃大师',
                description: '累计跳过50个平台',
                condition: (stats) => stats.totalPlatforms >= 50,
                reward: 80,
                icon: '🦘'
            },
            {
                id: 'combo_5',
                name: '连击高手',
                description: '达成5连击',
                condition: (stats) => stats.maxCombo >= 5,
                reward: 60,
                icon: '💥'
            },
            {
                id: 'play_100_games',
                name: '资深玩家',
                description: '完成100局游戏',
                condition: (stats) => stats.totalGames >= 100,
                reward: 200,
                icon: '👑'
            },
            {
                id: 'score_5000',
                name: '分数王者',
                description: '单局得分达到5000',
                condition: (stats) => stats.maxScore >= 5000,
                reward: 500,
                icon: '💎'
            },
            {
                id: 'sign_in_7',
                name: '坚持签到',
                description: '连续签到7天',
                condition: (stats) => this.data.signIn.consecutiveDays >= 7,
                reward: 150,
                icon: '📅'
            }
        ];
    }

    checkAchievements() {
        const achievements = this.getAchievements();
        let newUnlock = false;

        achievements.forEach(achievement => {
            if (!this.data.achievements.unlocked.includes(achievement.id)) {
                if (achievement.condition(this.data.stats)) {
                    this.data.achievements.unlocked.push(achievement.id);
                    newUnlock = true;
                    this.showNotification(`🏆 解锁成就：${achievement.name}`);
                }
            }
        });

        if (newUnlock) {
            this.saveData();
            this.updateAchievementsUI();
        }
    }

    claimAchievementReward(achievementId) {
        if (this.data.achievements.unlocked.includes(achievementId) &&
            !this.data.achievements.claimed.includes(achievementId)) {
            const achievement = this.getAchievements().find(a => a.id === achievementId);
            if (achievement) {
                this.game.coins += achievement.reward;
                this.data.achievements.claimed.push(achievementId);
                this.saveData();
                this.updateAchievementsUI();

                this.showNotification(`获得 ${achievement.reward} 金币`);
                return true;
            }
        }
        return false;
    }

    updateAchievementsUI() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;

        achievementsList.innerHTML = '';
        const achievements = this.getAchievements();

        achievements.forEach(achievement => {
            const isUnlocked = this.data.achievements.unlocked.includes(achievement.id);
            const isClaimed = this.data.achievements.claimed.includes(achievement.id);

            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${isClaimed ? 'claimed' : ''}`;
            achievementEl.innerHTML = `
                <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    <div class="achievement-reward">奖励: ${achievement.reward} 金币</div>
                </div>
                <button class="achievement-claim-btn"
                    onclick="window.game.systems.claimAchievementReward('${achievement.id}')"
                    ${!isUnlocked || isClaimed ? 'disabled' : ''}>
                    ${isClaimed ? '已领取' : isUnlocked ? '领取' : '未解锁'}
                </button>
            `;
            achievementsList.appendChild(achievementEl);
        });
    }

    // ===== 排行榜系统 =====
    initLeaderboard() {
        // 使用 localStorage 模拟排行榜
        // 实际项目中应该使用服务器
        this.updateLeaderboardUI();
    }

    saveScore(score, platforms) {
        const entry = {
            name: this.getPlayerName(),
            score: score,
            platforms: platforms,
            date: new Date().toISOString()
        };

        let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        leaderboard.push(entry);

        // 排序并保留前100名
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 100);

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        this.updateLeaderboardUI();
    }

    getPlayerName() {
        let name = localStorage.getItem('playerName');
        if (!name) {
            name = '玩家' + Math.floor(Math.random() * 10000);
            localStorage.setItem('playerName', name);
        }
        return name;
    }

    setPlayerName(name) {
        localStorage.setItem('playerName', name);
        this.updateLeaderboardUI();
    }

    getLeaderboard() {
        return JSON.parse(localStorage.getItem('leaderboard') || '[]');
    }

    updateLeaderboardUI() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;

        const leaderboard = this.getLeaderboard();
        const playerName = this.getPlayerName();

        leaderboardList.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const isPlayer = entry.name === playerName;
            const item = document.createElement('div');
            item.className = `leaderboard-item ${isPlayer ? 'player' : ''}`;
            item.innerHTML = `
                <div class="rank rank-${index + 1}">${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">${entry.name}</div>
                    <div class="player-score">${entry.score} 分</div>
                </div>
            `;
            leaderboardList.appendChild(item);
        });
    }

    // ===== 挑战系统 =====
    initChallenges() {
        this.updateChallengesUI();
    }

    createChallenge(targetScore) {
        const challenge = {
            id: Date.now(),
            challenger: this.getPlayerName(),
            targetScore: targetScore,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // 生成挑战链接/码
        const challengeCode = btoa(JSON.stringify(challenge));

        return {
            challenge: challenge,
            code: challengeCode,
            shareText: `🎮 ${this.getPlayerName()} 向你发起挑战！\n目标：得分超过 ${targetScore}\n接受挑战：${window.location.href}?challenge=${challengeCode}`
        };
    }

    acceptChallenge(challengeCode) {
        try {
            const challenge = JSON.parse(atob(challengeCode));
            this.game.challengeMode = {
                targetScore: challenge.targetScore,
                challenger: challenge.challenger,
                challengeId: challenge.id
            };

            this.showNotification(`挑战目标：得分超过 ${challenge.targetScore}`);
            return true;
        } catch (e) {
            console.error('Invalid challenge code', e);
            return false;
        }
    }

    completeChallenge(success) {
        if (this.game.challengeMode) {
            const result = {
                id: this.game.challengeMode.challengeId,
                success: success,
                score: this.game.score,
                player: this.getPlayerName(),
                completedAt: new Date().toISOString()
            };

            this.data.challenges.completed.push(result);
            this.saveData();

            delete this.game.challengeMode;

            if (success) {
                this.showNotification('🎉 挑战成功！获得额外奖励！');
                this.game.coins += 100;
            } else {
                this.showNotification('挑战失败，再接再厉！');
            }

            this.updateChallengesUI();
        }
    }

    updateChallengesUI() {
        const challengesList = document.getElementById('challenges-list');
        if (!challengesList) return;

        const completed = this.data.challenges.completed.slice(-5); // 显示最近5个
        challengesList.innerHTML = '';

        if (completed.length === 0) {
            challengesList.innerHTML = '<p class="empty-text">暂无挑战记录</p>';
            return;
        }

        completed.forEach(challenge => {
            const item = document.createElement('div');
            item.className = `challenge-item ${challenge.success ? 'success' : 'failed'}`;
            item.innerHTML = `
                <div class="challenge-icon">${challenge.success ? '🏆' : '❌'}</div>
                <div class="challenge-info">
                    <div class="challenge-target">目标: ${challenge.targetScore} 分</div>
                    <div class="challenge-result">你的得分: ${challenge.score}</div>
                </div>
            `;
            challengesList.appendChild(item);
        });
    }

    // ===== 反馈系统 =====
    submitFeedback(type, content) {
        // 实际项目中应该发送到服务器
        // 这里使用 console.log 和 localStorage
        const feedback = {
            type: type,
            content: content,
            timestamp: new Date().toISOString(),
            player: this.getPlayerName(),
            stats: { ...this.data.stats }
        };

        // 保存到本地
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

        console.log('反馈已提交：', feedback);
        this.showNotification('感谢您的反馈！');

        return true;
    }

    showFeedbackForm() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>📝 提交反馈</h2>
                <div class="feedback-form">
                    <div class="form-group">
                        <label>反馈类型：</label>
                        <select id="feedback-type">
                            <option value="bug">🐛 Bug报告</option>
                            <option value="suggestion">💡 功能建议</option>
                            <option value="difficulty">🎯 难度反馈</option>
                            <option value="other">📧 其他</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>详细描述：</label>
                        <textarea id="feedback-content" rows="5" placeholder="请详细描述您的反馈..."></textarea>
                    </div>
                    <div class="form-buttons">
                        <button onclick="window.game.systems.submitFeedbackFromForm()">提交反馈</button>
                        <button onclick="this.closest('.modal-overlay').remove()">取消</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    submitFeedbackFromForm() {
        const type = document.getElementById('feedback-type').value;
        const content = document.getElementById('feedback-content').value;

        if (!content.trim()) {
            alert('请输入反馈内容');
            return;
        }

        this.submitFeedback(type, content);
        document.querySelector('.modal-overlay').remove();
    }

    // 复制挑战链接
    copyChallengeLink() {
        const linkElement = document.getElementById('challenge-link');
        linkElement.select();
        document.execCommand('copy');
        this.showNotification('链接已复制到剪贴板！');
    }

    // ===== 游戏事件追踪 =====
    trackGameEvent(event, data) {
        // 更新统计数据
        switch(event) {
            case 'game_start':
                this.data.stats.totalGames++;
                break;
            case 'game_over':
                if (data.score > this.data.stats.maxScore) {
                    this.data.stats.maxScore = data.score;
                }
                if (data.platforms > this.data.stats.maxPlatforms) {
                    this.data.stats.maxPlatforms = data.platforms;
                }
                this.data.stats.totalScore += data.score;
                this.saveData();

                // 保存分数到排行榜
                this.saveScore(data.score, data.platforms);

                // 检查成就
                this.checkAchievements();

                // 检查挑战
                if (this.game.challengeMode) {
                    this.completeChallenge(data.score >= this.game.challengeMode.targetScore);
                }
                break;
            case 'platform_land':
                // 更新每日任务进度
                this.updateTaskProgress('reach_10_platforms', data.totalPlatforms);
                break;
            case 'score_milestone':
                // 更新每日任务进度
                this.updateTaskProgress('score_500', data.score);
                this.updateTaskProgress('score_1000', data.score);
                break;
            case 'combo':
                if (data.combo > this.data.stats.maxCombo) {
                    this.data.stats.maxCombo = data.combo;
                }
                this.updateTaskProgress('combo_3', data.combo);
                break;
            case 'play_game':
                // 更新每日任务：进行3次游戏
                const playCount = this.data.tasks.completed.filter(t => t === 'play_3_games_temp').length || 0;
                this.updateTaskProgress('play_3_games', playCount + 1);
                break;
        }

        this.saveData();
    }

    // ===== 通用功能 =====
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
