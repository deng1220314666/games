<template>
  <div id="ezoic-pub-ad-placeholder-101"></div>
</template>

<script setup>
  import { onMounted } from "vue";

  onMounted(() => {
    ezstandalone.cmd.push(function () {
      ezstandalone.showAds(101);
    });
  })
</script>

<style scoped>

</style>