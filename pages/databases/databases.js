// databases.js
Page({
  data: {
    footbar: {
      home: false,
      data: true,
      mine: false,
      searchShow: false
    },
    // 当前选择的导航字母
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'A',
    editIndex: 0,
    delBtnWidth: 150,//删除按钮宽度单位（rpx）
    // 导航字母
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z']
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'orgName',
      success: (res) => {
        let orgName = res.data;
        if (orgName.indexOf('党支部') >= 0) {
          this.setData({
            showDel: true
          })
        }
      }
    });
    let higherOrgID = wx.getStorageSync('higherOrgID'),
    orgID = wx.getStorageSync('userID');
    //判断党员列表本地是否存在
    if(wx.getStorageSync('groups')){
      this.setData({
        groups: wx.getStorageSync('groups')
      })
    }else{
      wx.request({
        url: getApp().globalData.domain + 'findUSerByOrgID.do',
        method: 'get',
        data: {
          orgID: wx.getStorageSync('userID'),
          higherOrgID: wx.getStorageSync('higherOrgID'),
          type: 1
        },
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          this.setData({
            groups: res.data.data
          })
          wx.setStorage({
            key: 'groups',
            data: res.data.data
          })
        }
      })
    }
    const res = wx.getSystemInfoSync(),
      letters = this.data.letters;
    // 设备信息
    this.setData({
      windowHeight: res.windowHeight,
      windowWidth: res.windowWidth,
      pixelRatio: res.pixelRatio
    });
    // 第一个字母距离顶部高度，css中定义nav高度为83%，所以 *0.83
    const navHeight = this.data.windowHeight * 0.83, // 
      eachLetterHeight = navHeight / 26,
      comTop = (this.data.windowHeight - navHeight) / 2,
      temp = [];
    this.setData({
      eachLetterHeight: eachLetterHeight
    });
    //判断该帐号是否有添加党员权限
    if (wx.getStorageSync('orgName').indexOf('党支部') !== -1) {
      this.setData({
        noAdd: true
      })
    }
  },
  onShow:function(){
    if (wx.getStorageSync('isLoad')){
      this.onLoad();
      wx.removeStorageSync("isLoad");
    }
  },
  tabLetter(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected: index,
      scrollIntoView: index
    })
    this.cleanAcitvedStatus();
  },
  // 清除字母选中状态
  cleanAcitvedStatus() {
    setTimeout(() => {
      this.setData({
        selected: 0
      })
    }, 500);
  },
  //查看党员详情
  goUser(e) {
    let obj = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/databases/member/member?username=' + obj.username + '&position=' + obj.position + '&gender=' + obj.gender + '&joindate=' + obj.joindate + '&tel=' + obj.tel + '&idNum=' + obj.idnum + '&userID=' + obj.userid
    })
  },
  //添加党员
  addmember(){
    wx.navigateTo({
      url: './addmember/addmember'
    })
  },
  //下级组织架构
  goframework(e){
    wx.navigateTo({
      url: './framework/framework'
    })
  },
  //搜索党组织下的党员通过手机号和姓名
  search(e){
    let val = e.detail.value,
    groups = wx.getStorageSync('groups'),
    newGroups = [];
    for (let i in groups){
      for (let j = 0; j < groups[i].length;j++){
        if (groups[i][j].username.indexOf(val) != -1 || groups[i][j].tel.indexOf(val) != -1){
          newGroups.push(groups[i][j]);
        }
      }
    }
    this.setData({
      newGroups: newGroups,
      searchShow: e.detail.value!=''?true:false
    })
  }
})