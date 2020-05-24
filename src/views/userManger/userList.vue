<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-17 21:35:19
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-24 17:20:31
--> 
<template>
  <div class="user">
    <Row>
      <div class="header" ref="header">
        <div class="title">
          <span>用户管理列表</span>
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
          :label-width="70"
        >
          <FormItem label="用户名">
            <Input v-model="searchForm.userName" />
          </FormItem>
          <FormItem label="手机号">
            <Input v-model="searchForm.mobile" />
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
        <template slot-scope="{row}" slot="type">
          <span>{{row.type | changeType}}</span>
        </template>
        <template slot-scope="{row}" slot="action">
          <Button type="primary" @click="handleEdit(row)" style="margin-right:6px" size="small">编辑</Button>
          <Button type="error" @click="handleDelete(row)" style="margin-right:6px" size="small">删除</Button>
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
    <!-- 新增 -->
    <Modal v-model="modalStatus" :title="modalTitle">
      <Form :model="form" :rules="rules" ref="form" :label-width="100">
        <FormItem label="姓名:" prop="userName">
          <Input v-model="form.userName" />
        </FormItem>
        <FormItem label="手机号:" prop="mobile">
          <Input v-model="form.mobile" v-if="isEdit=='add'" />
          <span v-else>{{form.mobile}}</span>
        </FormItem>
        <FormItem label="所属镇区:" prop="areaId" v-if="isShow">
          <Cascader
            @on-visible-change="clickArea"
            ref="cascader"
            :data="addressData"
            :value="form.areaId"
            @on-change="changeArea"
            :load-data="loadData"
            transfer
          ></Cascader>
        </FormItem>
        <FormItem v-else label="所属镇区:">
          <span>{{form.area}}</span>
        </FormItem>
        <FormItem label="角色:" prop="type" v-if="isEdit=='add'">
          <RadioGroup v-model="form.type">
            <Radio label="TOWNPRINCIPAL" style="margin-right:20px">镇区负责人</Radio>
            <Radio label="EDUCATIONPRINCIPAL">教育局人员</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="角色:" v-else>{{form.type | changeType}}</FormItem>
        <FormItem label="初始密码:" prop="password" v-if="isEdit=='add'">
          <Input v-model="form.password" />
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
import {
  getUserList,
  getAddresslist,
  addUser,
  deleteUser,
  editUser
} from "@/api";
export default {
  data() {
    return {
      isEdit: "add",
      isShow: true,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "姓名",
          align: "center",
          key: "userName",
          minWidth: 100
        },
        {
          title: "手机号",
          align: "center",
          key: "mobile",
          minWidth: 100
        },
        {
          title: "所属镇区",
          align: "center",
          key: "area",
          minWidth: 140
        },
        {
          title: "角色",
          align: "center",
          slot: "type",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 180,
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
      modalStatus: false,
      modalTitle: "",
      form: {
        userName: "",
        mobile: "",
        area: [],
        areaId: [],
        type: "",
        password: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            type: "number",
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur",
            transform(value) {
              var myreg = /^[1][0-9]{10}$/;
              if (!myreg.test(value)) {
                return false;
              } else {
                return Number(value);
              }
            }
          }
        ],
        areaId: [
          {
            required: true,
            message: "请选择地区",
            trigger: "change",
            type: "array"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入初始密码",
            trigger: "blur"
          }
        ]
      },
      addressData: []
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
  filters: {
    changeType(msg) {
      switch (msg) {
        case "TOWNPRINCIPAL":
          return "镇区负责人";
          break;
        case "EDUCATIONPRINCIPAL":
          return "教育局人员";
          break;
        case "STUDENT":
          return "学生";
          break;
        case "TEACHER":
          return "教师";
          break;
        case "ORGPRINCIPAL":
          return "培训机构负责人";
          break;
      }
    }
  },
  methods: {
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
    getTableInfo() {
      getUserList(this.searchForm).then(res => {
        if (res.code == 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    add() {
      this.modalTitle = "新增用户";
      this.modalStatus = true;
      this.isEdit = "add";
      this.form = {
        userName: "",
        mobile: "",
        area: [],
        areaId: [],
        type: "",
        password: ""
      };
      this.$refs["form"].resetFields();
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
    handleEdit(row) {
      if (row.type == "TOWNPRINCIPAL" || row.type == "EDUCATIONPRINCIPAL") {
        this.isShow = true;
        // console.log("有");
      } else {
        this.isShow = false;
        // console.log("无");
      }
      this.modalTitle = "编辑用户";
      this.isEdit = "edit";
      this.modalStatus = true;
      // this.$refs["form"].resetFields();
      let obj = JSON.parse(JSON.stringify(row));

      this.form.id = obj.id;
      this.form.userName = obj.userName;
      this.form.mobile = obj.mobile;
      this.form.type = obj.type;
      this.form.password = obj.password;
      this.form.area = obj.area;
      let arr = obj.areaId.split(",");
      this.regroupAddress(arr);
    },
    //数据--通用地址
    async regroupAddress(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        await this.getAddresslist(arr[i], i, arr);
      }
      let ar = [];
      arr.forEach(item => {
        ar.push(item * 1);
      });
      this.form.areaId = ar;
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "确认删除这个用户?",
        onOk: () => {
          deleteUser(row.id).then(res => {
            if (res.code == 200) {
              this.$Message.success("删除成功!");
              this.getTableInfo();
            }
          });
        }
      });
    },
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        console.log(valid, this.form);
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form));
          obj.areaId = this.form.areaId.join(",");

          if (this.isEdit == "add") {
            addUser(obj).then(res => {
              if (res.code == 200) {
                this.$Message.success("新增用户成功!");
                this.modalStatus = false;
                this.getTableInfo();
              }
            });
          } else if (this.isEdit == "edit") {
            editUser(obj).then(res => {
              if (res.code == 200) {
                this.$Message.success("编辑用户成功!");
                this.modalStatus = false;
                this.getTableInfo();
              }
            });
          }
        }
      });
    },
    // 获取省份
    getAddresslist(id, i, arr) {
      if (this.isEdit == "add") {
        getAddresslist({ level: 1 }).then(res => {
          this.addressData = res.result;
          this.addressData.forEach(item => {
            item.children = [];
            item.loading = false;
          });
        });
      } else if (this.isEdit == "edit") {
        return getAddresslist({ pid: id }).then(res => {
          if (i == 0) {
            this.addressData.forEach(item => {
              if (item.id == id) {
                item.children = res.result;
                item.loading = false;
              } else {
                item.children = [];
                item.loading = false;
              }
            });
          } else if (i == 1) {
            this.addressData.forEach(item => {
              if (item.id == arr[i - 1]) {
                item.children.forEach(it => {
                  if (it.id == id) {
                    it.children = res.result;
                    it.loading = false;
                    console.log(it.name, it.children);
                  } else {
                    it.children = [];
                    it.loading = false;
                  }
                });
              }
            });
          }
        });
      }
    },
    clickArea(val) {
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
      let areaId = [];
      v.map(val => {
        areaId.push(val * 1);
      });
      this.form.area = area;
      this.form.areaId = areaId;
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
.user {
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