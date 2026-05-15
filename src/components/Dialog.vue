<template>
  <div class="dialog-mask" @click.self="close">
    <div class="dialog">
      <button class="close-btn" @click="close">×</button>

      <div class="back"></div>

      <AdsterraManager
          idTxt="adsterra-banner-2-box"
          :zid="1"
          style="margin-top: 1rem; margin-bottom: 0;"
          :immediate="false"
          :showTitle="false"
      />
    </div>
  </div>
</template>

<script setup>
import AdsterraManager from "./AdsterraManager.vue";

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;
}

.dialog {
  position: relative;

  width: 100%;
  max-width: 420px;

  background: #111;
  border-radius: 20px;

  padding: 20px;

  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05);

  animation: popup 0.25s ease;
}

.back {
  width: 100%;
  height: 120px;

  border-radius: 14px;

  background:
      linear-gradient(
          135deg,
          #1f1f1f,
          #2a2a2a
      );

  margin-bottom: 16px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 32px;
  height: 32px;

  border: none;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);
  color: #fff;

  font-size: 20px;
  cursor: pointer;

  transition: 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

@keyframes popup {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>