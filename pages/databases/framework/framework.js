// pages/databases/framework/framework.js
let util = require('../../../utils/util.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
    let params = {
      orgID: wx.getStorageSync('higherOrgID')
    };
    util.httpPost(getApp().globalData.domain + 'findOrgByOrgID.do', params,this.callBack);
  },
  callBack(data) {
    let datas = data.data;
    if (data.state == 1) {
      this.setData({
        listData: datas
      })
      console.log(this.data.listData);
    }
  }
})