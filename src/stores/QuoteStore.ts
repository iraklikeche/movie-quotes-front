import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getQuotes } from '@/service/movieService'

export const useQuoteStore = defineStore('quoteStore', () => {
  const search = ref('')
  const quotes = ref([])

  const fetchQuotes = async (searchQuery = '') => {
    try {
      const res = await getQuotes(searchQuery)
      quotes.value = res.data
    } catch (error) {
      //
    }
  }

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const updateSearch = debounce(async (newSearch) => {
    search.value = newSearch
    await fetchQuotes(newSearch)
  }, 300)

  return {
    search,
    quotes,
    fetchQuotes,
    updateSearch
  }
})
