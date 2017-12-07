// pages/group/myPublish/myPublish.js
Page({
  data: {
    types: ['党课', '支委会', '党员大会', '党小组会']
  },
  onLoad: function (options) {
    //获取帐号发的帖子
    let date = new Date(), month = date.getMonth() + 1;
    getApp().$ajax({
      httpUrl: getApp().api.getAlreadyPostingsUrl,
      data: {
        orgID: wx.getStorageSync('userInfo').orgID,
        mType: 1
      }
    }).then(({data})=>{
      for (let i = 0; i < data.length; i++) {
        data[i].month = new Date((data[i].createTime.replace(/-/g, '/'))).getMonth() + 1 + '月';
        data[i].day = new Date((data[i].createTime.replace(/-/g, '/'))).getDate();
      }
      this.setData({
        myworks: data
      })
      wx.hideLoading();
    })
  },
  // 到帖子详情
  godetail(e){
    let cType = e.currentTarget.dataset.ctype,
      cID = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '/pages/home/detail/detail?cID=' + cID + '&cType=' + cType
    })
  }
})