// pages/group/integral/integral.js
let sortFlag = true, inputValue, date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1, nowDate;
Page({
  data: {
    active: 0,
    list: [],
    showMonths: true,
    showErr: true,
    nowMonth: month,
    months: [{ month: 1, id: '01' }, { month: 2, id: '02' }, { month: 3, id: '03' }, { month: 4, id: '04' }, { month: 5, id: '05' }, { month: 6, id: '06' }, { month: 7, id: '07' }, { month: 8, id: '08' }, { month: 9, id: '09' }, { month: 10, id: '10' }, { month: 11, id: '11' }, { month: 12, id: '12' }],
    Ptype: [
      {
        pname: '党小组会',
        imgUrl: '/images/group.png'
      },
      {
        pname: '支委会',
        imgUrl: '/images/part.png'
      },
      {
        pname: '党员大会',
        imgUrl: '/images/meeting.png'
      },
      {
        pname: '党课',
        imgUrl: '/images/lesson.png'
      },
      {
        pname: '党日活动',
        imgUrl: '/images/activity.png'
      },
      {
        pname: '下级汇报',
        imgUrl: '/images/contribute.png'
      }
    ],
    orgType: [
      {
        name: '党支部',
        id: 0
      },
      {
        name: '党工委',
        id: 1
      }
    ]
  },
  onLoad: function (options) {
    let ctx = this;
    //获取到设备的高度
    wx.getSystemInfo({
      success: function (res) {
        ctx.setData({
          contentHeight: res.windowHeight * 2 - 570,
          orgName: wx.getStorageSync('orgName'),
          year: year,
          activeMonth: month
        })
      }
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    setTimeout(() => {
      //获取当前帐号的排名信息
      wx.request({
        url: getApp().globalData.domain + 'findMyPoint.do',
        method: 'get',
        data: {
          orgID: wx.getStorageSync('userID')
        },
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          if (res.data.state == 1) {
            let datas = res.data.data, Ptype = this.data.Ptype;
            for (let i = 0; i < Ptype.length; i++) {
              if (Ptype[i].pname == '党小组会') {
                Ptype[i].nub = datas.dxzh;
                continue;
              } else if (Ptype[i].pname == '支委会') {
                Ptype[i].nub = datas.zwh;
                continue;
              } else if (Ptype[i].pname == '党员大会') {
                Ptype[i].nub = datas.dydh;
                continue;
              } else if (Ptype[i].pname == '党课') {
                Ptype[i].nub = datas.dk;
                continue;
              } else if (Ptype[i].pname == '党日活动') {
                Ptype[i].nub = datas.drhd;
                continue;
              } else if (Ptype[i].pname == '下级汇报') {
                Ptype[i].nub = datas.xj;
                continue;
              }
            }
            this.setData({
              datas: datas,
              Ptype: this.data.Ptype
            })
            wx.hideLoading();
          }
        }
      });
      //有缓存取缓存没有请求数据
      // if (wx.getStorageSync('list')) {
      //   this.setData({
      //     list: wx.getStorageSync('list')
      //   })
      // } else {
      this.setDate();
      this.getData(this.data.active, 0, nowDate);
    }, 20)
  },
  //搜索功能
  inputVal: function (e) {
    inputValue = e.detail.value;
    if (inputValue==''){
      this.setData({
        list: wx.getStorageSync('list')
      })
    }
  },
  search: function () {
    let list = wx.getStorageSync('list'),
      newList = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].orgName.indexOf(inputValue) != -1) {
        newList.push(list[i]);
      }
    };
    this.setData({
      list: newList
    })
  },
  //显示选择月份
  showChoseMonth: function () {
    this.setData({
      showMonths: false
    })
  },
  //获取数据
  getData: function (orgType, orderType, pointTime) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.domain + 'findOrgOrder.do',
      method: 'get',
      data: {
        orgType: orgType,
        orderType: orderType,
        pointTime: pointTime
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          let datas = res.data.data;
          if (datas == '') {
            this.setData({
              list: datas
            });
            wx.hideLoading();
            return;
          }
          wx.setStorageSync('list', datas);
          this.setData({
            list: datas
          })
          wx.hideLoading();
        }
      }
    });
  },
  //处理年月格式
  setDate: function () {
    let newMonth;
    this.data.activeMonth.toString().length == 1 ? newMonth = `0${this.data.activeMonth}` : newMonth = this.data.activeMonth;
    nowDate = year + '-' + newMonth;
  },
  //选择月份查询排行
  choseMonth: function (e) {
    let val = e.target.dataset.val,
      m = e.target.dataset.month,
      choseDate = year + '-' + val;
    if (m <= month && m > 6) {
      this.setData({
        activeMonth: m,
        showMonths: true
      })
      this.getData(this.data.active, 0, choseDate);
    } else {
      this.setData({
        showErr: false
      });
      setTimeout(() => {
        this.setData({
          showErr: true
        });
      }, 2000)
    }
  },
  //隐藏选择月份信息
  hideMonth: function () {
    this.setData({
      showMonths: true
    })
  },
  //切换党支部和党工委的信息
  changeNav: function (e) {
    this.setData({
      active: e.target.dataset.index
    });
    this.setDate();
    this.getData(e.target.dataset.index, 0, nowDate);
  },
  //排序方法
  sortBy: function (attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
      rev = 1;
    } else {
      rev = (rev) ? 1 : -1;
    }
    return function (a, b) {
      a = a[attr];
      b = b[attr];
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    }
  },
  //点击对下面排行榜进行排序
  toSort: function () {
    if (sortFlag) {
      this.setData({
        list: wx.getStorageSync('list').sort(this.sortBy('totalPoint'))
      })
      sortFlag = false;
    } else {
      this.setData({
        list: wx.getStorageSync('list')
      });
      sortFlag = true;
    }
  }
})