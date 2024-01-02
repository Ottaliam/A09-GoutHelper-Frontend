// pages/health/logs-uricacid/logs-uricacid.ts

import { getTodayDate } from '../../../utils/util';
const wxCharts = require('../../../utils/wxcharts.js')

interface UricRecord {
  period: string;
  average_quantity: number;
}

interface UricRecordSummary {
  last_week: UricRecord[];
  last_month: UricRecord[];
  last_year: UricRecord[];
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
    avgUric7: "0",
    avgUric30: "0",
    avgUric12: "0",
  },

  fetchRecordSummary() {
    const that = this;
    const today = getTodayDate();

    wx.request({
        url: getApp().globalData.server_address + '/record/uricRecordSummary',
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
                that.setData({
                  avgUric7: (total / 7).toFixed(2)
                });
              }
              if (that.data.RecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.RecordSummary, "last_month");
                const total = purines.reduce((sum, current) => sum + current, 0);
                that.setData({
                  avgUric30: (total / 30).toFixed(2)
                });
              }
              if (that.data.RecordSummary) {
                const { periods, purines } = that.extractDataForPlotting(that.data.RecordSummary, "last_year");
                const total = purines.reduce((sum, current) => sum + current, 0);
                that.setData({
                  avgUric12: (total / 12).toFixed(2)
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

  extractDataForPlotting(RecordSummary: UricRecordSummary, key: keyof UricRecordSummary): { periods: string[], purines: number[] } {
    const records = RecordSummary[key];

    const periods = records.slice(1).map(record => record.period);
    const purines = records.slice(1).map(record => record.average_quantity);

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
        name: '尿酸水平',
        data: data,
        format: (val: number) => `${val.toFixed(2)}`
      }],
      yAxis: {
        title: '尿酸水平',
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
        break;
      case 'flareup':
        wx.redirectTo({ url: '/pages/health/logs-flareup/logs-flareup' });
        break;
    }
  },

  onTapToUricacidAdd() {
    wx.navigateTo({
      url: '/pages/health/add/uricacid-add/uricacid-add'
    });
  },
})