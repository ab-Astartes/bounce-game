/**
 * 广告和分析工具集成示例
 *
 * 使用方法：
 * 1. 在 index.html 中引入此文件
 * 2. 按照下面的说明配置各个平台
 * 3. 取消注释相关代码
 */

// ===== Google Analytics 分析统计 =====

/**
 * 步骤1：注册Google Analytics
 * 1. 访问 https://analytics.google.com
 * 2. 创建账号和媒体资源
 * 3. 获取跟踪 ID（格式：UA-XXXXXXXXX-X 或 G-XXXXXXXXXX）
 *
 * 步骤2：在 index.html 的 <head> 中添加：
 * <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
 * <script>
 *   window.dataLayer = window.dataLayer || [];
 *   function gtag(){dataLayer.push(arguments);}
 *   gtag('js', new Date());
 *   gtag('config', 'GA_MEASUREMENT_ID');
 * </script>
 */

// 游戏事件跟踪示例
function trackGameEvent(eventName, parameters) {
    // Google Analytics 事件
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// 使用示例：
// 游戏开始
trackGameEvent('game_start', {
    level: 1,
    skin: window.game.currentSkin
});

// 游戏结束
trackGameEvent('game_over', {
    score: window.game.score,
    combo: window.game.combo
});

// 解锁皮肤
trackGameEvent('skin_unlocked', {
    skin_name: 'smile',
    coins_spent: 50
});


// ===== 微信广告集成（中国区）=====

/**
 * 步骤1：注册微信小程序
 * 1. 访问 https://mp.weixin.qq.com
 * 2. 注册小程序账号
 * 3. 完成认证
 *
 * 步骤2：申请广告位
 * 1. 进入小程序后台
 * 2. 流量主 → 广告位管理
 * 3. 创建激励视频广告位
 * 4. 获取广告位 ID
 */

// 激励视频广告示例（微信小程序）
let rewardedVideoAd = null;

function initWeChatAd(adUnitId) {
    if (typeof wx === 'undefined') return;

    // 创建激励视频广告实例
    rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: adUnitId
    });

    // 监听广告关闭事件
    rewardedVideoAd.onClose((status) => {
        if (status && status.isEnded) {
            // 用户看完广告，给予奖励
            window.game.revivePlayer();
        } else {
            // 用户中途退出，不给奖励
            alert('看完广告才能复活哦！');
        }
    });
}

// 显示激励视频广告
function showRewardedVideo() {
    if (rewardedVideoAd) {
        rewardedVideoAd.show().catch(err => {
            // 广告加载失败，处理错误
            console.error('广告加载失败', err);
        });
    }
}

// 在 game.js 的 watchAdRevive() 函数中调用：
// showRewardedVideo();


// ===== Google AdMob 集成（国际区）=====

/**
 * 注意：AdMob 主要用于移动应用，H5 需要使用 Cordova 等框架打包
 * 推荐使用 H5 游戏广告平台：Tapdaq、ironSource
 */

// H5 广告平台示例（ironSource）
function initIronSource(appKey) {
    // 初始化 ironSource SDK
    // 需要先在页面中加载 ironSource SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.ironsrc.com/iron-source.js';
    document.head.appendChild(script);

    script.onload = () => {
        // SDK 加载完成，初始化
        // ironsdk.init(appKey);
    };
}

// 显示激励视频
function showIronSourceReward() {
    // ironsdk.showRewardVideo({
    //     callback: (result) => {
    //         if (result.completed) {
    //             window.game.revivePlayer();
    //         }
    //     }
    // });
}


// ===== 穿山甲广告集成（中国区）=====

/**
 * 步骤1：注册穿山甲
 * 1. 访问 https://www.pangolin-sdk-toutiao.com
 * 2. 注册开发者账号
 * 3. 创建应用和广告位
 *
 * 步骤2：集成SDK
 * 1. 在H5中引入穿山甲JS SDK
 * 2. 配置广告位ID
 */

// 穿山甲激励视频示例
let pangolinRewardAd = null;

function initPangolinAd(codeId) {
    // 初始化穿山甲SDK
    // pangolin.init({
    //     app_id: 'YOUR_APP_ID'
    // });

    // 创建激励视频广告
    // pangolinRewardAd = pangolin.createRewardVideoAd({
    //     code_id: codeId
    // });

    // 监听广告关闭
    // pangolinRewardAd.onClose((res) => {
    //     if (res.isEnded) {
    //         window.game.revivePlayer();
    //     }
    // });
}

function showPangolinReward() {
    if (pangolinRewardAd) {
        // pangolinRewardAd.show().catch(err => {
        //     console.error('广告显示失败', err);
        // });
    }
}


// ===== 友盟统计集成（中国区）=====

/**
 * 步骤1：注册友盟+
 * 1. 访问 https://www.umeng.com
 * 2. 创建应用
 * 3. 获取 App Key
 */

function initUmeng(appKey) {
    // 在 index.html 中添加友盟SDK
    const script = document.createElement('script');
    script.src = 'https://s5.cnzz.com/z_stat.php?id=' + appKey;
    document.head.appendChild(script);
}


// ===== 支付系统集成 =====

/**
 * 微信支付示例（需在小程序环境中）
 */
function wechatPay(orderInfo) {
    if (typeof wx === 'undefined') {
        alert('请在微信中打开');
        return;
    }

    wx.requestPayment({
        timeStamp: orderInfo.timeStamp,
        nonceStr: orderInfo.nonceStr,
        package: orderInfo.package,
        signType: 'MD5',
        paySign: orderInfo.paySign,
        success: (res) => {
            // 支付成功
            alert('支付成功！');
            // 解锁皮肤等操作
        },
        fail: (res) => {
            // 支付失败
            alert('支付失败');
        }
    });
}

/**
 * 支付宝H5支付示例
 */
function alipayH5(orderString) {
    // 跳转到支付宝支付页面
    window.location.href = orderString;
}


// ===== 完整集成示例 =====

/**
 * 在 index.html 中添加以下代码来启用所有功能：
 *
 * <script src="assets/js/analytics.js"></script>
 * <script>
 *   // 初始化（根据你的需求选择）
 *   initWeChatAd('your-ad-unit-id'); // 微信广告
 *   initUmeng('your-umeng-app-key'); // 友盟统计
 * </script>
 */
