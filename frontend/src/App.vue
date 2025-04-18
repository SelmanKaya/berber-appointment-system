<script setup>
import Sidebar from "./components/Sidebar.vue"
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)

// Check login status on mount and when route changes
function checkLoginStatus() {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  isLoggedIn.value = !!(token && user)
  console.log('Login status:', isLoggedIn.value, 'Token:', token, 'User:', user)
}

onMounted(() => {
  checkLoginStatus()
})

// Watch for route changes to update login status
watch(() => route.path, () => {
  checkLoginStatus()
})

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <nav class="bg-amber-50 p-12">
      <div class="flex justify-between items-center max-w-7xl mx-auto">
        <div class="text-gray-800 text-2xl font-bold">Berber Ustası</div>
        <div class="space-x-6">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="text-gray-800 text-lg hover:underline">Giriş</router-link>
            <router-link to="/register" class="text-gray-800 text-lg hover:underline">Kayıt</router-link>
          </template>
          <button 
            v-else
            @click="handleLogout"
            class="text-gray-800 text-lg hover:underline"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </nav>

    <!-- Sidebar ve içerik alanı -->
    <div class="flex flex-1 overflow-hidden justify-between">
      <!-- Sidebar -->
      <Sidebar v-if="isLoggedIn" />

      <!-- Sayfa içeriği -->
      <div class="flex-1 p-6 overflow-y-auto bg-gray-100">
        <router-view></router-view>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-400 text-center p-3">
      &copy; 2025 Berber Ustası | Tüm hakları saklıdır.
    </footer>
  </div>
</template>
