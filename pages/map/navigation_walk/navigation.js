// pages/map/navigation_walk/navigation.js
let amapFile = require('../../../utils/amap-wx.js'), myAmapFun;
Page({
  data: {
    distance: '',
    cost: '',
    polyline: []
  },
  onLoad: function (options) {
    var that = this;
    // var key = config.Config.key;
    myAmapFun = new amapFile.AMapWX({key: 'cd8a5c0aca6d10ef29ecd7599e9173d5'});
    myAmapFun.getWalkingRoute({
      origin: `${options.centerX},${options.centerY}`,
      destination: `${options.longitude},${options.latitude}`,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        console.log(points)
        that.setData({
          centerX: options.centerX,
          centerY: options.centerY,
          polyline: [{
            points: points,
            color: "#f00",
            width: 10
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: `距您${(data.paths[0].distance / 1000).toFixed(2)}公里`
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }

      },
      fail: function (info) {

      }
    })
  },
  goDetail: function () {
    wx.navigateTo({
      url: '../navigation_walk_detail/navigation'
    })
  },
  goToCar: function (e) {
    wx.redirectTo({
      url: '../navigation_car/navigation'
    })
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    wx.redirectTo({
      url: '../navigation_ride/navigation'
    })
  },
  goToWalk: function (e) {
    wx.redirectTo({
      url: '../navigation_walk/navigation'
    })
  }
})