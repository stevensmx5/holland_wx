// pages/guidance/guidance.js
const app = getApp()
var input_text = '输入导览编号'
var t = ''
var a=1
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    text: input_text,
    win_h:'',
  },
  tap_key:function(e){
    var i = e.target.id
    if (a==1){
      t=''
      a=0
    }
    this.setData({
      text: t += i
    })
  },
  remove_key:function(){
    t = t.substring(0, t.length - 1)
    if (t.length > 0 && a==0){
      this.setData({
        text: t
      })
    }else{
      a=1
      t = '输入导览编号'
      this.setData({
        text: t
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thst=this

    var winH = wx.getSystemInfoSync().windowHeight+'px'
    this.setData({
      win_h: winH
    })
    console.log(winH)
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
  
  }
})