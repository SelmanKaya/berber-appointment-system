<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuItems = ref([
  { name: 'Saç Tıraşı', icon: '💇', path: '/hair' },
  { name: 'Sakal Tıraşı', icon: '🧔', path: '/beard' },
  { name: 'Cilt Bakımı', icon: '🧴', path: '/skincare' },
  { name: 'Masaj', icon: '💆', path: '/massage' },
])

const activeItem = computed(() => {
  return menuItems.value.find(item => route.path === item.path)
})

function handleNavigation(path) {
  router.push(path)
}
</script>

<template>
  <div class="w-64 h-screen bg-gray-800 text-white flex flex-col shadow-lg">
    <div class="p-6 text-2xl font-bold border-b border-gray-700">
      Berber Paneli
    </div>
    <div class="flex-1 p-4 space-y-2">
      <div
        v-for="item in menuItems"
        :key="item.name"
        @click="handleNavigation(item.path)"
        :class="[
          'cursor-pointer flex items-center p-3 rounded-lg transition',
          activeItem === item ? 'bg-gray-700' : 'hover:bg-gray-700'
        ]"
      >
        <span class="text-2xl mr-3">{{ item.icon }}</span>
        <span class="text-lg">{{ item.name }}</span>
      </div>
    </div>
    <div class="p-4 text-sm text-gray-400 border-t border-gray-700">
      &copy; 2025 Berber Ustası
    </div>
  </div>
</template>
