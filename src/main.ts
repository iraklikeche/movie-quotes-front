import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { defineRule } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import SentIcon from '@/components/icons/SentIcon.vue'
// import SentIcon2 from '@/components/icons/SentIcon2.vue'

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})
const app = createApp(App)

app.component('SentIcon', SentIcon)
// app.component('SentIcon2', SentIcon2)

app.use(createPinia())
app.use(router)

app.mount('#app')
