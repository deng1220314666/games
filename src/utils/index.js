/**
 * 防抖函数
 * @param {Function} func 需要防抖处理的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 返回一个新的防抖函数
 */
import {gaLogEvent} from "./event";

export function debounce(func, wait) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  if (typeof wait !== 'number') {
    throw new TypeError('Expected a number for wait time');
  }

  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * 绑定拖动功能到指定元素
 * @param target 要拖动的元素
 */
export function makeDraggable(target) {
  if (!target) return;

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  const startDrag = (x, y) => {
    const rect = target.getBoundingClientRect();
    target.style.position = 'fixed'; // 确保能拖动
    target.style.left = `${rect.left}px`;
    target.style.top = `${rect.top}px`;
    target.style.right = 'auto';
    target.style.bottom = 'auto';

    offsetX = x - rect.left;
    offsetY = y - rect.top;
    isDragging = true;
    document.body.style.userSelect = 'none';
  };

  const doDrag = (x, y) => {
    if (!isDragging) return;

    let newLeft = x - offsetX;
    let newTop = y - offsetY;

    const maxLeft = window.innerWidth - target.offsetWidth;
    const maxTop = window.innerHeight - target.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    target.style.left = `${newLeft}px`;
    target.style.top = `${newTop}px`;
  };

  const endDrag = () => {
    isDragging = false;
    document.body.style.userSelect = '';
  };

  // PC事件
  target.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', (e) => {
    doDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', endDrag);

  // 移动端事件
  target.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    doDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  document.addEventListener('touchend', endDrag);
}

/**
 * 获取 URL 参数
 * @param {string} name 参数名
 * @param {string} [url] 可选 URL，默认取 window.location.href
 * @returns {string|null} 参数值
 */
export function getQueryParam(name, url = window.location.href) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(name);
  } catch (e) {
    console.error('URL 解析错误', e);
    return null;
  }
}

export async function loadScript (url, type) {
  return new Promise((resolve, reject) => {
    try {
      // ✅ 判断是否已经加载过同样的脚本
      const isLoaded = Array.from(document.scripts).some(script => {
        try {
          // 去掉参数差异，只比对主域与路径，防止重复加载同一个脚本
          const normalize = u => u.split('?')[0].replace(/\/+$/, '');
          return normalize(script.src) === normalize(url);
        } catch {
          return false;
        }
      });

      if (isLoaded) {
        resolve();
        return;
      }

      // ✅ 创建脚本元素
      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      // ✅ 加载成功
      script.onload = () => {
        resolve();
      };

      // ❌ 加载失败
      script.onerror = (e) => {
        reject(e);
      };

      // ✅ 插入到 <head>
      document.head.appendChild(script);
    } catch (err) {
      console.error(`[loadScript] ❌ 异常: ${url}`, err);
      reject(err);
    }
  });
}

const appendParams = (url, extraParams = {}) => {
  let u = new URL(url, window.location.origin);
  Object.entries(extraParams).forEach(([key, val]) => {
    u.searchParams.set(key, String(val));
  });
  return u.href;
}

// 添加浏览器历史记录
export const pushRouterHistory = () => {
  let baseUrl = location.href;
  let routerStatus = "one"
  let ts = Date.now();
  let url1 = appendParams(baseUrl, { p: 'two', ts: ts });
  let url2 = appendParams(baseUrl, { p: routerStatus, ts: ts + 1 });

  // 初始化
  history.replaceState({ page: 'two' }, '', url1);
  history.pushState({ page: routerStatus }, '', url2);;
}

export const jumpUrl = (url, type='_blank') => {
  if (!url) return false;
  gaLogEvent.logEvent({
    eventName: "back_smart_link",
    eventValue: url,
    eventLog: `Enter Smart Link`
  })
  window.open(url, type);
}

// 回退跳转
export const bachJump = () => {
  // window.addEventListener("pagehide", () => {
  //   const item = "https://www.profitablecpmratenetwork.com/fq3key41?key=fc5b02ea1eb8e2a60efbe3e0a4204089";
  //   jumpUrl(item)
  // });
  //
  // window.addEventListener("beforeunload", () => {
  //   const item = "https://www.profitablecpmratenetwork.com/fq3key41?key=fc5b02ea1eb8e2a60efbe3e0a4204089";
  //   jumpUrl(item)
  // });

  window.addEventListener("popstate", () => {
    console.log("跳转")
    const item = "https://www.profitablecpmratenetwork.com/fq3key41?key=fc5b02ea1eb8e2a60efbe3e0a4204089";
    jumpUrl(item)
  });
}

// 生成随机数
export const randomNum = () => {
  return Math.floor(Math.random() * (800 - 500 + 1)) + 500
}

export async function loadOnclickScript (url, zoneid) {
  return new Promise((resolve, reject) => {
    // 防止重复加载
    if (document.querySelector('script[data-admpid="153207"]')) {
      resolve(true)
      return
    }

    const script = document.createElement('script')

    script.async = true
    script.src = url;
    script.dataset.admpid =  zoneid;

    script.onload = () => {
      console.log('onclicka 加载成功')
      resolve(true)
    }

    script.onerror = (err) => {
      console.error('onclicka 加载失败', err)
      reject(err)
    }

    document.head.appendChild(script)
  })
}