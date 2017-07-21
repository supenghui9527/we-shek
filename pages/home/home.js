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
    pageIndex:1,
    pageCount:'',
    show: false,
    current: 0,
    currentTab: 0,
    communityCount: 0,
    active: '全部',
    nav: ['全部', '党课', '支委会', '党员大会', '党小组会']
  },
  onLoad: function (options) {
    this.getData(20, -1, -1);
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    wx.getStorage({
      key: 'userID',
      success: (res) => {
        this.setData({
          userID: res.data
        });
      }
    })
  },
  //获取数据方法
  getData(pageNub, cType, meetingType) {
    wx.showLoading({
      mask: true,
      title: '加载中...'
    })
    wx.request({
      url: getApp().globalData.domain + 'findCommunityHomePage.do',
      method: 'get',
      data: {
        pageNumber: pageNub,
        cType: cType,
        meetingType: meetingType
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        wx.stopPullDownRefresh();
        let datas = res.data.data;
        for (let i = 0; i < datas.community.length; i++) {
          datas.community[i].isDetail = true;
          datas.community[i].type = ['党课', '支委会', '党员大会', '党小组会'];
        }
        if (res.data.state == 1) {
          wx.hideLoading();
          this.setData({
            community: datas.community,
            communityCount: datas.communityCount,
            communityTop: datas.communityTop
          })
        }
      }
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
    } else if (currentTab == 1) {//党课
      this.reachData(20, this.data.pageIndex, 0, 0)
    } else if (currentTab == 2) {//支委会
      this.reachData(20, this.data.pageIndex, 0, 1)
    } else if (currentTab == 3) {//党员大会
      this.reachData(20, this.data.pageIndex, 0, 2)
    } else {//党小组会
      this.reachData(20, this.data.pageIndex, 0, 3)
    }
  },
  //上拉加在更多
  reachData: function (pageNumber, pageIndex, cType, meetingType) {
    //判断页码总数减去当前页码是否还存在下一页
    if (this.data.pageCount - this.data.pageIndex>= 0) {
      wx.showLoading({
        mask: true,
        title: '加载中...'
      })
      wx.request({
        url: getApp().globalData.domain + 'findCommunityMore.do',
        method: 'get',
        data: {
          pageNumber: pageNumber,
          pageIndex: pageIndex,
          cType: cType,
          meetingType: meetingType
        },
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          if (res.data.state == 1) {
            wx.stopPullDownRefresh();
            let datas = res.data.data;
            //区分模版是在详情页面调用还是主页
            for (let i = 0; i < datas.community.length; i++) {
              datas.community[i].isDetail = true;
            }
            const publishs = this.data.community.concat(datas.community);
            wx.hideLoading();
            this.setData({
              community: publishs
            })
          }
        }
      })
    }
  },
  // 点击对应切换调取对应的数据
  getPostings(currentTab) {
    // 获取全部帖子
    if (currentTab == 0) {
      this.getData(20, -1, -1)
    } else if (currentTab == 1) {//党课
      this.getData(20, 0, 0)
    } else if (currentTab == 2) {//支委会
      this.getData(20, 0, 1)
    } else if (currentTab == 3) {//党员大会
      this.getData(20, 0, 2)
    } else {//党小组会
      this.getData(20, 0, 3)
    }
  },
  //tab切换
  navbar(e) {
    let active = e.target.dataset.tab, currentTab = e.target.dataset.current;
    this.setData({
      active: active,
      currentTab: currentTab
    });
    this.getPostings(currentTab);
  },
  // 滑动切换tab 
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  //点击加显示发帖
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
    wx.request({
      url: getApp().globalData.domain + 'likeCommunity.do',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        cID: cID,
        orgID: this.data.userID
      },
      success: (res) => {
        let datas = res.data.data,currentTab = this.data.currentTab;
        if (res.data.state == 1) {
          this.getPostings(currentTab);
        }
      }
    })
  },
  // 点击头像回到组织详情
  gopartydetail(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/databases/detail/detail?orgID=' + data.orgid + '&higherOrgID=' + data.higherorgid
    })
  },
  //点击图片预览
  showBigPic(e){
    let img = e.currentTarget.dataset.img,//帖子图片的名字
    imgUrl = e.currentTarget.dataset.imgurl,//帖子图片地址
    urls=[];
    //循环组装成数组里面为网络地址
    for(let i=0;i<img.length;i++){
      urls[i] = imgUrl + img[i];
    }
    //浏览大图
    wx.previewImage({
      urls: urls
    })
  }
})