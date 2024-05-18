<template>
  <div class="relative sm:mt-6" @click="toggleDropdown" tabindex="0" @blur="handleBlur">
    <div
      class="bg-transparent px-4 py-3 rounded-md w-full mt-1 border border-custom-light-gray cursor-pointer text-[#85858d] whitespace-nowrap overflow-hidden"
    >
      <span v-if="selectedItems.length === 0">{{ placeholder }}</span>

      <span
        v-for="(item, index) in selectedItems"
        :key="index"
        class="text-xs rounded-sm tracking-wider py-1 px-2 mr-2 font-medium cursor-pointer last:mr-0 relative z-10 bg-custom-light-gray text-white"
      >
        {{ item[displayKey] }}
        <span class="inline-block" @click.stop="removeItem($event, item)">
          <RemoveGenre />
        </span>
      </span>
    </div>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

    <div
      v-if="isDropdownOpen"
      class="absolute w-full z-10 overflow-y-scroll flex flex-col gap-4 rounded-xl gap-y-2 shadow-2xl shadow-black h-32 mt-2 py-2 px-4 bg-white"
    >
      <div
        v-for="item in items"
        :key="item.id"
        @click.stop="selectItem(item)"
        class="text-xs tracking-wider py-2 px-4 cursor-pointer text-black hover:bg-slate-700 transition-all rounded-xl"
      >
        {{ item[displayKey] }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import RemoveGenre from '@/components/icons/RemoveGenre.vue'

const props = defineProps({
  items: Array,
  selectedItems: Array,
  placeholder: String,
  error: String,
  displayKey: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:selectedItems', 'clearError'])

const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  emit('clearError')
}

const handleBlur = () => {
  isDropdownOpen.value = false
}

const selectItem = (item) => {
  if (!props.selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
    emit('update:selectedItems', [...props.selectedItems, item])
  }
  isDropdownOpen.value = false
  emit('clearError')
}

const removeItem = (event, item) => {
  event.stopPropagation()
  emit(
    'update:selectedItems',
    props.selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
  )
}
</script>
