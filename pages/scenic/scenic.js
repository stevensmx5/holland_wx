//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loading: false,
    plain: false,
    buplic_url: app.url_test,
    recommend_scenic:[
      ['../../images/menu_img1.jpg', '../../images/menu_icon1.png', '导览'],
      ['../../images/menu_img2.jpg', '../../images/menu_icon2.png', '待定'],
      ['../../images/menu_img3.jpg', '../../images/menu_icon3.png', '待定'],
      ['../../images/menu_img2.jpg', '../../images/menu_icon2.png', '待定'],
      ['../../images/menu_img3.jpg', '../../images/menu_icon3.png', '待定'],
      ['../../images/menu_img1.jpg', '../../images/menu_icon1.png', '待定']
    ]
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
    var that = this
    wx.request({
      url: app.url_test + 'sub/webservice/pageinfo.php',
      data: {
        Vcl_FunName: 'GetHomepagePicture',
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          img_data: res.data,

        })
      }
    })
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
    wx.setTabBarItem({
      index: 1,
      text: '荷兰国立博物馆'
    }),
    wx.getStorage({
      key: 'page_id',
      success: function(res) {
        console.log(res.data)
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