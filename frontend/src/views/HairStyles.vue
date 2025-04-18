<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hairStyles = ref([
  { id: 1, name: 'Klasik', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200' },
  { id: 2, name: 'Modern', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
  { id: 3, name: 'Fade', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
  { id: 4, name: 'Undercut', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200' },
  { id: 5, name: 'Pompadour', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
  { id: 6, name: 'Buzz Cut', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200' },
])

const selectedStyle = ref(null)

function selectStyle(style) {
  selectedStyle.value = style
  // Save to localStorage
  const savedServices = JSON.parse(localStorage.getItem('selectedServices') || '{}')
  savedServices.hair = style
  localStorage.setItem('selectedServices', JSON.stringify(savedServices))
}

function goToNext() {
  router.push('/beard')
}
</script>

<template>
  <div class="p-6 min-h-screen flex flex-col">
    <h1 class="text-3xl font-bold mb-6">Saç Modelleri</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="style in hairStyles"
        :key="style.id"
        @click="selectStyle(style)"
        :class="[
          'cursor-pointer rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105',
          selectedStyle === style ? 'ring-4 ring-amber-500' : ''
        ]"
      >
        <img :src="style.image" :alt="style.name" class="w-full h-48 object-cover" />
        <div class="p-4 bg-white">
          <h3 class="text-lg font-semibold text-center">{{ style.name }}</h3>
        </div>
      </div>
    </div>
    <div v-if="selectedStyle" class="mt-6 p-4 bg-amber-50 rounded-lg">
      <h2 class="text-xl font-bold mb-2">Seçilen Model: {{ selectedStyle.name }}</h2>
      <p class="text-gray-600">Bu modeli seçtiniz. Randevu oluşturmak için devam edebilirsiniz.</p>
    </div>
    <div class="mt-auto pt-6 flex justify-end">
      <button 
        @click="goToNext"
        class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition"
      >
        Sonraki
      </button>
    </div>
  </div>
</template> 