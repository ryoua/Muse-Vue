<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <a-form-item label="模板ID">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="模板名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="模板类型">
                <a-select placeholder="请选择" default-value="" v-model="queryParam.type">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">字符串</a-select-option>
                  <a-select-option value="2">文件</a-select-option>
                  <a-select-option value="3">SQL</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="用户id类型">
                <a-select placeholder="请选择" default-value="" v-model="queryParam.receiverType">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">uid</a-select-option>
                  <a-select-option value="2">phone</a-select-option>
                  <a-select-option value="3">did</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" default-value="" v-model="queryParam.status">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">待审核</a-select-option>
                  <a-select-option value="1">审核通过</a-select-option>
                  <a-select-option value="2">审核不通过</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="2" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="queryByParam">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="small"
        :rowKey="columns => columns.id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >

        <span slot="action" slot-scope="text, record">
          <template>
            <a-progress :percent="20" :status=" null " style="width: 180px" />
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定删除吗?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleSub(record)"
              @cancel="cancel"
            >
        <a-button type="danger" size="small">删除</a-button>
      </a-popconfirm>

          </template>
        </span>
      </s-table>

      <div v-if="visible">
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
        @add="add"
        />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList } from '@/api/manage'
import { receiverTemplateAll, addReceiverTemplate, deleteReceiverTemplateById, deleteReceiverTemplateByIds } from '@/api/template'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

function convertContent() {

}

function filterContent(text) {
  if (!text) return '';
  if (text.length > 30) {
    return text.slice(0, 30) + '...'
  }
  return text
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '消息发送名称',
    dataIndex: 'name'
  },
  {
    title: '消息类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '发送类型',
    dataIndex: 'receiverType',
    scopedSlots: { customRender: 'receiverType' }
  },
  {
    title: '发送人群数量',
    dataIndex: 'content',
    width: '100px',
    customRender: (text) => filterContent(text),
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '200px',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'updateTime',
    width: '200px',
    customRender: (text) => new Date(text).format("yyyy-MM-dd hh:mm:ss"),
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '300px',
    scopedSlots: { customRender: 'action' }
  }
]

const sendTypeMap = {
  1: {
    text: '周期发送'
  },
  2: {
    text: '立即发送'
  },
}

const messageTypeMap = {
  1: {
    text: '短信'
  },
  2: {
    text: '邮件'
  }
}

const statusMap = {
  0: {
    status: 'default',
    text: '下发中'
  },
  1: {
    status: 'success',
    text: '下发成功'
  },
  2: {
    status: 'error',
    text: '下发失败'
  }
}

export default {
  name: 'history',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {

      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return receiverTemplateAll(parameter, this.queryParam)
          .then(res => {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].receiverType = sendTypeMap[res.data[i].receiverType].text
              res.data[i].type = messageTypeMap[res.data[i].type].text
            }
            return res
          }).catch((e) => {})
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    receiverFilter (type) {
      return receiverTypeMap[type].text
    },
    templateFilter (type) {
      return templateTypeMap[type].text
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {

    queryByParam() {
      this.$refs.table.refresh()
    },

    confirm(e) {
      console.log(e);
      this.$message.success('Click on Yes');
    },
    cancel(e) {

    },


    receiverFilter (type) {
      return sendTypeMap[type].text
    },
    templateFilter (type) {
      return templateTypeMap[type].text
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      console.log(record)
      this.visible = true
      this.mdl = { ...record }
    },

    convertContent(data) {

    },

    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    add () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {

          if (values.type === 1) {
            values.content = values.receivers
          } else if (values.type === 2) {
            values.content = values.fileurl
          } else if (values.type === 3) {
            values.content = values.sql
          }

            // 新增
          addReceiverTemplate(values).then(res => {
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
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleDelete() {
      console.log(this.selectedRowKeys)
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请先选择要删除的模板')
      } else {
        deleteReceiverTemplateByIds(this.selectedRowKeys).then((res) => {
          if (res.code === 200) {
            this.$message.info('删除成功')
          } else {
            this.$message.error('删除失败')
          }
          this.$refs.table.refresh()
        }).catch(() => {
          this.$message.error('删除失败')
        })
        this.$refs.table.refresh()
      }
    },
    handleSub (record) {
      deleteReceiverTemplateById(record.id).then((res) => {
          if (res.code === 200) {
            this.$message.info('删除成功')
          } else {
            this.$message.error('删除失败')
          }
        this.$refs.table.refresh()
      }).catch(() => {
        this.$message.error('删除失败')
      })
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
