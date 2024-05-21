import './style.css'
import { createApp } from 'vue'
import i18n from '@/i18n/index'
import { createPinia } from 'pinia'
import App from './App.vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import router from './router'
import { setupValidation } from './configs/veeValidate'
import SentIcon from '@/components/icons/SentIcon.vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import TokenExpired from '@/components/icons/TokenExpired.vue'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo
  }
}

const app = createApp(App)
// window.Pusher = require('pusher-js')
window.Pusher = Pusher

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_PUSHER_APP_KEY,
  cluster: process.env.VUE_PUSHER_APP_CLUSTER,
  forceTLS: true
})
app.component('SentIcon', SentIcon)
app.component('SuccessIcon', SuccessIcon)
app.component('TokenExpired', TokenExpired)

app.use(createPinia())
app.use(router)
app.use(i18n)

setupValidation(i18n as any)

app.mount('#app')
