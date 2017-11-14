// pages/home/searchList/searchList.js
Page({
  data: {
    community:{},
    content:'',
    count:null,
    pageIndex: 1,
    pageCount:''
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'userID',
      success: (res) => {
        this.setData({
          userID: res.data
        });
      }
    })
  },
  hideSearch(){
    wx.navigateBack({
      url:'/page/home/home'
    })
  },
  searchContent(e){
    this.setData({
      content: e.detail.value
    })
  },
  // 搜索
  goSearch(){
    this.getData(this.data.content,1)
  },
  // 获取搜索数据
  getData(content,pageIndex){
    wx.showLoading({
      mask: true,
      title: '加载中...'
    })
    wx.request({
      url: getApp().globalData.domain + 'vagueSearch.do',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        content: content,
        pageNumber: 20,
        pageIndex: pageIndex
      },
      success: (res) => {
        wx.hideLoading();
        let datas = res.data.data;
        for (let i = 0; i < datas.community.length; i++) {
          datas.community[i].isDetail = true;
          datas.community[i].type = ['党课', '支委会', '党员大会', '党小组会'];
        }
        if (res.data.state == 1) {
          if(this.data.pageIndex>1){
            var publishs = this.data.community.concat(datas.community);
          }
          this.setData({
            community: publishs ? publishs : datas.community,
            count: datas.count
          })
        }
      }
    })
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
    wx.request({
      url: getApp().globalData.domain + 'likeCommunity.do',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        cID: cID,
        orgID: this.data.userID
      },
      success: (res) => {
        let datas = res.data.data, currentTab = this.data.currentTab;
        if (res.data.state == 1) {
          this.getData(this.data.content, 1)
        }
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
  deletSearch(){
    this.setData({
      content:'',
      community: null
    })
  }
})