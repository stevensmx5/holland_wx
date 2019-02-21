const app = getApp()
var util = require('../../utils/util.js')
// pages/postcardproduction/postcardproduction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  tabbar: function (event) {
    var btn_type = event.currentTarget.dataset.type
    // console.log(btn_type)
    if (btn_type == 1) {
      wx.switchTab({
        url: '../../pages/index/index'
      })
    } else if (btn_type == 2) {
      wx.switchTab({
        url: '../../pages/scenic/scenic'
      })
    } else if (btn_type == 3) {
      wx.switchTab({
        url: '../../pages/user/user'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //console.log(options.pageid)
    console.log(options.id)
    var account_id = options.pageid
    var postcardId = options.id

    wx.setStorage({
      key: 'page_id',
      data: account_id,
    })
    wx.setStorage({
      key: 'postcard_id',
      data: postcardId,
    })

    util.check_login()
    
    wx.getStorage({
      key: 'user_openid',
      complete: function (uid) {
        wx.request({
          url: app.url + 'sub/webservice/pageinfo.php',
          data: {
            Vcl_FunName: 'GetAccountBaseInfo',
            Vcl_Id: account_id,
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


            wx.setStorage({
              key: 'page_id',
              data: res.data.Id
            })
            that.setData({
              ChName: name,
              EnName: enname,
              BackgroundImage: app.url + res.data.BackgroundImage,
            })
            wx.request({
              url: app.url + 'sub/webservice/pageinfo.php',
              data: {
                Vcl_FunName: 'GetFunction3Info',
                Vcl_Id: postcardId
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success:function(post_info){
                var post_date = post_info.data.Date
                var post_text = post_info.data.Text
                var post_by = post_info.data.By
                var img = app.url + post_info.data.Photo

                var p_w = (wx.getSystemInfoSync().windowWidth - 60) * 0.55;
                var p_h = p_w * 1.17;
                console.log(img)
                wx.getImageInfo({
                  src: img,
                  success:function(imginfo){
                    var str = imginfo.width / imginfo.height;//图片的宽高比
                    if (str > 1) {//横版图片
                      that.setData({
                        height: p_h,
                        width: (p_h / imginfo.height) * imginfo.width
                      })

                    } else {//竖版图片
                      that.setData({
                        width: p_w,
                        height: (p_w / imginfo.width) * imginfo.height
                      })
                    }
                  }
                })
                that.setData({
                  Date: post_date,
                  Text: post_text,
                  By: post_by,
                  Photo: img
                })

                wx.hideLoading()
              }
            })

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
      }
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
    var winH = wx.getSystemInfoSync().windowHeight + 'px';
    var p_w = (wx.getSystemInfoSync().windowWidth - 60) * 0.55;
    var p_h = p_w * 1.17;
    var photoH = p_h + 'px';
    this.setData({
      win_h: winH,
      photoH: photoH
    })
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
    wx.getStorage({
      key: 'page_id',
      success: function(pid) {
        wx.getStorage({
          key: 'postcard_id',
          success: function(postid) {
            return {
              title: '探索荷兰',
              path: '/pages/postcardproduction/postcardproduction?id=' + postid.data + '&pageid=' + pid.data,
              imageUrl: ''
            }
          },
        })
      },
    })
  }
})