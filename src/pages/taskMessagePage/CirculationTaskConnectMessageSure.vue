<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
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
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import ElectronicSignature from '@/components/ElectronicSignature'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {sampleDelivery} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, deepClone } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
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
    console.log('交接信息', this.circulationConnectMessageList);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        this.changeIsrefreshCirculationConnectPage(false);
        this.$router.push({path:'/circulationTaskMessageConnect'});
        this.changeTitleTxt({tit:'信息交接'});
        setStore('currentTitle','信息交接')
      })
    };
    this.echoConectMessage()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'currentElectronicSignature',
      'circulationConnectMessageList'
    ]),
    proId () {
    return JSON.parse(getStore('userInfo')).extendData.proId
  },
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsrefreshCirculationConnectPage',
      'changeCirculationConnectMessageList',
      'changeIsrefreshCirculationTaskPage'
    ]),

    // 我的页面
    skipMyInfo () {

    },

    // 回显交接信息
    echoConectMessage () {
      this.manageSampleDataList = deepClone(this.circulationConnectMessageList)
    },

    // 返回上一页
    backTo () {
      this.changeIsrefreshCirculationConnectPage(false);
      this.$router.push({path:'/circulationTaskMessageConnect'});
      this.changeTitleTxt({tit:'信息交接'});
      setStore('currentTitle','信息交接')
    },

    // 提交标本交接信息
    postSampleConnectMessage (data) {
      sampleDelivery(data).then((res) => {
        if (res && res.data.code == 200) {
           this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
            this.$dialog.alert({
            message: '是否还有需要交接的标本?',
            closeOnPopstate: true,
            showCancelButton: true
            }).then(() => {
              this.changeIsrefreshCirculationTaskPage(false);
              // 当前页面回显数据
              this.manageSampleDataList = [];
              // 上一页面store采集数据
              this.changeCirculationConnectMessageList({DtMsg:[]});
              // 上一页面Localstorage采集数据
              removeStore('currentCirculationConnectMessage');
              this.$router.push({path:'/circulationTask'});
              this.changeTitleTxt({tit:'循环任务'});
              setStore('currentTitle','循环任务');
            })
            .catch(() => {
              this.this.changeIsrefreshCirculationTaskPage(false);
              // 当前页面回显数据
              this.manageSampleDataList = [];
              // 上一页面store采集数据
              this.changeCirculationConnectMessageList({DtMsg:[]});
              // 上一页面Localstorage采集数据
              removeStore('currentCirculationConnectMessage');
              this.$router.push({path:'/circulationTask'});
              this.changeTitleTxt({tit:'循环任务'});
              setStore('currentTitle','循环任务');
            })
          });
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

     // 交接信息确认事件
    connectMessageSure () {
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
      this.postSampleConnectMessage({
        proId: this.proId,        //项目ID
        departmentId: 2,  //送达科室ID
        singImg: this.currentElectronicSignature,      //送达签名图片信息
        ids: connectSampleId       //送达选择的标本ID
      })
    },

    // 交接信息取消事件
    connectMessageCancel () {
      this.$router.push({path:'/circulationTaskMessageConnect'});
      this.changeTitleTxt({tit:'信息交接'});
      setStore('currentTitle','信息交接')
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
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 15px
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
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
</style>