<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Upload, Refresh } from '@element-plus/icons-vue';
import * as serve from '@/api/operation/nonMainBusinessIncome';
import { TotalAmountPersonnel } from '@/api/operation/nonMainBusinessIncome';
import { useBaseTableBar } from '@/components/BaseTableBar/hook';
import { usePagination } from '@/hooks/usePagination';
import { useQueryParam } from '@/hooks/useQueryParam';
import { useDynamicTableHeight } from '@/hooks/useDynamicTableHeight';
import { useDateTool } from '@/hooks/useDateTool';
import BaseDateTimeRange from '@/components/BaseDateTimeRange/Index.vue';
import { useCommonApi } from '@/hooks/useCommonApi';
// import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { storeStatus } from './data';

defineOptions({
  name: 'PersonnelSalary' //人事薪酬统计
});
useDynamicTableHeight();
const { tableAlign, tableSize, tableStripe } = useBaseTableBar();
const { getLastMonth } = useDateTool();
// const { advancedSearch, toggleAdvancedSearch } = useAdvancedSearch();

const initialQueryParam = {
  startDate: getLastMonth(1, 'YYYY-MM'),
  endDate: getLastMonth(1, 'YYYY-MM'),
  storeCode: undefined,
  stateFlag: ['0', '1', '2', '3', '4', '5']
};
console.log(initialQueryParam, 'initialQueryParam');

const { queryParam, handleResetQueryParam } = useQueryParam(initialQueryParam);
const state = reactive({
  tableData: [],
  rowData: {} as TotalAmountPersonnel
});
const queryLoading = ref(false);
const getList = async () => {
  queryLoading.value = true;
  const res = await serve.queryListPersonnel({
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

const getListTotal = async () => {
  queryLoading.value = true;
  const res = await serve.getTotalAmountPersonnel({
    ...queryParam,
    stateFlag: queryParam.stateFlag.length == 6 ? undefined : queryParam.stateFlag.join(',')
  });
  queryLoading.value = false;
  if (res.code === 200) {
    state.rowData = res.data;
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
  getListTotal();
  getList();
};

const isShow = ref(false);
const openUpload = () => {
  isShow.value = true;
};
const onCloseDialog = () => {
  isShow.value = false;
};
const { getStoreCodesAndNames, allStore } = useCommonApi();
onMounted(() => {
  getList();
  getListTotal();
  getStoreCodesAndNames();
});
</script>

<template>
  <main>
    <el-form @submit.prevent @keydown.enter="handleSearch">
      <el-row :gutter="20">
        <el-col :xl="55" :lg="8">
          <el-form-item label="统计月份">
            <base-date-time-range
              v-model:startTime="queryParam.startDate"
              v-model:endTime="queryParam.endDate"
              format="YYYY-MM"
              type="monthrange"
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
            <base-download-button url="/personnelSalary/exportList" :param="queryParam">导出</base-download-button>
            <el-button :icon="Refresh" @click="handleResetQueryParam" :loading="queryLoading">重置</el-button>
          </el-button-group>
          <!-- <el-button link type="primary" @click="toggleAdvancedSearch">
            {{ advancedSearch ? '收起' : '展开' }}
            <el-icon class="el-icon--right">
              <component :is="advancedSearch ? ArrowUp : ArrowDown" />
            </el-icon>
          </el-button> -->
        </el-col>
      </el-row>
      <base-table-bar-box>
        <template #button>
          <el-button
            link
            type="primary"
            :icon="Upload"
            v-auth="'/operation/PersonnelSalaryChannel'"
            @click="openUpload"
            :loading="queryLoading"
          >
            导入
          </el-button>
        </template>
        <template #statistics>
          <div class="statistics-box">
            <span>总工资： {{ state.rowData?.totalSalary || 0 }}</span>
            <span>总社保： {{ state.rowData?.totalSocialInsurance || 0 }}</span>
            <span>总福利： {{ state.rowData?.totalWelfare || 0 }}</span>
          </div>
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
      >
        <el-table-column label="门店编号" prop="storeCode" min-width="100" />
        <el-table-column label="门店名称" prop="storeName" show-overflow-tooltip />
        <el-table-column label="门店状态" prop="stateFlagName" />
        <el-table-column label="工资" prop="salary" min-width="120" />
        <el-table-column label="社保" prop="socialInsurance" />
        <el-table-column label="福利" prop="welfare" />
        <el-table-column label="统计月份" prop="statMonth" min-width="140" />
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
      uploadUrl="/personnelSalary/uploadFile"
      templateDownloadUrl="/common/templateDownLoad"
      :paramDownloadUrl="{
        templateEnum: 'PERSONNEL_SALARY'
      }"
      @onCloseDialog="onCloseDialog"
      @refreshData="handleSearch"
      keyWord="file"
    />
  </main>
</template>

<style scoped>
.statistics-box span {
  margin-right: 20px;
  color: #f00;
}
</style>
