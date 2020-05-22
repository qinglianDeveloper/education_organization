<!-- 公告配置 --->
<template>
  <div class="noticeAllocationAddEdit">
    <Row>
      <Form ref="form" :model="formItem" :label-width="100" :rules="carouselRules">
        <FormItem label="公告名称" prop="title">
          <Input v-model="formItem.title" placeholder="请输入公告名称"></Input>
        </FormItem>
        <FormItem label="链接" prop="url">
          <Input v-model="formItem.url" placeholder="请输入链接"></Input>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="formItem.sort" placeholder="请输入排序"></Input>
        </FormItem>
        <FormItem label="状态：" prop="status">
          <i-switch size="large" v-model="formItem.status">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
      </Form>
      <tinymce-editor
        ref="editor"
        v-model="formItem.content"
        :disabled="false"
        :language="'zh_CN'"
        :skin="'oxide'"
      ></tinymce-editor>
    </Row>
    <div class="footer">
      <Button class="Button" type="info" @click="save">保存</Button>
      <Button class="Button" @click="handleCancel">取消</Button>
    </div>
  </div>
</template>
<script>
import { addNotice, updateNotice, getNoticeById } from "@/api";
import TinymceEditor from "@/components/tinymce-editor/tinymce-editor";
import config from "@/config";
//import { dateFormat } from "@/utils/current";
export default {
  name: "noticeAllocationAddEdit",
  components: {
    TinymceEditor
  },
  data() {
    return {
      type: "add",
      id: "null",
      formItem: {
        title: "",
        url: "",
        sort: "",
        content: "",
        status: true
      },
      carouselRules: {
        title: [
          { required: true, message: "公告名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    // console.log(this.$route);
    let { type, id } = this.$route.query;
    this.type = type;
    this.id = id;
    if (type === "edit") {
      //编辑---通过id获取详情
      getNoticeById({ id }).then(res => {
        if (res.code === 200) {
          let { id, title, url, sort, content, status } = res.result;
          status = status == "ENABLE" ? true : false;
          this.formItem.id = id;
          this.formItem.title = title;
          this.formItem.url = url;
          this.formItem.sort = sort;
          this.formItem.content = content;
          this.formItem.status = status;
        }
      });
    }
  },
  filters: {
    formatTime(value) {
      //return dateFormat(value);//格式：年-月-日 时:分:秒
      return value.split("T")[0]; //格式：年-月-日
    }
  },
  methods: {
    // changeSwitch(v) {
    //   //改变状态按钮事件
    //   this.formItem.status = v;
    // },
    startDate(e) {
      //开始时间
      this.formItem.startTime = e;
    },
    endDate(e) {
      //结束时间
      this.formItem.endTime = e;
    },
    add() {
      //添加
      let { title, url, sort, content, status } = this.formItem;
      status = status ? "ENABLE" : "DISABLE";
      addNotice({
        title,
        url,
        sort,
        content,
        status
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.$router.go(-1);
        }
      });
    },
    update() {
      //编辑
      let { id, title, url, sort, content, status } = this.formItem;
      status = status ? "ENABLE" : "DISABLE";
      updateNotice({ id, title, url, sort, content, status }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.$router.go(-1);
        }
      });
    },
    save() {
      //保存
      console.log(this.formItem);
      let { type } = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (type === "add") {
            this.add();
          } else {
            this.update();
          }
        }
      });
    },
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
.noticeAllocationAddEdit {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow: auto;
  max-width: 900px;
  .footer {
    padding: 15px;
    display: flex;
    justify-content: center;
    .Button {
      margin: 0 5px;
    }
  }
}
</style>