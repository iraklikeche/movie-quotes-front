<template>
  <TheLayout :customHeight="'h-screen'">
    <div class="sm:hidden py-6 bg-[#11101A]">
      <div class="px-8">
        <GoBackBtn />
      </div>
    </div>
    <div>
      <span class="hidden sm:block text-white text-2xl font-medium mb-28 pl-10">{{
        $t('texts.my_profile')
      }}</span>
      <div class="bg-[#222030] py-8 sm:min-w-[62rem] relative sm:pb-32 sm:rounded-md">
        <div
          class="flex flex-col justify-center items-center sm:absolute sm:right-1/2 sm:translate-x-1/2 sm:top-0 sm:-translate-y-1/2"
        >
          <img :src="profile" class="rounded-full max-h-48 min-w-48 max-w-48" />
          <p class="text-white text-xl">{{ $t('texts.upload_photo') }}</p>
        </div>
        <div class="px-8 mt-16">
          <form @submit="onSubmit" class="flex flex-col sm:mt-32 sm:px-48 gap-8">
            <div class="flex flex-col">
              <label class="text-white mb-1">{{ $t('sessions.username') }}</label>
              <div class="relative sm:flex sm:items-center gap-8">
                <Field
                  name="username"
                  type="text"
                  class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                  disabled
                />
                <span
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0"
                  >{{ $t('texts.edit') }}</span
                >
              </div>
            </div>
            <div class="flex flex-col">
              <label class="text-white mb-1">{{ $t('sessions.email') }}</label>
              <div class="relative sm:flex sm:items-center gap-8">
                <Field
                  name="email"
                  type="email"
                  class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                  disabled
                />
                <div
                  class="text-red-500 opacity-0 absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0"
                >
                  {{ $t('texts.edit') }}
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <label class="text-white">{{ $t('sessions.password') }}</label>
              <div class="relative sm:flex sm:items-center gap-8">
                <Field
                  name="password"
                  type="password"
                  class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-[#CED4DA] outline-none w-full sm:px-3 sm:rounded-[4px]"
                  disabled
                />
                <span
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1"
                  >{{ $t('texts.edit') }}</span
                >
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import GoBackBtn from '@/components/icons/GoBackBtn.vue'
import profile from '@/assets/images/profile.png'
import TheLayout from '@/components/TheLayout.vue'
import { ref, onMounted, watch } from 'vue'
import { useForm, Field } from 'vee-validate'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()

const username = ref('')
const email = ref('')

const { handleSubmit, values, setValues } = useForm()

watch(
  () => username.value,
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
  }
)

const onSubmit = handleSubmit((values) => {
  console.log(values)
})

onMounted(async () => {
  if (localStorage.getItem('isLoggedIn')) {
    await userSession.getUserData()
    username.value = userSession.userData.username
    email.value = userSession.userData.email
  }
  setValues({
    username: username.value,
    email: email.value,
    password: '**********'
  })
})
</script>
