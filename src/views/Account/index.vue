<template>
  <div class="box">
    <my-header></my-header>
    <div class="alert-box">
      <Alert style="width:200px;margin-right:10px">
        <span style="margin-right: 20px;">已选择{{num}}项</span>
        <a href="javascript:;" @click="BtnNum">清空</a>
      </Alert>
      <Button disabled>
        转移
        <Icon type="md-arrow-forward" />
      </Button>
    </div>
    <Table
      border
      :height="tableHeight"
      class="table-box"
      ref="selection"
      :columns="columns"
      :data="data"
      @on-selection-change="selectChange"
    >
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="detail(row)">详情</Button>
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="etid(row)"
          v-if="menuBtns.indexOf('customer:account:update')>-1"
        >编辑</Button>
        <Button
          type="error"
          size="small"
          @click="remove(row)"
          v-if="menuBtns.indexOf('customer:account:delete')>-1"
        >删除</Button>
      </template>
      <template slot-scope="{ row }" slot="isActive">
        <Tag :color="row.isActive==1?'green':'red'">{{row.isActive==1?'是':'否'}}</Tag>
      </template>
    </Table>
    <pages
      :fromData="searchForm"
      :total="total"
      @changePage="changePage"
      @clickPageSize="clickPageSize"
    />
    <Modal v-model="detailShow" title="账号详情" width="800">
      <CellGroup>
        <Cell title="姓名" :extra="detailOBj.cstName" />
        <Cell title="手机" :extra="detailOBj.phone" />
        <Cell title="邮箱" :extra="detailOBj.email" />
        <Cell title="创建时间" :extra="detailOBj.createdTime" />
      </CellGroup>
    </Modal>
  </div>
</template>
<script>
import { dateFormat } from "@/utils/current";
import MyHeader from "@/components/Account/header";
import pages from "@/components/pageview";
import { accountlistAccount, accountRemove, accountInfo } from "@/api";
import bus from "@/utils/bus";
import { mapState } from "vuex";
export default {
  components: { MyHeader, pages },
  data() {
    return {
      tableHeight: 0,
      detailShow: false,
      detailOBj: {},
      num: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "账号",
          minWidth: 160,
          key: "account"
        },
        {
          title: "主账号归属",
          minWidth: 160,
          key: "accountType"
        },
        {
          title: "姓名",
          minWidth: 160,
          key: "cstName"
        },
        {
          title: "电话",
          minWidth: 150,
          key: "phone"
        },
        {
          title: "激活时间",
          minWidth: 170,
          key: "activeTime"
        },
        {
          title: "GC等级",
          minWidth: 100,
          key: "gcLevel"
        },
        {
          title: "是否实名认证",
          minWidth: 140,
          slot: "isActive",
          align: "center"
        },
        {
          title: "认证情况",
          minWidth: 100,
          key: "certification"
        },
        {
          title: "平台销售人员",
          minWidth: 140,
          key: "platformCbm"
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
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        sort: "",
        order: "",
        account: "",
        belongChannel: "",
        accountType: "",
        isActive: "",
        cstName: "",
        dateType: "",
        beginTime: "",
        endTime: "",
        searchType: "ALL"
      },
      total: 0
    };
  },
  created() {
    this._listAccount();
  },
  mounted() {
    bus.$off("ok");
    bus.$on("ok", item => {
      this._listAccount();
    });
    bus.$off("e");
    bus.$on("e", item => {
      item == "我的账号"
        ? (this.searchForm.searchType = "SELF")
        : (this.searchForm.searchType = "ALL");
      this._listAccount();
    });

    this.initHeight();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  methods: {
    // 获取页面高度
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 324;
    },
    selectChange(row) {
      this.num = row.length;
    },
    BtnNum() {
      this.num = 0;
      this.$refs.selection.selectAll(false);
    },
    _listAccount() {
      accountlistAccount(this.searchForm).then(res => {
        if (res.code == 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
          this.data.map(item => {
            if (item.activeTime) {
              item.activeTime = dateFormat(item.activeTime);
            }
            switch (item.accountType) {
              case "ALIYUN":
                item.accountType = "阿里云";
                break;
              case "TENGXUNYUN":
                item.accountType = "腾讯云";
                break;
              case "HUAWEIYUN":
                item.accountType = "华为云";
                break;
              case "BAIDUYUN":
                item.accountType = "百度云";
                break;
              case "JINSHANYUN":
                item.accountType = "金山云";
                break;
              default:
                break;
            }
            switch (item.certification) {
              case "CORP":
                item.certification = "企业";
                break;
              case "PERSONAL":
                item.certification = "个人";
                break;
              case "UNCERTIFIED":
                item.certification = "未认证";
                break;
              case "UNKNOW":
                item.certification = "未知";
                break;
              default:
                break;
            }
            return this.data;
          });
        }
      });
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this._listAccount();
    },
    clickPageSize(v) {
      this.searchForm.pageSize = v;
      this._listAccount();
    },
    //详情
    detail(row) {
      let obj = { id: row.id };
      accountInfo(obj).then(res => {
        if (res.code == 200) {
          this.detailShow = true;
          this.detailOBj = res.result;
          if (this.detailOBj.createdTime) {
            this.detailOBj.createdTime = dateFormat(this.detailOBj.createdTime);
          }
        }
      });
    },
    //编辑
    etid(row) {
      bus.$emit("txt", "编辑");
      bus.$emit("accountData", row);
    },
    // 删除
    remove(row) {
      this.$Modal.confirm({
        title: "用户删除",
        content: "<p>确定要删除该用户吗？</p>",
        onOk: () => {
          let obj = { id: row.id };
          accountRemove(obj).then(res => {
            if (res.code == 200) {
              this.$Message.success("删除成功");
              this._listAccount();
            }
          });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  padding: 16px;
}
.alert-box {
  display: flex;
}
// .table-box {
//   height: calc(100vh - 500px);
// }
</style>