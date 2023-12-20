// pages/health/uricacid-add/uricacid-add.ts

import { getTodayDate } from '../../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    static_base: "",
    date: getTodayDate(),
    uricacidLevel: '',
  },

  bindDateChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      date: e.detail.value
    });
  },

  onUricacidInput(e: WechatMiniprogram.Input) {
    this.setData({
      uricacidLevel: e.detail.value
    });
  },

  addUricacidRecord() {
    const that = this;
    const openid = getApp().globalData.openid;
    const date = this.data.date;
    const uricacidLevel = Number(this.data.uricacidLevel);

    if (!uricacidLevel || isNaN(uricacidLevel) || uricacidLevel < 0) {
      wx.showToast({
        title: '请输入有效的尿酸水平',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: getApp().globalData.server_address + '/record/addUricacidRecord',
      method: 'POST',
      data: {
        openid: openid,
        quantity: uricacidLevel,
        record_date: date
      },
      success: function(res) {
        const data = res.data as Record<string, any>;

        if (data.status === 'success') {
          console.log('添加记录成功, 记录ID:', data.record_id);
          that.setData({
            date: getTodayDate(),
            uricacidLevel: '',
          });
        } else {
        }
      },
      fail: function(err) {
        // 请求失败的处理逻辑...
      }
    });
  },

  addUricacidRecordAndBack() {
    this.addUricacidRecord();
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