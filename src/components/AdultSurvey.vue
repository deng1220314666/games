<template>
  <div class="fixed inset-0 bg-[#111827] z-[999] flex items-center justify-center p-4 overflow-auto">
    <div
        class="relative w-full max-w-md bg-[#1f2937] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
    >
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 text-center border-b border-white/10">
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <p class="text-green-400 text-sm font-semibold tracking-wide">
            {{ t.onlineStatus }}
          </p>
        </div>

        <h1 class="text-white text-2xl font-black tracking-wide">
          {{ t.memberVerification }}
        </h1>

        <p class="text-gray-400 text-sm mt-2 leading-relaxed">
          {{ t.privateAccess }}
        </p>
      </div>

      <div class="p-6">
        <!-- fake preview -->
        <div
            class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6"
        >
          <div class="flex items-center gap-3">
            <div
                class="w-14 h-14 relative rounded-full bg-gradient-to-br from-pink-400 to-purple-500 overflow-hidden"
            >
              <div class="absolute w-full h-full rounded-full z-[999999] backdrop-blur-sm"></div>
              <img src="../assets/adsimg/b.png" alt="img">
            </div>

            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="text-white font-bold">Emily, 24</p>
                <span class="text-green-400 text-xs">● Online</span>
              </div>

              <p class="text-gray-400 text-xs mt-1">
                {{ t.previewText }}
              </p>
            </div>
          </div>
        </div>

        <!-- progress -->
        <div v-if="step <= totalSteps" class="mb-8">
          <div class="flex justify-between mb-2 text-xs text-gray-400">
            <span>
              {{ t.step }} {{ step }} {{ t.of }} {{ totalSteps }}
            </span>

            <span class="text-indigo-400 font-semibold">
              {{ progress }}%
            </span>
          </div>

          <div class="w-full h-2 rounded-full bg-black/30 overflow-hidden">
            <div
                class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- STEP 1 -->
        <div v-if="step === 1" class="space-y-6 animate-fade">
          <div class="text-center">
            <h2 class="text-white text-2xl font-bold leading-relaxed">
              {{ t.q1 }}
            </h2>
          </div>

          <div class="space-y-3">
            <button @click="nextStep" class="survey-btn">
              {{ t.q1a1 }}
            </button>

            <button @click="nextStep" class="survey-btn secondary-btn">
              {{ t.q1a2 }}
            </button>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-if="step === 2" class="space-y-6 animate-fade">
          <div class="text-center">
            <h2 class="text-white text-2xl font-bold leading-relaxed">
              {{ t.q2 }}
            </h2>
          </div>

          <div class="space-y-3">
            <button @click="nextStep" class="survey-btn">
              {{ t.q2a1 }}
            </button>

            <button @click="nextStep" class="survey-btn">
              {{ t.q2a2 }}
            </button>

            <button @click="nextStep" class="survey-btn secondary-btn">
              {{ t.q2a3 }}
            </button>
          </div>
        </div>

        <!-- STEP 3 -->
        <div v-if="step === 3" class="space-y-6 animate-fade">
          <div class="text-center">
            <h2 class="text-white text-2xl font-bold leading-relaxed">
              {{ t.q3 }}
            </h2>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <button @click="nextStep" class="survey-btn">
              Android
            </button>

            <button @click="nextStep" class="survey-btn">
              iPhone
            </button>

            <button @click="nextStep" class="survey-btn secondary-btn">
              Tablet
            </button>
          </div>
        </div>

        <!-- STEP 4 -->
        <div v-if="step === 4" class="space-y-6 animate-fade">
          <div class="text-center">
            <h2 class="text-white text-2xl font-bold leading-relaxed">
              {{ t.q4 }}
            </h2>
          </div>

          <div class="space-y-3">
            <button @click="nextStep" class="survey-btn">
              {{ t.q4a1 }}
            </button>

            <button @click="nextStep" class="survey-btn">
              {{ t.q4a2 }}
            </button>

            <button @click="nextStep" class="survey-btn secondary-btn">
              {{ t.q4a3 }}
            </button>
          </div>
        </div>

        <!-- STEP 5 -->
        <div v-if="step === 5" class="space-y-6 animate-fade">
          <div class="text-center">
            <h2 class="text-white text-2xl font-bold leading-relaxed">
              {{ t.q5 }}
            </h2>

            <p class="text-gray-400 text-sm mt-3">
              {{ t.ageNotice }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
                @click="startLoading"
                class="survey-btn bg-green-600 border-green-500 hover:bg-green-500"
            >
              {{ t.yes }}
            </button>

            <button
                @click="startLoading"
                class="survey-btn secondary-btn"
            >
              {{ t.no }}
            </button>
          </div>
        </div>

        <!-- LOADING -->
        <div
            v-if="step === 6"
            class="py-10 flex flex-col items-center justify-center"
        >
          <div
              class="w-16 h-16 border-4 border-indigo-900 border-t-indigo-400 rounded-full animate-spin mb-6"
          ></div>

          <div class="space-y-3 text-center">
            <p class="text-indigo-300 font-semibold text-lg animate-pulse">
              {{ loadingText }}
            </p>

            <p class="text-gray-500 text-sm">
              {{ t.processing }}
            </p>
          </div>
        </div>

        <!-- FINAL -->
        <div v-if="step === 7" class="text-center animate-fade">
          <div
              class="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5"
          >
            <span class="text-green-400 text-4xl">✓</span>
          </div>

          <h2 class="text-white text-3xl font-black mb-3">
            {{ t.successTitle }}
          </h2>

          <p class="text-gray-400 leading-relaxed mb-8">
            {{ t.successDesc }}
          </p>

          <button
              @click="finalRedirect"
              class="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-xl tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl"
          >
            {{ t.cta }}
          </button>

          <p class="text-xs text-gray-500 mt-4">
            {{ t.disclaimer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const totalSteps = 5
const step = ref(1)
const loadingText = ref('')

const langConfig = {
  en: {
    memberVerification: 'MEMBER VERIFICATION',
    privateAccess:
        'Complete the quick verification process to continue securely.',

    onlineStatus: '324 members online now',
    previewText: 'Recently active • Private access available',

    step: 'STEP',
    of: 'OF',

    q1: 'Are you interested in private interactive content?',
    q1a1: 'Yes, continue',
    q1a2: 'Maybe later',

    q2: 'What are you looking for right now?',
    q2a1: 'Casual Chat',
    q2a2: 'Interactive Experience',
    q2a3: 'Premium Access',

    q3: 'Which device are you currently using?',

    q4: 'How would you like to continue?',
    q4a1: 'Quick Access',
    q4a2: 'Private Matching',
    q4a3: 'Personalized Results',

    q5: 'Are you over 18 years old?',
    ageNotice: 'You must be 18+ to continue.',

    yes: 'YES',
    no: 'NO',

    loading1: 'Verifying your preferences...',
    loading2: 'Checking available matches...',
    loading3: 'Preparing personalized access...',
    loading4: 'Finalizing secure connection...',

    processing: 'Please wait a moment...',

    successTitle: 'Verification Complete',
    successDesc:
        'Your secure access is now available. Continue to open your personalized experience.',

    cta: 'Continue Securely',

    disclaimer:
        'By continuing, you confirm that you meet the minimum age requirement.'
  },

  es: {
    memberVerification: 'VERIFICACIÓN DE MIEMBRO',
    privateAccess:
        'Completa la verificación rápida para continuar de forma segura.',

    onlineStatus: '324 miembros en línea ahora',
    previewText: 'Activo recientemente • Acceso privado disponible',

    step: 'PASO',
    of: 'DE',

    q1: '¿Te interesa contenido interactivo privado?',
    q1a1: 'Sí, continuar',
    q1a2: 'Tal vez después',

    q2: '¿Qué estás buscando ahora mismo?',
    q2a1: 'Chat casual',
    q2a2: 'Experiencia interactiva',
    q2a3: 'Acceso premium',

    q3: '¿Qué dispositivo estás usando?',

    q4: '¿Cómo quieres continuar?',
    q4a1: 'Acceso rápido',
    q4a2: 'Emparejamiento privado',
    q4a3: 'Resultados personalizados',

    q5: '¿Tienes más de 18 años?',
    ageNotice: 'Debes tener más de 18 años para continuar.',

    yes: 'SÍ',
    no: 'NO',

    loading1: 'Verificando tus preferencias...',
    loading2: 'Buscando coincidencias disponibles...',
    loading3: 'Preparando acceso personalizado...',
    loading4: 'Finalizando conexión segura...',

    processing: 'Por favor espera un momento...',

    successTitle: 'Verificación Completada',
    successDesc:
        'Tu acceso seguro ya está disponible. Continúa para abrir tu experiencia personalizada.',

    cta: 'Continuar de Forma Segura',

    disclaimer:
        'Al continuar, confirmas que cumples con la edad mínima requerida.'
  }
}

const browserLang = navigator.language?.toLowerCase() || 'es'

const currentLang = computed(() => {
  return browserLang.startsWith('en') ? 'en' : 'es'
})

const t = computed(() => {
  return langConfig[currentLang.value]
})

const progress = computed(() => {
  return Math.round((step.value / totalSteps) * 100)
})

const nextStep = () => {
  if (step.value < totalSteps) {
    step.value++
  }
}

const startLoading = () => {
  step.value = 6

  loadingText.value = t.value.loading1

  setTimeout(() => {
    loadingText.value = t.value.loading2
  }, 1800)

  setTimeout(() => {
    loadingText.value = t.value.loading3
    finalRedirect();
  }, 3600)

  // setTimeout(() => {
  //   loadingText.value = t.value.loading4
  // }, 5400)
  //
  // setTimeout(() => {
  //   finalRedirect();
  // }, 7000)
}

const finalRedirect = () => {
  window.location.href = 'https://6njvi.bemobtrcks.com/click'
}
</script>

<style scoped>
.survey-btn {
  @apply w-full py-4 px-5 rounded-2xl bg-[#111827] border border-indigo-500/20 text-white font-bold text-base transition-all duration-200 hover:bg-[#182338] hover:border-indigo-400/40 hover:shadow-lg active:scale-[0.98];
}

.secondary-btn {
  @apply border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5;
}

.animate-fade {
  animation: fadeIn 0.35s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
