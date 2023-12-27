// pages/health/logs-food/logs-food.ts

import { getTodayDate } from '../../../utils/util';
const wxCharts = require('../../../utils/wxcharts.js')

interface FoodRecord {
  period: string;
  total_purine: number;
}

interface FoodRecordSummary {
  last_week: FoodRecord[];
  last_month: FoodRecord[];
  last_year: FoodRecord[];
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    static_base: getApp().globalData.static_base,
    activeTab: "week",
    indicatorLeft: '0%',
    date: getTodayDate(),
    foodRecords: [],
    foodRecordSummary: null,
    totalPurine7: 0,
    avgPurine7: 0,
    totalPurine30: 0,
    avgPurine30: 0,
    totalPurine12: 0,
    avgPurine12: 0
  },

  fetchFoodRecordSummary() {
    const that = this;
    const today = getTodayDate();

    wx.request({
        url: getApp().globalData.server_address + '/record/foodRecordSummary',
        method: 'POST',
        data: {
            reference_date: today,
        },
        success(res) {
          const data = res.data as Record<string, any>;

            if (data.status === 'success') {
              that.setData({
                foodRecordSummary: data.summary,
              });
              if (that.data.foodRecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.foodRecordSummary, "last_week");
                that.drawLineChart(purines, periods);
                const total = purines.reduce((sum, current) => sum + current, 0);
                that.setData({
                  totalPurine7: total,
                  avgPurine7: total / 7
                });
              }
              if (that.data.foodRecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.foodRecordSummary, "last_month");
                const total = purines.reduce((sum, current) => sum + current, 0);
                that.setData({
                  totalPurine30: total,
                  avgPurine30: total / 30
                });
              }
              if (that.data.foodRecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.foodRecordSummary, "last_year");
                const total = purines.reduce((sum, current) => sum + current, 0);
                that.setData({
                  totalPurine12: total,
                  avgPurine12: total / 12
                });
              }
            } else {
              console.error('数据获取失败:', data.message);
            }
        },
        fail(err) {
            console.error('请求失败:', err);
        }
    });
  },

  extractDataForPlotting(foodRecordSummary: FoodRecordSummary, key: keyof FoodRecordSummary): { periods: string[], purines: number[] } {
    const records = foodRecordSummary[key];

    const periods = records.slice(1).map(record => record.period);
    const purines = records.slice(1).map(record => record.total_purine);

    return { periods, purines };
  },

  drawLineChart(data: number[], categories: string[]) {
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth;
  
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: categories,
      series: [{
        name: '嘌呤摄入量',
        data: data,
        format: (val: number) => `${val.toFixed(2)}`
      }],
      yAxis: {
        title: '嘌呤摄入量',
        format: (val: number) => val.toFixed(2),
        min: 0
      },
      width: screenWidth,
      height: 300
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchFoodRecordSummary();
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

    switch (tab) {
      case 'week':
        if (this.data.foodRecordSummary) {
          const { periods, purines } = this.extractDataForPlotting(this.data.foodRecordSummary, "last_week");
          this.drawLineChart(purines, periods);
        }
        break;
      case 'month':
        if (this.data.foodRecordSummary) {
          const { periods, purines } = this.extractDataForPlotting(this.data.foodRecordSummary, "last_month");
          this.drawLineChart(purines, periods);
        }
        break;
      case 'year':
        if (this.data.foodRecordSummary) {
          const { periods, purines } = this.extractDataForPlotting(this.data.foodRecordSummary, "last_year");
          this.drawLineChart(purines, periods);
        }
        break;
    }
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