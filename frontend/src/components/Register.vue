<script setup>
import { ref } from "vue";

const nameInput = ref("");
const lastNameInput = ref("");
const emailInput = ref("");
const passwordInput = ref("");
const message = ref("");

async function handleRegister() {
  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const data = await res.json(); // login kisminda axios kullandim burada fetch ikisininde kullanim seklini gostermek istedim


    if (res.ok) {
      message.value = data.message; 
    } else {
      message.value = data.message; 
    }
  } catch (error) {
    message.value = "An error occurred. Please try again.";
    console.error("Registration error:", error);
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-b-sm shadow-2xl w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center mb-6">Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            v-model="nameInput"
            placeholder="Enter your Name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label class="block text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            v-model="lastNameInput"
            placeholder="Enter your Last Name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label class="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            v-model="emailInput"
            placeholder="you@example.com"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label class="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            v-model="passwordInput"
            placeholder="******"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>
      </form>
      <p
        v-if="message"
        class="text-center mt-4 font-semibold"
        :class="{ 'text-red-500': !message.includes('başarılı'), 'text-green-500': message.includes('başarılı') }"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>