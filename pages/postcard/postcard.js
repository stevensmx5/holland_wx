const app = getApp()
var util = require('../../utils/util.js')
// pages/postcard/postcard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  photoupload:function(){
    var that=this
    var p_w = (wx.getSystemInfoSync().windowWidth - 60) * 0.55;
    var p_h = p_w * 1.17;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (img) {
        wx.getImageInfo({
          src: img.tempFilePaths[0],
          success: function (res) {
            // console.log(res.width);
            // console.log(res.height);
            //console.log(res.path)
            var str = res.width / res.height;//图片的宽高比
            if (str > 1) {//横版图片
              that.setData({
                height: p_h,//图片的显示高度为400
                width: (p_h / res.height)* res.width,
                src:res.path,
                Img_Path: img.tempFilePaths
              })
              // this.data.height = 400;//图片的显示高度为400
              // this.data.width = str * this.data.height; //图片的宽度 = 宽高比 * 图片的显示高度

            } else {//竖版图片
              that.setData({
                width: p_w,//图片的显示高度为400
                height: (p_w / res.width) * res.height,
                src: res.path,
                Img_Path: img.tempFilePaths
              })
              // this.data.width = 400;//图片的显示宽度为400
              // this.data.height = str * this.data.width; //图片的高度 = 宽高比 * 图片的显示宽度
            }

            wx.setStorage({
              key: 'path_url',
              data: img.tempFilePaths[0],
            })
          }
        })
      }
    })
  },
  thirdparty: function (event) {
    var id = event.currentTarget.dataset.appid
    var page = event.currentTarget.dataset.page
    wx.navigateToMiniProgram({
      appId: 'wxddf8176de07c7d9a',
      path: 'pages/start/start',
      envVersion: 'release',
    })
  },
  tabbar: function (event){
    var btn_type = event.currentTarget.dataset.type
    // console.log(btn_type)
    if (btn_type==1){
      wx.switchTab({
        url:'../../pages/index/index'
      })
    }else if(btn_type == 2){
      wx.switchTab({
        url: '../../pages/scenic/scenic'
      })
    }else if(btn_type == 3){
      wx.switchTab({
        url: '../../pages/user/user'
      })
    }
  },
  postcardSubmit:function(e){
    var that=this
    var content= e.detail.value.content
    var by_name = e.detail.value.username
    if (content == '' && by_name == ''){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入您想说的话和您的名字',
      })
    } else if (content == ''){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入您想说的话',
      })
    } else if (by_name == ''){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入您的名字',
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: true,
        content: '请注意，每个景点只保留一张明信片，如果上传将覆盖之前的明信片，是否继续？',
        success: function(reminder){
          if (reminder.confirm){
            wx.getStorage({
              key: 'path_url',
              success: function (nomore) {
                wx.getStorage({
                  key: 'page_id',
                  success: function (pid) {
                    wx.getStorage({
                      key: 'user_openid',
                      success: function (uid) {
                        wx.getStorage({
                          key: 'torday_date',
                          success: function (t_date) {
                            wx.showLoading({
                              title: '图片上传中，请稍候',
                              mask: true
                            })
                            wx.uploadFile({
                              url: app.url + 'sub/webservice/pageinfo.php',
                              filePath: that.data.Img_Path[0],
                              name: 'Photo',
                              formData: {
                                Vcl_FunName: 'UploadDataFor3',
                                Vcl_OpenId: uid.data,
                                Vcl_AccountId: pid.data,
                                Vcl_Date: t_date.data,
                                Vcl_Text: e.detail.value.content,
                                Vcl_By: e.detail.value.username
                              },
                              success: function (res) {
                                var p_id = res.data
                                //console.log(p_id)
                                wx.setStorage({
                                  key: 'postcard_id',
                                  data: p_id,
                                })
                                wx.navigateTo({
                                  url: '../postcardproduction/postcardproduction?id=' + p_id + '&pageid=' + pid.data
                                })
                                wx.hideLoading()
                              },
                              fail: function () {

                              }
                            })
                          }
                        })

                      },
                    })

                  },
                })
              },
              fail: function () {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: '请选择照片',
                })
              }
            })
          }
          
        }
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中，请稍候',
      mask: true
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
    var that=this
    var winH = wx.getSystemInfoSync().windowHeight + 'px';
    var p_w = (wx.getSystemInfoSync().windowWidth -60)*0.55;
    var p_h = p_w * 1.17;
    var photoH = p_h + 'px';
    this.setData({
      win_h: winH,
      photoH: photoH
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var Dat = Y + '-' + M + '-' + D;
    wx.setStorage({
      key: 'torday_date',
      data: Dat,
    })
    that.setData({
      todatDate: Dat
    })

    util.check_login()
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
                var name = decodeURIComponent(res.data.Name)
                var enname = decodeURIComponent(res.data.EnName)
                var bg_img = res.data.BackgroundImage
                var postcard_bg = res.data.Background3Image

                wx.setStorage({
                  key: 'page_id',
                  data: res.data.Id
                })
                that.setData({
                  ChName: name,
                  EnName: enname,
                  BackgroundImage: app.url + res.data.Background3Image,
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
          }
        })
      }
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
  
  }
})