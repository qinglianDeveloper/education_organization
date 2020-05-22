<template>
  <div class="EssentialInformation-box">
    <div class="left">
      <Card>
        <p slot="title">基本信息</p>
        <p slot="extra" @click.prevent="changeLimit1">
          <Icon type="md-menu" />
        </p>
        <div class="box">
          <div class="card-left">
            <div>
              <span>客户名称:</span>
              <span>{{customerInfoBaseVO.name}}</span>
            </div>
            <div>
              <span>简称:</span>
              <span>{{customerInfoBaseVO.shortName}}</span>
            </div>
            <div>
              <span>编号:</span>
              <span>{{customerInfoBaseVO.code}}</span>
            </div>
            <div>
              <span>关联业务:</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'Aliyun'">云业务-阿里云</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'CloudService'">云业务-云服务</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'OtherCloud'">云业务-其他云</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'Hardware'">云业务-硬件</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'Software'">云业务-软件</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'Service'">云业务-服务</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'DingTalk'">云业务-钉钉</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'SystemDevelopment'">云业务-系统开发</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'Applet'">云业务-app小程序</span>
              <span v-if="customerInfoBaseVO.relationBusiness == 'Other'">云业务-其他</span>
            </div>
            <div>
              <span>产品标签:</span>
              <span>{{customerInfoBaseVO.productTag}}</span>
            </div>
            <div>
              <span>备注:</span>
              <span>{{ customerInfoBaseVO.remark }}</span>
            </div>
          </div>
          <div class="card-right">
            <div>
              <span>状态:</span>
              <!-- <span>{{customerInfoBaseVO.status}}</span> -->
              <span v-if="customerInfoBaseVO.status == 'Potential'">潜在</span>
              <span v-if="customerInfoBaseVO.status == 'MakeDeal'">已成单</span>
              <span v-if="customerInfoBaseVO.status == 'Disable'">失效</span>
            </div>
            <div>
              <span>类型:</span>
              <span>{{ customerInfoBaseVO.type }}</span>
            </div>
          </div>
        </div>
      </Card>
      <Card class="card-box">
        <p slot="title">联系方式</p>
        <p slot="extra" @click.prevent="changeLimit2">
          <Icon type="md-menu" />
        </p>
        <div class="box">
          <div class="card-left">
            <div class="card-left">
              <div>
                <span>电话：</span>
                <span>{{ customerInfoContactVO.telephone }}</span>
              </div>
              <div>
                <span>网址：</span>
                <span>{{ customerInfoContactVO.website }}</span>
              </div>
              <div>
                <span>区域：</span>
                <span>{{ customerInfoContactVO.area }}</span>
              </div>
              <div>
                <span>地址：</span>
                <span>{{ customerInfoContactVO.address }}</span>
              </div>
            </div>
          </div>
          <div class="card-right">
            <div>
              <span>传真：</span>
              <span>{{ customerInfoContactVO.fax }}</span>
            </div>
            <div>
              <span>邮编：</span>
              <span>{{ customerInfoContactVO.email }}</span>
            </div>
          </div>
        </div>
        <div class="card-right"></div>
      </Card>
      <Card class="card-box">
        <p slot="title">商务特征</p>
        <p slot="extra" @click.prevent="changeLimit3">
          <Icon type="md-menu" />
        </p>
        <div class="box">
          <div class="card-left">
            <div class="card-left">
              <!-- customerInfoBussinessVO -->
              <div>
                <span>来源：</span>
                <!-- <span>{{ customerInfoBussinessVO.source }}</span> -->
                <span v-if="customerInfoBussinessVO.source == 'SelfExplore'">自挖掘</span>
                <span v-if="customerInfoBussinessVO.source == 'OtherIntroduce'">转介绍</span>
                <span v-if="customerInfoBussinessVO.source == 'ExpandOffline'">网络推广</span>
                <span v-if="customerInfoBussinessVO.source == 'InnerSource'">内部资源</span>
                <span v-if="customerInfoBussinessVO.source == 'Meetting'">会议</span>
                <span v-if="customerInfoBussinessVO.source == 'Other'">其他</span>
              </div>
              <div>
                <span>阶段：</span>
                <span v-if="customerInfoBussinessVO.stage == 'CustomerDevelopment'">客户开发阶段</span>
                <span v-if="customerInfoBussinessVO.stage == 'InfancyCooperation'">初期合作阶段</span>
                <span v-if="customerInfoBussinessVO.stage == 'StableCooperation'">稳定合作阶段</span>
                <span v-if="customerInfoBussinessVO.stage == 'StrategicCooperation'">战略合作阶段</span>
              </div>
            </div>
          </div>
          <div class="card-right">
            <div>
              <span>关系等级：</span>
              <span v-if="customerInfoBussinessVO.relationshipLevel == 'Familiar'">密切</span>
              <span v-if="customerInfoBussinessVO.relationshipLevel == 'Good'">较好</span>
              <span v-if="customerInfoBussinessVO.relationshipLevel == 'Normal'">一般</span>
              <span v-if="customerInfoBussinessVO.relationshipLevel == 'Bad'">较差</span>
            </div>
            <div>
              <!-- <span>信用等级：</span>
              <span>{{ customerInfoBussinessVO.creditRatings }}</span>-->
            </div>
          </div>
        </div>
      </Card>
      <Card class="card-box">
        <p slot="title">IT情况</p>
        <p slot="extra" @click.prevent="changeLimit4">
          <Icon type="md-menu" />
        </p>
        <div class="box">
          <div class="card-left">
            <div class="card-left">
              <!-- customerInfoObjectiveVO -->
              <div>
                <span>IT人员规模：</span>
                <span>{{ customerInfoITVO.itPeopleScale }}</span>
              </div>
              <div>
                <span>运维人员规模：</span>
                <span>{{ customerInfoITVO.operationalPeopleScale }}</span>
              </div>
              <div>
                <span>主要数据库：</span>
                <span>{{ customerInfoITVO.mainDatabase }}</span>
              </div>
              <div>
                <span>阿里云现有系统：</span>
                <span>{{ customerInfoITVO.systemOfAliyun }}</span>
              </div>
              <div>
                <span>现有云产品：</span>
                <span>{{ customerInfoITVO.cloudProductUsed }}</span>
              </div>
              <div>
                <span>核心业务系统：</span>
                <span>{{ customerInfoITVO.mainBusinessSystem }}</span>
              </div>
              <div>
                <span>是否经典网络：</span>
                <span>{{ customerInfoITVO.isClassicNetwork }}</span>
              </div>
            </div>
          </div>
          <div class="card-right">
            <div>
              <span>云账号个数：</span>
              <span>{{ customerInfoITVO.cloudAccountNum }}</span>
            </div>
            <div>
              <span>线下服务器和存储硬件：</span>
              <span>{{ customerInfoITVO.serverAndHardwareOffline }}</span>
            </div>
            <div>
              <span>IT信息补充说明：</span>
              <span>{{ customerInfoITVO.itRemark }}</span>
            </div>
            <div>
              <span>IT信息版本号：</span>
              <span>{{ customerInfoITVO.itVersion }}</span>
            </div>
          </div>
        </div>
      </Card>
      <Card class="card-box">
        <p slot="title">其他信息</p>
        <p slot="extra" @click.prevent="changeLimit5">
          <Icon type="md-menu" />
        </p>
        <div class="box">
          <div class="card-left">
            <div>
              <span>创建人：</span>
              <span>{{ customerInfoOtherVO.creator }}</span>
            </div>
            <div>
              <span>创建时间：</span>
              <span>{{ customerInfoOtherVO.createdTime }}</span>
            </div>
          </div>
          <div class="card-right">
            <div>
              <span>更新人：</span>
              <span>{{ customerInfoOtherVO.lastOperator }}</span>
            </div>
            <div>
              <span>更新时间：</span>
              <span>{{ customerInfoOtherVO.updateTime }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div class="right">
      <div class="header">
        <!-- <DatePicker type="date" placeholder="查看跟进时间" style="width: 200px"></DatePicker> -->
        <Button
          icon="md-add"
          type="primary"
          v-if="menuBtns.indexOf('customer:followUp:add')>-1"
          @click="FollowUp"
        >写跟进</Button>
      </div>
      <Table border :columns="columns" :data="data1" :height="tableHeight">
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="error"
            size="small"
            v-if="menuBtns.indexOf('customer:followUp:delete')>-1"
            @click="remove(row,index)"
          >删除</Button>
        </template>
      </Table>
      <pages
        @changePage="changePage"
        :total="serachData.total"
        :fromData="serachData"
        @clickPageSize="clickPageSize"
      />
    </div>
    <followAdd
      :followData="customerInfoBaseVO"
      :followShow="followShow"
      @followFlase="followFlase"
    />
  </div>
</template>
<script>
import { customerInfo, followUpList, delfollowUp } from "@/api";
import { dateFormat } from "@/utils/current";
import pages from "@/components/pageview";
import followAdd from "@/components/clientList/addFollow";
import { mapState } from "vuex";
import bus from "@/utils/bus";
export default {
  components: { pages, followAdd },
  data() {
    return {
      customerInfoBaseVO: {},
      customerInfoContactVO: {},
      customerInfoBussinessVO: {},
      customerInfoObjectiveVO: {},
      customerInfoITVO: {},
      customerInfoOtherVO: {},
      tableHeight: 0,
      columns: [
        {
          title: "客户姓名",
          key: "followTargetName"
        },
        {
          title: "跟进方式",
          key: "followMethod"
        },
        {
          title: "跟进人",
          key: "follower"
        },
        {
          title: "跟进内容",
          key: "followContent"
        },
        {
          title: "跟进时间",
          key: "updateTime"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      data1: [],
      followShow: false,
      followData: {},
      serachData: {
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        followTargetId:'',
        followTimeBegin: ""
      }
    };
  },
  created() {
    this.serachData.followTargetId = this.$route.query.id;
    this._customerInfo();
    this.initHeight();
    this._followUpList();
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  mounted() {
    bus.$off("submitEtid");
    bus.$on("submitEtid", item => {
      this._customerInfo();
    });
  },
  methods: {
    FollowUp() {
      this.followShow = true;
    },
    followFlase(e) {
      this.followShow = e;
      this._followUpList();
    },
    initHeight() {
      this.tableHeight = document.body.offsetHeight - 440;
    },
    _customerInfo() {
      let id = this.$route.query.id;
      customerInfo(id).then(res => {
        if (res.code == 200) {
          this.customerInfoBaseVO = res.result.customerInfoBaseVO;
          this.customerInfoContactVO = res.result.customerInfoContactVO;
          this.customerInfoBussinessVO = res.result.customerInfoBussinessVO;
          this.customerInfoObjectiveVO = res.result.customerInfoObjectiveVO;
          this.customerInfoITVO = res.result.customerInfoITVO;
          this.customerInfoOtherVO = res.result.customerInfoOtherVO;
        }
      });
    },
    remove(row, index) {
      let obj = { id: row.id };
      this.$Modal.confirm({
        title: "确定删除?",
        onOk: () => {
          delfollowUp(obj).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.message);
              this._followUpList();
            }
          });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    },
    _followUpList() {
      followUpList(this.serachData).then(res => {
        let arr = res.content;
        arr.map(item => {
          dateFormat(item.updateTime);
          return arr;
        });
        this.data1 = arr;
        this.serachData.total = res.totalElements;
      });
    },
    changeLimit1() {},
    changeLimit2() {},
    changeLimit3() {},
    changeLimit4() {},
    changeLimit5() {},
    changePage(v) {
      this.serachData.pageNumber = v;
      this._followUpList();
    },
    clickPageSize(v) {
      this.serachData.pageSize = v;
      this._followUpList();
    }
  }
};
</script>
<style lang="scss" scoped>
.EssentialInformation-box {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 300px);
  border: 1px solid #ccc;
  overflow: auto;
  .card-box {
    margin-top: 20px;
  }
  .left {
    width: 49%;
    border-radius: 4px;
    padding: 10px;
    .box {
      display: flex;
      font-size: 18px;
      justify-content: space-between;
      .card-left {
        width: 48%;
      }
      .card-right {
        width: 48%;
      }
    }
  }
  .right {
    width: 49%;
    border-radius: 4px;
    .header {
      height: 50px;
      display: flex;
      align-items: center;
    }
  }
}
</style>