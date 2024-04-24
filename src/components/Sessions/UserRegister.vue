<template>
  <TheModal
    buttonText="Get started"
    header="Create an account"
    paragraph="Start your journey!"
    secondaryParagraph="Already have an account?"
    sessionButton="Log in"
    class="top-0 w-full"
  >
    <Form @submit="onSubmit" class="flex flex-col gap-5" v-slot="{ errors }">
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

      <button class="bg-black text-white py-4 rounded-xl mt-6 font-semibold">Sign Up</button>
    </Form>
  </TheModal>
</template>

<script setup lang="ts">
import CustomInput from '../Form/CustomInput.vue'
import { registerUser, getCsrfCookie } from '@/service/authService.js'
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'

const onSubmit = async (values) => {
  try {
    await getCsrfCookie()
    await registerUser(values)
  } catch (err) {
    console.log(err)
  }
}
</script>
