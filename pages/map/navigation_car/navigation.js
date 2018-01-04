// pages/map//navigation_car/navigation.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  goToCar: function (e) {
    wx.navigateTo({
      url: '../navigation_car/navigation'
    })
  },
  goToBus: function (e) {
    wx.navigateTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    wx.navigateTo({
      url: '../navigation_ride/navigation'
    })
  },
  goToWalk: function (e) {
    wx.navigateTo({
      url: '../navigation_walk/navigation'
    })
  }
})