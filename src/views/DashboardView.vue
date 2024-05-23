<template>
  <TheLayout :customHeight="'min-h-screen'">
    <QuoteModal
      :showModal="showModal"
      @update:showModal="(value) => (showModal = value)"
      @quote-added="fetchQuotes"
    />
    <div>
      <LikeNotifications />
    </div>
    <div
      v-if="showNotification"
      class="fixed inset-0 flex items-start justify-center z-50"
      @click.self="showNotification = false"
    >
      <div
        class="relative mt-2 bg-black text-white rounded-lg shadow-lg w-80 p-8 min-w-[60rem] top-20 -right-[20%]"
      >
        <div class="absolute -top-3 right-[7.5rem] w-8 h-12 bg-black rotate-45"></div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Notifications</h3>
          <button class="text-sm text-gray-400 hover:underline">Mark as all read</button>
        </div>
        <div
          class="flex items-center mb-3 p-4 border border-border-gray gap-4 border-opacity-30 rounded-md"
        >
          <img src="https://picsum.photos/200" alt="avatar" class="w-20 h-20 rounded-full mr-3" />
          <div class="flex-grow">
            <div class="font-semibold">USERNAME</div>
            <div class="text-sm">COMMENT</div>
          </div>
          <div class="text-right text-gray-400 text-sm">
            <div>123</div>
            <div class="text-[#198754]">New</div>
          </div>
        </div>
      </div>
    </div>
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
        <QuoteCard v-for="quote in quotes" :key="quote.id" :quote="quote" />
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import TheLayout from '@/components/TheLayout.vue'
import WriteQuote from '@/components/icons/WriteQuote.vue'
import { ref, onMounted, computed, watch } from 'vue'
import QuoteCard from '@/components/QuoteCard.vue'
import { useQuoteStore } from '@/stores/QuoteStore'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import type { Quote } from '@/types'
import QuoteModal from '@/components/QuoteModal.vue'
import { useRoute, useRouter } from 'vue-router'
import LikeNotifications from '@/components/Notifications/LikeNotifications.vue'

const quoteStore = useQuoteStore()
const route = useRoute()
const router = useRouter()
const search = ref<string>(
  Array.isArray(route.query.search) ? route.query.search[0] || '' : route.query.search || ''
)

const quotes = computed<Quote[]>(() => quoteStore.quotes)
const isFocused = ref(false)
const showModal = ref(false)
const showNotification = ref(false)

const openModal = () => {
  showModal.value = true
}

const fetchQuotes = async () => {
  await quoteStore.fetchQuotes(search.value)
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

watch(search, (newSearch) => {
  router.push({ query: { ...route.query, search: newSearch } })
  quoteStore.updateSearch(newSearch)
})

watch(route, (newRoute) => {
  const newSearch = Array.isArray(newRoute.query.search)
    ? newRoute.query.search[0] || ''
    : newRoute.query.search || ''

  if (newSearch !== search.value) {
    search.value = newSearch
    quoteStore.updateSearch(newSearch)
  }
})
</script>
