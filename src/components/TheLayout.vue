<template>
  <transition name="slide">
    <div
      id="layout-div"
      ref="layoutElement"
      class="bg-[#11101A] h-[41rem] w-[90%] absolute flex flex-col rounded-lg"
      v-show="isVisible"
    >
      <div class="flex flex-col gap-12 p-8">
        <div class="flex items-center gap-4 text-white">
          <img src="https://picsum.photos/200" class="w-14 rounded-full border-2" />
          <div>
            <p>{{ username }}</p>
            <RouterLink :to="{ name: 'profile' }" class="text-[#ced4da]">{{
              $t('texts.edit_profile')
            }}</RouterLink>
          </div>
        </div>
        <div class="flex gap-8 items-center text-white pl-2">
          <NewsFeed />
          <p>{{ $t('texts.news_feed') }}</p>
        </div>
        <div class="flex gap-8 items-center text-white pl-2">
          <ListOfMovies />
          <p>{{ $t('texts.movie_list') }}</p>
        </div>
      </div>
      <div class="mt-auto p-8">
        <button @click="onLogout" class="text-white bg-[#e31221] px-3 py-1.5 rounded-md">
          Log out
        </button>
      </div>
    </div>
  </transition>
  <TheHeader class="bg-[#242229]" @toggle="toggleMenu" />
  <main :class="['bg-[#171623] w-full sm:px-16 sm:py-8 sm:flex', customHeight]">
    <div class="hidden sm:flex flex-col gap-8 min-w-56">
      <div class="flex items-center gap-4 text-white">
        <img
          src="https://picsum.photos/200"
          class="w-14 rounded-full border-2"
          :class="$route.path === '/profile' ? 'border-red-600' : 'border-none'"
        />
        <div>
          <p>{{ username }}</p>
          <RouterLink :to="{ name: 'profile' }" class="text-[#ced4da]">{{
            $t('texts.edit_profile')
          }}</RouterLink>
        </div>
      </div>
      <div class="flex gap-8 items-center text-white pl-2">
        <NewsFeed :class="$route.path === '/dashboard' ? 'text-[#E31221]' : 'text-white'" />
        <p>{{ $t('texts.news_feed') }}</p>
      </div>
      <div class="flex gap-8 items-center text-white pl-2">
        <ListOfMovies :class="$route.path === '/dashboard' ? 'text-[#E31221]' : 'text-white'" />
        <p>{{ $t('texts.movie_list') }}</p>
      </div>
    </div>
    <div class="sm:flex justify-center sm:w-full">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
import ListOfMovies from '@/components/icons/ListOfMovies.vue'
import { onMounted, ref } from 'vue'
import NewsFeed from '@/components/icons/NewsFeed.vue'
import TheHeader from '@/components/TheHeader.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { RouterLink, useRouter } from 'vue-router'
import { getCsrfCookie, logoutUser } from '@/service/authService'
import useClickOutside from '@/composables/useClickOutside'
import type { Ref } from 'vue'

const props = defineProps(['customHeight'])
const userSession = useUserSessionStore()
const username = ref('')
const router = useRouter()
const isVisible = ref(false)
const layoutElement: Ref<Element | null> = ref(null)

function toggleMenu() {
  isVisible.value = !isVisible.value
}

useClickOutside(layoutElement, isVisible)

onMounted(async () => {
  if (localStorage.getItem('isLoggedIn')) {
    await userSession.getUserData()
    username.value = userSession.userData.username
  }
})

const onLogout = async () => {
  await getCsrfCookie()
  try {
    await logoutUser()
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  } catch (error) {
    //
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
</style>
