// pages/group/mywork/mywork.js
let year = new Date().getFullYear(), month = new Date().getMonth()+1;
Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({
      date: month >= 10 ? year + '-' + month : year + '-0' + month
    })
    this.getData();
  },
  //获取近期工作的方法
  getData(){
    getApp().$ajax({
      httpUrl: getApp().api.getMyWorkUrl,
      data: {
        orgID: wx.getStorageSync('userInfo').orgID,
        date: this.data.date
      }
    }).then(({ data }) => {
      for (let i = 0; i < data.length; i++) {
        data[i].workeDate = data[i].workCreateDate.substr(8, 10);
      }
      this.setData({
        myworks: data
      })
      wx.hideLoading();
    })
  },
  // 日期选择左边
  left(){
    if (month > 1){
      month--;
      this.setData({
        date: month >= 10 ? year + '-' + month : year + '-0' + month
      })
    } else if (month==1){
      month = 12;
      year--;
      this.setData({
        date: month >= 10 ? year + '-' + month : year + '-0' + month
      })
    }
    this.getData();
  },
  // 日期选择右边
  right(){
    if (month<=11){
      month++;
      this.setData({
        date: month >= 10 ? year + '-' + month : year + '-0' + month
      })
    } else if (month==12){
      month = 1;
      year++;
      this.setData({
        date: month >= 10 ? year + '-' + month : year + '-0' + month
      })
    }
    this.getData();
  },
  //添加近期工作
  addwork(){
    wx.navigateTo({
      url: '../addwork/addwork'
    })
  },
  //近期工作详情
  goDetail(e){
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `./changework/changework?workID=${data.workid}&workTitle=${data.title}&workContent=${data.content}&workStatus=${data.workstatus}`
    })
  },
  //删除近期工作
  delWork(e){
    getApp().$ajax({
      httpUrl: getApp().api.deleteWorkUrl,
      data: {
        workID: e.currentTarget.dataset.workide
      }
    }).then(({ data }) => {
      wx.showToast({
        title: '删除成功',
        duration: 1000,
        success: (res) => {
          this.onLoad();
        }
      })
      wx.hideLoading();
    })
  }
})