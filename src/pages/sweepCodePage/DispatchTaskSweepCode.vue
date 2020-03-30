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
    <div class="sweep-code-title">
      <h3></h3>
    </div>
    <div class="sweep-code-area">
      <div class="photo-area-box" v-show="photoAreaBoxShow">
        <div class="photo-preview">
          <img width="100" height="130" id="preview1" :src="upImgUrl"/>
        </div>
        <div class="choose-photo-box">
          <div class="choose-photo">
            <input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>上传照片
          </div>
          <div class="photo-graph">
            <input name="uploadImg2" id="demo2"  type="file" accept="image/camera"/>拍照
          </div>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <van-button type="info" v-show="photoAreaBoxShow == true" @click="submitPhoto">提交</van-button>
      <van-button type="info" v-show="photoAreaBoxShow == false" @click="sweepCodeSure">扫描二维码</van-button>
      <van-button type="default" @click="cancelSweepCode">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import AfterSaleImage from '@/components/AfterSaleImage'
import {judgeDispatchTaskDepartment,updateDispatchTask,dispatchTaskUploadMsg} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC} from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      photoAreaBoxShow: false,
      srcUrl: '',
      headerImg: '',
      liIndex: null,
      upImgUrl: require('@/common/images/home/no-data-default.png'),
    };
  },

  components:{
    HeaderTop,
    NoData,
    AfterSaleImage
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
         this.$dialog.alert({
          message: '返回上级后,将丢失本页数据!',
          closeOnPopstate: true,
          showCancelButton: true   
        }).then(() => {
          this.changeIsRefershDispatchTaskPage(false);
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
        })
        .catch(() => {})
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    console.log('调度任务状态' ,this.dispatchTaskState, this.dispatchTaskDepartmentType,this.isCoerceTakePhoto);
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'dispatchTaskMessage',
      'dispatchTaskState',
      'dispatchTaskDepartmentType',
      'isCoerceTakePhoto'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    proName () {
      return JSON.parse(getStore('userInfo')).extendData.proName
    },
    taskId () {
      return this.dispatchTaskMessage.id
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsRefershDispatchTaskPage'
    ]),

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 图片预览
    previewFileOne() {
      let img = document.getElementById("preview1");
      let file =document.getElementById("demo1").files[0];
      let dataImg;
      let reader = new FileReader();
      reader.addEventListener("load", function () {
      img.src = reader.result;
      this.upImgUrl = reader.result;
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },
    
    // 上传图片
    uploadPhoto (data) {
      dispatchTaskUploadMsg(data).then((res) => {
        if (res && res.data.code == 200) {
          this.updateTaskState({
            proId: this.proId, //当前项目ID
            id: this.dispatchTaskMessage.id, //当前任务ID
            state: this.dispatchTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
          });
          this.photoAreaBoxShow = false
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

    // 提交图片
    submitPhoto () {
      this.uploadPhoto(
        {
          taskId: this.taskId,  //任务ID必填
          proId: this.proId,  //项目ID必填
          proName: this.proName,//项目名称必填项
          type:  this.dispatchTaskDepartmentType,  //'图片类型 0-出发地，1-目的地', 必填项
          taskType: 0,     //'任务类型 0-调度类，1-循环类，2-预约类' 必填项
          photo: this.upImgUrl //base64字符串必填
        }
      );
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code.split('|');
        if (codeData.length > 0) {
          let departmentId = codeData[0];
          this.juddgeCurrentDepartment({
            id: this.dispatchTaskMessage.id,  //任务ID
            proId: this.proId,  //项目ID
            departmentId: departmentId,  //科室ID
            checkType: this.dispatchTaskDepartmentType   //校验类型  出发地-0,目的地-1
          })
        }
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

    // 重新扫码弹窗
    againSweepCode () {
      this.sweepAstoffice()
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

    // 判断扫码科室
    juddgeCurrentDepartment (data) {
      judgeDispatchTaskDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          if (this.isCoerceTakePhoto == 0) {
            this.updateTaskState({
              proId: this.proId, //当前项目ID
              id: this.dispatchTaskMessage.id, //当前任务ID
              state: this.dispatchTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
            });
            this.photoAreaBoxShow = false
          } else {
            this.photoAreaBoxShow = true
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

    // 更新任务状态
    updateTaskState (data) {
      updateDispatchTask(data).then((res) => {
        if (res && res.data.code == 200) {
          this.changeIsRefershDispatchTaskPage(true);
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
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

    // 返回上一页
    backTo () {
      this.$dialog.alert({
        message: '返回上级后,将丢失本页数据!',
        closeOnPopstate: true,
        showCancelButton: true   
      }).then(() => {
        this.changeIsRefershDispatchTaskPage(false);
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      })
      .catch(() => {})
    },

     // 扫码确认事件
    sweepCodeSure () {
      this.sweepAstoffice()
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.changeIsRefershDispatchTaskPage(false);
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
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
        font-size: 15px
      }
    };
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .photo-area-box {
        .photo-preview {
          width: 30%;
          margin: 0 auto;
          margin-top: 60px;
          box-shadow: 0px 0px 8px 6px rgba(231, 231, 231, 0.8);
          img {
            width: 100%;
            height: 100%
          }
        }
        .choose-photo-box {
          margin-top: 20px;
          text-align: center;
          > div {
            display: inline-block;
            width: 100px
          }
          .choose-photo {
            padding: 4px 10px;
            height: 20px;
            line-height: 20px;
            position: relative;
            cursor: pointer;
            color: #888;
            background: #fafafa;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            display: inline-block;
            *display: inline;
            *zoom: 1;
            input {
              position: absolute;
              font-size: 100px;
              right: 0;
              top: 0;
              opacity: 0;
              filter: alpha(opacity=0);
              cursor: pointer
            }
          };
          .photo-graph {
            position: relative;
            display: inline-block;
            background: #D0EEFF;
            border: 1px solid #99D3F5;
            border-radius: 4px;
            padding: 4px 12px;
            overflow: hidden;
            color: #1E88C7;
            text-decoration: none;
            text-indent: 0;
            line-height: 20px;
            input {
              position: absolute;
              font-size: 100px;
              right: 0;
              top: 0;
              opacity: 0;
            }
          }
        }
      }
    };
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px
    }
  }
</style>