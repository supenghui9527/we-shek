//app.js
const util = require('./utils/util.js');
const api = require('./store/api');
const common = require('./store/modules/common');
App({
  onLaunch: function () {
    //判断本地是否存有密码
    if (wx.getStorageSync('userInfo')) {
      wx.redirectTo({
        url: '/pages/home/home'
      })
    }
  },
  api,
  modules:{
    common
  },
  onHide: function () {
    wx.removeStorageSync('groups');
    wx.removeStorageSync('list');
  },
  showBigPic: util.showBigPic, //点击图片浏览大图
  $ajax: util.fnHttp,// 公用请求方法
  globalData:{
    userInfo:null,
    host:'http://www.wsspha.cn/images'
  }
})