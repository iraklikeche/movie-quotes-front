<template>
  <div class="flex flex-col">
    <label class="text-white mb-1">{{ $t('sessions.email') }}</label>
    <div class="relative sm:flex sm:items-center gap-8">
      <Field
        name="email"
        type="email"
        class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
        disabled
      />
      <div
        class="text-red-500 opacity-0 absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0"
      >
        {{ $t('texts.edit') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { Field } from 'vee-validate'
</script>
