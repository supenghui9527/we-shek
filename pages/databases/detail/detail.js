// pages/databases/detail/detail.js
Page({
  data: {
    types: ['党课', '支委会', '党员大会', '党小组会']
  },
  onLoad: function (options) {
    //获取对应的党组织信息
    wx.request({
      url: getApp().globalData.domain + 'fingByOrgID.do',
      method: 'get',
      data: {
        orgID: options.orgID,
        higherOrgID: options.higherOrgID
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          let datas = res.data.data;
          this.setData({
            datas:datas
          })
        }
      }
    });
    let date = new Date(), month = date.getMonth() + 1;
    //获取对应的党组织的发帖列表
    wx.request({
      url: getApp().globalData.domain + 'findMeetingByOrgID.do',
      method: 'get',
      data: {
        orgID: options.orgID,
        mType: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          let datas = res.data.data;
          for (let i = 0; i < datas.length; i++) {
            datas[i].month = new Date((datas[i].createTime.replace(/-/g, '/'))).getMonth() + 1 + '月';
            let day = new Date((datas[i].createTime.replace(/-/g, '/'))).getDate();
            datas[i].day = day<10?'0'+day:day;
          }
          this.setData({
            myworks: datas
          })
        }
      }
    })
  },
  //帖子详情
  godetail(e) {
    let cType = e.currentTarget.dataset.ctype,
      cID = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '/pages/home/detail/detail?cID=' + cID + '&cType=' + cType
    })
  }
})