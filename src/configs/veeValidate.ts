import { defineRule, configure } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'
import ka from '@vee-validate/i18n/dist/locale/ka.json'
import type { I18n } from 'vue-i18n'

const customKaMessages = {
  ...ka,
  names: {
    email: 'ელ-ფოსტა',
    password: 'პაროლი',
    username: 'მომხმარებელის სახელი'
  }
}

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

configure({
  generateMessage: localize({
    en,
    ka: customKaMessages
  })
})

export function setupValidation(i18n: I18n): void {
  const currentLocale =
    typeof i18n.global.locale === 'string' ? i18n.global.locale : i18n.global.locale.value
  setLocale(currentLocale)
}
