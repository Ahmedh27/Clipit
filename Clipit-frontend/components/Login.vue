<template>
    <div class="text-center text-[28px] mb-4 font-bold text-[#FF4C4C]">Log in</div>

    <div class="px-6 pb-1.5 text-[15px] text-[#348C5C] font-semibold">Email address</div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Email address"
            v-model:input="email"
            inputType="email"
            :autoFocus="true"
            :error="errors && errors.email ? errors.email[0] : ''"
            class="border-2 border-[#FFD700] rounded-lg px-4 py-2 shadow-md"
        />
    </div>

    <div class="px-6 pb-1.5 text-[15px] text-[#348C5C] font-semibold">Password</div>

    <div class="px-6 pb-2">
        <TextInput 
            placeholder="Password"
            v-model:input="password"
            inputType="password"
            class="border-2 border-[#FFD700] rounded-lg px-4 py-2 shadow-md"
        />
    </div>

    <div class="px-6 text-[12px] text-[#FF4C4C] font-semibold underline cursor-pointer">Forgot password?</div>

    <div class="px-6 pb-2 mt-6">
        <button 
            :disabled="(!email || !password)"
            :class="(!email || !password) ? 'bg-gray-200' : 'bg-[#FF4C4C] hover:bg-[#D63030]'"
            @click="login()" 
            class="w-full text-[17px] font-semibold text-white py-3 rounded-lg shadow-lg"
        >
            Log in
        </button>
    </div>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp()

let email = ref(null)
let password = ref(null)
let errors = ref(null)

const login = async () => {
    errors.value = null

    try {
        await $userStore.getTokens()
        await $userStore.login(email.value, password.value)
        await $userStore.getUser()
        await $generalStore.getRandomUsers('suggested')
        await $generalStore.getRandomUsers('following')
        $generalStore.isLoginOpen = false
    } catch (error) {
        errors.value = error.response.data.errors
    }
}
</script>

<style scoped>
body {
    font-family: 'Comic Sans MS', sans-serif;
    background-color: #FFF5E1;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

button {
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
    transform: translateY(-2px);
}
</style>
