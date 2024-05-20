<template>
  <TheLayout :customHeight="'min-h-screen'">
    <QuoteModal
      :showModal="showModal"
      @update:showModal="(value) => (showModal = value)"
      @quote-added="fetchQuotes"
    />

    <div class="sm:min-w-[60rem]">
      <div class="flex items-center gap-6">
        <button
          @click="openModal"
          class="flex justify-between px-8 sm:px-0 bg-[#181624] py-6 sm:gap-4 w-full"
        >
          <div class="flex gap-4 items-center sm:bg-[#24222F] sm:w-full sm:py-4 sm:px-4">
            <WriteQuote />
            <span class="text-white">{{ $t('texts.new_quote') }}</span>
          </div>
        </button>
        <div class="hidden sm:flex items-center">
          <SearchIcon />
          <input
            v-model="search"
            @input="updateSearch"
            @focus="handleFocused"
            @blur="isFocused = false"
            class="outline-none text-white pl-4 py-2 bg-transparent w-16 transition-all duration-300 focus:w-[21rem] sm:focus:w-[42rem]"
            :class="isFocused ? 'border-b border-border-gray border-opacity-30' : ''"
            :placeholder="isFocused ? $t('texts.search_by') : $t('texts.search')"
          />
        </div>
      </div>
      <div class="bg-[#181624] flex flex-col gap-10">
        <QuoteCard v-for="quote in quotes" :key="quote.id" :quote="quote" :like="like" />
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import QuoteModal from './../components/QuoteModal.vue'
import TheLayout from '@/components/TheLayout.vue'
import WriteQuote from '@/components/icons/WriteQuote.vue'
import { ref, onMounted, computed } from 'vue'
import { toggleLike } from '@/service/movieService'
import QuoteCard from '@/components/QuoteCard.vue'
import { useQuoteStore } from '@/stores/QuoteStore'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import type { Quote } from '@/types'

const quoteStore = useQuoteStore()
const search = quoteStore.search
const quotes = computed<Quote[]>(() => quoteStore.quotes)
const isFocused = ref(false)

const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const fetchQuotes = async () => {
  await quoteStore.fetchQuotes(search)
}

const handleFocused = () => {
  isFocused.value = true
}

const updateSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  quoteStore.updateSearch(target.value)
}

onMounted(() => {
  fetchQuotes()
})

const like = async (quoteId: number) => {
  try {
    const response = await toggleLike(quoteId)

    const quote = quotes.value.find((q) => q.id === quoteId)
    if (quote) {
      quote.liked_by_user = !quote.liked_by_user
      quote.like_count = response.data.like_count
    }
  } catch (error) {
    console.error('Failed to toggle like:', error)
  }
}
</script>
