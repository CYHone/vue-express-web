// // import request from '@/utils/request'

// // export function register (data) {
// //  return request ({
// //   url:'customer/register',
// //   method: 'post',
// //   data
// //  })
// // }









// // 导入 loginAPIData
// //import { loginAPIData } from '@/mockjs/index.js';

// import { defineStore } from 'pinia'; 

// export const loginAPI = ({ account, password }) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (account === loginAPIData.account && password === loginAPIData.password) {
//          const token = generateToken(); // 生成 token
//           resolve({
//             code: 200,
//             message: '登录成功',
//             data: {
//               token: token // 将生成的 token 返回给客户端
//             }
//           });
//         } else {
//           reject({
//             code: 401,
//             message: '账号或密码错误'
//           });
//         }
//       }, 500); // 模拟延迟
//     });
//   };
  

//   // 生成 token 的函数（示例，具体实现根据需求来）
//   const generateToken = () => {
//     // 这里可以根据实际需求生成 token，例如使用 JSON Web Token (JWT) 进行生成
//     return 'generated_token';
//   };


//   // 创建一个 Pinia store 存储token和 account
//   export const useAuthStore = defineStore('auth', {
//     state: () => ({
//       token: null,
//       account: null
//     }),
//     actions: {
//       setToken(token) {
//         this.token = token;
//       },
//       setAccount(account) {
//         this.account = account;
//       },
//       //清除用户信息
//       cleanUserAuthStore() {
//         this.token = null;
//         this.account = null;
//       }
//     }
//   });

 

// // import request from '../utils/http.js'

// // // 封装和用户相关的接口
// // export const loginAPI = ({ account, password }) => {
// //     return request({
// //         url: '/login',
// //         method: 'POST',
// //         data: {
// //             account,
// //             password
// //         }
// //     });
// // };

