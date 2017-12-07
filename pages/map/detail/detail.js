// pages/map/detail/detail.js
Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({
      detail: wx.getStorageSync('detail')
    })
  }
})