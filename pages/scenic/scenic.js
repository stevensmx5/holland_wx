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
    video_src:'',
    share_id: '',
    show: '0',
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
  favorit: function (e) {
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
  //图片高度自适应
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 160;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + 10 + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Hei: swiperH　　　　　　　　//设置高度
    })
  },
  scenic_info: function () {
    util.check_login()
    var that=this
    wx.getStorage({
      key: 'page_id',
      complete: function (pid) {
        wx.getStorage({
          key: 'user_openid',
          complete: function (uid) {
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
                //console.log(res.data)
                var name = decodeURIComponent(res.data.Name)
                var enname = decodeURIComponent(res.data.EnName)
                var description = decodeURIComponent(res.data.Discription)
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
                // console.log(description)

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
                  Description: description,
                  BackgroundImage: app.url + res.data.BackgroundImage,
                  Type: type,
                  fit: favorite,
                  SubProgram: sub_program,
                  Thirdparty: thirdparty,
                  share_id: pid.data
                })
                wx.hideLoading()
              },
              fail: function () {
                wx.showModal({
                  title: '数据加载失败',
                  content: '请检查您的网络，重新加载吧',
                  showCancel: false,
                  confirmText: '重新加载',
                  success: function (res) {
                    if (res.confirm) {
                      that.scenic_info()
                      wx.showLoading({
                        title: '加载中，请稍候',
                        mask: true
                      })
                    } else if (res.cancel) {
                      that.scenic_info()
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
              }
            })
          }
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '探索荷兰',
      path: '/pages/scenic/scenic?id=' + this.data.share_id,
      imageUrl: ''
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中，请稍候',
      mask: true
    })
    if (options.id>0){
      wx.setStorage({
        key: 'page_id',
        data: options.id,
      })
    }
    if (options.subid>0){
      wx.setStorage({
        key: 'thirdparty_id',
        data: options.subid,
      })
    }
    //console.log(options.subid)

    var that = this
    wx.getStorage({
      key: 'page_id',
      complete: function (pid) {
        wx.getStorage({
          key: 'user_openid',
          complete: function (uid) {
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
                var sub_program = res.data.SubProgram
                wx.getStorage({
                  key: 'thirdparty_id',
                  success: function (thi) {
                    for (var i = 0; i < sub_program.length; i++) {
                      var data = sub_program[i].Id;
                      var url = sub_program[i].Link;
                      if (thi.data == data) {
                        wx.setStorage({
                          key: 'navigate_page',
                          data: url,
                        })
                        wx.navigateTo({
                          url: '../guidance_web/guidance_web'
                        })
                        return;
                      }
                    }
                  },
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
              }
            })
          }
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
  onShow: function () {
    var that = this
    that.scenic_info()

    var winH = wx.getSystemInfoSync().windowHeight + 'px'
    this.setData({
      win_h: winH
    })

    wx.removeStorage({
      key: 'path_url',
      success: function(res) {},
    })
  },
  onReady: function () {
    this.videoContext=wx.createVideoContext('account_video')
  }, 
  closemes: function () {
    var that = this
    that.setData({
      show: 0
    })
  },
  guidance: function (event) {
    var that = this
    var btn_type = event.currentTarget.dataset.type
    var url = event.currentTarget.dataset.link
    // console.log(btn_type)
    if (btn_type == 0) {
      wx.setStorage({
        key: 'navigate_page',
        data: url,
      })
      wx.navigateTo({
        url: '../guidance_web/guidance_web'
      })
    } else if (btn_type == 1){
      wx.getSetting({
        success (gs){
          if (!gs.authSetting['scope.userInfo']) {
            that.setData({
              show:1
            })
          }else{
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
                          },
                          method: "POST",
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          success:function(op){
                            wx.navigateTo({
                              url: '../postcard/postcard'
                            })
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
        }
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