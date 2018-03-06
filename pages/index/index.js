//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loading: false,
    plain: false,
    buplic_url: app.url_test
  },
  //https://www.amsterdamairportschiphol.cn/app/hollandinfo/xcx/
  search:function(){
    wx.navigateTo({
      url: '../searchlist/searchlist'
    })
  },
  // onReady:function(){
  //   this.topbar=this.selectComponent("#topbar");
  // },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth-160;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + 10 + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Hei: swiperH　　　　　　　　//设置高度
    })
  },
  scenic_page:function(){
    // var id=e.target.id
    // wx.setStorage({
    //   key: 'page_id',
    //   data: id
    // })
    wx.switchTab({
      url: '../scenic/scenic'
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
        var img_data = res.data
        // for (i = 0; i < img_date.length; i++) {
        //   var img_id = img_date[i][0]
        //   var img_url = img_date[i][1]
        // }
        // console.log(img_id)
        // console.log(img_url)
        that.setData({
          img_data:res.data,

        })

        // console.log(img_data)
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  onShow: function () {
    wx.setTabBarItem({
      index: 1,
      text: '景点'
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
