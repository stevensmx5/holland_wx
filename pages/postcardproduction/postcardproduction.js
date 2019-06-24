// pages/guidance/guidance.js
const app = getApp()
var util = require('../../utils/util.js')
var win_W = ''
var win_H = ''
var sendmes=0
Page({

  /**
   * 页面的初始数据
   */

  data: {
    win_h: '',
    show:'',
    sign_in:'',
    send_mes: '',
    mes:'',
    send_text:'发送验证码',
    name:'',
    address:'',
    phone:'',
    yzm:''
  },
  getInput: function (e) {
    let changed = {};
    let model = e.currentTarget.dataset.model
    changed[model] = e.detail.value;
    this.setData(changed)
  },
  send_yzm: function () {
    var that = this
    if (that.data.phone==''){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    } else if (that.data.phone.length!=11){
      wx.showToast({
        title: '手机号码长度有误',
        icon: 'none'
      })
    }else{
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(that.data.phone)) {
        wx.showToast({
          title: '手机号有误！',
          icon: 'none'
        })
      }else{
        if (sendmes == 0) {
          var str = "",
            range = 4,//min
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
          for (var i = 0; i < range; i++) {
            var pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
          }
          //console.log(str)
          countDown(that, 60)
          wx.request({
            url: app.url + 'sub/webservice/pageinfo.php',
            data: {
              Vcl_FunName: 'SendSmsCode',
              Vcl_Phone: that.data.phone,
              Vcl_Code: str
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.result == 1) {
                wx.setStorage({
                  key: 'send_mes',
                  data: str,
                })
              }
            }
          })
        }
      }
    }
  },
  closemes: function () {
    var that = this
    that.setData({
      show: 0
    })
    loadpostcard(this)
  },
  signIn: function () {
    var that = this
    if (that.data.name==''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    } else if (that.data.address==''){
      wx.showToast({
        title: '请输入地址',
        icon: 'none'
      })
    } else if (that.data.phone==''){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    } else if (that.data.yzm==''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }else{
      wx.getStorage({
        key: 'user_openid',
        complete: function (uid) {
          wx.getStorage({
            key: 'send_mes',
            success: function(res) {
              if (res.data == that.data.yzm){
                wx.request({
                  url: app.url + 'sub/webservice/pageinfo.php',
                  data: {
                    Vcl_FunName: 'Register',
                    Vcl_OpenId: uid.data,
                    Vcl_Name: that.data.name,
                    Vcl_Address: that.data.address,
                    Vcl_Phone: that.data.phone
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (sign) {
                    if (sign.data.Result == 1) {
                      wx.showModal({
                        title: '成功提示', 
                        content: '信息提交成功',
                        showCancel:false,
                        success:function(res){
                          if (res.confirm) {
                            loadpostcard(that)
                          } 
                        }
                      })
                    }
                    that.setData({
                      show: 0
                    })
                  }
                })

              }else{
                console.log(that.data.yzm)
                console.log(res.data)
                wx.showToast({
                  title: '验证码错误',
                  icon: 'none'
                })
              }

            },
          })

        }
      })
    }
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
  savePostCard: function () {
    var temp_url = ''
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: win_W,
      height: win_H,
      destWidth: 750,
      destHeight: 1000,
      canvasId: 'first',
      fileType: 'jpg',
      quality: 1,
      success: function (res) {
        temp_url = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: temp_url,
        })
        wx.showToast({
          title: '您已成功保存',
          icon: 'none'
        })
      }
    }, this)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //console.log(options.pageid)
    //console.log(options.id)

    win_W = wx.getSystemInfoSync().windowWidth
    var postcardbox_W = win_W - 40
    var postcardbox_H = postcardbox_W * 0.65
    var photo_w = (win_W - 60) * 0.55
    var photo_h = photo_w * 1.17
    //var postcard_w = win_W - 60
    var postcard_h = photo_h + 20
    win_H = postcardbox_H + postcard_h + 60
    var winW = win_W + 'px'
    var winH = win_H + "px"
    that.setData({
      win_h: winH,
      win_w: winW,
    })
    
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
      success: function (uid) {
        wx.request({
          url: app.url + 'sub/webservice/pageinfo.php',
          data: {
            Vcl_FunName: 'GetEventRegister',
            Vcl_OpenId: uid.data
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (reg) {
            console.log(reg.data)
            if (reg.data.Result == 0) {
              that.setData({
                show: 0,
                sign_in: 0
              })
              loadpostcard(that)
            } else if (reg.data.Result == 1) {
              that.setData({
                show: 1,
                sign_in: 1,
                mes: reg.data.Msg
                
              })
            } else {
              that.setData({
                show: 1,
                sign_in: 0,
                mes: reg.data.Msg
              })
            }
          }
        })
      },
    })
    wx.getStorage({
      key: 'user_openid',
      complete: function (uid) {
        wx.getStorage({
          key: 'page_id',
          success: function (res) {
            wx.request({
              url: app.url + 'sub/webservice/pageinfo.php',
              data: {
                Vcl_FunName: 'GetAccountBaseInfo',
                Vcl_Id: res.data,
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
                // console.log(app.url + bg_img)


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
                  BackgroundImage: app.url + bg_img,
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
          },
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
      success: function (pid) {
        wx.getStorage({
          key: 'postcard_id',
          success: function (postid) {
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
function countDown(that, count) {
  if (count == 0) {
    that.setData({
      send_text: '发送验证码',
      send_mes:0
    })
    sendmes=0
    return;
  }
  sendmes = 1
  that.setData({
    send_text: count,
    send_mes:1
  })
  setTimeout(function () {
    count--;
    countDown(that, count);
  }, 1000);
}
function loadpostcard(that) {
  win_W = wx.getSystemInfoSync().windowWidth
  var postcardbox_W = win_W - 40
  var postcardbox_H = postcardbox_W * 0.65
  var photo_w = (win_W - 60) * 0.55
  var photo_h = photo_w * 1.17
  //var postcard_w = win_W - 60
  var postcard_h = photo_h + 20
  var photo_img_w = ''
  var photo_img_h = ''
  var photo_dx = ''
  var photo_dy = ''
  var image_w = ''
  var image_h = ''
  var drawtext_x = photo_w + 50 + (win_W - photo_w - 90) / 2
  var drawtext_w = postcardbox_W - photo_w - 50
  var lineWidth = 0
  var lastSubStrIndex = 0
  var initY = postcardbox_H + (drawtext_w * 0.27) + 57
  var flyimg_w = drawtext_w * 0.37
  var flyimg_h = ''
  win_H = postcardbox_H + postcard_h + 60
  var kgb = win_W / win_H
  var bg_img_w, bg_img_h, img_url

  wx.getImageInfo({
    src: '../../images/fly.png',
    success: function (res) {
      flyimg_h = flyimg_w * 0.83
    }
  })
  wx.getStorage({
    key: 'user_openid',
    complete: function (uid) {
      wx.getStorage({
        key: 'page_id',
        success: function(res) {
          wx.request({
            url: app.url + 'sub/webservice/pageinfo.php',
            data: {
              Vcl_FunName: 'GetAccountBaseInfo',
              Vcl_Id: res.data,
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
              // console.log(app.url + bg_img)


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
                BackgroundImage: app.url + bg_img,
              })
              wx.getStorage({
                key: 'postcard_id',
                success: function(post) {
                  wx.request({
                    url: app.url + 'sub/webservice/pageinfo.php',
                    data: {
                      Vcl_FunName: 'GetFunction3Info',
                      Vcl_Id: post.data
                    },
                    method: "POST",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (post_info) {
                      var post_date = post_info.data.Date
                      var post_text = post_info.data.Text
                      var post_by = post_info.data.By
                      var img = app.url + post_info.data.Photo


                      wx.downloadFile({
                        url: app.url + bg_img,
                        success: function (bg) {
                          var img_url = bg.tempFilePath
                          wx.getImageInfo({
                            src: img_url,
                            success: function (bginfo) {
                              bg_img_w = bginfo.width
                              bg_img_h = bg_img_w / kgb
                              wx.downloadFile({
                                url: img,
                                success: function (res) {
                                  var img_src = res.tempFilePath
                                  wx.getImageInfo({
                                    src: img_src,
                                    success: function (imginfo) {
                                      var str = imginfo.width / imginfo.height
                                      if (str > 1) {
                                        photo_img_h = photo_h
                                        photo_img_w = (photo_h / imginfo.height) * imginfo.width
                                        image_w = imginfo.height / 1.17
                                        image_h = imginfo.height
                                        photo_dx = (imginfo.width - image_w) / 2
                                        photo_dy = 0
                                      } else {
                                        photo_img_w = photo_w
                                        photo_img_h = (photo_w / imginfo.width) * imginfo.height
                                        image_w = imginfo.width
                                        image_h = imginfo.width * 1.17
                                        photo_dx = 0
                                        photo_dy = (imginfo.height - image_h) / 2
                                      }


                                      var ctx = wx.createCanvasContext('first', this)

                                      ctx.drawImage(img_url, 0, 0, bg_img_w, bg_img_h, 0, 0, win_W, win_H)

                                      ctx.setFillStyle('rgba(255,255,255,0.2)')
                                      ctx.fillRect(20, 25, postcardbox_W, postcardbox_H)
                                      ctx.setFillStyle('rgba(255,255,255,1)')
                                      ctx.fillRect(20, 25 + postcardbox_H, postcardbox_W, postcard_h)

                                      ctx.drawImage(img_src, photo_dx, photo_dy, image_w, image_h, 30, postcardbox_H + 35, photo_w, photo_h)
                                      ctx.drawImage('../../images/fly.png', win_W - flyimg_w - 32, initY + 25 + drawtext_w * 0.30, flyimg_w, flyimg_h)

                                      ctx.setFillStyle('rgba(255,255,255,0.7)')
                                      ctx.setFontSize('14')
                                      ctx.setTextAlign('left')
                                      ctx.fillText(name, 31, 50, postcardbox_W - 10)
                                      ctx.fillText(name, 29, 50, postcardbox_W - 10)
                                      ctx.fillText(name, 30, 51, postcardbox_W - 10)
                                      ctx.fillText(name, 30, 49, postcardbox_W - 10)
                                      ctx.setFillStyle('#593d3d')
                                      ctx.fillText(name, 30, 50, postcardbox_W - 10)

                                      ctx.setFillStyle('rgba(255,255,255,0.7)')
                                      ctx.setFontSize('12')
                                      ctx.setTextAlign('left')
                                      ctx.fillText(enname, 31, 64, postcardbox_W - 10)
                                      ctx.fillText(enname, 29, 64, postcardbox_W - 10)
                                      ctx.fillText(enname, 30, 65, postcardbox_W - 10)
                                      ctx.fillText(enname, 30, 63, postcardbox_W - 10)
                                      ctx.setFillStyle('#593d3d')
                                      ctx.fillText(enname, 30, 64, postcardbox_W - 10)
                                      ctx.fillText('Netherlands', photo_w + 55, initY + 48 + drawtext_w * 0.3, drawtext_w)
                                      ctx.setTextAlign('center')
                                      ctx.fillText(post_date, drawtext_x, postcardbox_H + 45, drawtext_w)
                                      ctx.fillText('by:' + post_by, drawtext_x, postcardbox_H + 45 + photo_h - 20, drawtext_w)

                                      ctx.setFillStyle('#d9d9d9')
                                      ctx.fillRect(photo_w + 50, initY + 48 + drawtext_w * 0.3 + 7, drawtext_w, 1)
                                      ctx.fillRect(photo_w + 50, postcardbox_H + 45 + photo_h - 13, drawtext_w, 1)


                                      ctx.setTextAlign('left')
                                      ctx.setFillStyle('#593d3d')
                                      for (let i = 0; i < post_text.length; i++) {
                                        lineWidth += ctx.measureText(post_text[i]).width
                                        if (lineWidth > drawtext_w) {
                                          ctx.fillText(post_text.substring(lastSubStrIndex, i), photo_w + 50, initY, drawtext_w)
                                          initY += 16
                                          lineWidth = 0
                                          lastSubStrIndex = i
                                        }
                                        if (i == post_text.length - 1) {//绘制剩余部分
                                          ctx.fillText(post_text.substring(lastSubStrIndex, i + 1), photo_w + 50, initY, drawtext_w)
                                        }
                                      }
                                      ctx.draw()
                                    }
                                  })
                                }
                              })
                            }
                          })
                        }
                      })

                      wx.hideLoading()
                    }
                  })
                },
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
        },
      })
     
    }
  })
}