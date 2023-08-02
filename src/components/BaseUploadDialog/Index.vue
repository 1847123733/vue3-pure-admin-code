<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage, UploadInstance, UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { uploadExcel } from '@/api/common';
interface Props {
  uploadUrl: string;
  templateDownloadUrl: string;
  keyWord: string;
  limitAmount: number;
  isShow: boolean;
  paramDownloadUrl?: object;
}
const props = withDefaults(defineProps<Props>(), {
  limitAmount: 1,
  isShow: false
});
const emit = defineEmits<{
  (e: 'onCloseDialog'): void;
  (e: 'refreshData', data: Array<any>): void;
}>();
const dialogVisible = ref(false);
const uploadRef = ref<UploadInstance>();
let fileList = ref<UploadUserFile[]>();
// 判断
const isExcel = (file: UploadUserFile): boolean => {
  const extension = file.name.split('.')[1] === 'xls';
  const extension2 = file.name.split('.')[1] === 'xlsx';
  const extension3 = file.name.split('.')[1] === 'csv';
  const isLt2M = file.size / 1024 / 1024 < 2;
  return (extension || extension2 || extension3) && isLt2M;
};
// 上传
const uploadLoading = ref(false);
const uploadSure = async () => {
  if (!fileList.value || !fileList.value.length) {
    ElMessage.error('请选择文件');
    return;
  }
  const canUpload = fileList.value.every(item => {
    return isExcel(item);
  });
  if (!canUpload) {
    ElMessage.error('上传模板只能是 xls、xlsx、csv格式且大小不能超过2MB!');
    return;
  }
  uploadLoading.value = true;
  try {
    uploadExcel(fileList.value, props.uploadUrl, props.keyWord)
      .then((res: any) => {
        uploadLoading.value = false;
        if (res.code === 200) {
          if (!res.data) {
            ElMessage.success(res.message);
          }
          emit('refreshData', res.data?.productList || '');
          dialogClose();
        } else {
          ElMessage.error(res.message);
        }
      })
      .finally(() => (uploadLoading.value = false));
  } catch (error) {
    uploadLoading.value = false;
  }
};
const dialogClose = () => {
  fileList = ref<UploadUserFile[]>();
  emit('onCloseDialog');
};
const onExceed = () => {
  ElMessage.error('最多上传一个文件');
};
watch(
  () => props.isShow,
  newVal => {
    dialogVisible.value = newVal;
  },
  { deep: true }
);
</script>
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="导入" @close="dialogClose" width="500px">
      <div class="modal-down-up">
        <base-download-button link :url="templateDownloadUrl" :param="paramDownloadUrl">
          下载导入模板
        </base-download-button>
        <el-upload
          class="upload-demo"
          drag
          v-model:file-list="fileList"
          action="https://jsonplaceholder.typicode.com/posts/"
          :auto-upload="false"
          ref="uploadRef"
          :limit="limitAmount"
          :on-exceed="onExceed"
          accept=".xlsx,.xls,.csv"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖入或者
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">支持上传xls / xlsx / csv 格式文件，且文件大小不能超过2MB!</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="uploadSure" :loading="uploadLoading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.upload-demo {
  margin-top: 20px;
}

.el-icon svg {
  height: 2em;
  width: 2em;
}
</style>
