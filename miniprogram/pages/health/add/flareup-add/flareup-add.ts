// pages/health/flareup-add/flareup-add.ts

import { getTodayDate } from '../../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    static_base: "",
    date: getTodayDate(),
    symptom: '',
    intenseLevel: '',
    trigger: '',
  },

  onSymptomInput(e: WechatMiniprogram.CustomEvent) {
    this.setData({ symptom: e.detail.value });
  },

  onIntenseLevelInput(e: WechatMiniprogram.CustomEvent) {
    this.setData({ intenseLevel: e.detail.value });
  },

  onTriggerInput(e: WechatMiniprogram.CustomEvent) {
    this.setData({ trigger: e.detail.value });
  },

  addFlareupRecord() {
    const that = this;
    const openid = getApp().globalData.openid;
    const { date, symptom, trigger } = this.data;
    const intenseLevel = Number(this.data.intenseLevel);

    if (![1, 2, 3, 4, 5].includes(intenseLevel)) {
      wx.showToast({
        title: '请输入有效的严重程度：1~5的整数',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: getApp().globalData.server_address + '/record/addFlareupRecord',
      method: 'POST',
      data: {
        openid: openid,
        symptom: symptom,
        intense_level: intenseLevel,
        trigger: trigger,
        record_date: date
      },
      success: function(res) {
        const data = res.data as Record<string, any>;

        if (data.status === 'success') {
          console.log('添加记录成功, 记录ID:', data.record_id);
          // 重置数据
          that.setData({
            date: getTodayDate(),
            symptom: '',
            intenseLevel: '',
            trigger: '',
          });
        } else {
        }
      },
      fail: function(err) {
        // 请求失败的处理逻辑...
      }
    });
  },

  addFlareupRecordAndBack() {
    this.addFlareupRecord();
    wx.navigateBack();
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

  }
})