<template>
  <div :id="props.idTxt" ref="adRef" class="adContainer mb-4">
    <div v-if="props.showTitle" class="ad-title">
      <span style="font-size: 13px;">ad</span>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2157_481)"><path fill="#E5E7EB" d="M15 0v15H0V0z"></path><path fill="#E5E7EB" d="M15 0v15H0V0z"></path><circle cx="7.5" cy="11.5" r="1.5" transform="rotate(-180 7.5 11.5)" fill="#00aecd"></circle><circle cx="7.5" cy="7.5" r="1.5" transform="rotate(-180 7.5 7.5)" fill="#00aecd"></circle><circle cx="7.5" cy="3.5" r="1.5" transform="rotate(-180 7.5 3.5)" fill="#00aecd"></circle></g><defs><clipPath id="clip0_2157_481"><path fill="#fff" transform="rotate(90 7.5 7.5)" d="M0 0h15v15H0z"></path></clipPath></defs></svg>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, onBeforeUnmount, nextTick} from "vue";
import { AdsterraAd } from "@/utils/adSdk.js";
import {gaLogEvent} from "../utils/event";
const props = defineProps({
  idTxt: {
    default: "adsterra-banner-1-box",
    type: String
  },
  zid: Number,
  immediate: {
    type: Boolean,
    default: false // 👈 是否首屏直出
  },
  showTitle: {
    type: Boolean,
    default: false
  }
})

const adRef = ref(null)

const adLoaded = ref(false)

const adHeight = ref(0)

let resizeObserver = null

const checkHeight = () => {
  if (!adRef.value) return

  const height = adRef.value.offsetHeight || 0

  adHeight.value = height

  // 广告真实加载成功
  adLoaded.value = height > 50

  console.log('ad height:', height)
  console.log('ad loading:', adLoaded.value)

  if (adLoaded.value) {
    gaLogEvent.logEvent({
      eventName: "adsterra_banner_loading_success",
      eventValue: "",
      eventLog: `adsterra banner loading success`
    })
  }
}

onMounted(async () => {
  // 先加载广告
  showAd(props.zid)

  await nextTick()
  // 初始检测
  checkHeight()

  // 监听容器高度变化
  resizeObserver = new ResizeObserver(() => {
    checkHeight()
  })

  resizeObserver.observe(adRef.value)
})

const showAd = (type) => {
  // let options;
  // let script;
  //
  // if (type === 2) {
  //   options = {
  //     key: '8dcf53405071d2838182738cbc9a4c0e',
  //     format: 'iframe',
  //     height: 250,
  //     width: 300,
  //     params: {}
  //   };
  //   script = "https://www.highperformanceformat.com/8dcf53405071d2838182738cbc9a4c0e/invoke.js";
  // } else if (type === 3) {
  //   options = {
  //     key: '5459cbf4cf22d7a2a5cdeb4108417b4d',
  //     format: 'iframe',
  //     height: 50,
  //     width: 320,
  //     params: {}
  //   };
  //   script = "https://www.highperformanceformat.com/5459cbf4cf22d7a2a5cdeb4108417b4d/invoke.js";
  // } else {
  //   options = {
  //     key: 'd485bca4ce91450e3b58525457ee556a',
  //     format: 'iframe',
  //     height: 250,
  //     width: 300,
  //     params: {}
  //   };
  //   script = "https://www.highperformanceformat.com/d485bca4ce91450e3b58525457ee556a/invoke.js";
  // }

  // 👇 关键分支
  if (props.immediate) {
    AdsterraAd.showBannerImmediate(props.idTxt, options, script);
  } else {
    // const options = {
    //   key: 'd485bca4ce91450e3b58525457ee556a',
    //   format: 'iframe',
    //   height: 250,
    //   width: 300,
    //   params: {}
    // }

    const options = {
      'key' : '8dcf53405071d2838182738cbc9a4c0e',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    }
    // AdsterraAd.showBanner(props.idTxt, options, "https://freshmanhow.com/d485bca4ce91450e3b58525457ee556a/invoke.js");
    AdsterraAd.showBanner(props.idTxt, options, "https://freshmanhow.com/8dcf53405071d2838182738cbc9a4c0e/invoke.js");

    // const options = {
    //   'key' : '8dcf53405071d2838182738cbc9a4c0e',
    //   'format' : 'iframe',
    //   'height' : 250,
    //   'width' : 300,
    //   'params' : {}
    // }
    // AdsterraAd.showBanner(props.idTxt, options, "https://freshmanhow.com/8dcf53405071d2838182738cbc9a4c0e/invoke.js");

    gaLogEvent.logEvent({
      eventName: "adsterra_banner_success",
      eventValue: options.key,
      eventLog: `adsterra banner success`
    })
  }
}

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.adContainer {
  width: 100%;
  min-height: 50px;
  background-color: rgb(229, 231, 235);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.adContainer .ad-title {
  color: #00aecd;
  position: absolute;
  top: 1px;
  right: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>