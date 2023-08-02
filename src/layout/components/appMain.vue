<script setup lang="ts">
import { useGlobal, useWatermark } from '@pureadmin/utils';
import backTop from '@/assets/svg/back_top.svg?component';
import { h, computed, Transition, defineComponent, onMounted, nextTick, ref, onBeforeUnmount } from 'vue';
import { usePermissionStoreHook } from '@/store/modules/permission';

import { useUserStoreHook } from '@/store/modules/user';
import { usePageChangeAnimationStoreHook } from '@/store/modules/pageChangeAnimation';
const local = ref();
const { setWatermark: setLocalWatermark, clear } = useWatermark(local);

const props = defineProps({
  fixedHeader: Boolean
});

const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

const keepAlive = computed(() => {
  return $config?.KeepAlive;
});

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const hideTabs = computed(() => {
  return $storage?.configure.hideTabs;
});

const layout = computed(() => {
  return $storage?.layout.layout === 'vertical';
});

const getSectionStyle = computed(() => {
  return [
    hideTabs.value && layout ? 'padding-top: 48px;' : '',
    !hideTabs.value && layout ? 'padding-top: 85px;' : '',
    hideTabs.value && !layout.value ? 'padding-top: 48px' : '',
    !hideTabs.value && !layout.value ? 'padding-top: 85px;' : '',
    props.fixedHeader ? '' : 'padding-top: 0;'
  ];
});

const transitionMain = defineComponent({
  render() {
    return h(
      Transition,
      {
        name: usePageChangeAnimationStoreHook().getPageChangeAnimation
          ? transitions.value(this.route) && this.route.meta.transition.enterTransition
            ? 'pure-classes-transition'
            : (transitions.value(this.route) && this.route.meta.transition.name) || 'fade-transform'
          : '',
        enterActiveClass:
          transitions.value(this.route) && `animate__animated ${this.route.meta.transition.enterTransition}`,
        leaveActiveClass:
          transitions.value(this.route) && `animate__animated ${this.route.meta.transition.leaveTransition}`,
        mode: 'out-in',
        appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  },
  props: {
    route: {
      type: undefined,
      required: true
    }
  }
});

onMounted(() => {
  nextTick(() => {
    const username = useUserStoreHook()?.username;
    setLocalWatermark(username, {
      globalAlpha: 0.26, // 值越低越透明
      fillStyle: '#c5c5c5',
      fillTextHeight: 1
    });
  });
});
onBeforeUnmount(() => {
  clear();
});
</script>

<template>
  <section
    :class="[props.fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
    :style="getSectionStyle"
    :ref="props.fixedHeader ? 'local' : ''"
  >
    <router-view>
      <template #default="{ Component, route }">
        <el-scrollbar v-if="props.fixedHeader">
          <el-backtop title="回到顶部" target=".app-main .el-scrollbar__wrap">
            <backTop />
          </el-backtop>
          <!-- 如果不需要动画的话可以把这个注释掉 -->
          <transitionMain :route="route">
            <keep-alive v-if="keepAlive" :include="usePermissionStoreHook().cachePageList">
              <component :is="Component" :key="route.fullPath" class="main-content" />
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" class="main-content" />
          </transitionMain>
        </el-scrollbar>
        <div v-else>
          <!-- 如果不需要动画的话可以把这个注释掉 -->
          <transitionMain :route="route">
            <keep-alive v-if="keepAlive" :include="usePermissionStoreHook().cachePageList">
              <component :is="Component" :key="route.fullPath" class="main-content" />
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" class="main-content" />
          </transitionMain>
        </div>
      </template>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.app-main-nofixed-header {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin: 10px;
  padding: 10px;
  background-color: #fff;
}
</style>
