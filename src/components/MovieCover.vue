<template>
  <div class="overflow-hidden relative w-full h-screen">
    <img :src="coverImage" class="h-full w-full -z-10 absolute pointer-events-none" />
    <div class="h-full flex flex-col justify-center pl-8 sm:pl-48 pt-10 sm:pt-0">
      <div class="text-white text-xl sm:text-5xl flex items-start font-bold" :class="customClass">
        <span class="inline-block w-4 sm:w-8 border-b-2 border-white mr-3 pt-3 sm:pt-5"></span>
        <div>
          <p class="flex flex-col sm:gap-3">
            <span
              v-for="(part, index) in mainQuote"
              :key="index"
              class="text-2xl sm:text-5xl font-bold"
              >{{ part }}</span
            >
          </p>
          <p class="text-white font-bold mt-2 sm:mt-3">{{ movieTitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

type Props = {
  coverImage: string
  mainQuote: string[]
  movieTitle: string
  customClass?: string
}

const props = defineProps<Props>()
</script>
