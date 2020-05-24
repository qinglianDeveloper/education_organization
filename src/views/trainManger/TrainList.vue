<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-23 14:14:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-24 10:58:56
--> 
<template>
  <div class="trainlist">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>培训机构列表</span>
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
          :label-width="100"
        >
          <FormItem label="教育机构名称">
            <Input v-model="searchForm.orgName" placeholder="请输入教育机构名称" />
          </FormItem>
          <FormItem label="负责人姓名">
            <Input v-model="searchForm.principalName" placeholder="请输入负责人姓名" />
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
        <template slot="action" slot-scope="{row,index}">
          <Button
            type="primary"
            size="small"
            style="margin-right:6px"
            @click="handleEveryday(row,index)"
          >每日健康</Button>
          <Button
            type="primary"
            size="small"
            style="margin-right:6px"
            @click="handleReport(row,index)"
          >健康上报</Button>
          <Button
            type="primary"
            size="small"
            style="margin-right:6px"
            @click="handleEdit(row,index)"
          >编辑</Button>
          <!-- <Button type="error" size="small" @click="handleDelete(row,index)">删除</Button> -->
        </template>
      </Table>
    </Row>
    <!-- 分页 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchForm.pageNumber"
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
    <!-- 新建&编辑弹框 -->
    <Modal v-model="modalStatus" :title="modalTitle" :mask-closable="false">
      <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate">
        <FormItem label="机构名称:" prop="orgName">
          <Input v-model="formItem.orgName" />
        </FormItem>
        <FormItem label="区域:" prop="area">
          <Cascader
            @on-visible-change="clickArea"
            ref="cascader"
            :data="addressData"
            :value="formItem.area"
            @on-change="changeArea"
            :load-data="loadData"
            transfer
          ></Cascader>
        </FormItem>

        <FormItem label="地址:" prop="areaDetail">
          <Input :autosize="true" type="textarea" v-model="formItem.areaDetail" placeholder="请输入地址"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalStatus=false">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getOrgList, getListSearch, getAddresslist, addOrg } from "@/api";
import { dateFormat } from "@/utils/current";
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
          title: "机构所在区域",
          key: "areaDetail",
          align: "center",
          minWidth: 180
        },
        {
          title: "教育机构名称",
          key: "orgName",
          align: "center",
          minWidth: 200
        },
        {
          title: "负责人姓名",
          key: "principalName",
          align: "center",
          minWidth: 160
        },
        {
          title: "负责人电话号码",
          key: "principalMobile",
          align: "center",
          minWidth: 160
        },
        {
          title: "登记时间",
          key: "createdTime",
          align: "center",
          minWidth: 170
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 260,
          fixed: "right"
        }
      ],
      data: [],
      loading: true,
      tableHeight: 0,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      modalTitle: "",
      modalStatus: false,
      addressData: [],
      formItem: {
        orgName: "",
        areaId: "",
        area: [],
        areaDetail: ""
      },
      ruleValidate: {
        orgName: [
          {
            required: true,
            message: "请输入教育机构名称",
            trigger: "blur"
          }
        ],
        area: [
          {
            required: true,
            message: "请选择地区",
            trigger: "change",
            type: "array"
          }
        ],
        areaDetail: [
          {
            required: true,
            message: "地址不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getTableInfo();
  },
  mounted() {
    this.init();
    this.getAddresslist(); //地址接口
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    getTableInfo() {
      getOrgList(this.searchForm).then(res => {
        if (res.code == 200) {
          res.result.content.forEach(item => {
            if (item.createdTime) {
              item.createdTime = dateFormat(item.createdTime);
            }
          });
          this.data = res.result.content;
          this.total = res.result.totalElements;
          this.loading = false;
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
      this.modalTitle = "新增培训机构";
      this.modalStatus = true;
      this.$refs["formItem"].resetFields();
    },
    handleSubmit() {
      this.$refs["formItem"].validate(valid => {
        console.log(valid, this.formItem);
        if (valid) {
          addOrg(this.formItem).then(res => {
            if (res.code == 200) {
              this.$Message.success("新增机构成功！");
              this.getTableInfo();
              this.modalStatus = false;
            }
          });
        }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getTableInfo();
    },
    handleReset() {
      this.searchForm = {
        pageNumber: 1,
        pageSize: 10,
        orgName: "",
        principalName: ""
      };
      this.getTableInfo();
    },
    changeSelect() {},
    handleEveryday(row, index) {},
    handleReport(row, index) {
      this.$router.push({
        name: "personInfo",
        query: {
          id: row.id
        }
      });
    },
    handleEdit(row, index) {
      this.modalTitle = "编辑培训机构";
      this.modalStatus = true;
      this.$refs["formItem"].resetFields();
    },
    handleDelete(row, index) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除这个机构?",
        onOk: () => {}
      });
    },
    // 获取省份
    getAddresslist(obj) {
      getAddresslist({ level: 1 }).then(res => {
        this.addressData = res.result;
        this.addressData.forEach(item => {
          item.children = [];
          item.loading = false;
        });
      });
    },
    clickArea(val) {
      console.log(val, this.addressData, "点击了");
      if (val && !this.addressData[0]) {
        this.getAddresslist();
      }
    },
    changeArea(v, item) {
      console.log(v, item);
      let area = [];
      item.map(val => {
        area.push(val.label);
      });
      this.formItem.area = area;
      this.formItem.areaId = v.join(",");
    },
    loadData(item, callback) {
      item.loading = true;
      getAddresslist({ pid: item.id }).then(res => {
        if (res.code == 200) {
          item.loading = false;
          item.children = res.result;
          if (item.level < 2) {
            item.children.forEach(it => {
              it.loading = false;
              it.children = [];
            });
          }
          callback();
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