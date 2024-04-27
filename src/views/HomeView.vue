<template>
  <main class="bg-gradient-to-b from-gray-900 to-black h-screen">
    <TheHeader />
    <div class="flex items-center justify-center flex-col gap-10 pb-32 h-full">
      <h2
        class="text-center text-2xl sm:text-6xl font-bold text-[#ddCCAA] flex flex-col gap-2 sm:gap-6"
      >
        Find any quote in <span> millions of movie lines</span>
      </h2>
      <button
        class="bg-[#e31221] text-white px-4 py-2 text-sm rounded-lg sm:text-xl"
        @click="userSession.toggleRegister"
      >
        Get started
      </button>
    </div>
  </main>
  <section class="">
    <!-- <div class="overflow-hidden relative w-full h-screen">
      <div class="py-6 bg-black outline-none absolute pointer-events-none"></div>
      <img :src="cover1" class="h-full w-full -z-10 absolute pointer-events-none" />
      <div class="h-full flex flex-col justify-center pl-8 sm:pl-48 pt-10 sm:pt-0">
        <div class="text-white text-xl flex items-start font-bold">
          <span class="inline-block w-4 sm:w-8 border-b-2 border-white mr-3 pt-3"></span>
          <div>
            <p class="sm:text-5xl flex flex-col">
              “You have to leave something <span> behind to go forward” </span>
            </p>
            <p class="text-white font-bold mt-2 sm:text-3xl sm:mt-3">Interstellar, 2014</p>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-hidden relative w-full h-screen">
      <img :src="cover2" class="h-full w-full -z-10 absolute pointer-events-none" />
      <div class="h-full flex flex-col justify-center pl-8 pt-10">
        <div class="text-white text-xl sm:text-5xl flex items-start font-bold">
          <span class="inline-block w-4 border-b-2 border-white mr-3 pt-3"></span>
          <div>
            <p class="sm:text-3xl flex flex-col">
              “I see in your eyes the same ”<span> fear that would take the</span
              ><span>heart of me....</span>
            </p>
            <p class="text-white font-bold mt-2">The Lord of the Rings, 2003</p>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-hidden relative w-full h-screen">
      <img :src="cover3" class="h-full w-full -z-10 absolute pointer-events-none" />
      <div class="h-full flex flex-col justify-center pl-8 pt-10">
        <div class="text-white text-xl sm:text-5xl flex items-start font-bold">
          <span class="inline-block w-4 border-b-2 border-white mr-3 pt-3"></span>
          <div>
            <p class="sm:text-3xl flex flex-col">
              “I think we’re just gonna <span>have to be secretly in love</span> with each other and
              <span> leave it that” </span>
            </p>
            <p class="text-white font-bold mt-2">The Royal Tenenbaums,2001</p>
          </div>
        </div>
      </div>
    </div> -->
    <MovieCover
      :coverImage="cover1"
      :mainQuote="['“You have to leave something ', 'behind to go forward”']"
      movieTitle="Interstellar, 2014"
    />

    <MovieCover
      :coverImage="cover3"
      :mainQuote="[
        '“I think we’re just gonna ',
        'have to be secretly in love ',
        'with each other and ',
        'leave it that”'
      ]"
      movieTitle="The Royal Tenenbaums, 2001"
    />

    <MovieCover
      :coverImage="cover2"
      :mainQuote="['“I see in your eyes the same ', 'fear that would take the', 'heart of me...”']"
      movieTitle="The Lord of the Rings, 2003"
      customClass="pt-96"
    />
  </section>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue'
import cover1 from '@/assets/images/cover1.png'
import cover2 from '@/assets/images/cover2.png'
import cover3 from '@/assets/images/cover3.png'
import { getCsrfCookie, logoutUser, verifyEmail } from '@/service/authService.js'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MovieCover from '@/components/MovieCover.vue'

const userSession = useUserSessionStore()
const route = useRoute()

const verificationMessage = ref('')

onMounted(async () => {
  const verifyUrl = route.query.verify_url
  if (verifyUrl) {
    try {
      const response = await verifyEmail(verifyUrl)
      if (response.status === 200) {
        verificationMessage.value = 'Your email has been successfully verified.'
        console.log(response)
      } else {
        verificationMessage.value = response.data.message
      }
    } catch (error) {
      if (error.response) {
        verificationMessage.value = error.response.data.message
      } else {
        verificationMessage.value = 'An error occurred during the verification process.'
      }
    }
  }
})

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
