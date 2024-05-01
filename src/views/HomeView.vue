<template>
  <main class="bg-gradient-to-b from-gray-900 to-black h-screen">
    <TheHeader />
    <div class="flex items-center justify-center flex-col gap-10 pb-32 h-full">
      <h2
        class="text-center text-2xl sm:text-6xl font-bold text-[#ddCCAA] flex flex-col gap-2 sm:gap-6"
      >
        {{ $t('texts.homeMainText') }}<span> {{ $t('texts.MainTextSpan') }}</span>
      </h2>
      <button
        class="bg-[#e31221] text-white px-4 py-2 text-sm rounded-lg sm:text-xl"
        @click="userSession.toggleRegister"
      >
        {{ $t('buttons.get_started') }}
      </button>
    </div>
  </main>
  <section class="">
    <MovieCover :coverImage="cover1" :movieTitleKey="'interstellar_title'" R>
      {{ $t('movieQuotes.interstellar_quote') }}
      <br class="hidden sm:block" />
      <span> {{ $t('movieQuotes.interstellar_quote_part') }} </span>
    </MovieCover>

    <MovieCover :coverImage="cover3" :movieTitleKey="'royal_tenenbaums_title'">
      <p>
        <span> {{ $t('movieQuotes.royal_tenenbaums_quote_1') }} </span>
        <br class="hidden sm:block" />

        <span> {{ $t('movieQuotes.royal_tenenbaums_quote_2') }} </span>
        <br class="hidden sm:block" />

        <span> {{ $t('movieQuotes.royal_tenenbaums_quote_3') }} </span>
        <br class="hidden sm:block" />

        <span> {{ $t('movieQuotes.royal_tenenbaums_quote_4') }} </span>
      </p>
    </MovieCover>

    <MovieCover :coverImage="cover2" :movieTitleKey="'lotr_title'" customClass="pt-96">
      <p>
        <span> {{ $t('movieQuotes.lotr_quote_1') }} </span>
        <br class="hidden sm:block" />

        <span> {{ $t('movieQuotes.lotr_quote_2') }} </span>
        <br class="hidden sm:block" />

        <span> {{ $t('movieQuotes.lotr_quote_3') }} </span>
      </p>
    </MovieCover>
  </section>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue'
import cover1 from '@/assets/images/cover1.png'
import cover2 from '@/assets/images/cover2.png'
import cover3 from '@/assets/images/cover3.png'
import { verifyEmail, getCsrfCookie, resendVerificationLink } from '@/service/authService'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MovieCover from '@/components/MovieCover.vue'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()

const userSession = useUserSessionStore()
const route = useRoute()

const verificationMessage = ref('')

const extractIDFromURL = (url: string) => {
  const regex = /\/verify\/(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

onMounted(async () => {
  const verifyUrl = route.query.verify_url
  if (typeof verifyUrl === 'string') {
    try {
      const response = await verifyEmail(verifyUrl)
      if (response.status === 200) {
        verificationMessage.value = 'Your email has been successfully verified.'

        const verified = route.query.verified
        if (verified) {
          userSession.setModalContent(
            {
              icon: 'Success',
              mainMessage: $t('texts.thanks'),
              subMessage: $t('texts.subMessage'),
              buttonText: $t('buttons.login')
            },
            () => userSession.backToLogIn()
          )
        }
        console.log(response)
      } else {
        verificationMessage.value = response.data.message
      }
    } catch (error: any) {
      const userId = extractIDFromURL(decodeURIComponent(verifyUrl))
      if (error.response.status === 403) {
        userSession.setModalContent(
          {
            icon: 'TokenExpired',
            mainMessage: $t('texts.link_expired'),
            subMessage: $t('texts.expired_text'),
            buttonText: $t('texts.expired_btn_text')
          },
          async () => {
            await getCsrfCookie()
            const resendResponse = await resendVerificationLink(userId)
            if (resendResponse.status === 200) {
              verificationMessage.value = 'A new verification link has been sent to your email.'
            } else {
              verificationMessage.value = 'Failed to resend verification link.'
            }
          }
        )
        verificationMessage.value = error.response.data.message
      } else {
        verificationMessage.value = 'An error occurred during the verification process.'
      }
    }
  }
})
</script>
