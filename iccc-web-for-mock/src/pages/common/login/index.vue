<template>
  <div class="v-login-box" style="">
    <!--logo-->
    <div class="v-login-box__logo" style="">
      <img src="../../../assets/images/login/login-logo.png" alt />
    </div>
    <!--背景图-->
    <div class="v-login-box__bg" style="">
      <img src="../../../assets/images/login/login-bg.png" style="height: 80vh" alt />
    </div>
    <!--账号登入模块-->
    <div class="v-login-box__content">
      <h2>欢迎登录</h2>
      <h1>风谷DESIGN <em>Beta 1.0</em></h1>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <div class="v-login-box__content-name">
          <span>用户姓名</span>
          <el-input class="border-input" placeholder="请输入内容" v-model="loginForm.username" clearable> </el-input>
        </div>
        <div class="v-login-box__content-password">
          <span>密码</span>
          <el-input class="border-input" placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
        </div>
        <div class="v-login-box__content-tips">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
          <a href="#">忘记密码 ?</a>
        </div>
        <dg-button class="v-login-box__content-btn" type="primary" @click.native.prevent="handleLogin">
          登录
        </dg-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!this.isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'));
      } else {
        callback();
      }
    };
    return {
      checked: false,
      loginForm: {
        username: 'ADMIN',
        password: 'duceap'
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    isvalidUsername(str) {
      const valid_map = ['admin', 'editor'];
      return valid_map.indexOf(str.trim()) >= 0;
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    handleLogin() {
      if (process.env.NEED_LOGIN) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch('LoginByUsername', this.loginForm)
              .then(() => {
                this.loading = false;
                this.$router.push({ path: this.redirect || '/' });
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      } else {
        this.$router.push({ path: this.redirect || '/' });
      }
    }
  }
};
</script>

<style scoped></style>
