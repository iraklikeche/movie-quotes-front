<template>
  <div>
    <label class="text-white">{{ $t('sessions.password') }}</label>
    <div class="relative sm:flex sm:items-center gap-8">
      <Field
        name="password"
        type="password"
        class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-[#CED4DA] outline-none w-full sm:px-3 sm:rounded-[4px]"
        disabled
      />
      <span
        @click="() => emit('openMode', 'RESET')"
        class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1 sm:hidden"
        >{{ $t('texts.edit') }}</span
      >
      <span
        @click="() => emit('addNewPassword')"
        class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1 hidden sm:block"
        >{{ $t('texts.edit') }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
const props = defineProps({
  disabled: Boolean
})

const emit = defineEmits(['openMode', 'addNewPassword'])
</script>
