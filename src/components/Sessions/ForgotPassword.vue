<template>
  <TheModal
    header="Forgot password?"
    paragraph="Enter the email and we'll send an email with instruction to reset your password"
    sessionButton="Back to log in"
    class="top-0 w-full"
  >
    <Form @submit="onSubmit" class="flex flex-col gap-5" v-slot="{ errors }">
      <CustomInput
        label="Email"
        name="email"
        placeholder="example@gmail.com"
        type="email"
        rules="required|email"
        :serverError="errors.email"
      />

      <button class="bg-black text-white py-4 rounded-xl mt-6 font-semibold">Sign Up</button>
    </Form>
  </TheModal>
</template>

<script setup lang="ts">
import CustomInput from '../Form/CustomInput.vue'
import { forgotPassword, getCsrfCookie } from '@/service/authService.js'
import { Form } from 'vee-validate'
import TheModal from '../TheModal.vue'
</script>
