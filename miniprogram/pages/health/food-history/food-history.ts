// pages/health/food-history/food-history.ts

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
    server_address: getApp().globalData.server_address,
    static_base: getApp().globalData.static_base,
    activeTab: "week",
    indicatorLeft: '0%',
    date: getTodayDate(),
    foodRecords: [],
    foodRecordSummary: null,
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
            foodRecords: data.records
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
              console.error(data.summary);
              console.error(that.data.foodRecordSummary);
              if (that.data.foodRecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.foodRecordSummary, "last_week");
                that.drawLineChart(purines, periods);
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
    this.fetchFoodRecordsForDate(getTodayDate());
    this.fetchFoodRecordSummary();
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

  onTabTap(event: WechatMiniprogram.TouchEvent) {
    const tab = event.currentTarget.dataset.tab;

    switch (tab) {
      case 'logs':
        wx.redirectTo({ url: '/pages/health/food-log/food-log' });
        break;
      case 'recipe':
        wx.redirectTo({ url: '/pages/health/food-recipe/food-recipe' });
        break;
      case 'history':
        break;
    }
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
  }
})