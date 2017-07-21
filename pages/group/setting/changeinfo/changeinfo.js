// pages/group/setting/changeinfo/changeinfo.js
Page({
  data: {
  },
  onLoad: function (options) {
    // 修改党组织信息获取党组织原来的信息
    this.setData({
      orgName: wx.getStorageSync('orgName'),
      contactTel: wx.getStorageSync('contactTel'),
      contactName: wx.getStorageSync('contactName'),
      orgID: wx.getStorageSync('userID'),
      secretary: wx.getStorageSync('secretary'),
      secretaryTel: wx.getStorageSync('secretaryTel'),
      contactPosition: wx.getStorageSync('contactPosition'),
    })
  },
  //保存党组织信息
  onSave(e){
    let data = e.detail.value;
    wx.request({
      url: getApp().globalData.domain + 'modifyOrg.do',
      method: 'post',
      data: data,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res) => {
        if (res.data.state == 1) {
          wx.showToast({
            title: res.data.message,
            mask: true,
            success: (res) => {
              wx.navigateTo({
                url: '/pages/group/group'
              })
            }
          })
        }
      }
    })
  }
})