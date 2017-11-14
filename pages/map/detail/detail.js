// pages/map/detail/detail.js
Page({
  data: {
  
  },
  onLoad: function (options) {
    console.log(wx.getStorageSync('detail'))
    this.setData({
      detail: wx.getStorageSync('detail')
    })
  }
})