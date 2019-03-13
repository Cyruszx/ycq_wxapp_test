// pages/priceManage/priceManage.js
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/md5.js') // 引入md5.js文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfoList: [

    ],
    state: 0,
  },
  /***
   * 事件
   */
  chooseState(e) {
    var state = e.currentTarget.dataset.state;
    this.setData({
      state: state
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    });
    this.request_price_list();

  },
  nav_to_car_detail: function(e) {
    var carId = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../carDetail/carDetail?carId=' + carId + '&type=' + type,
    });
  },
  request_price_list() {
    var userInfo = this.data.userInfo;
    var $this = this;
    var carSellList = new Array();
    var carBuyList = new Array();
    $http.post('my/myQuoted')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('报价管理：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var carSell = data.QuotedPriceList.sell;
          var carBuy = data.QuotedPriceList.buy;
          $this.data.sell = carSell
          $this.data.buy = carBuy
          if (carSell) {
            carSell.forEach((val, index) => {
              var obj = {
                id: val.models_info.id,
                imgSrc: (val.models_info.type == 'sell' ? app.globalData.localImgUrl : app.globalData.imgUrl) + (val.models_info.brand_default_images ? val.models_info.brand_default_images : val.models_info.modelsimages),
                brand_name: val.models_info.brand_name,
                name: val.models_info.models_name,
                priceArea: val.models_info.guide_price,
                price: val.money,
                quotationtime: val.quotationtime,
                sale: val.models_info.browse_volume,
                time: val.models_info.car_licensetime,
                miles: val.models_info.kilometres,
                addr: val.models_info.parkingposition,
                //  brand_id: val.buycar_model.brand.id,
                //  brand_name: val.buycar_model.brand.name,
                type: val.models_info.type,
                userPic: val.user.avatar,
                userName: val.user.nickname,
                mobile: val.user.mobile,
                deal_status: val.deal_status,
                bond: val.bond,
                cancel_order: val.cancel_order,
                quoted_id: val.id,
                models_id: val.models_info_id,
                seller_payment_status: val.seller_payment_status
              }
              carSellList[index] = obj;
            });
            console.log(carSellList)
          }

          if (carBuy) {
            carBuy.forEach((val, index) => {
              //console.log('userINFO:', userInfo);
              var obj = {
                id: val.models_info.id,
                imgSrc: (val.models_info.type == 'sell' ? app.globalData.localImgUrl : app.globalData.imgUrl) + (val.models_info.brand_default_images ? val.models_info.brand_default_images : val.models_info.modelsimages),
                brand_name: val.models_info.brand_name,
                name: val.models_info.models_name,
                priceArea: val.models_info.guide_price,
                price: val.money,
                quotationtime: val.quotationtime,
                sale: val.models_info.browse_volume,
                time: val.models_info.car_licensetime,
                miles: val.models_info.kilometres,
                addr: val.models_info.parkingposition,
                //brand_id: val.buycar_model.brand.id,
                //brand_name: val.buycar_model.brand.name,
                type: val.models_info.type,
                userPic: val.user.avatar,
                userName: val.user.nickname,
                mobile: val.user.mobile,
                deal_status: val.deal_status,
                bond: val.bond,
                cancel_order: val.cancel_order,
                quoted_id: val.id,
                models_id: val.models_info_id,
                seller_payment_status: val.seller_payment_status
              }
              carBuyList[index] = obj;
            });
          }
          $this.setData({
            carBuyList,
            carSellList
          });
        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败', err);
      });
  },
  makePhoneCall(e) {
    var tel = '028 - 84167417';
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },

  //取消卖车订单
  cancelOrderSell: function(e) {
    console.log(e)
    var that = this
    var cancel_order = e.target.id.split('+')[0]
    var quoted_id = e.target.id.split('+')[1]
    if (cancel_order == 0) {
      wx.showToast({
        title: '不能取消订单',
        image: '../../images/warn.png',
        duration: 500
      })
    } else {
      $http.post('my/cancellation_of_quotation', {
        quoted_id: quoted_id
      }).then(res => {
        console.log(res)
        that.request_price_list();
      })
    }
  },

  //支付保证金，买车/卖车
  payMargin: function(e) {
    var that = this
    var payInfo = {
      formId: e.detail.formId,
      out_trade_no: new Date().getTime(),
      trading_models_id: e.detail.target.dataset.id.split('+')[0],
      // money: Number(e.detail.target.dataset.id.split('+')[1])  ,
      money: 0.01,
      user_type: e.detail.target.dataset.pay_type 
    } 
    payInfo.out_trade_no = payInfo.user_type + '_' + wx.getStorageSync("user_id") + '_' + payInfo.trading_models_id + '_' + payInfo.out_trade_no; 
    $http.post('store_margin_pay/marginPay', payInfo).then(res => {
      var timeStamp = (Date.parse(new Date()) / 1000).toString();
      var pkg = 'prepay_id=' + res.data.prepay_id;
      var nonceStr = res.data.nonce_str;
      var appid = res.data.appid;
      var key = res.data.key;
      var paySign = util.hexMD5('appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=" + key).toUpperCase(); //此处用到hexMD5插件 
      //发起支付
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': pkg,
        'signType': 'MD5',
        'paySign': paySign,
        'success': function(res) {
          //支付成功推送模板
          console.log(res); 
          $http.post('store_margin_pay/after_successful_payment', payInfo).then(res => {
            console.log(res);
          });
          //支付成功之后的操作

        },
        'fail': function(res) {
          console.log('用户取消支付,需要重载页面');

        },
        'complete': function(res) {

        }
      });

    });
  },

  //取消买车订单
  cancelOrderBuy: function(e) {
    console.log(e)
    var that = this
    var cancel_order = e.target.id.split('+')[0]
    var quoted_id = e.target.id.split('+')[1]
    if (cancel_order == 0) {
      wx.showToast({
        title: '不能取消订单',
        image: '../../images/warn.png',
        duration: 500
      })
    } else {
      $http.post('my/cancellation_of_quotation', {
        quoted_id: quoted_id
      }).then(res => {
        console.log(res)
        that.request_price_list();
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.request_price_list();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})