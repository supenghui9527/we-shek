// pages/group/setting/setting.js
Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({
      datas: options
    })
  },
  //跳转到设置党组织信息
  setinfo() {
    let data = this.data.datas;
    wx.navigateTo({
      url: `./changeinfo/changeinfo?contactName=${data.contactName}&contactTel=${data.contactTel}&orgName=${data.orgName}&orgNumber=${data.orgNumber}&secretary=${data.secretary}&contactPosition=${data.contactPosition}&secretaryTel=${data.secretaryTel}`
    })
  },
  //跳转到更改密码页面
  goSetpwd() {
    wx.navigateTo({
      url: './changepwd/changepwd'
    })
  },
  //退出帐号
  signOut() {
    wx.clearStorage();
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }
})