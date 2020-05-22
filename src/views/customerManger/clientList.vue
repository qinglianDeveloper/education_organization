<template>
  <div class="clienlist-box">
    <Tabs type="line" size="default" @on-click="tabBtn">
      <TabPane v-for="(item,index) in tabList" :key="index" :label="item" :animated="true">
        <Table border :height="tableHeight" :columns="columns" :data="data">
          <template slot-scope="{ row }" slot="action">
            <div>
              <Button
                style="margin-right: 10px;"
                size="small"
                type="primary"
                @click="detail(row)"
              >详情</Button>
              <Button
                icon="md-create"
                size="small"
                type="success"
                v-if="menuBtns.indexOf('customer:followUp:add')>-1"
                @click="FollowUp(row)"
              >跟进</Button>
            </div>
          </template>
        </Table>
      </TabPane>
      <div slot="extra">
        <Button
          icon="md-add"
          type="primary"
          v-if="menuBtns.indexOf('customer:customer:add')>-1"
          @click="addBtnShow"
        >新增客户</Button>
      </div>
    </Tabs>
    <!-- 分页部分 -->
    <Row type="flex" justify="end" class="page">
      <div ref="footer" class="footer">
        <Page
          :current="searchData.pageNumber"
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
    <newAdd :addShow="addShow" @Submit="Submit" @okSubmit="okSubmit" />
    <followAdd :followData="followData" :followShow="followShow" @followFlase="followFlase" />
    <followEtid :etidShow="etidShow" @handlesubmit="handlesubmit" />
  </div>
</template>
<script>
import newAdd from "@/components/clientList/NewCustomers";
import followEtid from "../../components/clientList/floowEtit";
import bus from "@/utils/bus";
import followAdd from "@/components/clientList/addFollow";
import { columnList } from "./table";
import { getCustomerList } from "@/api";
import { mapState } from "vuex";
// import pages from "@/components/pageview";
export default {
  components: { newAdd, followAdd, followEtid },
  data() {
    return {
      etidShow: false,
      followData: {},
      followShow: false,
      tabList: ["我的客户", "所有客户"],
      columns: columnList,
      addShow: false,
      data: [],
      total: 0,
      tableHeight: 0,
      searchData: {
        searchType: "SELF",
        name: "",
        code: "",
        shortName: "",
        contactName: "",
        mobilePhone: "",
        type: "",
        productTag: "",
        status: "",
        relationBusiness: "",
        profitLevel: "",
        achievementLevel: "",
        dateType: "",
        beginTime: "",
        endTime: "",
        salesIds: "", //销售负责人ID,多个,号隔开
        agentIds: "", //代理ID,多个,号隔开
        pageNumber: 1, //页号
        pageSize: 10, //页面大小
        sort: "", // 排序字段
        order: "" // 排序方式 asc/desc
      }
    };
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  created() {
    this._getCustomerList();
    this.initHeight();
  },
  methods: {
    addBtnShow() {
      this.addShow = true;
    },
    Submit(e) {
      this.addShow = e;
    },
    // 获取页面高度
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 280;
    },
    tabBtn(e) {
      e == 0
        ? (this.searchData.searchType = "SELF")
        : (this.searchData.searchType = "ALL");
      this._getCustomerList();
    },
    _getCustomerList() {
      getCustomerList(this.searchData).then(res => {
        if (res.code == 200) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        } else if (res.code == 502) {
          this.$Message.error(res.message);
        }
      });
    },
    // changePage(e) {
    //   this.searchData.pageNumber = e;
    //   this._getCustomerList();
    // },
    clickPageSize(e) {
      this.searchData.pageSize = e;
      this._getCustomerList();
    },
    FollowUp(row) {
      this.followData = row;
      this.followShow = true;
    },
    followFlase(e) {
      this.followShow = false;
    },
    detail(row) {
      this.$router.push({
        name: `clientDetails`,
        query: { id: row.id }
      });
    },
    okSubmit(e) {
      this.$Modal.confirm({
        title: "资料未填写完整，点击确定继续补全信息",
        onOk: () => {
          this.etidShow = true;
          this.followShow = e;
          bus.$emit("etidId", "ok");
          this._getCustomerList();
        },
        onCancel: () => {
          this.$Message.info("取消补全信息");
        }
      });
    },
    handlesubmit(e) {
      this.etidShow = e;
      this.followShow = e;
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchData.pageNumber = v;
      this._getCustomerList();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchData.pageSize = v;
      this._getCustomerList();
    }
  }
};
</script>
<style lang="scss" scoped>
.clienlist-box {
  padding: 16px;
  .footer {
    margin-top: 2vh;
  }
}
</style>