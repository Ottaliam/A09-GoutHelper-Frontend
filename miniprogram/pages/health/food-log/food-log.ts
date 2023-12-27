// pages/health/food-log/food-log.ts

import { getTodayDate } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    server_address: getApp().globalData.server_address,
    static_base: getApp().globalData.static_base,
    date: getTodayDate(),
    foodRecords: [],
    purineContentTotal: 0,
  },

  fetchFoodRecordsForDate(dateStr: string) {
    const that = this;
    const openid = getApp().globalData.openid;

    wx.request({
      url: getApp().globalData.server_address + '/record/recordForDate',
      method: 'POST',
      data: {
        openid: openid,
        date: dateStr
      },
      success: function(res) {
        const data = res.data as Record<string, any>;

        if (data.status === 'success') {
          that.setData({
            foodRecords: data.records,
            purineContentTotal: data.records.reduce((sum: number, item: { purine_content: string }) => { return sum + Number(item.purine_content); }, 0)
          });
        } else {
          console.error('获取食物记录失败:', data.message);
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
    this.fetchFoodRecordsForDate(getTodayDate());
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

  onTapToFoodAdd() {
    wx.navigateTo({
      url: '/pages/health/add/food-add/food-add'
    });
  },

  onTabTap(event: WechatMiniprogram.TouchEvent) {
    const tab = event.currentTarget.dataset.tab;

    switch (tab) {
      case 'logs':
        break;
      case 'recipe':
        wx.redirectTo({ url: '/pages/health/food-recipe/food-recipe' });
        break;
      case 'history':
        wx.redirectTo({ url: '/pages/health/food-history/food-history' });
        break;
    }
  }
})