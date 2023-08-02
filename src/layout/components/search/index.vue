<script setup lang="ts">
import { SearchModal } from './components';
import { useBoolean } from '../../hooks/useBoolean';
import { onMounted } from 'vue';
import Search from '@iconify-icons/ep/search';

const { bool: show, toggle } = useBoolean();
function handleSearch() {
  toggle();
}
onMounted(() => {
  document.onkeydown = e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      //  执行save方法
      toggle();
      // 阻止默认事件
      e.preventDefault();
    }
  };
});
</script>

<template>
  <div class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover" @click="handleSearch">
    <IconifyIconOffline :icon="Search" />
  </div>
  <SearchModal v-model:value="show" />
</template>
