<template>
  <main class="relative bg-gradient-to-b from-gray-900 to-black h-screen">
    <TheHeader />
    <div class="flex items-center justify-center flex-col gap-10 pb-32 h-full">
      <h2
        class="text-center text-2xl sm:text-6xl font-bold text-[#ddCCAA] flex flex-col gap-2 sm:gap-6"
      >
        Find any quote in <span> millions of movie lines</span>
      </h2>
      <button class="bg-[#e31221] text-white px-4 py-2 text-sm rounded-lg sm:text-xl">
        Get started
      </button>
    </div>
  </main>
  <section class="">
    <div>
      <div class="py-6 bg-black outline-none absolute"></div>
      <img :src="cover1" class="h-screen w-full" />
    </div>
    <img :src="cover2" class="h-screen w-full" />
    <img :src="cover3" class="h-screen w-full" />
  </section>

  <!-- I will keep it as it is for now, I am just testing back-end -->
  <!-- <UserRegister /> -->
  <!-- <UserLogin /> -->
  <!-- <ForgotPassword /> -->
  <!-- <ResetPassword /> -->

  <button class="bg-black text-white py-4 rounded-xl mt-6 font-semibold" @click="onLogout">
    Log out
  </button>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue'
import cover1 from '@/assets/images/cover1.png'
import cover2 from '@/assets/images/cover2.png'
import cover3 from '@/assets/images/cover3.png'
import { ref } from 'vue'
import { getCsrfCookie, logoutUser } from '@/service/authService.js'
import UserRegister from '@/components/Sessions/UserRegister.vue'
import UserLogin from '@/components/Sessions/UserLogin.vue'
import ForgotPassword from '@/components/Sessions/ForgotPassword.vue'
import ResetPassword from '@/components/Sessions/ResetPassword.vue'

// Same Here
// const showSignupModal = ref(false)
// const showLoginModal = ref(false)
// const showResetPasswordModal = ref(false)
// const showForgotPasswordModal = ref(false)

// No idea when and how to close modals, so...
// const toggleSignupModal = () => (showSignupModal.value = !showSignupModal.value)
// const toggleLoginModal = () => (showLoginModal.value = !showLoginModal.value)
// const toggleResetPasswordModal = () =>
//   (showResetPasswordModal.value = !showResetPasswordModal.value)
// const toggleForgotPasswordModal = () =>
//   (showForgotPasswordModal.value = !showForgotPasswordModal.value)

const onLogout = async () => {
  await getCsrfCookie()
  try {
    await logoutUser()
    localStorage.removeItem('isLoggedIn')
  } catch (error) {
    //
  }
}
</script>
