<!--
    头部区域
    @Author: tangDM
    @Date: 2019-03-12
-->
<template>
  <div class="l-main-header">
    <div class="l-main-header__left">
      <div class="l-main-header__box">
        <img class="l-main-header__logo" src="@icccPath/assets/images/layout/icon_sys.png" />
      </div>
      <p class="l-main-header__title">{{ userConfig?userConfig.dqcjmc:appName}}</p>
    </div>
    <div class="l-main-header__center">
      <div class="uo-header-box">
        <SysMenu />
      </div>
    </div>
    <div class="l-main-header__right">
      <div style="display: inline-block;vertical-align: top">
        <!-- 用户操作区域 -->
        <div class="l-avatar-box">
          <!--          <p>-->
          <i class="icon iconl-user"></i>
          <span class="l-avatar-box__user">您好，{{ name }} {{ currentTime }}</span>
          <span class="skinIcon"><i class="icon iconl-scense uo-exit" @click="openScenes" v-if="isScene"></i></span>
          <i class="icon iconl-poweroff uo-exit" title="退出登录" @click="logout"></i>
          <!--          </p>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import Breadcrumb from '@icccPath/components/layout/breadcrumb';
  import SysMenu from './sys-menu/index';
  import sceneApi from '@qb/qs-icccd/src/api/sceneApi';
  import { getSetting, getSettingBool } from '@icccPath/common';
  export default {
    data() {
      return {
        appName: getSetting('APP_NAME'),
        isScene: getSetting('IS_SCENE'),
        // appName: '',
        searchValue: '',
        activeShow: false,
        activeHide: false,
        currentTime: this.$tool.generateCurrentDate()
      };
    },
    components: {
      Breadcrumb,
      SysMenu
    },
    computed: {
      ...mapGetters(['sidebar', 'name', 'avatar', 'device', 'userConfig'])
    },
    methods: {
      ...mapActions(['GetUserConfig']),
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar');
      },
      logout() {
        this.$tool
          .confirm('是否确定退出系统？')
          .then(() => {
            window.loginUtil.logout(this);

            // if (getSettingBool("IS_OAUTH2")) {
            //     let logoutUrl =
            //         window.sessionStorage["authorizeUrl"] + `/logout?redirect_uri=${window.location.href}`;
            //     this.$store.dispatch("LogoutOauth", logoutUrl);
            // } else {
            //     this.$store.dispatch("Logout").then(() => {
            //         this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            //         location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
            //     });
            // }
          })
          .catch(() => {});
      },
      handleClickSearch() {
        this.activeShow = true;
        this.activeHide = false;
      },
      /**
       * 场景切换
       */
      openScenes() {
        let that = this;
        let sceneLayer = this.$dgLayer({
          // 标题
          title: '场景切换',
          maxmin: false,
          content: require('@qb/qs-icccd/src/components/base/scene-change/index'),
          area: ['1050px', '800px'],
          props: { callbackFn: this.callbackFn },
          btn: ['确定', '取消'],
          btnAlign: 'c',
          resize: false,
          skin: 'layer-transparent',
          yes: index => {
            let curTabActiveCard = sceneLayer.$children[0].curTabActiveCard;
            console.log('curTabActiveCard', curTabActiveCard);
            if (curTabActiveCard) {
              sceneApi.saveCurrentScene(curTabActiveCard.id).then(res => {
                sceneLayer.close(index);
                that.$message.success('保存成功');
                let userConfig = JSON.parse(sessionStorage.getItem('userConfig'));
                userConfig.dqcjid = curTabActiveCard.id;
                userConfig.dqcjmc = curTabActiveCard.name;
                sessionStorage.userConfig = JSON.stringify(userConfig);
                window.HOMEACCESS = userConfig;
                this.GetUserConfig();
              });
            } else {
              sceneLayer.close(index);
            }
          },
          btn2() {}
        });
      },
      /**
       * @description: 切换场景的回调函数
       * @param {Object} vo 切换当前场景的VO
       */
      callbackFn(vo) {
        console.log(vo);
      }
    },
    mounted() {
      this.bodyListener = () => {
        this.activeShow = false;
        this.activeHide = true;
      };
      document.body.addEventListener('click', this.bodyListener, false);
    },
    beforeDestroy() {
      // 销毁body事件
      document.body.removeEventListener('click', this.bodyListener);
    }
  };
</script>
<style lang="scss" scoped>
  .uo-header-box {
    /deep/ .head-el-menu {
      display: flex;
      height: 4rem;
      border-bottom: none;
    }
  }
  .l-main-header__box {
    width: auto;
    .l-main-header__logo {
      display: block;
      width: 40px;
      height: 40px;
    }
  }

  .uo-exit {
    // border: 1px solid red;
    cursor: pointer;
  }
  .l-main-header__title {
    padding-left: 65px;
    // padding-left: 30px;
  }
</style>
