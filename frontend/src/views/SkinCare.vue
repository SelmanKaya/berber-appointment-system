<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const skinCareTreatments = ref([
  { 
    id: 1, 
    name: 'Yüz Temizliği', 
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200',
    description: 'Derinlemesine yüz temizliği ve peeling',
    duration: '45 dakika',
    price: '₺250'
  },
  { 
    id: 2, 
    name: 'Siyah Nokta Temizliği', 
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200',
    description: 'Profesyonel siyah nokta temizliği',
    duration: '30 dakika',
    price: '₺200'
  },
  { 
    id: 3, 
    name: 'Cilt Bakımı', 
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200',
    description: 'Özel serum ve maskeler ile cilt bakımı',
    duration: '60 dakika',
    price: '₺300'
  },
  { 
    id: 4, 
    name: 'Göz Çevresi Bakımı', 
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200',
    description: 'Göz çevresi kırışıklık ve koyu halka bakımı',
    duration: '30 dakika',
    price: '₺180'
  },
])

const selectedTreatment = ref(null)

function selectTreatment(treatment) {
  selectedTreatment.value = treatment
  // Save to localStorage
  const savedServices = JSON.parse(localStorage.getItem('selectedServices') || '{}')
  savedServices.skincare = treatment
  localStorage.setItem('selectedServices', JSON.stringify(savedServices))
}

function goToNext() {
  router.push('/massage')
}
</script>

<template>
  <div class="p-6 min-h-screen flex flex-col">
    <h1 class="text-3xl font-bold mb-6">Cilt Bakımı Hizmetleri</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="treatment in skinCareTreatments"
        :key="treatment.id"
        @click="selectTreatment(treatment)"
        :class="[
          'cursor-pointer rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105',
          selectedTreatment === treatment ? 'ring-4 ring-amber-500' : ''
        ]"
      >
        <img :src="treatment.image" :alt="treatment.name" class="w-full h-48 object-cover" />
        <div class="p-4 bg-white">
          <h3 class="text-lg font-semibold text-center">{{ treatment.name }}</h3>
          <p class="text-sm text-gray-600 text-center mt-1">{{ treatment.description }}</p>
          <div class="mt-2 flex justify-between text-sm">
            <span class="text-gray-500">{{ treatment.duration }}</span>
            <span class="font-semibold">{{ treatment.price }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedTreatment" class="mt-6 p-4 bg-amber-50 rounded-lg">
      <h2 class="text-xl font-bold mb-2">Seçilen Tedavi: {{ selectedTreatment.name }}</h2>
      <p class="text-gray-600 mb-1">{{ selectedTreatment.description }}</p>
      <p class="text-gray-600 mb-1">Süre: {{ selectedTreatment.duration }}</p>
      <p class="text-gray-600 mb-2">Fiyat: {{ selectedTreatment.price }}</p>
      <p class="text-gray-600">Bu tedaviyi seçtiniz. Randevu oluşturmak için devam edebilirsiniz.</p>
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