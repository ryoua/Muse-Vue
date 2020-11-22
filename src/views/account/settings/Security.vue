<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description" v-if="item.title === '邮件设置'">

          <a-form-item
            label="邮件服务器地址"
            :labelCol="{lg: {span: 5}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 7} }"
            :required="true"
            class="stepFormText"

          >
              <a-input
                style="width: 80%;"
                v-decorator="['email.host', { initialValue: '', rules: [{required: true, message: '请输入SMTP端口'}] }]" />
            </a-form-item>

          <a-form-item
            label="邮件服务器端口"
            :labelCol="{lg: {span: 5}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 7} }"
            :required="true"
            class="stepFormText"

          >
              <a-input
                style="width: 80%;"
                v-decorator="['email.address', { initialValue: '', rules: [{required: true, message: '请输入SMTP端口'}] }]" />
            </a-form-item>

          <a-form-item
            label="发件人"
            :labelCol="{lg: {span: 5}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 7} }"
            :required="true"
            class="stepFormText"
          >
              <a-input
                style="width: 80%;"
                v-decorator="['email.account', { initialValue: '', rules: [{required: true, message: '请输入SMTP端口'}] }]" />
            </a-form-item>

            <a-form-item
              label="用户名"
              :labelCol="{lg: {span: 5}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 7}, sm: {span: 7} }"
              :required="true"
              class="stepFormText"
            >
              <a-input
                style="width: 80%;"
                v-decorator="['email.username', { initialValue: '', rules: [{required: true, message: '请输入SMTP端口'}] }]" />
            </a-form-item>

            <a-form-item
              label="密码"
              :labelCol="{lg: {span: 5}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 7}, sm: {span: 7} }"
              :required="true"
              class="stepFormText"
            >
              <a-input
                style="width: 80%;"
                v-decorator="['email.password', { initialValue: '', rules: [{required: true, message: '请输入SMTP端口'}] }]" />
            </a-form-item>

           <a-form-item :wrapperCol="{span: 19, offset: 5}">
              <a-button :loading="loading" type="primary" @click="saveEmailSetting">保存</a-button>
           </a-form-item>

        </span>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script>
  import {saveEmailSetting} from '@/api/setting'
  import { addMessageTemplate } from '@/api/template'

export default {
  data () {
    return {
      data: [
        { title: '邮件设置', description: '当前密码强度', value: '强', actions: { title: '修改', callback: () => { this.$message.info('This is a normal message') } } },
        { title: '密保手机', description: '已绑定手机', value: '138****8293', actions: { title: '修改', callback: () => { this.$message.success('This is a message of success') } } },
        { title: '密保问题', description: '未设置密保问题，密保问题可有效保护账户安全', value: '', actions: { title: '设置', callback: () => { this.$message.error('This is a message of error') } } },
        { title: '备用邮箱', description: '已绑定邮箱', value: 'ant***sign.com', actions: { title: '修改', callback: () => { this.$message.warning('This is message of warning') } } },
        { title: 'MFA 设备', description: '未绑定 MFA 设备，绑定后，可以进行二次确认', value: '', actions: { title: '绑定', callback: () => { this.$message.info('This is a normal message') } } }
      ]
    }
  },
  methods: {
    saveEmailSetting() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log(values.type)
          if (values.type === 2) {
            values.content = JSON.stringify(values.email)
            values.email = undefined
          }

          // 新增
          addMessageTemplate(values).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()
            if (res.code === 200) {
              this.$message.info('新增成功')
            } else {
              this.$message.error('新增失败')
            }
          }).catch(() => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.error('新增失败')
          })
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
