// pages/health/logs-food/logs-food.ts

import { getTodayDate } from '../../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    static_base: "",
    activeTab: "week",
    indicatorLeft: '0%',
  },

  fetchCharts() {
    const that = this;

    wx.request({
      url: getApp().globalData.server_address + '/record/chartFoodRecord',
      method: 'POST',
      data: {
        date: getTodayDate()
      },
      success: function(res) {
        const data = res.data as Record<string, any>;

        if (data.status === 'success' && data.charts) {
          that.setData({
            last7DaysChartUrl: data.charts.last_7_days_chart,
            lastMonthChartUrl: data.charts.last_month_chart,
            lastYearChartUrl: data.charts.last_year_chart
          });
        } else {
          console.error('获取图表失败:', data.message);
        }
      },
      fail: function(err) {
        console.error('请求失败', err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      static_base: getApp().globalData.static_base
    });
    this.fetchCharts();
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

  onTapToFoodAdd() {
    wx.navigateTo({
      url: '/pages/health/add/food-add/food-add'
    });
  },

  onTabTap(event: WechatMiniprogram.TouchEvent) {
    const tab = event.currentTarget.dataset.tab;

    switch (tab) {
      case 'food':
        break;
      case 'uricacid':
        wx.redirectTo({ url: '/pages/health/logs-uricacid/logs-uricacid' });
        break;
      case 'flareup':
        wx.redirectTo({ url: '/pages/health/logs-flareup/logs-flareup' });
        break;
    }
  }
})