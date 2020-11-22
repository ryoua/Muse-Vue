<template>
  <a-modal
    title="新增消息模板"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('add') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="模板Id"
                     :labelCol="{lg: {span: 5}, sm: {span: 7}}"
                     :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
        v-show="false">
          <a-input v-decorator="['id']"/>
        </a-form-item>

        <a-form-item label="模板名称"
                     :labelCol="{lg: {span: 5}, sm: {span: 7}}"
                     :wrapperCol="{lg: {span: 15}, sm: {span: 25} }">
          <a-input v-decorator="['name', {rules: [{required: true, min: 1, message: '请输入模板名！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="模板类型"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
        >
          <a-input-group
            style="display: inline-block; vertical-align: middle"
            :compact="true"
          >
            <a-select style="width: 100px" v-model="type" v-decorator="['type', { initialValue: 1}]">
              <a-select-option :value="1">短信</a-select-option>
              <a-select-option :value="2">邮件</a-select-option>
              <a-select-option :value="3">QQ</a-select-option>
              <a-select-option :value="4">微信</a-select-option>
              <a-select-option :value="5">小程序</a-select-option>
              <a-select-option :value="6">通知消息</a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item
          label="邮件标题"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
          :required="true"
          class="stepFormText"
          v-if="type === 2"
        >
          <a-input
            style="width: 80%;"
            v-decorator="['emailTitle', {rules: [{required: true, message: '请输入邮件标题'}] }]"/>
        </a-form-item>
        <a-form-item
          label="抄送"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
          :required="false"
          class="stepFormText"
          v-if="type === 2"
        >
          <a-input
            style="width: 80%;"
            v-decorator="['emailCopy']"/>
        </a-form-item>
        <a-form-item
          label="邮件正文"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
          :required="true"
          class="stepFormText"
          v-if="type === 2"
        >
          <a-textarea
            style="width: 100%; height: 200px"
            v-decorator="['emailContent', { initialValue: '', rules: [{required: true, message: '请输入邮件正文'}] }]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'

  // 表单字段
  const fields = ['id', 'name', 'emailTitle', 'emailCopy', 'emailContent']

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      loading: {
        type: Boolean,
        default: () => false
      },
      model: {
        type: Object,
        default: () => null
      }
    },
    data() {
      this.formLayout = {
        sql: '',
        receivers: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      }
      return {
        type: 1,
        headers: {
          authorization: 'authorization-text'
        },
        form: this.$form.createForm(this)
      }
    },
    created() {
        // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))

      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    },
    methods: {
      change(i) {
        const _this = this
        _this.type = i
      },
      handleChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`)
        }
      }
    }
  }
</script>
