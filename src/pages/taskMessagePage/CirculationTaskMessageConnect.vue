<template>
   <div class="content-wrapper">
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor="#2895ea"></loading>
    </div>
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
      <h3>采集信息交接</h3>
    </div>
    <div class="sweep-code-area" v-show="connectMessageArea">
      <div class="sample-type-list" v-for="(item,index) in manageSampleDataList" :key="`${item}-${index}`">
        <div class="sample-type-title-wrapper">
          <div class="sample-type-check">
            <van-checkbox v-model="item.check" @click="checkBoxEvent"></van-checkbox>
          </div>
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
    <div class="btn-area">
      <van-button type="info" @click="ConnectSure">确认交接</van-button>
      <van-button type="default" @click="ConnectCancel">取消交接</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {queryCollectSampleMessage} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, repeArray, deepClone, removeBlock} from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      showLoadingHint: false,
      noDataShow: false,
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      connectMessageArea: false,
      liIndex: null,
      originCollectSampleMessageList: [],
      allSampleTypeList: [],
      manageSampleDataList: []
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    Loading,
    FooterBottom
  },

  mounted () {
    console.log('获取id',this.circulationTaskId);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.changeIsrefreshCirculationTaskPage(true);
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    this.getCollectSampleMessage(this.proId,this.circulationTaskId)
  },

  activated () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.changeIsrefreshCirculationTaskPage(true);
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    if (this.isrefreshCirculationConnectPage) {
      this.getCollectSampleMessage(this.proId,this.circulationTaskId)
    }
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'isrefreshCirculationConnectPage',
      'circulationTaskId'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationConnectMessageList',
      'changeIsrefreshCirculationTaskPage'
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

    // 返回上一页
    backTo () {
      this.changeIsrefreshCirculationTaskPage(true);
      this.$router.push({path:'/circulationTask'})
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
    },

    // 查询收集的标本信息 queryCollectSampleMessage
    getCollectSampleMessage (proId, taskId) {
      this.showLoadingHint = true;
      queryCollectSampleMessage(proId, taskId).then((res) => {
         if (res && res.data.code == 200) {
           if (res.data.data.length == 0) {
              this.connectMessageArea = false;
              this.noDataShow = true;
              return
           };
            this.connectMessageArea = true;
            this.originCollectSampleMessageList = res.data.data;
            this.allSampleTypeList = [];
            for (let item of this.originCollectSampleMessageList) {
              for (let currentItem in item) {
                if (currentItem === 'specimenName') {
                  this.allSampleTypeList.push(item[currentItem])
                }
              }
            };
            this.manageSampleDataList = [];
            let filterSampleMessage = [];
            let sameSampleTypeNumber = '';
            let sameSampleNumberList = [];
            for (let i = 0, len = repeArray(this.allSampleTypeList).length; i < len; i++) {
              sameSampleTypeNumber = '';
              sameSampleNumberList = [];
              // 过滤标本为同一类型的数据
              filterSampleMessage =  this.originCollectSampleMessageList.filter((itemInfo) => {return itemInfo['specimenName'] == repeArray(this.allSampleTypeList)[i]});
              // 提取同一类型标本里的数量字段
              for (let numberFiel of filterSampleMessage) {
                for (let currentNumberFiel in numberFiel) {
                  if (currentNumberFiel === 'quantity') {
                    sameSampleNumberList.push(numberFiel[currentNumberFiel])
                  }
                }
              };
              let temporaryManageSampleDataList = [],
              // 对同一标本类型的数量进行求和
              sameSampleTypeNumber = sameSampleNumberList.reduce((last, before, index, array) => last + before);
              // 生成符合页面展示要求的数据结构
              this.manageSampleDataList.push(
                {
                  sampleTypeName: repeArray(this.allSampleTypeList)[i],
                  check: false,
                  sampleTotal: sameSampleTypeNumber,
                  sampleList: deepClone(filterSampleMessage)
                }
              );
              let manageCheckArray = [];
              let manageCheckArrayCheck = [];
              // 格式换标本项里的检查项字段
              for (let j = 0, innerLen = this.manageSampleDataList[i].sampleList.length; j < innerLen; j++) {
                manageCheckArray = [];
                manageCheckArrayCheck = [];
                let removeBraceArray = this.manageSampleDataList[i].sampleList[j]['collectionItem'].split(",");
                for (let currentCheckEntry of removeBraceArray) {
                  let transferArray = removeBlock(currentCheckEntry.replace(/\"/g, "")).split(":");
                  manageCheckArray.push({
                    itemName: transferArray[1],
                    id: transferArray[0]
                  });
                  manageCheckArrayCheck.push(JSON.stringify({
                    itemName: transferArray[1],
                    id: transferArray[0]
                  }))
                };
                this.manageSampleDataList[i]['sampleList'][j]['collectionItem'] = manageCheckArray;
                this.manageSampleDataList[i]['sampleList'][j]['checkEntryList'] = manageCheckArrayCheck
              }
            };
            console.log('最终信息',this.manageSampleDataList)
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
              this.connectMessageArea = false;
              this.noDataShow = true;
            });
          }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
          this.connectMessageArea = false;
          this.noDataShow = true;
        });
      });
      this.showLoadingHint = false;
    },

    // 复选框点击事件
    checkBoxEvent () {
      console.log(this.manageSampleDataList)
    },

    // 交接信息确认事件
    ConnectSure () {
      let circulationMessageListSure = this.manageSampleDataList.filter((item) => { return item.check == true});
      if (circulationMessageListSure.length == 0) {
        this.$dialog.alert({
          message: '请选择要交接的标本',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      this.changeCirculationConnectMessageList({DtMsg: circulationMessageListSure});
      setStore('currentCirculationConnectMessage',{innerMessage: circulationMessageListSure});
      this.$router.push({path:'/circulationTaskConnectMessageSure'})
      this.changeTitleTxt({tit:'交接信息确认'});
      setStore('currentTitle','交接信息确认')
    },

    // 交接信息取消事件
    ConnectCancel () {
      this.changeIsrefreshCirculationTaskPage(true);
      this.$router.push({path:'/circulationTask'})
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
    font-size: 14px;
    position: relative;
    .left-dropDown {
      .rightDropDown
    }
    .no-data {
      position: absolute;
      top: 200px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .loading {
      position: absolute;
      top: 260px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
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
            left: 40px;
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
    .btn-area {
      height: 80px;
      text-align: center;
      line-height: 80px;
    }
  }
</style>