<template>
  <page-header-wrapper>
    <template v-slot:content>
    </template>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="选择消息类型"/>
        <a-step title="编辑消息"/>
        <a-step title="选择用户"/>
        <a-step title="完成"/>
      </a-steps>
      <div class="content">
        <step1 v-show="currentTab === 0" @nextStep="nextStep" @getData="getData"/>
        <step2 v-bind:messageType="this.messageSend.messageType" v-show="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" @getData="getData" />
        <step3 v-show="currentTab === 2" @nextStep="nextStep" @prevStep="prevStep" @getData="getData"/>
        <step4 v-show="currentTab === 3" @prevStep="prevStep" @finish="finish" @getData="getData"/>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import Step1 from './Step1'
  import Step2 from './Step2'
  import Step3 from './Step3'
  import Step4 from './Step4'
  import { sendMessage } from '@/api/message'

  export default {
    name: 'StepForm',
    components: {
      Step1,
      Step2,
      Step3,
      Step4
    },
    data() {
      return {
        messageSend: {
          messageType: '',
          messageName: '',
          message: '',
          receiver: ''
        },
        currentTab: 0,
        // message
        form: null
      }
    },
    methods: {
      getType() {
        return this.messageSend.messageType;
      },

      getData(data, type) {
        if (data['messageType'] != null) {
          this.messageSend.messageType = data['messageType']
        }
        if (data['messageName'] != null) {
          this.messageSend.messageName = data['messageName']
        }

        if (type === 2) {
          this.messageSend.message = data
          if (data.choseTemplate) {
            this.messageSend.message.message = data.id
          }
        }

        if (type === 3) {
          this.messageSend.receiver = data.receiver
          if (data.receiver.type === 0) {
            this.messageSend.receiver.choseTemplate = true
            this.messageSend.receiver.receiver = data.receiver.content.key
          } else {
            this.messageSend.receiver.choseTemplate = false
            if (data.receiver.type === 1) {
              this.messageSend.receiver.receiver = data.receiver.str
            } else if (data.receiver.type === 2) {
              this.messageSend.receiver.receiver = data.receiver.fileUrl
            } else {
              this.messageSend.receiver.content = data.receiver.sql
            }
          }
        }
      },

      // handler
      nextStep() {
        if (this.currentTab === 2) {
            sendMessage(this.messageSend).then(res => {

            }).catch(() => {

            })
        }
        if (this.currentTab === 0) {

        }
        if (this.currentTab < 3) {
          this.currentTab += 1
        }
      },
      prevStep() {
        if (this.currentTab > 0) {
          this.currentTab -= 1
        }
      },
      finish() {
        this.currentTab = 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
