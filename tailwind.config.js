/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
			colors: {
				'theme-bg': 'var(--background-color)', // 主题背景颜色
        'theme-text': 'var(--text-color)',     // 主题文本颜色
			},
		},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.h-custom-vh': {
          height: 'calc(var(--vh, 1vh) * 100)',
        },
      });
    }
  ],
}