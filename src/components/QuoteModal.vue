<template>
  <div
    v-show="internalShowModal"
    id="popup-modal"
    tabindex="-1"
    @click="handleCloseModal"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen sm:h-[calc(100%-1rem)] max-h-full flex backdrop-blur-sm"
  >
    <div
      ref="modalContent"
      class="relative w-full max-w-xl h-full sm:h-auto sm:max-h-full bg-[#222030] sm:bg-[#11101A] sm:rounded-lg sm:min-w-[60rem] sm:pb-12"
    >
      <div
        class="flex items-center justify-between gap-24 py-4 sm:py-6 pt-6 border-b px-8 border-border-gray border-opacity-40"
      >
        <div></div>
        <div>
          <p class="text-white">{{ $t('texts.new_quote') }}</p>
        </div>
        <div @click="$emit('update:showModal', false)">
          <CloseBtn />
        </div>
      </div>

      <div class="px-8 pt-12 bg-[#222030] sm:bg-[#11101A]">
        <div class="flex items-center gap-4 text-white">
          <img
            :src="userSession.userData.profile_image"
            class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2"
          />
          <p class="text-xl">{{ userSession.userData.username }}</p>
        </div>
        <form class="mt-8">
          <div class="relative">
            <textarea
              class="bg-transparent border border-border-gray border-opacity-60 w-full py-2 px-4 placeholder:text-[#6C757D] italic text-white outline-none"
              cols="5"
              rows="3"
              placeholder="Start create new quote"
            />
            <span class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-white"
              >Eng</span
            >
          </div>

          <div class="relative">
            <textarea
              class="mt-4 bg-transparent text-white border border-border-gray border-opacity-60 w-full py-2 px-4 placeholder:text-[#6C757D] italic outline-none"
              cols="5"
              rows="3"
              placeholder="ახალი ციტატა"
            />
            <span class="absolute right-0 -translate-x-[50%] translate-y-[100%] text-white"
              >ქარ</span
            >
          </div>

          <div class="mt-4">
            <input type="file" id="file-upload" style="display: none" />
            <label
              for="file-upload"
              class="flex justify-between sm:justify-normal sm:gap-2 items-center border border-border-gray border-opacity-60 px-4 py-5"
            >
              <div class="flex items-center gap-4">
                <ImageIcon />
                <span class="text-white sm:hidden">{{ $t('texts.upload') }}</span>
                <span class="text-white hidden sm:block">{{ $t('texts.drag_drop') }}</span>
              </div>
              <div class="bg-[#9747FF] bg-opacity-40 py-2 px-2 rounded-sm">
                <p class="text-white">{{ $t('texts.choose_file') }}</p>
              </div>
            </label>
          </div>

          <!-- DROPDOWN -->
          <div class="relative">
            <div
              class="bg-black py-6 px-4 flex items-center justify-between gap-4 mt-6 rounded-md"
              @click="toggleDropdown"
              v-if="!categories"
            >
              <div class="flex items-center gap-2">
                <ListOfMovies />
                <p class="text-white">{{ $t('texts.choose_movie') }}</p>
              </div>
              <div class="pr-4 sm:pr-0">
                <ArrowDown />
              </div>
            </div>
            <div v-else class="py-6 px-4 border border-border-gray border-opacity-60 mt-6">
              <p class="text-white">
                {{ selectedCategory?.name }}
              </p>
            </div>

            <div
              v-if="isDropdownOpen"
              class="absolute w-full z-10 overflow-y-scroll flex flex-col gap-4 rounded-xl gap-y-2 shadow-2xl shadow-black h-32 mt-2 py-2 px-4 bg-white"
            >
              <div
                v-for="category in allCategories"
                :key="category.id"
                @click.stop="selectCategory(category)"
                class="text-xs tracking-wider py-2 px-4 cursor-pointer text-black hover:bg-slate-700 transition-all rounded-xl"
              >
                {{ category.name }}
              </div>
            </div>
          </div>
          <div class="bg-[#E31221] flex items-center justify-center mt-8 py-3 rounded-md">
            <button class="text-xl text-white">{{ $t('texts.post') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseBtn from '@/components/icons/CloseBtn.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import ListOfMovies from '@/components/icons/ListOfMovies.vue'
import ArrowDown from '@/components/icons/ArrowDown.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch } from 'vue'
import { useModal } from '@/composables/useModal'
import type { Ref } from 'vue'

const props = defineProps<{
  showModal: boolean
}>()

type Category = {
  id: number
  name: string
}

const userSession = useUserSessionStore()
const { showModal: internalShowModal, closeModal, openModal } = useModal()

const modalContent = ref<HTMLElement | null>(null)
const emit = defineEmits(['update:showModal'])
const isDropdownOpen = ref(false)
const isFocused = ref(false)
const categories: Ref<boolean> = ref(false)
const selectedCategory: Ref<Category | null> = ref(null)
const allCategories = ref<Category[]>([
  { id: 1, name: 'Drama' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Thriller' }
])

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue !== internalShowModal.value) {
      newValue ? openModal() : closeModal()
    }
  }
)

const handleCloseModal = (event: MouseEvent) => {
  if (!modalContent.value?.contains(event.target as Node)) {
    closeModal()
    emit('update:showModal', false)
  }
}

const toggleDropdown = () => {
  isFocused.value = true
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectCategory = (category: Category) => {
  isDropdownOpen.value = false
  categories.value = true
  selectedCategory.value = category
}
</script>
