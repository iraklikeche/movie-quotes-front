<template>
  <TheLayout :customHeight="'min-h-screen'">
    <QuoteModal
      :showModal="showModal"
      @update:showModal="(value) => (showModal = value)"
      @quote-added="fetchQuotes"
    />

    <div class="sm:min-w-[59rem] sm:max-w-[60rem]" ref="scrollEL">
      <div class="flex items-center gap-6">
        <button
          @click="openModal"
          class="flex justify-between px-8 sm:px-0 bg-[#181624] py-6 sm:gap-4 w-full"
        >
          <div class="flex gap-4 items-center sm:bg-[#24222F] sm:w-full sm:py-4 sm:px-4 rounded-lg">
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
            class="outline-none text-white pl-4 py-2 bg-transparent w-24 transition-all duration-300 focus:w-[21rem] sm:focus:w-[42rem]"
            :class="isFocused ? 'border-b border-border-gray border-opacity-30' : ''"
            :placeholder="isFocused ? formattedSearchPlaceholder : $t('texts.search')"
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
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import QuoteCard from '@/components/QuoteCard.vue'
import { useQuoteStore } from '@/stores/QuoteStore'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import type { Quote } from '@/types'
import QuoteModal from '@/components/QuoteModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const quoteStore = useQuoteStore()

const route = useRoute()
const router = useRouter()

const search = ref<string>(
  Array.isArray(route.query.search) ? route.query.search[0] || '' : route.query.search || ''
)

const quotes = computed<Quote[]>(() => quoteStore.quotes)
const isFocused = ref(false)
const showModal = ref(false)

const formattedSearchPlaceholder = computed(() => {
  return t('texts.search_by').replace('at', '@')
})

const openModal = () => {
  showModal.value = true
}

const fetchQuotes = async () => {
  await quoteStore.fetchQuotes(search.value.toLowerCase())
}

const handleFocused = () => {
  isFocused.value = true
}

const updateSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  quoteStore.updateSearch(target.value.toLowerCase())
}

const loadMoreQuotes = async () => {
  await quoteStore.loadMoreQuotes()
}

const scrollEL = ref<HTMLElement | null>(null)

const handleScroll = () => {
  if (scrollEL.value && scrollEL.value.getBoundingClientRect().bottom <= window.innerHeight) {
    loadMoreQuotes()
  }
}

onMounted(() => {
  fetchQuotes()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(search, (newSearch) => {
  router.push({ query: { ...route.query, search: newSearch.toLowerCase() } })
  quoteStore.updateSearch(newSearch.toLowerCase())
})

watch(route, (newRoute) => {
  const newSearch = Array.isArray(newRoute.query.search)
    ? newRoute.query.search[0] || ''
    : newRoute.query.search || ''

  if (newSearch.toLowerCase() !== search.value) {
    search.value = newSearch.toLowerCase()
    quoteStore.updateSearch(newSearch.toLowerCase())
  }
})

// watch(search, (newSearch) => {
//   router.push({ query: { ...route.query, search: newSearch } })
//   quoteStore.updateSearch(newSearch)
// })

// watch(route, (newRoute) => {
//   const newSearch = Array.isArray(newRoute.query.search)
//     ? newRoute.query.search[0] || ''
//     : newRoute.query.search || ''

//   if (newSearch !== search.value) {
//     search.value = newSearch
//     quoteStore.updateSearch(newSearch)
//   }
// })
</script>
