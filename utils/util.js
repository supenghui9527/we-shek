function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 请求方法
function fnHttp(httpUrl, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: httpUrl,
      method: 'get',
      data: data,
      header: { 'content-type': 'application/json' },
      success: (res) => {
        if (res.data.state == 1) {
          resolve(res.data.data);
        } else {
          wx.showToast({
            title: res.data.message
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '不好意思服务器好像开小差了~'
        })
      }
    })
  })
}
module.exports = {
  formatTime: formatTime,
  fnHttp: fnHttp
}
