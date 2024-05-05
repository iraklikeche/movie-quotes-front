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
    username: 'მომხმარებელის სახელი',
    new_username: 'ახალი სახელი',
    new_password: 'ახალი პაროლი'
  }
}

type AllRulesObg = {
  [key: string]: any
}

const rulesObj: AllRulesObg = AllRules

Object.keys(rulesObj).forEach((rule) => {
  defineRule(rule, rulesObj[rule])
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
