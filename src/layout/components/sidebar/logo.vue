<script setup lang="ts">
import { useNav } from '@/layout/hooks/useNav';
import HomeLogo from '@/assets/svg/HomeLogo.svg?component';
import LogoTitle from '@/assets/svg/logo-title.svg?component';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { computed } from 'vue';
const props = defineProps({
  collapse: Boolean
});

const { title } = useNav();
const { layoutTheme } = useDataThemeChange();
const logoTitleColor = computed(() => {
  if (layoutTheme.value.theme === 'light') {
    return 'var(--el-text-color-primary)';
  } else {
    return '#fff';
  }
});
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapses: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="props.collapse" key="props.collapse" :title="title" class="sidebar-logo-link" to="/">
        <HomeLogo />
      </router-link>
      <router-link v-else key="expand" :title="title" class="sidebar-logo-link" to="/">
        <!-- <Logo style="width: 48px; height: 32px" /> -->
        <HomeLogo />
        <LogoTitle :style="{ fill: logoTitleColor }" />
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  width: 100%;
  height: 48px;
  overflow: hidden;
  position: relative;

  .sidebar-logo-link {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    img {
      height: 32px;
      display: inline-block;
    }

    .sidebar-title {
      height: 32px;
      line-height: 32px;
      margin: 2px 0 0 12px;
      color: $subMenuActiveText;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
