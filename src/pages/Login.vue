<template>
  <div id="LoginBox">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="showLoadingHint">登录中,请稍候···</van-loading>
    <van-overlay :show="overlayShow" z-index="100" />
    <div class="bg-icon-wrapper" ref="bgIconWrapper">
      <div class="bg-icon">
        <img :src="logoPng" alt="">
      </div>
    </div>
    <div class="input-box"  ref="inputBox">
      <van-cell-group>
        <van-field label="用户名"  left-icon="contact" placeholder="请输入用户名" type="text" v-model="username"></van-field>
        <van-field label="密码" left-icon="bag-o" placeholder="请输入密码" type="password" v-model="password"></van-field>
      </van-cell-group>
    </div>
    <div class="btn-box" @click="loginHandle">
      <img :src="loginBtnPng" alt="">
    </div>
  </div>
</template>

<script>
import {logIn, getdepartmentList, getdepartmentListNo,registerChannel} from '@/api/login.js'
import { mapGetters, mapMutations } from 'vuex'
import Loading from '@/components/Loading'
import { setStore, getStore, removeStore,IsPC  } from '@/common/js/utils'
export default {
  name: 'login',
  components: {
    Loading
  },
  data () {
    return {
      username: '',
      password: '',
      showLoadingHint: false,
      overlayShow: false,
      sweepMsg: null,
      proId: '',
      logoPng: '',
      logoTopPng: require('@/components/images/logo-top.png'),
      logoTopPcPng: require('@/components/images/logo-top-pc.png'),
      loginBtnPng: require('@/components/images/login-btn.png'),
      temporaryUsername: ''
    }
  },

  watch: {
  },

  computed: {
    loginName () {
      return getStore('userName') ? getStore('userName') : ''
    },
    loginPassword () {
      return getStore('userPassword') ? getStore('userPassword') : ''
    },
    ...mapGetters([
    ])
  },

  mounted () {
    this.username = getStore('userName') ? getStore('userName') : '';
    this.password = getStore('userPassword') ? getStore('userPassword') : '';
    // 控制设备物理返回按键
    if (!IsPC()) {
      this.logoPng = this.logoTopPng;
      let that = this;
      pushHistory()
      that.gotoURL(() => {
        pushHistory();
        this.$router.push({path: '/'});  //输入要返回的上一级路由地址
      });
      this.changeRouterFlag(false);
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
      }
    } else {
      this.logoPng = this.logoTopPcPng
    }
  },

  methods: {
    ...mapMutations([
      'storeUserInfo',
      'changeTitleTxt',
      'changeRouterFlag',
      'changeLoginMethod',
      'changeUserType',
      'changeOverDueWay',
      'changeIsTemplateOne',
      'changeTemplateType',
      'changeIsNewCircle'
    ]),


    // 获取科室字典id
    queryDepartmentList () {
      return new Promise((resolve,reject) => {
        this.overlayShow = true;
        this.showLoadingHint = true;
        getdepartmentList(this.proId).then((res) => {
          if (res && res.data.code == 200) {
              resolve(res.data.data);
              setStore('departmentInfo', res.data.data);
            } else {
              this.$dialog.alert({
                message: `${res.data.msg}`,
                closeOnPopstate: true
              }).then(() => {})
            };
            this.overlayShow = false;
            this.showLoadingHint = false
          })
          .catch((err) => {
            this.overlayShow = false;
            this.showLoadingHint = false;
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {})
          })
      })
    },

    // 获取科室字典编号
    queryDepartmentListNo () {
      return new Promise((resolve,reject) => {
        this.overlayShow = true;
        this.showLoadingHint = true;
        getdepartmentListNo(this.proId).then((res) => {
          if (res && res.data.code == 200) {
              resolve(res.data.data);
              setStore('departmentInfoNo', res.data.data);
            } else {
              this.$dialog.alert({
                message: `${res.data.msg}`,
                closeOnPopstate: true
              }).then(() => {})
            };
            this.overlayShow = false;
            this.showLoadingHint = false
          })
          .catch((err) => {
            this.overlayShow = false;
            this.showLoadingHint = false;
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {})
          })
      })
    },

    // 注册channel
    getChannel (data) {
      return new Promise((resolve,reject) => {
        this.overlayShow = true;
        this.showLoadingHint = true;
        registerChannel(data)
        .then((res) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          resolve()
        })
        .catch((err) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      })
    },

    // 账号密码登录方法
    login () {
      return new Promise((resolve,rejrect)=> {
        this.overlayShow = true;
        this.showLoadingHint = true;
        let loginMessage = {
          username: this.username,
          password: this.password,
          rememberMe: 1
        };
        this.temporaryUsername = getStore('userName') ? getStore('userName') : '无';
        logIn(loginMessage).then((res) => {
          if (res) {
            if (res.data.code == 200) {
              // 重置过期方式
              this.changeOverDueWay(false);
              setStore('storeOverDueWay',false);
              setStore('userName', this.username);
              setStore('userPassword', this.password);
              resolve(res.data.data)
            } else {
              this.$dialog.alert({
                message: `${res.data.msg}`,
                closeOnPopstate: true
              }).then(() => {
              });
            }
          };
          this.overlayShow = false;
          this.showLoadingHint = false
        })
        .catch((err) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          })
        })
      })
    },

    // 向客户端发送信标服务器地址
    postUrl (workerId) {
      return new Promise((resolve,reject) => {
        let xinbiaoTimer = setTimeout(window.android.setPostUrl(`http://blink.blinktech.cn/trans/workerPositionLog/save/${workerId}`),100);
        if (window.android.setPostUrl(`http://blink.blinktech.cn/trans/workerPositionLog/save/${workerId}`) == 'success') {
          resolve(window.android.setPostUrl(`http://blink.blinktech.cn/trans/workerPositionLog/save/${workerId}`));
          clearTimeout(xinbiaoTimer)
        }
      })
    },

    // 登录事件
    async loginHandle () {
      // 获取用户登录信息 completeDepartmentMessage
      const userInfo = await this.login();
      // 登录用户名密码及用户信息存入Locastorage
      setStore('userInfo', userInfo);
      setStore('isLogin', true);
      // 用户身份类别存入store和Locastorage
      this.changeUserType(userInfo["extendData"]['user_type_id']);
      setStore('userType', userInfo["extendData"]['user_type_id']);
      this.storeUserInfo(JSON.parse(getStore('userInfo')));
      this.proId = userInfo['proId'];
      // 保存模板类型
      if (userInfo.mobile) {
        this.changeTemplateType(userInfo.mobile);
        setStore('templateType', userInfo.mobile)
      };
      // 保存是否为新循环任务
      if (userInfo.circle == 1) {
        this.changeIsNewCircle(true);
        setStore('isNewCircle',{isNewCircle: true})
      } else {
        this.changeIsNewCircle(false);
        setStore('isNewCircle',{isNewCircle: false})
      };
      if (!IsPC()) {
        // 注册channel
        if (userInfo["extendData"]['user_type_id'] != 1) {
          if (window.android.getChannelId()) {
            try {
              await this.getChannel({
                proId: userInfo.proId,
                workerId: userInfo.id,
                type: userInfo["extendData"]['user_type_id'],
                channelId: window.android.getChannelId()
              });
            } catch (err) {
              this.$dialog.alert({
                message: `${err.message}`,
                closeOnPopstate: true
              }).then(() => {
              })
            }
          } else {
            this.$toast('未获取到channelId')
          }
        };
        // 向客户端发送信标服务器地址
        try {
          let xinbiaoInfo = await this.postUrl(userInfo.id);
        } catch (err) {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        }
      };
      // 获取科室字典id
      await this.queryDepartmentList();
      // 获取科室字典编号
      await this.queryDepartmentListNo();
      // 如果当前登录用户和上次登录用户不一致，则清除循环任务完成标本采集的科室信息
      if (this.temporaryUsername != this.username) {
        removeStore('completeDepartmentMessage')
      };
      this.$router.push({path:'/home'});
      this.changeTitleTxt({tit:'中央运送'});
      window.location.reload()
    }
  }
}
</script>
<style lang="less" scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/mixin.less";
@import "../common/stylus/modifyUi.less";
@import "../common/stylus/media.less";
  #LoginBox {
    .content-wrapper();
    /deep/ .van-loading {
      z-index: 1000
    };
  .bg-icon-wrapper {
      flex:1;
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
