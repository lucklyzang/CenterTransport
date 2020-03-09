<template>
  <section class="signature">
    <div class="signatureBox">
      <div class="canvasBox" ref="canvasHW" :currentSinnatureData="signNatureData">
        <canvas ref="canvasF" 
          @touchstart='touchStart' 
          @touchmove='touchMove' 
          @touchend='touchEnd' 
          @mousedown="mouseDown" 
          @mousemove="mouseMove"
          @mouseup="mouseUp"
        >
        </canvas>
        <div class="btnBox">
          <div @click="overwrite">重写</div>
          <div @click="commitSure">确认签名</div>
        </div>   
      </div>
    </div>
  </section> 
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        stageInfo:'',
        signNatureData:'',
        imgUrl:'',
        client: {},
        points: [],
        canvasTxt: null,
        startX: 0,
        startY: 0,
        moveY: 0,
        moveX: 0,
        endY: 0,
        endX: 0,
        w: null,
        h: null,
        isDown: false,
        // isViewAutograph: this.$route.query.isViews > 0,
        // contractSuccess: this.$route.query.contractSuccess
      }
    },
    mounted() {
      let canvas = this.$refs.canvasF
      canvas.height = this.$refs.canvasHW.offsetHeight - 500
      canvas.width = this.$refs.canvasHW.offsetWidth - 50
      this.canvasTxt = canvas.getContext('2d')
      this.stageInfo = canvas.getBoundingClientRect()
    },
    methods: {
      ...mapMutations([
        'changeCurrentElectronicSignature'
      ]),
      //mobile
      touchStart(ev) {
        ev = ev || event
        ev.preventDefault()
        if (ev.touches.length == 1) {
          let obj = {
            x: ev.targetTouches[0].clientX,
            y: ev.targetTouches[0].clientY,
          }
          this.startX = obj.x
          this.startY = obj.y
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
        }
      },
      touchMove(ev) {
        ev = ev || event
        ev.preventDefault()
        if (ev.touches.length == 1) {
          let obj = {
            x: ev.targetTouches[0].clientX - this.stageInfo.left,
            y: ev.targetTouches[0].clientY - this.stageInfo.top
          }
          this.moveY = obj.y
          this.moveX = obj.x
          this.canvasTxt.beginPath()
        //   strokeStyle = 'blue';
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.startY = obj.y
          this.startX = obj.x
          this.points.push(obj)
        }
      },
      touchEnd(ev) {
        ev = ev || event
        ev.preventDefault()
        if (ev.touches.length == 1) {
          let obj = {
            x: ev.targetTouches[0].clientX - this.stageInfo.left,
            y: ev.targetTouches[0].clientY - this.stageInfo.top
          }
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
        }
      },
      //pc
      mouseDown(ev) {
        ev = ev || event
        ev.preventDefault()
        if (1) {
          let obj = {
            x: ev.offsetX,
            y: ev.offsetY
          }
          this.startX = obj.x
          this.startY = obj.y
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
          this.isDown = true
        }
      },
      mouseMove(ev) {
        ev = ev || event
        ev.preventDefault()
        if (this.isDown) {
          let obj = {
            x: ev.offsetX,
            y: ev.offsetY
          }
          this.moveY = obj.y
          this.moveX = obj.x
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.startY = obj.y
          this.startX = obj.x
          this.points.push(obj)
        }
      },
      mouseUp(ev) {
        ev = ev || event
        ev.preventDefault()
        if (1) {
          let obj = {
            x: ev.offsetX,
            y: ev.offsetY
          }
          this.canvasTxt.beginPath()
          this.canvasTxt.moveTo(this.startX, this.startY)
          this.canvasTxt.lineTo(obj.x, obj.y)
          this.canvasTxt.stroke()
          this.canvasTxt.closePath()
          this.points.push(obj)
          this.points.push({x: -1, y: -1})
          this.isDown = false
        }
      },
      //重写
      overwrite() {
        this.canvasTxt.clearRect(0, 0, this.$refs.canvasF.width, this.$refs.canvasF.height);
        this.changeCurrentElectronicSignature({DtMsg: null})
        this.points = []
      },
      //确认签名
      commitSure() {
        this.imgUrl = this.$refs.canvasF.toDataURL();
        this.signNatureData = this.$refs.canvasF.toDataURL();
        this.changeCurrentElectronicSignature({DtMsg:this.$refs.canvasF.toDataURL("image/png")})
        console.log(this.$refs.canvasF.toDataURL())
      }
    }
  }
</script>
<style scoped>
  .signatureBox {
    width: 100%;
    height: calc(100% - 50px);
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }
  .canvasBox {
    box-sizing: border-box;
    flex: 1;
  }
  canvas {
    border: 1px solid #7d7d7d;
  }
  .btnBox {
    padding: 10px;
    text-align: center;
  }
  .btnBox > div {
    display: inline-block
  }
  .btnBox button:first-of-type {
    background: transparent;
    border-radius: 4px;
    height: 40px;
    width: 80px;
    font-size: 14px;
  }
  .btnBox button:last-of-type {
    background: #71b900;
    color: #fff;
    border-radius: 4px;
    height: 40px;
    width: 80px;
    font-size: 14px;
  }
</style>