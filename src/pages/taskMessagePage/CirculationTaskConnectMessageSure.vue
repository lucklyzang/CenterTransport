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
      <h3>交接信息确认</h3>
    </div>
     <div class="sweep-code-area">
      <div class="sample-type-list" v-for="(item,index) in manageSampleDataList" :key="`${item}-${index}`">
        <div class="sample-type-title-wrapper">
          <div class="sample-type-title">{{item.sampleTypeName}}</div>
          <div class="sample-type-total">{{item.sampleTotal}}</div>
        </div>
        <div class="sample-type-message-wrapper">
          <div class="sample-type-message-list" v-for="(innerItem,innerIndex) in item.sampleList" :key="`${innerItem}-${innerIndex}`">
            <div class="sample-type-message-list-inner-erapper">
              <p>
                <span class="message-tit">科室:</span>
                <span class="message-tit-real">{{innerItem.spaceName}}</span>
              </p>
              <P>
                <span class="message-tit">收集时间:</span>
                <span class="message-tit-real">{{innerItem.collectionTime}}</span>
              </P>
            </div>
            <div class="sample-type-message-list-inner-erapper">
              <p>
                <span class="message-tit">病人姓名:</span>
                <span class="message-tit-real">{{innerItem.patientName}}</span>
              </p>
              <P>
                <span class="message-tit">病人床号:</span>
                <span class="message-tit-real">{{innerItem.bedNumber}}</span>
              </P>
            </div>
            <div class="sample-type-message-list-inner-erapper">
              <p>
                <span class="message-tit">标本数量:</span>
                <span class="message-tit-real">{{innerItem.quantity}}</span>
              </p>
              <P>
                <span class="message-tit">检查项:</span>
                <span class="message-tit-real">
                    <van-checkbox-group  v-model="innerItem.checkEntryList" direction="horizontal">
                      <van-checkbox
                        shape="quare"
                        disabled
                        v-for="(item,index) in innerItem.collectionItem"
                        :key="`${item}-${index}`"
                        :name='`{"itemName":"${item.itemName}","id":"${item.id}"}`'
                      >
                        {{ item.itemName }}
                      </van-checkbox>
                    </van-checkbox-group>
                </span>
              </P>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="electronic-signature">
      <ElectronicSignature></ElectronicSignature>
    </div>
    <div class="btn-area">
      <van-button type="info" @click="connectMessageSure">确认</van-button>
      <van-button type="default" @click="connectMessageCancel">取消</van-button>
    </div>
     <van-dialog
        v-model="connectMessaheSureShow"
        title="是否还有需要交接的标本?"
        show-cancel-button
        confirmButtonText="确定"
        cancelButtonText="取消"
        :close-on-popstate="true"
        :close-on-click-overlay="true"
        @confirm="connectSure"
        @cancel="connectCancel"
      >
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import ElectronicSignature from '@/components/ElectronicSignature'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {sampleDelivery, updateCirculationTask} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, deepClone } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      connectMessaheSureShow: false,
      liIndex: null,
      manageSampleDataList: []
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom,
    ElectronicSignature
  },

  mounted () {
    console.log('交接信息', this.circulationTaskId);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.connectMessaheSureShow == true) {
          this.$dialog.alert({
            message: '请先处理是否还有需要交接的标本弹框',
            closeOnPopstate: true,
            showCancelButton: true   
          }).then(() => {
          })
          .catch(() => {})
        } else {
          this.$dialog.alert({
            message: '返回上级后,将丢失本页数据!',
            closeOnPopstate: true,
            showCancelButton: true   
            }).then(() => {
              this.changeCurrentElectronicSignature({DtMsg: null});
              this.changeIsrefreshCirculationConnectPage(false);
              this.$router.push({path:'/circulationTaskMessageConnect'});
              this.changeTitleTxt({tit:'信息交接'});
              setStore('currentTitle','信息交接')}
            )
            .catch(() => {})
        };
      })
    };
    this.echoConectMessage()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'currentElectronicSignature',
      'circulationConnectMessageList',
      'circulationTaskMessage',
      'storeArriveDeparnmentId'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
     circulationTaskId () {
      return this.circulationTaskMessage.currentMsg.id
    },
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsrefreshCirculationConnectPage',
      'changeCirculationConnectMessageList',
      'changeIsrefreshCirculationTaskPage',
      'changeCompleteDeparnmentInfo',
      'changeCurrentElectronicSignature'
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

    // 回显交接信息
    echoConectMessage () {
      this.manageSampleDataList = deepClone(this.circulationConnectMessageList)
    },

    // 返回上一页
    backTo () {
      if (this.connectMessaheSureShow == true) {
          this.$dialog.alert({
            message: '请先处理是否还有需要交接的标本弹框',
            closeOnPopstate: true,
            showCancelButton: true   
          }).then(() => {
          })
          .catch(() => {})
      } else {
        this.$dialog.alert({
          message: '返回上级后,将丢失本页数据!',
          closeOnPopstate: true,
          showCancelButton: true   
          }).then(() => {
            this.changeCurrentElectronicSignature({DtMsg: null});
            this.changeCirculationConnectMessageList({DtMsg:[]});
            this.changeIsrefreshCirculationConnectPage(false);
            this.$router.push({path:'/circulationTaskMessageConnect'});
            this.changeTitleTxt({tit:'信息交接'});
            setStore('currentTitle','信息交接')}
          )
          .catch(() => {})
      };
    },

    // 是否有未交接的标本确定
    connectSure () {
      // 当前页面回显数据
      this.manageSampleDataList = [];
      // 上一页面store采集数据
      this.changeCurrentElectronicSignature({DtMsg: null});
      this.changeCirculationConnectMessageList({DtMsg:[]});
      // 上一页面Localstorage采集数据
      removeStore('currentCirculationConnectMessage');
      this.changeIsrefreshCirculationTaskPage(true);
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务');
    },

    // 是否有未交接的标本取消
    connectCancel () {
      this.updateCirculationtaskState({
        proId: this.proId,		 //当前项目ID
        id: this.circulationTaskId, //当前任务ID
        state: 7 //更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'}
      });
    },

    // 提交标本交接信息
    postSampleConnectMessage (data) {
      sampleDelivery(data).then((res) => {
        if (res && res.data.code == 200) {
          this.connectMessaheSureShow = true;
          this.changeCurrentElectronicSignature({DtMsg: null})
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
        }).then(() => {
        });
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

    // 更新循环任务状态
    updateCirculationtaskState (data) {
      updateCirculationTask(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$dialog.alert({
            message: '该条循环任务已经完成',
            closeOnPopstate: true
          }).then(() => {
          });
          // 当前页面回显数据
          this.manageSampleDataList = [];
          // 上一页面store采集数据
          this.changeCurrentElectronicSignature({DtMsg: null});
          this.changeCirculationConnectMessageList({DtMsg:[]});
          // 上一页面Localstorage采集数据
          removeStore('currentCirculationConnectMessage');
          this.changeCompleteDeparnmentInfo({DtMsg: {
            departmentIdList: [],
            taskId: ''
          }});
          removeStore('completeDepartmentMessage');
          this.changeIsrefreshCirculationTaskPage(true);
          this.$router.push({path:'/circulationTask'});
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务');
        } else {
          this.$dialog.alert({
            message: `${res.data.data}`,
            closeOnPopstate: true
          }).then(() => {
          });
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

     // 交接信息确认事件
    connectMessageSure () {
      if (!this.currentElectronicSignature) {
        this.$dialog.alert({
          message: '签名不能为空，请确认签名!',
          closeOnPopstate: true
        }).then(() => {
        });
        return;
      };
      let connectSampleId = [];
      // 获取需要交接的标本id
      for (let item of this.manageSampleDataList) {
        for (let innerItem in item) {
          if (innerItem == 'sampleList') {
            for (let currentItem of item['sampleList']) {
              for (let idFieId in currentItem) {
                if (idFieId == 'id') {
                  connectSampleId.push(currentItem[idFieId]);
                }
              }
            }
          }
        }
      };
      console.log('交接标本id',connectSampleId);
      this.postSampleConnectMessage({
        proId: this.proId,  //项目ID
        departmentId: this.storeArriveDeparnmentId,  //送达科室ID
        singImg: this.currentElectronicSignature,   //送达签名图片信息
        ids: connectSampleId   //送达选择的标本ID
      })
    },

    // 交接信息取消事件
    connectMessageCancel () {
      this.$dialog.alert({
        message: '返回上页后,将丢失本页数据!',
        closeOnPopstate: true,
        showCancelButton: true   
        }).then(() => {
          this.changeCurrentElectronicSignature({DtMsg: null});
          this.changeCirculationConnectMessageList({DtMsg:[]});
          this.changeIsrefreshCirculationConnectPage(false);
          this.$router.push({path:'/circulationTaskMessageConnect'});
          this.changeTitleTxt({tit:'信息交接'});
          setStore('currentTitle','信息交接')}
        )
      .catch(() => {})
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
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .sample-type-list {
        height: 250px;
        position: relative;
        .sample-type-title-wrapper {
          position: relative;
          height: 30px;
          background: #f1f1f1;
          line-height: 30px;
          color: #2895ea;
          .sample-type-check {
            position: absolute;
            top: 5px;
            left: 10px
          }
          .sample-type-title {
            position: absolute;
            top: 0;
            left: 10px;
          };
          .sample-type-total {
            position: absolute;
            top: 0;
            right: 10px;
          }
        }
        .sample-type-message-wrapper{
          height: 220px;
          overflow: auto;
          box-sizing: border-box;
          padding: 10px;
          .sample-type-message-list {
            width: 100%;
            border-bottom: 1px solid #d5d5d5;
            padding: 4px 0;
            box-sizing: border-box;
            .sample-type-message-list-inner-erapper {
              p {
                height: 46px;
                vertical-align: top;
                overflow: auto;
                display: inline-block;
                line-height: 20px;
                width: 47%;
                .message-tit {
                  color: #7f7d7d
                };
                .message-tit-real {
                  color: black
                }
              }
            }
          }
        }
      }
    };
    .electronic-signature {
      height: 250px
    }
    .btn-area {
      height: 80px;
      text-align: center;
      line-height: 80px;
    }
  }
</style>