const allOSS = require('ali-oss');
class DockingOSS {
  //  ali-oss 实例
  private allOSS;
  private parallel;
  private partSize;
  private defaultName;
  private path;
  private length;

  constructor(data){
    let {region,
      accessKeyId,
      accessKeySecret,
      bucket,
      secure = true,
      parallel = 3,
      partSize = 1024 * 1024,
      defaultName = false,
      path = "",
      length = 50} = data;
    this.partSize = partSize;
    this.parallel = parallel;
    this.defaultName = defaultName;
    this.path = path;
    this.length = length;
    //  实例化ali-oss
    this.allOSS = new AliOss({region,accessKeyId,accessKeySecret,bucket,secure});
  }
}
