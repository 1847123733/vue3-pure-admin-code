<script setup lang="ts">
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { LocationQueryRaw } from 'vue-router';

interface Props {
  to: string;
  query?: LocationQueryRaw;
  params?: object;
  title?: string;
  type?: 'add' | 'replace';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'replace'
});
const toDetail = () => {
  const name = props.to.split('/').at(-1);
  useMultiTagsStoreHook().handleRouterAndTags(props.to, props.title, props.query, props.type, name);
};
</script>

<template>
  <span @click="toDetail">
    <slot />
  </span>
</template>

<style scoped></style>
