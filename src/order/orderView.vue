<template>
    <LayoutNav />
    <LayoutHeader />
    <div class="order" style="display: flex; justify-content: center; align-items: center;">
        <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="寄件人" prop="senderName">
        <el-input v-model="ruleForm.senderName" />
      </el-form-item>

      <el-form-item label="电话" prop="senderPhone">
        <el-input v-model="ruleForm.senderPhone" />
      </el-form-item>

      <el-form-item label="寄件人地址" prop="senderregion">
        <el-select v-model="ruleForm.senderRegion" placeholder="Activity zone">
          <el-option label="上海" value="shanghai" />
          <el-option label="北京" value="beijing" />
        </el-select>
      </el-form-item>


      <el-form-item label="收件人" prop="acceptName">
        <el-input v-model="ruleForm.acceptName" />
      </el-form-item>

      <el-form-item label="电话" prop="acceptPhone">
        <el-input v-model="ruleForm.acceptPhone" />
      </el-form-item>

      <el-form-item label="寄件人地址" prop="acceptRegion">
        <el-select v-model="ruleForm.acceptRegion" placeholder="Activity zone">
          <el-option label="上海" value="shanghai" />
          <el-option label="北京" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="物品种类" prop="classify">
        <el-select v-model="ruleForm.classify" placeholder="Activity classify">
          <el-option label="文件" value="classify-1" />
          <el-option label="数码" value="classify-2" />
        </el-select>
      </el-form-item>

      <el-form-item label="物品重量(Kg)" prop="weight">
        <el-input v-model="ruleForm.weight" />
      </el-form-item>



      <el-form-item label="寄件时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              v-model="ruleForm.date1"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker
              v-model="ruleForm.date2"
              label="Pick a time"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="备注" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>

      <el-form-item label="同意协议" prop="delivery">
        <el-switch v-model="ruleForm.delivery" />
      </el-form-item>

      <el-form-item >
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          下单
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>

    </el-form>
    </div>
    <LayoutFooter />
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import LayoutNav from '../Layout/components/LayoutNav.vue'
  import LayoutHeader from '../Layout//components/LayoutHeader.vue'
  import LayoutFooter from '../Layout//components/LayoutFooter.vue'
  
  interface RuleForm {
    senderName: string
    senderPhone: string
    senderRegion: string
    acceptName: string
    acceptPhone: string
    acceptRegion: string
    classify: string
    weight:number
    date1: string
    date2: string
    desc: string
    delivery: boolean
  }
  
  const formSize = ref('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    senderName: '张三',
    senderPhone: '18937260063',
    senderRegion: '',
    acceptName: '李四',
    acceptPhone:'15137290002',
    acceptRegion: '',
    classify: '',
    weight: 10,
    date1: '',
    date2: '',
    desc: '',
    delivery: false,
  })
  
  const rules = reactive<FormRules<RuleForm>>({
    senderName: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 2, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    senderRegion: [
      {
        required: true,
        message: 'Please select Activity zone',
        trigger: 'change',
      },
    ],
    
    date1: [
      {
        type: 'date',
        required: true,
        message: 'Please pick a date',
        trigger: 'change',
      },
    ],
    date2: [
      {
        type: 'date',
        required: true,
        message: 'Please pick a time',
        trigger: 'change',
      },
    ],
    desc: [
      { required: true, message: 'Please input activity form', trigger: 'blur' },
    ],
  })
  
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  

</script>
<style scoped lang='scss'>
    .order{
        background: url('src/assets/background.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        border-bottom: 1px solid #e4e4e4;
        padding: 20px;
    }
</style>

<!-- 寄件人模块组成：
    寄件人姓名、寄件人联系方式、寄件人地址。 -->
    <!-- 收件人模块组成：
    收件人姓名、收件人联系方式、收件人地址。 -->
    <!-- 寄件货物信息模块组成：
    填写（或者选择）托运物品内容，比如文件、数码、食品、包裹、配件……；货物重量等。 -->
    <!-- 结算模块组成：
    快递运费预估费用的显示 -->
    <!-- 《快递服务协议》 -->
    <!-- 下单后生成订单号 -->

<!-- <script setup>
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout//components/LayoutHeader.vue'
import LayoutFooter from '../Layout//components/LayoutFooter.vue'
</script>

<template>
  <LayoutNav />
  <LayoutHeader />
    
<-- 
  <div></div>

  <LayoutFooter />
</template> --> 