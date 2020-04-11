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
      <h3>科室信息采集</h3>
    </div>
    <div class="form-two">
      <van-field v-model="bedNumber" label="床号" placeholder="请输入"/>
      <van-field v-model="patientName" label="姓名" placeholder="请输入"/>
    </div>
    <div class="sample-number-box">
      <van-field v-model="sampleAmount" disabled type="number" label="标本总数"/>
    </div>
    <div class="increase-btn">
      <span>
        <img :src="taskIncreasePng" alt=""  @click="increaseSampleCollectBox">
      </span>
    </div>
    <div class="sweep-code-area">
      <div class="increaseLineArea">
        <div class="circulation-area" v-for="(item,index) in sampleMessageList" :key="`${item}-${index}`">
          <div class="sample-box">
            <div class="sample-title">标本类型</div>
            <div class="sample-content">
                <van-dropdown-menu>
                  <van-dropdown-item v-model="item.sampleType" :options="item.sampleTypeList"/>
                </van-dropdown-menu>
            </div>
          </div>
          <div class="check-entry-box">
            <div class="check-entry-title">检查项</div>
              <div class="check-entry-content">
                <van-checkbox-group v-model="item.checkEntryList" direction="horizontal">
                  <van-checkbox
                    shape="quare"
                    v-for="(item,index) in item.entryList"
                    :key="`${item}-${index}`"
                    :name='`{"id":"${item.id}","itemName":"${item.itemName}"}`'
                  >
                    {{ item.itemName }}
                  </van-checkbox>
                </van-checkbox-group>
              </div>
            </div>
            <div class="inner-sample--number-box">
              <div class="inner-sample--number-title">数量</div>
              <div class="inner-sample--number-content">
                <van-field v-model="item.innerSampleAmount" type="number" placeholder="请输入该标本数量"/>
              </div>
            </div>
            <div class="delete-box">
              <span>
                <img :src="taskDeletePng" alt=""  @click="deleteCurrentSampleCollectBox(item,index)">
              </span>
            </div>
          </div>
      </div>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSurePng" alt=""  @click="collectMessageSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="collectMessageCancel">
      </span>
    </div>
     <van-dialog
        v-model="collectMessaheSureShow"
        title="是否收集该科室其它床位标本"
        show-cancel-button
        confirmButtonText="确定"
        cancelButtonText="取消"
        :close-on-popstate="true"
        :close-on-click-overlay="true"
        @confirm="collectSure"
        @cancel="collectCancel"
      >
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {queryCheckEntry, querySampleMessage} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, checkEmptyArray, deepClone, querySampleName } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      bedNumber: '',
      patientName: '',
      sampleAmount: 0,
      collectMessaheSureShow: false,
      sampleMessageList: [
        {
          sampleType: '',
          sampleTypeList: [],
          entryList: [],
          checkEntryList: [],
          innerSampleAmount: 0
        }
      ],
      temporarySampleTypeList: [],
      temporarySampleType: '',
      temporaryCheckEntryList: [],
      taskIncreasePng: require('@/components/images/task-increase.png'),
      taskDeletePng: require('@/components/images/task-delete.png'),
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png'),
    }
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom
  },

  watch: {
    sampleMessageList: {
      handler(newName, oldName) {
        let emptyArr = [];
        if (newName.length > 0) {
          for (let item of newName) {
            for (let val in item) {
              if (val == 'innerSampleAmount') {
                emptyArr.push(item[val])
              }
            }
          };
        }
        if (emptyArr.length>0) {
            this.sampleAmount = checkEmptyArray(emptyArr).reduce((prev, curr, idx, arr) => {
            return Number(prev) + Number(curr);
          })
        };
      },
      immediate: true,
      deep: true
    }
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.collectMessaheSureShow == true) {
          this.$dialog.alert({
            message: '请先处理是否收集该科室其它床位标本弹框',
            closeOnPopstate: true,
            showCancelButton: true   
          }).then(() => {
          })
          .catch(() => {})
        } else {
        this.$dialog.alert({
          message: '返回上页后,将丢失本科室采集数据!',
          closeOnPopstate: true,
          showCancelButton: true   
          }).then(() => {
            this.changeCirculationCollectMessageList({DtMsg:[]});
            this.$router.push({'path':'/circulationTaskSweepCode'});
            this.changeTitleTxt({tit:'扫码'});
            setStore('currentTitle','扫码');}
          )
          .catch(() => {})
        }
      })
    };
    this.getSampleMessage();
    this.getCheckEntryMessage()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'circulationCollectMessageList'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationCollectMessageList',
      'circulationCollectMessageList1',
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

    // 查询标本信息
    getSampleMessage () {
      querySampleMessage(
        { proId: this.proId, // 项目ID 必输
         state: 0  //查询状态，0-启用，1-禁用，固定传 0
        }).then((res) => {
           this.sampleMessageList[0].sampleTypeList = [];
           this.sampleMessageList[0].sampleType = '';
           if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                this.sampleMessageList[0].sampleType = item.id;
                this.sampleMessageList[0].sampleTypeList.push({
                  text: item.specimenName,
                  value: item.id,
                });
              };
              // 标本信息存入locaStorage
              setStore('sampleInfo',{sampleKey:this.sampleMessageList[0].sampleTypeList});
              this.temporarySampleTypeList = this.sampleMessageList[0].sampleTypeList;
              this.temporarySampleType =  this.sampleMessageList[0].sampleType
            }
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

    // 查询检查项信息
    getCheckEntryMessage () {
      queryCheckEntry(
        { proId: this.proId, // 项目ID 必输
         state: 0  //查询状态，0-启用，1-禁用，固定传 0
        }).then((res) => {
          this.sampleMessageList[0].entryList = [];
          if (res && res.data.code == 200) {
            let temporaryCheckList = [];
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                temporaryCheckList.push({
                  id: item.id,
                  itemName: item.itemName
                })
              };
              this.sampleMessageList[0].entryList = temporaryCheckList;
              this.temporaryCheckEntryList = this.sampleMessageList[0].entryList;
            }
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

    // 返回上一页
    backTo () {
      if (this.collectMessaheSureShow == true) {
        this.$dialog.alert({
          message: '请先处理是否收集该科室其它床位标本弹框',
          closeOnPopstate: true,
          showCancelButton: true   
        }).then(() => {
        })
        .catch(() => {})
      } else {
        this.$dialog.alert({
          message: '返回上页后,将丢失本科室采集数据',
          closeOnPopstate: true,
          showCancelButton: true   
        }).then(() => {
          this.changeCirculationCollectMessageList({DtMsg:[]});
          this.$router.push({'path':'/circulationTaskSweepCode'});
          this.changeTitleTxt({tit:'扫码'});
          setStore('currentTitle','扫码');}
          )
        .catch(() => {})
      }
    },

    // 采集信息确认事件
    collectMessageSure () {
      this.collectMessaheSureShow = true;
    },

    // 收集是否完成弹框确定事件
    collectSure () {
      // store和localStorage同时存储采集的信息
      let currentCollectAllMessageSure = deepClone(this.circulationCollectMessageList);
      currentCollectAllMessageSure.push({
        sampleMessageList: this.sampleMessageList,
        bedNumber: this.bedNumber,
        patientName: this.patientName,
        sampleAmount: this.sampleAmount
      });
      this.changeCirculationCollectMessageList({DtMsg:currentCollectAllMessageSure});
      setStore('currentCirculationCollectMessage',{innerMessage:currentCollectAllMessageSure});
      // 清空上个床位的采集信息
      this.bedNumber = '';
      this.patientName = '';
      this.sampleAmount = 0;
      this.sampleMessageList = [
        {
          sampleType: '',
          sampleTypeList: [],
          entryList: [],
          checkEntryList: [],
          innerSampleAmount: 0
        }
      ];
      this.getSampleMessage();
      this.getCheckEntryMessage()
    },

    // 收集是否完成弹框取消事件
    collectCancel () {
      // store和localStorage同时存储采集的信息
      let currentCollectAllMessageCancel = deepClone(this.circulationCollectMessageList);
      currentCollectAllMessageCancel.push({
        sampleMessageList: this.sampleMessageList,
        bedNumber: this.bedNumber,
        patientName: this.patientName,
        sampleAmount: this.sampleAmount,
      });
      console.log('传的数据',currentCollectAllMessageCancel,currentCollectAllMessageCancel);
      this.changeCirculationCollectMessageList({DtMsg:currentCollectAllMessageCancel});
      setStore('currentCirculationCollectMessage',{innerMessage:currentCollectAllMessageCancel});
      this.$router.push({path:'/circulationTaskCollectMessageSure'});
      this.changeTitleTxt({tit:'采集信息确认'});
      setStore('currentTitle','采集信息确认')
    },

    // 采集信息取消事件
    collectMessageCancel () {
      this.$dialog.alert({
        message: '取消采集后,将丢失本科室采集数据!',
        closeOnPopstate: true,
        showCancelButton: true   
      }).then(() => {
        this.changeCirculationCollectMessageList({DtMsg:[]});
        this.$router.push({'path':'/circulationTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码');}
        )
      .catch(() => {})
    },

    // 新增标本采集框
    increaseSampleCollectBox () {
      this.sampleMessageList.push( 
        {
          sampleType: this.temporarySampleType,
          sampleTypeList: this.temporarySampleTypeList,
          entryList: this.temporaryCheckEntryList,
          checkEntryList: [],
          innerSampleAmount: 0
        }
      );
    },

    // 删除当前标本采集项
    deleteCurrentSampleCollectBox (item,index) {
      this.sampleMessageList.splice(index, 1);
      for (let i in this.sampleMessageList) {
        this.sampleMessageList[i].index = i
      }
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
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    };
    .form-two {
      padding: 2px;
    };
    .increase-btn {
      height: 40px;
      line-height: 40px;
      padding-right: 10px;
      text-align: right;
      background: #f6f6f6;
      span {
        display: inline-block;
        width: 70px;
        height: 30px;
        margin-top: 5px;
        img {
          width: 100%;
          height: 100%
        }
      }
    };
    .inner-sample--number-box {
       > div {
          display: inline-block
        };
      .inner-sample--number-title {
        width: 30%
      };
      .inner-sample--number-content {
        width: 60%;
        /deep/ .van-cell{
          padding-left: 0
        }
      }
    }
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%;
      .increaseLineArea {
        .circulation-area {
          padding: 10px 18px;
          height: 200px;
          position: relative;
          border-bottom: 1px solid #dfdfdf;
          .sample-box {
            > div {
              display: inline-block
            };
            .sample-title {
              width: 30%
            }
            .sample-content {
              width: 60%;
              /deep/ .van-dropdown-menu {
               .van-dropdown-menu__item {
                 .van-dropdown-menu__title {
                    width: 100%;
                    padding: 0
                 }
               }
              }
            }
          }
          .check-entry-box {
            > div {
              display: inline-block
            };
            .check-entry-title {
              width: 30%;
              vertical-align: top;
            }
            .check-entry-content {
              width: 60%;
              height: 100px;
              overflow: auto;
               /depp/.van-checkbox-group {
                .van-checkbox {
                  display: inline-block
                }
              }
            }
          }
          .delete-box {
            position: absolute;
            bottom: 10px;
            right: 10px;
            span {
              display: inline-block;
              width: 70px;
              height: 30px;
              margin-top: 5px;
              img {
                width: 100%;
                height: 100%
              }
            }
          }
        }
      }
    };
    .btn-area {
      height: 80px;
      text-align: center;
      line-height: 80px;
      span {
        .bottomButton;
        display: inline-block;
        margin-top: 15px;
        img {
          width: 100%;
          height: 100%
        }
      }
    }
  }
</style>