import { defineRule, configure } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'
import ka from '@vee-validate/i18n/dist/locale/ka.json'
import type { I18n } from 'vue-i18n'

const customEnMessages = {
  ...en,
  names: {
    new_username: 'new username',
    new_password: 'new password',
    new_password_confirmation: 'new password',
    password_confirmation: 'password'
  }
}

const customKaMessages = {
  ...ka,
  names: {
    email: 'ელ-ფოსტა',
    password: 'პაროლი',
    username: 'სახელი',
    new_username: 'ახალი სახელი',
    new_password: 'ახალი პაროლი',
    new_password_confirmation: 'პაროლი',
    password_confirmation: 'პაროლი'
  }
}

type AllRulesObg = {
  [key: string]: any
}

const rulesObj: AllRulesObg = AllRules

Object.keys(rulesObj).forEach((rule) => {
  defineRule(rule, rulesObj[rule])
})

export function setupValidation(i18n: I18n): void {
  const currentLocale =
    typeof i18n.global.locale === 'string' ? i18n.global.locale : i18n.global.locale.value
  setLocale(currentLocale)

  defineRule('lowercase', (value: string) => {
    if (!value) {
      return true
    }
    return /^[a-z]+$/.test(value) || (i18n.global.t as (key: string) => string)('texts.lowercase')
  })
}

configure({
  generateMessage: localize({
    en: customEnMessages,
    ka: customKaMessages
  })
})
