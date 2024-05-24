<template>
  <div class="bg-[#09101c] px-8 py-4 rounded-xl">
    <div class="flex items-center gap-4">
      <div>
        <img
          v-if="quote.user.profile_image_url"
          :src="quote.user.profile_image_url"
          class="w-10 h-10 rounded-full"
        />
        <img v-else src="https://picsum.photos/200" class="w-10 h-10 rounded-full" />
      </div>
      <span class="text-white">{{ quote.user.username }}</span>
    </div>
    <div class="flex flex-col gap-2 mt-2 border-b border-border-gray border-opacity-30 pb-4">
      <p class="text-white">
        {{ quote.content[typedLocale] }}, {{ $t('texts.movie') }} -
        {{ quote.movie.name[typedLocale] }}. ({{ quote.movie.year }})
      </p>
      <img :src="quote.image_url" class="rounded-xl w-full max-h-52 sm:max-h-[31rem]" alt="" />

      <QuoteStats :quote="quote" />
    </div>

    <QuoteComments :quoteId="quote.id" />
  </div>
</template>

<script setup lang="ts">
import type { Quote } from '@/types'
import QuoteStats from './QuoteStats.vue'
import QuoteComments from './QuoteComments.vue'
import { useI18n } from 'vue-i18n'
type Locale = 'en' | 'ka'

const { locale } = useI18n()
const typedLocale = locale as unknown as Locale
defineProps<{
  quote: Quote
}>()
</script>
