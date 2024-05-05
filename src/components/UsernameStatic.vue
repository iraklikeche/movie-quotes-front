<template>
  <div>
    <label class="text-white mb-1">{{ $t('sessions.username') }}</label>
    <div class="relative sm:flex sm:items-center gap-8">
      <div class="sm:w-full">
        <Field
          name="username"
          type="text"
          class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
          :disabled="disabled"
        />
      </div>
      <span
        @click="() => emit('openMode', 'EDIT')"
        class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer sm:hidden"
        >{{ $t('texts.edit') }}</span
      >
      <span
        @click="() => emit('addNewUser')"
        class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer hidden sm:block"
        >{{ $t('texts.edit') }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Field } from 'vee-validate'

const props = defineProps({
  disabled: Boolean
})

const emit = defineEmits(['openMode', 'addNewUser'])
</script>
