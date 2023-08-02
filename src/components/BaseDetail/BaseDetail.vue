<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="detail-item-title">
    <span>
      {{ props.title }}
    </span>
    <slot name="handle" />
  </div>
  <div class="detail-item-box">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.detail-item-title {
  position: relative;
  margin-top: 12px;
  margin-bottom: 12px;

  > span {
    display: inline-block;
    height: 40px;
    text-indent: 12px;
    border-left: 2px solid var(--el-color-primary);
    font-weight: 700;
    line-height: 40px;
    color: var(--el-color-primary);
  }
}

.detail-item-box {
  padding-left: 14px;
}
</style>
