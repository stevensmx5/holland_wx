Component({
  data:{
    topbar: 0,
  },
  methods:{
    clickbar: function () {
      var n = this.data.topbar;
      //console.log(n)
      if (n == 0) {
        this.setData({
          topbar: 1
        })
      } else {
        this.setData({
          topbar: 0
        })
      }
    },
  }
})
