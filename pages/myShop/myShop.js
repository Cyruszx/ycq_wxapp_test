// pages/myShop/myShop.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     shop:{
       banner:'../../images/car-test_03.png',
       name:'济南二手车品鉴',
       addr:'成都市武侯区天府广场1栋',
       brands:['奔驰','宝马','JEEP','玛莎拉蒂','VOLVO']
     },
    active_tab:'店铺特色',
    detail_img_list: ['../../images/car-test_03.png', '../../images/car-test_03.png', '../../images/car-test_03.png']
  },
  /**
   * 事件函数
   */
  change_tab:function(e){
      var title=e.currentTarget.dataset.title;
      this.setData({
        active_tab: title
      })
  },
  request_shop_detail(shopId){
    var $this=this;
    var carList=new Array();
    $http.post('shop/store_detail', {
      store_id: shopId
    }).then(res => {
      //成功回调
      var resObj = res.data;
      console.log('店铺详情：', resObj);
      if (resObj.code == 1) {
        var data=resObj.data;
        var brandStr=data.detail.main_camp;
        var brandList = brandStr.split(',');
        var carList = data.detail.car_list;
        
        var shop = {
          banner: app.globalData.localImgUrl + data.detail.store_img,
          name: data.detail.store_name,
          phone:data.detail.phone,
          addr: data.detail.cities_name+ data.detail.store_address,
          brands: brandList
        };
        if (carList){
          carList.forEach((val,index)=>{
              var obj={
                id: val.id,
                models_name: val.models_name,//"奥迪Q3 20192.0L手动变速",
                guide_price: val.guide_price,// "100万",
                car_licensetime: val.car_licensetime,// "2019-03",
                kilometres: val.kilometres,// "0.1万公里",
                parkingposition: val.parkingposition,// "北京市 北京市",
                browse_volume: val.browse_volume,//5750,
                //createtime: val.car_licensetime,// 1551410619,
                store_description: val.store_description,// "车况良好，车子也有按时保养，感兴趣的朋友，随时欢迎联系",
                factorytime: val.factorytime,//"1970",
                modelsimages: val.modelsimages,//"/uploads/20190301/d14dab0b1d07e9ee63c1f78201bcd822.jpg",
              }
              carList[index]=obj;
          });
        }
        this.setData({
          shop, carList
        })
      } else {
        wx.showToast({
          title: resObj.msg,
          image: '../../images/warn.png'
        });
        console.log('请求失败：', resObj.msg);
      }
    }).catch(err => {
      //异常回调
      console.log('请求失败', err);
    });
  },
  makePhoneCall(){
     var phone=this.data.shop.phone;
     wx.makePhoneCall({
       phoneNumber: phone,
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var shopId=options.shopId;
    this.setData({ shopId})
      console.log('shopId:',shopId);
      this.request_shop_detail(shopId);
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
    var shopId = this.data.shopId;
    return {
      path: '/pages/myShop/myShop?shopId='+shopId
    }
  }
})