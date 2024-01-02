// pages/health/logs-flareup/logs-flareup.ts

import { getTodayDate } from '../../../utils/util';
const wxCharts = require('../../../utils/wxcharts.js')

interface FlareRecord {
  period: string;
  average_intensity: number;
}

interface FlareRecordSummary {
  last_week: FlareRecord[];
  last_month: FlareRecord[];
  last_year: FlareRecord[];
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    static_base: getApp().globalData.static_base,
    activeTab: "week",
    indicatorLeft: '0%',
    RecordSummary: null,
    countFlare7: 0,
    avgFlare7: "0",
    countFlare30: 0,
    avgFlare30: "0",
    countFlare12: 0,
    avgFlare12: "0",
  },

  fetchRecordSummary() {
    const that = this;
    const today = getTodayDate();

    wx.request({
        url: getApp().globalData.server_address + '/record/flareRecordSummary',
        method: 'POST',
        data: {
            reference_date: today,
        },
        success(res) {
          const data = res.data as Record<string, any>;

            if (data.status === 'success') {
              that.setData({
                RecordSummary: data.summary,
              });
              if (that.data.RecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.RecordSummary, "last_week");
                that.drawLineChart(purines, periods);
                const total = purines.reduce((sum, current) => sum + current, 0);
                const count = purines.filter(item => item > 0).length;
                that.setData({
                  countFlare7: count,
                  avgFlare7: (total / count).toFixed(2)
                });
              }
              if (that.data.RecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.RecordSummary, "last_month");
                const total = purines.reduce((sum, current) => sum + current, 0);
                const count = purines.filter(item => item > 0).length;
                that.setData({
                  countFlare30: count,
                  avgFlare30: (total / count).toFixed(2)
                });
              }
              if (that.data.RecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.RecordSummary, "last_year");
                const total = purines.reduce((sum, current) => sum + current, 0);
                const count = purines.filter(item => item > 0).length;
                that.setData({
                  countFlare12: count,
                  avgFlare12: (total / count).toFixed(2)
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

  extractDataForPlotting(RecordSummary: FlareRecordSummary, key: keyof FlareRecordSummary): { periods: string[], purines: number[] } {
    const records = RecordSummary[key];

    const periods = records.slice(1).map(record => record.period);
    const purines = records.slice(1).map(record => record.average_intensity);

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
        name: '发作强度',
        data: data,
        format: (val: number) => `${val.toFixed(2)}`
      }],
      yAxis: {
        title: '发作强度',
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
    this.fetchRecordSummary();
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
        if (this.data.RecordSummary) {
          const { periods, purines } = this.extractDataForPlotting(this.data.RecordSummary, "last_week");
          this.drawLineChart(purines, periods);
        }
        break;
      case 'month':
        if (this.data.RecordSummary) {
          const { periods, purines } = this.extractDataForPlotting(this.data.RecordSummary, "last_month");
          this.drawLineChart(purines, periods);
        }
        break;
      case 'year':
        if (this.data.RecordSummary) {
          const { periods, purines } = this.extractDataForPlotting(this.data.RecordSummary, "last_year");
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