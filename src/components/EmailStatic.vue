<template>
  <div class="flex flex-col">
    <label class="text-white mb-1">{{ $t('sessions.email') }}</label>
    <div class="relative sm:flex sm:items-center gap-8">
      <Field
        name="email"
        type="email"
        class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
        disabled
      />
    </div>
  </div>
</template>

<script setup>
import { Field } from 'vee-validate'
</script>
