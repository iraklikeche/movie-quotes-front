<template>
  <div class="sticky top-0 w-full">
    <Transition name="fade">
      <div class="bg-[#12101A] z-50 h-screen w-full fixed" v-if="showSearch">
        <div class="flex items-center p-8 border-b pb-2 border-border-gray border-opacity-60">
          <GoBackArrow @click="showSearch = false" />
          <input
            v-model="search"
            @keyup.enter="updateSearch"
            @focus="handleFocused"
            @blur="isFocused = false"
            class="outline-none text-white pl-4 py-2 bg-transparent w-full"
            :placeholder="$t('texts.search')"
          />
        </div>
        <div class="p-8 pl-16 text-custom-gray">
          <p class="mb-4">{{ $t('texts.mobile_search_movies') }}</p>
          <p>{{ $t('texts.mobile_search_quotes') }}</p>
        </div>
      </div>
    </Transition>
    <NotificationModal
      v-if="showNotification"
      :notifications="notifications"
      :showNotifications="showNotification"
      @closeNotification="closeNotification"
      @openModal="openDetailedQuoteModal"
    />
    <DetailedQuoteModal
      v-if="isView && selectedQuote"
      :selectedQuote="selectedQuote"
      @close="isView = false"
      @remove="removeQuote"
      :isEditMode="isEditMode"
      @quote-updated="fetchQuotes"
      @edit-mode="isEditMode = true"
    />

    <div>
      <UserRegister v-if="userSession.showRegister" />
      <UserLogin v-if="userSession.showLogin" />
      <ForgotPassword v-if="userSession.showForgotPassword" />
      <ResetPassword v-if="userSession.showResetPassword" />
    </div>

    <ToastModal v-if="userSession.successModal" v-bind="userSession.modalContent as any" />

    <div class="flex justify-between items-center px-4 py-6 sm:px-16">
      <div :class="['sm:block', { hidden: !isHomepage }]">
        <h2 class="text-[#ddCCAA] uppercase">movie quotes</h2>
      </div>
      <div class="sm:hidden cursor-pointer" @click.stop="$emit('toggle')" v-show="!isHomepage">
        <HamburgerMenu />
      </div>
      <div class="flex items-center sm:gap-5">
        <div class="inline-flex items-center relative w-12">
          <div class="locale-changer w-full">
            <select
              v-model="locale"
              @change="updateLocale"
              class="bg-transparent text-white text-sm rounded-lg h-10 hover:border-gray-400 focus:outline-none appearance-none cursor-pointer w-full"
            >
              <option
                v-for="locale in availableLocales"
                :key="`locale-${locale}`"
                :value="locale"
                class="bg-gray-800 text-white hover:bg-blue-500"
              >
                {{ locale }}
              </option>
            </select>
          </div>
          <div class="absolute top-[30%] right-2 sm:right-0 -translate-x-1/2 translate-y-1/2">
            <LanguageArrow />
          </div>
        </div>
        <div v-if="!isLogged">
          <button
            @click="userSession.toggleLogin"
            class="border border-white bg-transparent text-sm px-3 sm:px-5 py-2 rounded-lg text-white mr-1 sm:mr-4"
          >
            {{ $t('buttons.login') }}
          </button>
          <button
            @click="userSession.toggleRegister"
            class="bg-custom-red text-white px-4 py-2 text-sm rounded-lg"
          >
            {{ $t('buttons.signup') }}
          </button>
        </div>
        <div v-else class="flex gap-6 items-center ml-2 sm:ml-2">
          <SearchIcon class="sm:hidden" @click="openSearch" />
          <div class="relative">
            <button @click="openNotification">
              <NotificationIcon />
            </button>
            <div class="absolute -top-2 -right-3" v-if="unreadCount">
              <span
                class="font-bold text-white text-xs bg-orange-600 w-1 h-1 p-2.5 rounded-full flex items-center justify-center"
                >{{ unreadCount }}</span
              >
            </div>
          </div>
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
import NotificationModal from './NotificationModal.vue'
import GoBackArrow from './icons/GoBackArrow.vue'
import UserRegister from '@/components/Sessions/UserRegister.vue'
import UserLogin from '@/components/Sessions/UserLogin.vue'
import ForgotPassword from '@/components/Sessions/ForgotPassword.vue'
import ResetPassword from '@/components/Sessions/ResetPassword.vue'
import ToastModal from '@/components/ToastModal.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, onBeforeMount, computed } from 'vue'
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
import { useQuoteStore } from '@/stores/QuoteStore'
import DetailedQuoteModal from '@/components/DetailedQuoteModal.vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/NotificationStore'
const { t: $t } = useI18n()

const { locale, availableLocales } = useI18n()
const userSession = useUserSessionStore()
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const unreadCount = computed(() => {
  return notifications.value.filter((notification) => !notification.read_at).length
})

const route = useRoute()
const router = useRouter()
const showNotification = ref(false)

const quoteStore = useQuoteStore()
const search = quoteStore.search
const isLogged = ref(false)

const isHomepage = ref(window.location.pathname === '/')
const showSearch = ref(false)

const isFocused = ref(false)

const isView = ref(false)
const selectedQuote = ref(null)
const isEditMode = ref(false)

const openDetailedQuoteModal = (data: any) => {
  selectedQuote.value = data
  console.log(selectedQuote.value)
  isView.value = true
}

const removeQuote = async (id: number) => {
  isView.value = false
  await quoteStore.remove(id)
}

const fetchQuotes = async () => {
  await quoteStore.fetchQuotes('')
}

const openNotification = () => {
  showNotification.value = true
}

const closeNotification = () => {
  showNotification.value = false
}

const handleFocused = () => {
  isFocused.value = true
}

const updateSearch = (event: Event) => {
  const target = event.target as HTMLInputElement

  quoteStore.updateSearch(target.value)
  showSearch.value = false
}

const openSearch = () => {
  showSearch.value = true
}

const updateLocale = () => {
  Cookies.set('locale', locale.value, { expires: 7 })
  router.push({ path: router.currentRoute.value.fullPath })
  window.location.reload()
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

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// Life-cycles
onMounted(async () => {
  if (route.name !== 'home') {
    await notificationStore.fetchNotifications()
  }

  const rawToken = route.query.token
  const rawEmail = route.query.email

  const token = isString(rawToken) ? rawToken : undefined
  const email = isString(rawEmail) ? rawEmail : undefined

  if (token && email) {
    try {
      const response = await checkTokenValidity({ token, email })
      if (response.data.status === 'valid') {
        userSession.showResetPassword = true
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
    }
  }

  const cookieLocale = Cookies.get('locale')
  if (cookieLocale && availableLocales.includes(cookieLocale)) {
    locale.value = cookieLocale
  }
})

onBeforeMount(() => {
  initialLoginCheck()
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
