// pages/home/searchList/searchList.js
Page({
  data: {
    community: {},
    content: '',
    count: null,
    pageIndex: 1,
    pageCount: ''
  },
  onLoad: function (options) {
    this.setData({
      userID: wx.getStorageSync('userInfo').orgID
    });
  },
  // 取消搜索
  hideSearch() {
    wx.navigateBack({
      url: '/page/home/home'
    })
  },
  // 获取搜索内容
  searchContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 确认搜索
  goSearch() {
    this.getData(this.data.content, 1)
  },
  // 获取搜索数据
  getData(content, pageIndex) {
    getApp().$ajax({
      httpUrl: getApp().api.searchUrl,
      data: {
        content: content,
        pageNumber: 20,
        pageIndex: pageIndex
      }
    }).then(({ data }) => {
      wx.hideLoading();
      for (let i = 0; i < data.community.length; i++) {
        data.community[i].isDetail = true;
        data.community[i].type = ['党课', '支委会', '党员大会', '党小组会'];
      }
      if (this.data.pageIndex > 1) {
        var publishs = this.data.community.concat(data.community);
      }
      this.setData({
        community: publishs ? publishs : data.community,
        count: data.count
      })
    });
  },
  // 下拉加载更多
  onReachBottom: function () {
    if (this.data.count % 20 != 0) {//判断页码总数是否能整除
      let pageCount = Math.ceil(this.data.count / 20);
      this.setData({
        pageCount: pageCount
      })
    } else {
      let pageCount = this.data.count / 20;
      this.setData({
        pageCount: pageCount
      })
    };
    this.data.pageIndex++;
    //判断页码总数减去当前页码是否还存在下一页
    if (this.data.pageCount - this.data.pageIndex >= 0) {
      this.getData(this.data.content, this.data.pageIndex)
    }
  },
  //点赞
  onLikes(e) {
    let cID = e.currentTarget.dataset.cid;
    getApp().$ajax({
      httpUrl: getApp().api.likesUrl,
      data: {
        cID: cID,
        orgID: this.data.userID
      }
    }).then(({ data }) => {
      this.getData(this.data.content, 1)
    });
  },
  // 点击进入详情
  goDetail(e) {
    let cType = e.currentTarget.dataset.type,
      cID = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '/pages/home/detail/detail?cType=' + cType + '&cID=' + cID
    })
  },
  // 清除搜索内容
  deletSearch() {
    this.setData({
      content: '',
      community: null
    })
  }
})