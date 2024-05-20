<template>
  <div>
    <QuotesHeader />
    <div class="mt-6 sm:w-1/2">
      <div class="flex flex-col gap-4 bg-[#11101A] px-8 py-8">
        <img src="https://picsum.photos/200" class="w-full max-h-36" />
        <p class="text-custom-light-gray italic text-2xl">
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, repellendus quisquam
          magnam porro dolores. "
        </p>
        <div
          class="flex gap-6 mt-2 border-t pt-6 border-border-gray border-opacity-60 justify-between"
        >
          <div class="flex gap-6">
            <div class="flex gap-2 items-center">
              <span class="text-white">3</span>
              <MessageIcon />
            </div>
            <div class="flex gap-2 items-center">
              <span class="text-white">2</span>
              <LikeIcon />
            </div>
          </div>
          <div class="relative">
            <MoreOptions @click="toggleMenu" />
            <div
              @click.self="isVisible = false"
              v-show="isVisible"
              class="bg-[#24222F] absolute min-w-64 rounded-xl p-8 right-0 bottom-0 -translate-y-[15%]"
            >
              <ul class="flex flex-col gap-8">
                <li class="flex gap-6 items-center text-white">
                  <ViewIcon /> {{ $t('texts.view_quote') }}
                </li>
                <li class="flex gap-6 items-center text-white">
                  <EditIcon /> {{ $t('texts.edit') }}
                </li>
                <li class="flex gap-6 items-center text-white">
                  <DeleteIcon /> {{ $t('texts.delete') }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuotesHeader from '@/components/QuotesHeader.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import MoreOptions from '@/components/icons/MoreOptions.vue'
import ViewIcon from '@/components/icons/ViewIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
const isVisible = ref(false)
function toggleMenu() {
  isVisible.value = !isVisible.value
}
</script>
