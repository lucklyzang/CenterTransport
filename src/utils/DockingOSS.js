const allOSS = require('ali-oss');
class DockingOSS {
  //  ali-oss 实例
  private allOSS;
  private parallel;
  private partSize;
  private defaultName;
  private path;
  private length;

  constructor(data) {
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

  //  获取路径
  private accessPath(fileName) {
    const {path} = this;
    return path?`${path}/${fileName}`:fileName;
  }

  //  获取名称
  private getFileName(file) {
    let {defaultName} = this;
    const fileName:string = file.name;
    if(defaultName) return fileName;
    return this.randomFileName();
  }

  //  随机文件名称
  private randomFileName() {
    const data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F",
      "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y",
      "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r",
      "s", "t", "u", "v", "w", "x", "y", "z"];
    let nums = "";
    const {length} = this;
    for (let i = 0; i < length; i++) {
      const randomStr:string = (Math.random()*61).toString()
      const r:number = parseInt(randomStr, 10);
      nums += (data[r]).toString();
    }
    return nums;
  }

  /**
   * 普通上传
   * file:文件对象
   * _fileName：固定文件名称
   */
  public upload(file_fileName = "") {
    let fileName = _fileName;
    (!fileName) && (fileName = this.getFileName(file));
    const pathName = this.accessPath(fileName);
    return this.allOSS.put(pathName, file)
  }

  /**
   * 分片上传
   * file:文件对象
   * _fileName：固定文件名称
   * progress：分片上传进度回调函数
   */
  public multipartUpload(file, progress ,_fileName) {
    const {parallel,partSize} = this;
    let fileName = _fileName;
    (!fileName) && (fileName = this.getFileName(file));
    const pathName = this.accessPath(fileName);
    return this.allOSS.multipartUpload(pathName, file, {
      parallel,
      partSize,
      progress
    })
  }

  //  中止上传
  public cancel() {
    this.allOSS.cancel();
  }

  /**
   * 分片续传
   * checkpoint:中断上传的文件
   * progress：进度回调函数
   */
  public resume(checkpoint, progress) {
    const { uploadId, file } = checkpoint;
    const {parallel,partSize,path} = this;
    return this.allOSS.multipartUpload(uploadId, file, {
      parallel,
      partSize,
      progress,
      checkpoint
    })
  }

}
