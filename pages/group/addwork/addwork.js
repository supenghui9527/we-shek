// pages/group/addwork/addwork.js
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  //添加近期工作
  addwork(e){
    let data = e.detail.value;
    data.orgID = wx.getStorageSync('userID');
    data.workCreateDate = new Date();
    wx.request({
      url: getApp().globalData.domain + 'addWork.do',
      method: 'post',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.state == 1) {
          wx.showToast({
            title: '添加成功',
            success: (res) => {
              wx.redirectTo({
                url: '../mywork/mywork'
              })
            }
          })
        }
      }
    })
  }
})