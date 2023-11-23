// app.ts
import { loginToServer } from './utils/util'

App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code)
          loginToServer(res.code)
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