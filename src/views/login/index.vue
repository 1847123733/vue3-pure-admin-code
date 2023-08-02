<script setup lang="ts">
import { useLayout } from '@/layout/hooks/useLayout';
import { bg, bgDark, illustration, logo, logoDark } from './utils/static';
import { onMounted } from 'vue';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { PlHomePage } from 'plain-home-page-v3';
import { setToken } from '@/utils/auth';
import { ElMessage } from 'element-plus';
import { initRouter } from '@/router/utils';
import { useRouter } from 'vue-router';
import './utils/ddlogin.js';
// import './utils/newEdition.js';
import * as serve from '@/api/user';

defineOptions({
  name: 'Login'
});
const router = useRouter();
const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();

async function codeLogin() {
  // // 获取appid，redirect_uri
  const res = await serve.queryIdentificationInfo();
  if (res.code == 200) {
    // 构造 钉钉二维码
    (window as any).DTFrameLogin(
      {
        id: 'self_defined_element',
        width: 300,
        height: 300
      },
      {
        redirect_uri: encodeURIComponent(res.data.loginCallbackUrl),
        client_id: res.data.appKey,
        scope: 'openid',
        response_type: 'code',
        prompt: 'consent' // 值为consent时，会进入授权确认页。
      },
      loginResult => {
        callback(loginResult);
      },
      errorMsg => {
        // 这里一般需要展示登录失败的具体原因
        alert(`Login Error: ${errorMsg}`);
      }
    );
  } else {
    ElMessage({ message: res.message, type: 'error' });
  }
}

async function callback(loginResult) {
  // 扫码成功 授权码
  const { authCode } = loginResult;
  // 获取token，一些信息
  const authApiRes = await serve.getToken({ authCode: authCode });
  if (authApiRes.code == 200) {
    // 这里等存完token 在执行后面的
    await setToken(authApiRes.data.accessToken, authApiRes.data.username, authApiRes.data.userid);
    // 获取后端路由
    initRouter().then(() => {
      router.push('/');
      ElMessage({ message: '登录成功', type: 'success' });
    });
  } else if (authApiRes.code != 9999) {
    ElMessage({ message: authApiRes.message, type: 'error' });
  }
}

onMounted(() => {
  codeLogin();
});
</script>

<template>
  <div class="select-none">
    <PlHomePage
      :themeSwitch="dataTheme"
      :shadow="false"
      backgroundTheme="linear-gradient(231deg, #041b19, #0b0f13)"
      :headerLogo="logo"
      :headerLogoTheme="logoDark"
    >
      <img :src="dataTheme ? bgDark : bg" class="wave" />
      <div class="login-container">
        <div class="img">
          <img :src="illustration" alt="橙子便利" />
        </div>
        <div class="login-box">
          <div class="login-box-box">
            <span class="login-box-title">欢迎登录</span>
            <div id="self_defined_element" class="self-defined-class-name" />
            <span class="login-box-remark">请使用钉钉扫描二维码登录</span>
          </div>
        </div>
      </div>
    </PlHomePage>
  </div>
</template>

<style scoped>
@import url('@/style/login.css');
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

#self_defined_element {
  width: 300px;
  height: 300px;
}
</style>
