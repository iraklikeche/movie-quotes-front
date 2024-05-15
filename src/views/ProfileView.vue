<template>
  <transition name="fade">
    <div
      v-if="showModal"
      :class="[
        'fixed top-32 right-3 z-10 text-white py-3 px-4 sm:py-4 sm:px-8 rounded-lg shadow-md transition-all flex gap-20 items-center',
        modalType === 'success' ? 'bg-green-600' : 'bg-red-500'
      ]"
    >
      <p>{{ modalMessage }}</p>
      <span class="sm:hidden" @click="showModal = false">
        <CloseBtn />
      </span>
    </div>
  </transition>

  <TheLayout :customHeight="'min-h-screen'">
    <div class="pt-12 px-8 fixed inset-0 z-10 bg-[#24222f] top-[10%]" v-if="finalCheck">
      <div class="bg-[#24222f] rounded-xl">
        <div class="py-12 flex items-center justify-center border-b border-custom-gray">
          <p class="text-white">Are you sure to make changes?</p>
        </div>
        <div class="flex justify-between py-4 px-5">
          <button class="text-custom-gray" @click="closeEditForm">Cancel</button>
          <button class="bg-custom-red text-white px-2 py-1.5 rounded-md" @click="onSubmit">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <div class="sm:hidden py-6 bg-[#11101A]" v-if="currentMode !== Mode.FINAL_CHECK">
      <div class="px-8">
        <GoBackBtn class="cursor-pointer" @click="goBack" />
      </div>
    </div>

    <!-- Username -->
    <div v-if="currentMode === Mode.EDIT">
      <form class="bg-[#24222F] py-20 flex flex-col px-8">
        <CustomInput
          :label="$t('sessions.username')"
          name="new_username"
          :placeholder="$t('sessions.username_placeholder')"
          rules="required|min:3"
          type="text"
        />
      </form>
      <div class="px-8 flex justify-between mt-6">
        <button class="text-custom-gray" @click="closeEditForm">Cancel</button>
        <button class="bg-custom-red text-white px-5 py-1.5 rounded-md" @click="confirmReset">
          Edit
        </button>
      </div>
    </div>

    <!-- Reset -->
    <div v-if="currentMode === Mode.RESET">
      <div class="bg-[#24222F] py-20 px-8">
        <form class="flex flex-col gap-5">
          <CustomInput
            :label="$t('sessions.password')"
            name="new_password"
            rules="required|min:3"
            :placeholder="$t('sessions.password_placeholder')"
            isPasswordField
          />

          <CustomInput
            type="password"
            :label="$t('sessions.conf_password')"
            name="new_password_confirmation"
            :placeholder="$t('sessions.conf_password_placeholder')"
            isPasswordField
            rules="required|confirmed:@new_password"
          />
        </form>
      </div>

      <div class="px-8 flex justify-between mt-6">
        <button class="text-custom-gray" @click="closeEditForm">Cancel</button>
        <button class="bg-custom-red text-white px-5 py-1.5 rounded-md" @click="confirmReset">
          Edit
        </button>
      </div>
    </div>

    <!-- Main -->
    <div v-if="currentMode === Mode.MAIN" class="bg-[#222030] sm:bg-transparent">
      <span class="hidden sm:block text-white text-2xl font-medium mb-28 pl-10">{{
        $t('texts.my_profile')
      }}</span>
      <div class="bg-[#222030] py-8 sm:min-w-[62rem] relative sm:pb-24 sm:rounded-md">
        <div
          class="flex flex-col justify-center items-center sm:absolute sm:right-1/2 sm:translate-x-1/2 sm:top-0 sm:-translate-y-1/2 gap-2"
        >
          <input type="file" id="file-upload" @change="handleFileUpload" style="display: none" />

          <label for="file-upload" class="flex flex-col items-center gap-2">
            <UserProfileImage
              loadingClass="text-red-500 text-3xl"
              imageClass="rounded-full max-h-48 min-w-48 max-w-48"
            />
            <p class="text-white text-xl cursor-pointer">{{ $t('texts.upload_photo') }}</p>
          </label>
        </div>
        <div class="px-8 mt-16">
          <div class="flex flex-col sm:mt-32 sm:px-48 gap-8">
            <div class="flex flex-col">
              <UsernameStatic
                :disabled="!updateUsername"
                @openMode="openMode(Mode.EDIT)"
                @addNewUser="addNewUserInput"
              />

              <!-- Additional -->
              <div class="relative sm:flex sm:items-center gap-8 mt-8" v-if="updateUsername">
                <div class="sm:w-full">
                  <label class="text-white mb-1">{{ $t('sessions.new_username') }}</label>

                  <Field
                    name="new_username"
                    type="text"
                    class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
                    :validateOnInput="true"
                    rules="required|min:3"
                  />
                </div>
              </div>
              <ErrorMessage name="new_username" class="text-red-500" />
            </div>

            <EmailStatic />

            <div class="flex flex-col" v-if="showPass">
              <PasswordStatic
                :disabled="!updatePassword"
                @openMode="openMode(Mode.RESET)"
                @addNewPassword="addNewPasswordInput"
              />

              <div
                v-if="updatePassword"
                class="relative sm:flex sm:items-center gap-8 sm:max-w-[28.5rem]"
              >
                <div
                  class="border border-custom-gray border-opacity-20 hidden sm:block mt-8 px-8 py-5 rounded-md w-full"
                >
                  <p class="text-white">{{ $t('texts.password_contain') }}:</p>
                  <ul class="mt-4">
                    <li
                      :class="{ 'text-green-500': isLengthValid, 'text-[#9C9A9A]': !isLengthValid }"
                    >
                      * 8 {{ $t('texts.password_validation_length') }}
                    </li>
                    <li :class="{ 'text-green-500': isCaseValid, 'text-[#9C9A9A]': !isCaseValid }">
                      * 15 {{ $t('texts.password_validation_case') }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- New Password -->
              <div class="mt-8 hidden sm:block" v-if="updatePassword">
                <div class="flex flex-col">
                  <label class="text-white mb-1">{{ $t('sessions.new_password') }}</label>
                  <div class="relative sm:flex sm:items-center gap-8">
                    <div class="sm:w-full">
                      <Field
                        name="new_password"
                        type="password"
                        v-model="newPassword"
                        :placeholder="$t('sessions.password_placeholder')"
                        class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
                        @input="validatePassword"
                        :validateOnInput="true"
                        :rules="{ min: 8, regex: /^(?=.*[a-z])(?=.*[A-Z]).+$/ }"
                      />
                    </div>
                  </div>
                  <ErrorMessage name="new_password" class="text-red-500" />
                </div>

                <div class="flex flex-col mt-8">
                  <label class="text-white mb-1">{{ $t('sessions.confirm_new_password') }}</label>
                  <div class="relative sm:flex sm:items-center gap-8">
                    <div class="sm:w-full">
                      <Field
                        name="new_password_confirmation"
                        type="password"
                        :rules="{ confirmed: 'new_password' }"
                        class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
                      />
                    </div>
                  </div>
                  <ErrorMessage name="new_password_confirmation" class="text-red-500" />
                </div>
              </div>
            </div>
            <div
              class="justify-end mt-6 gap-8 hidden sm:flex relative sm:max-w-[28.5rem]"
              v-if="updateUsername || updatePassword"
            >
              <button class="text-custom-gray" @click="cancelChanges">Cancel</button>
              <button class="bg-custom-red text-white px-5 py-1.5 rounded-md" @click="onSubmit">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import UserProfileImage from './../components/UserProfileImage.vue'
import GoBackBtn from '@/components/icons/GoBackBtn.vue'
import TheLayout from '@/components/TheLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useForm, Field, ErrorMessage } from 'vee-validate'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import CustomInput from '@/components/Form/CustomInput.vue'
import { useRouter } from 'vue-router'
import EmailStatic from '@/components/EmailStatic.vue'
import PasswordStatic from '@/components/PasswordStatic.vue'
import UsernameStatic from '@/components/UsernameStatic.vue'
import { updateUserProfile } from '@/service/authService'
import type { Ref } from 'vue'
import CloseBtn from '@/components/icons/CloseBtn.vue'
import { useI18n } from 'vue-i18n'

// States
const { t } = useI18n()
const userSession = useUserSessionStore()
const router = useRouter()
const username = computed(() => userSession.userData.username)
const email = ref('')
const updateUsername = ref(false)
const updatePassword = ref(false)
const finalCheck = ref(false)
const showModal = ref(false)
const showPass = ref(false)
const modalType = ref('success') // New state variable for modal type
const modalMessage = ref('')

const profileUploaded: Ref<string | null> = ref(null)
const profileFile = ref<File | null>(null)

const Mode = {
  MAIN: 'main',
  EDIT: 'edit',
  RESET: 'reset',
  FINAL_CHECK: 'finalCheck'
}

const initialValues = ref({ username: '', email: '', password: '**********' })
const currentMode = ref(Mode.MAIN)
const { setValues, handleSubmit } = useForm()

// Computed properties for validation
const newPassword = ref('')

const isLengthValid = computed(() => {
  return newPassword.value.length >= 8
})

const isCaseValid = computed(() => {
  return /^(?=.*[a-z])(?=.*[A-Z]).+$/.test(newPassword.value)
})

const validatePassword = () => {
  isLengthValid.value
  isCaseValid.value
}

// Functions
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    profileUploaded.value = URL.createObjectURL(input.files[0])
    profileFile.value = input.files[0]
    finalCheck.value = true
  }
}

const addNewUserInput = () => {
  updateUsername.value = true
}

const addNewPasswordInput = () => {
  updatePassword.value = true
}

const cancelChanges = () => {
  updatePassword.value = false
  updateUsername.value = false
}

const goBack = () => {
  router.go(-1)
}

const openMode = (mode: string) => {
  currentMode.value = mode
}

const closeEditForm = () => {
  currentMode.value = Mode.MAIN
  finalCheck.value = false

  setValues({
    username: username.value,
    email: email.value,
    password: initialValues.value.password
  })
}

const confirmReset = () => {
  finalCheck.value = true
}

// Life-cycles
onMounted(async () => {
  if (localStorage.getItem('isLoggedIn')) {
    await userSession.getUserData()
    email.value = userSession.userData.email
    showPass.value = userSession.userData.google_id ? false : true
  }

  initialValues.value = {
    username: username.value,
    email: email.value,
    password: '**********'
  }
  setValues({
    username: username.value,
    email: email.value,
    password: initialValues.value.password
  })
})

// AJAX

const onSubmit = handleSubmit(async (values) => {
  try {
    const updateData: {
      new_username: string
      new_password: string
      new_password_confirmation: string
      [key: string]: string
    } = {
      new_username: values.new_username,
      new_password: values.new_password,
      new_password_confirmation: values.new_password_confirmation
    }

    Object.keys(updateData).forEach((key) => {
      if (!updateData[key]) {
        delete updateData[key]
      }
    })

    if (profileFile.value) {
      await updateUserProfile(updateData, profileFile.value)
    }
    await userSession.getUserData()

    closeEditForm()
    updateUsername.value = false
    updatePassword.value = false
    showModal.value = true
    // setTimeout(() => {
    //   showModal.value = false
    // }, 3000)
    modalType.value = 'success'
    modalMessage.value = t('texts.success')
    showModal.value = true
    setTimeout(() => {
      showModal.value = false
    }, 3000)
  } catch (error) {
    modalType.value = 'error'
    modalMessage.value = t('texts.failed')
    showModal.value = true
    setTimeout(() => {
      showModal.value = false
    }, 3000)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
