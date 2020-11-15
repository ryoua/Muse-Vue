<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-spin :spinning="loading">
          <a-form :form="form" v-bind="formLayout">
            <a-form-item
              label="邮件服务器地址"
              :labelCol="{lg: {span: 5}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 7}, sm: {span: 7} }"
              :required="true"
              class="stepFormText"
            >
              <a-input
                style="width: 80%;"
                v-decorator="['email.host', { initialValue: '', rules: [{required: true, message: '请输入SMTP地址'}] }]" />
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
                v-decorator="['email.port', { initialValue: '', rules: [{required: true, message: '请输入SMTP端口'}] }]" />
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
                v-decorator="['email.from', { initialValue: '', rules: [{required: true, message: '请输入SMTP端口'}] }]" />
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


          </a-form>
        </a-spin>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setavatar"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'

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
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  methods: {
    setavatar (url) {
      this.option.img = url
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
