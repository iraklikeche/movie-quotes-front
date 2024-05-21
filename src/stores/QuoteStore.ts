import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addComment, getQuotes, toggleLike } from '@/service/movieService'

export const useQuoteStore = defineStore('quoteStore', () => {
  const search = ref('')
  const quotes = ref([])

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

  const toggleQuoteLike = async (quoteId) => {
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

  const addQuoteComment = async (quoteId, content) => {
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

  const getQuoteCommentsLength = (quoteId) => {
    const quote = quotes.value.find((q) => q.id === quoteId)
    return quote ? quote.comments.length : 0
  }

  const getQuoteLikesCount = (quoteId) => {
    const quote = quotes.value.find((q) => q.id === quoteId)
    return quote ? quote.likes_count : 0
  }

  const isQuoteLikedByUser = (quoteId) => {
    const quote = quotes.value.find((q) => q.id === quoteId)
    return quote ? quote.liked_by_user : false
  }

  return {
    search,
    quotes,
    fetchQuotes,
    updateSearch,
    toggleQuoteLike,
    addQuoteComment,
    getQuoteCommentsLength,
    getQuoteLikesCount,
    isQuoteLikedByUser
  }
})
