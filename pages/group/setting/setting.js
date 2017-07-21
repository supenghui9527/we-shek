// pages/group/setting/setting.js
Page({
  data: {
  },

  onLoad: function (options) {
  },
  //跳转到设置党组织信息
  set(){
    wx.navigateTo({
      url: './changeinfo/changeinfo'
    })
  },
  //跳转到更改密码页面
  goSetpwd(){
    wx.navigateTo({
      url: './changepwd/changepwd'
    })
  },
  //退出帐号
  signOut(){
    wx.clearStorage();
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }
})