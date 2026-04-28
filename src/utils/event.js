import { ENV } from "@/config/index.js";
let gaLoaded = false;

export function initGA() {
  if (ENV === "development") return false
  if (gaLoaded) return;
  gaLoaded = true;

  // 1. 创建 script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-92Y764QQW2';
  document.head.appendChild(script);

  // 2. 初始化 gtag
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-92Y764QQW2', {
    send_page_view: false // SPA 必开
  });
}

export let gaLogEvent = {
  staySeconds: 30,
  currentIndex: 0, // 当前索引

  logEvent({
     eventName,
     eventValue,
     eventLog
  }) {
    console.log(
        `【events】 【name】:${eventName},【value】:${eventValue},【log】:${eventLog}`,
    );
    if (ENV === "development") return false;

    if (eventName) {
      // 发送事件
      if (window?.gtag) {
        let params = null;
        if (eventValue !== undefined) {
          params = {};
          params.value = eventValue;
        }
        params === null && window.gtag("event", eventName);
        params !== null && window.gtag("event", eventName, params);
      }
    }
  },

  startIntervalVisibilityTracking(intervals, callback, loopAfterDone = false) {
    let index = 0;
    let timer = null;
    let pausedAt = 0;
    let remaining = 0;
    let lastStart = Date.now();
    let loopTime = 30000;

    function next() {
      lastStart = Date.now();

      if (index < intervals.length) {
        const [value, delay] = intervals[index];
        timer = setTimeout(() => {
          callback(value, index);
          index++;
          next();
        }, delay * 1000);
      } else if (loopAfterDone) {
        timer = setTimeout(() => {
          const value = intervals.length > 0 ? intervals[intervals.length - 1][0] + (index -
              intervals.length + 1) * (loopTime / 1000) : (index + 1) * (loopTime / 1000);
          callback(value, index);
          index++;
          next();
        }, loopTime);
      }
    }

    function pause() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        pausedAt = Date.now();
        const elapsed = pausedAt - lastStart;
        const currentDelay = index < intervals.length ?
            intervals[index][1] * 1000 :
            loopTime;
        remaining = Math.max(currentDelay - elapsed, 0);
      }
    }

    function resume() {
      if (timer === null && remaining > 0) {
        lastStart = Date.now();
        timer = setTimeout(() => {
          if (index < intervals.length) {
            const [value] = intervals[index];
            callback(value, index);
          } else {
            const value = intervals.length > 0 ? intervals[intervals.length - 1][0] + (index -
                intervals.length + 1) * (loopTime / 1000) : (index + 1) * (loopTime / 1000);
            callback(value, index);
          }
          index++;
          next();
        }, remaining);
        remaining = 0;
      }
    }

    visibilityManager.onHide(pause);
    visibilityManager.onShow(resume);

    next(); // 启动
  },

  /**
   * play_time上报
   */
  async startPageTimeTimers() {
    const times = [1, 3, 5, 10, 15, 20, 25, 30];
    const intervals = times.map((v, i) => [v, i === 0 ? v : v - times[i - 1]]);

    // 初始化状态
    this.currentIndex = 0;
    this.staySeconds = 30;

    this.startIntervalVisibilityTracking(intervals, (timeMark, index) => {
      this.currentIndex = index;
      this.staySeconds = timeMark;

      this.logEvent({
        eventName: `play_time_${timeMark}`,
        eventValue: timeMark,
        eventLog: `Length of stay ${timeMark} 秒`,
      });
    }, false);
  }
};

const visibilityManager = (() => {
  const listeners = {
    show: [],
    hide: []
  };

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        listeners.hide.forEach(fn => fn());
      } else {
        listeners.show.forEach(fn => fn());
      }
    });
  }

  return {
    onShow(fn) {
      init();
      listeners.show.push(fn);
    },
    onHide(fn) {
      init();
      listeners.hide.push(fn);
    },
    clearAll() {
      listeners.show = [];
      listeners.hide = [];
    }
  };
})();
