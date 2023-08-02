import { onMounted } from 'vue';
import { throttle } from '@pureadmin/utils';
//如果页面中使用了useAdvancedSearch的话就不需要在引入useDynamicTableHeight了,否则会导致onMounted挂载两次
export const useDynamicTableHeight = () => {
  const calcTableHeight = () => {
    //当前可视区域的高度 - 表格到顶部的高度 - 表头的高度 - 分页的高度 - 间距
    setTimeout(() => {
      let tableHeight =
        window.innerHeight -
        document.querySelector('.el-table__body-wrapper').getBoundingClientRect().top -
        (<HTMLImageElement>document.querySelector('.el-table__header-wrapper')).offsetHeight -
        30;
      if (tableHeight < 200) tableHeight = 200;
      (<HTMLImageElement>(
        document.querySelector('.el-table__body-wrapper .el-scrollbar__wrap')
      )).style.height = `${tableHeight}px`;
    }, 100);
  };
  onMounted(() => {
    window.onresize = throttle(calcTableHeight, 500);
    calcTableHeight();
  });
  return {
    calcTableHeight
  };
};
