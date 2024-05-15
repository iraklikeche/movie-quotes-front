<template>
  <div>
    <label class="text-white">{{ $t('sessions.password') }}</label>
    <div class="relative sm:flex sm:items-center gap-8">
      <Field
        name="password"
        type="password"
        class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none w-full sm:px-3 sm:rounded-[4px] sm:max-w-[28.5rem]"
        disabled
      />
      <span
        @click="() => emit('openMode', 'RESET')"
        class="text-custom-gray absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1 sm:hidden"
        >{{ $t('texts.edit') }}</span
      >
      <span
        @click="() => emit('addNewPassword', hideSpan())"
        v-if="isSpanHidden"
        class="text-custom-gray absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1 hidden sm:block"
        >{{ $t('texts.edit') }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
import { useShowEditSpan } from '@/composables/useShowEditSpan'

const { isSpanHidden, hideSpan } = useShowEditSpan()

const emit = defineEmits(['openMode', 'addNewPassword'])
</script>
