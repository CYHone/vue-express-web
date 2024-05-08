<template>
  <LayoutNav />
  <LayoutHeader />
  
  <div class="order" style="display: flex; justify-content: center; align-items: center;">

   
  <div class="order-form" style="height: 400px;padding-right: 50px;">
      <el-steps :active="activeStep" finish-status="success" direction="vertical">
        <el-step title="填写寄件信息" />
        <el-step title="填写收件信息" />
        <el-step title="选择类型和支付" />
        <el-step title="创建运单完成" />
        <el-step title="创建包裹" />
    </el-steps>
  </div>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >

      <el-form-item label="寄件人" prop="senderID">
        <el-input v-model="ruleForm.senderName" />
      </el-form-item>

      <div style="font-size: 15px; font-weight: bold;">出发地</div>

      <!-- 所在省份表单项 -->
      <el-form-item label="所在省" prop="oprovince">
        <!-- 下拉选择框 -->
        <el-select v-model="ruleForm.oprovince" placeholder="请选择所在省" @change="ohandleProvinceChange">
          <!-- 省份选项列表 -->
          <el-option
            v-for="item in provinceOptions"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <!-- 所在城市表单项 -->
      <el-form-item label="所在市" prop="ocity">
        <!-- 下拉选择框 -->
        <el-select v-model="ruleForm.ocity" placeholder="请选择所在市" @change="ohandleCityChange">
          <!-- 城市选项列表 -->
          <el-option
            v-for="item in cityOptions"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
  
      <!-- 所在区/县表单项 -->
      <el-form-item label="所在区/县" prop="odistrict">
        <!-- 下拉选择框 -->
        <el-select v-model="ruleForm.odistrict" placeholder="请选择所在区/县" @change="oselectDistrict">
          <!-- 区/县选项列表 -->
          <el-option
            v-for="item in districtOptions"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

   <div style="font-size: 15px; font-weight: bold;">目的地</div>
      <!-- 所在省份表单项 -->
      <el-form-item label="所在省" prop="dprovince">
        <!-- 下拉选择框 -->
        <el-select v-model="ruleForm.dprovince" placeholder="请选择所在省" @change="dhandleProvinceChange">
          <!-- 省份选项列表 -->
          <el-option
            v-for="item in provinceOptions"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <!-- 所在城市表单项 -->
      <el-form-item label="所在市" prop="dcity">
        <!-- 下拉选择框 -->
        <el-select v-model="ruleForm.dcity" placeholder="请选择所在市" @change="dhandleCityChange">
          <!-- 城市选项列表 -->
          <el-option
            v-for="item in cityOptions"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
  
      <!-- 所在区/县表单项 -->
      <el-form-item label="所在区/县" prop="ddistrict">
        <!-- 下拉选择框 -->
        <el-select v-model="ruleForm.ddistrict" placeholder="请选择所在区/县" @change="dselectDistrict">
          <!-- 区/县选项列表 -->
          <el-option
            v-for="item in districtOptions"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <div class="mb-2 flex items-center text-sm">
        <el-radio-group v-model="type" class="ml-4">
          <el-radio value="0" size="large">标快</el-radio>
          <el-radio value="1" size="large">特快</el-radio>
        </el-radio-group>
      </div>


      <div class="mb-2 flex items-center text-sm">
        <el-radio-group v-model="payMethod" class="ml-4" @change="payMethodChange">
          <el-radio value="cod_pending" size="large">货到付款</el-radio>
          <el-radio value="pending" size="large">预先⽀付</el-radio>
        </el-radio-group>
      </div>


      <el-form-item>
        <el-button type="primary" @click="submitForm()">下单</el-button>
        <el-button type="success" @click="doReturn()">退出</el-button>
        <el-button type="primary" @click="resetForm()">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
  <LayoutFooter />
</template>

<script setup>
import { ref,watch,reactive } from 'vue'
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout/components/LayoutHeader.vue'
import LayoutFooter from '../Layout/components/LayoutFooter.vue'
 // 导入省市区数据，假设已经将 pca-code.json 导入到当前组件中，并命名为 provinceOptions
import provinceOptions from '@/utils/pca-code.json';
import { useRouter } from 'vue-router';
import axios from '@/utils/axios-config' // 导入全局配置的 axios 实例
import { ElMessage } from 'element-plus';

const activeStep = ref(0)
const router = useRouter();
const userId = localStorage.getItem('userId');
const type = ref('')
const payMethod = ref('')
const origin = ref('')
const destination = ref('')
// 监听 type 的变化并打印选中的值
watch(type, (newValue, oldValue) => {
  console.log('选中的快递类型:', newValue);
});

// 监听 payMethod 的变化并打印选中的值
watch(payMethod, (newValue, oldValue) => {
  console.log('选中的支付方式:', newValue);
});

const ruleForm = ref({
  senderName: userId,
  oprovince: '', // 省份
  ocity: '',     // 城市
  odistrict: '' ,// 区/县
  dprovince: '', // 省份
  dcity: '',     // 城市
  ddistrict: '' ,// 区/县
  // type: Number ,
  // payMethod: ''
})

 // 表单验证规则
 const rules = ref({
    oprovince: [{ required: true, message: '请选择所在省', trigger: 'change' }],
    ocity: [{ required: true, message: '请选择所在市', trigger: 'change' }],
    odistrict: [{ required: true, message: '请选择所在区/县', trigger: 'change' }],
    dprovince: [{ required: true, message: '请选择所在省', trigger: 'change' }],
    dcity: [{ required: true, message: '请选择所在市', trigger: 'change' }],
    ddistrict: [{ required: true, message: '请选择所在区/县', trigger: 'change' }]
  });

    // 城市和区/县选项
  const districtOptions = ref([]); // 区/县选项
  const cityOptions = ref([]);     // 城市选项
  

   // 处理省份选择变化
   const ohandleProvinceChange = () => {
 
    // 根据选择的省份更新城市选项
    const selectedProvince = provinceOptions.find(item => item.name === ruleForm.value.oprovince);  
    console.log('Selected Province:', ruleForm.value.oprovince);
    cityOptions.value = selectedProvince ? selectedProvince.children : [];
    // 清空城市和区/县
    ruleForm.value.ocity = '';
    ruleForm.value.odistrict = '';
  };

   // 处理城市选择变化
   const ohandleCityChange = () => {

    // 根据选择的城市更新区/县选项
    const selectedCity = cityOptions.value.find(item => item.name === ruleForm.value.ocity);
    console.log('Selected City:', ruleForm.value.ocity);
    districtOptions.value = selectedCity ? selectedCity.children : [];
    // 清空区/县
    ruleForm.value.odistrict = '';
  };
  
  // 处理区/县选择变化
  const oselectDistrict = () => {
    // 修改：更新 activeStep 的值为下一个步骤的索引值
    activeStep.value = 1;
    // 根据选择的区/县更新区/县编码
    const selectedDistrict = districtOptions.value.find(item => item.name === ruleForm.value.odistrict);
    console.log('Selected District:', ruleForm.value.odistrict);
    //在 districtOptions 数组中找到选择的区/县对象，然后从中提取编码并将其存储在 form.code 中
    ruleForm.value.code = selectedDistrict ? selectedDistrict.code : '';
    console.log('District Code:', ruleForm.value.code);
    origin.value= ruleForm.value.code
  };




  // 处理省份选择变化
  const dhandleProvinceChange = () => {
    // 根据选择的省份更新城市选项
    const selectedProvince = provinceOptions.find(item => item.name === ruleForm.value.dprovince);  
    console.log('Selected Province:', ruleForm.value.dprovince);
    cityOptions.value = selectedProvince ? selectedProvince.children : [];
    // 清空城市和区/县
    ruleForm.value.dcity = '';
    ruleForm.value.ddistrict = '';
  };

   // 处理城市选择变化
   const dhandleCityChange = () => {
    // 根据选择的城市更新区/县选项
    const selectedCity = cityOptions.value.find(item => item.name === ruleForm.value.dcity);
    console.log('Selected City:', ruleForm.value.dcity);
    districtOptions.value = selectedCity ? selectedCity.children : [];
    // 清空区/县
    ruleForm.value.ddistrict = '';
  };
  
  // 处理区/县选择变化
  const dselectDistrict = () => {
    // 修改：更新 activeStep 的值为下一个步骤的索引值
    activeStep.value = 2;
    // 根据选择的区/县更新区/县编码
    const selectedDistrict = districtOptions.value.find(item => item.name === ruleForm.value.ddistrict);
    console.log('Selected District:', ruleForm.value.ddistrict);
    //在 districtOptions 数组中找到选择的区/县对象，然后从中提取编码并将其存储在 form.code 中
    ruleForm.value.code = selectedDistrict ? selectedDistrict.code : '';
    console.log('District Code:', ruleForm.value.code);
    destination.value = ruleForm.value.code
  };

  const payMethodChange = () => {
    // 修改：根据用户的操作更新 activeStep 的值
    activeStep.value = 3;
  };

const submitForm = () => {
   // 修改：根据用户的操作更新 activeStep 的值
   activeStep.value = 4;
    const requestData = {
      origin : origin.value,
      destination : destination.value,
      customerId : userId,
      type : type.value,
      payMethod : payMethod.value
    };
    console.log( "请求数据为" + requestData)

  axios.post('shipment/createShipment', requestData)
      .then(response => {
        console.log(response.data)
      
        if (response.data.code === 200) {
        showMessage('success', '运单下单成功');

        localStorage.setItem('shipmentId', response.data.data);       
        localStorage.setItem('origin', origin.value);
        localStorage.setItem('destination', destination.value);
        localStorage.setItem('type', type.value);
       

        //const gh = localStorage.getItem('shipmentId')
       // console.log(gh)

        // 跳转
        router.push('/package');
     
      } else {
        console.error('注册失败', response.data.message);
        showMessage('error', '下单失败，请重试');
      }      
      }).catch(error => {
      console.error('请求失败', error);
      showMessage('error', '网络错误，请稍后再试');
    });      
}

const showMessage = (type, message) => {
  ElMessage({
    type: type, // 消息类型，可以是 success、warning、info、error 中的一种
    message: message, // 消息内容
    duration: 3000, // 持续时间，单位为毫秒，默认值为3000
  });
};

const resetForm = () => {
  // 将表单字段值重置为初始状态
  ruleForm.value.senderName = userId;
  ruleForm.value.oprovince = '';
  ruleForm.value.ocity = '';
  ruleForm.value.odistrict = '';
  ruleForm.value.dprovince = '';
  ruleForm.value.dcity = '';
  ruleForm.value.ddistrict = '';
  type.value = ''; // 重置选择的快递类型
  payMethod.value = ''; // 重置选择的支付方式
}

const doReturn = () => {
  router.push('/');
}
</script>

<style scoped lang="scss">
.order {
  background: url('src/assets/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  border-bottom: 1px solid #e4e4e4;
  padding: 20px;
}
</style>
