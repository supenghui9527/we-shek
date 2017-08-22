// pages/databases/addmember/addmember.js
Page({
  data: {
    showErr:false
  },
  onLoad: function (options) {
    //计算当前时间
    let date = new Date(), ctx = this, month = date.getMonth() + 1;
    this.setData({
      orgID: wx.getStorageSync('userID'),
      date: date.getFullYear() + '-' + month + '-' + date.getDate()
    })
  },
  //选择发帖日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //保存党员信息
  onSave(e) {
    let data = e.detail.value;
    if (data.username=='' || data.idNum ==''|| data.joinDate==''){
      this.setData({
        showErr:true
      })
      setTimeout(()=>{
        this.setData({
          showErr: false
        })
      },1000)
      return false;
    }
    //提交添加党员信息
    wx.showLoading({
      title: '添加中...',
      mask:true
    })
    wx.request({
      url: getApp().globalData.domain + 'addDangYuan.do',
      method: 'post',
      data: data = e.detail.value,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res) => {
        if (res.data.state == 1) {
          wx.hideLoading();
          wx.removeStorageSync('groups');
          wx.setStorageSync('isLoad', true);
          wx.navigateBack({
            delta: 1
          })
        }else if(res.data.state == 0){
          wx.showToast({
            title: res.data.message,
            image: '/images/about.png'
          })
        }
      }
    })
  }
})