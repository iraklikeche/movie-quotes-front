<template>
  <div class="bg-[#09101c] px-8 py-4 rounded-xl">
    <div class="flex items-center gap-4">
      <ProfileImage :imageClass="'w-10 h-10 rounded-full'" />

      <span class="text-white">{{ quote.user.username }}</span>
    </div>
    <div class="flex flex-col gap-2 mt-2 border-b border-border-gray border-opacity-30 pb-4">
      <p class="text-white">
        {{ quote.content.en }}, movie - {{ quote.movie.name.en }}. ({{ quote.movie.year }})
      </p>
      <img :src="quote.image_url" class="rounded-xl w-full max-h-52 sm:max-h-[31rem]" alt="" />
      <div class="flex gap-6 mt-2">
        <div class="flex gap-2 items-center">
          <span class="text-white"
            >{{ quote.comments.length === 0 ? 0 : quote.comments.length }}
          </span>
          <MessageIcon />
        </div>
        <div class="flex gap-2 items-center">
          <span class="text-white">{{ quote.like_count }}</span>
          <button @click="like(quote.id)">
            <LikeIcon :liked="quote.liked_by_user" />
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <div class="max-h-72 overflow-scroll">
        <div v-for="comment in comments" :key="comment.id" class="mb-4 sm:flex gap-4">
          <div class="flex items-center sm:items-start gap-4">
            <img :src="comment.user.profile_image_url" class="w-10 h-10 rounded-full" />
            <span class="text-white sm:hidden">{{ comment.user.username }}</span>
          </div>
          <div class="sm:flex flex-col border-b border-opacity-10 w-full">
            <span class="text-white hidden sm:block">{{ comment.user.username }}</span>
            <p class="text-white mt-2 border-border-gray pb-4">
              {{ comment.content }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 mt-4">
        <img :src="userSession.userData.profile_image" class="w-10 rounded-full" />
        <input
          v-model="newComment"
          type="text"
          :placeholder="$t('texts.write_comment')"
          class="bg-[#24222F] px-2 rounded-lg py-1.5 sm:pl-4 outline-none text-white w-auto transition-all duration-300 focus:w-[21rem] sm:focus:w-full sm:w-full"
          @keyup.enter="addNewComment"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileImage from './../components/ProfileImage.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import { ref, onMounted } from 'vue'
import { getComments, addComment } from '@/service/movieService'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()

const props = defineProps({
  quote: {
    type: Object,
    required: true
  },
  like: {
    type: Function,
    required: true
  }
})

const comments = ref([])
const newComment = ref('')

onMounted(async () => {
  try {
    const response = await getComments(props.quote.id)
    comments.value = response.data
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
})

const addNewComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const response = await addComment(props.quote.id, newComment.value)
    comments.value.push(response.data.comment)
    newComment.value = ''
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}
</script>
