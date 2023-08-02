<script setup lang="ts">
import { reactive, onMounted, ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh, Search, Plus, Edit, Delete, Connection } from '@element-plus/icons-vue';
import * as serve from '@/api/setting/roles';
import { queryAll } from '@/api/setting/permission';
import type { FormInstance } from 'element-plus';
import { listToTree } from '@/utils/tree';
import { useBaseTableBar } from '@/components/BaseTableBar/hook';
import { usePagination } from '@/hooks/usePagination';
import { useQueryParam } from '@/hooks/useQueryParam';
import { useDynamicTableHeight } from '@/hooks/useDynamicTableHeight';
import { StateType } from './enum';
defineOptions({
  name: 'Roles'
});
useDynamicTableHeight();
const { tableAlign, tableSize, tableStripe } = useBaseTableBar();

const initialQueryParam = {
  roleName: '',
  platType: 0
};

const { queryParam, handleResetQueryParam } = useQueryParam(initialQueryParam);
const state = reactive({
  tableData: []
});

const queryLoading = ref(false);
const getList = async () => {
  queryLoading.value = true;
  const res = await serve.getRoleList(queryParam);
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

const handleDelete = async (id: string) => {
  const res = await serve.deleteRole({
    id
  });
  if (res.code === 200) {
    ElMessage.success('删除成功');
    getList();
  } else {
    ElMessage.error(res.message);
  }
};

const rules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }]
};
const formLabelWidth = '120px';
const editDialogVisible = ref(false);
const form = reactive({
  roleName: ''
});
const ruleFormRef = ref<FormInstance>();
const editTitle = ref('');
const edit = row => {
  if (row?.roleName) {
    editTitle.value = '编辑角色';
    nextTick(() => {
      Object.assign(form, row);
    });
  } else {
    ruleFormRef.value && ruleFormRef.value.resetFields();
    editTitle.value = '新增角色';
  }
  editDialogVisible.value = true;
};
const editSure = async () => {
  await ruleFormRef.value.validate(async valid => {
    if (valid) {
      let res;
      if (editTitle.value === '编辑角色') {
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

const editPermissionVisible = ref(false);
const props = {
  value: 'id',
  label: 'menuName',
  children: 'children'
};
let bindPermissionKeys = reactive([]);
let allPermissionTree = reactive([]);
const permissionTreeRef = ref();
const editId = ref();
const editPermission = async (roleId: string) => {
  const res = await queryAll({ platType: 0 });
  if (res.code !== 200) {
    ElMessage.error(res.message);
    return;
  }
  allPermissionTree = res.data;
  const bindRes = await serve.getBindPermission({ roleId, platType: 0 });
  if (bindRes.code !== 200) {
    ElMessage.error(bindRes.message);
    return;
  }
  bindPermissionKeys = bindRes.data.map(x => x['id']);
  allPermissionTree = listToTree(allPermissionTree, 'pid');
  editId.value = roleId;
  editPermissionVisible.value = true;
};
const editPermissionSure = async () => {
  const grantMenuIdList = permissionTreeRef.value.getCheckedKeys().join(',');
  const res = await serve.grantMenu({
    grantMenuIdList,
    id: editId.value,
    platType: 0
  });
  if (res.code === 200) {
    ElMessage.success('编辑成功');
    editPermissionVisible.value = false;
    getList();
  } else {
    ElMessage.error(res.message);
  }
};

onMounted(() => {
  getList();
});
</script>

<template>
  <main>
    <el-form @submit.prevent @keydown.enter="handleSearch">
      <el-row :gutter="20">
        <el-col :xl="55" :lg="8">
          <el-form-item label="名称">
            <el-input placeholder="请输入名称" clearable v-model="queryParam.roleName" />
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
          <el-button link type="primary" :icon="Plus" @click="edit">新增</el-button>
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
            <el-tooltip effect="dark" content="删除" placement="top">
              <!--需要加一层span 否则会报警告 Runtime directive used on component with non-element root node. The directives will not function as intended -->
              <span>
                <el-popconfirm title="确定删除吗" @confirm="handleDelete(row.id)">
                  <template #reference>
                    <el-button link :icon="Delete" />
                  </template>
                </el-popconfirm>
              </span>
            </el-tooltip>
            <el-divider direction="vertical" />
            <el-tooltip effect="dark" content="权限绑定" placement="top">
              <el-button link :icon="Connection" @click="editPermission(row.id)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="roleName" />
        <el-table-column label="状态" prop="roleStatus" width="180">
          <template v-slot="scope">
            <span>{{ StateType[scope.row.roleStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
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
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input
            type="primary"
            text
            maxlength="20"
            show-word-limit
            v-model="form.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editSure">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editPermissionVisible" title="编辑权限">
      <el-tree-v2
        v-if="editPermissionVisible"
        :data="allPermissionTree"
        :props="props"
        show-checkbox
        :height="500"
        :default-checked-keys="bindPermissionKeys"
        ref="permissionTreeRef"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editPermissionVisible = false">取消</el-button>
          <el-button type="primary" @click="editPermissionSure">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </main>
</template>

<style scoped></style>
