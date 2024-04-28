<template>
  <div class="overflow-hidden relative w-full h-screen">
    <img :src="coverImage" class="h-full w-full -z-10 absolute pointer-events-none" />
    <div class="h-full flex flex-col justify-center pl-8 sm:pl-36 pt-10 sm:pt-0">
      <div class="text-white text-xl sm:text-5xl flex items-start font-bold" :class="customClass">
        <span class="inline-block w-4 sm:w-12 border-b-2 border-white mr-3 pt-3 sm:pt-5"></span>
        <div>
          <slot />

          <p class="text-[#D9D9D9] font-bold mt-2 sm:mt-5 sm:text-3xl">
            {{ $t(`movieQuotes.${movieTitleKey}`) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

type Props = {
  coverImage: string

  movieTitleKey: string
  customClass?: string
}

const props = defineProps<Props>()
</script>
