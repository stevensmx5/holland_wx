//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: 'https://www.hollandinfo.cn/xcx/sub/webservice/pageinfo.php',
          data:{
            Vcl_FunName: 'GetUserOpenId',
            Vcl_JsCode: res.code
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success:function(e){
            wx.setStorage({
              key: 'user_openid',
              data: e.data.OpenId
            })
            wx.getUserInfo({
              success:function(i){
                var userInfo = i.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender
                wx.request({
                  url: 'https://www.hollandinfo.cn/xcx/sub/webservice/pageinfo.php',
                  data:{
                    Vcl_FunName:'UploadUserInfo',
                    Vcl_OpenId: e.data.OpenId,
                    Vcl_Photo:avatarUrl,
                    Vcl_Nickname:nickName,
                    Vcl_Sex: gender
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  }
                })
              }
            })
            // console.log(e.data.OpenId)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log(res.authSetting['scope.userInfo'])
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  url: 'https://www.hollandinfo.cn/xcx/'
})