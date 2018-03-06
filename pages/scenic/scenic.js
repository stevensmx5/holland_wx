//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loading: false,
    plain: false,
    buplic_url: app.url_test,
    buplic_url: app.url_test
  },
  guidance:function(){
    wx.navigateTo({
      url: '../guidancecompanion/guidancecompanion'
    })
  },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 160;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + 10 + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Hei: swiperH　　　　　　　　//设置高度
    })
  },
  onLoad: function () {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    var that = this
    wx.setTabBarItem({
      index: 1,
      text: '荷兰国立博物馆'
    }),
    wx.getStorage({
      key: 'page_id',
      success: function(res) {
        // console.log(res.data)

        
        wx.request({
          url: app.url_test + 'sub/webservice/pageinfo.php',
          data: {
            Vcl_FunName: 'GetAccountBaseInfo',
            Vcl_Id: res.data,
            Vcl_OpenId:'1234567890'
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var name = decodeURIComponent(res.data.Name)
            var enname = decodeURIComponent(res.data.EnName)
            var bg_img = res.data.BackgroundImage
            var type = decodeURIComponent(res.data.Type)
            var sub_program = res.data.SubProgram
            for (var i = 0; i < sub_program.length; i++) {
              var data = sub_program[i].Name;
              sub_program[i].Name = decodeURIComponent(data)  
            } 

            that.setData({
              ChName: name,
              EnName: enname,
              BackgroundImage: app.url_test + bg_img,
              Type: type,
              SubProgram: sub_program
            })
            // console.log(res.data)
            // console.log(enname)
            // console.log(bg_img)
            // console.log(type)
            // console.log(sub_program)
            // console.log(JSON.parse(program))
          }
        })
      },
    })
    
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})