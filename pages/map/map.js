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
    showDetail: false, //是否显示详情入口
    active: null
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
    myAmapFun = new amapFile.AMapWX({ key: 'cd8a5c0aca6d10ef29ecd7599e9173d5' });
    let systemInfo_ = wx.getSystemInfoSync();
    this.getOrgLists(0);
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        let marker = this.createMarker(res);
        this.setData({
          centerX: longitude,
          centerY: latitude,
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
  // 获取所有活动列表
  getOrgLists(itemIndex, showPosition) {
    getApp().$ajax({
      httpUrl: getApp().api.getAllOrgNameUrl
    }).then(({ data }) => {
      let newLists = [],datas = data;
      datas.filter((item, index) => {
        if (showPosition) {
          if (item !== showPosition) newLists.push(item)
        } else {
          if (index !== itemIndex) newLists.push(item)
        }
      })
      this.setData({
        oldLists: datas,
        positionLists: newLists,
        showPosition: showPosition || datas[0]
      })
      getApp().$ajax({
        httpUrl: getApp().api.getMapMarkesUrl,
        data: {
          orgName: showPosition || datas[0]
        },
        method:'get'
      }).then(({ data }) => {
        let markers = [];
        data.map(item => {
          item.show = false;
          for (let i of item.positionList) {
            let marker = this.createMarker(i);
            markers.push(marker)
          }
        })
        this.setData({
          markers: markers,
          detailList: data
        })
      })
      wx.hideLoading();
    })
  },
  showList() {
    this.setData({
      showLists: !this.data.showLists
    })
  },
  // 显示活动类型的子列表
  showItems(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      active: this.data.active != index ? index : null
    })
  },
  // 筛选选中的位置活动
  selectPosition(e) {
    this.setData({
      showLists: false
    })
    this.getOrgLists(e.target.dataset.index, e.target.dataset.item)
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
      width: 18,
      height: 29
    };
    if (point.positionType == 1) {
      marker.iconPath = "/images/l1.png"
    } else if (point.positionType == 2) {
      marker.iconPath = "/images/l2.png"
    } else if (point.positionType == 3) {
      marker.iconPath = "/images/l3.png"
    } else if (point.positionType == 4) {
      marker.iconPath = "/images/l4.png"
    } else if (point.positionType == 5) {
      marker.iconPath = "/images/l5.png"
    } else {
      marker.iconPath = "/images/l6.png"
    }
    return marker;
  },
  regionchange(e) {
    console.log(e.type)
  },
  // 点击marker点
  markertap(e) {
    wx.setStorageSync('position', {
      centerX: this.data.centerX,
      centerY: this.data.centerY
    })
    let centerX = this.data.centerX, centerY = this.data.centerY;
    getApp().$ajax({
      httpUrl: getApp().api.markeDetailUrl,
      data: {
        positionID: e.markerId || e.target.dataset.id
      }
    }).then(({ data }) => {
      this.setData({
        showDetail: true,
        detail: data,
        centerX: data.lng,
        centerY: data.lat,
      });
      wx.setStorageSync('detail', data);
      myAmapFun.getDrivingRoute({
        origin: `${centerX},${centerY}`,
        destination: `${data.lng},${data.lat}`,
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
            console.log(data)
            this.setData({
              distance: `距您${(data.paths[0].distance / 1000).toFixed(2)}公里`
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
      wx.hideLoading();
    })
  },
  // 地图控件
  controltap(e) {
    let detail = wx.getStorageSync('detail');
    wx.navigateTo({
      url: `./navigation_walk/navigation?latitude=${detail.lat * 1}&longitude=${detail.lng * 1}&centerX=${this.data.oldCenterX}&centerY=${this.data.oldCenterY}`
    })
    // wx.openLocation({
    //   latitude: detail.lat * 1,
    //   longitude: detail.lng * 1,
    //   scale: 18,
    //   name: detail.employer,
    //   address: detail.positionAddress
    // })
  },
  // 详情
  goDetail() {
    wx.navigateTo({
      url: `./detail/detail`,
    })
  }
})