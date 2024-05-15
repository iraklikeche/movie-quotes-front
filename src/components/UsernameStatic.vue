<template>
  <div>
    <label class="text-white mb-1">{{ $t('sessions.username') }}</label>
    <div class="relative sm:flex sm:items-center gap-8">
      <Field
        name="username"
        type="text"
        class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
        disabled
      />
      <span
        @click="() => emit('openMode', 'EDIT')"
        class="text-custom-gray absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer sm:hidden"
        >{{ $t('texts.edit') }}</span
      >
      <span
        @click="() => emit('addNewUser', hideSpan())"
        v-if="isSpanHidden"
        class="text-custom-gray absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer hidden sm:block"
        >{{ $t('texts.edit') }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { Field } from 'vee-validate'
import { useShowEditSpan } from '@/composables/useShowEditSpan'

const { isSpanHidden, hideSpan } = useShowEditSpan()

const emit = defineEmits(['openMode', 'addNewUser'])
</script>
