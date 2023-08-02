<script setup lang="ts"></script>

<template>
  <el-row justify="space-between">
    <div class="operation-bar" :span="12">
      <slot name="button" />
    </div>
    <slot name="statistics" />
  </el-row>
</template>

<style scoped>
/* 表格操作栏的样式 */
.operation-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.table-bar {
  display: flex;
  align-items: center;
}
</style>
