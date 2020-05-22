<template>
  <div>
    <Table border :columns="columns" :data="data" :height="tableHeight" :loading="loading">
      <!-- 图片 -->
      <template slot="qrcodeUrl" slot-scope="{row}">
        <imageView v-if="row.qrcodeUrl" :src="row.qrcodeUrl" />
        <span v-else>-</span>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button
          type="primary"
          size="small"
          v-if="active == 'market' && menuBtns.indexOf('smc:sales:transfer')>-1"
          @click="handleUpdate(row,index)"
        >团队变更</Button>
        <Button
          type="error"
          size="small"
          v-if="active == 'market' && menuBtns.indexOf('smc:sales:update')>-1"
          @click="handleQuit(row,index)"
          style="margin:0 6px"
        >离职</Button>
        <Button
          type="primary"
          size="small"
          v-if="active == 'market' && menuBtns.indexOf('smc:sales:edit')>-1"
          @click="salesEdit(row)"
        >编辑</Button>
        <Button
          type="primary"
          size="small"
          style="margin-right:6px"
          v-if="active == 'engineer' && menuBtns.indexOf('workorder:engineer:update')>-1"
          @click="engineerEdit(row)"
        >编辑</Button>
        <Button
          type="error"
          size="small"
          v-if="active == 'engineer' && menuBtns.indexOf('workorder:engineer:delete')>-1"
          @click="handleDel(row)"
        >删除</Button>
        <Button
          type="primary"
          size="small"
          style="margin-right:6px"
          v-if="active == 'service' && menuBtns.indexOf('customerService:customerService:modify')>-1"
          @click="serviceEdit(row)"
        >编辑</Button>
        <Button
          type="error"
          size="small"
          v-if="active == 'service' && menuBtns.indexOf('customerService:customerService:delete')>-1"
          @click="handleDel(row)"
        >删除</Button>
      </template>
      <!-- 状态 -->
      <template slot="status" slot-scope="{row}">
        <Tag :color="row.status=='在职'?'green':'red'">{{row.status}}</Tag>
      </template>
    </Table>
    <date-view :quitId="quitId" @quitok="quitok" />
    <toUpdate :toupdate="toupdate" :list="list" ref="update" />
  </div>
</template>
<script>
import imageView from "@/components/imageView";
import dateView from "./quit";
import toUpdate from "./ToUpdate";
import { mapState } from "vuex";
import {
  TablelistByPage,
  customerServiceList,
  customerServiceDel,
  listEngineers,
  removeEngineerById
} from "@/api";
import { columnMarket, columnsService, columnsEngineer } from "./tableLIst";
import bus from "@/utils/bus";
export default {
  props: ["list", "searchForm"],
  components: { dateView, toUpdate, imageView },
  data() {
    return {
      tableHeight: 0,
      toupdate: true,
      quitId: 0,
      pageNum: 1,
      columns: [],
      active: "",
      data: [],
      loading: true,
      seacrhData: {
        pageNumber: 1,
        pageSize: 10,
        sort: "",
        order: "",
        salesTeamId: "",
        searchTxt: "",
        status: "",
        salesType: "",
        isLeader: "",
        salesLevel: ""
      }
    };
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  created() {
    this.active = this.$route.name;
    this.initHeight();
    this.seacrhData.pageNumber = this.searchForm.pageNumber;
    this.seacrhData.pageSize = this.searchForm.pageSize;
    this.seacrhData.total = this.searchForm.total;
  },
  mounted() {
    bus.$off("hideShow");
    bus.$on("hideShow", item => {
      this.dataFun();
    });
    bus.$off("AddUpdata");
    bus.$on("AddUpdata", item => {
      this.dataFun();
    });
    bus.$off("datas");
    bus.$on("datas", item => {
      // console.log("表格", item);
      this.seacrhData.salesTeamId = item.id;
      this.dataFun();
    });
    bus.$off("updataTable");
    bus.$on("updataTable", item => {
      this.dataFun();
    });
    bus.$off("pagesTotal");
    bus.$on("pagesTotal", item => {
      this.pageNum = item;
      this.seacrhData.pageNumber = item;
      this.dataFun();
    });
    bus.$off("pageSizeClicl");
    bus.$on("pageSizeClicl", item => {
      this.seacrhData.pageSize = item;
      this.dataFun();
    });
    bus.$off("salesTransfor");
    bus.$on("salesTransfor", item => {
      this._listByPage();
    });
  },
  watch: {
    list(val) {}
  },
  methods: {
    quitok() {
      this._listByPage();
    },
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 280;
    },
    dataFun() {
      switch (this.active) {
        case "market":
          this._listByPage();
          this.columns = columnMarket;
          break;
        case "service":
          this._customerServiceList();
          this.columns = columnsService;
          break;
        case "engineer":
          this._getAddPerson();
          this.columns = columnsEngineer;
          break;
        default:
          break;
      }
    },
    // 销售列表
    async _listByPage() {
      await TablelistByPage(this.seacrhData).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.data = res.result.content;
          this.data.map(item => {
            item.isLeader == 1
              ? (item.isLeader = "领导")
              : (item.isLeader = "普通员工");
            item.status == "ENABLE"
              ? (item.status = "在职")
              : (item.status = "离职");
            switch (item.salesLevel) {
              case "PRIMARY":
                item.salesLevel = "初级";
                break;
              case "MIDDLE":
                item.salesLevel = "中级";
                break;
              case "ADVANCED":
                item.salesLevel = "高级";
                break;
              default:
                break;
            }
            switch (item.salesType) {
              case "Telesales":
                item.salesType = "电销";
                break;
              case "UserSales":
                item.salesType = "客户销售";
                break;
              case "ChannelSales":
                item.salesType = "渠道销售";
                break;
              default:
                break;
            }
            return this.data;
          });
          this.searchForm.total = res.result.totalElements;
          bus.$emit("total", this.searchForm.total);
        }
      });
    },
    // 客服列表
    async _customerServiceList() {
      let obj = {
        pageNumber: this.seacrhData.pageNumber,
        pageSize: this.seacrhData.pageSize,
        sort: "", //排序
        order: "", //排序方式 asc/desc
        name: "", //客服名称
        groupId: this.seacrhData.salesTeamId, //客服组别ID
        status: "" //状态
      };
      await customerServiceList(obj).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.data = res.result.content;
          this.data.map(item => {
            // console.log(item);
            item.isLeader == 1
              ? (item.isLeader = "是")
              : (item.isLeader = "否");
            item.status == "ENABLE"
              ? (item.status = "有效")
              : (item.status = "失效");
            return this.data;
          });
          this.searchForm.total = res.result.totalElements;
          bus.$emit("total", this.searchForm.total);
        }
      });
    },
    // 工程师列表
    _getAddPerson() {
      let obj = {
        pageNumber: this.seacrhData.pageNumber,
        pageSize: this.seacrhData.pageSize,
        sort: "", //排序
        order: "", //排序方式 asc/desc
        name: "", //客服名称
        groupId: this.seacrhData.salesTeamId, //客服组别ID
        status: "" //状态
      };
      listEngineers(obj).then(res => {
        this.loading = false;
        this.data = res.result.content;
        this.data.map(item => {
          item.status == "ENABLE"
            ? (item.status = "有效")
            : (item.status = "失效");
          item.groupId == "1" ? (item.groupId = "是") : (item.groupId = "否");
          item.isLeader == "0"
            ? (item.isLeader = "否")
            : (item.isLeader = "是");
          switch (item.level) {
            case "PRIMARY":
              item.level = "初级";
              break;
            case "MIDDLE":
              item.level = "中级";
              break;
            case "ADVANCED":
              item.level = "高级";
              break;

            default:
              break;
          }
          return this.data;
        });
        this.searchForm.total = res.result.totalElements;
        bus.$emit("total", this.searchForm.total);
      });
    },
    handleUpdate(row, index) {
      bus.$emit("update", row);
      this.$refs.update._salesTeam();
    },
    handleEdit(row) {
      // console.log(row);
      let obj = JSON.parse(JSON.stringify(row));
      bus.$emit("rowObj", obj);
    },
    salesEdit(row) {
      this.$emit("salesEdit", row.id);
    },
    engineerEdit(row) {
      console.log(row.id);
      this.$emit("engineerEdit", row.id);
    },
    serviceEdit(row) {
      this.$emit("serviceEdit", row.id);
    },
    handleDetails() {
      this.salesModalVisible = true;
      this.disabled = true;
    },
    handleDel(row) {
      this.$Modal.confirm({
        title: "确定要删除吗？",
        content: `删除${name}该人员?`,
        onOk: () => {
          if (this.active == "service") {
            customerServiceDel(row.id).then(res => {
              if (res.code == 200) {
                this.$Message.success(res.message);
                this._customerServiceList();
              }
            });
          } else {
            let obj = { id: row.id };
            removeEngineerById(obj).then(res => {
              if (res.code == 200) {
                this.$Message.success(res.message);
                this._getAddPerson();
              }
            });
          }
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    },
    handleQuit(row) {
      this.quitId = row.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.table-list {
  height: 74vh;
  overflow: auto;
  button {
    margin-left: 10px;
  }
}
</style>