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
              wx.redirectTo({
                url: '/pages/group/group'
              })
            }
          })
        }
      }
    })
  }
})