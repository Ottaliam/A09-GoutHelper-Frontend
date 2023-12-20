// pages/health/add/food-add/food-add.ts

import { getTodayDate } from '../../../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    static_base: "",
    date: getTodayDate(),
    searchResults: [],    // 搜索结果数组
    isSearching: false,   // 是否显示搜索结果
    foodInfo: {
      imageUrl: getApp().globalData.static_base + '/icon-health.png',
      name: '',
      msUnit: '份'
    },
    purineInfo: {
      perUnit: "0",
      inputQuantity: 0,
      totalPurine: 0 
    },
    healthTips: {
      tip: ''
    },
    quantity: "0"
  },

  bindDateChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      date: e.detail.value
    });
  },

  onSearchInput(e: WechatMiniprogram.Input) {
    const searchQuery = e.detail.value;
    this.setData({
      isSearching: true
    })
    this.searchFood(searchQuery);
  },

  onQuantityInput(e: WechatMiniprogram.Input) {
    const inputQuantity = Number(e.detail.value);
    const purinePerUnit = Number(this.data.purineInfo.perUnit);
  
    const totalPurine = inputQuantity * purinePerUnit;
  
    this.setData({
      quantity: e.detail.value,
      'purineInfo.inputQuantity': inputQuantity,
      'purineInfo.totalPurine': totalPurine.toFixed(2)
    });
  },
  

  searchFood(query: string) {
    const that = this;
  
    wx.request({
      url: getApp().globalData.server_address + '/food/search',
      method: 'POST',
      data: {
        name: query
      },
      success: function(res) {
        const data = res.data as Record<string, any>;
  
        if (data.status === 'success') {
          const names = data.results.map((item: any) => item.name);
          that.setData({
            searchResults: names
          });
        } else {
          that.setData({
            searchResults: []
          });
        }
      },
      fail: function(err) {
        console.error('搜索请求失败', err);
        that.setData({
          searchResults: []
        });
      }
    });
  },

  onResultTap(e: WechatMiniprogram.BaseEvent) {
    const that = this;

    const name = e.currentTarget.dataset.name;
    console.log('选中的搜索结果: ', name);

    this.setData({
      isSearching: false
    })

    wx.request({
      url: getApp().globalData.server_address + '/food/get',
      method: 'POST',
      data: { name: name },
      success: function(res) {
        const data = res.data as Record<string, any>;

        if (data.status === 'success' && data.food) {
          that.setData({
            'foodInfo.imageUrl': getApp().globalData.server_address + data.food.image_url,
            'foodInfo.name': data.food.name,
            'foodInfo.msUnit': data.food.ms_unit,
            'purineInfo.perUnit': data.food.purine_per_unit,
            'healthTips.tip': data.food.health_tip
          });
        } else {
          console.error('食物信息获取失败:', data.message);
        }
      },
      fail: function(err) {
        console.error('请求失败', err);
      }
    });
  },

  addFoodRecord() {
    const that = this;
    const openid = getApp().globalData.openid;
    const { name } = this.data.foodInfo;
    const quantity = Number(this.data.quantity);
    const { date } = this.data;

    if (!name || isNaN(quantity) || quantity <= 0) {
      wx.showToast({
        title: '请输入有效的食物信息和数量',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: getApp().globalData.server_address + '/record/addFoodRecord',
      method: 'POST',
      data: {
        openid: openid,
        food_name: name,
        quantity: quantity,
        record_date: date
      },
      success: function(res) {
        const data = res.data as Record<string, any>;

        if (data.status === 'success') {
          console.log('添加记录成功, 记录ID:', data.record_id);
        } else {
          console.error('添加记录失败:', data.message);
        }

        that.setData({
          date: getTodayDate(),
          searchResults: [],
          isSearching: false,
          foodInfo: {
            imageUrl: getApp().globalData.static_base + '/icon-health.png',
            name: '',
            msUnit: '份'
          },
          purineInfo: {
            perUnit: "0",
            inputQuantity: 0,
            totalPurine: 0 
          },
          healthTips: {
            tip: ''
          },
          quantity: "0"
        });
      },
      fail: function(err) {
        console.error('请求失败', err);
      }
    });
  },

  addFoodRecordAndBack() {
    this.addFoodRecord();
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

  },
})