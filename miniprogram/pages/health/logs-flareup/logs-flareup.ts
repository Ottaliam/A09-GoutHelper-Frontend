// pages/health/logs-flareup/logs-flareup.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    static_base: "",
    activeTab: "week",
    indicatorLeft: '0%'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      static_base: getApp().globalData.static_base
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onTabChange(event: WechatMiniprogram.TouchEvent) {
    const tab = event.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
      indicatorLeft: this.calculateIndicatorPosition(tab)
    });
  },

  calculateIndicatorPosition(tab: string): string {
    switch (tab) {
      case 'week':
        return '0%';
      case 'month':
        return '33.333%';
      case 'year':
        return '66.667%';
    }
    return '0%';
  },

  onTabTap(event: WechatMiniprogram.TouchEvent) {
    const tab = event.currentTarget.dataset.tab;

    switch (tab) {
      case 'food':
        wx.redirectTo({ url: '/pages/health/logs-food/logs-food' });
        break;
      case 'uricacid':
        wx.redirectTo({ url: '/pages/health/logs-uricacid/logs-uricacid' });
        break;
      case 'flareup':
        break;
    }
  },

  onTapToFlareupAdd() {
    wx.navigateTo({
      url: '/pages/health/add/flareup-add/flareup-add'
    });
  }
})