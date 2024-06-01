<template>
  <TheModal
    :header="$t('sessions.header')"
    :paragraph="$t('sessions.subheader')"
    secondaryParagraph="Already have an account?"
    sessionButton="Log in"
    class="top-0 w-full sm:w-auto"
  >
    <Form
      @submit="(values, setFieldError) => onSubmit(values as FormValues, setFieldError)"
      class="flex flex-col gap-4"
      v-slot="{ errors }"
    >
      <CustomInput
        :label="$t('sessions.username')"
        name="username"
        :placeholder="$t('sessions.username_placeholder')"
        rules="required|min:3|lowercase"
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
        rules="required|min:8|max:15|lowercase"
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
        rules="confirmed:@password"
        :serverError="errors.password_confirmation"
      />

      <button class="bg-[#e31221] py-2 text-white rounded-md mb-2">
        {{ $t('buttons.get_started') }}
      </button>
      <button
        type="button"
        @click="registerWithGoogle"
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
import { registerUser, getCsrfCookie, signUpWithGoogle } from '@/service/authService'
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import type { SubmissionHandler } from 'vee-validate'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const userSession = useUserSessionStore()

type FormValues = {
  username: string
  email: string
  password: string
  password_confirmation: string
}

const onSubmit: SubmissionHandler<FormValues> = async (values: FormValues, { setFieldError }) => {
  try {
    await getCsrfCookie()
    await registerUser(values)
    userSession.showRegister = false
    userSession.setModalContent(
      {
        icon: 'SentIcon',
        mainMessage: $t('texts.thanks'),
        subMessage: $t('texts.subMessage'),
        buttonText: $t('texts.buttonText')
      },
      () => userSession.redirectToEmailProvider(values.email)
    )
  } catch (err: any) {
    if (err.response?.data?.errors) {
      for (const fieldName in err.response.data.errors) {
        setFieldError(fieldName as keyof FormValues, err.response.data.errors[fieldName])
      }
    }
  }
}

const registerWithGoogle = async () => {
  const res = await signUpWithGoogle()
  window.location.href = res.data
}
</script>
