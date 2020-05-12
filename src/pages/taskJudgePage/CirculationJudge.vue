<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="btn-area">
      <van-button type="info">结束任务</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, deepClone, repeArray, compressImg} from '@/common/js/utils'
export default {
  data () {
    return {
      showIsGoOtherDestination: false,
      isPassGoDeparture: false
    };
  },

  components: {
    HeaderTop
  },

  mounted () {
    this.judgeIsSingleDestination();
      if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        if (!this.isDialogShow) {
          this.judgeIsSingleDestination();
          return
        };
        if (!this.isNoBedInfoShow) {
          this.judgeIsGoDeparture()
        }
      })
    }
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'isBack',
      'isSingleDestination'
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

  methods: {
    ...mapMutations([
      'changeTitleTxt',
    ]),

    // 判断是否为单一目的地
    judgeIsSingleDestination () {
      this.showIsGoOtherDestination = true;
      if (this.isSingleDestination) {
         if (!this.isPassGoDeparture) {
          this.showIsGoOtherDestination = true;
          this.judgeIsGoDeparture()
        } else {
          this.isPassGoDeparture = false
          // 调取结束派送方法
        }
      } else {
         if (!this.isPassGoDeparture) {
          this.judgeIsGoOtherDestination()
        } else {
          this.isPassGoDeparture = false
          // 手动结束任务
        }
      };
      this.$dialog.confirm({
        message: '该任务是否为单一目的地?',
        closeOnPopstate: false,
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
    },

    // 判断是否要去其它目的地
    judgeIsGoOtherDestination () {
      this.showIsGoOtherDestination = false;
      this.$dialog.confirm({
        message: '是否要去其它目的地?',
        closeOnPopstate: false,
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
      .then(() => {
        this.showIsGoOtherDestination = true;
        this.$router.push({'path':'/dispatchTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码')
      })
      .catch(() => {
        this.showIsGoOtherDestination = true;
        this.judgeIsGoDeparture()
      })
    },

    // 判断是否需要要回到出发地 0不回 1回
    judgeIsGoDeparture () {
      if (this.isBack == 1) {
        this.$router.push({'path':'/dispatchTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码')
      } else if (this.isBack == 0) {
        this.showIsGoOtherDestination = true;
        // 判断通过何种方式弹出是否是单一目的地弹框
        this.isPassGoDeparture = true;
        this.judgeIsSingleDestination()
      }
    },

    // 返回上一页
    backTo () {
      this.$router.push({'path':'/dispatchTaskSweepCode'});
      this.changeTitleTxt({tit:'扫码'});
      setStore('currentTitle','扫码')
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
    position: relative;
    font-size: 14px;
    .btn-area {
      width: 100%;
      position: absolute;
      bottom: 20px;
      left: 0;
      height: 80px;
      text-align: center;
      line-height: 80px;
      // span {
      //   .bottomButton;
      //   display: inline-block;
      //   margin-top: 15px;
      //   img {
      //     width: 100%;
      //     height: 100%
      //   }
      // }
    }
  }
</style>