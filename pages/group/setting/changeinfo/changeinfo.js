// pages/group/setting/changeinfo/changeinfo.js
Page({
  data: {
  },
  onLoad: function (options) {
    // 修改党组织信息获取党组织原来的信息
    this.setData({
      orgName: options.orgName,
      contactTel: options.contactTel,
      contactName: options.contactName,
      orgID: wx.getStorageSync('userID'),
      secretary: options.secretary,
      secretaryTel: options.secretaryTel,
      contactPosition: options.contactPosition,
    })
  },
  //保存党组织信息
  onSave(e){
    let data = e.detail.value;
    getApp().$ajax({
      httpUrl: getApp().api.saveUserInfoUrl,
      data: data
    }).then(({data,message})=>{
      wx.showToast({
        title: message,
        mask: true,
        success: (res) => {
          wx.navigateBack({
            delta: 2
          })
        }
      })
    })
  }
})