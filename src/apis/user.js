import request from '../utils/http.js'

// 封装和用户相关的接口
export const loginAPI = ({ account, password }) => {
    return request({
        url: '/login',
        method: 'POST',
        data: {
            account,
            password
        }
    });
};
