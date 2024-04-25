<template>
  <div class="flex justify-between items-center px-4 py-6 sm:px-12">
    <div>
      <h2 class="text-[#ddCCAA] uppercase">movie quotes</h2>
    </div>
    <div>
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
  <UserRegister v-if="userSession.showRegister" />
  <UserLogin v-if="userSession.showLogin" />
  <ForgotPassword v-if="userSession.showForgotPassword" />
  <ResetPassword v-if="userSession.showResetPassword" />
</template>

<script lang="ts" setup>
import UserRegister from '@/components/Sessions/UserRegister.vue'
import UserLogin from '@/components/Sessions/UserLogin.vue'
import ForgotPassword from '@/components/Sessions/ForgotPassword.vue'
import ResetPassword from '@/components/Sessions/ResetPassword.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()
</script>
