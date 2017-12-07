// pages/home/home.js
let utils = require('../../utils/util.js')
Page({
  data: {
    footbar: {
      home: true,
      data: false,
      mine: false
    },
    userID: 0,
    community: [],
    scrollTop: 0,
    interval: true,
    pageIndex: 1,
    pageCount: '',
    show: false,
    current: 0,
    currentTab: 0,
    communityCount: 0,
    nav: ['全部', '党员大会', '支委会', '党小组会', '党课']
  },
  onLoad: function (options) {
    this.getData(20, -1, -1);
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight,
          userID: wx.getStorageSync('userInfo').orgID
        });
      }
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/map/map',
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取数据方法
  getData(pageNub, cType, meetingType) {
    getApp().$ajax({
      httpUrl: getApp().api.getPostingsUrl,
      data: {
        pageNumber: pageNub,
        cType: cType,
        meetingType: meetingType
      }
    }).then(({ data }) => {
      wx.stopPullDownRefresh();
      for (let i = 0; i < data.community.length; i++) {
        data.community[i].isDetail = true;
        data.community[i].type = ['党课', '支委会', '党员大会', '党小组会'];
      };
      this.setData({
        community: data.community,
        communityCount: data.communityCount,
        communityTop: data.communityTop
      });
      wx.hideLoading();
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    let currentTab = this.data.currentTab;
    this.getPostings(currentTab);
  },
  //上拉加载更多
  onReachBottom: function () {
    let currentTab = this.data.currentTab;
    if (this.data.communityCount % 20 != 0) {//判断页码总数是否能整除
      let pageCount = Math.ceil(this.data.communityCount / 20);
      this.setData({
        pageCount: pageCount
      })
    } else {
      let pageCount = this.data.communityCount / 20;
      this.setData({
        pageCount: pageCount
      })
    };
    this.data.pageIndex++;
    if (currentTab == 0) {
      this.reachData(20, this.data.pageIndex, -1, -1)
    } else if (currentTab == 1) {//党员大会
      this.reachData(20, this.data.pageIndex, 0, 2)
    } else if (currentTab == 2) {//党委会
      this.reachData(20, this.data.pageIndex, 0, 1)
    } else if (currentTab == 3) {//党小组会
      this.reachData(20, this.data.pageIndex, 0, 3)
    } else {//党课
      this.reachData(20, this.data.pageIndex, 0, 0)
    }
  },
  //上拉加在更多
  reachData: function (pageNumber, pageIndex, cType, meetingType) {
    //判断页码总数减去当前页码是否还存在下一页
    if (this.data.pageCount - this.data.pageIndex >= 0) {
      getApp().$ajax({
        httpUrl: getApp().api.getMorePostingUrl,
        data: {
          pageNumber: pageNumber,
          pageIndex: pageIndex,
          cType: cType,
          meetingType: meetingType
        }
      }).then(({ data }) => {
        wx.stopPullDownRefresh();
        //区分模版是在详情页面调用还是主页
        for (let i = 0; i < data.community.length; i++) {
          data.community[i].isDetail = true;
        }
        const publishs = this.data.community.concat(data.community);
        this.setData({
          community: publishs
        })
        wx.hideLoading();
      })
    }
  },
  // 点击对应切换调取对应的数据
  getPostings(currentTab) {
    // 获取全部帖子
    if (currentTab == 0) {
      this.getData(20, -1, -1)
    } else if (currentTab == 1) {//党员大会
      this.getData(20, 0, 2)
    } else if (currentTab == 2) {//支委会
      this.getData(20, 0, 1)
    } else if (currentTab == 3) {//党小组会
      this.getData(20, 0, 3)
    } else {//党课
      this.getData(20, 0, 0)
    }
  },
  //点击对应切换调取对应的数据
  navbar(e) {
    let currentTab = e.target.dataset.current;
    this.setData({
      currentTab: currentTab
    });
    this.getPostings(currentTab);
  },
  // 滑动切换tab 
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  //点击+显示发帖
  onAnimate() {
    this.setData({
      show: !this.data.show
    })
  },
  //发帖
  goPublish(e) {
    let posttype = e.currentTarget.dataset.posttype;
    wx.navigateTo({
      url: '/pages/home/publish/publish?posttype=' + posttype,
      success: (res) => {
        this.onAnimate();
      }
    })
  },
  // 点击进入详情
  goDetail(e) {
    let cType = e.currentTarget.dataset.type,
      cID = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '/pages/home/detail/detail?cType=' + cType + '&cID=' + cID
    })
  },
  //点赞
  onLikes(e) {
    let cID = e.currentTarget.dataset.cid;
    getApp().modules.common.action.clickLikes({
      WX: this,
      data: {
        cID: cID,
        orgID: this.data.userID
      }
    })
    
    // getApp().$ajax({
    //   httpUrl: getApp().api.likesUrl,
    //   data: {
    //     cID: cID,
    //     orgID: this.data.userID
    //   }
    // }).then(({ data }) => {
    //   let currentTab = this.data.currentTab;
    //   this.getPostings(currentTab);
    // })
  },
  // 点击头像回到组织详情
  gopartydetail(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/databases/detail/detail?orgID=' + data.orgid + '&higherOrgID=' + data.higherorgid
    })
  },
  //点击图片预览
  showBigPic(e) {
    getApp().showBigPic(e);
  },
  // 搜索
  showSearch() {
    wx.navigateTo({
      url: '/pages/home/searchList/searchList'
    })
  }
})