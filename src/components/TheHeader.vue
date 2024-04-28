<template>
  <div>
    <UserRegister v-if="userSession.showRegister" />
    <UserLogin v-if="userSession.showLogin" />
    <ForgotPassword v-if="userSession.showForgotPassword" />
    <ResetPassword v-if="userSession.showResetPassword" />
  </div>
  <ToastModal v-if="userSession.successModal" v-bind="userSession.modalContent" />

  <div class="flex justify-between items-center px-4 py-6 sm:px-12">
    <div>
      <h2 class="text-[#ddCCAA] uppercase">movie quotes</h2>
    </div>
    <div>
      <div class="inline-flex mr-8 items-center">
        <div class="locale-changer">
          <select
            v-model="locale"
            class="bg-transparent text-white text-sm rounded-lg h-10 pr-2 hover:border-gray-400 focus:outline-none appearance-none cursor-pointer"
          >
            <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">
              {{ locale }}
            </option>
          </select>
        </div>
        <LanguageArrow />
      </div>

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
  </div>
</template>

<script lang="ts" setup>
import UserRegister from '@/components/Sessions/UserRegister.vue'
import UserLogin from '@/components/Sessions/UserLogin.vue'
import ForgotPassword from '@/components/Sessions/ForgotPassword.vue'
import ResetPassword from '@/components/Sessions/ResetPassword.vue'
import ToastModal from '@/components/ToastModal.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import LanguageArrow from './icons/LanguageArrow.vue'
import { watch } from 'vue'
import { setLocale } from '@vee-validate/i18n'

const { locale, availableLocales } = useI18n()
const userSession = useUserSessionStore()
const route = useRoute()

onMounted(() => {
  const token = route.query.token
  if (token) {
    userSession.showResetPassword = true
  }
})

// Watch for changes in the i18n locale and update vee-validate's locale accordingly
watch(
  () => locale.value,
  (newLocale) => {
    setLocale(newLocale)
  },
  { immediate: true }
)
</script>
