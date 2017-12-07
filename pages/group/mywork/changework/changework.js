// pages/group/mywork/changework/changework.js
Page({
  data: {
    edit:true,
    btnTxt:'编辑',
    showChange:true,
    focus:false,
    options:[
      {
        text: '进行中',
        workStatus:1,
      },
      {
        text: '已完成',
        workStatus:2,
      },
      {
        text: '未完成',
        workStatus:3,
      }
    ]
  },
  //从近期工作列表获取近期工作的信息
  onLoad: function (options) {
    this.setData({
      workContent: options.workContent,
      workID: options.workID,
      workTitle: options.workTitle,
      workStatus: options.workStatus
    })
  },
  //修改近期工作
  changework(e){
    if (this.data.edit==false){
      let data = e.detail.value;
      getApp().$ajax({
        httpUrl: getApp().api.changeWorkUrl,
        data: data
      }).then(({ data }) => {
        wx.showToast({
          title: '修改成功',
          success: (res) => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        wx.hideLoading();
      })
    }
  },
  //显示更改工作状态
  show(){
    this.setData({
      showChange:false
    })
  },
  //修改近期工作
  edit(){
    this.setData({
      btnTxt:'保存'
    })
    setTimeout(()=>{
      this.setData({
        edit: false,
        focus: true
      })
    },500)
  },
  // 切换工作状态
  changeWork(e){
    let data = e.currentTarget.dataset;
    this.setData({
      workStatus: data.status
    })
  },
  //获取更新状态理由
  getReason(e){
    this.setData({
      reason:e.detail.value
    })
  },
  //确定更改近期工作状态
  sureChange(){
    getApp().$ajax({
      httpUrl: getApp().api.sureWorkUrl,
      data:{
        workStatus: this.data.workStatus,
        workID: this.data.workID,
        reason: this.data.reason
      }
    }).then(({data})=>{
      this.setData({
        showChange: true
      })
      this.onLoad();
    })
  },
  //取消修改工作状态
  noChange(){
    this.setData({
      showChange: true
    })
  }
})