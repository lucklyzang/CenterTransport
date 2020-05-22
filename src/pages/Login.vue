<template>
  <div id="LoginBox">
    <div class="bg-icon-wrapper" ref="bgIconWrapper">
      <div class="bg-icon">
        <img :src="logoTopPng" alt="">
      </div>
    </div>
    <div class="input-box"  ref="inputBox">
      <van-cell-group>
        <van-field label="用户名"  left-icon="contact" placeholder="请输入用户名" type="text" v-model="username"></van-field>
        <van-field label="密码" left-icon="bag-o" placeholder="请输入密码" type="password" v-model="password"></van-field>
      </van-cell-group>
    </div>
    <div class="btn-box" @click="login">
      <img :src="loginBtnPng" alt="">
    </div>
    <div class="loading-btn">
      <loading :isShow="showLoadingHint" textContent="登录中,请稍候····" textColor="#2895ea"></loading>
    </div>
  </div>
</template>

<script>
import {logIn, getDictionaryData, getdepartmentList} from '@/api/login.js'
import { mapGetters, mapMutations } from 'vuex'
import passwordPng from '@/components/images/password.png'
import userPng from '@/components/images/user.png'
import Loading from '@/components/Loading'
import { setStore, getStore, IsPC, scanCode } from '@/common/js/utils'
export default {
  components: {
    Loading
  },
  data () {
    return {
      username: this.loginName,
      password: this.loginPassword,
      showAccountLogin: true,
      showSweepLogin: false,
      showLoadingHint: false,
      sweepMsg: null,
      currentIndex: 0,
      barCodeScannerShow: false,
      logoTopPng: require('@/components/images/logo-top.png'),
      loginBtnPng: require('@/components/images/login-btn.png'),
    };
  },

  watch: {
    currentIndex (newValue, olValue) {
      newValue == 0 ? this.showAccountLogin = true : this.showAccountLogin = false;
      newValue == 1 ? this.showSweepLogin = true : this.showSweepLogin = false
    }
  },

  computed: {
    loginName () {
      return getStore('userName') ? getStore('userName') : ''
    },
    loginPassword () {
      return getStore('password') ? getStore('password') : ''
    },
    ...mapGetters([
      'loginSweepCode'
    ])
  },

  mounted () {
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory();
        this.$router.push({path: '/'});  //输入要返回的上一级路由地址
      });
      this.changeRouterFlag(false)
    };

    // 监控键盘弹起
    let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = ()=>{
      let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (resizeHeight < originalHeight) {
        return (()=>{
          this.$refs['bgIconWrapper'].style.cssText='flex:none;height:220px' 
        })()
      } else {
        this.$refs['bgIconWrapper'].style.cssText='flex:1;height:0' 
      }
    };

    // 判断是否执行扫码枪方法
    this.isExecute();
  },

  methods: {
    ...mapMutations([
      'storeUserInfo',
      'changeTitleTxt',
      'changeRouterFlag',
      'changeLoginMethod',
      'changeUserType',
      'changeOverDueWay'
    ]),

    // 登录方式切换点击事件
    checkClick (item, index) {
      this.currentIndex = index;
      if (index == 0) {
      }
    },

    // 是否执行扫码枪的绑定方法
    isExecute () {
      if (IsPC()) {
        scanCode(this.barcodeScanner)
      }
    },

    // 扫描二维码方法
    sweepPersonCode () {
      if (IsPC()) {
      } else {
        window.android.scanQRcode()
      }
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      var code = decodeURIComponent(JSON.stringify(code));
      this.processMethods(JSON.parse(code))
    },

    //扫码枪扫码回调方法
    barcodeScanner (code) {
      var code = JSON.parse(code);
      this.barCodeScannerShow = false
    },

    // 扫码流程公共方法
    processMethods (code) {
      if(code && Object.keys(code).length > 0) {
        if (code.hasOwnProperty('msg')) {
          if (code.msg) {
            this.sweepMsg = code.msg;
            this.login()
          } else {
            this.$dialog.alert({
            message: '个人信息不能为空,请重新扫描',
            closeOnPopstate: true
            }).then(() => {
              this.sweepPersonCode() 
            })
          };
          this.barCodeScannerShow = false
        } else {
          this.$dialog.alert({
          message: '请扫描正确的二维码',
          closeOnPopstate: true
          }).then(() => {
            this.sweepPersonCode() 
          })
        };
        this.barCodeScannerShow = false
      } else {
        this.$dialog.alert({
          message: '没有扫描到任何个人信息,请重新扫描',
          closeOnPopstate: true
        }).then(() => {
          this.sweepPersonCode() 
        })
      }
      this.barCodeScannerShow = false
    },

    // 账号密码登录方法
    login () {
      let loginMessage;
      this.showLoadingHint = true;
      if (this.showAccountLogin) {
        loginMessage = {
          username: this.username,
          password: this.password,
          rememberMe: 1
        };
      } else {
        loginMessage = {
          username: this.sweepMsg,
          flag: 1,
        }
      };
      logIn(loginMessage).then((res)=>{
        if (res) {
          if (res.data.code == 200) {
            // 重置过期方式
            this.changeOverDueWay(false);
            setStore('storeOverDueWay',false);
            if (this.showAccountLogin) {
              setStore('userName', this.username);
              setStore('userPassword', this.password);
            };
            // 登录用户名密码及用户信息存入Locastorage
            setStore('userInfo', res.data.data);
            setStore('isLogin', true);
            // 用户身份类别存入store和Locastorage
            this.changeUserType(res.data.data["extendData"]['user_type_id']);
            setStore('userType', res.data.data["extendData"]['user_type_id']);
            this.storeUserInfo(JSON.parse(getStore('userInfo')));
            this.$router.push({path:'/home'});
            this.changeTitleTxt({tit:'中央运送'});
            // 获取科室字典数据
            getdepartmentList(res.data.data['proId'])
            .then((res) => {
              if (res.data.code == 200) {
                setStore('departmentInfo', res.data.data);
                window.location.reload();
              }
            })
            .catch((err) => {
            });
          } else {
             this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        };
        this.showLoadingHint = false
      })
      .catch((err) => {
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    }
  } 
}
</script>
<style lang="less" scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/mixin.less";
@import "../common/stylus/modifyUi.less";
  #LoginBox {
    .content-wrapper();
    .input-box {
      width: 100%;
      height: 190px;
      padding-top: 50px;
      box-sizing: border-box;
    }
    .loading-btn {
      width: 100%;
      height: 50px;
    }
   .btn-box {
      width: 80%;
      height: 140px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 60px
      }
   }
  .bg-icon-wrapper {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .bg-icon {
        width: 100%;
        height: 100%;
        display: inline-block;
        img {
          width: 100%;
          height: 100%
        }
      }
    }
    .van-hairline--top-bottom::after {
      display: none
    }
    .van-cell-group {
      width: 80%;
      margin: 0 auto;
      font-size: 14px;
      .van-cell {
        border-bottom: 1px solid #e8e8e8;
        padding-left: 0;
        .van-cell__title {
          .van-field__label {
            color: #6a6a6a
          }
        }
      }
    }
    .bottom-title {
      width: 100%;
      position: absolute;
      bottom: 20px;
      text-align: center;
      font-size: 12px;
      color: #fff
    }
    .loading-hint {
      /deep/.van-loading {
        top: 90%;
        .van-loading__text {
          color: #2895ea
        }
      } 
    }
  }
</style>