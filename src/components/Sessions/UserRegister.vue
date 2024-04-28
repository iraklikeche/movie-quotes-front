<template>
  <TheModal
    :header="$t('sessions.header')"
    :paragraph="$t('sessions.subheader')"
    secondaryParagraph="Already have an account?"
    sessionButton="Log in"
    class="top-0 w-full sm:w-auto"
  >
    <Form @submit="onSubmit" class="flex flex-col gap-3" v-slot="{ errors }">
      <CustomInput
        :label="$t('sessions.username')"
        name="username"
        :placeholder="$t('sessions.username_placeholder')"
        rules="required|min:3"
        type="text"
        :serverError="errors.username"
      />

      <CustomInput
        :label="$t('sessions.email')"
        name="email"
        :placeholder="$t('sessions.email_placeholder')"
        type="email"
        rules="required|email"
        :serverError="errors.email"
      />

      <CustomInput
        :label="$t('sessions.password')"
        name="password"
        rules="required|min:3"
        :placeholder="$t('sessions.password_placeholder')"
        isPasswordField
        :serverError="errors.password"
      />

      <CustomInput
        type="password"
        :label="$t('sessions.conf_password')"
        name="password_confirmation"
        :placeholder="$t('sessions.conf_password_placeholder')"
        isPasswordField
        rules="confirmed:@password_confirmation"
        :serverError="errors.password_confirmation"
      />

      <button class="bg-[#e31221] py-2 text-white rounded-md mb-2">
        {{ $t('buttons.get_started') }}
      </button>
      <button
        class="bg-black sm:bg-transparent border border-white py-2 rounded-md flex items-center gap-2 justify-center text-white"
      >
        <GoogleIcon /> {{ $t('buttons.google') }}
      </button>
    </Form>
    <div class="flex items-center justify-center mt-4">
      <p class="flex gap-2">
        <span class="text-[#6c757d]"> {{ $t('texts.already_register') }}? </span>
        <button class="text-[#0d6efd] underline" @click="userSession.toggleLogin">
          {{ $t('buttons.login') }}
        </button>
      </p>
    </div>
  </TheModal>
</template>

<script setup lang="ts">
import CustomInput from '../Form/CustomInput.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
import { registerUser, getCsrfCookie } from '@/service/authService.js'
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()

interface FormValues {
  username: string
  email: string
  password: string
  password_confirmation: string
}

const onSubmit = async (values: FormValues, { setFieldError }) => {
  try {
    await getCsrfCookie()
    await registerUser(values)
    userSession.showRegister = false
    userSession.setModalContent(
      {
        icon: 'SentIcon',
        mainMessage: 'Thank you!',
        subMessage: 'Please check your email to activate your account.',
        buttonText: 'Go to my email'
      },
      () => userSession.redirectToEmailProvider(values.email)
    )
  } catch (err) {
    console.log(err.response.data.errors)
    for (const fieldName in err.response.data.errors) {
      setFieldError(fieldName, err.response.data.errors[fieldName])
    }
  }
}
</script>
