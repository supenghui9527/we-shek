Page({
  data: {
    footbar: {
      home: false,
      data: false,
      mine: true
    }
  },
  onLoad: function () {
    //获取个人信息
    wx.request({
      url: getApp().globalData.domain + 'fingByOrgID.do',
      method: 'get',
      data: {
        orgID: wx.getStorageSync('userID'),
        higherOrgID: wx.getStorageSync('higherOrgID')
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.state == 1) {
          let datas = res.data.data;
          this.setData({
            datas: datas
          })
        }
      }
    });
  },
  //上传头像
  changeAvatar: function (e) {
    let ctx = this;
    wx.chooseImage({
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.domain + 'modifyAvatar.do',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            orgID: wx.getStorageSync('userID')
          },
          success: function (res) {
            let data = JSON.parse(res.data);
            if (data.state==1){
              wx.showToast({
                title: data.message,
                success:(res)=>{
                  ctx.onLoad();
                }
              })
            }
          }
        })
      }
    })
  },
  //拨打电话
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenub,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //设置
  set(){
    let data = this.data.datas;
    // 把信息保存到本地
    wx.setStorage({
      key: 'contactName',
      data: data.orgBean.contactName
    });
    wx.setStorage({
      key: 'contactTel',
      data: data.orgBean.contactTel
    });
    wx.setStorage({
      key: 'orgName',
      data: data.orgBean.orgName
    });
    wx.setStorage({
      key: 'orgNumber',
      data: data.orgBean.orgNumber
    });
    wx.setStorage({
      key: 'secretary',
      data: data.orgBean.secretary
    });
    wx.setStorage({
      key: 'contactPosition',
      data: data.orgBean.contactPosition
    });
    wx.setStorage({
      key: 'secretaryTel',
      data: data.orgBean.secretaryTel
    });
    wx.navigateTo({url: './setting/setting'});
  },
  showPrompt:function(){
    wx.showToast({
      title: '该功能正在完善中'
    })
  },
  //点击查看消息
  gomessage(){
    wx.navigateTo({
      url: './message/message'
    })
  },
  //点击进入我的三会E课
  goMypublish(){
    wx.navigateTo({
      url: './myPublish/myPublish'
    })
  },
  //点击进入我的近期工作
  goMywork(){
    wx.navigateTo({
      url: './mywork/mywork'
    })
  }
  //点击到地图
  // goToMap(e){
  //   let data = e.currentTarget.dataset;
  //   wx.navigateTo({
  //     url: '/pages/map/map?lat='+data.lat+'&lng='+data.lng
  //   })
  // }
})