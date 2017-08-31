// publishOne.js
Page({
  data: {
    tempFilePaths: [],
    meetingTime: 0,
    posttype: 0,
    userID: 0,
    meettype:0,
    type: ['党课', '支委会', '党员大会', '党小组会']
  },
  onLoad: function (options) {
    // 计算当前日期
    let date = new Date(),ctx = this,month = date.getMonth() + 1;
    wx.getStorage({
      key: 'userID',
      success: function (res) {
        ctx.setData({
          userID: res.data,
          date: date.getFullYear() + '-' + month + '-' + date.getDate(),
          posttype: options.posttype
        });
      }
    })
  },
  //选择本地相册中的图片
  upLoad() {
    let ctx = this;
    wx.chooseImage({
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        if (ctx.data.tempFilePaths==''){
          ctx.setData({
            tempFilePaths: tempFilePaths
          })
        }else{
          ctx.setData({
            tempFilePaths: ctx.data.tempFilePaths.concat(tempFilePaths)
          })
        }
      }
    })
  },
  //帖子类型选中
  chose(e) {
    let obj = e.currentTarget.dataset;
    this.setData({
      meettype: obj.index
    });
  },
  //选择发帖日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //上传图片方法
  getData: function (tempFilePaths,successUp,failUp,i,length,cid) {
    let ctx = this;
    wx.uploadFile({
      url: getApp().globalData.domain + 'publicPic.do',
      header: { "Content-Type": "multipart/form-data" }, 
      filePath: tempFilePaths[i],
      name: 'picName',
      formData:{
        cID:cid
      },
      success: (resp) => {
        successUp++;
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          // console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
          wx.hideLoading();
          wx.redirectTo({
            url: '/pages/home/home'
          })
        }
        else {  
          this.getData(tempFilePaths, successUp, failUp, i, length,cid);
        }
      },
    })
  },
  //发布帖子
  save(e) {
    let successUp = 0, //成功个数
    failUp = 0, //失败个数
    length = this.data.tempFilePaths.length, //总共个数
    i = 0, //第几个
    data = e.detail.value;
    wx.showLoading({
      title: '发帖中...',
      mask: true
    });
    wx.request({
      url: getApp().globalData.domain + 'publicCommunity.do',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" }, 
      data:data,
      success: (res)=>{
        if (res.data.state == 1) {
          if (length){
            this.getData(this.data.tempFilePaths, successUp, failUp, i, length, res.data.data);
          }else{
            wx.navigateTo({
              url: '/pages/home/home'
            })
          }
        } else {
        }
      }
    })
  },
  //删除预览图片
  delPictrue(e){
    let idx = e.currentTarget.dataset.index, tempFilePaths = this.data.tempFilePaths;
    tempFilePaths.splice(idx, 1);
    this.setData({
      tempFilePaths: tempFilePaths
    })
  }
})