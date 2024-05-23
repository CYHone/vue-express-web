<template>
  <LayoutNav />
  <LayoutHeader />
  <div class="order" style="display: flex; justify-content: center; align-items: center;">
     <div class="order-form" style="height: 300px; padding-right: 50px;">
        <el-steps :active="activeStep" finish-status="success" direction="vertical">
          <el-step title="创建运单完成" />
          <el-step title="创建包裹" />
          <el-step title="生成条形码" />
       </el-steps>
    </div>
    <el-form
      ref="ruleFormRef"
      style="max-width: 650px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >

      <!-- <el-form-item label="收件人ID" prop="receiverEmail">
        <el-input v-model="ruleForm.receiverEmail" placeholder="选填(根据用户邮箱查询可知)" />
      </el-form-item> -->

      <el-form-item label=" 收件⼈姓名" prop="receiverName">
        <el-input v-model="ruleForm.receiverName" placeholder="请输入收件⼈姓名"  />
      </el-form-item>

      <el-form-item label="收件⼈地址" prop="receiverAddress">
        <el-input v-model="ruleForm.receiverAddress" placeholder="请输入收件⼈地址"/>
      </el-form-item>

      <el-form-item label="收件⼈电话" prop="receiverPhone">
        <el-input v-model="ruleForm.receiverPhone" placeholder="请输入收件⼈电话" />
      </el-form-item>

      <el-form-item label="包裹重量" prop="weight">
        <el-input v-model="ruleForm.weight" placeholder="请输入包裹重量(kg)"/>
      </el-form-item>

      

      <el-form-item label="包裹尺寸" prop="size">
          <el-input v-model="sizeX" placeholder="长(cm)" style="width: 100px;"></el-input>
          <span style="margin: 0 5px;">,</span>
          <el-input v-model="sizeY" placeholder="宽(cm)" style="width: 100px;"></el-input>
          <span style="margin: 0 5px;">,</span>
          <el-input v-model="sizeZ" placeholder="高(cm)" style="width: 100px;"></el-input>
        </el-form-item>

      <el-form-item>
        <el-button type="primary" size="large" @click="submitForm()">下单</el-button>
        <el-button type="success" size="large" @click="doReturn()">退出</el-button>
        <el-button type="primary" size="large" @click="resetForm()">重置</el-button>
        <!-- <el-button type="success" @click="againSubmitForm()">继续下单</el-button> -->
      </el-form-item>

    </el-form>

 <!-- 使用 Vue3Barcode 组件生成条形码 -->
 <vue3-barcode
      :value="barcodeValue"
      format="CODE128"
      :width="2"
      :height="60"
      :margin="10"
      :fontSize="12"
      class="barcode-container"
    />

  </div>
  <LayoutFooter />
</template>

<script setup>
import { ref,watch,reactive } from 'vue'
import Vue3Barcode from 'vue3-barcode';
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout/components/LayoutHeader.vue'
import LayoutFooter from '../Layout/components/LayoutFooter.vue'
 // 导入省市区数据，假设已经将 pca-code.json 导入到当前组件中，并命名为 provinceOptions
import { useRouter } from 'vue-router';
import axios from '@/utils/axios-config' // 导入全局配置的 axios 实例
import { ElMessage,ElMessageBox} from 'element-plus';
const activeStep = ref(1)
const router = useRouter();
const shipId = localStorage.getItem('shipmentId');
const barcodeValue = ref('') // 初始化条形码值为空
const ruleForm = ref({
  shipmentID: shipId,
  receiverEmail: '',
  receiverName: '',
  receiverAddress: '',
  receiverPhone: '',
  weight: '',
  
})


const sizeX = ref('');
const sizeY = ref('');
const sizeZ = ref('');



  const submitForm = () => {
    //修改：更新 activeStep 的值为下一个步骤的索引值
   activeStep.value = 3;
 // 合并尺寸数据
 const size = `${sizeX.value},${sizeY.value},${sizeZ.value}`;
    
  const requestData = {
    shipmentId: ruleForm.value.shipmentID,
    receiverEmail: ruleForm.value.receiverEmail,
    receiverName: ruleForm.value.receiverName,
    receiverAddress: ruleForm.value.receiverAddress,
    receiverPhone: ruleForm.value.receiverPhone,
    weight: ruleForm.value.weight,
    //size: ruleForm.value.size,
    size: size,
  };
  console.log("请求数据为", requestData);

  axios.post('package/createPackage', requestData)
    .then(response => {
      console.log(response.data);
      console.log("包裹订单为",response.data.data);
      
      if (response.data.code === 200) {
        showMessage('success', '包裹下单成功');

        const or = localStorage.getItem('origin')
        const dt = localStorage.getItem('destination')
        const tp = localStorage.getItem('type')

        const requestPrice = {
          origin: or,
          destination: dt,
          weight: ruleForm.value.weight,
          size: ruleForm.value.size,
          type: tp,
        }

        axios.post('package/calculatePrice', requestPrice).then(response => {
          console.log(response.data);

          if (response.data.code === 200) {
                  // 调用 ElMessageBox.alert 方法弹出消息框
                  ElMessageBox.alert('这个包裹运费为 ' + response.data.data + '元', '价格计算', {
                    // 配置确认按钮文本为 'OK'
                    confirmButtonText: 'OK',
                  });
    
          } else {
            console.error('价格计算失败', response.data.message);    
          }
        });

        

        barcodeValue.value = response.data.data;
        console.log("条形码值为",barcodeValue.value);
        // //重置表单
        // resetForm();

      } else {
        console.error('下单失败', response.data.message);
        showMessage('error', '下单失败，请重试');
      }
    })
    .catch(error => {
      console.error('请求失败', error);
      showMessage('error', '网络错误，请稍后再试');
    });


    // generateBarcode();

  }
   
const showMessage = (type, message) => {

  ElMessage({
    type: type, // 消息类型，可以是 success、warning、info、error 中的一种
    message: message, // 消息内容
    duration: 3000, // 持续时间，单位为毫秒，默认值为3000
  });
};
const resetForm = () => {
  // 将表单字段值（除了shipmentId）重置为初始状态
  Object.keys(ruleForm.value).forEach(key => {
    if (key !== 'shipmentID') {
      ruleForm.value[key] = ''; // 将其重置为初始值
    }
  });
};
const doReturn = () => {
  router.push('/');
}

// const generateBarcode = () =>{
//   barcodeValue.value = response.data.data;
// }



</script>

<style scoped lang="scss">
.order {
  background: url('src/assets/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  border-bottom: 1px solid #e4e4e4;
  padding: 20px;
}
.barcode-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>