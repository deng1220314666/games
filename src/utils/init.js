export const initVhUnit = () => {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVh();

  // 避免重复绑定
  window.removeEventListener('resize', setVh);
  window.addEventListener('resize', setVh);
};