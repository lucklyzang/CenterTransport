<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="sweep-code-title">
      <h3>运送信息采集确认</h3>
    </div>
      <div class="bed-number-list-outer">
        <div class="bed-number-list" v-for="(outerItem,index) in allcirculationCollectMessageList" :key="`${outerItem}-${index}`">
          <div class="form-two">
            <van-field v-model="outerItem.bedNumber" disabled label="床号" placeholder="请输入"/>
            <van-field v-model="outerItem.patientName" disabled type="tel" label="姓名" placeholder="请输入"/>
          </div>
          <div class="sample-number-box">
            <van-field v-model="outerItem.sampleAmount" disabled type="number" label="标本总数" placeholder="请输入标本数量"/>
          </div>
          <div class="sweep-code-area">
            <div class="increaseLineArea">
              <div class="circulation-area" v-for="(item,index) in outerItem.sampleMessageList" :key="`${item}-${index}`">
                <div class="sample-box">
                  <div class="sample-title">标本类型</div>
                  <div class="sample-content">
                      <van-dropdown-menu>
                        <van-dropdown-item disabled v-model="item.sampleType" :options="item.sampleTypeList"/>
                      </van-dropdown-menu>
                  </div>
                </div>
                <div class="check-entry-box">
                  <div class="check-entry-title">检查项</div>
                  <div class="check-entry-content">
                      <van-checkbox-group v-model="item.checkEntryList">
                         <van-checkbox
                            shape="quare"
                            v-for="(item,index) in item.entryList"
                            :key="`${item}-${index}`"
                            :name="`{id:${item.id},itemName:${item.itemName}}`"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="electronic-signature">
      <ElectronicSignature></ElectronicSignature>
    </div>
    <div class="btn-area">
      <van-button type="info" @click="collectMessageSure">确认</van-button>
      <van-button type="info" @click="collectMessageCancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import ElectronicSignature from '@/components/ElectronicSignature'
import FooterBottom from '@/components/FooterBottom'
//  import {getAlltTaskNumber} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      allcirculationCollectMessageList: [],
      
        bedNumber: '',
        patientName: '',
        sampleAmount: '',
        sampleMessageList: [
          {
            sampleType: '',
            innerSampleAmount: '',
            sampleTypeList: [],
            entryList: [],
            checkEntryList: []
          }
        ]
      
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
    console.log(this.circulationCollectMessageList);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    this.echoCollectMessage()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'currentElectronicSignature',
      'circulationCollectMessageList'
    ])
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationCollectMessageList'
    ]),

    // 我的页面
    skipMyInfo () {

    },


    // 回显已经采集信息
    echoCollectMessage () {
      // let msg = this.circulationCollectMessage;
      // this.sampleMessageList = msg.circulatioFormList;
      // this.bedNumber = msg.echoBedNumber;
      // this.patientName = msg.echoPatientName;
      // this.sampleAmount = msg.echoSampleAmount
      this.allcirculationCollectMessageList = this.circulationCollectMessageList
    },

    // 返回上一页
    backTo () {
      this.$router.push({path:'/circulationTaskCollectMessage'});
      this.changeTitleTxt({tit:'循环信息采集'});
      setStore('currentTitle','循环信息采集')
    },

     // 采集信息确认事件
    collectMessageSure () {
      // this.$router.push({path:'/circulationTask'})
      // this.changeTitleTxt({tit:'循环任务'});
      // setStore('currentTitle','循环任务');
      console.log(this.currentElectronicSignature);
      this.changeCirculationCollectMessageList({DtMsg:[]});
      removeStore('currentCirculationCollectMessage')
    },

    // 采集信息取消事件
    collectMessageCancel () {
      this.$router.push({path:'/circulationTaskCollectMessage'});
      this.changeTitleTxt({tit:'信息采集'});
      setStore('currentTitle','信息采集')
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
      margin-top: 10px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 15px;
      }
    };
    .bed-number-list-outer {
        flex:1;
        overflow: auto;
        margin: 0 auto;
        margin: 10px 0;
      .bed-number-list {
        height: 100%;
        .form-two {
          padding: 2px;
        };
        .sample-number-box {
        }
        .sweep-code-area {
          margin: 10px 0;
          width: 100%;
          height: 150px;
          overflow: auto;
          .increaseLineArea {
            .circulation-area {
              padding: 10px 18px;
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
                  width: 30%
                }
                .check-entry-content {
                  width: 60%;
                  height: 60px;
                  overflow: auto;
                  /depp/.van-checkbox-group {
                    .van-checkbox {
                      display: inline-block
                    }
                  }
                }
              }
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
            }
          }
        };
      }
    }
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