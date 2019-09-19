const ajax = require('../../utils/request.js');
const tools = require('../../utils/util.js');

let _app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // userInfo: {},
        time: '',
        greetings: ' 资料获取失败'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.checkAuth();
        this.getUserTime();
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

    },
    redirectPage: function (e) {

        wx.navigateTo({
            url: e.currentTarget.dataset['url'],
            success: function () {
                console.log('跳转成功...');
            },
            fail: function () {
                console.log('跳转失败...');
            }
        })
    },
    getUserTime() {
        let time = new Date();
        let timeStr = `${time.getMonth() + 1}月${time.getDate()}日 周${time.getDay() === 1 ? '一' : time.getDay() === 2 ? '二' : time.getDay() === 3 ? '三' : time.getDay() === 4 ? '四' : time.getDay() === 5 ? '五' : time.getDay() === 6 ? '六' : '日'}`;

        let greetingsStr;
        let hour = time.getHours();
        if (hour > 6 && hour < 12) {
            greetingsStr = '早上好';
        } else if (hour >= 12 && hour < 13) {
            greetingsStr = '中午好';
        } else if (hour >= 13 && hour < 18) {
            greetingsStr = '下午好';
        } else {
            greetingsStr = '晚上好';
        }

        this.setData({
            // userInfo: res.data,
            time: timeStr,
            greetings: greetingsStr
        })
    },
    // getLoginCode() {
    //
    //     wx.login({
    //         success(res) {
    //             console.log('getLoginCode', res);
    //
    //             ajax.myRequest({
    //                 // url: 'http://172.16.6.133:8080/resServer/bookLending/login',
    //                 url: `${_app.globalData.host}${_app.globalData.api.login}`,
    //
    //                 data: {
    //                     code: res.code
    //                 },
    //                 success(val) {
    //                     console.log('bookLending login', val)
    //                 }
    //             })
    //         }
    //     })
    // },
    checkAuth() {

        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    // wx.reLaunch({
                    //     url: '../index/index'
                    // })
                }
            },
            fail() {
            }
        })
    }
});
