// pages/detail/detail.js
Page({
  data: {
    community: [],
    cID: 0,
    show: true
  },
  onLoad: function (option) {
    // 获取userID
    this.setData({
      types: option.cType,
      cID: option.cID,
      userID: wx.getStorageSync('userInfo').orgID,
      option: option
    });
    //查询帖子详情
    getApp().$ajax({
      httpUrl: getApp().api.postingsDetailUrl,
      data: {
        cID: this.data.cID
      }
    }).then(({ data }) => {
      data.isDetail = false;
      data.userID = wx.getStorageSync('userInfo').orgID;
      data.type = ['党课', '支委会', '党员大会', '党小组会'];
      this.setData({
        community: data
      })
    });
    //查询帖子对应评论
    getApp().$ajax({
      httpUrl: getApp().api.postingsCommentUrl,
      data: {
        cID: this.data.cID
      }
    }).then(({ data }) => {
      this.setData({
        comment: data.comment
      })
    });
    // 查询帖子对应点赞
    getApp().$ajax({
      httpUrl: getApp().api.postingsLikesUrl,
      data: {
        cID: this.data.cID
      }
    }).then(({ data }) => {
      this.setData({
        likes: data
      })
      wx.hideLoading();
    });
  },
  //点赞
  onLikes(e) {
    getApp().$ajax({
      httpUrl: getApp().api.likesUrl,
      data: {
        cID: this.data.cID,
        orgID: this.data.userID
      }
    }).then(({ data }) => {
      this.onLoad(this.data.option);
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: '自定义转发标题',
      path: `/pages/home/detail/detail?cID=${this.data.cID}`,
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
      }
    }
  },
  //显示评论输入模块
  showComment() {
    this.setData({
      show: !this.data.show
    })
  },
  //获取输入评论内容
  getComment(e) {
    this.setData({
      content: e.detail.value
    })
  },
  //保存评论内容
  saveComment() {
    getApp().$ajax({
      httpUrl: getApp().api.savePostingsCommentUrl,
      data: {
        cID: this.data.cID,
        orgID: this.data.userID,
        content: this.data.content
      }
    }).then(({ data }) => {
      this.showComment();
      this.onLoad(this.data.option);
    });
  },
  //删除帖子
  delPublish(e) {
    wx.showModal({
      content: '确认删除',
      success: (res) => {
        if (res.confirm) {
          getApp().$ajax({
            httpUrl: getApp().api.deletePostingsUrl,
            data: {
              cID: this.data.cID
            }
          }).then(({ data, message }) => {
            wx.showToast({
              title: message,
              success: (res) => {
                wx.redirectTo({
                  url: '/pages/home/home'
                })
              }
            })
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击图片预览
  showBigPic(e) {
    getApp().showBigPic(e);
  }
})