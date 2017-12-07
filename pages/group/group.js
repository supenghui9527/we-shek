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
    getApp().$ajax({
      httpUrl: getApp().api.userInfoUrl,
      data: {
        orgID: wx.getStorageSync('userInfo').orgID,
        higherOrgID: wx.getStorageSync('userInfo').higherOrgID
      }
    }).then(({ data }) => {
      this.setData({
        datas: data
      })
      wx.hideLoading();
    })
  },
  //上传头像
  changeAvatar: function (e) {
    let ctx = this;
    wx.chooseImage({
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().api.changeAvatarUrl,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            orgID: wx.getStorageSync('userInfo').orgID
          },
          success: function (res) {
            let data = JSON.parse(res.data);
            if (data.state == 1) {
              wx.showToast({
                title: data.message,
                success: (res) => {
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
  set() {
    let data = this.data.datas;
    wx.setStorage({
      key: "orgNumber",
      data: data.orgBean.orgNumber
    })
    // 把信息传递到设置页面
    wx.navigateTo({ url: `./setting/setting?contactName=${data.orgBean.contactName}&contactTel=${data.orgBean.contactTel}&orgName=${data.orgBean.orgName}&orgNumber=${data.orgBean.orgNumber}&secretary=${data.orgBean.secretary}&contactPosition=${data.orgBean.contactPosition}&secretaryTel=${data.orgBean.secretaryTel}` });
  },
  //进入我的积分
  showPrompt: function () {
    wx.navigateTo({
      url: './integral/integral'
    })
  },
  //点击查看消息
  gomessage() {
    wx.navigateTo({
      url: './message/message'
    })
  },
  //点击进入我的三会E课
  goMypublish() {
    wx.navigateTo({
      url: './myPublish/myPublish'
    })
  },
  //点击进入我的近期工作
  goMywork() {
    wx.navigateTo({
      url: './mywork/mywork'
    })
  },
  //点击进入关于三会E课
  goAbout() {
    wx.navigateTo({
      url: './about/about'
    })
  },
  //点击到地图
  // goToMap(e){
  //   let data = e.currentTarget.dataset;
  //   wx.navigateTo({
  //     url: '/pages/map/map?lat='+data.lat+'&lng='+data.lng
  //   })
  // }
})