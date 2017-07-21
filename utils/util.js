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
function httpPost(url,data, callback) {
  wx.request({
    url: url,
    data: data,
    method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      callback(res.data);
    },
    fail: function (res) {
    },
    complete: function (res) {
    }
  })
}

module.exports = {
  formatTime: formatTime,
  httpPost: httpPost
}
