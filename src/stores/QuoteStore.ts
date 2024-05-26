import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  addComment,
  getQuotes,
  toggleLike,
  getQuotesByMovie,
  deleteQuote
} from '@/service/movieService'
import type { Quote, Comment } from '@/types'

export const useQuoteStore = defineStore('quoteStore', () => {
  const search = ref('')
  const quotes = ref<Quote[]>([])
  const likeId = ref<number | null>(null)
  const quotesByMovie = ref<Quote[]>([])
  const quotesCount = ref()

  const fetchQuotes = async (searchQuery = '') => {
    try {
      const res = await getQuotes(searchQuery)
      quotes.value = res.data
    } catch (error) {
      //
    }
  }

  const fetchQuotesByMovie = async (id: string) => {
    const res = await getQuotesByMovie(id)
    quotesByMovie.value = res.data
    quotesCount.value = quotesByMovie.value.length
  }

  const remove = async (quoteId: number) => {
    try {
      await deleteQuote(quoteId)
      quotesByMovie.value = quotesByMovie.value.filter((quote) => quote.id !== quoteId)
    } catch (error) {
      console.error('Failed to delete quote:', error)
    }
  }

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const updateSearch = debounce(async (newSearch: string) => {
    search.value = newSearch
    await fetchQuotes(newSearch)
  }, 300)

  const toggleQuoteLike = async (quoteId: number) => {
    likeId.value = quoteId
    try {
      const response = await toggleLike(quoteId)
      const quote =
        quotes.value.find((q) => q.id === quoteId) ||
        quotesByMovie.value.find((q) => q.id === quoteId)
      console.log(quote)
      if (quote) {
        quote.liked_by_user = response.data.liked_by_user
        quote.likes_count = response.data.like_count
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const updateLikeCount = (quoteId: number, likeCount: number) => {
    const quote = quotes.value.find((q) => q.id === quoteId)
    if (quote) {
      quote.likes_count = likeCount
    }
  }

  const updateCommentCount = (quoteId: number, commentCount: number) => {
    const quote = quotes.value.find((q) => q.id === quoteId)
    if (quote) {
      quote.comments_count = commentCount
    }
  }

  const addQuoteComment = async (quoteId: number, content: string) => {
    try {
      const response = await addComment(quoteId, content)

      const quote =
        quotes.value.find((q) => q.id === quoteId) ||
        quotesByMovie.value.find((q) => q.id === quoteId)
      if (quote) {
        quote.comments_count = response.data.commentCount
        quote.comments.push(response.data.comment as Comment)
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const updateQuoteComments = (quoteId: number, comment: Comment) => {
    const quote = quotes.value.find((q) => q.id === quoteId)
    if (quote) {
      quote.comments.push(comment)
    }
  }

  return {
    search,
    quotes,
    fetchQuotes,
    updateSearch,
    toggleQuoteLike,
    addQuoteComment,
    likeId,
    updateLikeCount,
    updateCommentCount,
    updateQuoteComments,
    fetchQuotesByMovie,
    quotesByMovie,
    quotesCount,
    remove
  }
})
