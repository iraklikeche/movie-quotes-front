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
    <div class="overflow-hidden relative w-full h-screen">
      <div class="py-6 bg-black outline-none absolute pointer-events-none"></div>
      <img :src="cover1" class="h-full w-full -z-10 absolute pointer-events-none" />
      <p>123</p>
    </div>
    <div class="overflow-hidden relative w-full h-screen">
      <img :src="cover2" class="h-full w-full -z-10 absolute pointer-events-none" />
      <p>123</p>
    </div>
    <div class="overflow-hidden relative w-full h-screen">
      <img :src="cover3" class="h-full w-full -z-10 absolute pointer-events-none" />
      <p>123</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue'
import cover1 from '@/assets/images/cover1.png'
import cover2 from '@/assets/images/cover2.png'
import cover3 from '@/assets/images/cover3.png'
import { getCsrfCookie, logoutUser } from '@/service/authService.js'
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
