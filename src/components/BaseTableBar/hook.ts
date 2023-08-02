import { ref } from 'vue';
export const useBaseTableBar = () => {
  const screenWith = window.screen.width;
  const tableSize = ref<any>('default');
  if (screenWith < 1400) {
    tableSize.value = 'small';
  }
  const tableAlign = ref<any>('center');
  const tableStripe = ref<boolean>(false);
  return { tableAlign, tableSize, tableStripe };
};
