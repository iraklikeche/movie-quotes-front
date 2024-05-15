<template>
  <ToastModal v-if="userSession.successModal" v-bind="userSession.modalContent as any" />
  <main class="bg-gradient-to-b from-gray-900 to-black h-screen">
    <TheHeader />

    <div class="flex items-center justify-center flex-col gap-10 pb-32 h-full">
      <h2
        class="text-center text-2xl sm:text-6xl font-bold text-[#ddCCAA] flex flex-col gap-2 sm:gap-6"
      >
        {{ $t('texts.homeMainText') }}<span> {{ $t('texts.MainTextSpan') }}</span>
      </h2>
      <button
        class="bg-custom-red text-white px-4 py-2 text-sm rounded-lg sm:text-xl"
        @click="userSession.toggleRegister"
      >
        {{ $t('buttons.get_started') }}
      </button>
    </div>
  </main>
  <section>
    <MovieCover :coverImage="cover1" :movieTitleKey="'interstellar_title'">
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
import ToastModal from '@/components/ToastModal.vue'
const { t: $t } = useI18n()

const userSession = useUserSessionStore()
const route = useRoute()

const verificationMessage = ref('')

const extractIDFromURL = (url: string): number | null => {
  const regex = /\/verify\/(\d+)/
  const match = url.match(regex)
  return match ? parseInt(match[1]) : null
}
onMounted(async () => {
  const verifyUrl = route.query.verify_url
  if (typeof verifyUrl === 'string') {
    const url = new URL(verifyUrl)
    const email = url.searchParams.get('email')

    if (email === null) {
      verificationMessage.value = 'No email provided in the verification URL.'
      return
    }
    try {
      const response = await verifyEmail(verifyUrl)

      verificationMessage.value = 'Your email has been successfully verified.'

      userSession.setModalContent(
        {
          icon: 'Success',
          mainMessage: $t('texts.thanks'),
          subMessage: $t('texts.subMessage'),
          buttonText: $t('buttons.login')
        },
        () => userSession.backToLogIn()
      )
      console.log(response)
    } catch (error: any) {
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
            const userId = extractIDFromURL(decodeURIComponent(verifyUrl))
            if (userId !== null) {
              try {
                const resendResponse = await resendVerificationLink(userId)
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
                }
              } catch (error: any) {
                verificationMessage.value =
                  error.response?.data.message || 'Failed to process your request.'
              }
            }
          }
        )
      }
    }
  }
})
</script>
