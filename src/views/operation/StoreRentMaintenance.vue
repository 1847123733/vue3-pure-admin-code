<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Upload, Refresh } from '@element-plus/icons-vue';
import * as serve from '@/api/operation/nonMainBusinessIncome';
import { useBaseTableBar } from '@/components/BaseTableBar/hook';
import { usePagination } from '@/hooks/usePagination';
import { useQueryParam } from '@/hooks/useQueryParam';
import { useDynamicTableHeight } from '@/hooks/useDynamicTableHeight';
import { useDateTool } from '@/hooks/useDateTool';
import { useCommonApi } from '@/hooks/useCommonApi';
// import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { monthData, storeStatus } from './data';

defineOptions({
  name: 'StoreRentMaintenance' //门店房租维护
});
useDynamicTableHeight();
const { tableAlign, tableSize, tableStripe } = useBaseTableBar();
const { getDate } = useDateTool();
// const { advancedSearch, toggleAdvancedSearch } = useAdvancedSearch();

const initialQueryParam = {
  yearly: getDate('YYYY'),
  storeCode: undefined,
  stateFlag: ['0', '1', '2', '3', '4', '5']
};
console.log(initialQueryParam, 'initialQueryParam');

const { queryParam, handleResetQueryParam } = useQueryParam(initialQueryParam);
const state = reactive({
  tableData: []
});
const queryLoading = ref(false);
const getList = async () => {
  queryLoading.value = true;
  const res = await serve.queryListRent({
    ...queryParam,
    stateFlag: queryParam.stateFlag.length == 6 ? undefined : queryParam.stateFlag.join(',')
  });
  queryLoading.value = false;
  if (res.code === 200) {
    state.tableData = res.data.list;
    dataTotal.value = res.data.totalCount;
  } else {
    ElMessage.error(res.message);
  }
};

const { pageSizes, paginationLayout, dataTotal, handleCurrentChange, handleSizeChange } = usePagination(
  queryParam,
  getList
);
const handleSearch = () => {
  queryParam.pageNo = 1;
  getList();
};

const isShow = ref(false);
const openUpload = () => {
  isShow.value = true;
};
const onCloseDialog = () => {
  isShow.value = false;
};

const save = async row => {
  queryLoading.value = true;
  const element = {
    ...row,
    yearly: queryParam.yearly
  };
  const res = await serve.updateRentInfo(element);
  queryLoading.value = false;
  if (res.code === 200) {
    ElMessage.success(res.message);
    getList();
  } else {
    ElMessage.error(res.message);
  }
};

const edit = (index, type) => {
  state.tableData[index].editable = !state.tableData[index].editable;
  if (type == 'cancel') {
    getList();
  }
};

const { getStoreCodesAndNames, allStore } = useCommonApi();
onMounted(() => {
  getList();
  getStoreCodesAndNames();
});
</script>

<template>
  <main>
    <el-form @submit.prevent @keydown.enter="handleSearch">
      <el-row :gutter="20">
        <el-col :xl="55" :lg="8">
          <el-form-item label="年份">
            <el-date-picker
              :clearable="false"
              v-model="queryParam.yearly"
              type="year"
              format="YYYY"
              value-format="YYYY"
              placeholder="请选择年份"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="55" :lg="8">
          <el-form-item label="门店">
            <el-select placeholder="请选择门店" clearable v-model="queryParam.storeCode" filterable>
              <el-option
                :value="item.storeCode"
                :label="item.storeName"
                v-for="item in allStore"
                :key="item.storeCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="55" :lg="8">
          <el-form-item label="门店状态">
            <el-select
              placeholder="请选择门店"
              clearable
              multiple
              collapse-tags
              filterable
              v-model="queryParam.stateFlag"
            >
              <el-option :value="item.code" :label="item.title" v-for="item in storeStatus" :key="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="55" :lg="8">
          <el-button-group>
            <el-button :icon="Search" type="primary" @click="handleSearch" :loading="queryLoading">查询</el-button>
            <base-download-button url="/storeRent/exportList" :param="queryParam">导出</base-download-button>
            <el-button :icon="Refresh" @click="handleResetQueryParam" :loading="queryLoading">重置</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <base-table-bar-box>
        <template #button>
          <el-button
            link
            type="primary"
            :icon="Upload"
            v-auth="'/operation/StoreRentMaintenanceChannel'"
            @click="openUpload"
            :loading="queryLoading"
          >
            导入
          </el-button>
        </template>
      </base-table-bar-box>
    </el-form>
    <el-row>
      <el-table
        :data="state.tableData"
        :size="tableSize"
        :stripe="tableStripe"
        v-loading="queryLoading"
        :cell-style="{ textAlign: tableAlign }"
        :header-cell-style="{ textAlign: tableAlign }"
        :scroll="{ x: true }"
      >
        <el-table-column label="门店编号" prop="storeCode" fixed min-width="100" />
        <el-table-column label="门店名称" prop="storeName" fixed show-overflow-tooltip min-width="200" />
        <el-table-column label="门店状态" prop="stateFlagName" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="{ row, $index }">
            <template v-if="row.editable">
              <el-button type="text" @click="save(row)">保存</el-button>
              <el-button type="text" @click="edit($index, 'cancel')">取消</el-button>
            </template>
            <el-button v-else type="text" @click="edit($index, '')">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column v-for="item in monthData" :key="item.code" :label="item.title" :prop="item.code" width="100">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input-number
                style="width: 90px"
                :controls="false"
                v-model="row[item.code]"
                placeholder="请输入"
                :min="1"
                :max="999999"
                :precision="2"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row justify="end">
      <base-table-bar v-model:tableSize="tableSize" v-model:tableAlign="tableAlign" v-model:tableStripe="tableStripe" />
      <el-pagination
        v-model:current-page="queryParam.pageNumber"
        v-model:page-size="queryParam.pageSize"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="dataTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <base-upload-dialog
      :isShow="isShow"
      :limitAmount="1"
      uploadUrl="/storeRent/uploadFile"
      templateDownloadUrl="/common/templateDownLoad"
      :paramDownloadUrl="{
        templateEnum: 'STORE_RENT'
      }"
      @onCloseDialog="onCloseDialog"
      @refreshData="handleSearch"
      keyWord="file"
    />
  </main>
</template>
