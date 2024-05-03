<template>
  <div class="px-4">
    <div>
      <UserRegister v-if="userSession.showRegister" />
      <UserLogin v-if="userSession.showLogin" />
      <ForgotPassword v-if="userSession.showForgotPassword" />
      <ResetPassword v-if="userSession.showResetPassword" />
    </div>

    <ToastModal v-if="userSession.successModal" v-bind="userSession.modalContent as any" />

    <div class="flex justify-between items-center px-4 py-6 sm:px-12">
      <div class="hidden sm:block">
        <h2 class="text-[#ddCCAA] uppercase">movie quotes</h2>
      </div>
      <div class="sm:hidden">
        <HamburgerMenu />
      </div>
      <div class="flex items-center">
        <div class="inline-flex mr-5 sm:mr-8 items-center">
          <div class="locale-changer">
            <select
              v-model="locale"
              @change="updateLocale"
              class="bg-transparent text-white text-sm rounded-lg h-10 pr-2 hover:border-gray-400 focus:outline-none appearance-none cursor-pointer"
            >
              <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">
                {{ locale }}
              </option>
            </select>
          </div>
          <LanguageArrow />
        </div>
        <div v-if="!isLogged">
          <button
            @click="userSession.toggleLogin"
            class="border border-white bg-transparent text-sm px-5 py-2 rounded-lg text-white mr-4"
          >
            {{ $t('buttons.login') }}
          </button>
          <button
            @click="userSession.toggleRegister"
            class="bg-[#e31221] text-white px-4 py-2 text-sm rounded-lg"
          >
            {{ $t('buttons.signup') }}
          </button>
        </div>
        <div v-else class="flex gap-6 items-center">
          <SearchIcon class="sm:hidden" />
          <NotificationIcon />
          <button
            @click="onLogout"
            class="border border-white bg-transparent text-sm px-5 py-2 rounded-lg text-white hidden sm:block"
          >
            {{ $t('buttons.logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UserRegister from '@/components/Sessions/UserRegister.vue'
import UserLogin from '@/components/Sessions/UserLogin.vue'
import ForgotPassword from '@/components/Sessions/ForgotPassword.vue'
import ResetPassword from '@/components/Sessions/ResetPassword.vue'
import ToastModal from '@/components/ToastModal.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, onBeforeMount, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageArrow from './icons/LanguageArrow.vue'
import NotificationIcon from '@/components/icons/NotificationIcon.vue'
import HamburgerMenu from '@/components/icons/HamburgerMenu.vue'
import SearchIcon from './icons/SearchIcon.vue'
import { watch } from 'vue'
import { setLocale } from '@vee-validate/i18n'
import Cookies from 'js-cookie'
import {
  checkTokenValidity,
  getCsrfCookie,
  resendPasswordResetLink,
  logoutUser
} from '@/service/authService'

const { t: $t } = useI18n()

const { locale, availableLocales } = useI18n()
const userSession = useUserSessionStore()
const route = useRoute()
const router = useRouter()

const isLogged = ref(false)

const updateLocale = () => {
  Cookies.set('locale', locale.value, { expires: 7 })
  router.push({ path: router.currentRoute.value.fullPath })
}

const initialLoginCheck = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (isLoggedIn) {
    isLogged.value = true
  }
}

// AJAX
const onLogout = async () => {
  await getCsrfCookie()
  try {
    await logoutUser()
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  } catch (error) {
    //
  }
}

// Life-cycles
onBeforeMount(() => {
  initialLoginCheck()
})

function isString(value: unknown): value is string {
  return typeof value === 'string'
}
onMounted(async () => {
  const rawToken = route.query.token
  const rawEmail = route.query.email

  const token = isString(rawToken) ? rawToken : undefined
  const email = isString(rawEmail) ? rawEmail : undefined

  if (token && email) {
    try {
      const response = await checkTokenValidity({ token, email })
      if (response.data.status === 'valid') {
        userSession.showResetPassword = true
        console.log(response.data.status)
      }
    } catch (error) {
      userSession.setModalContent(
        {
          icon: 'TokenExpired',
          mainMessage: $t('texts.link_expired'),
          subMessage: $t('texts.expired_text'),
          buttonText: $t('texts.expired_btn_text')
        },
        async () => {
          await getCsrfCookie()
          const resendResponse = await resendPasswordResetLink(email)
          if (resendResponse.status === 200) {
            userSession.setModalContent(
              {
                icon: 'SentIcon',
                mainMessage: $t('texts.thanks'),
                subMessage: $t('texts.subMessage'),
                buttonText: $t('texts.buttonText')
              },
              () => userSession.redirectToEmailProvider(email)
            )
          } else {
            //
          }
        }
      )
      userSession.successModal = true
      console.error('Token validation failed:', error)
    }
  }

  const cookieLocale = Cookies.get('locale')
  if (cookieLocale && availableLocales.includes(cookieLocale)) {
    locale.value = cookieLocale
  }
})

// Watchers
watch(
  () => locale.value,
  (newLocale) => {
    setLocale(newLocale)
  },
  { immediate: true }
)
</script>
