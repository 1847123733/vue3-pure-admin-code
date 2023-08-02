<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useQueryParam } from '@/hooks/useQueryParam';
import { usePagination } from '@/hooks/usePagination';
import { useBaseTableBar } from '@/components/BaseTableBar/hook';
import { Refresh, Search } from '@element-plus/icons-vue';
//todo 修改引入api
import * as serve from '@/api/operation/nonMainBusinessIncome';
import { ElMessage, FormInstance } from 'element-plus';
import { useDynamicTableHeight } from '@/hooks/useDynamicTableHeight';
import { useCommonApi } from '@/hooks/useCommonApi';
import { storeStatus } from './data';

//todo 设置name
defineOptions({
  name: 'StoreTooling'
});

//#region hooks
useDynamicTableHeight();
const { tableAlign, tableSize, tableStripe } = useBaseTableBar();
//#endregion
//#region 查询参数
//todo 设置查询参数
const initialQueryParam = {
  storeCode: '',
  stateFlag: ['0', '1', '2', '3', '4', '5']
};
const { queryParam, handleResetQueryParam } = useQueryParam(initialQueryParam);
const state = reactive({
  tableData: []
});
const queryLoading = ref(false);
const getList = async () => {
  queryLoading.value = true;
  const res = await serve.queryListFrock({
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
//#endregion

//#region 新增&修改
//todo 设置参数验证
const rules = {
  changeNum: [{ required: true, message: '请输入', trigger: 'blur' }]
};
const formLabelWidth = '150px';
const editDialogVisible = ref(false);
//todo 设置编辑参数
const form = reactive({
  storeCode: '',
  storeName: '',
  changeNum: null,
  totalNum: '',
  totalAmount: '',
  changeList: []
});
const formLoading = ref(false);
const ruleFormRef = ref<FormInstance>();
const editTitle = ref('');
const handleEdit = async (row, type) => {
  if (type == 'details') {
    editTitle.value = '门店工装详情';
    form.storeCode = row.storeCode;
    form.storeName = row.storeName;
    formLoading.value = true;
    const res = await serve.queryDetail({ storeCode: form.storeCode });
    formLoading.value = false;
    if (res.code === 200) {
      if (res.data) {
        form.totalNum = res.data.totalNum;
        form.totalAmount = res.data.totalAmount;
        form.changeList = res.data.changeList;
      } else {
        form.totalNum = null;
        form.totalAmount = '';
        form.changeList = [];
      }
    } else {
      ElMessage.error(res.message);
    }
  } else {
    form.storeCode = row.storeCode;
    form.storeName = row.storeName;
    form.changeNum = null;
    editTitle.value = '增加工装';
  }
  editDialogVisible.value = true;
};
const editSure = async () => {
  await ruleFormRef.value.validate(async valid => {
    if (valid) {
      const res = await serve.addStoreFrock({
        storeCode: form.storeCode,
        changeNum: form.changeNum
      });
      if (res.code === 200) {
        ElMessage.success(editTitle.value + '成功');
        editDialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(res.message);
      }
    }
  });
};
//#endregion

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
        <!-- todo根据参数修改查询条件 -->
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
            <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
            <base-download-button url="/storeFrock/exportList" :param="queryParam">导出</base-download-button>
            <el-button :icon="Refresh" @click="handleResetQueryParam">重置</el-button>
          </el-button-group>
        </el-col>
      </el-row>
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
        <el-table-column label="操作" fixed width="220">
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row, 'details')">详情</el-button>
            <el-button type="text" @click="handleEdit(row, 'add')">增加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="门店编码" prop="storeCode" />
        <el-table-column label="门店名称" prop="storeName" min-width="70" />
        <el-table-column label="门店状态" prop="stateFlagName" />
        <el-table-column label="工装总数量" prop="totalNum" min-width="100" />
        <el-table-column label="工装总金额" prop="totalAmount" min-width="70" />
        <el-table-column label="最后领取时间" prop="updateTime" min-width="100" />
      </el-table>
    </el-row>
    <el-row justify="end">
      <base-table-bar v-model:tableSize="tableSize" v-model:tableAlign="tableAlign" v-model:tableStripe="tableStripe" />
      <el-pagination
        v-model:current-page="queryParam.pageNo"
        v-model:page-size="queryParam.pageSize"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="dataTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <el-dialog v-model="editDialogVisible" :title="form.storeName + editTitle" top="5vh" width="900">
      <el-form
        v-if="editTitle == '增加工装'"
        :model="form"
        ref="ruleFormRef"
        :rules="rules"
        @submit.prevent
        @keydown.enter="editSure"
      >
        <el-form-item label="请选择要增加的数量" :label-width="formLabelWidth" prop="changeNum">
          <el-input-number v-model="form.changeNum" placeholder="请输入" :min="1" :max="100" :precision="0" />
        </el-form-item>
      </el-form>
      <div v-else>
        <el-row>
          <el-col :span="12">
            <label>工装总数：</label>
            <span>{{ form.totalNum || 0 }}件</span>
          </el-col>
          <el-col :span="12">
            <label>工装总金额：</label>
            <span>{{ form.totalAmount || 0 }}元</span>
          </el-col>
        </el-row>
        <base-detail title="工装变动记录" />
        <el-table
          :data="form.changeList"
          :size="tableSize"
          :stripe="tableStripe"
          v-loading="formLoading"
          :cell-style="{ textAlign: tableAlign }"
          :header-cell-style="{ textAlign: tableAlign }"
          :max-height="450"
        >
          <el-table-column label="变动数量" prop="changeNum" />
          <el-table-column label="变动前数量" prop="beforeNum" min-width="70" />
          <el-table-column label="变动后数量" prop="afterNum" min-width="100" />
          <el-table-column label="变动时间" prop="createTime" min-width="70" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button v-if="editTitle == '增加工装'" type="primary" @click="editSure">增加</el-button>
        </span>
      </template>
    </el-dialog>
  </main>
</template>

<style scoped></style>
