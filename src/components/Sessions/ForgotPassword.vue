<template>
  <TheModal
    :header="$t('sessions.forgot_password')"
    :paragraph="$t('sessions.forgot_subheader')"
    class="top-0 w-full"
  >
    <Form
      @submit="(values, setFieldError) => onSubmit(values as LoginValues, setFieldError)"
      class="flex flex-col gap-2"
      v-slot="{ errors }"
    >
      <CustomInput
        :label="$t('sessions.email')"
        name="email"
        :placeholder="$t('sessions.email_placeholder')"
        type="email"
        rules="required|email"
        :serverError="errors.email"
      />

      <button class="bg-[#e31221] py-2 rounded-md mb-2 text-white">
        {{ $t('buttons.send_instructions') }}
      </button>
      <button
        @click="userSession.backToLogIn"
        class="bg-transparent text-[#6c757d] py-2 rounded-md mb-2 flex items-center justify-center gap-2"
      >
        <GoBackArrow /> {{ $t('sessions.back_to_login') }}
      </button>
    </Form>
  </TheModal>
</template>

<script setup lang="ts">
import CustomInput from '../Form/CustomInput.vue'
import { forgotPassword, getCsrfCookie } from '@/service/authService'
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'
import GoBackArrow from '@/components/icons/GoBackArrow.vue'
import type { SubmissionHandler } from 'vee-validate'

import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()

type LoginValues = {
  email: string
}
const onSubmit: SubmissionHandler<LoginValues> = async (values: LoginValues, { setFieldError }) => {
  await getCsrfCookie()
  try {
    await forgotPassword(values.email)
    userSession.showForgotPassword = false

    userSession.setModalContent(
      {
        icon: 'SentIcon',
        mainMessage: 'Check your email',
        subMessage: 'We have sent a password recover instructions to your email.',
        buttonText: 'Go to my email'
      },
      () => userSession.redirectToEmailProvider(values.email)
    )
  } catch (error: any) {
    for (const fieldName in error.response.data.errors) {
      setFieldError(fieldName as keyof LoginValues, error.response.data.errors[fieldName])
    }
  }
}
</script>
