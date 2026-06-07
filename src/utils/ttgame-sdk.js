import {gaLogEvent} from "./event.js";

export const TTGameSdk = {
    ttSdk: null,

    init: function() {
        if (!window) return false;

        this.ttSdk = window.ttSdk;

        if (this.ttSdk == null) return false;

        this.showOnclickaVideo();
        this.showBanner();
        this.showSplash();
        this.showOnclickaBanner();
    },

    showBanner: function() {
        setTimeout(() => {
            const bannerDom = document.querySelector('#adsterra-banner-1-box');

            if (bannerDom) {
                this.ttSdk.showBannerAd({ key: 'd485bca4ce91450e3b58525457ee556a', target: "#adsterra-banner-1-box", width: 300, height: 250 });

                gaLogEvent.logEvent({
                    eventName: "show_ttsdk_banner",
                    eventLog: `show_ttsdk_banner`
                })
            }
        })
    },

    showSplash: function() {
        setTimeout(() => {
            this.ttSdk.showSplashAd({
                key: "155789be5aa8a606b97a7d9e19e14adb",
                duration: 5,
                adWidth: 320,
                adHeight: 'auto',
                closeText: "Close Ad",
                countdownTemplate: "Close in {s}s",
                onCountdownEnd: () => {
                    gaLogEvent.logEvent({
                        eventName: "show_ttsdk_splash_time_end",
                        eventLog: `show_ttsdk_splash_time_end`
                    })
                },
                onClose: () => {
                    gaLogEvent.logEvent({
                        eventName: "show_ttsdk_splash_close",
                        eventLog: `show_ttsdk_splash_close`
                    })
                },
            });

            gaLogEvent.logEvent({
                eventName: "show_ttsdk_splash_start",
                eventLog: `show_ttsdk_splash_start`
            })
        }, 1000)
    },

    showGameDetailsBanner: function() {
        setTimeout(() => {
            const bannerDom = document.querySelector('#adsterra-banner-2-box');

            if (bannerDom) {
                window.ttSdk.showBannerAd({ key: 'd485bca4ce91450e3b58525457ee556a', target: "#adsterra-banner-2-box", width: 300, height: 250 });

                gaLogEvent.logEvent({
                    eventName: "show_ttsdk_game_details_banner",
                    eventLog: `show_ttsdk_game_details_banner`
                })
            }
        }, 1000)
    },

    showOnclickaBanner: async function() {
        setTimeout(() => {
            const script = document.createElement("script");
            script.async = true;
            script.src = "https://js.onclckmn.com/static/onclicka.js";
            script.setAttribute("data-admpid", "441212");

            script.onload = () => {
                console.log("OnClickA banner loaded");
            };

            script.onerror = (err) => {
                console.error("OnClickA banner load failed", err);
            };

            document.head.appendChild(script);
        }, 500)
    },

    showOnclickaVideo: async function() {
        setTimeout(() => {
            const script = document.createElement("script");
            script.async = true;
            script.src = "https://js.onclckmn.com/static/onclicka.js";
            script.setAttribute("data-admpid", "444023");

            script.onload = () => {
                console.log("OnClickA banner loaded");
            };

            script.onerror = (err) => {
                console.error("OnClickA banner load failed", err);
            };

            document.head.appendChild(script);
        }, 500)
        // <script async src="https://js.onclckmn.com/static/onclicka.js" data-admpid="444023"></script>
    }
}