import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserSessionStore = defineStore('UserSessionStore', () => {
  const showRegister = ref(false)
  const showLogin = ref(false)
  const showForgotPassword = ref(false)
  const showResetPassword = ref(false)

  function toggleModal(modal: Ref<boolean>) {
    modal.value = !modal.value
  }

  function closeModal() {
    showRegister.value = false
    showLogin.value = false
    showForgotPassword.value = false
    showResetPassword.value = false
  }
  function backToLogIn() {
    closeModal()
    showLogin.value = true
  }

  return {
    showRegister,
    showLogin,
    showForgotPassword,
    showResetPassword,
    toggleRegister: () => toggleModal(showRegister),
    toggleLogin: () => toggleModal(showLogin),
    toggleForgotPassword: () => {
      toggleModal(showForgotPassword)
      showLogin.value = false
    },
    toggleResetPassword: () => toggleModal(showResetPassword),
    closeModal,
    backToLogIn,
    toggleModal
  }
})
