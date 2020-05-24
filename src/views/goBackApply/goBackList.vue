<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-23 14:14:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-24 13:44:55
--> 
<template>
  <div class="trainlist">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>复学申请列表</span>
        </div>
        <div class="export-btn">
          <Button type="primary" icon="md-add" @click="add">新建</Button>
        </div>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 搜索 -->
    <Row>
      <div class="search">
        <Form
          :model="searchForm"
          ref="searchForm"
          style="display:flex;float:left"
          :label-width="60"
        >
          <FormItem label="状态">
            <Select v-model="searchForm.status" transfer>
              <Option :value="0">已提交</Option>
              <Option :value="1">通过</Option>
              <Option :value="2">未通过</Option>
            </Select>
          </FormItem>
        </Form>
        <div style="float:right;margin:11px 0">
          <Button type="primary" @click="handleSearch">搜索</Button>
          <Button @click="handleReset" style="margin-left:6px">重置</Button>
        </div>
      </div>
    </Row>
    <!-- 表格 -->
    <Row>
      <Table
        :columns="columns"
        :data="data"
        border
        ref="table"
        :loading="loading"
        :height="tableHeight"
        @on-selection-change="changeSelect"
      >
        <template slot-scope="{row}" slot="status">
          <Tag :color="tagClor(row.status)">{{row.status | statusChange}}</Tag>
        </template>
        <template slot-scope="{row}" slot="action">
          <Button type="primary" @click="handleDetail(row)" style="margin-right:6px" size="small">查看</Button>
          <Button type="error" @click="handleDelete(row)" style="margin-right:6px" size="small">删除</Button>
          <Button type="primary" @click="handleCheck(row)" size="small">审核</Button>
        </template>
      </Table>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
          :page-size="searchForm.pageSize"
          :total="total"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
    </Row>
    <!-- 审核弹框 -->
    <Modal v-model="checkStatus" title="复学审批">
      <Form ref="formItem" :model="checkForm" :mask-closable="false">
        <FormItem
          label="状态:"
          :label-width="70"
          prop="status"
          :rules="{required: true, message: '请选择状态', trigger: 'change',type:'number'}"
        >
          <RadioGroup v-model="checkForm.status">
            <Radio :label="1" style="margin-right:20px">通过</Radio>
            <Radio :label="2">未通过</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="checkStatus=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getAuditlist, deletApprove, applyList } from "@/api";
export default {
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "所属镇区",
          align: "center",
          key: "address",
          minWidth: 100
        },
        {
          title: "机构全称",
          align: "center",
          key: "organizationName",
          minWidth: 100
        },
        {
          title: "提交时间",
          align: "center",
          key: "creationTime",
          minWidth: 140
        },
        {
          title: "状态",
          align: "center",
          slot: "status",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 200,
          fixed: "right"
        }
      ],
      data: [],
      loading: false,
      tableHeight: 0,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      checkStatus: false,
      checkForm: {
        status: ""
      }
    };
  },
  created() {
    this.getTableInfo();
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  filters: {
    statusChange(val) {
      switch (val) {
        case 0:
          return "已提交";
          break;
        case 1:
          return "通过";
          break;
        case 2:
          return "未通过";
          break;
      }
    }
  },
  methods: {
    tagClor(val) {
      switch (val) {
        case 0:
          return "blue";
          break;
        case 1:
          return "green";
          break;
        case 2:
          return "red";
          break;
      }
    },
    getTableInfo() {
      getAuditlist(this.searchForm).then(res => {
        if (res.code == 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },
    /**
     * 页面&表格高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 123;
    },
    add() {
      this.$router.push({ name: "addApprove" });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getTableInfo();
    },
    handleReset() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10
      };
      this.getTableInfo();
    },
    changeSelect() {},
    handleDetail(row) {},
    handleDelete(row) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "确认删除这条复学审批?",
        onOk: () => {
          deletApprove({ id: row.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success("删除成功!");
              this.getTableInfo();
            }
          });
        }
      });
    },
    handleCheck(row) {
      this.checkStatus = true;
      this.$refs["formItem"].resetFields();
      this.checkForm.id = row.id;
    },
    handleSubmit() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          applyList(this.checkForm).then(res => {
            if (res.code == 200) {
              this.$Message.success("状态修改成功!");
              this.checkStatu = false;
              this.getTableInfo();
            }
          });
        }
      });
    },
    changePage(e) {
      this.searchForm.pageNumber = e;
      this.getTableInfo();
    },
    changePageSize(e) {
      this.searchForm.pageSize = e;
      this.getTableInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
.trainlist {
  padding: 16px;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 6px;
    .title {
      color: #2d8cf0;
      font-weight: bold;
      line-height: 32px;
    }
  }
  .search {
    border: 1px solid #dcdee2;
    border-radius: 4px;
    padding: 0 6px;
    margin-bottom: 10px;
    overflow: hidden;
    .ivu-form {
      .ivu-form-item {
        margin: 10px 0;
        margin-right: 12px;
      }
    }
  }
  .footer {
    margin-top: 10px;
  }
}
</style>