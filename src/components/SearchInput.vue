<template>
  <div>
    <slot />
    <input
      v-model="search"
      @input="handleInput"
      @focus="handleFocused"
      @blur="isFocused = false"
      class="outline-none text-white pl-4 py-2 bg-transparent"
      :class="[customClass, isFocused ? applyBorder : '']"
      :placeholder="isFocused ? placeholder_1 : placeholder_2"
      @keyup.enter="handleEnter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuoteStore } from '@/stores/QuoteStore'

defineProps({
  placeholder_1: String,
  placeholder_2: String,
  customClass: String,
  applyBorder: String,
  triggerMethod: {
    type: String,
    default: 'input',
    validator: (value) => ['input', 'enter'].includes(value)
  }
})

const isFocused = ref(false)
const handleFocused = () => {
  isFocused.value = true
}

const quoteStore = useQuoteStore()
const search = quoteStore.search

const updateSearch = (event) => {
  quoteStore.updateSearch(event.target.value)
}

const handleInput = (event) => {
  if (props.triggerMethod === 'input') {
    updateSearch(event.target.value)
  }
}

const handleEnter = () => {
  if (props.triggerMethod === 'enter') {
    updateSearch(search)
  }
}
</script>
