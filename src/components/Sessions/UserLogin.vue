<template>
  <TheModal
    buttonText="Sign in"
    header="Log in to your account"
    paragraph="Welcome back! please enter your details."
    secondaryParagraph="Don't have an account?"
    sessionButton="sign up"
    class="top-0 w-full"
  >
    <Form @submit="onSubmit" class="flex flex-col max-w-[26rem]" v-slot="{ errors }">
      <CustomInput
        label="Email"
        name="email"
        placeholder="example@gmail.com"
        type="email"
        :serverError="errors.email"
        rules="required|email"
      />

      <CustomInput
        type="password"
        label="Password"
        name="password"
        rules="required"
        placeholder="Must be 3 characters"
        isPasswordField
        :serverError="errors.password"
      />

      <div class="flex justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <input type="checkbox" />
          <label>Remember me</label>
        </div>
        <button class="text-[#0d6efd] underline">Forgot password</button>
      </div>

      <button class="bg-black text-white py-4 rounded-xl mt-6 font-semibold">Log in</button>
    </Form>
  </TheModal>
</template>

<script setup lang="ts">
import { getCsrfCookie, loginUser } from '@/service/authService.js'
import CustomInput from '../Form/CustomInput.vue'
import { Form, Field } from 'vee-validate'
import TheModal from '../TheModal.vue'

const onSubmit = async (values, { setFieldError }) => {
  await getCsrfCookie()
  try {
    const response = await loginUser({
      email: values.email,
      password: values.password,
      remember: values.remember
    })
    localStorage.setItem('isLoggedIn', true)
  } catch (error) {
    // if (error.response.data.errors) {
    //   for (const fieldName in error.response.data.errors) {
    //     setFieldError(fieldName, error.response.data.errors[fieldName])
    //   }
    console.log(error)
    // } else {
    //   console.log(1);
    //   // setFieldError('email', error.response.data.message)
    // }
  }
}
</script>
