import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

const languages = {
  en: {
    name: 'English',
    flag: '🇺🇸'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export { i18n, languages }