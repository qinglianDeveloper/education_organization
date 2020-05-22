<!-- 工单自定义模板设置 -->
<template>
  <div class="card">
    <!-- 按钮部分 -->
    <Row class="header" type="flex" justify="end">
      <div class="button-group" ref="header">
        <Button
          type="primary"
          class="add"
          @click="handleAdd"
          icon="md-add"
          v-if="menuBtns.indexOf('workorder:template:add')>-1"
        >新增</Button>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 内容部分 -->
    <Row class="table">
      <Table
        border
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        :height="tableHeight"
      >
        <template slot="action" slot-scope="{ row, index }">
          <Button type="primary" size="small" @click="handleShow(row,index)">查看</Button>
        </template>
      </Table>
    </Row>
    <!-- 分页部分 -->
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
    <!-- 查看弹框 -->
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      width="800"
      :styles="{top: '140px'}"
    >
      <Form :label-width="90" ref="wrokTemplate" :model="wrokTemplate">
        <FormItem label="模板名称：" disabled="true" prop="title">
          <Input style="max-width:360px" v-model="wrokTemplate.templateName" :disabled="true" />
        </FormItem>
        <FormItem label="模板描述：">
          <Input style="max-width:360px" v-model="wrokTemplate.discription" :disabled="true" />
        </FormItem>
        <FormItem label="模板字段：">
          <Table
            :columns="columnsModal"
            size="small"
            border
            :data="wrokTemplate.workOrderFieldListList"
          ></Table>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="modalVisible=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getOrederTemplate, getInfoById } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  name: "work-template",
  data() {
    return {
      tableHeight: 0,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      modalVisible: false,
      modalTitle: "",
      columns: [
        { type: "selection", align: "center", width: 60, fixed: "left" },
        {
          title: "模板名称",
          key: "templateName",
          minWidth: 100,
          align: "center"
        },
        {
          title: "模板描述",
          key: "discription",
          minWidth: 100,
          align: "center"
        },
        {
          title: "更新时间",
          key: "updateTime",
          minWidth: 100,
          align: "center"
        },
        { title: "操作", slot: "action", minWidth: 100, align: "center" }
      ],
      data: [],
      loading: true,
      wrokTemplate: {},
      columnsModal: [
        { title: "字段名称", key: "fieldName", align: "center" },
        { title: "字段类型", key: "fieldType", align: "center" },
        { title: "是否必填", key: "isRequired", align: "center" },
        { title: "状态", key: "status", align: "center" }
        // { title: "排序", key: "sort", align: "center" }
      ]
    };
  },
  created() {
    this.getOrederTemplate();
  },
  mounted() {
    this.init();
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
    /**
     * 页面初始化
     */
    init() {
      // 计算页面高度
      this.pageHeight();
      window.onresize = () => {
        this.pageHeight();
      };
    },

    /**
     * 获取列表数据
     */
    getOrederTemplate() {
      getOrederTemplate(this.searchForm).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.data = res.result.content;
          this.loading = false;
          this.data.forEach(item => {
            if (item.updateTime) {
              item.updateTime = dateFormat(item.updateTime);
            }
          });
          this.total = res.result.totalElements;
        }
      });
    },

    /**
     * 计算页面高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 73;
      // console.log(this.tableHeight);
    },
    handleAdd() {
      // this.modalVisible = true;
      // this.modalTitle = "新增工单自定义模板";
      this.$router.push({ name: "workAddTemplate" });
    },
    /**
     * 查看按钮事件
     */
    handleShow(row, index) {
      // console.log(row.id);
      getInfoById({ id: row.id }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.wrokTemplate = res.result;
          this.wrokTemplate.workOrderFieldListList = this.changeLanguage(
            this.wrokTemplate.workOrderFieldListList
          );
        }
      });
      this.modalVisible = true;
      this.modalTitle = "查看工单自定义模板";
    },
    /**
     * 语言切换
     */
    changeLanguage(arr) {
      arr.forEach(item => {
        switch (item.status) {
          case "OPEN":
            item.status = "开启";
            break;
          case "CLOSE":
            item.status = "关闭";
            break;
        }
        switch (item.isRequired) {
          case "YES":
            item.isRequired = "是";
            break;
          case "NO":
            item.isRequired = "否";
            break;
        }
        switch (item.fieldType) {
          case "PULL":
            item.fieldType = "下拉";
            break;
          case "RADIO":
            item.fieldType = "单选";
            break;
          case "CHECK":
            item.fieldType = "复选";
            break;
          case "SINGLE":
            item.fieldType = "单行文本";
            break;
          case "MULTI":
            item.fieldType = "多行文本";
            break;
          case "DATE":
            item.fieldType = "日期";
            break;
        }
      });
      return arr;
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getOrederTemplate();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getOrederTemplate();
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  padding: 16px;
  .footer {
    margin-top: 2vh;
  }
}
</style>