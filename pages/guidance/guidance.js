// pages/guidance/guidance.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    win_h:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thst=this
    var img_url = 'https://www.hollandinfo.cn/xcx/userdata/xcx/accounts/1/background_image_001.jpg'

    var img_src ="https://www.hollandinfo.cn/xcx/userdata/xcx/function/3/1/user_photo/102.jpg"
    var winH = wx.getSystemInfoSync().windowHeight + 'px'
    var winW = wx.getSystemInfoSync().windowWidth + 'px'
    var win_H = wx.getSystemInfoSync().windowHeight
    var win_W = wx.getSystemInfoSync().windowWidth
    var postcardbox_W = win_W-40
    var postcardbox_H = postcardbox_W*0.65
    var photo_w = (win_W - 60) * 0.55
    var photo_h = photo_w * 1.17
    //var postcard_w = win_W - 60
    var postcard_h = photo_h + 20
    var photo_img_w =''
    var photo_img_h =''
    var photo_dx=''
    var photo_dy=''
    var image_w=''
    var image_h=''
    
    this.setData({
      win_h: winH,
      win_w: winW
    })
    //console.log(winH)
    wx.getImageInfo({
      src: img_src,
      success: function (imginfo){
        var str = imginfo.width / imginfo.height
        if (str > 1) {//横版图片
          photo_img_h = photo_h
          photo_img_w = (photo_h / imginfo.height) * imginfo.width
          image_w = imginfo.height/1.17
          image_h = imginfo.height
          photo_dx = (imginfo.width - image_w) / 2
          photo_dy = 0

        } else {//竖版图片
          photo_img_w = photo_w
          photo_img_h = (photo_w / imginfo.width) * imginfo.height
          image_w = imginfo.width 
          image_h = imginfo.width * 1.17
          photo_dx = 0
          photo_dy = (imginfo.height - image_h) / 2
        }


        var ctx = wx.createCanvasContext('first', this)
        //var cxt=cvn.getContext('2d')

        // Draw coordinateswx.chooseImage({
        //绘制背景图
        ctx.drawImage(img_url, 0, 0, win_W, win_H)

        //绘制白色透明遮盖层
        ctx.setFillStyle('rgba(255,255,255,0.2)')
        ctx.fillRect(20, 25, postcardbox_W, postcardbox_H)
        ctx.setFillStyle('rgba(255,255,255,1)')
        ctx.fillRect(20, 25 + postcardbox_H, postcardbox_W, postcard_h)

        ctx.setFillStyle('rgba(255,255,255,0.7)')
        ctx.setFontSize('14')
        ctx.setTextAlign('left')
        ctx.fillText('艾芙琳梦幻世界', 31, 50, postcardbox_W - 10)
        ctx.fillText('艾芙琳梦幻世界', 29, 50, postcardbox_W - 10)
        ctx.fillText('艾芙琳梦幻世界', 30, 51, postcardbox_W - 10)
        ctx.fillText('艾芙琳梦幻世界', 30, 49, postcardbox_W - 10)
        ctx.setFillStyle('#593d3d')
        ctx.fillText('艾芙琳梦幻世界', 30, 50, postcardbox_W - 10)
        ctx.setShadow(0, 0, 100, '#fff')

        ctx.setFillStyle('rgba(255,255,255,0.7)')
        ctx.setFontSize('12')
        ctx.setTextAlign('left')
        ctx.fillText('Efteling', 31, 64, postcardbox_W - 10)
        ctx.fillText('Efteling', 29, 64, postcardbox_W - 10)
        ctx.fillText('Efteling', 30, 65, postcardbox_W - 10)
        ctx.fillText('Efteling', 30, 63, postcardbox_W - 10)
        ctx.setFillStyle('#593d3d')
        ctx.fillText('Efteling', 30, 64, postcardbox_W - 10)
        ctx.setShadow(0, 0, 100, '#fff')

        ctx.drawImage(img_src, photo_dx, photo_dy, image_w, image_h, 30, postcardbox_H + 35, photo_w, photo_h)

        ctx.draw()
      }
    })

    //var context = wx.createCanvasContext('first')

    
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