<template>
  <div class="order-details">
    <Tabs value="orderYun" @on-click="handleChangeTags">
      <TabPane label="上云订单" name="orderYun">
        <orderMain
          :search="searchYun"
          @handleSearch="handleSearch"
          :columns="columnsYun"
          :data="data"
          :total="total"
          @changePage="changePage"
          @changePageSize="changePageSize"
        ></orderMain>
      </TabPane>
      <TabPane label="商品订单" name="orderGoods">
        <orderMain
          :search="searchGoods"
          @handleSearch="handleSearch"
          :columns="columnsGoods"
          :data="data"
          :total="total"
          @changePage="changePage"
          @changePageSize="changePageSize"
        ></orderMain>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import orderMain from "./components/index";
import { getOrderRebate } from "@/api/index";
import { dateFormat } from "@/utils/current";
export default {
  components: {
    orderMain
  },
  data() {
    return {
      searchYun: [
        {
          label: "商品名称",
          labelWidth: 80,
          name: "orderName"
        },
        {
          label: "公司名称",
          labelWidth: 80,
          name: "companyName"
        },
        {
          label: "账号",
          labelWidth: 60,
          name: "account"
        }
      ],
      searchGoods: [
        {
          label: "商品名称",
          labelWidth: 80,
          name: "orderName"
        },
        {
          label: "公司名称",
          labelWidth: 80,
          name: "companyName"
        }
      ],
      columnsYun: [
        { type: "selection", align: "center", width: 60, fixed: "left" },
        { title: "商品类别", key: "orderType", minWidth: 160, align: "center" },
        { title: "商品名称", key: "orderName", minWidth: 220, align: "center" },
        { title: "账号", key: "account", minWidth: 160, align: "center" },
        {
          title: "公司名称",
          key: "companyName",
          minWidth: 220,
          align: "center"
        },
        {
          title: "订单金额",
          key: "totalPriceOrigin",
          minWidth: 120,
          align: "center"
        },
        {
          title: "实付金额",
          key: "totalPriceActual",
          minWidth: 120,
          align: "center"
        },
        {
          title: "支付时间",
          key: "orderPayTime",
          minWidth: 180,
          align: "center"
        },
        {
          title: "订单类型",
          key: "alyOrderType",
          minWidth: 120,
          align: "center"
        },
        { title: "厂商", key: "manufacturer", minWidth: 100, align: "center" }
      ],
      columnsGoods: [
        { type: "selection", align: "center", width: 60, fixed: "left" },
        { title: "商品类别", key: "orderType", minWidth: 160, align: "center" },
        { title: "商品名称", key: "orderName", minWidth: 220, align: "center" },
        {
          title: "公司名称",
          key: "companyName",
          minWidth: 220,
          align: "center"
        },
        {
          title: "订单金额",
          key: "totalPriceOrigin",
          minWidth: 120,
          align: "center"
        },
        {
          title: "实付金额",
          key: "totalPriceActual",
          minWidth: 120,
          align: "center"
        },
        {
          title: "支付时间",
          key: "orderPayTime",
          minWidth: 180,
          align: "center"
        }
      ],
      //   dataYun: [],
      //   dataGoods: [],
      total: 0,
      searchForm: { pageNumber: 1, pageSize: 10 },
      data: []
    };
  },
  created() {
    this.searchForm.type = "yunOrder";
    this.getlist();
  },
  //   watch: {
  //     data(val) {
  //       //   console.log(val);
  //       this.dataYun = val;
  //     }
  //   },
  methods: {
    getlist() {
      getOrderRebate(this.searchForm).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.data = res.result.content;
          this.data.forEach(item => {
            if (item.orderPayTime) {
              item.orderPayTime = dateFormat(item.orderPayTime);
            }
          });
          this.total = res.result.totalElements;
        }
      });
    },
    handleChangeTags(val) {
      //   console.log(val);
      if (val == "orderYun") {
        this.searchForm = {
          pageNumber: 1,
          pageSize: 10,
          type: "yunOrder"
        };
      } else if (val == "orderGoods") {
        this.searchForm = {
          pageNumber: 1,
          pageSize: 10,
          type: "productOrder"
        };
      }
      this.getlist(this.searchForm);
    },
    handleSearch(val) {
      //   console.log(val);
      this.searchForm = Object.assign(this.searchForm, val);
      this.getlist();
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getlist();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getlist();
    }
  }
};
</script>
<style lang="scss" scoped>
.order-details {
  padding: 16px;
}
</style>