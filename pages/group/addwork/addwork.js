// pages/group/addwork/addwork.js
Page({
  data: {
  },
  onLoad: function (options) {
  
  },
  //添加近期工作
  addwork(e){
    let data = e.detail.value;
    data.orgID = wx.getStorageSync('userInfo').orgID;
    data.workCreateDate = new Date();
    getApp().$ajax({
      httpUrl: getApp().api.addWorkUrl,
      data: data
    }).then(({ data }) => {
      wx.showToast({
        title: '添加成功',
        success: (res) => {
          wx.navigateBack({
            delta: 2
          })
        }
      })
    })
  }
})