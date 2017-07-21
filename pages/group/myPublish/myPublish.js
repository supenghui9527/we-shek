// pages/group/myPublish/myPublish.js
Page({
  data: {
    types: ['党课', '支委会', '党员大会', '党小组会']
  },
  onLoad: function (options) {
    //获取帐号发的帖子
    let date = new Date(), month = date.getMonth() + 1;
    wx.request({
      url: getApp().globalData.domain + 'findMeetingByOrgID.do',
      method: 'get',
      data: {
        orgID: wx.getStorageSync('userID'),
        mType : 1
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          let datas = res.data.data;
          for(let i=0;i<datas.length;i++ ){
            datas[i].month = new Date((datas[i].meetingTime.replace(/-/g, '/'))).getMonth()+1+'月';
            datas[i].day = new Date((datas[i].meetingTime.replace(/-/g, '/'))).getDate();
          }
          this.setData({
            myworks: datas
          })
          console.log(this.data.myworks);
        }
      }
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