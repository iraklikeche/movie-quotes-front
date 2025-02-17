<template>
  <div class="flex flex-col relative">
    <label class="text-white text-sm mb-1"
      >{{ label }}<span class="text-red-500 ml-1">*</span></label
    >
    <Field
      :type="inputType"
      :name="name"
      :placeholder="placeholder"
      @input="typed = true"
      class="bg-custom-gray block w-full px-3 py-2 border-2 border-custom-gray focus:ring-[3px] outline-none focus:border-custom-gray focus:border-transparent rounded-md"
      :class="{
        'border-green-500': !serverError && typed,
        'border-red-500': serverError
      }"
      :validateOnInput="true"
      :validateOnBlur="false"
      :rules="rules"
    />

    <div
      class="absolute top-[35%] translate-y-1/2 -translate-x-1/2"
      :class="{
        'right-2': !isPasswordField,
        'right-10': isPasswordField
      }"
      v-if="!serverError && typed"
    >
      <ValidInput />
    </div>

    <div
      v-if="serverError"
      class="absolute top-[35%] translate-y-1/2 -translate-x-1/2"
      :class="{
        'right-2': !isPasswordField,
        'right-10': isPasswordField
      }"
    >
      <ErrorIcon />
    </div>

    <div class="h-4">
      <ErrorMessage :name="name" class="text-[#F04438] text-sm mt-1 mb-2 leading-3" />

      <HidePassword
        v-if="isPasswordField && isPasswordVisible"
        class="absolute top-[45%] right-[4%] cursor-pointer"
        @toggle="togglePasswordVisibility"
        @click="isPasswordVisible = false"
      />

      <ShowPassword
        v-if="isPasswordField && !isPasswordVisible"
        :customClass="'absolute top-[45%] right-[4%] cursor-pointer'"
        @toggle="togglePasswordVisibility"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Field, ErrorMessage } from 'vee-validate'
import ShowPassword from '@/components/icons/ShowPassword.vue'
import ErrorIcon from '../icons/ErrorIcon.vue'
import HidePassword from '@/components/icons/HidePassword.vue'
import ValidInput from '@/components/icons/ValidInput.vue'

const props = defineProps({
  label: String,
  type: String,
  name: String,
  placeholder: String,
  rules: String,
  isPasswordField: Boolean,
  serverError: String,
  error: String
})

const isPasswordVisible = ref(false)
const typed = ref(false)

const inputType = computed(() => {
  return props.isPasswordField ? (isPasswordVisible.value ? 'text' : 'password') : props.type
})

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
