<template>
  <div class="login-container">
    <el-card class="box-card" shadow="always">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ $t("login.title") }}</h3>
          <lang-select class="set-language" />
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon :iconSize="1.3" icon-class="user" color="#fff" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-tooltip
          :disabled="capslockTooltipDisabled"
          content="Caps lock is On"
          placement="right"
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon :iconSize="1.3" icon-class="password" color="#fff" />
            </span>
            <el-input
              ref="passwordRef"
              :key="passwordType"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup="checkCapslock"
              @blur="capslockTooltipDisabled = true"
              @keyup.enter="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                color="#fff"
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>

        <!-- 验证码 -->
        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon :iconSize="1.3" icon-class="validCode" color="#fff" />
          </span>
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            :placeholder="$t('login.code')"
            style="width: 80%"
            @keyup.enter="handleLogin"
          />

          <div class="captcha">
            <img
              :src="captchaBase64"
              @click="handleCaptchaGenerate"
              height="38px"
            />
          </div>
        </el-form-item>

        <el-button
          color="#0B6320"
          size="default"
          :loading="loading"
          type="primary"
          style="width: 100%; height: 45px; margin-bottom: 30px"
          @click.prevent="handleLogin"
          >{{ $t("login.login") }}
        </el-button>
      </el-form>
    </el-card>

    <div v-if="showCopyright == true" class="copyright">
      <p>{{ $t("login.copyright") }}</p>
      <p>{{ $t("login.icp") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch, nextTick } from "vue";

// 组件依赖
import { ElForm, ElInput } from "element-plus";
import { useI18n } from "vue-i18n";
import canvg from "canvg";
import router from "@/router";
import LangSelect from "@/components/LangSelect/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

// 状态管理依赖
import useStore from "@/store";

// API依赖
import { getCaptcha } from "@/api/login";
import { useRoute } from "vue-router";
import { LoginFormData } from "@/types";

import { encryption } from "@/utils/ency";

const { user } = useStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const passwordRef = ref(ElInput);

const { t } = useI18n({ useScope: "global" });
const state = reactive({
  redirect: "",
  captchaText: "",
  loginForm: {
    username: "admin",
    password: "123456",
    code: "",
    uuid: "",
  } as LoginFormData,
  loginRules: {
    username: [{ required: true, trigger: "blur" }],
    password: [
      { required: true, trigger: "blur", validator: validatePassword },
    ],
    code: [{ required: true, trigger: "blur", validator: validateCaptcha }],
  },
  loading: false,
  passwordType: "password",
  captchaBase64: "",
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
});

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error(t("login.pwdVali")));
  } else {
    callback();
  }
}

function validateCaptcha(rule: any, value: any, callback: any) {
  if (value != state.captchaText) {
    callback(new Error(t("login.captchaVali")));
  } else {
    callback();
  }
}

const {
  loginForm,
  loginRules,
  loading,
  passwordType,
  captchaBase64,
  capslockTooltipDisabled,
  showCopyright,
} = toRefs(state);

function checkCapslock(e: any) {
  const { key } = e;
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= "A" && key <= "Z";
}

function showPwd() {
  if (state.passwordType === "password") {
    state.passwordType = "";
  } else {
    state.passwordType = "password";
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      user
        .login(state.loginForm)
        .then(() => {
          router.push({ path: state.redirect || "/", query: state.otherQuery });
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
          handleCaptchaGenerate();
        });
    } else {
      return false;
    }
  });
}

// 获取验证码
function handleCaptchaGenerate() {
  getCaptcha().then(({ data }) => {
    const { img, uuid, text } = data;
    let canvas = document.createElement("canvas"); //页面创建空canvas
    canvg(canvas, img); //进行转换
    state.captchaBase64 = canvas.toDataURL("image/gif");
    state.loginForm.uuid = uuid;
    state.captchaText = text;
  });
}

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true,
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== "redirect") {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

onMounted(() => {
  handleCaptchaGenerate();
  window.onresize = () => {
    if (state.clientHeight > document.documentElement.clientHeight) {
      state.showCopyright = false;
    } else {
      state.showCopyright = true;
    }
  };
});
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$dark_gray: #333;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $dark_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: $dark_gray;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input {
    display: inline-block;
    height: 36px;
    width: 80%;

    .el-input__wrapper {
      padding: 0;
      background: transparent;
      box-shadow: none;

      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: #fff;
        height: 36px;
        caret-color: $cursor;
        font-size: 16px;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: var(--el-input-hover-border, var(--el-border-color-hover));
      box-shadow: none;
    }

    box-shadow: none;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    color: #454545;

    .el-form-item__error {
      color: #4caf50;
    }
  }

  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #787878;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background-image: url(../../assets/background.png);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .box-card {
    width: 580px;
    height: 422px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -211px;
    margin-left: -290px;
    background: inherit;
    border-radius: 18px;

    .el-button {
      background: #17722c;
      border: 1px solid #17722c;
      transition: all 0.4s;
      position: relative;
      overflow: hidden;
    }
    .el-button:hover {
      background: #0b6320;
      border: 1px solid #0b6320;
    }

    .login-form button::before,
    .el-button::after {
      content: "";
      display: block;
      width: 5px;
      height: 50px;
      background: rgba(179, 255, 210, 0.5);
      opacity: 0.5;
      position: absolute;
      top: 0;
      left: 0;
      transform: skewX(-50deg);
      filter: blur(30px);
      overflow: hidden;
      transform: translateX(-180px);
    }

    .el-button::after {
      width: 5px;
      background: rgba(179, 255, 210, 0.3);
      left: 60px;
      opacity: 0;
      filter: blur(5px);
    }

    .el-button:hover::before {
      transition: 1s;
      transform: translateX(400px);
      opacity: 0.7;
    }

    .el-button:hover::after {
      transition: 1s;
      transform: translateX(400px);
      opacity: 1;
    }
  }

  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: 400;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
</style>
