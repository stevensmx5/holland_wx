//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    loading: false,
    plain: false,
    buplic_url: app.url,
    fit:0
  },
  guidance:function(){
    wx.navigateTo({
      url: '../guidance/guidance'
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
    wx.getStorage({
      key: 'page_id',
      success: function(id) {
        wx.getStorage({
          key: 'user_openid',
          success: function(uid) {
            wx.request({
              url: app.url + 'sub/webservice/pageinfo.php',
              data: {
                Vcl_FunName: 'GetAccountBaseInfo',
                Vcl_Id: id.data,
                Vcl_OpenId: uid.data
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
                var favorite = res.data.Favorite
                var sub_program = res.data.SubProgram
                for (var i = 0; i < sub_program.length; i++) {
                  var data = sub_program[i].Name;
                  sub_program[i].Name = decodeURIComponent(data)
                }

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
                  SubProgram: sub_program
                })
              }
            })
            wx.request({
              url: app.url + 'sub/webservice/pageinfo.php',
              data: {
                Vcl_FunName: 'UserHistoryAdd',
                Vcl_AccountId: id.data,
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})