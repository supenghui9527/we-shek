// pages/group/setting/changepwd/changepwd.js
let utilMd5 = require('../../../../utils/md5.js');
Page({
  data: {
    showErr:false
  },
  onLoad: function (options) {
    this.setData({
      orgNumber: wx.getStorageSync('orgNumber')
    })
  },
  //新密码一次
  one(e){
    let one = e.detail.value;
    this.setData({
      one:one
    })
  },
  //新密码两次
  two(e) {
    let two = e.detail.value;
    this.setData({
      two: two
    })
  },
  // 修改密码
  changepwd(e){
    let data = e.detail.value;
    data.oldPassword = utilMd5.hexMD5(data.oldPassword);
    data.newPassword = utilMd5.hexMD5(data.newPassword);
    if(this.data.one!=this.data.two){
      this.setData({
        showErr:true
      })
      return false;
    }
    wx.request({
      url: getApp().globalData.domain + 'modifyPassword.do',
      method: 'post',
      data: data,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res) => {
        if (res.data.state == 1) {
          wx.showToast({
            title: res.data.message,
            mask:true,
            success:(res)=>{
              wx.navigateBack({
                delta:2
              })
            }
          })
        }
      }
    })
  }
})