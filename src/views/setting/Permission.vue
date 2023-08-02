<script setup lang="ts">
import { reactive, onMounted, ref, nextTick } from 'vue';
import * as serve from '@/api/setting/permission';
import { ElMessage } from 'element-plus';
import { listToTree } from '@/utils/tree';
import { Edit, Delete, VideoPlay, VideoPause, CopyDocument } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { cloneDeep } from '@pureadmin/utils';
import useClipboard from 'vue-clipboard3';

defineOptions({
  name: 'Permission'
});

enum MenuType {
  MENU = '菜单',
  INNER_MENU = '页面(导航显示)',
  HIDE_MENU = '页面(导航不显示)',
  BUTTON = '细粒度权限'
}

const menuTypeSelect = Object.entries(MenuType).map(([key, value]) => ({
  label: value,
  value: key
}));
const queryParam = reactive({
  platType: 0
});
let tableData = reactive([]);
const loading = ref(false);
let parentNav = reactive([]);
const getList = async () => {
  loading.value = true;
  const res = await serve.queryAll(queryParam);
  loading.value = false;
  if (res.code === 200) {
    parentNav = res.data.filter((item: any) => item.menuType !== 'BUTTON');
    tableData = listToTree(res.data, 'pid');
  } else {
    ElMessage.error(res.message);
  }
};

const validRouter = (rule, value, callback) => {
  if (value && !value.startsWith('/')) {
    callback(new Error('资源路径必须以/开头'));
    return;
  }
  callback();
};

const rules = {
  menuName: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入资源说明', trigger: 'blur' }],
  router: [
    { required: true, message: '请输入资源路径', trigger: 'blur' },
    { validator: validRouter, trigger: 'blur' }
  ],
  menuSort: [{ required: true, message: '请输入排序序号', trigger: 'blur' }],
  pid: [{ required: true, message: '请选择父级资源', trigger: 'blur' }]
};
const formLabelWidth = '120px';
const editDialogVisible = ref(false);
const form = reactive({
  menuName: '',
  menuType: '',
  pid: '',
  remark: '',
  icon: '',
  router: '',
  menuSort: '',
  visibility: true,
  platType: 0
});
const ruleFormRef = ref<FormInstance>();
const editTitle = ref('');
const edit = row => {
  if (row?.menuName) {
    editTitle.value = '编辑资源';
    nextTick(() => {
      Object.assign(form, row);
      form['children'] = [];
    });
  } else {
    nextTick(() => {
      ruleFormRef.value && ruleFormRef.value.resetFields();
    });
    editTitle.value = '新增资源';
  }
  editDialogVisible.value = true;
};
const editSure = async () => {
  await ruleFormRef.value.validate(async valid => {
    if (valid) {
      if (form.icon && !form.icon.includes(':')) {
        form.icon = 'ep:' + form.icon;
      }
      let res;
      if (editTitle.value === '编辑资源') {
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

const handleDelete = async id => {
  const res = await serve.deletePermission({ menuId: id, platType: 0 });
  if (res.code === 200) {
    ElMessage.success('删除成功');
    getList();
  } else {
    ElMessage.error(res.message);
  }
};

const disablePermission = async (row, visibility) => {
  row = cloneDeep(row);
  row.visibility = visibility;
  const res = await serve.edit(row);
  if (res.code === 200) {
    ElMessage.success('操作成功');
    getList();
  } else {
    ElMessage.error(res.message);
  }
};
const menuTypeChange = () => {};
const { toClipboard } = useClipboard();
const copyPermission = async row => {
  try {
    const copyObject = {
      menuName: row.menuName,
      menuType: row.menuType,
      pid: row.pid,
      icon: row.icon,
      router: row.router,
      remark: row.remark,
      menuSort: row.menuSort,
      platType: row.platType
    };
    await toClipboard(JSON.stringify(copyObject)); //实现复制
    ElMessage.success('复制成功');
  } catch (e) {
    console.error(e);
  }
};

const importByClipboard = async () => {
  try {
    const clipboardData = await navigator.clipboard.readText();
    const clipboardDataJson = JSON.parse(clipboardData);
    if (clipboardDataJson.menuName && clipboardDataJson.menuType) {
      Object.assign(form, clipboardDataJson);
      editDialogVisible.value = true;
    } else {
      ElMessage.error('粘贴板内容不符合规范');
    }
  } catch (e) {
    console.error(e);
    ElMessage.error('粘贴板内容不符合规范');
  }
};
onMounted(() => {
  getList();
});
</script>

<template>
  <main>
    <el-row><el-button type="primary" @click="edit">新增资源</el-button></el-row>
    <br />
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      :default-expand-all="false"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column align="center" label="操作" min-width="200">
        <template #default="{ row }">
          <el-divider direction="vertical" />
          <el-tooltip class="item" effect="dark" :enterable="false" content="修改" placement="top">
            <el-button :icon="Edit" link @click="edit(row)" />
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
          <el-tooltip effect="dark" content="停用" placement="top" v-if="row.visibility">
            <!--需要加一层span 否则会报警告 Runtime directive used on component with non-element root node. The directives will not function as intended -->
            <span>
              <el-popconfirm title="确定停用吗" @confirm="disablePermission(row, false)">
                <template #reference>
                  <el-button link :icon="VideoPause" />
                </template>
              </el-popconfirm>
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" content="停用" placement="top" v-else>
            <!--需要加一层span 否则会报警告 Runtime directive used on component with non-element root node. The directives will not function as intended -->
            <span>
              <el-popconfirm title="确定启用吗" @confirm="disablePermission(row, true)">
                <template #reference>
                  <el-button link :icon="VideoPlay" />
                </template>
              </el-popconfirm>
            </span>
          </el-tooltip>
          <el-divider direction="vertical" />
          <el-tooltip class="item" effect="dark" :enterable="false" content="复制" placement="top">
            <el-button :icon="CopyDocument" link @click="copyPermission(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="资源名称" prop="menuName" min-width="150" />
      <el-table-column label="ICON" prop="icon" min-width="150" />
      <el-table-column label="类型" min-width="150">
        <template #default="{ row }">
          {{ MenuType[row.menuType] }}
        </template>
      </el-table-column>
      <el-table-column label="资源路由" prop="router" min-width="350" />
      <el-table-column label="排序" prop="menuSort" min-width="60" />
      <el-table-column label="创建时间" prop="createTime" min-width="170" />
    </el-table>
    <el-dialog v-model="editDialogVisible" :title="editTitle">
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-form-item label="资源名称" :label-width="formLabelWidth" prop="menuName">
          <el-input v-model="form.menuName" autocomplete="off" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源类型" :label-width="formLabelWidth" prop="menuType">
          <el-select v-model="form.menuType" placeholder="请选择资源类型" @change="menuTypeChange">
            <el-option v-for="item in menuTypeSelect" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级资源" :label-width="formLabelWidth" prop="pid">
          <el-select v-model="form.pid" filterable clearable placeholder="请选择,若不选代表无父级资源" ref="menuType">
            <el-option v-if="MenuType[form.menuType] == MenuType.MENU" label="无父级资源" :value="0" />
            <el-option
              v-else
              :label="`${item.menuName}——(${item.remark})`"
              v-for="(item, index) in parentNav"
              :key="index"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="资源说明" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" placeholder="请输入资源说明" />
        </el-form-item>
        <el-form-item
          v-if="MenuType[form.menuType] == MenuType.MENU"
          label="资源图标"
          :label-width="formLabelWidth"
          prop="icon"
        >
          <el-input v-model="form.icon" autocomplete="off" placeholder="请输入资源图标" />
        </el-form-item>
        <el-form-item label="资源路径" :label-width="formLabelWidth" prop="router">
          <el-input v-model="form.router" autocomplete="off" placeholder="请输入资源路径" />
        </el-form-item>
        <el-form-item label="排序序号" :label-width="formLabelWidth" prop="menuSort">
          <el-input v-model="form.menuSort" autocomplete="off" placeholder="请输入排序序号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importByClipboard">从剪切板导入</el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editSure">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </main>
</template>
