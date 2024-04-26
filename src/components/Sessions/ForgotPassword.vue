<template>
  <TheModal
    header="Forgot password?"
    paragraph="Enter the email and we'll send an email with instruction to reset your password"
    class="top-0 w-full"
  >
    <Form @submit="onSubmit" class="flex flex-col gap-2" v-slot="{ errors }">
      <CustomInput
        label="Email"
        name="email"
        placeholder="example@gmail.com"
        type="email"
        rules="required|email"
        :serverError="errors.email"
      />

      <button class="bg-[#e31221] py-2 rounded-md mb-2 text-white">Send instructions</button>
      <button
        @click="userSession.backToLogIn"
        class="bg-transparent text-[#6c757d] py-2 rounded-md mb-2 flex items-center justify-center gap-2"
      >
        <GoBackArrow /> Back to log in
      </button>
    </Form>
  </TheModal>
</template>

<script setup lang="ts">
import CustomInput from '../Form/CustomInput.vue'
import { forgotPassword, getCsrfCookie } from '@/service/authService.js'
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'
import GoBackArrow from '@/components/icons/GoBackArrow.vue'

import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()

const onSubmit = async (values, { setFieldError, resetForm }) => {
  await getCsrfCookie()
  try {
    await forgotPassword(values.email)
    resetForm()
    userSession.showForgotPassword = false

    userSession.setModalContent({
      icon: 'SentIcon',
      mainMessage: 'Check your email',
      subMessage: 'We have sent a password recover instructions to your email.',
      buttonText: 'Go to my email'
    })
  } catch (error) {
    //
  }
}
</script>
