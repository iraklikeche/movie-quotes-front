import { createI18n } from 'vue-i18n'
import en from './lang/en/index'
import ka from './lang/ka/index'

const messages = {
  en,
  ka
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
