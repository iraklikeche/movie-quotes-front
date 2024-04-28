import { defineRule, configure } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'
import ka from '@vee-validate/i18n/dist/locale/ka.json'

const customKaMessages = {
  ...ka,
  names: {
    email: 'ელ-ფოსტა',
    password: 'პაროლი',
    username: 'მომხმარებელის სახელი'
  }
}

// Register all validation rules
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

// Configure vee-validate
configure({
  generateMessage: localize({
    en,
    ka: customKaMessages
  })
})

export function setupValidation(i18n) {
  setLocale(i18n.global.locale)
}
