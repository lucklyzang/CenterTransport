webpackJsonp([21],{K3di:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("HzJ8"),s=a.n(n),i=a("4YfN"),c=a.n(i),o=a("0eBz"),r=a("gh9j"),l=a("yl8L"),u=a("0DTB"),g=a("fFvN"),p=a("sqAx"),h=a("SJI6"),m=a("fdFc"),f=(a("M9A7"),{name:"circulationTaskConnectMessageSure",data:function(){return{leftDropdownDataList:["退出登录"],leftDownShow:!1,showSignature:!1,isDialogShow:!1,isClickCancelBtn:!1,showSignatureBox:!1,liIndex:null,manageSampleDataList:[],taskSurePng:a("WoXg"),taskCancelPng:a("faDW")}},components:{VanFieldSelectPicker:l.a,HeaderTop:o.a,NoData:p.a,FooterBottom:u.a,ElectronicSignature:r.a},mounted:function(){var t=this;Object(m.b)()||(pushHistory(),this.gotoURL(function(){pushHistory(),t.isDialogShow||t.loseDataInfo()})),this.echoConectMessage()},computed:c()({},Object(h.mapGetters)(["navTopTitle","originalSignature","currentElectronicSignature","circulationConnectMessageList","circulationTaskMessage","storeArriveDeparnmentId","storeAlreadyConnectSample","storeNoConnectSample","completeDeparnmentInfo","circulationTaskId","circulationDetails"]),{proId:function(){return JSON.parse(Object(m.l)("userInfo")).extendData.proId}}),methods:c()({},Object(h.mapMutations)(["changeTitleTxt","changeIsrefreshCirculationConnectPage","changeCirculationConnectMessageList","changeCompleteDeparnmentInfo","changeCurrentElectronicSignature","changeIsstoreAlreadyConnectSample","changeIsStoreNoConnectSample","changeIsFreshCirculationTaskPage"]),{leftLiCLick:function(t){this.liIndex=t,localStorage.clear(),this.$router.push({path:"/"})},loseDataInfo:function(){var t=this;this.isDialogShow=!1,this.showSignatureBox=!0,this.$dialog.alert({message:"返回上级后,将丢失本页数据!",closeOnPopstate:!1,showCancelButton:!0}).then(function(){t.changeCurrentElectronicSignature({DtMsg:null}),t.changeIsrefreshCirculationConnectPage(!1),t.$router.push({path:"/circulationTaskMessageConnect"}),t.changeTitleTxt({tit:"信息交接"}),Object(m.q)("currentTitle","信息交接"),t.isDialogShow=!0,t.showSignatureBox=!0}).catch(function(){t.isDialogShow=!1,t.showSignatureBox=!0})},rewrite:function(){this.$refs.mychild.overwrite()},skipMyInfo:function(){this.leftDownShow=!this.leftDownShow},controlSignatureEvent:function(){this.showSignature=!this.showSignature},echoConectMessage:function(){this.manageSampleDataList=Object(m.j)(this.circulationConnectMessageList)},backTo:function(){this.loseDataInfo()},connectSure:function(){this.$toast("交接成功"),this.manageSampleDataList=[],this.changeCurrentElectronicSignature({DtMsg:null}),this.changeCirculationConnectMessageList({DtMsg:[]}),Object(m.o)("currentCirculationConnectMessage"),this.$router.push({path:"/circulationDetails"}),this.changeTitleTxt({tit:"任务详情"}),Object(m.q)("currentTitle","任务详情")},connectCancel:function(){this.updateCirculationtaskState({proId:this.proId,id:this.circulationTaskId,state:7})},postSampleConnectMessage:function(t){var e=this;Object(g.D)(t).then(function(t){if(t&&200==t.data.code){var a;a=Object(m.j)(e.storeAlreadyConnectSample).concat(e.circulationConnectMessageList),e.changeIsstoreAlreadyConnectSample(a),e.changeCurrentElectronicSignature({DtMsg:null}),Object(m.o)("currentDepartmentId"),0==e.storeNoConnectSample.length&&1==e.circulationDetails.spaces.every(function(t){return t.check})?e.connectCancel():e.connectSure()}else e.$dialog.alert({message:t.data.msg,closeOnPopstate:!1}).then(function(){})}).catch(function(t){e.$dialog.alert({message:""+t.message,closeOnPopstate:!1}).then(function(){})})},updateCirculationtaskState:function(t){var e=this;Object(g.J)(t).then(function(t){if(t&&200==t.data.code){e.$toast("该条任务已完成"),e.manageSampleDataList=[],e.changeCurrentElectronicSignature({DtMsg:null}),e.changeCirculationConnectMessageList({DtMsg:[]});var a=Object(m.j)(e.completeDeparnmentInfo);a=a.filter(function(t){return t.taskId!=e.circulationTaskId}),e.changeCompleteDeparnmentInfo({DtMsg:a}),Object(m.q)("completeDepartmentMessage",{sureInfo:a}),e.changeIsStoreNoConnectSample([]),e.changeIsstoreAlreadyConnectSample([]),Object(m.o)("currentCirculationConnectMessage"),e.$router.push({path:"/circulationTask"}),e.changeTitleTxt({tit:"循环任务"}),Object(m.q)("currentTitle","循环任务"),e.changeIsFreshCirculationTaskPage(!0)}else e.$dialog.alert({message:""+t.data.data,closeOnPopstate:!1}).then(function(){})}).catch(function(t){e.$dialog.alert({message:""+t.message,closeOnPopstate:!1}).then(function(){})})},connectMessageSure:function(){var t=[],e=!0,a=!1,n=void 0;try{for(var i,c=s()(this.manageSampleDataList);!(e=(i=c.next()).done);e=!0){var o=i.value;for(var r in o)if("sampleList"==r){var l=!0,u=!1,g=void 0;try{for(var p,h=s()(o.sampleList);!(l=(p=h.next()).done);l=!0){var m=p.value;for(var f in m)"id"==f&&t.push(m[f])}}catch(t){u=!0,g=t}finally{try{!l&&h.return&&h.return()}finally{if(u)throw g}}}}}catch(t){a=!0,n=t}finally{try{!e&&c.return&&c.return()}finally{if(a)throw n}}this.postSampleConnectMessage({proId:this.proId,departmentId:this.storeArriveDeparnmentId,singImg:"",ids:t})},connectMessageCancel:function(){var t=this;this.$dialog.alert({message:"返回上页后,将丢失本页数据!",closeOnPopstate:!1,showCancelButton:!0}).then(function(){t.changeCurrentElectronicSignature({DtMsg:null}),t.changeCirculationConnectMessageList({DtMsg:[]}),t.changeIsrefreshCirculationConnectPage(!1),t.$router.push({path:"/circulationTaskMessageConnect"}),t.changeTitleTxt({tit:"信息交接"}),Object(m.q)("currentTitle","信息交接")}).catch(function(){})}})}),C={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content-wrapper"},[a("HeaderTop",{attrs:{title:t.navTopTitle}},[a("van-icon",{attrs:{slot:"left",name:"arrow-left"},on:{click:t.backTo},slot:"left"})],1),t._v(" "),a("ul",{directives:[{name:"show",rawName:"v-show",value:t.leftDownShow,expression:"leftDownShow"}],staticClass:"left-dropDown"},t._l(t.leftDropdownDataList,function(e,n){return a("li",{key:n,class:{liStyle:t.liIndex==n},on:{click:function(e){return t.leftLiCLick(n)}}},[t._v(t._s(e))])}),0),t._v(" "),t._m(0),t._v(" "),a("div",{staticClass:"sweep-code-area"},t._l(t.manageSampleDataList,function(e,n){return a("div",{key:e+"-"+n,staticClass:"sample-type-list"},[a("div",{staticClass:"sample-type-title-wrapper"},[a("div",{staticClass:"sample-type-title"},[t._v(t._s(e.sampleTypeName))]),t._v(" "),a("div",{staticClass:"sample-type-total"},[t._v(t._s(e.sampleTotal))])]),t._v(" "),a("div",{staticClass:"sample-type-message-wrapper"},t._l(e.sampleList,function(e,n){return a("div",{key:e+"-"+n,staticClass:"sample-type-message-list"},[a("div",{staticClass:"sample-type-message-list-inner-erapper"},[a("p",[a("span",{staticClass:"message-tit"},[t._v("科室:")]),t._v(" "),a("span",{staticClass:"message-tit-real"},[t._v(t._s(e.spaceName))])]),t._v(" "),a("P",[a("span",{staticClass:"message-tit"},[t._v("收集时间:")]),t._v(" "),a("span",{staticClass:"message-tit-real"},[t._v(t._s(e.collectionTime))])])],1),t._v(" "),a("div",{staticClass:"sample-type-message-list-inner-erapper"},[a("p",[a("span",{staticClass:"message-tit"},[t._v("病人姓名:")]),t._v(" "),a("span",{staticClass:"message-tit-real"},[t._v(t._s(e.patientName))])]),t._v(" "),a("P",[a("span",{staticClass:"message-tit"},[t._v("病人床号:")]),t._v(" "),a("span",{staticClass:"message-tit-real"},[t._v(t._s(e.bedNumber))])])],1),t._v(" "),a("div",{staticClass:"sample-type-message-list-inner-erapper"},[a("p",[a("span",{staticClass:"message-tit"},[t._v("标本数量:")]),t._v(" "),a("span",{staticClass:"message-tit-real"},[t._v(t._s(e.quantity))])])])])}),0)])}),0),t._v(" "),t.showSignature?a("div",{staticClass:"electronic-signature"},[a("ElectronicSignature",{ref:"mychild"})],1):t._e(),t._v(" "),t.showSignature?a("div",{staticClass:"rewrite-box"},[a("span",{on:{click:t.rewrite}},[t._v("重写")])]):t._e(),t._v(" "),a("div",{staticClass:"btn-area"},[a("span",[a("img",{attrs:{src:t.taskSurePng,alt:""},on:{click:t.connectMessageSure}})]),t._v(" "),a("span",[a("img",{attrs:{src:t.taskCancelPng,alt:""},on:{click:t.connectMessageCancel}})])])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"sweep-code-title"},[e("h3",[this._v("交接信息确认")])])}]};var d=a("C7Lr")(f,C,!1,function(t){a("iVl/")},"data-v-2f6faf21",null);e.default=d.exports},"iVl/":function(t,e){}});