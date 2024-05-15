<template>
  <div class="relative sm:flex sm:items-center gap-8 sm:max-w-[28.5rem] sm:flex-col">
    <div
      class="border border-custom-gray border-opacity-20 hidden sm:block mt-8 px-8 py-5 rounded-md w-full"
    >
      <p class="text-white">{{ $t('texts.password_contain') }}:</p>
      <ul class="mt-4">
        <li :class="{ 'text-green-500': isLengthValid, 'text-[#9C9A9A]': !isLengthValid }">
          * 8 {{ $t('texts.password_validation_length') }}
        </li>
        <li :class="{ 'text-green-500': isCaseValid, 'text-[#9C9A9A]': !isCaseValid }">
          * 15 {{ $t('texts.password_validation_case') }}
        </li>
      </ul>
    </div>
    <div class="mt-8 hidden sm:block sm:w-full">
      <div class="flex flex-col">
        <label class="text-white mb-1">{{ $t('sessions.new_password') }}</label>
        <div class="relative sm:flex sm:items-center gap-8">
          <div class="sm:w-full">
            <Field
              name="new_password"
              type="password"
              v-model="newPassword"
              :placeholder="$t('sessions.password_placeholder')"
              class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
              :rules="'required|min:3|max:15'"
              :validateOnInput="true"
            />
          </div>
        </div>
        <ErrorMessage name="new_password" class="text-red-500" />
      </div>

      <div class="flex flex-col mt-8">
        <label class="text-white mb-1">{{ $t('sessions.confirm_new_password') }}</label>
        <div class="relative sm:flex sm:items-center gap-8">
          <div class="sm:w-full">
            <Field
              name="new_password_confirmation"
              type="password"
              :rules="'confirmed:@new_password'"
              class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
              :validateOnInput="true"
            />
          </div>
        </div>
        <ErrorMessage name="new_password_confirmation" class="text-red-500" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Field, ErrorMessage } from 'vee-validate'

const newPassword = ref('')
const isLengthValid = computed(() => {
  return newPassword.value.length >= 8
})

const isCaseValid = computed(() => {
  return /^[a-z]{1,15}$/.test(newPassword.value)
})
</script>
