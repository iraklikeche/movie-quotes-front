<template>
  <div class="mt-4">
    <div class="max-h-72 overflow-scroll">
      <div v-for="comment in comments" :key="comment.id" class="mb-4 sm:flex gap-4">
        <div class="flex items-center sm:items-start gap-4">
          <img :src="comment.user.profile_image_url" class="w-10 h-10 rounded-full" />
          <span class="text-white sm:hidden">{{ comment.user.username }}</span>
        </div>
        <div class="sm:flex flex-col border-b border-opacity-10 w-full">
          <span class="text-white hidden sm:block">{{ comment.user.username }}</span>
          <p class="text-white mt-2 border-border-gray pb-4">{{ comment.content }}</p>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4 mt-4">
      <img :src="userSession.userData.profile_image" class="w-10 rounded-full" />
      <input
        v-model="newComment"
        type="text"
        :placeholder="$t('texts.write_comment')"
        class="bg-[#24222F] px-2 rounded-lg py-1.5 sm:pl-4 outline-none text-white transition-all duration-300 w-full"
        @keyup.enter="addNewComment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getComments, addComment } from '@/service/movieService'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import type { Comment } from '@/types'
import { useQuoteStore } from '@/stores/QuoteStore'

const userSession = useUserSessionStore()

const props = defineProps<{
  quoteId: number
}>()

const quoteStore = useQuoteStore()

const comments = ref<Comment[]>([])
const newComment = ref('')

onMounted(async () => {
  try {
    const response = await getComments(props.quoteId)
    comments.value = response.data
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
})

const addNewComment = async () => {
  if (!newComment.value.trim()) return

  try {
    await quoteStore.addQuoteComment(props.quoteId, newComment.value)
    newComment.value = ''
    comments.value = await getComments(props.quoteId).then((response) => response.data)
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}
</script>
