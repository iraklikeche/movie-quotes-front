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
        <select
          class="bg-transparent text-white text-sm rounded-lg h-10 pr-2 hover:border-gray-400 focus:outline-none appearance-none"
          @change="userSession.changeLanguage($event)"
        >
          <option value="en" class="bg-red-500">Eng</option>
          <option value="es" class="bg-red-500">Geo</option>
        </select>
        <LanguageArrow />
      </div>

      <button
        @click="userSession.toggleLogin"
        class="border border-white bg-transparent text-sm px-5 py-2 rounded-lg text-white mr-4"
      >
        Log in
      </button>
      <button
        @click="userSession.toggleRegister"
        class="bg-[#e31221] text-white px-4 py-2 text-sm rounded-lg"
      >
        Sign up
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
import LanguageArrow from './icons/LanguageArrow.vue'

const userSession = useUserSessionStore()
const route = useRoute()

onMounted(() => {
  const token = route.query.token
  if (token) {
    userSession.showResetPassword = true
  }
})
</script>
