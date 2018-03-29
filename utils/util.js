const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const app = getApp()
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function user_login(){
  wx.login({
    success: res => {
      wx.request({
        url: 'https://www.hollandinfo.cn/xcx/sub/webservice/pageinfo.php',
        data: {
          Vcl_FunName: 'GetUserOpenId',
          Vcl_JsCode: res.code
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (e) {
          wx.setStorage({
            key: 'user_openid',
            data: e.data.OpenId
          })
          wx.getUserInfo({
            success: function (i) {
              var userInfo = i.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender
              wx.request({
                url: 'https://www.hollandinfo.cn/xcx/sub/webservice/pageinfo.php',
                data: {
                  Vcl_FunName: 'UploadUserInfo',
                  Vcl_OpenId: e.data.OpenId,
                  Vcl_Photo: avatarUrl,
                  Vcl_Nickname: nickName,
                  Vcl_Sex: gender
                }
              })
            }
          })
          // console.log(e.data.OpenId)
        }
      })
    }
  })
}
function check_login(){
  wx.checkSession({
    sunccess:function(){
      console.log(1)
    },
    fail:function(){
      wx.login({
        success: res => {
          wx.request({
            url: 'https://www.hollandinfo.cn/xcx/sub/webservice/pageinfo.php',
            data: {
              Vcl_FunName: 'GetUserOpenId',
              Vcl_JsCode: res.code
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (e) {
              wx.setStorage({
                key: 'user_openid',
                data: e.data.OpenId
              })
              wx.getUserInfo({
                success: function (i) {
                  var userInfo = i.userInfo
                  var nickName = userInfo.nickName
                  var avatarUrl = userInfo.avatarUrl
                  var gender = userInfo.gender
                  wx.request({
                    url: 'https://www.hollandinfo.cn/xcx/sub/webservice/pageinfo.php',
                    data: {
                      Vcl_FunName: 'UploadUserInfo',
                      Vcl_OpenId: e.data.OpenId,
                      Vcl_Photo: avatarUrl,
                      Vcl_Nickname: nickName,
                      Vcl_Sex: gender
                    }
                  })
                }
              })
              // console.log(e.data.OpenId)
            }
          })
        }
      })
    }
  })
}
module.exports = {
  formatTime: formatTime,
  user_login: user_login,
  check_login: check_login
}
