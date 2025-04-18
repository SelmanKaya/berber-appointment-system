<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Store selected services
const selectedServices = ref({
  hair: null,
  beard: null,
  skincare: null,
  massage: null
})

// Time selection
const selectedDate = ref('')
const selectedTime = ref('')
const bookedAppointments = ref([])

// Generate time slots (9:00 - 18:00)
const timeSlots = ref([
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
])

// Calculate total price
const totalPrice = computed(() => {
  let total = 0
  if (selectedServices.value.hair) total += 150 // Example price for hair
  if (selectedServices.value.beard) total += 100 // Example price for beard
  if (selectedServices.value.skincare) total += parseInt(selectedServices.value.skincare.price?.replace('₺', '') || 0)
  if (selectedServices.value.massage) total += parseInt(selectedServices.value.massage.price?.replace('₺', '') || 0)
  return total
})

// Check if a time slot is available
const isTimeSlotAvailable = (time) => {
  if (!selectedDate.value) return true
  const appointmentKey = `${selectedDate.value}-${time}`
  return !bookedAppointments.value.includes(appointmentKey)
}

// Load selected services and booked appointments from localStorage
onMounted(() => {
  try {
    const savedServices = localStorage.getItem('selectedServices')
    if (savedServices) {
      selectedServices.value = JSON.parse(savedServices)
      console.log('Loaded services:', selectedServices.value)
    }

    // Load booked appointments (in a real app, this would come from an API)
    const savedAppointments = localStorage.getItem('bookedAppointments')
    if (savedAppointments) {
      bookedAppointments.value = JSON.parse(savedAppointments)
    }
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

function goBack() {
  router.push('/massage')
}

function confirmAppointment() {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Lütfen tarih ve saat seçiniz!')
    return
  }

  // Create appointment key
  const appointmentKey = `${selectedDate.value}-${selectedTime.value}`
  
  // Add to booked appointments
  bookedAppointments.value.push(appointmentKey)
  localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments.value))

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'))

  // Send appointment data to backend
  fetch('http://localhost:3000/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user,
      services: selectedServices.value,
      date: selectedDate.value,
      time: selectedTime.value,
      totalPrice: totalPrice.value
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Randevunuz başarıyla oluşturuldu!')
      // Clear selections
      localStorage.removeItem('selectedServices')
      router.push('/')
    } else {
      alert('Randevu oluşturulurken bir hata oluştu: ' + data.message)
    }
  })
  .catch(error => {
    console.error('Error:', error)
    alert('Randevu oluşturulurken bir hata oluştu')
  })
}
</script>

<template>
  <div class="p-6 min-h-screen flex flex-col">
    <h1 class="text-3xl font-bold mb-6">Seçilen Hizmetler</h1>
    
    <!-- Selected Services -->
    <div class="space-y-6">
      <!-- Hair Style -->
      <div v-if="selectedServices.hair" class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-2">Saç Tıraşı</h2>
        <p class="text-gray-600">{{ selectedServices.hair.name }}</p>
        <p class="text-gray-600 mt-2">Fiyat: ₺150</p>
      </div>

      <!-- Beard Style -->
      <div v-if="selectedServices.beard" class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-2">Sakal Tıraşı</h2>
        <p class="text-gray-600">{{ selectedServices.beard.name }}</p>
        <p class="text-gray-600">{{ selectedServices.beard.description }}</p>
        <p class="text-gray-600 mt-2">Fiyat: ₺100</p>
      </div>

      <!-- Skin Care -->
      <div v-if="selectedServices.skincare" class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-2">Cilt Bakımı</h2>
        <p class="text-gray-600">{{ selectedServices.skincare.name }}</p>
        <p class="text-gray-600">{{ selectedServices.skincare.description }}</p>
        <div class="flex justify-between mt-2">
          <span class="text-gray-500">{{ selectedServices.skincare.duration }}</span>
          <span class="font-semibold">{{ selectedServices.skincare.price }}</span>
        </div>
      </div>

      <!-- Massage -->
      <div v-if="selectedServices.massage" class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-2">Masaj</h2>
        <p class="text-gray-600">{{ selectedServices.massage.name }}</p>
        <p class="text-gray-600">{{ selectedServices.massage.description }}</p>
        <div class="flex justify-between mt-2">
          <span class="text-gray-500">{{ selectedServices.massage.duration }}</span>
          <span class="font-semibold">{{ selectedServices.massage.price }}</span>
        </div>
      </div>

      <!-- No Services Selected -->
      <div v-if="!selectedServices.hair && !selectedServices.beard && !selectedServices.skincare && !selectedServices.massage" 
           class="bg-white p-6 rounded-lg shadow-lg text-center">
        <p class="text-gray-600">Henüz hiçbir hizmet seçilmedi.</p>
        <button 
          @click="router.push('/hair')"
          class="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Hizmet Seçmeye Başla
        </button>
      </div>
    </div>

    <!-- Date and Time Selection -->
    <div v-if="totalPrice > 0" class="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">Randevu Tarihi ve Saati</h2>
      
      <!-- Date Selection -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Tarih Seçin</label>
        <input 
          type="date" 
          v-model="selectedDate"
          :min="new Date().toISOString().split('T')[0]"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <!-- Time Selection -->
      <div>
        <label class="block text-gray-700 mb-2">Saat Seçin</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="time in timeSlots"
            :key="time"
            @click="selectedTime = time"
            :class="[
              'p-2 rounded-lg text-center transition',
              selectedTime === time 
                ? 'bg-amber-500 text-white' 
                : isTimeSlotAvailable(time)
                  ? 'bg-gray-100 hover:bg-gray-200'
                  : 'bg-red-100 text-gray-500 cursor-not-allowed'
            ]"
            :disabled="!isTimeSlotAvailable(time)"
          >
            {{ time }}
          </button>
        </div>
      </div>
    </div>

    <!-- Total Price -->
    <div v-if="totalPrice > 0" class="mt-8 p-6 bg-amber-50 rounded-lg">
      <h2 class="text-xl font-bold mb-2">Toplam Tutar</h2>
      <p class="text-2xl font-bold text-amber-600">₺{{ totalPrice }}</p>
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-auto pt-6 flex justify-between">
      <button 
        @click="goBack"
        class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
      >
        Geri
      </button>
      <button 
        v-if="totalPrice > 0"
        @click="confirmAppointment"
        class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition"
      >
        Randevuyu Onayla
      </button>
    </div>
  </div>
</template> 