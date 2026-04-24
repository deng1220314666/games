/**
 * 防抖函数
 * @param {Function} func 需要防抖处理的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 返回一个新的防抖函数
 */
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