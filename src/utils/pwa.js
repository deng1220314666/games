import { loadScript } from "./index.js";

export const initPwa = () => {
    loadScript("/sdk/pwaSdk.js", "paw_sdk").then(() => {
        try {
            window.sdk = window.MiniGamePwaSdk?.create({
                scene: "game",
                enableRouteInterception: false,   // 是否在路由返回拦截，使用户在退出时再弹一次下载安装的提醒
                autoOpenChrome: false,     // 如果是在facebook打开，这一行将导致页面出一个弹窗让用户使用chrome打开本页
                gameInfo: {
                    gameId: "jewels-blitz6",
                    url: ""
                },
                userId: "12058",
                accessToken: "123156465465",
                channelId: "gkLtQykUgOHQgukG",
            });

            sdk.init();

            if (sdk?.isInPwaApp()) {
                gaLogEvent.logEvent({
                    eventName: "pwa_mode_in_app",
                    eventLog: "pwa_mode_in_app"
                });
            }
            sdk?.on("push-subscribe-dismissed", () => {
                gaLogEvent.logEvent({
                    eventName: "pwa_mode_push_subscribe_dismissed",
                    eventLog: "pwa_mode_push_subscribe_dismissed"
                });
            });
            sdk?.on("push-subscribe-success", () => {
                gaLogEvent.logEvent({
                    eventName: "pwa_mode_push_subscribe_success",
                    eventLog: "pwa_mode_push_subscribe_success"
                });
            });
            sdk?.on("install-accepted", () => {
                gaLogEvent.logEvent({
                    eventName: "pwa_mode_accepted",
                    eventLog: "pwa_mode_accepted"
                });
            });
        } catch(error) {
            console.log(error)
        }

        const asyncGetIfInstalled = async () => {
            try {
                // 在 pwa 环境 不提示安装
                if (window.sdk && typeof window.sdk.isInPwaApp === "function") {
                    if (await window.sdk.isInPwaApp()) {
                        return true;
                    }
                }
                if (
                    window.sdk &&
                    typeof window.sdk.isInstallAvailable === "function"
                ) {
                    return !window.sdk.isInstallAvailable();
                }
                return true;
            } catch (error) {
                return true;
            }
        }

        const asyncShowFloatInstallPWAHandler = async () => {
            return new Promise((resolve) => {
                try {
                    if (
                        window.sdk &&
                        typeof window.sdk.showFloatInstallModal === "function"
                    ) {
                        window.sdk.showFloatInstallModal(async (type) => {
                            if (type === "floatClick") {
                                // 悬浮按钮点击
                                // resolve(false);
                            }

                            if (type === "confirm") {
                                // 点击 Install 按钮
                                window?.sdk?.promptInstallWaitForReady();
                                resolve(true);
                            }

                            if (type === "cancel") {
                                // 点击弹框的关闭
                                resolve(false);
                            }
                        });
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    resolve(false);
                }
            });
        }

        const asyncShowOpenAppPopoverPWAHandler = async () => {
            if (window?.sdk?.showOpenAppPopover && typeof window?.sdk?.showOpenAppPopover === "function") {
                window?.sdk?.showOpenAppPopover(() => {
                    window?.sdk?.toPwaApp();
                    window.location.reload();
                    fetch('https://h4imw.bemobtrcks.com/postback?cid=REPLACE&payout=OPTIONAL&txid=OPTIONAL&status=OPTIONAL', {
                        method: 'GET',
                        mode: 'no-cors' // 防止跨域报错
                    });
                });
            }
        }

        setTimeout(async () => {
            const isInstalled = await asyncGetIfInstalled();
            console.log("asyncGetIfInstalled result: ", isInstalled);
            if (!isInstalled) {
                asyncShowFloatInstallPWAHandler();
            }
        }, 5000)

        let timeout = null;

        // 监听安装状态
        window.addEventListener('appinstalled', () => {
            // 清除定时器
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            timeout = setTimeout(() => {
                console.log("PWA installed event fired");
                asyncShowOpenAppPopoverPWAHandler();
            }, 10 * 1000);
        });
    })
}