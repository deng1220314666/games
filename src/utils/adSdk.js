import { gaLogEvent } from "@/utils/event.js";
import { loadScript } from "@/utils/index.js";

// Adsterra SDK 配置
export const AdsterraAd = {
  adQueue: [],
  isLoading: false,
  init() {
    // await this.showAnchor();
  },

  runNext() {
    if (this.isLoading || this.adQueue.length === 0) return;

    this.isLoading = true;
    const task = this.adQueue.shift();
    task();
  },

  enqueue(task) {
    this.adQueue.push(task);
    this.runNext();
  },

  async showSocialBar() {
    try {
      await loadScript("https://pl27893768.profitablecpmratenetwork.com/2e/b8/74/2eb87400c5dffb7412e3616deb63408a.js", "Adsterra");
    } catch(e) {
      console.log("SocialBar", e)
    }
  },

  async showBanner(containerId, options, scriptSrc) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.enqueue(() => {
      // 每次独立设置（关键）
      window.atOptions = options;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = scriptSrc;
      script.async = true;

      script.onload = script.onerror = () => {
        // 防风控缓冲
        setTimeout(() => {
          this.isLoading = false;
          this.runNext();
        }, 300);
      };

      container.appendChild(script);
    });
  },

  async showAnchor() {
    let anchorDom = document.getElementById("adsterra-anchor-1-box");
    if (!anchorDom) return false;
    let container = document.createElement('div');
    container.id = 'ad-container';
    container.style = `
			width: 100%;
			height: 50px;
			background-color: #ffffff;
			display: flex;
			justify-content: center;
			align-items: center;
		`

    // 插入页面，比如插到 body 或指定容器
    anchorDom.appendChild(container);

    // 关闭按钮
    const closeBtn = document.createElement("div");
    closeBtn.style.cssText = `
		width:1.5rem; height:1.5rem; background:#ffffff;
		border-radius:0.12rem; box-shadow:0 0 0.25rem rgba(0,0,0,0.25);
		display:flex; justify-content:center; align-items:center;
		position:absolute; right:0.25rem; top:-1.5rem; cursor:pointer;`

    closeBtn.addEventListener("click", () => {
      container.remove();
      gaLogEvent.logEvent({
        eventName: "adsterra_anchor_close"
      })
    });

    // closeBtn.innerHTML = `<img style="width:1rem;height:1rem;" src="./img/ads-close-icon.webp" alt="">`;

    // 2️⃣ 设置 atOptions 配置
    window.atOptions = {
      'key' : '5459cbf4cf22d7a2a5cdeb4108417b4d',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };

    // 3️⃣ 动态插入广告脚本
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/5459cbf4cf22d7a2a5cdeb4108417b4d/invoke.js";

    container.appendChild(script);
  },

  async showNativeBanner (type) {
    if (type === 'ad.ttgame') {
      loadScript("https://pl29268938.profitablecpmratenetwork.com/d1debede50ec7d8df5940dc07088499f/invoke.js", "Adsterra");
    }

    if (type === 'ttgame') {
      loadScript("https://pl27894898.profitablecpmratenetwork.com/155789be5aa8a606b97a7d9e19e14adb/invoke.js", "Adsterra");
    }
  },

  async showPopunder () {
    loadScript("https://pl27363267.profitablecpmratenetwork.com/2d/b4/da/2db4da1a24ded0c8e42efadab90e35d6.js", "Adsterra");
  }
};

window.MonetagAd = {
  async init() {
    await loadScript("https://5gvci.com/act/files/tag.min.js?z=10356666", "Monetag");
  },
}

export const ExoClickAd = {
  adProvider: {},
  anchorAdProvider: {},
  anchorContainer: {},
  adContainer: {},
  served: false,
  interstitialAdProvider: {},
  async init() {
    await loadScript("https://a.magsrv.com/ad-provider.js", "ExoClick").then(async () => {
      (this.adProvider = window.AdProvider || []).push({"serve": {}})
    });
  }
}
