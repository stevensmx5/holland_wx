//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var search_val='';
Page({
  data: {
    loading: false,
    plain: false,
    buplic_url: app.url,
    bg_url: 'images/home_background.jpg',
    win_h: ''
  },
  get_val:function(e){
    search_val= e.detail.value
    wx.setStorage({
      key:'index_search',
      data: search_val
    })
    //console.log(search_val)
  },
  search:function(){
    wx.navigateTo({
      url: '../searchlist/searchlist'
    })
  },
  canvastest: function () {
    wx.navigateTo({
      url: '../guidance/guidance'
    })
  },
  test:function(){
    wx.navigateTo({
      url: '../postcardproduction/postcardproduction?id=50&pageid=1'
    })
  },
  thirdparty:function(event){
    var id = event.currentTarget.dataset.appid
    var page = event.currentTarget.dataset.page
    wx.navigateToMiniProgram({
      appId:id,
      path:page,
      envVersion: 'release',
      // success:function(){
      //   console.log(id)
      // }
    })
  },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth-160;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + 10 + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Hei: swiperH　　　　　　　　//设置高度
    })
  },
  scenic_page:function(e){
    var id=e.target.id
    wx.setStorage({
      key: 'page_id',
      data: id
    })

    wx.switchTab({
      url: '../scenic/scenic'
    })
    
    // if (id == 1) {
    // }
  },
  index_info:function(){
    util.check_login()
    var that = this
    wx.request({
      url: app.url + 'sub/webservice/pageinfo.php',
      data: {
        Vcl_FunName: 'GetHomepageInfo',
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          img_data: res.data.Accounts,
          thirdparty_data: res.data.Thirdparty
        })
        wx.hideLoading()
      },
      fail: function () {
        wx.showModal({
          title: '数据加载失败',
          content: '请检查您的网络，重新加载吧',
          showCancel: false,
          confirmText:'重新加载',
          success: function (res) {
            if (res.confirm) {
              that.index_info()
              wx.showLoading({
                title: '加载中，请稍候',
                mask: true
              })
            } else if (res.cancel){
              that.index_info()
              wx.showLoading({
                title: '加载中，请稍候',
                mask: true
              })
            }
          }
        })
        wx.hideLoading()
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '探索荷兰',
      path: '/pages/index/index',
      imageUrl:''
    }
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中，请稍候',
      mask:true
    })
    var that = this
    that.index_info()
    
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
    var winH = wx.getSystemInfoSync().windowHeight + 'px'
    this.setData({
      win_h: winH
    })
    // wx.setTabBarItem({
    //   index: 1,
    //   text: '景点'
    // })
  },
  onReady:function(){
  },
  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
