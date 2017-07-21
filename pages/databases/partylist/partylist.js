// pages/databases/partylist/partylist.js
Page({
  data: {
    firstIndex: null,
    nextName: null,
    endName: null,
    footbar: {
      home: false,
      data: true,
      mine: false
    }
  },
  onLoad: function (options) {
    if(wx.getStorageSync('listData')){
      this.setData({
        listData: wx.getStorageSync('listData')
      })
    }else{
      wx.request({
        url: getApp().globalData.domain + 'findOrg.do',
        method: 'get',
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          let datas = res.data.data;
          wx.setStorage({
            key: 'listData',
            data: datas
          })
          this.setData({
            listData: datas
          })
        },
        fail: (err) => {
        }
      })
    }
  },
  onReady: function () {

  },
  firstList: function (e) {
    let index = e.currentTarget.dataset.index,
    next = this.data.listData[index].children;
    if(this.data.firstIndex!=null){
      this.setData({
        next: [],
        firstIndex: null
      })
    }else{
      this.setData({
        next: next,
        firstIndex: index
      })
    }
  },
  nextList: function (e) {
    let first = e.currentTarget.dataset.first,
      index = e.currentTarget.dataset.next,
      end = this.data.listData[first].children[index].children;
    if (this.data.nextIndex != null) {
      this.setData({
        nextIndex: null,
        end:[]
      })
    } else {
      this.setData({
        nextIndex: index,
        end:end
      })
    }
  },
  endList: function (e) {
    let itemName = e.currentTarget.dataset.name;
    this.setData({
      endName: itemName
    })
  },
  gopartydetail(e){
    let obj = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../detail/detail?orgID=' + obj.orgid + '&higherOrgID=' + obj.higherorgid
    })
  }
})