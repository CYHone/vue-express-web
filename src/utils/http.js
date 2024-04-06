//axios基础封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const httpInstance = axios.create({
    //baseURL:'http://',
    timeout:5000
})

//拦截器

//axios请求拦截器
httpInstance.interceptors.request.use(config =>{
    return config
},e  => Promise.reject((e)),

//axios响应拦截器
httpInstance.interceptors.response.use(res => res.data, e =>{
    // 同意错误提示
    ElMessage({
        type:'warning',
        message: e.response.data.msg
    })
    return Promise.reject(e)
})

)
export default httpInstance