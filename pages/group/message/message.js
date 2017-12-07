// pages/group/message/message.js
Page({
  data: {
    messageIndex:null
  },
  onLoad: function (options) {
    //获取消息列表
    getApp().$ajax({
      httpUrl: getApp().api.getMessagesUrl,
      data: {
        orgID: wx.getStorageSync('userInfo').orgID
      }
    }).then(({data})=>{
      let datas = data.messageList;
      for (let i = 0; i < datas.length; i++) {
        datas[i].msgCreateTime = datas[i].msgCreateTime.substring(0, 10);
      }
      this.setData({
        datas: datas
      })
    })
  },
  //显示消息详情
  showMessage(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      messageIndex:index
    })
  },
  //隐藏消息详情
  hideMessage(e){
    this.setData({
      messageIndex:null
    })
  },
  noHide(){
  },
  //是否同意下级删除党员请求
  agree(e){
    let data = e.currentTarget.dataset;
    getApp().$ajax({
      httpUrl: getApp().api.sureMessageUrl,
      data: {
        userID: data.userid,
        msgID: data.msgid,
        agree: data.agree
      }
    }).then(({ data }) => {
      wx.showToast({
        title: '操作成功',
        success: (res) => {
          this.setData({
            messageIndex: null
          })
        }
      })
    })
  },
  //删除消息
  delMessage(e){
    let data = e.currentTarget.dataset;
    getApp().$ajax({
      httpUrl: getApp().api.deleteMesageUrl,
      data: {
        msgID: data.msgid
      }
    }).then(({ data }) => {
      wx.showToast({
        title: '删除成功',
        success: (res) => {
          this.onLoad();
        }
      })
    })
  }
})