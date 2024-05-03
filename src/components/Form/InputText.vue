<template>
  <div class="flex flex-col relative">
    <label class="text-white text-sm mb-1"
      >{{ label }}<span class="text-red-500 ml-1">*</span></label
    >
    <Field
      :type="inputType"
      :name="name"
      :placeholder="placeholder"
      class="bg-[#ced4da] block w-full px-3 py-2 border-2 rounded-md"
      :class="{ 'border-red-500': serverError }"
      :validateOnInput="true"
      :validateOnBlur="false"
      :rules="rules"
    />
    <div v-if="serverError" class="absolute right-2 top-[38%] translate-y-1/2 -translate-x-1/2">
      <ErrorIcon />
    </div>

    <div class="h-4">
      <ErrorMessage :name="name" class="text-[#F04438] text-sm mt-1 mb-2 leading-3" />

      <ShowPassword
        v-if="isPasswordField && !serverError"
        :customClass="'absolute top-[45%] right-[4%] cursor-pointer'"
        @toggle="togglePasswordVisibility"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
</script>
