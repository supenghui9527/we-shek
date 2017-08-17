//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //判断本地是否存有密码
    if (wx.getStorageSync('accessToken')) {
      wx.redirectTo({
        url: '/pages/home/home'
      })
    }
  },
  onHide: function () {
    setTimeout(()=>{
      wx.removeStorageSync('groups');
    },300000);
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //服务器地https://www.jshhfl.com/xwdj/'http://192.168.8.81:8183/xwdj/'
  globalData:{
    userInfo:null,
    host:'http://www.wsspha.cn/images',
    domain: 'https://www.jshhfl.com/xwdj/'
  }
})