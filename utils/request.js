const _api = require('./api.js');


// 查询是否有sessionId ，
// 没有就调用myLogin获取sessionId
// 有 ：先校验是否有效
function getAccessToken(callback) {

    if (!wx.getStorageSync('sessionId')) {
        myLogin(callback);
    } else {
        wx.checkSession({
            success() {
                console.log('session 有效~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                callback(wx.getStorageSync('sessionId'));
            },
            fail() {
                console.log('seesion 失效~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                myLogin(callback);
            }
        })
    }
}

function myLogin(callback) {

    wx.login({
        success(res) {
            console.log('getLoginCode', res);

            wx.showLoading({
                title: '登录中'
            });
            wx.request({
                // url: 'https://www.easy-mock.com/mock/5d6ce0a9160de944c54a60e5/wechatMini/login',
                // url: 'http://172.16.6.133:8080/resServer/bookLending/login',
                url: `${_api.baseUrl}${_api.login}`,
                data: {
                    code: res.code
                },
                success(val) {
                    wx.hideLoading();
                    console.log('login', val);
                    if (val.data.status === 0) {

                        let accesstoken = val.data.data;
                        if (typeof (callback) === 'function' && accesstoken) {
                            wx.setStorageSync("sessionId", accesstoken.SESSION_ID);
                            // wx.setStorageSync("sessionId", accesstoken);

                            callback(accesstoken);
                        }
                    }
                },
                fail(err) {
                    wx.hideLoading();
                    wx.showToast({title: '登录失败', icon: 'none'})
                }
            });
        }
    })
}


// 封装request请求
const myRequest = options => {

    if (options) {
        getAccessToken(function (accesstoken) {
            if (options.header === undefined || options.header === null) {
                options.header = {};
            }
            options.header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            if (options.data) {
                options.data['sessionId'] = accesstoken;
            } else {
                options.data = {};
                options.data.sessionId = accesstoken;
            }
            //success
            if (options.success && typeof (options.success) === 'function') {
                let successCallback = options.success;
                options.success = function (res) {
                    // 判断不同的返回码 200/404
                    if (res.statusCode === 200) {
                        try {
                            //调用自定义的success
                            successCallback(res);
                        } catch (e) {
                            console.error('出错了，' + e + ',接口返回数据:' + res.data);
                        }
                    } else if (res.statusCode === 404) {
                        console.log('404');
                    } else if (res.statusCode === 30003) {
                        wx.showToast({
                            title: '请先绑定邮箱',
                            icon: 'none'
                        })
                    }
                }
            }
            //执行微信的请求
            wx.request(options);
        });
    }
}


module.exports = {
    myRequest: myRequest
};
