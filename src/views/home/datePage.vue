<!-- 首页 -->
<template>
  <div class="home">
    <div style="height:100%;min-height:600px;">
      <Row class="header">
        <i>
          <img src="../../assets/icon/time.png" style="width:30px;height:30px" />
        </i>
        <span class="time">统计截止时间: {{date}}</span>
      </Row>
      <div class="content">
        <Row class="row">
          <Col span="10" style="padding-top:0;padding-left:0;">
            <Card>
              <div class="card-header">
                <div class="header-left">
                  <i class="icon">
                    <img src="../../assets/icon/totalprice.png" style="width:24px;height:24px;" />
                  </i>
                  <span>总销售额</span>
                </div>
                <div class="header-right" @click="handleSale">
                  <i class="icon">
                    <img
                      :src="showSaleTotal?require('../../assets/icon/show.png'):require('../../assets/icon/hide.png')"
                      style="width:24px;"
                    />
                  </i>
                </div>
              </div>
              <div class="card-content">
                <Row class="total-price">
                  <!-- <span v-show="showSaleTotal"> -->
                  <count-to
                    v-show="showSaleTotal"
                    :end="totalPrice.sumForTotalPrice"
                    :decimals="2"
                  />
                  <!-- {{totalPrice.sumForTotalPrice}} -->
                  <!-- </span> -->
                  <span v-show="!showSaleTotal">********</span>
                </Row>
                <Row class="percentage">
                  <i class="icon">
                    <img
                      :src="totalPrice.linkRelative>0?require('../../assets/icon/up.png'):require('../../assets/icon/down.png')"
                      style="width:24px;height:24px;"
                    />
                  </i>
                  <span
                    :style="totalPrice.linkRelative>0?{color:'#19BE6B','font-weight':'bold'}:{color:'#EE321E','font-weight':'bold'}"
                  >{{totalPrice.linkRelative}}%</span>
                </Row>
                <Row class="sale">
                  <Col span="12" style="border-right:1px solid #dcdee2">
                    <p class="sale-header">IT服务销售额</p>
                    <p class="money">
                      <count-to
                        v-show="showSaleTotal"
                        :end="totalPrice.sumForSellItTotalPrice"
                        :decimals="2"
                      />
                      <!-- <span v-show="showSaleTotal">{{totalPrice.sumForSellItTotalPrice}}</span> -->
                      <span v-show="!showSaleTotal">********</span>
                    </p>
                  </Col>
                  <Col span="12">
                    <p class="sale-header">云产品销售额</p>
                    <p class="money">
                      <count-to
                        v-show="showSaleTotal"
                        :end="totalPrice.sumForSellYunTotalPrice"
                        :decimals="2"
                      />
                      <!-- <span v-show="showSaleTotal">{{totalPrice.sumForSellYunTotalPrice}}</span> -->
                      <span v-show="!showSaleTotal">********</span>
                    </p>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span="14" style="padding-top:0;padding-right:0;">
            <Card>
              <div class="card-header">
                <div class="header-left">
                  <i class="icon">
                    <img src="../../assets/icon/brokerage.png" style="width:24px;height:24px;" />
                  </i>
                  <span>佣金售额</span>
                </div>
                <div class="header-right" @click="handleBrokerage">
                  <i class="icon">
                    <img
                      :src="showBrokerage?require('../../assets/icon/show.png'):require('../../assets/icon/hide.png')"
                      style="width:24px;"
                    />
                  </i>
                </div>
              </div>
              <div class="card-content">
                <Row class="total-price">
                  <count-to
                    v-show="showBrokerage"
                    :end="brokeragePrice.sumForRackback"
                    :decimals="2"
                  />
                  <!-- <span v-show="showBrokerage">{{brokeragePrice.sumForRackback}}</span> -->
                  <span v-show="!showBrokerage">********</span>
                </Row>
                <Row class="percentage">
                  <i class="icon">
                    <img
                      :src="brokeragePrice.linkRelative>0?require('../../assets/icon/up.png'):require('../../assets/icon/down.png')"
                      style="width:24px;height:24px;"
                    />
                  </i>
                  <span
                    :style="brokeragePrice.linkRelative>0?{color:'#19BE6B','font-weight':'bold'}:{color:'#EE321E','font-weight':'bold'}"
                  >{{brokeragePrice.linkRelative}}%</span>
                </Row>
                <Row class="sale">
                  <Col
                    span="8"
                    style="border-right:1px solid #dcdee2"
                    v-if="isAgenttop!='AGENTTOP'"
                  >
                    <p class="sale-header">区域代理返佣</p>
                    <p class="money">
                      <!-- <span v-show="showBrokerage">{{brokeragePrice.sumForAgentTopRackback}}</span> -->
                      <count-to
                        v-show="showBrokerage"
                        :end="brokeragePrice.sumForAgentTopRackback"
                        :decimals="2"
                      />
                      <span v-show="!showBrokerage">********</span>
                    </p>
                  </Col>
                  <Col
                    :span="isAgenttop=='AGENTTOP'?'12':'8'"
                    style="border-right:1px solid #dcdee2"
                  >
                    <p class="sale-header">直销代理返佣</p>
                    <p class="money">
                      <count-to
                        v-show="showBrokerage"
                        :end="brokeragePrice.sumForAgentSecondRackback"
                        :decimals="2"
                      />
                      <!-- <span v-show="showBrokerage">{{brokeragePrice.sumForAgentSecondRackback}}</span> -->
                      <span v-show="!showBrokerage">********</span>
                    </p>
                  </Col>
                  <Col :span="isAgenttop=='AGENTTOP'?'12':'8'">
                    <p class="sale-header">客户返佣</p>
                    <p class="money">
                      <count-to
                        v-show="showBrokerage"
                        :end="brokeragePrice.sumForCutomerRackback"
                        :decimals="2"
                      />
                      <!-- <span v-show="showBrokerage">{{brokeragePrice.sumForCutomerRackback}}</span> -->
                      <span v-show="!showBrokerage">********</span>
                    </p>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" class="row" v-if="isAgenttop!='AGENTTOP'">
          <Col span="6" style="padding-left:0;">
            <Card>
              <div class="client">
                <Row class="client-num">
                  <!-- <span>{{client.countForUser}}</span> -->
                  <count-to :end="client.countForUser" />
                </Row>
                <Row class="client-title">
                  <i>
                    <img src="../../assets/icon/client1.png" style="width:24px;" />
                  </i>
                  <span>用户</span>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span="6">
            <Card>
              <div class="client">
                <Row class="client-num">
                  <!-- <span>{{client.countForCustomer}}</span> -->
                  <count-to :end="client.countForCustomer" />
                </Row>
                <Row class="client-title">
                  <i>
                    <img src="../../assets/icon/client1.png" style="width:24px;" />
                  </i>
                  <span>客户</span>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span="6">
            <Card>
              <div class="client">
                <Row class="client-num">
                  <!-- <span>{{client.countForAgentTop}}</span> -->
                  <count-to :end="client.countForAgentTop" />
                </Row>
                <Row class="client-title">
                  <i>
                    <img src="../../assets/icon/client3.png" style="width:24px;" />
                  </i>
                  <span>区域代理</span>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span="6" style="padding-right:0;">
            <Card>
              <div class="client">
                <Row class="client-num">
                  <!-- <span>{{client.countForAgentSecond}}</span> -->
                  <count-to :end="client.countForAgentSecond" />
                </Row>
                <Row class="client-title">
                  <i>
                    <img src="../../assets/icon/client4.png" style="width:24px;" />
                  </i>
                  <span>直销代理</span>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" class="row" v-if="isAgenttop!='AGENTTOP'">
          <Col span="12" style="padding-bottom:0;padding-left:0;">
            <Card>
              <div class="card-header">
                <div class="header-left">
                  <i class="icon">
                    <img src="../../assets/icon/top-1.png" style="width:24px;height:24px;" />
                  </i>
                  <span>区域代理业绩排行榜</span>
                </div>
              </div>
              <Row style="margin:12px 0">
                <Table :columns="columnsOne" :data="dataOne" size="small"></Table>
              </Row>
              <Row>
                <Page
                  :current="oneSearch.pageNumber"
                  :total="totalOne"
                  size="small"
                  style="float:right"
                  show-total
                  show-elevator
                  :page-size="5"
                  @on-change="changePageOne"
                />
              </Row>
            </Card>
          </Col>
          <Col span="12" style="padding-bottom:0;padding-right:0;">
            <Card>
              <div class="card-header">
                <div class="header-left">
                  <i class="icon">
                    <img src="../../assets/icon/top-2.png" style="width:24px;height:24px;" />
                  </i>
                  <span>直销代理业绩排行榜</span>
                </div>
              </div>
              <Row style="margin:12px 0">
                <Table :columns="columnsTwo" :data="dataTwo" size="small"></Table>
              </Row>
              <Row>
                <!-- <Page :total="40" size="small" show-total /> -->
                <Page
                  :current="twoSearch.pageNumber"
                  :total="totalTwo"
                  style="float:right"
                  size="small"
                  show-total
                  show-elevator
                  :page-size="5"
                  @on-change="changePageTwo"
                />
              </Row>
            </Card>
          </Col>
        </Row>
        <Row v-if="isAgenttop=='AGENTTOP'">
          <div class="img">
            <img :src="imgUrl" />
          </div>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getSumForSellTotalPrice,
  getSumForRackback,
  getCountForPerson,
  getAgentPerformance,
  getDirectPerformance
} from "@/api";
import CountTo from "@/components/count-to";
export default {
  name: "home",
  components: { CountTo },
  data() {
    return {
      imgUrl: require("@/assets/welcome.png"),
      date: "",
      totalPrice: {
        sumForTotalPrice: 0,
        sumForSellItTotalPrice: 0,
        sumForSellYunTotalPrice: 0
      },
      showSaleTotal: true,
      brokeragePrice: {
        sumForRackback: 0,
        sumForAgentTopRackback: 0,
        sumForAgentSecondRackback: 0,
        sumForCutomerRackback: 0
      },
      client: {
        countForUser: 0,
        countForCustomer: 0,
        countForAgentTop: 0,
        countForAgentSecond: 0
      },
      showBrokerage: true,
      columnsOne: [
        {
          title: "排名",
          key: "i",
          align: "center"
        },
        {
          title: "代理名称",
          key: "cropName",
          align: "center"
        },
        {
          title: "总业绩",
          key: "totalPerformance",
          align: "center"
        }
      ],
      columnsTwo: [
        {
          title: "排名",
          key: "i",
          align: "center"
        },
        {
          title: "代理名称",
          key: "name",
          align: "center"
        },
        {
          title: "所属代理",
          key: "topName",
          align: "center"
        },
        {
          title: "总业绩",
          key: "totalPerformance",
          align: "center"
        }
      ],
      dataOne: [],
      dataTwo: [],
      totalOne: 0,
      totalTwo: 0,
      oneSearch: { pageNumber: 1, pageSize: 5 },
      twoSearch: { pageNumber: 1, pageSize: 5 },
      isAgenttop: ""
    };
  },
  created() {
    this.init();
    // let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    // this.isAgenttop = userInfo.type;
  },
  computed: {
    useInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    init() {
      this.getDate(); //获取时间
      this.getSumForSellTotalPrice();
      this.getSumForRackback();
      this.getCountForPerson();
      this.getAgentPerformance();
      this.getDirectPerformance();
    },
    // 获取数据
    getSumForSellTotalPrice() {
      getSumForSellTotalPrice().then(res => {
        if (res.code == 200) {
          // console.log("总", res);
          // for (let item in res.result) {
          //   if (!res.result[item]) {
          //     res.result[item] = 0;
          //   }
          // }
          this.totalPrice = res.result;
        }
      });
    },
    getSumForRackback() {
      getSumForRackback().then(res => {
        // console.log("返", res);
        if (res.code == 200) {
          // for (let item in res.result) {
          //   if (!res.result[item]) {
          //     res.result[item] = 0;
          //   }
          // }
          this.brokeragePrice = res.result;
          console.log(this.brokeragePrice.sumForAgentTopRackback);
          if (
            this.brokeragePrice.sumForAgentTopRackback == null ||
            this.brokeragePrice.sumForAgentTopRackback == "undefined"
          ) {
            // console.log("hello");
            this.isAgenttop = "AGENTTOP";
          }
        }
      });
    },
    getCountForPerson() {
      getCountForPerson().then(res => {
        // console.log("四", res);
        if (res.code == 200) {
          this.client = res.result;
        }
      });
    },
    getAgentPerformance() {
      getAgentPerformance(this.oneSearch).then(res => {
        if (res.code == 200) {
          this.dataOne = res.result.content;
          this.totalOne = res.result.totalElements;
        }
      });
    },
    getDirectPerformance() {
      getDirectPerformance(this.twoSearch).then(res => {
        if (res.code == 200) {
          this.dataTwo = res.result.content;
          this.totalTwo = res.result.totalElements;
        }
      });
    },

    /**
     *获取当前时间
     */
    getDate() {
      var d = new Date();
      var y = d.getFullYear();
      var m = d.getMonth() + 1;
      var ds = d.getDate();
      var days = d.getDay();
      switch (days) {
        case 1:
          days = "星期一";
          break;
        case 2:
          days = "星期二";
          break;
        case 3:
          days = "星期三";
          break;
        case 4:
          days = "星期四";
          break;
        case 5:
          days = "星期五";
          break;
        case 6:
          days = "星期六";
          break;
        case 0:
          days = "星期日";
          break;
      }
      this.date = y + "-" + m + "-" + ds + "  " + days;
      // console.log(this.date);
    },
    /**
     *销售显示隐藏
     */
    handleSale() {
      this.showSaleTotal = !this.showSaleTotal;
    },
    /**
     *佣金显示隐藏
     */
    handleBrokerage() {
      this.showBrokerage = !this.showBrokerage;
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePageOne(v) {
      this.oneSearch.pageNumber = v;
      this.getAgentPerformance();
    },
    changePageTwo(v) {
      this.twoSearch.pageNumber = v;
      this.getDirectPerformance();
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  background: #eff0f5;
  height: 100%;
  padding: 10px;
  overflow: auto;
  .header {
    height: 30px;
    // background: red;
    display: flex;
    margin-bottom: 10px;
    .time {
      margin-left: 14px;
      color: #333333;
      font-size: 16px;
      line-height: 30px;
    }
  }
  .content {
    height: calc(100% - 30px);
    // background: yellowgreen;
    display: flex;
    flex-direction: column;
    .row {
      // flex: 1;
      .ivu-col {
        height: 100%;
        padding: 5px;
        .ivu-card {
          height: 100%;
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #dcdee2;
            height: 39px;
            .header-left {
              line-height: 39px;
              display: flex;
              align-items: center;
              font-size: 16px;
              .icon {
                display: inline-block;
                height: 24px;
              }
              span {
                margin-left: 10px;
              }
            }
            .header-right {
              height: 24px;
              cursor: pointer;
              .icon {
                height: 24px;
                display: flex;
                align-items: center;
              }
            }
          }
          .card-content {
            .total-price {
              font-size: 40px;
              color: #333;
              text-align: center;
            }
            .percentage {
              display: flex;
              justify-content: center;
              align-items: center;
              .icon {
                height: 24px;
                margin-right: 6px;
              }
            }
            .sale {
              margin-top: 10px;
              .sale-header {
                color: #666;
                text-align: center;
              }
              .money {
                color: #333;
                font-size: 30px;
                text-align: center;
              }
            }
          }
        }
      }
    }
    .client {
      .client-num {
        color: #666;
        font-size: 40px;
        text-align: center;
      }
      .client-title {
        text-align: center;
        i {
          display: inline-block;
          margin-right: 6px;
        }
      }
    }
    .img {
      height: 40vh;
      // background: red;
      position: absolute;
      left: 50%;
      top: 0%;
      transform: translate(-50%, 10%);
      img {
        height: 100%;
      }
    }
  }
}
</style>
