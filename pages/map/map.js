// pages/map/map.js
let amapFile = require('../../utils/amap-wx.js'), myAmapFun;
Page({
  data: {
    centerX: '',
    centerY: '',
    markers: [],
    detail: {},
    polyline: [],
    controls: [],
    showDetail: false //是否显示详情入口
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
    myAmapFun = new amapFile.AMapWX({ key: 'cd8a5c0aca6d10ef29ecd7599e9173d5' });
    let systemInfo_ = wx.getSystemInfoSync();
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        let marker = this.createMarker(res);
        this.setData({
          centerX: longitude,
          centerY: latitude,
          markers: this.getMarkers(),
          controls: [{
            id: 1,
            iconPath: '/images/route.png',
            position: {
              left: systemInfo_.screenWidth - 60,
              top: systemInfo_.windowHeight - systemInfo_.windowHeight * 0.28,
              width: 50,
              height: 50
            },
            clickable: true
          }]
        })
      }
    });
  },
  // 获取所有marker的信息
  getMarkers(){
    wx.request({
      url: getApp().globalData.domain + 'findAllPosition.do',
      method: 'get',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          let markers = [];
          for (let item of res.data.data) {
            let marker = this.createMarker(item);
            markers.push(marker)
          }
          // return markers;
          this.setData({
            markers: markers
          })
        }
      }
    })
  },
  // 创建地图的marker
  createMarker(point) {
    let latitude = point.lat;
    let longitude = point.lng;
    let marker = {
      iconPath: "/images/color1.png",
      id: point.id || 0,
      name: point.orgName || '',
      latitude: latitude,
      longitude: longitude,
      width: 21.5,
      height: 30
    };
    if (point.positionType==1){
      marker.iconPath = "/images/color5.png"
    } else if (point.positionType == 2){
      marker.iconPath = "/images/color3.png"
    } else if (point.positionType == 3){
      marker.iconPath = "/images/color1.png"
    } else if (point.positionType == 4){
      marker.iconPath = "/images/color6.png"
    } else if (point.positionType == 5){
      marker.iconPath = "/images/color2.png"
    }else{
      marker.iconPath = "/images/color4.png"
    }
    return marker;
  },
  regionchange(e) {
    console.log(e.type)
  },
  // 点击marker点
  markertap(e) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    wx.request({
      url: getApp().globalData.domain + 'findPositionDetail.do',
      method: 'get',
      data: {
        positionID: e.markerId
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          wx.hideLoading();
          this.setData({
            showDetail: true,
            detail: res.data.data
          });
          wx.setStorageSync('detail', res.data.data);
          myAmapFun.getDrivingRoute({
            origin: `${this.data.centerX},${this.data.centerY}`,
            destination: `${res.data.data.lng},${res.data.data.lat}`,
            success: (data) => {
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
              this.setData({
                polyline: [{
                  points: points,
                  color: "#0091ff",
                  width: 6
                }]
              });
              if (data.paths[0] && data.paths[0].distance) {
                this.setData({
                  distance: `距您${(data.paths[0].distance/1000).toFixed(2)}公里`
                });
              }
              if (data.taxi_cost) {
                this.setData({
                  cost: '打车约' + parseInt(data.taxi_cost) + '元'
                });
              }

            },
            fail: function (info) {

            }
          });
        }
      }
    })
  },
  // 点击导航
  goNavigate(){
    let detail = wx.getStorageSync('detail');
    wx.openLocation({
      latitude: detail.lat*1,
      longitude: detail.lng*1,
      scale: 18,
      name: detail.employer,
      address: detail.positionAddress
    })
  },
  // 地图控件
  controltap(e) {
    let detail = wx.getStorageSync('detail');
    wx.openLocation({
      latitude: detail.lat * 1,
      longitude: detail.lng * 1,
      scale: 18,
      name: detail.employer,
      address: detail.positionAddress
    })
  },
  // 详情
  goDetail(){
    wx.navigateTo({
      url: `./detail/detail`,
    })
  }
})