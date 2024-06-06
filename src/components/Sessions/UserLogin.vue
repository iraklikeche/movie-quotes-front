<template>
  <TheModal
    :header="$t('sessions.login_header')"
    :paragraph="$t('sessions.login_subheader')"
    secondaryParagraph="Don't have an account?"
    sessionButton="sign up"
    class="top-0 w-full"
  >
    <Form
      @submit="(values, setFieldError) => onSubmit(values as LoginValues, setFieldError)"
      class="flex flex-col max-w-[26rem]"
      v-slot="{ errors }"
    >
      <CustomInput
        :label="$t('sessions.email')"
        name="login"
        :placeholder="$t('sessions.email_placeholder')"
        rules="required"
        :serverError="errors.login"
        class="mb-8"
      />

      <CustomInput
        :label="$t('sessions.password')"
        name="password"
        rules="required|min:8|max:15"
        :placeholder="$t('sessions.login_password_placeholder')"
        isPasswordField
        :serverError="errors.password"
        class="mb-3"
      />

      <div class="flex justify-between items-center gap-2">
        <label for="remember" class="flex items-center gap-2 cursor-pointer">
          <Field
            id="remember"
            name="remember"
            type="checkbox"
            v-model="remember"
            value="true"
            :serverError="errors.remember"
          />
          <span class="text-white">{{ $t('sessions.remember') }}</span>
        </label>
        <button
          class="text-[#0d6efd] underline"
          @click="userSession.toggleForgotPassword"
          type="button"
        >
          {{ $t('sessions.forgot_password') }}
        </button>
      </div>

      <button
        type="submit"
        class="bg-custom-red py-2 rounded-md my-4 text-white hover:bg-red-500 transition-all"
      >
        {{ $t('buttons.login') }}
      </button>
      <button
        type="button"
        @click="registerWithGoogle"
        class="bg-transparent border border-white py-2 rounded-md flex items-center gap-2 justify-center text-white"
      >
        <GoogleIcon /> {{ $t('buttons.login_google') }}
      </button>
    </Form>

    <div class="flex items-center justify-center mt-4">
      <p class="flex gap-2">
        <span class="text-[#6c757d]">{{ $t('sessions.not_register') }}? </span>
        <button class="text-[#0d6efd] underline" @click="userSession.toggleRegister">
          {{ $t('buttons.signup') }}
        </button>
      </p>
    </div>
  </TheModal>
</template>

<script setup lang="ts">
import { getCsrfCookie, loginUser, signUpWithGoogle } from '@/service/authService'
import CustomInput from '../Form/CustomInput.vue'
import { Form, Field } from 'vee-validate'
import TheModal from '../TheModal.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { SubmissionHandler } from 'vee-validate'

type LoginValues = {
  login: string
  password: string
  remember?: boolean
}

const userSession = useUserSessionStore()

const router = useRouter()
const remember = ref(false)

const onSubmit: SubmissionHandler<LoginValues> = async (values: LoginValues, { setFieldError }) => {
  await getCsrfCookie()
  values.remember = remember.value
  try {
    await loginUser({
      login: values.login,
      password: values.password,
      remember: values.remember
    })
    userSession.showLogin = false
    localStorage.setItem('isLoggedIn', 'true')
    router.push('/dashboard')
  } catch (error: any) {
    if (error.response?.data?.message) {
      setFieldError('login', error.response.data.message)
    }
  }
}

const registerWithGoogle = async () => {
  const res = await signUpWithGoogle()
  window.location.href = res.data
}
</script>
