<template>
  <div class="clienyDetails-box">
    <header>
      <div class="name">
        <span>{{ data.name }}</span>
      </div>
      <div class="go-extranet">
        <a href="javascript:;">
          <img src="https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg" alt />
          <span>百度</span>
        </a>
      </div>
      <div class="go-extranet">
        <a href="javascript:;">
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576928888735&di=978d07f44f02c3c87a9da95e0af8d99a&imgtype=0&src=http%3A%2F%2Fpic.downcc.com%2Fupload%2F2016-2%2F2016225151815.png"
            alt
          />
          <span>天眼</span>
        </a>
      </div>
    </header>
    <Tabs type="card" @on-click="tabBtn">
      <TabPane v-for="(item,index) in tabList " :key="index" :label="item">
        <EssentialInformation v-if="index == 0" />
        <div class="Alert-box" v-if="index != 0">
          <div class="content">
            <Alert show-icon>共{{num}}条记录</Alert>
          </div>
          <div class="Button" v-if="index == 1 | index == 2">
            <Button
              @click="addClick"
              v-if="menuBtns.indexOf('customer:customerContact:modify')>-1 && index == 1 || index == 2 && menuBtns.indexOf('customer:customerAccount:modify')>-1"
            >新建{{addTitle}}</Button>
          </div>
        </div>
        <Table v-if="index != 0" border :columns="columns" :data="data1" :height="tableHeight">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              @click="etit(row,index)"
              v-if="menuBtns.indexOf('customer:customerContact:modify')>-1 || menuBtns.indexOf('customer:customerAccount:modify')>-1"
              style="margin-left:10px;"
            >编辑</Button>
            <Button
              type="error"
              size="small"
              v-if="menuBtns.indexOf('customer:customerContact:delete')>-1 || menuBtns.indexOf('customer:customerAccount:delete')>-1"
              @click="remove(row,index)"
            >删除</Button>
          </template>
        </Table>
        <pages
          v-if="index == 3"
          :fromData="sreachDate"
          :total="sreachDate.total"
          @changePage="changePage"
          @clickPageSize="clickPageSize"
        />
      </TabPane>
      <div slot="extra">
        <Button type="primary"
        v-if="menuBtns.indexOf('customer:customer:update')>-1"
        @click="followEtid">编辑</Button>
      </div>
    </Tabs>
    <FollowE :etidShow="etidShow" @handlesubmit="handlesubmit" />
    <addDetils
      :DetilsAddShow="DetilsAddShow"
      :addEtidTitle="addEtidTitle"
      :etidRow="etidRow"
      :addTitle="addTitle"
      @config="config"
      @cancelClick="cancelClick"
    />
  </div>
</template>
<script>
import EssentialInformation from "@/components/clientList/essentialInformation";
import addDetils from "@/components/clientList/addDetils";
import { column1, column2, column3 } from "./clientTable";
import { mapState } from "vuex";
import bus from "@/utils/bus";
import {
  customerGetlist,
  customerAccountList,
  customerLogList,
  customerRemove,
  customerAccountRemove
} from "@/api";
import pages from "@/components/pageview";
import FollowE from "@/components/clientList/floowEtit";
export default {
  components: { EssentialInformation, pages, FollowE, addDetils },
  data() {
    return {
      etidRow: {},
      addEtidTitle: "",
      addTitle: "",
      data: {},
      tabList: ["基本信息", "联系人", "账号信息", "操作日志"],
      columns: [],
      data1: [],
      num: 0,
      tableHeight: 0,
      etidShow: false,
      DetilsAddShow: false,
      sreachDate: {
        customerId: "",
        action: "",
        operator: "",
        operateTimeBegin: "",
        operateTimeEnd: "",
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        sort: "",
        order: ""
      }
    };
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  created() {
    this.data = this.$route.query.id;
    this.initHeight();
  },
  methods: {
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 400;
    },
    tabBtn(e) {
      switch (e) {
        case 1:
          this.addTitle = "联系人";
          this.Contacts();
          break;
        case 2:
          this.addTitle = "账号";
          this.accountData();
          break;
        case 3:
          this._customerLogList();
          break;
        default:
          break;
      }
    },
    etit(row, index) {
      this.etidRow = row;
      this.addEtidTitle = "编辑";
      this.DetilsAddShow = true;
    },
    remove(row, index) {
      if (this.addTitle == "联系人") {
        let obj = { ids: row.id, customerId: row.customerId };
        this.$Modal.confirm({
          title: "删除联系人关联",
          onOk: () => {
            customerRemove(obj).then(res => {
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.Contacts();
              } else if (res.code == 502) {
                this.$Message.error(res.message);
              }
            });
          },
          onCancel: () => {
            this.$Message.info("取消删除");
          }
        });
      } else {
        let obj = { id: row.id };
        this.$Modal.confirm({
          title: "删除账号关联",
          onOk: () => {
            customerAccountRemove(row.id).then(res => {
              if (res.code == 200) {
                this.$Message.success(res.message);
                this.accountData();
              } else if (res.code == 502) {
                this.$Message.error(res.message);
              }
            });
          },
          onCancel: () => {
            this.$Message.info("取消删除");
          }
        });
      }
    },
    addClick() {
      this.addEtidTitle = "新增";
      this.DetilsAddShow = true;
    },
    Contacts() {
      this.data1 = [];
      this.columns = column1;
      let obj = { customerId: this.data };
      customerGetlist(obj).then(res => {
        if (res.code == 200) {
          this.data1 = res.result;
          this.num = res.result.length;
        }
      });
    },
    accountData() {
      this.data1 = [];
      this.columns = column2;
      let obj = { customerId: this.data };
      customerAccountList(obj).then(res => {
        if (res.code == 200) {
          this.data1 = res.result;
          this.data1.map(item => {
            item.isActive == 1? item.isActive = '是' : item.isActive = '否'
            return this.data1;
          })
          this.num = res.result.length;
        }
      });
    },
    _customerLogList() {
      this.data1 = [];
      this.columns = column3;
      this.sreachDate.customerId = this.data;
      customerLogList(this.sreachDate).then(res => {
        this.data1 = res.content;
        this.sreachDate.total = res.totalElements;
        this.num = res.totalElements;
      });
    },
    changePage(v) {
      this.sreachDate.pageNumber = v;
      this._customerLogList();
    },
    clickPageSize(v) {
      this.sreachDate.pageSize = v;
      this._customerLogList();
    },
    followEtid() {
      bus.$emit("etidId", "ok");
      this.etidShow = true;
    },
    handlesubmit(e) {
      this.etidShow = false;
    },
    config(e) {
      this.DetilsAddShow = e;
      this.Contacts();
    },
    cancelClick(e) {
      this.DetilsAddShow = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.clienyDetails-box {
  .Alert-box {
    display: flex;
    .content {
      width: 200px;
      margin-right: 20px;
    }
  }
  header {
    display: flex;
    justify-content: space-around;
    width: 500px;
    padding: 20px;
    .name {
      font-size: 22px;
    }
    .go-extranet {
      a {
        img {
          width: 22px;
          height: 22px;
        }
        span {
          font-size: 22px;
        }
      }
    }
  }
}
</style>