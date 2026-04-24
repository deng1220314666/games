import { gaLogEvent } from "@/utils/event.js";
import { loadScript } from "@/utils/common.js";

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

window.ExoClick = {
  adProvider: {},
  anchorAdProvider: {},
  anchorContainer: {},
  adContainer: {},
  async init() {
    await loadScript("https://a.magsrv.com/ad-provider.js", "ExoClick").then(async () => {
      this.adContainer = document.getElementById("adContainer");
      await this.vastVideoAd();
      (this.adProvider = window.AdProvider || []).push({"serve": {}})
    });
  },

  async anchor() {
    this.anchorContainer = document.createElement('div');
    this.anchorContainer.id = 'ad-container';
    this.anchorContainer.style = `
			width: 100%;
			height: 50px;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 10;
			background-color: #ffffff;
			display: flex;
			justify-content: center;
			align-items: center;
		`

    // 插入页面，比如插到 body 或指定容器
    document.body.appendChild(this.anchorContainer);

    // 关闭按钮
    const closeBtn = document.createElement("div");
    closeBtn.style.cssText = `
		width:1.5rem; height:1.5rem; background:#ffffff;
		border-radius:0.12rem; box-shadow:0 0 0.25rem rgba(0,0,0,0.25);
		display:flex; justify-content:center; align-items:center;
		position:absolute; right:0.25rem; top:-1.5rem; cursor:pointer;`

    closeBtn.addEventListener("click", () => {
      this.anchorContainer.remove();
      gaLogEvent.logEvent({
        eventName: "adsterra_anchor_close"
      })
    });

    closeBtn.innerHTML = `<img style="width:1rem;height:1rem;" src="./img/ads-close-icon.webp" alt="">`;

    this.anchorContainer.innerHTML = `<ins class="eas6a97888e10" data-zoneid="5806288"></ins>`;

    (this.anchorAdProvider = window.AdProvider || []).push({"serve": {}})
  },

  async videoAd() {
    if (!this.adContainer) return;
    this.adContainer[0].style.cssText = `
            width: 280;
            height: auto;
            margin: 0 auto;
            z-index: 1000;
          `;

    this.adContainer[0].innerHTML = `
            <ins class="eas6a97888e37" data-zoneid="5806296"></ins>
          `;

    window.AdProvider = window.AdProvider || [];
    window.AdProvider.push({ serve: {} });
  },

  async bannerAd() {
    if (!this.adContainer) return;
    this.adContainer.style.cssText = `
            width: 100%;
            height: auto;
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
          `;

    this.adContainer.innerHTML = `
             <ins class="eas6a97888e10" data-zoneid="5806282"></ins> 
          `;

    window.AdProvider = window.AdProvider || [];
    window.AdProvider.push({ serve: {} });
  },

  async vastVideoAd() {
    const vastUrl = "https://s.magsrv.com/v1/vast.php?idzone=5836134";
    const videoInfo = await fetchVast(vastUrl);
    console.log("video info", videoInfo)

    if (!this.adContainer) return;

    if (!videoInfo.clickUrl) {
      await this.bannerAd();
      return
    }

    this.adContainer.style.cssText = `
            width: 100%;
            height: auto;
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
          `;
    // 创建 video 元素
    const video = document.createElement("video");
    video.src = videoInfo.mediaFiles[0].url;
    video.width = videoInfo.mediaFiles[0].width || 640;
    video.height = videoInfo.mediaFiles[0].height || 360;
    video.controls = true;
    video.autoplay = true;
    video.muted = false; // 可以根据需要设置
    video.style.display = "block";
    video.style.margin = "0 auto";

    // 点击跳转广告
    if (videoInfo.clickUrl) {
      video.style.cursor = "pointer";
      video.addEventListener("pointerup", () => {
        console.log("clicked video");
        window.open(videoInfo.clickUrl, "_blank");
      });
    }

    this.adContainer.appendChild(video);
  }
}

async function fetchVast(url) {
  try {
    // 请求 VAST XML
    const res = await fetch(url);
    if (!res.ok) throw new Error("VAST 请求失败");

    const text = await res.text();

    // 解析 XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    // 检查 VAST 是否有 Error
    const errorTag = xmlDoc.querySelector("Error");
    if (errorTag) console.warn("VAST Error:", errorTag.textContent);

    const clickUrl = xmlDoc.querySelector("ClickThrough")?.textContent?.trim() || "";

    // 解析 Video 信息
    const mediaFiles = Array.from(xmlDoc.querySelectorAll("MediaFile")).map((file) => {
      return {
        delivery: file.getAttribute("delivery"),
        type: file.getAttribute("type"),
        bitrate: file.getAttribute("bitrate"),
        width: file.getAttribute("width"),
        height: file.getAttribute("height"),
        url: file.textContent?.trim()                // 视频文件 URL
      };
    });

    // 解析其他信息，比如广告标题
    const adTitle = xmlDoc.querySelector("Ad Title")?.textContent || "";

    return { adTitle, mediaFiles, clickUrl };
  } catch (err) {
    console.error("解析 VAST 出错:", err);
    return null;
  }
}