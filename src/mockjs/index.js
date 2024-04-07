// 引用 Mock
// const Mock = require('mockjs')
// import Mock from 'mockjs';
 

// export const loginAPIData = Mock.mock({
//     account: '1311111111', // 默认账户
//     password: '123456',    // 默认密码
// })



import Mock from 'mockjs';

// 定义模拟数据
export const loginAPIData = Mock.mock({
    account: '1311111111', // 默认账户
    password: '123456',    // 默认密码
});
