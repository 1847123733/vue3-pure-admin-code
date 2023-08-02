<!-- 日期/时间单独封装的原因:时间范围在表单中使用时不会加粗显示 -->

<script setup lang="ts">
import { ref, withDefaults, watch, onMounted, nextTick } from 'vue';
import dayjs from 'dayjs';
import { IDatePickerType } from 'element-plus/es/components/date-picker/src/date-picker.type';
export interface Props {
  startTime: string | Date;
  endTime: string | Date;
  type: IDatePickerType;
  format?: string;
  initDefaultTime?: string[];
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabledDate?: (date: Date) => boolean;
  clearable?: boolean;
  shortcuts?: Array<{
    text: string;
    value: () => Date[];
  }>;
}
const props = withDefaults(defineProps<Props>(), {
  format: 'YYYY-MM-DD',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  showShortcuts: true,
  initDefaultTime: () => ['00:00:00', '23:59:59'],
  clearable: false
});

const dateTime = ref<[Date, Date]>();
const defaultTime = ref<[Date, Date]>([
  new Date(dayjs('2000-1-1 ' + props.initDefaultTime[0]).valueOf()),
  new Date(dayjs('2000-1-1 ' + props.initDefaultTime[1]).valueOf())
]);

const emit = defineEmits(['update:startTime', 'update:endTime']);

const change = (val: [Date, Date]) => {
  const startTime = val[0],
    endTime = val[1];
  if (startTime === null) {
    emit('update:startTime', '');
  } else if (dayjs(startTime).isValid()) {
    emit('update:startTime', `${dayjs(startTime).format(props.format)}`);
  }

  if (endTime === null) {
    emit('update:endTime', '');
  } else if (dayjs(endTime).isValid()) {
    emit('update:endTime', `${dayjs(endTime).format(props.format)}`);
  }
};

watch([() => props.startTime, () => props.endTime], newVal => {
  if (newVal.every(x => x === '')) {
    change([null, null]);
    dateTime.value = [null, null];
  } else {
    change([new Date(props.startTime), new Date(props.endTime)]);
    dateTime.value = [new Date(props.startTime), new Date(props.endTime)];
  }
});

watch(
  () => dateTime,
  newVal => {
    if (newVal.value === null) {
      change([null, null]);
    }
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    dateTime.value = [new Date(dayjs(props.startTime).valueOf()), new Date(dayjs(props.endTime).valueOf())];
  });
});
</script>

<template>
  <el-date-picker
    v-model="dateTime"
    :clearable="clearable"
    :type="type"
    :shortcuts="shortcuts"
    range-separator="-"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :default-time="defaultTime"
    @change="change"
    :disabled-date="disabledDate"
  />
  <!-- daterange的实现是两个原生input，所以它不会被form认为需要换成label标签,放一个假的骗他一手 -->
  <el-input v-show="false" />
</template>

<style scoped></style>
