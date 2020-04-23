import moment from 'moment'
/**
 * 格式化当前时间
*/
export const formatTime = (formatType) => {
  return moment(new Date().getTime()).format(formatType)
}

/**
 * 存储localStorage
*/
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
*/
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
*/
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

/** 
 * 存储当前历史记录点,实现控制手机物理返回键的按钮事件
*/
export const pushHistory = () => {
  let state = {
    title: '',
    url: ''
  }
  window.history.pushState(state, state.title, state.url)
}

/** 
 * 判断设备的操作系统环境
*/
export const IsPC = () => {
  let flag;
　let system = {
　　win: false,
　　mac: false,
　　xll: false,
　　ipad: false
  };
　//检测平台
　let p = navigator.platform;
  　　system.win = p.indexOf("Win") == 0;
  　　system.mac = p.indexOf("Mac") == 0;
  　　system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
  　　system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
　if (system.win || system.mac || system.xll || system.ipad) {
    flag = true
　} else {
    flag = false
　}
  return flag
}

/** 
 * 扫码枪绑定方法
*/
export const scanCode = (callback) => {
  var code = '';
  var lastTime, nextTime;
  var lastCode, nextCode;
  var that = this;
  window.document.onkeypress = function(event) {
    if (window.event) { // IE
        nextCode = event.key;
    } else if (event.which) { // Netscape/Firefox/Opera
        nextCode = event.which
    }
    if (event.which === 13) {
      if (code.length < 3) {// 手动输入的时间不会让code的长度大于2，所以这里只会对扫码枪有
          return
      }
      // code = decodeURIComponent(code);
      console.log('扫码结束: ' + code);
      callback(code);
      //TODO
      code = '';
      lastCode = '';
      lastTime = '';
      return
    }
    nextTime = new Date().getTime();
    if (!lastTime && !lastCode) {
      console.log('扫码开始。。。');
      code += event.key;
    }

    if (lastCode && lastTime && nextTime - lastTime > 500) { // 当扫码前有keypress事件时,防止首字缺失
      console.log('防止首字缺失。。。');
      code = event.key
    } else if (lastCode && lastTime) {
      console.log('扫码中。。。');
      code += event.key
    }
    lastCode = nextCode;
    lastTime = nextTime;
  }
}

/** 
 * 验证输入重量是否合法正则
*/
export const testWeight = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/ 

/** 
 * 扫码后从字典中取值
*/
export const Dictionary = (data, key) => {
  return data[key] ? data[key] : undefined
}

/** 
 * 判断数据是否为JSON类型
*/

export const judgeDataType = (data) => {
  var flag;
  if (typeof(data) == "object" && Object.prototype.toString.call(data) == "[object Object]" && !data.length) {
    flag = true
  } else {
    flag = false
  }
  return flag
}

/** 
 * 判断数组对象中每项某个key对应value是否相同
*/

export const judgeKeyEquail = (data,key) => {
  var flag = true;
  if (!(Object.prototype.toString.call(data) === '[object Array]')) {
    return
  };
  if (data.length > 0) {
    for (var i=1, len = data.length; i< len; i++) {
      var assignItem = data[0][key];
      if (data[i][key] !== assignItem) {
        flag = false;
        break
      }
    }
  } else {
    flag = true
  }
  return flag
}

/** 
 * 合并医废类型、重量、医废收集时间
*/

/* 医废类型 [] typeArr*/ 
/* 医废重量 [] weightArr*/ 
/* 收集时间 [] timeArr*/

export const dealMedicalWaste = (typeArr, weightArr, timeArr) => {
  const typeTarget = [];
  const weightTarget = [];
  const timeTarget = [];
  let index = 0;
  const indexMap = {};

  for (let i = 0, len = typeArr.length; i < len; i += 1) {
    const type = typeArr[i];
    let curTypeIndex = -1;
    if (type in indexMap) {
      curTypeIndex = indexMap[type]
    } else {
      curTypeIndex = indexMap[type] = index++;
      typeTarget[curTypeIndex] = type;
      weightTarget[curTypeIndex] = 0;
      timeTarget[curTypeIndex] = null
    };
    weightTarget[curTypeIndex] = weightTarget[curTypeIndex] + weightArr[i];
    timeTarget[curTypeIndex] = timeArr[i]
  };
  return [typeTarget, weightTarget, timeTarget]
}

/** 
 * 合并医废类型、重量
*/
/* 医废类型 [] wasteType*/ 
/* 医废重量 [] wasteWeight*/
export const dealMedicalWast = (wasteType,wasteWeight) => {
  let map = {};
  wasteType.forEach((value, index) => {
    Object.prototype.hasOwnProperty.call(map, value) || (map[value] = 0);
    map[value] += Number(wasteWeight[index]);
  });
  return map
}

// 数组去重
export const checkEmptyArray = (currentArr) => {
  var arr = [];
  currentArr.map(function(val, index) {
    //过滤规则为，不为空串、不为null、不为undefined，也可自行修改
    if (val !== "" && val != undefined) {
      arr.push(val);
    }
  });
  return arr;
}

// Base64编码转换图片
export const base64ImgtoFile = (dataurl, filename = 'file') => {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

// 引用类型数据深度克隆
export const deepClone = (obj) => {
  let newObj=Array.isArray(obj)?[]:{}
  if(obj&&typeof obj ==="object"){
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        newObj[key]=(obj && typeof obj[key]==='object')?deepClone(obj[key]):obj[key];
      }
    }
  }
  return newObj
}

// 根据标本id查询标本名称
export const querySampleName = (sampleArray,sampleId) => {
  if (!Array.isArray(sampleArray)) {return};
  let targetSmple = sampleArray.filter((item) => {
    return item.value == sampleId
  });
  return targetSmple[0].text
}

// 数组去重方法
export const repeArray = (targetArray) => {
  if (!Array.isArray(targetArray)) {return};
  var result = [],
  len = targetArray.length;
  targetArray.forEach(function(v, i ,targetArray){  //这里利用map，filter方法也可以实现
    var bool = targetArray.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
    if(bool === -1){
      result.push(v);
    }
    })
  return result;
}

 /**
 * 去除包裹的大括号
 */
export const removeBlock = (str) => {
  if (str) {
    let reg = /^\{/gi;
    let reg2 = /\}$/gi;
    str = str.replace(reg,"");
    str = str.replace(reg2,"");
    return str;
  } else {
    return str;
  }
}

/*
 * 生成UUID
 */

export const UUID = () => {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/*
 * 去除两个数组的相同值
 */
export const arrayDiff = (a, b) => { 
  for(let i=0; i<b.length; i++) { 
    for(let j=0; j<a.length; j++) { 
      if(a[j] == b[i]){ 
        a.splice(j,1); 
        j=j-1; 
      } 
    } 
  } 
    return a; 
  }

/*
 * 压缩图片方法
 */
export const compressImg = (originSite,callback) => {
  let image = new Image(); //新建一个img标签（还没嵌入DOM节点)
  image.src = originSite;
  image.onload = function() {
    let canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');
    let x = image.width/500;  //压缩倍数
    if (image.width > 500) {
      var imageWidth = image.width / x;   //压缩后图片的大小
      var imageHeight = image.height / x;
    } else {
      var imageWidth = image.width / 1;   //不进行压缩大小
      var imageHeight = image.height / 1;
    };
    let data = '';
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    context.drawImage(image, 0, 0, imageWidth, imageHeight);
    data = canvas.toDataURL('image/jpeg');
    callback(data)
  }
}