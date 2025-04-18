<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const massageServices = ref([
  { 
    id: 1, 
    name: 'Klasik Masaj', 
    image: 'https://images.unsplash.com/photo-1544161515-4ab155ce08d2?w=200',
    description: 'Geleneksel İsveç masajı ile rahatlama',
    duration: '60 dakika',
    price: '₺400'
  },
  { 
    id: 2, 
    name: 'Aromaterapi Masajı', 
    image: 'https://images.unsplash.com/photo-1544161515-4ab155ce08d2?w=200',
    description: 'Esansiyel yağlar ile rahatlatıcı masaj',
    duration: '45 dakika',
    price: '₺350'
  },
  { 
    id: 3, 
    name: 'Spor Masajı', 
    image: 'https://images.unsplash.com/photo-1544161515-4ab155ce08d2?w=200',
    description: 'Kas ağrıları ve yorgunluk için özel masaj',
    duration: '60 dakika',
    price: '₺450'
  },
  { 
    id: 4, 
    name: 'Baş ve Boyun Masajı', 
    image: 'https://images.unsplash.com/photo-1544161515-4ab155ce08d2?w=200',
    description: 'Stres ve gerginlik için özel masaj',
    duration: '30 dakika',
    price: '₺250'
  },
  { 
    id: 5, 
    name: 'Ayak Masajı', 
    image: 'https://images.unsplash.com/photo-1544161515-4ab155ce08d2?w=200',
    description: 'Refleksoloji ile ayak masajı',
    duration: '45 dakika',
    price: '₺300'
  },
])

const selectedService = ref(null)

function selectService(service) {
  selectedService.value = service
  // Save to localStorage
  const savedServices = JSON.parse(localStorage.getItem('selectedServices') || '{}')
  savedServices.massage = service
  localStorage.setItem('selectedServices', JSON.stringify(savedServices))
}

function goToNext() {
  router.push('/summary')
}
</script>

<template>
  <div class="p-6 min-h-screen flex flex-col">
    <h1 class="text-3xl font-bold mb-6">Masaj Hizmetleri</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="service in massageServices"
        :key="service.id"
        @click="selectService(service)"
        :class="[
          'cursor-pointer rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105',
          selectedService === service ? 'ring-4 ring-amber-500' : ''
        ]"
      >
        <img :src="service.image" :alt="service.name" class="w-full h-48 object-cover" />
        <div class="p-4 bg-white">
          <h3 class="text-lg font-semibold text-center">{{ service.name }}</h3>
          <p class="text-sm text-gray-600 text-center mt-1">{{ service.description }}</p>
          <div class="mt-2 flex justify-between text-sm">
            <span class="text-gray-500">{{ service.duration }}</span>
            <span class="font-semibold">{{ service.price }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedService" class="mt-6 p-4 bg-amber-50 rounded-lg">
      <h2 class="text-xl font-bold mb-2">Seçilen Hizmet: {{ selectedService.name }}</h2>
      <p class="text-gray-600 mb-1">{{ selectedService.description }}</p>
      <p class="text-gray-600 mb-1">Süre: {{ selectedService.duration }}</p>
      <p class="text-gray-600 mb-2">Fiyat: {{ selectedService.price }}</p>
      <p class="text-gray-600">Bu hizmeti seçtiniz. Randevu oluşturmak için devam edebilirsiniz.</p>
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