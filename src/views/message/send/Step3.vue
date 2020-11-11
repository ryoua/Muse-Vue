<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="用户数较大时, 尽量使用SQL查询或者文件上传。"
        style="margin-bottom: 24px;"
      />

      <a-form-item
        label="输入类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select v-model="choseUser.type"
                  v-decorator="['receiver.type', { initialValue: choseUser.type, rules: [{required: true, message: '消息类型必须选择'}] }]">
          <a-select-option :value=0>使用模板</a-select-option>
          <a-select-option :value=1>直接输入</a-select-option>
          <a-select-option :value=2>文件上传</a-select-option>
          <a-select-option :value=3>SQL查询</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="模板列表"
        :labelCol="{lg: {span: 5}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 15}, sm: {span: 25} }"
        :required="true"
        v-if="choseUser.type === 0">
        <a-select
          label-in-value
          :value="value"
          placeholder="请选择模板"
          mode="default"
          style="width: 100%"
          :filter-option="false"
          @dropdownVisibleChange="getTemplateName"
          v-decorator="['receiver.content', { initialValue: [], rules: [{required: true, message: '必须选择模板'}]}]"

        >
          <a-spin  slot="notFoundContent" size="small" />
          <a-select-option v-for="d in data" :key="d.id">{{d.name}}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="用户id"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
       v-if="choseUser.type === 1">
        <a-input
          placeholder="请输入用户id, 如有多个, 以逗号分隔"
          style="width: 80%;"
          v-decorator="['receiver.str', {initialValue: choseUser.users,  rules: [{required: true, message: '请输入用户id'}] }]" />
      </a-form-item>

      <a-form-item
        label="文件"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
        v-if="choseUser.type === 2">
        <a-upload
          action="http://127.0.0.1:9009/manager/message/upload"
          :multiple="true"
          :file-list="fileList"
          @change="handleChange"
        >
          <a-button> <a-icon type="upload" /> Upload </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item
        label="用户id"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
        v-if="choseUser.type === 3">
        <a-textarea
          placeholder="请直接输入SQL语句"
          style="width: 80%;"

          v-decorator="['receiver.sql', { initialValue: choseUser.sql,  rules: [{required: true, message: '请输入SQL语句'}] }]" />
      </a-form-item>


      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button style="margin-right: 8px" @click="prevStep">上一步</a-button>
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>

  import { getAllMessageTemplateName, getAllReceiverTemplateName, getReceiverTemplateNameLike } from '@/api/message'

  export default {
    name: 'Step3',
    data () {
      return {
        data: [],
        choseUser: {
          type: 1,
          sql: '',
          users: '',
        },
        fileList: [
          {
            uid: '-1',
            name: 'xxx.json',
            status: 'done',
            url: 'http://www.baidu.com/xxx.png',
          },
        ],
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
      handleChange(info) {
        let fileList = [...info.fileList];
        fileList = fileList.slice(1);
        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.fileList = fileList;
      },

      nextStep () {
        const _this = this
        _this.loading = true
        const { form: { validateFields } } = this
        // 先校验，通过表单校验后，才进入下一步
        // sendMessage(_this.fileList);
        validateFields((err, values) => {
          if (!err) {
            _this.timer = setTimeout(function () {
              _this.loading = false
              _this.getData(values)
              _this.$emit('nextStep')
            }, 100)
          } else {
            _this.loading = false
          }
        })
      },
      getTemplateName() {
        getAllReceiverTemplateName().then((res) => {
          this.data = res.data
        })
      },
      getData(values) {
        this.$emit('getData', values, 3)
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
