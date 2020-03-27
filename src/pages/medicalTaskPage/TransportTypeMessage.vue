<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="transport-type-title">
      <h3>{{transportantTaskMessage}}</h3>
    </div>
    <div class="transport-type-area">
      <div class="destination-box">
        <div class="destination-title">目的地</div>
        <div class="destination-content">
          <van-dropdown-menu>
            <van-dropdown-item v-model="destinationAddress" :options="destinationList"/>
          </van-dropdown-menu>
        </div>
      </div>
      <van-field v-model="bedNumber" label="床号" placeholder="请输入床号"/>
      <van-field v-model="patientName"  label="病人姓名" placeholder="请输入病人姓名"/>
      <van-field v-model="patientNumber"  label="病人编号" placeholder="请输入病人编号"/>
      <div class="destination-box">
        <div class="destination-title">工具</div>
        <div class="destination-content">
          <van-dropdown-menu>
            <van-dropdown-item v-model="vehicleOperation" :options="vehicleOperationList"/>
          </van-dropdown-menu>
        </div>
      </div>
      <van-field v-model="taskDescribe"  label="任务描述" placeholder="请输入任务描述"/>
      <van-field v-model="actualData"  label="实际数据" placeholder="请输入实际数据"/>
    </div>
    <div class="btn-area">
      <van-button type="info" @click="dispatchTaskSure">确认</van-button>
      <van-button type="default" @click="dispatchTaskCancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
//  import {getAlltTaskNumber} from '@/api/workerPort.js'
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
      destinationAddress: 0,
      destinationList: [ { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      vehicleOperation: '',
      vehicleOperationList: [{ text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      bedNumber: '',
      patientName: '',
      patientNumber: '',
      taskDescribe: '',
      actualData: ''
    }
  },

  components: {
    HeaderTop,
    NoData,
    FooterBottom,
    VanFieldSelectPicker
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'transportantTaskMessage'
    ])
  },

  mounted () {
    console.log(this.changetransportTypeMessage);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'首页'});
        setStore('currentTitle','首页') 
      })
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeDispatchTaskMessage',
      'changeIsRefershHome',
      'changeIsHomeJumpOtherPage'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'home'});
      this.changeTitleTxt({tit:'中央运送'});
      setStore('currentTitle','中央运送');
      this.changeIsHomeJumpOtherPage({DtMsg: true})
    },

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

    // 运送类型信息确认事件
    dispatchTaskSure () {
      this.$router.push({path:'/home'});
      this.changeTitleTxt({tit:'中央运送'});
      setStore('currentTitle','中央运送');
      this.changeIsRefershHome({DtMsg: true});
      this.changeIsHomeJumpOtherPage({DtMsg: true})
    },

    // 运送类型信息取消事件
    dispatchTaskCancel () {
      this.$router.push({path:'/home'});
      this.changeTitleTxt({tit:'中央运送'});
      setStore('currentTitle','中央运送');
      this.changeIsRefershHome({DtMsg: false});
      this.changeIsHomeJumpOtherPage({DtMsg: true})
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
    font-size: 14px;
      .left-dropDown {
      .rightDropDown
    }
    .transport-type-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      background: #e2e2e2;
      margin-top: 10px;
    };
    .transport-type-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%;
      .destination-box {
        padding-left: 15px;
        > div {
            display: inline-block
          };
          .destination-title {
            width: 24%;
            color: #323233;
          }
        .destination-content {
          width: 66%;
          /deep/ .van-dropdown-menu {
            .van-dropdown-menu__item {
              .van-dropdown-menu__title {
                  width: 100%;
                  padding: 0;
                  color: #999999;
                  font-size: 14px;
              }
            }
          }
        }
      }
    }
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }  
</style>