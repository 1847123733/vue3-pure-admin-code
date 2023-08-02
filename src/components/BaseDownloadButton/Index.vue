<script setup lang="ts">
import { withDefaults, ref } from 'vue';
import { commonDownload } from '@/api/common';
import { Download } from '@element-plus/icons-vue';
interface Props {
  url: string;
  param?: object;
  link?: boolean;
  text?: boolean;
  icon?: any;
}
const props = withDefaults(defineProps<Props>(), {
  link: false,
  text: false,
  icon: Download
});
const downloadLoading = ref(false);
const download = async () => {
  downloadLoading.value = true;
  await commonDownload(props.param, props.url);
  downloadLoading.value = false;
};
</script>

<template>
  <el-button @click="download" :icon="icon" :link="link" :text="text" type="primary" :loading="downloadLoading">
    <slot />
  </el-button>
</template>

<style scoped></style>
