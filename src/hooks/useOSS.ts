import OSS from 'ali-oss';
import { ref } from 'vue';
import { getOSSInfo } from '@/api/common';
import { ElMessage } from 'element-plus';
// import { randomString } from '@/utils/util';
export const useOSS = () => {
  const client: any = ref(null);
  const basePath: any = ref(null);
  const init = async () => {
    const res = await getOSSInfo();
    if (res.code !== 200) {
      ElMessage.error(res.message);
      return;
    }
    const stsInfo = res.data;
    basePath.value = res.data.basePath;
    client.value = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: stsInfo.region, // 填写Bucket名称。
      bucket: stsInfo.bucket,
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: stsInfo.assumeRoleResponse.credentials.accessKeyId,
      accessKeySecret: stsInfo.assumeRoleResponse.credentials.accessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: stsInfo.assumeRoleResponse.credentials.securityToken,
      refreshSTSToken: async () => {
        // 向您搭建的STS服务获取临时访问凭证。
        const res = await getOSSInfo();
        if (res.code === 200) {
          return {
            accessKeyId: res.data.assumeRoleResponse.credentials.accessKeyId,
            accessKeySecret: res.data.assumeRoleResponse.credentials.accessKeySecret,
            stsToken: res.data.assumeRoleResponse.credentials.securityToken
          };
        }
      },
      // 刷新临时访问凭证的时间间隔，单位为毫秒。
      refreshSTSTokenInterval: 8000000
    });
  };

  const put = async (fileUrl: string, file: any) => {
    try {
      // object表示上传到OSS的文件名称。
      // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
      const filePath = basePath.value + '/'; // oss 目录
      //  + '.jpg'
      const fileName = filePath + fileUrl;
      const res = await client.value.put(fileName, file, { headers: { 'x-oss-object-acl': 'public-read' } });
      return res;
    } catch (e) {
      console.error('error: %j', e);
    }
  };

  const progress = ref(0);
  const multipartUpload = async (fileUrl: string, file: any) => {
    try {
      // object表示上传到OSS的文件名称。
      // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
      const res = await client.value.multipartUpload(fileUrl, file, {
        progress: p => {
          progress.value = parseInt(p * 100);
        }
      });
      return res;
    } catch (e) {
      console.error('error: %j', e);
    }
  };
  return {
    client,
    init,
    put,
    multipartUpload,
    progress
  };
};
