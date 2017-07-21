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
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: getApp().globalData.domain + 'findMyWork.do',
      method: 'get',
      data: {
        orgID: wx.getStorageSync('userID'),
        date: this.data.date
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          let datas = res.data.data;
          wx.hideLoading();
          for(let i =0;i<datas.length;i++){
            datas[i].workeDate = datas[i].workCreateDate.substr(8,10);
          }
          this.setData({
            myworks: datas
          })
        }
      }
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
    wx.request({
      url: getApp().globalData.domain + 'deleteWork.do',
      method: 'get',
      data: {
        workID: e.currentTarget.dataset.workid
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          wx.showToast({
            title: '删除成功',
            duration:1000,
            success:(res)=>{
              this.onLoad();
            }
          })
        }
      }
    })
  }
})