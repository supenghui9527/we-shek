// login.js
let utilMd5 = require('../../utils/md5.js');
Page({
  data: {
  },
  onLoad: function (options) {
    //判断本地是否存有密码
    if (wx.getStorageSync('accessToken')){
      wx.redirectTo({
        url: '/pages/home/home'
      })
    }
  },
  //获取用户名
  getUser(e){
    this.setData({
      user: e.detail.value
    })
  },
  //获取用户密码
  getPwd(e){
    let pwd = utilMd5.hexMD5(e.detail.value);
    this.setData({
      pwd: pwd
    })
  },
  //点击登录
  onLogin(){
    let ctx = this;
    wx.request({
      url: getApp().globalData.domain+'login.do',
      method:'get',
      data: {
        orgNumber:this.data.user,
        password:this.data.pwd
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let datas = res.data.data;
        if (res.data.state==1){
          wx.setStorage({//存储党组织id
            key: "userID",
            data: datas.orgID
          });
          wx.setStorage({
            key: "orgName",//存储党组织名称
            data: datas.orgName
          });
          wx.setStorage({
            key: "higherOrgID",//存储上级ID
            data: datas.higherOrgID
          });
          wx.setStorage({
            key: "accessToken",//存储密码
            data: datas.accessToken
          });
          wx.redirectTo({//登录成功跳转到首页
            url: '/pages/home/home'
          })
        } else{
          ctx.setData({//登录失败提示错误信息
            err: res.data.message
          })
        }
      }
    })
  }
})