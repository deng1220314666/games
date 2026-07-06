/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Telegram 主题令牌(接 --tg-theme-*,web 有浅/深回退)
        tg: {
          bg: 'var(--tg-bg)',
          secondary: 'var(--tg-secondary-bg)',
          section: 'var(--tg-section-bg)',
          text: 'var(--tg-text)',
          hint: 'var(--tg-hint)',
          subtitle: 'var(--tg-subtitle)',
          link: 'var(--tg-link)',
          button: 'var(--tg-button)',
          'button-text': 'var(--tg-button-text)',
          'section-header': 'var(--tg-section-header)',
          accent: 'var(--tg-accent)',
          destructive: 'var(--tg-destructive)',
          separator: 'var(--tg-separator)',
        },
      },
      borderColor: {
        tg: { separator: 'var(--tg-separator)' },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.h-custom-vh': { height: 'calc(var(--vh, 1vh) * 100)' },
      })
    },
  ],
}
