<template>
  <TheModal
    :header="$t('sessions.reset_header')"
    :paragraph="$t('sessions.reset_subheader')"
    class="top-0 w-full"
  >
    <Form
      @submit="
        (values, setFieldError) => onSubmit(values as ResetPasswordFormValues, setFieldError)
      "
      class="flex flex-col gap-5"
      v-slot="{ errors }"
    >
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

      <button class="bg-[#e31221] py-2 rounded-md mb-2 text-white">
        {{ $t('sessions.reset_header') }}
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
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'
import GoBackArrow from '@/components/icons/GoBackArrow.vue'
import { resetPassword, getCsrfCookie } from '@/service/authService'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import type { SubmissionHandler } from 'vee-validate'

const userSession = useUserSessionStore()

type ResetPasswordFormValues = {
  password: string
  password_confirmation: string
}

const token = ref<string>('')
const email = ref<string>('')

const route = useRoute()

onMounted(() => {
  token.value = (route.query.token as string) || ''
  email.value = (route.query.email as string) || ''
})

const onSubmit: SubmissionHandler<ResetPasswordFormValues> = async (
  values: ResetPasswordFormValues,
  { setFieldError }
) => {
  try {
    await getCsrfCookie()
    await resetPassword({
      token: token.value,
      email: email.value,
      password: values.password,
      password_confirmation: values.password_confirmation
    })
    userSession.showResetPassword = false

    userSession.setModalContent(
      {
        icon: 'Success',
        mainMessage: 'Success!',
        subMessage: 'Your Password changed successfully',
        buttonText: 'Log in'
      },
      () => userSession.backToLogIn()
    )
  } catch (error: any) {
    if (error.response.data.errors) {
      console.log(error)
      for (const fieldName in error.response.data.errors) {
        setFieldError(
          fieldName as keyof ResetPasswordFormValues,
          error.response.data.errors[fieldName]
        )
      }
    }
  }
}
</script>
