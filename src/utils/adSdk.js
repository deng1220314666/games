import { gaLogEvent } from "@/utils/event.js";
import { loadScript } from "@/utils/index.js";

// Adsterra SDK 配置
export const AdsterraAd = {
  init() {
    this.showSocialBar();
		
    setTimeout(() => {
        this.showBanner();
      }, 2000);
    // await this.showAnchor();
  },

  async showSocialBar() {
    try {
      await loadScript("https://pl27893768.profitablecpmratenetwork.com/2e/b8/74/2eb87400c5dffb7412e3616deb63408a.js", "Adsterra");
    } catch(e) {
      console.log("SocialBar", e)
    }
  },

  async showBanner(size) {
    let adDom = document.getElementById("adsterra-banner-1-box");
    if (!adDom) return false;
    adDom.style.display = "flex";
    adDom.style.justifyContent = "center";
    adDom.style.alignItems = "center";

    // 2️⃣ 设置 atOptions 配置
    window.atOptions = {
      'key' : 'd485bca4ce91450e3b58525457ee556a',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };

    // 3️⃣ 动态插入广告脚本
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/d485bca4ce91450e3b58525457ee556a/invoke.js";

    adDom.appendChild(script);
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
      'key' : 'aa0bcc60051abc8073f5ed414a2caa65',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };

    // 3️⃣ 动态插入广告脚本
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/aa0bcc60051abc8073f5ed414a2caa65/invoke.js";

    container.appendChild(script);
  },
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
      this.adContainer = document.getElementById("adContainer");
      (this.adProvider = window.AdProvider || []).push({"serve": {}})
    });
  }
}
