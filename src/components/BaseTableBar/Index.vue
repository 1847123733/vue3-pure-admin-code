<script setup lang="ts">
import { DCaret, Fold, Tools } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';
import { useEpThemeStoreHook } from '@/store/modules/epTheme';
const props = defineProps({
  tableSize: {
    type: String,
    default: 'default'
  },
  tableAlign: {
    type: String,
    default: 'center'
  },
  tableStripe: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:tableSize', 'update:tableAlign', 'update:tableStripe']);
const size = ref(props.tableSize);
const align = ref(props.tableAlign);
const stripe = ref(props.tableStripe);
const getDropdownItemStyle = computed(() => {
  return s => {
    if (['left', 'center', 'right'].includes(s)) {
      emit('update:tableAlign', align.value);
      return {
        background: s === align.value ? useEpThemeStoreHook().epThemeColor : '',
        color: s === align.value ? '#fff' : 'var(--el-text-color-primary)'
      };
    } else {
      emit('update:tableSize', size.value);
      return {
        background: s === size.value ? useEpThemeStoreHook().epThemeColor : '',
        color: s === size.value ? '#fff' : 'var(--el-text-color-primary)'
      };
    }
  };
});

const stripeChange = () => {
  emit('update:tableStripe', stripe.value);
};
</script>

<template>
  <div class="operation-bar">
    <el-tooltip effect="dark" content="表格密度" placement="left">
      <el-dropdown trigger="click">
        <el-button link type="primary" :icon="DCaret" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :style="getDropdownItemStyle('large')" @click="size = 'large'">宽松</el-dropdown-item>
            <el-dropdown-item :style="getDropdownItemStyle('default')" @click="size = 'default'">默认</el-dropdown-item>
            <el-dropdown-item :style="getDropdownItemStyle('small')" @click="size = 'small'">紧凑</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-tooltip>
    <el-divider direction="vertical" />
    <el-tooltip effect="dark" content="对齐方式" placement="left">
      <el-dropdown trigger="click">
        <el-button link type="primary" :icon="Fold" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :style="getDropdownItemStyle('left')" @click="align = 'left'">居左</el-dropdown-item>
            <el-dropdown-item :style="getDropdownItemStyle('center')" @click="align = 'center'">居中</el-dropdown-item>
            <el-dropdown-item :style="getDropdownItemStyle('right')" @click="align = 'right'">居右</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-tooltip>
    <el-divider direction="vertical" />
    <el-tooltip effect="dark" content="行设置" placement="left">
      <div>
        <el-popover placement="top" trigger="click">
          <template #reference>
            <el-button link type="primary" :icon="Tools" />
          </template>
          <el-checkbox @change="stripeChange" v-model="stripe" label="斑马纹" />
        </el-popover>
      </div>
    </el-tooltip>
    <el-divider direction="vertical" />
  </div>
</template>

<style scoped>
/* 表格操作栏的样式 */
.operation-bar {
  display: inline-flex;
  align-items: center;
}

.el-button-group + .operation-bar,
.el-button + .operation-bar {
  margin-left: 12px;
}
</style>
