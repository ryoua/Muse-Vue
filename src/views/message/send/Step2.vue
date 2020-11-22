<template>
  <div>
    <a-form :form="form" style="max-width: 1000px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="提交后，可以去发送历史中查看发送详情，如果想要撤回，应该尽快。"
        style="margin-bottom: 24px;"
      />

      <a-form-item
        label="是否选用模板"
        :labelCol="{lg: {span: 5}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
        :required="true"
      >
        <a-radio-group v-decorator="['choseTemplate', { initialValue: true }]" >
          <a-radio-button :value="true"  @click="changeChoseTemplate(true)">
            选用模板
          </a-radio-button>
          <a-radio-button :value="false"  @click="changeChoseTemplate(false)">
            自定义
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="模板列表"
        :labelCol="{lg: {span: 5}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
        :required="true"
        v-if="this.choseTemplate">
        <a-select
          label-in-value
          :value="value"
          placeholder="请选择模板"
          mode="default"
          style="width: 100%"
          :filter-option="false"
          :showSearch="true"
          @search="handleSearch"
          @change="handleChange"
          :not-found-content="fetching ? undefined : null"
          @dropdownVisibleChange="getTemplateName"
          v-decorator="['templateId', { initialValue: [], rules: [{required: true, message: '必须选择模板'}]}]"
        >
          <a-spin  slot="notFoundContent" size="small" />
          <a-select-option v-for="d in data" :key="d.id">{{d.name}}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="邮件标题"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
        v-if="!this.choseTemplate"
      >
        <a-input
          style="width: 80%;"
          v-decorator="['emailTitle', { initialValue: '123456', rules: [{required: true, message: '请输入邮件标题'}] }]" />
      </a-form-item>


      <a-form-item
        label="抄送"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
        v-if="!this.choseTemplate"
      >
        <a-input
          style="width: 80%;"
          v-decorator="['emailCopy']" />
      </a-form-item>

      <a-form-item
        label="邮件正文"
        :labelCol="{lg: {span: 5}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
        class="stepFormText"
        v-if="!this.choseTemplate"
      >
        <a-textarea
          style="width: 1000px; height: 300px"
          v-decorator="['emailContent', { initialValue: '123456', rules: [{required: true, message: '请输入邮件正文'}] }]" />
      </a-form-item>

      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button style="margin-right: 8px" @click="prevStep">上一步</a-button>
        <a-button :loading="loading" type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { getAllMessageTemplateName, searchMessageTemplateName } from '@/api/message'

  export default {
    props: ['messageType'],
  name: 'Step2',
  data () {
    return {
      data: [],
      fetching: false,
      value: undefined,
      choseTemplate: true,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0
    }
  },
  methods: {
    changeChoseTemplate(flag) {
      this.choseTemplate = flag
    },
    handleSearch(value) {
      if (value !== '' && value !== null) {
        this.fetching = true;
        let param = { };
        param.messageType = this.messageType;
        param.search = value;
        searchMessageTemplateName(param).then((res) => {
          if (res.data.length === 0) {
            this.data = []
          } else {
            this.data = res.data
          }
          this.fetching = false;
        })
      } else {
        this.getTemplateName()
      }
    },
    handleChange(value) {
      fetch(value, data => (this.data = data));
    },
    getTemplateName() {
      getAllMessageTemplateName(this.messageType).then((res) => {
        this.data = res.data
      })
    },
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          if (this.choseTemplate) {
           values.id = values.templateId.key
          }
          this.getData(values)
          this.$emit('nextStep')
        }
      })
    },
    getData(values) {
      this.$emit('getData', values, 2)
    },
    prevStep () {
      this.$emit('prevStep')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
