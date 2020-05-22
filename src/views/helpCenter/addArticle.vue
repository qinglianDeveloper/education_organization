<!-- 新增文章 -->
<template>
  <div class="add-article">
    <!-- 返回按钮 -->
    <!-- <Row type="flex" justify="end">
      <div class="btn">
        <Button type="default" icon="md-close" size="small">返回文章列表</Button>
      </div>
      <Divider style="margin:10px 0" />
    </Row>-->
    <Row style="margin-top:30px;">
      <Form :model="articleForm" :label-width="100" :rules="articleRules" ref="articleForm">
        <FormItem label="文章标题：" prop="title">
          <Input v-model="articleForm.title" style="width:500px" />
        </FormItem>
        <FormItem label="分类：" prop="type">
          <Select v-model="articleForm.type" filterable style="width:500px">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <div style="width:1000px">
            <tinymce-editor v-model="articleForm.msg"></tinymce-editor>
          </div>
        </FormItem>
        <FormItem style="margin-top:50px">
          <div style="display:flex; justify-content:center;width:900px">
            <Button type="primary" @click="handleSave('articleForm')" style="margin-right:10px">保存</Button>
            <Button type="default" @click="handleCancel">取消</Button>
          </div>
        </FormItem>
      </Form>
    </Row>
  </div>
</template>
<script>
/* 富文本编辑框 */
import TinymceEditor from "@/components/tinymce-editor/tinymce-editor";
export default {
  name: "add-article",
  components: { TinymceEditor },
  data() {
    return {
      articleForm: { msg: "123156456" },
      typeList: [
        { value: "1", label: "1" },
        { value: "2", label: "2" }
      ],
      articleRules: {
        title: [
          {
            required: true,
            message: "文章标题不能为空",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择文章类型",
            trigger: "blur"
          }
        ]
      },
      ID: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getRouter();
    },
    /**
     * 获取路由传参的值
     */
    getRouter() {
      if (this.$route.params.ID) {
        this.ID = this.$route.params.ID;
      } else {
        this.ID = null;
      }
      console.log(this.ID);
    },
    /**
     * 保存按钮事件
     */
    handleSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
          console.log(this.articleForm);
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    /**
     * 取消按钮事件
     */
    handleCancel() {
      this.$Modal.confirm({
        title: "确认返回",
        content: "您确认要离开?",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.add-article {
  padding: 16px;
  height: 100%;
  overflow: auto;
}
</style>