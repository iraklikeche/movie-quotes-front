import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { defineRule } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
