<template>
  <div class="">
    <TheHeader class="bg-[#222030]" />
    <div class="py-6 bg-[#11101A]">
      <div class="px-8">
        <GoBackBtn />
      </div>
    </div>
    <div class="bg-[#222030] py-8">
      <div class="flex flex-col justify-center items-center">
        <img :src="profile" class="rounded-full max-h-48 min-w-48 max-w-48" />
        <p class="text-white text-xl">Upload new photo</p>
      </div>
      <div>
        <Form class="flex flex-col gap-3 px-8 mt-16" v-slot="{ errors }">
          <CustomInput
            :label="$t('sessions.username')"
            name="username"
            :placeholder="$t('sessions.username_placeholder')"
            rules="required|min:3"
            type="text"
            :serverError="errors.username"
            :additionalClass="{ 'bg-transparent border-b': true }"
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
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import GoBackBtn from '@/components/icons/GoBackBtn.vue'
import profile from '@/assets/images/profile.png'
import { Form } from 'vee-validate'
</script>
