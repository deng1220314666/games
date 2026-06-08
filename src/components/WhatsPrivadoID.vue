<template>
  <div class="whats-privado w-full min-h-screen bg-[#111b21] overflow-hidden">
    <div class="max-w-md mx-auto relative">
      <div v-if="!showChat" class="h-full flex flex-col">
        <div class="bg-[#1f2c34] px-4 py-4">
          <div class="flex items-center gap-3 mb-4">
            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=100&h=100&fit=crop" alt="Profile" class="w-12 h-12 rounded-full object-cover" />
            <div class="flex-1">
              <p class="text-[#e9edef] font-medium">WhatsApp Saya</p>
            </div>
          </div>
          <p class="text-[#25d366] text-xl font-bold mb-1">Dia mengirim pesan pribadi</p>
          <p class="text-[#8696a0] text-sm">Percakapan terkunci sedang menunggu Anda</p>
        </div>

        <div class="flex-1 overflow-y-auto bg-[#111b21]" style="overscroll-behavior: none;">
          <div v-for="contact in visibleContacts" :key="contact.id" class="flex items-center px-4 py-3 cursor-pointer hover:bg-[#222d34] transition-colors border-b border-[#222d34]" @click="openChat(contact)">
            <div class="relative">
              <img :src="contact.avatar" :alt="contact.name" class="w-14 h-14 rounded-full object-cover" />
              <div v-if="contact.online" class="absolute bottom-0 right-0 w-4 h-4 bg-[#25d366] rounded-full border-2 border-[#1f2c34]"></div>
            </div>
            <div class="flex-1 ml-3 min-w-0">
              <div class="flex justify-between items-center">
                <p class="text-[#e9edef] font-medium truncate">{{ contact.name }}</p>
                <p class="text-[#8696a0] text-xs">{{ contact.time }}</p>
              </div>
              <div class="flex justify-between items-center mt-1">
                <p class="text-[#8696a0] text-sm truncate">{{ contact.lastMessage }}</p>
                <span v-if="contact.unread" class="bg-[#25d366] text-[#111b21] text-xs font-bold rounded-full px-2 py-0.5 animate-pulse">{{ contact.unreadCount }}</span>
              </div>
            </div>
          </div>

          <div class="py-4 px-4">
            <div class="bg-[#1f2c34] rounded-xl p-4 blur-[3px] opacity-70">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#128c7e] rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-[#e9edef] font-medium">+12 profil terkunci</p>
                  <p class="text-[#8696a0] text-sm">Ketuk untuk membuka kunci</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="h-full flex flex-col">
        <div class="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
          <button class="text-[#e9edef] p-1" @click="closeChat">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="relative">
            <img :src="currentContact?.avatar" :alt="currentContact?.name" class="w-10 h-10 rounded-full object-cover blur-[8px]" />
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <p class="text-[#e9edef] font-medium">{{ currentContact?.name }}</p>
            <p class="text-[#8696a0] text-xs">{{ typingText }}</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-[#111b21] p-4" style="overscroll-behavior: none;">
          <div v-for="(msg, index) in messages" :key="index" class="mb-4">
            <div v-if="msg.type === 'text'" class="max-w-[75%] rounded-xl p-3" :class="msg.sent ? 'bg-[#d9fdd3] ml-auto' : 'bg-[#1f2c34]'">
              <p class="text-[#111b21]" :class="msg.sent ? 'text-[#111b21]' : 'text-[#e9edef]'">{{ msg.text }}</p>
              <p class="text-[#8696a0] text-xs text-right mt-1">{{ msg.time }}</p>
            </div>
            <div v-else-if="msg.type === 'voice'" class="max-w-[75%] rounded-xl p-3 flex items-center gap-3" :class="msg.sent ? 'bg-[#d9fdd3] ml-auto' : 'bg-[#1f2c34]'">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-[#8696a0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="waveform flex items-center gap-[2px] h-8">
                  <div v-for="i in 20" :key="i" class="w-1 rounded-full transition-all duration-300" :class="msg.sent ? 'bg-[#128c7e]' : 'bg-[#8696a0]'" :style="{ height: getWaveHeight(i, msg.sent) + 'px' }"></div>
                </div>
              </div>
              <span class="text-[#8696a0] text-xs">{{ msg.duration }}</span>
            </div>
            <div v-else-if="msg.type === 'image'" class="max-w-[60%] rounded-xl overflow-hidden" :class="msg.sent ? 'ml-auto' : ''">
              <img :src="msg.image" alt="Image" class="w-full object-cover blur-[20px] grayscale" :style="{ height: '150px' }" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                <div class="text-center">
                  <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p class="text-white text-sm">Gambar terkunci</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
          <div class="flex-1 bg-[#2a3942] rounded-full px-4 py-2">
            <p class="text-[#8696a0] text-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Buka kunci untuk membalas
            </p>
          </div>
          <button class="w-10 h-10 bg-[#2a3942] rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-[#8696a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="fixed w-full bottom-0 z-40" @click="jump">
        <AdsterraManager idTxt="adsterra-banner-1-box" :zid="1" style="margin-top: 1rem; margin-bottom: 0;" :immediate="false" :showTitle="false"/>

        <button class="w-full bg-[#25d366] text-white font-bold py-1 px-6 shadow-lg hover:bg-[#20bd5a] transition-colors cursor-pointer">
          <p class="text-lg">Klik untuk membuka kunci</p>
          <p class="text-sm text-white/80 mt-1">+2.847 orang melihat profil hari ini</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import AdsterraManager from "../components/AdsterraManager.vue"

const showChat = ref(false)
const showNotification = ref(false)
const currentContact = ref(null)
const typingText = ref('')

const contacts = [
  {
    id: 1,
    name: 'Camila',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&w=200&h=200&fit=crop',
    online: true,
    unread: true,
    unreadCount: 3,
    time: '14:32',
    lastMessage: 'Halo, boleh aku ceritakan sebuah rahasia? 👀'
  },
  {
    id: 2,
    name: 'Larissa',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=200&h=200&fit=crop',
    online: true,
    unread: true,
    unreadCount: 1,
    time: '12:15',
    lastMessage: 'Pesan suara'
  },
  {
    id: 3,
    name: 'Juliana',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=200&h=200&fit=crop',
    online: false,
    unread: false,
    unreadCount: 0,
    time: '09:48',
    lastMessage: 'Ngobrol nanti yuk?'
  }
]

const visibleContacts = ref(contacts)

const messages = ref([
  { type: 'text', text: 'Hai sayang! Apa kabar?', sent: false, time: '14:30' },
  { type: 'text', text: 'Aku baik! Kamu gimana?', sent: true, time: '14:31' },
  { type: 'text', text: 'Aku juga 😊', sent: false, time: '14:31' },
  { type: 'text', text: 'Aku punya sesuatu yang sangat penting untuk diceritakan...', sent: false, time: '14:32' },
  { type: 'text', text: 'Silakan, ceritakan!', sent: true, time: '14:32' },
  { type: 'image', image: '', sent: false },
  { type: 'voice', duration: '0:15', sent: false, time: '14:33' }
])

const typingMessages = [
  'mengetik...',
  'mengirim foto...',
  'mengetik...'
]

let typingInterval = null
let notificationInterval = null
let typingIndex = 0

const getWaveHeight = (index, sent) => {
  const baseHeight = 8
  const variation = Math.sin(index * 0.5 + Date.now() * 0.01) * 8 + 8
  return Math.max(4, Math.min(24, variation))
}

const openChat = (contact) => {
  currentContact.value = contact
  showChat.value = true
}

const closeChat = () => {
  showChat.value = false
  currentContact.value = null
}

const cycleTyping = () => {
  typingText.value = typingMessages[typingIndex]
  typingIndex = (typingIndex + 1) % typingMessages.length
}

const showPushNotification = () => {
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 4000)
}

let animationFrameId = null

const animateWaveforms = () => {
  const waveforms = document.querySelectorAll('.waveform div')
  waveforms.forEach((bar, index) => {
    const variation = Math.sin(index * 0.5 + Date.now() * 0.005) * 8 + 8
    bar.style.height = Math.max(4, Math.min(24, variation)) + 'px'
  })
  animationFrameId = requestAnimationFrame(animateWaveforms)
}

onMounted(() => {
  cycleTyping()
  typingInterval = setInterval(cycleTyping, 5000)
  notificationInterval = setInterval(showPushNotification, 15000)
  animateWaveforms()
})

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
  if (notificationInterval) clearInterval(notificationInterval)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})

const jump = () => {
  window.location.href = "https://freshmanhow.com/fq3key41?key=fc5b02ea1eb8e2a60efbe3e0a4204089";
}
</script>

<style scoped>
.whats-privado {
  -webkit-tap-highlight-color: transparent;
}

.whats-privado::-webkit-scrollbar {
  display: none;
}

.whats-privado {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>
