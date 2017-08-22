// pages/databases/member/member.js
Page({
  data: {
    delShow:false,
    reason:''
  },
  onLoad: function (options) {
    this.setData({
      //编辑党员信息默认值
      surname: options.username.substr(0,1),
      username: options.username,
      position: options.position == 'null' ? '' : options.position,
      gender: options.gender,
      joindate: options.joindate,
      tel:options.tel,
      idNum: options.idNum,
      userID: options.userID
    });
    //判断该帐号是否有删除党员权限
    if (wx.getStorageSync('orgName').indexOf('党支部') !== -1) {
      this.setData({
        noDel:true
      })
    }
  },
  //拨打电话
  call(){
    wx.makePhoneCall({
      phoneNumber: this.data.tel,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  text(){
    wx.showToast({
      title: '小程序暂无法调用短信功能'
    })
  },
  //保存电话号码到手机通讯录
  saveTel(){
    wx.addPhoneContact({
      firstName:this.data.username,
      mobilePhoneNumber:this.data.tel,
      success:(res)=>{
        console.log('成功')
      },
      fail: (res) =>{
        console.log('失败')
      }
    })
  },
  // 编辑党员
  goEdit(){
    wx.navigateTo({
      url: './edit/edit?gender=' + this.data.gender + '&tel=' + this.data.tel + '&joindate=' + this.data.joindate + '&position=' + this.data.position + '&username=' + this.data.username + '&idNum=' + this.data.idNum + '&userID=' + this.data.userID
    })
  },
  //显示输入删除理由模块
  showDel(){
    this.setData({
      delShow:true
    })
  },
  //隐藏输入删除理由模块
  hideDel(){
    this.setData({
      delShow: false
    })
  },
  noHide(){
  },
  //获取删除党员理由
  reason(e){
    let val = e.detail.value;
    this.setData({
      reason:val
    })
  },
  // 删除党员操作
  agree(e){
    if(this.data.reason!=''){
      wx.request({
        url: getApp().globalData.domain + 'requestDelete.do',
        method: 'get',
        data: {
          fromOrgID: wx.getStorageSync('userID'),
          toOrgID : wx.getStorageSync('higherOrgID'),
          userID: this.data.userID,
          reason: this.data.reason
        },
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          if (res.data.state == 1) {
            wx.showToast({
              title: '删除请求以提交',
              success:(res)=>{
                this.hideDel();
              }
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '理由不能为空',
        image:'/images/IconSquareEx.png',
        duration:500,
        success:(res)=>{
          this.hideDel();
        }
      })
    }
  }
})