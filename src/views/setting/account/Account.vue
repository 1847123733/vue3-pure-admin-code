<script setup lang="ts">
import { reactive, onMounted, ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh, Search, Plus, Edit, VideoPlay, VideoPause, Connection } from '@element-plus/icons-vue';
import * as serve from '@/api/setting/account';
import type { FormInstance } from 'element-plus';
import { useBaseTableBar } from '@/components/BaseTableBar/hook';
import { usePagination } from '@/hooks/usePagination';
import { useCommonApi } from '@/hooks/useCommonApi';
import { useQueryParam } from '@/hooks/useQueryParam';
import { StateType, stateSelect } from './enum';
import { useDynamicTableHeight } from '@/hooks/useDynamicTableHeight';

defineOptions({
  name: 'Account'
});

const { tableAlign, tableSize, tableStripe } = useBaseTableBar();
const { allRole, getRoleList } = useCommonApi();
useDynamicTableHeight();
const initialQueryParam = {
  userName: '',
  userStatus: '',
  roleId: '',
  platType: 1
};

const { queryParam, handleResetQueryParam } = useQueryParam(initialQueryParam);
const state = reactive({
  tableData: []
});
const queryLoading = ref(false);
const getList = async () => {
  queryLoading.value = true;
  const res = await serve.getAccountList(queryParam);
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

const disableAccount = async (userAccount: string, userStatus: string) => {
  const res = await serve.updateStatus({
    platType: 1,
    userAccount,
    userStatus
  });
  if (res.code === 200) {
    ElMessage.success('操作成功');
    getList();
  } else {
    ElMessage.error(res.message);
  }
};
const validatorPhone = (rule, value, callback) => {
  if (!/(^1[3-9][0-9]{9}$)/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};
import { loginRules } from '@/views/login/utils/rule';
const rules = {
  loginPassword: loginRules.password,
  userName: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
  userAccount: [{ required: true, message: '请输入用户账号', trigger: 'change' }],
  mobile: [{ required: true, validator: validatorPhone, trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择所关联的角色', trigger: 'change' }]
};
const formLabelWidth = '120px';
const editDialogVisible = ref(false);
const form = reactive({
  userName: '',
  userAccount: '',
  roleId: '',
  mobile: '',
  platType: 0,
  id: ''
});
const ruleFormRef = ref<FormInstance>();
const editTitle = ref('');
const edit = row => {
  editDialogVisible.value = true;
  if (row?.userName) {
    editTitle.value = '编辑账号';
    nextTick(() => {
      Object.assign(form, row);
    });
  } else {
    nextTick(() => {
      ruleFormRef.value && ruleFormRef.value.resetFields();
    });
    editTitle.value = '新增账号';
  }
};
const editSure = async () => {
  await ruleFormRef.value.validate(async valid => {
    if (valid) {
      let res;
      if (editTitle.value === '编辑账号') {
        res = await serve.edit(form);
      } else {
        res = await serve.add(form);
      }
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

// #region 绑定钉钉账户
const bindDialogVisible = ref(false);
const bindForm = reactive({
  id: '',
  dingUserCode: ''
});
const bindDingTalkUserRules = {
  dingUserCode: [{ required: true, message: '请选择钉钉账号', trigger: 'change' }]
};
const bindLoading = ref(false);
const bindDingTalkUser = row => {
  getDingTalkUserList();
  bindForm.id = row.id;
  bindForm.dingUserCode = row.dingUserCode;
  bindDialogVisible.value = true;
};

const dingTalkUserList = ref([]);
const getDingTalkUserList = async () => {
  const res = await serve.queryUserName();
  if (res.code === 200) {
    dingTalkUserList.value = res.data;
  }
};
const bindDingTalkUserSure = async () => {
  await bindFormRef.value.validate(async valid => {
    if (valid) {
      bindLoading.value = true;
      const res = await serve.bindUserCode(bindForm).finally(() => {
        bindLoading.value = false;
      });
      if (res.code === 200) {
        ElMessage.success('绑定成功');
        getList();
        bindDialogVisible.value = false;
      } else {
        ElMessage.error(res.message);
      }
    }
  });
};
const bindFormRef = ref<FormInstance>();
// #endregion

onMounted(() => {
  getRoleList({ platType: 0 });
  getList();
});
</script>

<template>
  <main>
    <el-form @submit.prevent @keydown.enter="handleSearch">
      <el-row :gutter="20">
        <el-col :xl="55" :lg="8">
          <el-form-item label="名称/账号">
            <el-input placeholder="请输入名称/账号" clearable v-model="queryParam.userName" />
          </el-form-item>
        </el-col>
        <el-col :xl="55" :lg="8">
          <el-form-item label="状态">
            <el-select v-model="queryParam.userStatus" placeholder="请选择状态" clearable filterable>
              <el-option v-for="item in stateSelect" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="55" :lg="8">
          <el-form-item label="角色">
            <el-select v-model="queryParam.roleId" placeholder="请选择角色" clearable filterable>
              <el-option v-for="item in allRole" :key="item.code" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="55" :lg="8">
          <el-button-group>
            <el-button :icon="Search" type="primary" @click="handleSearch" :loading="queryLoading">查询</el-button>
            <el-button :icon="Refresh" @click="handleResetQueryParam" :loading="queryLoading">重置</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <base-table-bar-box>
        <template #button>
          <el-button link type="primary" :icon="Plus" @click="edit" v-auth="'/systemUser/createUser'">新增</el-button>
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
        <el-table-column label="操作" fixed width="140">
          <template #default="{ row }">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button link :icon="Edit" @click="edit(row)" />
            </el-tooltip>
            <el-divider direction="vertical" />
            <el-tooltip
              effect="dark"
              content="停用"
              placement="top"
              v-if="StateType[row.userStatus] === StateType.NORMAL"
            >
              <!--需要加一层span 否则会报警告 Runtime directive used on component with non-element root node. The directives will not function as intended -->
              <span>
                <el-popconfirm title="确定停用吗" @confirm="disableAccount(row.userAccount, 'SUSPEND')">
                  <template #reference>
                    <el-button link :icon="VideoPause" />
                  </template>
                </el-popconfirm>
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="启用" placement="top" v-else>
              <!--需要加一层span 否则会报警告 Runtime directive used on component with non-element root node. The directives will not function as intended -->
              <span>
                <el-popconfirm title="确定启用吗" @confirm="disableAccount(row.userAccount, 'NORMAL')">
                  <template #reference>
                    <el-button link :icon="VideoPlay" />
                  </template>
                </el-popconfirm>
              </span>
            </el-tooltip>
            <el-divider direction="vertical" />
            <el-tooltip effect="dark" content="绑定钉钉" placement="top">
              <!--需要加一层span 否则会报警告 Runtime directive used on component with non-element root node. The directives will not function as intended -->
              <span>
                <el-button link :icon="Connection" @click="bindDingTalkUser(row)" />
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="userName" />
        <el-table-column label="状态" align="center" prop="userStatus" width="180">
          <template v-slot="scope">
            <span>{{ StateType[scope.row.userStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" align="center" prop="userAccount" />
        <el-table-column label="手机号" align="center" prop="mobile" />
        <el-table-column label="钉钉账号" align="center">
          <template #default="{ row }">
            {{ (row.dingUserName || '') + '-' + (row.departmentName || '') }}
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center" prop="roleName" />
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

    <el-dialog v-model="editDialogVisible" :title="editTitle">
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="userName">
          <el-input
            type="primary"
            text
            maxlength="4"
            show-word-limit
            v-model="form.userName"
            placeholder="请输入名称"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth" prop="userAccount">
          <el-input
            type="primary"
            text
            :maxlength="15"
            v-model="form.userAccount"
            placeholder="请输入账号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input
            type="primary"
            text
            :maxlength="11"
            show-word-limit
            v-model="form.mobile"
            auto-complete="new-password"
            placeholder="请输入手机号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="关联角色" :label-width="formLabelWidth" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择关联角色">
            <el-option v-for="item in allRole" :key="item.code" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editSure">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 绑定钉钉弹窗 -->
    <el-dialog title="绑定钉钉" v-model="bindDialogVisible" width="500">
      <el-form :model="bindForm" ref="bindFormRef" :rules="bindDingTalkUserRules">
        <el-form-item label="钉钉账号" :label-width="formLabelWidth" prop="dingUserCode">
          <el-select placeholder="请选择钉钉账号" filterable v-model="bindForm.dingUserCode">
            <el-option
              v-for="item in dingTalkUserList"
              :key="item.userCode"
              :label="item.userName + '-' + item.departmentName"
              :value="item.userCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="bindDingTalkUserSure" :loading="bindLoading">提交</el-button>
      </template>
    </el-dialog>
  </main>
</template>
