// pages/mine/mine.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    userInfo:[],
    navList:[
      {
        icon:'',
        name:'我的店铺',
        path:'../myShop/myShop'
      },
      {
        icon: '',
        name: '我买到的',
        path: '../myShop/myShop'
      },
      {
        icon: '',
        name: '我卖出的',
        path: '../myShop/myShop'
      },
      {
        icon: '',
        name: '服务协议',
        path: '../myShop/myShop'
      },
      {
        icon: '',
        name: '关于友车',
        path: '../myShop/myShop'
      }
    ]
  },

  /**
   * 事件函数
   */
  
  nav_to_page:function(e){
    var path=e.currentTarget.dataset.path;
    if (!path){
      wx.showToast({
        title: '即将上线',
        image: '../../images/warn.png'
      })
    }else{
      wx.navigateTo({
        url: path,
      })
    }
    
  },
  nav_to_myshop:function(){
    /***var shopId=this.data.company.id;
    wx.navigateTo({
      url: '../myShop/myShop?shopId=' + shopId,
    })*/
    wx.showToast({
      title: '即将上线',
      image:'../../images/warn.png'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //var user_id=wx.getStorageSync("user_id");
    
  },
  request_mine(){
    var $this = this;
    $http.post('my/index')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('我的数据：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var company = {
            id: data.userInfo.companystoreone.id,
            qrcode: data.userInfo.companystoreone.store_qrcode
          }
          var isNewOffer = data.userInfo.isNewOffer;
          // var isRealName = data.userInfo.isRealName;
          $this.setData({ company, isNewOffer});

        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败');
      });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.request_mine();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.request_mine();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //二维码点击事件
  erWeiMa:function(){
    var that = this
    wx.showToast({
      title: '即将上线',
      image: '../../images/warn.png'
    })

    // that.setData({
    //   showModal:true
    // })

    // $http.post('my/index').then(res=>{
    //   console.log(res.data.data)
    //   that.setData({
    //     userInfo: res.data.data.userInfo,
    //     showModal: true,
    //   })
    // })
  },

  //关闭模态框
  closeModalDlg:function(){
    var that = this
    that.setData({
      showModal: false
    })
  },

  makePhoneCall() {
    var tel = '028 - 84167417';
    wx.makePhoneCall({
      phoneNumber: tel // 仅为示例，并非真实的电话号码
    })
  },
})