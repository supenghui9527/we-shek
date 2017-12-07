// login.js
let utilMd5 = require('../../utils/md5.js');
Page({
  data: {
  },
  onLoad: function (options) {
  },
  //获取用户名
  getUser(e) {
    this.setData({
      user: e.detail.value
    })
  },
  //获取用户密码
  getPwd(e) {
    let pwd = utilMd5.hexMD5(e.detail.value);
    this.setData({
      pwd: pwd
    })
  },
  //点击登录
  onLogin() {
    getApp().$ajax({
      wxApp: this,
      httpUrl: getApp().api.loginUrl,
      data: {
        orgNumber: this.data.user,
        password: this.data.pwd
      },
      title:'登陆中...'
    }).then(({ data }) => {
      wx.hideLoading();
      wx.setStorageSync('userInfo', data)
      wx.redirectTo({ //登录成功跳转到首页
        url: '/pages/home/home',
      })
    })
  }
})