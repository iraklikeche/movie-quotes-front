<template>
  <TheModal
    buttonText="Get started"
    header="Create an account"
    paragraph="Start your journey!"
    secondaryParagraph="Already have an account?"
    sessionButton="Log in"
    class="top-0 w-full sm:w-auto"
  >
    <Form @submit="onSubmit" class="flex flex-col gap-3" v-slot="{ errors }">
      <CustomInput
        label="Username"
        name="username"
        placeholder="Your username"
        rules="required|min:3"
        type="text"
        :serverError="errors.username"
      />

      <CustomInput
        label="Email"
        name="email"
        placeholder="example@gmail.com"
        type="email"
        rules="required|email"
        :serverError="errors.email"
      />

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

      <button class="bg-[#e31221] py-2 text-white rounded-md mb-2">Get started</button>
      <button
        class="bg-black sm:bg-transparent border border-white py-2 rounded-md flex items-center gap-2 justify-center text-white"
      >
        <GoogleIcon /> Sign up with Google
      </button>
    </Form>
    <div class="flex items-center justify-center mt-4">
      <p class="flex gap-2">
        <span class="text-[#6c757d]"> Already have an account? </span>
        <button class="text-[#0d6efd] underline" @click="userSession.toggleLogin">Log in</button>
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
import { onMounted } from 'vue'

const userSession = useUserSessionStore()
onMounted(() => console.log(userSession))
console.log(userSession)

const onSubmit = async (values) => {
  try {
    await getCsrfCookie()
    await registerUser(values)
    userSession.showRegister = false
    userSession.setModalContent({
      icon: 'SentIcon',
      mainMessage: 'Thank you!',
      subMessage: 'Please check your email to activate your account.',
      buttonText: 'Go to my email'
    })
  } catch (err) {
    console.log(err)
  }
}
</script>
