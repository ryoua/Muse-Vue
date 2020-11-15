<template>
  <a-modal
    title="新增接收人群模板"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('add'); }"
    @cancel="() => { $emit('cancel'); }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="模板名">
          <a-input v-decorator="['name', {rules: [{required: true, min: 1, message: '请输入模板名！'}]}]" />
        </a-form-item>
        <a-form-item
          label="模板类型"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-radio-group v-decorator="['type', { initialValue: 1 }]">
            <a-radio :value="1" @click="change(1)">字符串</a-radio>
            <a-radio :value="2" @click="change(2)">文件</a-radio>
            <a-radio :value="3" @click="change(3)">SQL</a-radio>
          </a-radio-group>

        </a-form-item>
          <a-form-item
            label="接收人群类型"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
            :required="false"
          >
            <a-radio-group v-decorator="['receiverType', { initialValue: 1 }]">
              <a-radio :value="1" >userid</a-radio>
              <a-radio :value="2" >phone</a-radio>
              <a-radio :value="3" >did</a-radio>
            </a-radio-group>

          </a-form-item>

        <a-form-item label="字符串" v-if="this.type === 1">
          <a-input v-decorator="['receivers', {rules: [{required: true, min: 1, message: '请输入内容！'}]}]" />
        </a-form-item>

        <a-form-item label="文件" v-if="this.type === 2">
          <a-upload
            name="file"
            :multiple="true"
            action="http://127.0.0.1:8443/upload"
            :file-list="fileList"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="SQL" v-if="this.type === 3">
          <a-textarea v-decorator="['sql', {rules: [{required: true, min: 1, message: '请输入SQL！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['name', 'receivers', 'sql']

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
  data () {
    this.formLayout = {
      type: 1,
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
      fileList: [

      ],
      headers: {
        authorization: 'authorization-text'
      },
      type: 1,
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    change (i) {
       const _this = this
       _this.type = i
    },
    handleChange (info) {
      let fileList = [...info.fileList];

      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败`);
      }
      fileList = fileList.slice(-1);
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });

      this.fileList = fileList;
    }
  }
}
</script>
