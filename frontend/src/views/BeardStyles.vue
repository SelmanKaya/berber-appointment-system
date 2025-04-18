<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const beardStyles = ref([
  { 
    id: 1, 
    name: 'Klasik Sakal', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    description: 'Klasik ve şık görünüm için ideal'
  },
  { 
    id: 2, 
    name: 'Hafif Sakal', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    description: 'Doğal ve bakımı kolay'
  },
  { 
    id: 3, 
    name: 'Tam Sakal', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    description: 'Gür ve etkileyici görünüm'
  },
  { 
    id: 4, 
    name: 'Goatee', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    description: 'Modern ve şık'
  },
  { 
    id: 5, 
    name: 'Van Dyke', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    description: 'Klasik ve zarif'
  },
  { 
    id: 6, 
    name: 'Stubble', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    description: 'Günlük kullanım için ideal'
  },
])

const selectedStyle = ref(null)

function selectStyle(style) {
  selectedStyle.value = style
  // Save to localStorage
  const savedServices = JSON.parse(localStorage.getItem('selectedServices') || '{}')
  savedServices.beard = style
  localStorage.setItem('selectedServices', JSON.stringify(savedServices))
}

function goToNext() {
  router.push('/skincare')
}
</script>

<template>
  <div class="p-6 min-h-screen flex flex-col">
    <h1 class="text-3xl font-bold mb-6">Sakal Modelleri</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="style in beardStyles"
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
          <p class="text-sm text-gray-600 text-center mt-1">{{ style.description }}</p>
        </div>
      </div>
    </div>
    <div v-if="selectedStyle" class="mt-6 p-4 bg-amber-50 rounded-lg">
      <h2 class="text-xl font-bold mb-2">Seçilen Model: {{ selectedStyle.name }}</h2>
      <p class="text-gray-600 mb-2">{{ selectedStyle.description }}</p>
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