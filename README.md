<h1>管理平台</h1>

## 介绍

本系统是基于 [vue-pure-admin](https://yiming_chang.gitee.io/pure-admin-doc) 框架魔改而来，使用 vue3+element-plus+ts+pinia+vite 开发

## 用法

### 安装依赖

npm install

### 安装一个包

npm install 包名

### 卸载一个包

npm remove 包名

## 开发注意事项

### node 版本

需要>=16.0.0

### 权限处理

- 组件需要设置 name 属性，且不能重复

```javascript
defineOptions({
  name: 'Name'
});
```

- 新增页面权限

1. 开发页面
2. 系统设置-资源管理中新增页面
3. 角色管理中绑定权限
4. 刷新页面

- 细粒度(按钮,表格列等)权限

1. dom 元素使用`v-auth(权限标识（等同于资源管理中的路径)`自定义指令
2. 系统设置-资源管理中新增细粒度权限
3. 角色管理中绑定权限
4. 刷新页面

### 公共 hook

项目公共 hook 统一放在[hooks 文件夹](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/tree/master/src/hooks)中,在实际开发中公共 hook 能够满足需求的,禁止在单独实现
下面展示部分 hook 的使用方法,未展示的自己看代码就能看明白

- 高级搜索([useAdvancedSearch](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/hooks/useAdvancedSearch.ts))<br>
  **注意:useAdvancedSearch 中已经引入了 useDynamicTableHeight,所以在使用高级搜索的时候,无需再引入动态计算表格高度,否则会导致 onMounted 函数挂载两次**

```javascript
//引入hook和需要的icon
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
...
//调用
const { advancedSearch, toggleAdvancedSearch } = useAdvancedSearch();
...
//需要控制的form表单
<template v-if="advancedSearch">
...
</template>
...
//控制按钮
 <el-button link type="primary" @click="toggleAdvancedSearch">
   {{ advancedSearch ? '收起' : '展开' }}
   <el-icon class="el-icon--right">
     <component :is="advancedSearch ? ArrowUp : ArrowDown" />
   </el-icon>
</el-button>
```

- 公共 api([useCommonApi](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/hooks/useCommonApi.ts))

```javascript
//引入hook
import { useCommonApi } from '@/hooks/useCommonApi';
...
//调用
const { allRole, getRoleList } = useCommonApi();
...
//调用对应的方法
onMounted(() => {
  getRoleList({ platType: 0 });
});
...
//使用
<el-option v-for="item in allRole" :key="item.code" :label="item.name" :value="item.code" />
```

- 动态计算表格高度([useDynamicTableHeight](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/hooks/useDynamicTableHeight.ts))<br>
  **注意:useAdvancedSearch 中已经引入了 useDynamicTableHeight,所以在使用高级搜索的时候,无需再引入动态计算表格高度,否则会导致 onMounted 函数挂载两次**

```javascript
引入hook
import { useDynamicTableHeight } from '@/hooks/useDynamicTableHeight';
...
//直接调用
useDynamicTableHeight();
```

- 查询参数([useQueryParam](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/hooks/useQueryParam.ts))

```javascript
//引入
import { useQueryParam } from '@/hooks/useQueryParam';
...
//业务参数中不需要写分页参数
const initialQueryParam = {
  userName: '',
  userStatus: '',
  roleId: '',
  platType: 1
};

const { queryParam, handleResetQueryParam } = useQueryParam(initialQueryParam);
...
//调用重置查询参数方法
<el-button :icon="Refresh" @click="handleResetQueryParam">重置</el-button>
```

### 公共组件

项目公共组件统一放在[components 文件夹中](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/tree/master/src/components)

- 时间范围查询组件([BaseDateTimeRange](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/components/BaseDateTimeRange/Index.vue))
  封装此组件的原因是因为 element-plus 日期时间组件的 daterange 存在 bug,此 bug 会导致 el-form-item 组件的 label 不会加粗
- 表格工具组件([BaseTableBar](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/components/BaseTableBar/Index.vue))
- 下载按钮组件([BaseDownloadButton](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/components/BaseDownloadButton/Index.vue))

```html
<base-download-button url="/productInfo/exportProductInfo" :param="queryParam">下载</base-download-button>
```

- 详情页单项组件([BaseDetailItem](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/components/BaseDetailItem/Index.vue))

- 详情跳转链接组件([BaseDetailLink](http://gitlab.1jiaofei.com/lancheng-web/lancheng-y-time-admin/blob/master/src/components/BaseDetailLink/Index.vue))
