import './style.css'
import { createApp } from 'vue'
import i18n from '@/i18n/index'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupValidation } from './configs/veeValidate'
import SentIcon from '@/components/icons/SentIcon.vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import TokenExpired from '@/components/icons/TokenExpired.vue'

const app = createApp(App)

app.component('SentIcon', SentIcon)
app.component('SuccessIcon', SuccessIcon)
app.component('TokenExpired', TokenExpired)

app.use(createPinia())
app.use(router)
app.use(i18n)

setupValidation(i18n)

app.mount('#app')
