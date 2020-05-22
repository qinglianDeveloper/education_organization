<!-- 工单自定义字段设置 --->
<template>
  <div class="card">
    <!-- 按钮部分 -->
    <Row class="header" type="flex" justify="end">
      <div class="button-group" ref="header">
        <!-- <Button type="primary" class="add" @click="handleAdd" icon="md-add">新增</Button> -->
        <Dropdown
          style="margin-left: 20px"
          @on-click="handleAdd"
          v-if="menuBtns.indexOf('workorder:filed:add')>-1"
        >
          <Button type="primary">
            新增
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="text">文本型</DropdownItem>
            <DropdownItem name="choose">选择型</DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
        <template slot="isRequired" slot-scope="{ row }">
          <Tag :color="row.isRequired=='是'?'green':'red'">{{ row.isRequired}}</Tag>
        </template>
        <template slot="status" slot-scope="{ row }">
          <Tag :color="row.status=='开启'?'green':'red'">{{ row.status}}</Tag>
        </template>
        <template slot="action" slot-scope="{ row, index }">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="handleEdit(row,index)"
            v-if="menuBtns.indexOf('workorder:filed:update')>-1"
          >编辑</Button>
          <Button
            type="error"
            size="small"
            @click="handleDel(row,index)"
            v-if="menuBtns.indexOf('workorder:filed:delete')>-1"
          >删除</Button>
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
    <!-- 新增弹框 -->
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :styles="{top: '140px'}"
    >
      <Form :label-width="100" ref="workField" :model="workField" :rules="rules">
        <FormItem label="字段标题：" prop="fieldName">
          <Input style="max-width:360px" v-model="workField.fieldName" placeholder="请输入..." />
        </FormItem>
        <FormItem label="字段类型：" prop="fieldType">
          <!-- <Input style="max-width:360px" v-model="workField.type" placeholder="请输入..." /> -->
          <RadioGroup v-model="workField.fieldType" v-if="choose">
            <Radio label="PULL" style="margin-right:20px">下拉</Radio>
            <Radio label="RADIO" style="margin-right:20px">单选</Radio>
            <Radio label="CHECK">复选</Radio>
          </RadioGroup>
          <RadioGroup v-model="workField.fieldType" v-else>
            <Radio label="SINGLE" style="margin-right:20px">单行文本</Radio>
            <Radio label="MULTI" style="margin-right:20px">多行文本</Radio>
            <Radio label="DATE">日期</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否必填：" prop="isRequired">
          <RadioGroup v-model="workField.isRequired">
            <Radio label="YES" style="margin-right:20px">是</Radio>
            <Radio label="NO">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="字段描述：">
          <Input style="max-width:360px" v-model="workField.discription" placeholder="请输入..." />
        </FormItem>
        <FormItem label="选项内容：" v-if="choose" prop="optionContent">
          <Input style="width:290px" v-model="workField.optionContent" placeholder="请输入..." />
          <Poptip :content="contentChoose" word-wrap>
            <Checkbox v-model="other" style="margin-left:20px">其他</Checkbox>
          </Poptip>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="workField.status" placeholder="请选择状态" style="max-width:360px">
            <Option value="OPEN">开启</Option>
            <Option value="CLOSE">关闭</Option>
          </Select>
        </FormItem>
        <FormItem label="排序：">
          <InputNumber style="max-width:360px" v-model="workField.sort" placeholder="请输入..."></InputNumber>
        </FormItem>
      </Form>
      <!-- <p v-if="choose">{{contentChoose}}</p> -->
      <div slot="footer">
        <Button type="text" @click="cancle">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitTask('workField')">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getOrderField,
  addOrderField,
  removeOrderField,
  updateOrderField
} from "@/api";
import { mapState } from "vuex";
export default {
  name: "work-field",
  data() {
    // ^\d+(,\d+)*$ //正则校验逗号隔开
    //自定义规则不能出现英文的点“.”
    const validateTitle = (rule, value, callback) => {
      // var reg = new RegExp(/./);
      console.log();
      if (value.indexOf(".") > -1) {
        callback(new Error("标题格式不正确，请勿输入“.”！"));
      } else {
        callback();
      }
    };
    return {
      other: false,
      contentChoose: `勾选后，将新增一个其他选项文本输入框！`,
      tableHeight: 0,
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      loading: true,
      /* 标题内容 */
      columns: [
        { type: "selection", align: "center", width: 60, fixed: "left" },
        {
          title: "字段标题",
          key: "fieldName",
          minWidth: 140,
          align: "center"
        },
        {
          title: "字段类型",
          key: "fieldType",
          minWidth: 120,
          align: "center"
        },
        {
          title: "是否必填",
          slot: "isRequired",
          minWidth: 100,
          align: "center"
        },
        {
          title: "字段描述",
          key: "discription",
          minWidth: 100,
          align: "center"
        },
        { title: "状态", slot: "status", minWidth: 100, align: "center" },
        { title: "排序", key: "sort", minWidth: 100, align: "center" },
        { title: "操作", slot: "action", minWidth: 140, align: "center" }
      ],
      data: [],
      modalTitle: "",
      modalVisible: false,
      submitLoading: false,
      workField: { sort: 1 },
      text: false,
      choose: false,
      rules: {
        fieldName: [
          { required: true, message: "请输入字段标题", trigger: "blur" },
          { validator: validateTitle, trigger: "blur", trigger: "change" }
        ],
        fieldType: [
          { required: true, message: "请输入字段类型", trigger: "blur" }
        ],
        isRequired: [
          { required: true, message: "请选择是否必填", trigger: "blur" }
        ],
        optionContent: [
          { required: true, message: "请输入选项内容", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getOrderField();
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

    /**
     * 获取自定义字段列表
     */
    getOrderField() {
      getOrderField(this.searchForm).then(res => {
        if (res.code == 200) {
          // console.log(res);
          this.data = res.result.content;
          this.changeLanguage(this.data);
          this.loading = false;
          this.total = res.result.totalElements;
          // test
        }
      });
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

    handleAdd(name) {
      this.$refs.workField.resetFields();
      this.workField = { sort: 1 };
      // console.log(name);
      if (name == "text") {
        this.handleAddtext();
      } else {
        this.handleAddchoose();
      }
    },

    /**
     * 添加文本型
     */
    handleAddtext() {
      this.modalVisible = true;
      this.modalTitle = "新增工单自定义字段-文本型";
      this.text = true;
      this.choose = false;
    },
    /**
     * 添加选择型
     */
    handleAddchoose() {
      this.modalVisible = true;
      this.modalTitle = "新增工单自定义字段-选择型";
      this.choose = true;
      this.text = false;
    },
    /**
     * 弹框确定按钮事件
     */
    handelSubmitTask(name) {
      this.workField.type = this.text ? "TEXT" : "CHOOSE";
      this.workField.other = this.other ? 1 : 0;
      if (this.other) {
        this.workField.optionContent = this.workField.optionContent + ",其他";
      }
      this.$refs[name].validate(valid => {
        if (valid == true) {
          // console.log(this.workField);
          if (this.workField.id) {
            updateOrderField(this.workField).then(res => {
              if (res.code == 200) {
                this.$Message.success("编辑成功！");
                this.getOrderField();
                this.other = false;
                this.modalVisible = false;
                this.workField = { sort: 1 };
              }
            });
          } else {
            addOrderField(this.workField).then(res => {
              if (res.code == 200) {
                this.$Message.success("新增成功！");
                this.getOrderField();
                this.other = false;
                this.modalVisible = false;
                this.workField = { sort: 1 };
              }
            });
          }
        } else {
          this.$Message.error("请按要求输入字段信息！");
        }
      });
      // this.modalVisible = false;
    },

    /**
     * 弹框取消
     */
    cancle() {
      this.modalVisible = false;
      // this.workField = {};
      this.getOrderField();
    },
    /**
     * 行内编辑事件
     */
    handleEdit(row, index) {
      // console.log(row);
      this.choose = row.type == "CHOOSE" ? true : false;
      this.other = row.other == 1 ? true : false;
      // console.log(this.choose);
      this.modalVisible = true;
      this.modalTitle = "修改自定义字段";
      row.sort = Number(row.sort);
      // 对象的深拷贝
      this.workField = JSON.parse(JSON.stringify(row));
      // console.log(this.workField == row);
      if (this.workField.optionContent) {
        this.workField.optionContent = this.workField.optionContent.replace(
          ",其他",
          ""
        );
      }
      switch (this.workField.status) {
        case "开启":
          this.workField.status = "OPEN";
          break;
        case "关闭":
          this.workField.status = "CLOSE";
          break;
      }
      switch (this.workField.isRequired) {
        case "是":
          this.workField.isRequired = "YES";
          break;
        case "否":
          this.workField.isRequired = "NO";
          break;
      }
      switch (this.workField.fieldType) {
        case "下拉":
          this.workField.fieldType = "PULL";
          break;
        case "单选":
          this.workField.fieldType = "RADIO";
          break;
        case "复选":
          this.workField.fieldType = "CHECK";
          break;
        case "单行文本":
          this.workField.fieldType = "SINGLE";
          break;
        case "多行文本":
          this.workField.fieldType = "MULTI";
          break;
        case "日期":
          this.workField.fieldType = "DATE";
          break;
      }
    },
    /**
     * 行内删除事件
     */
    handleDel(row, index) {
      this.$Modal.confirm({
        title: "确认删除删除",
        content: "您确认要删除这条工单自定义字段吗？",
        onOk: () => {
          removeOrderField({ id: row.id }).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.message);
              this.getOrderField();
            } else {
              this.$Message.error(res.message);
            }
          });
        }
      });
    },
    /**
     * 页码改变的回调，返回改变后的页码
     */
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getOrderField();
    },

    /**
     * 换每页条数时的回调，返回切换后的每页条数
     */
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getOrderField();
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