<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="消息类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select v-model="param.messageType"
          v-decorator="['messageType', { initialValue: this.param.messageType, rules: [{required: true, message: '消息类型必须选择'}] }]">
          <a-select-option :value=1>短信</a-select-option>
          <a-select-option :value=2>邮件</a-select-option>
          <a-select-option :value=3>阿里云短信</a-select-option>
          <a-select-option :value=4>腾讯云短信</a-select-option>
          <a-select-option :value=5>微信小程序-模板消息</a-select-option>
          <a-select-option :value=6>微信公众号-客服消息</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="消息名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-model="param.messageName"
      >
        <a-input v-decorator="['messageName', {rules: [{required: true, message: '消息名称必须填写'}] }]"/>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button :loading="loading" type="primary" @click="nextStep" >下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { getSendNameIsExist } from '@/api/message'

export default {
  name: 'Step1',
  data () {
    return {
      param: {
        messageType: 1,
        messageName: '',
      },
      loading: false,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this)
    }
  },

  methods: {
    nextStep () {
      const { form: { validateFields }} = this
      const _this = this;
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          _this.loading = true
          _this.timer = setTimeout(function () {
            getSendNameIsExist(values['messageName']).then(res => {
                if (res.data === 200) {
                  _this.loading = false
                  _this.getData(values)
                  _this.$emit('nextStep')
                } else if (res.data === 202){
                  _this.loading = false
                  _this.$message.error('名称已存在');
                } else {
                _this.loading = false
                _this.$message.error('网络错误');
              }
            }).catch(() => {
              _this.loading = false
              _this.$message.error('网络错误');
            })
          }, 500)
        }
      })
    },


    getData(param) {
      this.$emit('getData', param)
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
