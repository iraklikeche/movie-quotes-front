import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserSessionStore = defineStore('UserSessionStore', () => {
  const showRegister = ref(false)
  const showLogin = ref(false)
  const showForgotPassword = ref(false)
  const showResetPassword = ref(false)
  const successModal = ref(false)
  const modalContent = ref({
    icon: '',
    mainMessage: '',
    subMessage: '',
    buttonText: ''
  })

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

  function setModalContent(content) {
    modalContent.value.icon = content.icon
    modalContent.value.mainMessage = content.mainMessage
    modalContent.value.subMessage = content.subMessage
    modalContent.value.buttonText = content.buttonText
    successModal.value = true
  }

  return {
    showRegister,
    showLogin,
    showForgotPassword,
    showResetPassword,
    toggleRegister: () => {
      toggleModal(showRegister), (showLogin.value = false)
    },
    toggleLogin: () => {
      toggleModal(showLogin), (showRegister.value = false)
    },
    toggleForgotPassword: () => {
      toggleModal(showForgotPassword)
      showLogin.value = false
    },
    toggleResetPassword: () => toggleModal(showResetPassword),
    closeModal,
    backToLogIn,
    toggleModal,
    successModal,
    modalContent,
    setModalContent
  }
})
