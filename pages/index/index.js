const ajax = require('../../utils/request.js');

let _app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getSetting();

        // 进页面直接需要用户授权 腾讯审核过不了，所以更改为：进页面查看用户是否绑定邮箱
        // 绑定：直接跳转首页
        // 未绑定：留在首页，让用户自行跳转绑定页

        this.checkLogin();


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


    bindGetUserInfo(e) {
        console.log('bindGetUserInfo', e.detail.userInfo);
        if (e.detail.userInfo) {
            wx.showLoading({
                title: '授权中'
            });
            wx.login({
                success(res) {
                    console.log('getLoginCode', res);
                    wx.showLoading({
                        title: '登录中'
                    });
                    wx.request({
                        // url: 'http://172.16.6.133:8080/resServer/bookLending/login',
                        url: `${_app.globalData.host}${_app.globalData.api.login}`,
                        // url: 'https://www.easy-mock.com/mock/5d6ce0a9160de944c54a60e5/wechatMini/login',
                        data: {
                            code: res.code
                        },
                        success(val) {
                            wx.hideLoading();
                            console.log('bookLending login', val);

                            if (val.data.status === 0) {
                                wx.setStorageSync("sessionId", val.data.data.SESSION_ID);

                                if (val.data.data.USER_STATE === 0) {
                                    wx.reLaunch({
                                        url: '../bindEmail/bindEmail'
                                    })
                                } else if (val.data.data.USER_STATE === -1) {
                                    wx.showToast({
                                        title: '该账号已被禁用',
                                        icon: 'none',
                                        image: '../../static/img/warn.svg'
                                    })
                                } else {
                                    wx.reLaunch({
                                        url: '../home/home'
                                    });
                                }
                            } else {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    image: '../../static/img/warn.svg'
                                })
                            }
                        },
                        fail(err) {
                            wx.hideLoading();
                            wx.showToast({
                                title: '登录失败',
                                icon: 'none'
                            })
                        }
                    })
                }
            })
        }
    },
    getSetting() {

        wx.showLoading({
            title: '校验中...'
        });
        wx.login({
            success(res) {
                wx.request({
                    // url: 'http://172.16.6.133:8080/resServer/bookLending/login',
                    url: `${_app.globalData.host}${_app.globalData.api.login}`,
                    data: {
                        code: res.code
                    },
                    success(val) {
                        wx.hideLoading();
                        console.log('getSetting login', val);
                        if (val.data.status === 0) {
                            wx.setStorageSync("sessionId", val.data.data.SESSION_ID);
                            if (val.data.data.USER_STATE === 1) {
                                wx.getSetting({
                                    success(res) {
                                        console.log('getSetting', res.authSetting['scope.userInfo']);
                                        if (res.authSetting['scope.userInfo']) {
                                            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                                            wx.getUserInfo({
                                                success: function (res) {
                                                    console.log(res.userInfo);
                                                    // wx.setStorage({key: 'userInfo', data: res.userInfo});
                                                    wx.reLaunch({
                                                        url: '../home/home'
                                                    })
                                                }
                                            })
                                        }
                                    },
                                    fail() {
                                    }
                                })
                            }
                        }
                    },
                    fail(err) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '校验失败',
                            icon: 'none'
                        })
                    }
                })
            }
        })
    },


    toBindEmail() {
        wx.navigateTo({
            url: '../bindEmail/bindEmail'
        })
    },
    checkLogin() {

        wx.login({
            success(res) {
                console.log('getLoginCode', res);
                wx.showLoading({
                    title: 'login...'
                });
                wx.request({
                    url: `${_app.globalData.host}${_app.globalData.api.login}`,
                    data: {
                        code: res.code
                    },
                    success(val) {
                        wx.hideLoading();
                        console.log('bookLending login', val);

                        if (val.data.status === 0) {
                            wx.setStorageSync("sessionId", val.data.data.SESSION_ID);

                            if (val.data.data.USER_STATE === 0) {//未绑定
                                // wx.reLaunch({
                                //     url: '../bindEmail/bindEmail'
                                // })
                            } else if (val.data.data.USER_STATE === -1) {//禁用
                                wx.showToast({
                                    title: '该账号已被禁用',
                                    icon: 'none',
                                    image: '../../static/img/warn.svg'
                                })
                            } else if (val.data.data.USER_STATE === 1) {// 正常
                                wx.reLaunch({
                                    url: '../home/home'
                                });
                            }
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                image: '../../static/img/warn.svg'
                            })
                        }
                    },
                    fail(err) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '登录失败',
                            icon: 'none'
                        })
                    }
                })
            }
        })

    }

})
