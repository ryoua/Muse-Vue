<template>
  <div>
    <a-form>
      <a-result title="发送成功" status="success" sub-title="预计十分钟内发送完成" style="max-width: 560px; margin: 40px auto 0;">
        <template #extra>
          <a-button type="primary" @click="finish">再发一次</a-button>
          <a-button style="margin-left: 8px" @click="toOrderList">查看详情</a-button>
        </template>
      </a-result>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: 'Step4',
    data () {
      return {
        loading: false
      }
    },
    methods: {
      finish () {
        this.$emit('finish')
      },
      toOrderList () {
        this.$router.push('/list/table-list')
      }
    }
  }
</script>
<style lang="less" scoped>
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
</style>
