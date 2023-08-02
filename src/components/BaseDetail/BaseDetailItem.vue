<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>

<template>
  <span class="box">
    <span class="detail-item-label">{{ props.label }}：</span>
    <span class="detail-item-info">
      <slot />
    </span>
  </span>
</template>

<style scoped lang="scss">
.box {
  margin-top: 6px;
  margin-bottom: 6px;
}

.detail-item-label {
  color: var(--el-text-color-primary);
}

.detail-item-info {
  color: var(--el-text-color-regular);
}

.box + .box {
  margin-left: 12px;
}
</style>
