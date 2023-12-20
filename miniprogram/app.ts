// app.ts
App<IAppOption>({
  globalData: {
    server_address: "http://43.138.26.196:8000",
    static_base: "http://43.138.26.196:8000/static",
    media_base: "http://43.138.26.196:8000/media",
    openid: ""
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    const that = this;

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code)
          
          wx.request({
            url: that.globalData.server_address + '/user/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success(res) {
              console.log(res);

              const data = res.data as Record<string, any>;              
              if (data.status === 'success') {
                that.globalData.openid = data.openid;
              } else {
                console.error('登录失败:', res.data);
              }
            },
            fail(err) {
              console.error(err);
            }
          });
        } else {
          console.log(res.errMsg)
        }
      },
      fail: err => {
        console.error(err);
      }
    })
  }
})