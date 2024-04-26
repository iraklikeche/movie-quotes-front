<template>
  <TheModal
    buttonText="Get started"
    header="Create new password"
    paragraph="Your new password must be different from previous used passwords"
    class="top-0 w-full"
  >
    <Form @submit="onSubmit" class="flex flex-col gap-5" v-slot="{ errors }">
      <CustomInput
        type="password"
        label="Password"
        name="password"
        rules="required|min:3"
        placeholder="Must be 3 characters"
        isPasswordField
        :serverError="errors.password"
      />

      <CustomInput
        type="password"
        label="Confirm Password"
        name="password_confirmation"
        placeholder="Must be 3 characters"
        isPasswordField
        rules="confirmed:@password_confirmation"
        :serverError="errors.password_confirmation"
      />

      <button class="bg-[#e31221] py-2 rounded-md mb-2 text-white">Reset Password</button>
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
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'
import GoBackArrow from '@/components/icons/GoBackArrow.vue'
import { resetPassword, getCsrfCookie } from '@/service/authService.js'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()

const token = ref('')
const email = ref('')

const route = useRoute()

onMounted(() => {
  token.value = route.query.token
  email.value = route.query.email
})

const onSubmit = async (values, { resetForm, setFieldError }) => {
  try {
    await getCsrfCookie()
    const data = await resetPassword({
      token: token.value,
      email: email.value,
      password: values.password,
      password_confirmation: values.password_confirmation
    })
    resetForm()
    userSession.backToLogIn()
  } catch (error) {
    console.log(error)
  }
}
</script>
