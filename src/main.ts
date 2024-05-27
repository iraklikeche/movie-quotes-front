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
import apiClient from './api/axios'
declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo
  }
}

const app = createApp(App)
window.Pusher = Pusher

window.Echo = new Echo({
  auth: { withCredentials: true },
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  logToConsole: true,
  authorizer: (channel: { name: string }) => {
    return {
      authorize: (socketId: string, callback: (error: boolean, data: any) => void) => {
        apiClient
          .post('/api/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name
          })
          .then((response) => {
            callback(false, response.data)
          })
          .catch((error) => {
            callback(true, error)
          })
      }
    }
  }
})

app.component('SentIcon', SentIcon)
app.component('SuccessIcon', SuccessIcon)
app.component('TokenExpired', TokenExpired)

app.use(createPinia())
app.use(router)
app.use(i18n)

setupValidation(i18n as any)

app.mount('#app')
