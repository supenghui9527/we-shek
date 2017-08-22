// pages/databases/member/edit/edit.js
Page({
  data: {
  
  },
  onLoad: function (options) {
    //党员信息默认值
    this.setData({
      userName: options.username,
      position: options.position == 'null' ? '' : options.position,
      gender: options.gender,
      joindate: options.joindate,
      tel: options.tel,
      idNum: options.idNum,
      userID: options.userID
    })
  },
  onReady: function () {
  
  },
  //保存党员信息
  onSave(e){
    let data = e.detail.value;
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    wx.request({
      url: getApp().globalData.domain + 'modifyDangYuan.do',
      method: 'post',
      data: data,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res) => {
        if(res.data.state==1){
          wx.hideLoading();
          wx.removeStorageSync('groups');
          wx.setStorageSync('isLoad', true);
          wx.navigateBack({
            delta:2
          })
        }else{
          wx.showToast({
            title: '保存失败'
          })
        }
      }
    })
  }
})