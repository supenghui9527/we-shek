// pages/detail/detail.js
Page({
  data: {
    community:[],
    cID:0,
    show:true
  },
  onLoad: function (option) {
    let ctx = this;
    // 获取userID
    this.setData({
      types:option.cType,
      cID:option.cID,
      userID: wx.getStorageSync('userID'),
      option: option
    });
    //查询帖子详情
    wx.request({
      url: getApp().globalData.domain+'/findCommunityByCID.do',
      method: 'get',
      data: {
        cID: this.data.cID
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let datas = res.data.data;
        datas.isDetail = false;
        datas.userID = wx.getStorageSync('userID');
        datas.type=['党课','支委会','党员大会','党小组会'];
        if (res.data.state == 1) {
          ctx.setData({
            community: datas
          })
        } else {
        }
      }
    });
    //查询帖子对应评论
    wx.request({
      url: getApp().globalData.domain + '/findComment.do',
      method: 'get',
      data: {
        cID: this.data.cID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let datas = res.data.data;
        if (res.data.state == 1) {
          ctx.setData({
            comment: datas.comment
          })
        } else {
        }
      }
    });
    // 查询帖子对应点赞
    wx.request({
      url: getApp().globalData.domain + '/findlikeUserByCID.do',
      method: 'get',
      data: {
        cID: this.data.cID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let datas = res.data.data;
        if (res.data.state == 1) {
          ctx.setData({
            likes: datas
          })
        } else {
        }
      }
    });
  },
  //点赞
  onLikes(e) {
    let cID = this.data.cID;
    wx.request({
      url: getApp().globalData.domain + 'likeCommunity.do',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        cID: cID,
        orgID: this.data.userID
      },
      success: (res) => {
        let datas = res.data.data;
        if (res.data.state == 1) {
          this.onLoad(this.data.option);
        }
      }
    })
  },
  //显示评论输入
  showComment(){
    this.setData({
      show:!this.data.show
    })
  },
  //获取输入评论内容
  getComment(e){
    this.setData({
      content: e.detail.value
    })
  },
  //保存评论内容
  saveComment(){
    wx.request({
      url: getApp().globalData.domain + 'releaseCommentToCommunity.do',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        cID: this.data.cID,
        orgID: this.data.userID,
        content: this.data.content
      },
      success: (res) => {
        let datas = res.data.data;
        if (res.data.state == 1) {
          this.showComment();
          this.onLoad(this.data.option);
        }
      }
    })
  },
  //删除帖子
  delPublish(e){
    wx.showModal({
      content: '确认删除',
      success: (res)=> {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.domain + 'deleteComunity.do',
            method: 'post',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
              cID: this.data.cID
            },
            success: (res) => {
              let datas = res.data.data;
              if (res.data.state == 1) {
                wx.showToast({
                  title: res.data.message,
                  success:(res)=>{
                    wx.redirectTo({
                      url: '/pages/home/home'
                    })
                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击图片预览
  showBigPic(e) {
    let img = e.currentTarget.dataset.img,
      imgUrl = e.currentTarget.dataset.imgurl,
      urls = [];
    for (let i = 0; i < img.length; i++) {
      urls[i] = imgUrl + img[i];
    }
    wx.previewImage({
      urls: urls
    })
  }
})