    <!-- 新增工单自定义模板 -->
<template>
  <div class="card">
    <!-- 按钮部分 -->
    <Row class="header" type="flex" justify="end">
      <div class="button-group" ref="header">
        <Button
          type="primary"
          class="add"
          @click="handleSubmit"
          icon="md-add"
          style="margin-right:10px"
        >确定</Button>
        <Button type="default" class="add" @click="handleClose" icon="md-close">返回</Button>
      </div>
      <Divider style="margin:10px 0" />
    </Row>
    <!-- 内容 -->
    <Row>
      <Form :label-width="100" ref="wrokTemplate" :model="wrokTemplate" :rules="rules">
        <FormItem label="模板名称：" prop="templateName">
          <Input style="max-width:360px" v-model="wrokTemplate.templateName" placeholder="请输入..." />
        </FormItem>
        <FormItem label="模板描述：">
          <Input style="max-width:360px" v-model="wrokTemplate.discription" placeholder="请输入..." />
        </FormItem>
        <FormItem label="模板字段：" style="margin:0">
          <Table :columns="columns" size="small" border :data="data">
            <template slot="action" slot-scope="{ row, index }">
              <Button
                type="primary"
                size="small"
                @click="handleEdit(row,index)"
                style="margin-right:10px"
              >编辑</Button>
              <Button type="error" size="small" @click="handleDel(row,index)">删除</Button>
            </template>
          </Table>
        </FormItem>
        <FormItem>
          <Button size="small" type="success" @click="hadleAddFile">添加字段</Button>
        </FormItem>
      </Form>
    </Row>
    <!-- 弹框 -->
    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :styles="{top: '140px'}"
    >
      <Form :label-width="140" :model="modalWorkFile" ref="modalWorkFile" :rules="wrokRules">
        <FormItem label="字段名称：" prop="id">
          <Select
            v-model="modalWorkFile.id"
            style="width:240px"
            @on-change="selectFiled"
            filterable
          >
            <Option v-for="item in workFiled" :value="item.id" :key="item.id">{{ item.fieldName }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="排序：">
          <Input v-model="wrokTemplate.sort" style="width:240px"></Input>
        </FormItem>-->
      </Form>
      <div slot="footer">
        <Button type="default" @click="cancle">取消</Button>
        <Button type="primary" @click="hadleSure(modalTitle)">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getAllField, addOrederTemplate } from "@/api";
export default {
  name: "work-add-template",
  data() {
    return {
      wrokTemplate: {},
      columns: [
        { title: "字段名称", key: "fieldName", align: "center" },
        { title: "字段类型", key: "fieldType", align: "center" },
        { title: "是否必填", key: "isRequired", align: "center" },
        { title: "状态", key: "status", align: "center" },
        // { title: "排序", key: "sort", align: "center" },
        { title: "操作", slot: "action", align: "center", minWidth: 60 }
      ],
      data: [],
      modalWorkFile: {},
      workFiled: [],
      modalVisible: false,
      modalTitle: "",
      index: null,
      rules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ]
      },
      wrokRules: {
        id: [
          {
            required: true,
            message: "请选择自定义字段",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      filed: {}
    };
  },
  created() {
    // 获取下拉列表内容
    this.getAllField();
  },
  methods: {
    /**
     * 获取下拉框内容
     */
    getAllField() {
      getAllField().then(res => {
        if (res.code == 200) {
          this.workFiled = res.result;
        }
      });
    },
    /**
     * 下拉框选中事件
     */
    selectFiled(value) {
      // console.log(index);
      this.modalWorkFile.id = value;
      // console.log(this.modalWorkFile.id);
      this.workFiled.map(item => {
        if (item.id == value) {
          // console.log(item);
          this.filed = item;
        }
      });
    },
    handleSubmit() {
      this.$refs.wrokTemplate.validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: "确认添加",
            content: "模板一旦生成将无法删除，您确认要添加该模板吗?",
            onOk: () => {
              let fieldId = [];
              this.data.forEach(item => {
                fieldId.push(item.id);
              });
              this.wrokTemplate.fieldId = fieldId;
              console.log("要传的", this.wrokTemplate);
              addOrederTemplate(this.wrokTemplate).then(res => {
                // console.log(res);
                if (res.code == 200) {
                  this.$Message.success("新增自定义模板成功！");
                  this.$router.go(-1);
                }
              });
            }
          });
        } else {
          this.$Message.error("请输入模板名称！");
        }
      });
    },
    /**
     * 返回按钮事件
     */
    handleClose() {
      this.$Modal.confirm({
        title: "确认返回",
        content: "您确认要离开新增模板页面?",
        onOk: () => {
          // console.log("离开");
          this.$router.go(-1);
        }
      });
    },
    handleDel(row, index) {
      // console.log(row, index);
      this.data.splice(index, 1);
    },
    /**
     * 添加自定义字段按钮事件
     */
    hadleAddFile() {
      this.modalTitle = "添加自定字段";
      this.modalVisible = true;
    },
    /**
     * 编辑按钮事件
     */
    handleEdit(row, index) {
      this.modalTitle = "编辑自定字段";
      this.modalVisible = true;
      this.index = index;
      this.modalWorkFile = row;
      // console.log(row);
    },
    /**
     * 弹框确定事件
     */
    hadleSure(modalTitle) {
      // console.log("d");
      this.$refs.modalWorkFile.validate(valid => {
        if (valid) {
          if (modalTitle == "编辑自定字段") {
            let index = this.index;
            this.modalVisible = false;
            this.changeLanguage(this.filed);
            this.$set(this.data, index, this.filed);
            // console.log(this.data);
          } else if (modalTitle == "添加自定字段") {
            this.changeLanguage(this.filed);
            this.data.unshift(this.filed);
            this.modalVisible = false;
            this.modalWorkFile = {};
          }
        } else {
          this.$Message.error("请选择自定义字段");
        }
      });
    },
    /**
     * 语言切换
     */
    changeLanguage(obj) {
      switch (obj.status) {
        case "OPEN":
          obj.status = "开启";
          break;
        case "CLOSE":
          obj.status = "关闭";
          break;
      }
      switch (obj.isRequired) {
        case "YES":
          obj.isRequired = "是";
          break;
        case "NO":
          obj.isRequired = "否";
          break;
      }
      switch (obj.fieldType) {
        case "PULL":
          obj.fieldType = "下拉";
          break;
        case "RADIO":
          obj.fieldType = "单选";
          break;
        case "CHECK":
          obj.fieldType = "复选";
          break;
        case "SINGLE":
          obj.fieldType = "单行文本";
          break;
        case "MULTI":
          obj.fieldType = "多行文本";
          break;
        case "DATE":
          obj.fieldType = "日期";
          break;
      }
      return obj;
    },
    /**
     * 弹框取消按钮
     */
    cancle() {
      this.modalVisible = false;
      this.modalWorkFile = {};
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