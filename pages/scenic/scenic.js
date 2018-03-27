//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');


var page_id
Page({
  data: {
    loading: false,
    plain: false,
    buplic_url: app.url,
    fit:0,
    video_src:''
  },

  
  thirdparty: function (event) {
    var id = event.currentTarget.dataset.appid
    var page = event.currentTarget.dataset.page
    wx.navigateToMiniProgram({
      appId: id,
      path: page,
      envVersion: 'release',
      // success:function(){
      //   console.log(id)
      // }
    })
  },
  favorit:function(e){
    var that=this
    var a = e.target.id
    util.check_login()
    wx.getStorage({
      key: 'page_id',
      success: function(pid) {
        wx.getStorage({
          key: 'user_openid',
          success: function(uid) {
            if (a == 0) {
              wx.request({
                url: app.url + 'sub/webservice/pageinfo.php',
                data: {
                  Vcl_FunName: 'UserFavoriteAdd',
                  Vcl_AccountId: pid.data,
                  Vcl_OpenId: uid.data
                }, 
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success:function(res){
                  that.setData({
                    fit: 1
                  })
                }
              })
              wx.showToast({
                title: '您已成功收藏',
                icon: 'none'
              })
            } else {
              wx.request({
                url: app.url + 'sub/webservice/pageinfo.php',
                data: {
                  Vcl_FunName: 'UserFavoriteDelete',
                  Vcl_AccountId: pid.data,
                  Vcl_OpenId: uid.data
                },
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function () {
                  that.setData({
                    fit: 0
                  })
                }
              })
              wx.showToast({
                title: '取消收藏',
                icon:'none'
              })
            }
          },
        })
      },
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
  onLoad: function (options) {

    if (options.id>0){
      wx.setStorage({
        key: 'page_id',
        data: options.id,
      })
    }


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
  onShow: function (options) {
    var that = this

    wx.getStorage({
      key: 'page_id',
      success: function (res) {
        page_id = res.data
      },
    })

    console.log(page_id)
    wx.getStorage({
      key: 'page_id',
      complete: function(pid) {
        wx.getStorage({
          key: 'user_openid',
          complete: function(uid) {
            wx.request({
              url: app.url + 'sub/webservice/pageinfo.php',
              data: {
                Vcl_FunName: 'GetAccountBaseInfo',
                Vcl_Id: pid.data,
                Vcl_OpenId: uid.data
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                // console.log(res.data)
                var name = decodeURIComponent(res.data.Name)
                var enname = decodeURIComponent(res.data.EnName)
                var bg_img = res.data.BackgroundImage
                var type = decodeURIComponent(res.data.Type)
                var favorite = res.data.Favorite
                var sub_program = res.data.SubProgram
                for (var i = 0; i < sub_program.length; i++) {
                  var data = sub_program[i].Name;
                  sub_program[i].Name = decodeURIComponent(data)
                }
                var thirdparty = res.data.Thirdparty
                for (var i = 0; i < thirdparty.length; i++) {
                  var data = thirdparty[i].Name;
                  thirdparty[i].Name = decodeURIComponent(data)
                }
                // console.log(sub_program)

                wx.setStorage({
                  key: 'page_id',
                  data: res.data.Id
                })

                wx.setTabBarItem({
                  index: 1,
                  text: name
                })
                that.setData({
                  ChName: name,
                  EnName: enname,
                  BackgroundImage: app.url + res.data.BackgroundImage,
                  Type: type,
                  fit: favorite,
                  SubProgram: sub_program,
                  Thirdparty:thirdparty
                })
              }
            })
            wx.request({
              url: app.url + 'sub/webservice/pageinfo.php',
              data: {
                Vcl_FunName: 'UserHistoryAdd',
                Vcl_AccountId: pid.data,
                Vcl_OpenId: uid.data
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              // success:function(res){
              //   console.log(id.data)
              // }
            })
          }
        })
        
      },
    })
    
  },
  onReady:function(){
    this.videoContext=wx.createVideoContext('account_video')
  },
  guidance: function (event) {
    var btn_type = event.currentTarget.dataset.type
    var url = event.currentTarget.dataset.link
    // console.log(id)
    if (btn_type == 0) {
      wx.setStorage({
        key: 'navigate_page',
        data: url,
      })
      wx.navigateTo({
        url: '../guidance_web/guidance_web'
      })
    } else if (btn_type == 2) {
      //console.log(app.url+url)
      this.setData({
        video_src: app.url + url
      })
      this.videoContext.play()
      this.videoContext.requestFullScreen()
    }
  },
  screen_change:function(event){
    if (event.detail.fullScreen){
      this.videoContext.play()
    } else {
      this.videoContext.pause()
    }
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})