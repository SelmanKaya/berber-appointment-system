<script setup>
import { ref } from "vue";
import axios from "axios"
import { useRouter } from 'vue-router'

const router = useRouter()
const emailInput = ref("")
const passwordInput = ref("")
const message = ref("")

async function handleLogin(e) {
  e.preventDefault();

  try {
    // Express backend'e login isteği atıyoruz
    const response = await axios.post("http://localhost:3000/login", {
      email: emailInput.value,
      password: passwordInput.value
    })
    console.log("Backend yanıtı:", response.data);

    if (response.data.user) {
      // Giriş başarılıysa token'ı ve kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('token', 'user-token-' + Date.now()) // Unique token
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Başarılı mesajını göster
      message.value = response.data.message
      
      // Hair sayfasına yönlendir
      router.push('/hair')
    } else {
      message.value = "Kullanıcı bilgileri alınamadı."
    }

  } catch (error) {
    // Hata varsa (ör. 401) buraya düşer
    message.value = error.response?.data?.message || "Bir hata oluştu."
    console.error("Login error:", error)
  }
}
</script>


<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class=" bg-white p-8 rounded-b-sm shadow-2xl w-full max-w-sm">
      <h2 class=" text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent ="handleLogin">
        <div class="mb-4">
          <label class=" block text-gray-700 mb-2">Email</label>
          <input type="email" v-model="emailInput"
          placeholder="you@example.com"
          class="w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <label class=" block text-gray-700 mb-2">Password</label>
          <input type="password" v-model="passwordInput"
          placeholder="******"
          class="w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        </div>
        <button type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
        Login
        </button>
      </form>
      <p v-if="message" 
         class="text-center mt-4 font-semibold"
         :class="{ 'text-red-500': message.includes('hatalı') || message.includes('hata'), 'text-green-500': message.includes('başarılı') }">
        {{ message }}
      </p>
    </div>
  
  </div>
  
</template>

