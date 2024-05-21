import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addComment, getQuotes, toggleLike } from '@/service/movieService'
import type { Quote } from '@/types'

export const useQuoteStore = defineStore('quoteStore', () => {
  const search = ref('')
  const quotes = ref<Quote[]>([])

  const fetchQuotes = async (searchQuery = '') => {
    try {
      const res = await getQuotes(searchQuery)
      quotes.value = res.data
      console.log(quotes.value)
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

  const toggleQuoteLike = async (quoteId: number) => {
    try {
      const response = await toggleLike(quoteId)
      const quote = quotes.value.find((q) => q.id === quoteId)
      if (quote) {
        quote.liked_by_user = response.data.liked_by_user
        quote.likes_count = response.data.like_count
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const addQuoteComment = async (quoteId: number, content: string) => {
    try {
      const response = await addComment(quoteId, content)
      const quote = quotes.value.find((q) => q.id === quoteId)
      if (quote) {
        quote.comments.push(response.data.comment)
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  return {
    search,
    quotes,
    fetchQuotes,
    updateSearch,
    toggleQuoteLike,
    addQuoteComment
  }
})
