// pages/searchlist/searchlist.js
const app = getApp()
var search_val = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_text: '',
    buplic_url: app.url,
    bg_url: 'images/home_background.jpg',
    win_h: ''
  },
  get_val: function (e) {
    search_val = e.detail.value
    wx.setStorage({
      key: 'index_search',
      data: search_val
    })
    // console.log(search_val)
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
  sceniclist_info: function () {
    var that = this
    wx.getStorage({
      key: 'index_search',
      success: function (search_key) {
        //console.log(search_key.data)
        wx.request({
          url: app.url + 'sub/webservice/pageinfo.php',
          data: {
            Vcl_FunName: 'GetSearchResult',
            Vcl_Key: search_key.data
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              Search_Val: res.data,
              Num: res.data.length,
              input_text: search_key.data
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
                  that.sceniclist_info()
                  wx.showLoading({
                    title: '加载中，请稍候',
                    mask: true
                  })
                } else if (res.cancel) {
                  that.sceniclist_info()
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.sceniclist_info()
    var winH = wx.getSystemInfoSync().windowHeight + 'px'
    this.setData({
      win_h: winH
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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