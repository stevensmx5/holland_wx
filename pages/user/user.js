// pages/user/user.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:0,
    buplic_url: app.url,
  },
  recordtype: function () {
    var n = this.data.check;
    var that = this
    //console.log(n)
    if (n == 0) {
      this.setData({
        check: 1
      })
      wx.getStorage({
        key: 'user_openid',
        success: function (uid) {

          wx.request({
            url: app.url + 'sub/webservice/pageinfo.php',
            data: {
              Vcl_FunName: 'GetUserHistoryList',
              Vcl_OpenId: uid.data
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              that.setData({
                favorit_data: res.data
              })
            }
          })
        }
      })
    } else {
      this.setData({
        check: 0
      })
      wx.getStorage({
        key: 'user_openid',
        success: function (uid) {
          wx.request({
            url: app.url + 'sub/webservice/pageinfo.php',
            data: {
              Vcl_FunName: 'GetUserFavoriteList',
              Vcl_OpenId: uid.data
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              that.setData({
                favorit_data: res.data
              })
            }
          })

        }
      })
    }
  },
  scenic_page: function (e) {
    var id = e.target.id
    wx.setStorage({
      key: 'page_id',
      data: id
    })
    wx.switchTab({
      url: '../scenic/scenic'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    this.setData({
      check: 0
    })
    wx.getStorage({
      key: 'user_openid',
      success: function (uid) {
        wx.request({
          url: app.url + 'sub/webservice/pageinfo.php',
          data: {
            Vcl_FunName: 'GetUserFavoriteList',
            Vcl_OpenId: uid.data
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              favorit_data: res.data
            })
          }
        })

        wx.request({
          url: app.url + 'sub/webservice/pageinfo.php',
          data: {
            Vcl_FunName: 'GetUserHistoryList',
            Vcl_OpenId: uid.data
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              history: res.data
            })
            console.log(res.data)
          }
        })
      },
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})