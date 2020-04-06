<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="sweep-code-title">
      <h3></h3>
    </div>
    <div class="sweep-code-area">
      <div class="point-area">
        <div class="task-start-point" v-show="arriveDepartmentId == false">
          <p>任务起点:(扫码科室必须为下列其中一个)</p>
          <ul>
            <li v-for="(item,index) in startPointList" :key="index">{{item.text}}</li>
          </ul>
        </div>
        <div class="task-start-point" v-show="arriveDepartmentId == true">
          <p>请扫描标本送达的科室</p>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <van-button type="info" @click="sweepCodeSure">扫描二维码</van-button>
      <van-button type="default" @click="cancelSweepCode">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {judgeDepartment} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      startPointList: []
    };
  },

  components:{
    HeaderTop,
    NoData,
    FooterBottom
  },

  mounted () {
    console.log('id',this.stipulateOfficeList);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        this.changeIsrefreshCirculationConnectPage(true);
        this.$router.push({path:'/circulationTask'});
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    this.echoOfficeList();
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    }
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'circulationTaskMessage',
      'isCollectEnterSweepCodePage',
      'circulationTaskId',
      'stipulateOfficeList',
      'arriveDepartmentId'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    circulationId () {
      return this.circulationTaskMessage.currentMsg.id
    },
    officeNameList () {
      return this.stipulateOfficeList
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeStoreArriveDeparnmentId',
      'changeIsrefreshCirculationConnectPage'
    ]),

     // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        localStorage.clear();
        this.$router.push({path:'/'})
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

     // 重新扫码弹窗
    againSweepCode () {
      this.sweepAstoffice()
    },

    // 回显要扫码的科室列表
    echoOfficeList () {
      this.startPointList = this.officeNameList
    },

    // 返回上一页
    backTo () {
      this.changeIsrefreshCirculationConnectPage(true);
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code.split('|');
        if (codeData.length > 0) {
          let departmentId = codeData[0];
          if (!this.arriveDepartmentId) {
            this.juddgeMedicalCorrect({
              id: this.circulationId,// 循环任务ID 必输
              proId: this.proId, // 项目ID 必输
              departmentId: departmentId //扫描科室ID 必输
            })
          } else {
            // 存储送达的科室id
            this.changeStoreArriveDeparnmentId(departmentId);
            setStore('currentDepartmentId', departmentId);
            this.changeIsrefreshCirculationConnectPage(true);
            this.$router.push({path:'/circulationTaskMessageConnect'});
            this.changeTitleTxt({tit:'循环信息交接'});
            setStore('currentTitle','循环信息交接')
          }
        }
      } else {
         this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

    // 扫码确认事件
    sweepCodeSure () {
      this.sweepAstoffice();
    },

    //判断扫码科室是否为当前要收集的科室
    juddgeMedicalCorrect(data) {
      judgeDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          if(this.isCollectEnterSweepCodePage) {
            this.$router.push({path:'/circulationTaskCollectMessage'});
            this.changeTitleTxt({tit:'循环信息采集'});
            setStore('currentTitle','循环信息采集')
          }
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true,
            showCancelButton: true 
          }).then(() => {
            this.againSweepCode()
          }).catch((err) =>{})
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.changeIsrefreshCirculationConnectPage(true);
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
    }
  }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    .content-wrapper();
      .left-dropDown {
      .rightDropDown
    }
    font-size: 14px;
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    };
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
       .point-area {
        height: auto;
        width: 80%;
        background: #fff;
        margin-left: 4%;
        margin-top: 140px;
        padding: 20px 10px 20px 20px;
        box-shadow: 0 2.5px 12px 4px #d1d1d1;
        border-radius: 8px;
        box-sizing: border-box;
        color: #313131;
        font-weight: bold;
        letter-spacing: 2px;
        .task-start-point{
          margin-bottom: 20px;
          padding-left: 10px;
          font-size: 16px;
          span {
            color: #585858;
          }
          ul {
             margin-top: 6px;
             li {
               line-height: 20px
             }
          }
        }
      }
    };
    .btn-area {
      height: 80px;
      text-align: center;
      line-height: 80px
    }
  }
</style>