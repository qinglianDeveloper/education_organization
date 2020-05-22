<template>
  <Modal v-model="follwAdd" title="新增跟进" width="700" @on-cancel="cancel">
    <Form>
      <Row :gutter="24">
        <Col span="8">
          <FormItem>
            <Input v-model="data.name" disabled />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem>
            <Select v-model="followFrom.followMethod" placeholder="请选择跟进方式">
              <Option
                v-for="item in methodsArray"
                :value="item.label"
                :key="item.label"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem>
            <DatePicker type="date" placeholder="请选择日期" v-model="time"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <FormItem>
        <Input type="textarea" :rows="4" v-model="followFrom.followContent" placeholder="跟进内容..." />
      </FormItem>
      <FormItem>
        <Input placeholder="跟进对象" v-model="data.contact" disabled />
      </FormItem>
      <FormItem>
        <!-- multiple -->
        <Upload
          :action="uploadActions"
          :data="name"
          :before-upload="beforeUpload"
          :on-success="successUpload"
        >
          <Button icon="ios-cloud-upload-outline">上传附件</Button>
        </Upload>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button
        type="primary"
        v-if="menuBtns.indexOf('customer:followUp:add')>-1"
        @click="followOk"
      >提交</Button>
      <Button style="margin-left: 8px" @click="followCancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import config from "@/config";
import { uploadAction, saveFollow } from "@/api";
import { dateFormat } from "@/utils/current";
import { mapState } from "vuex";
export default {
  data() {
    return {
      name: { title: "" },
      uploadActions: uploadAction,
      follwAdd: false,
      data: {},
      time: "",
      followFrom: {
        followTargetId: "",
        followMethod: "",
        followTime: "",
        followContent: "",
        annexNames: "",
        followTargetName: ""
      },
      methodsArray: [
        {
          value: "邮件",
          label: "Email"
        },
        {
          value: "电话",
          label: "Phone"
        },
        {
          value: "QQ",
          label: "QQ"
        },
        {
          value: "上门拜访",
          label: "Visit"
        },
        {
          value: "微信",
          label: "WeChat"
        },
        {
          value: "钉钉",
          label: "DingDing"
        },
        {
          value: "客户来访",
          label: "CustomerVisited"
        },
        {
          value: "其他",
          label: "Other"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      menuBtns: state => state.menu.menuBtns
    })
  },
  created() {
    this.uploadActions = config.uploadAction; //上传文件路径
  },
  props: ["followData", "followShow"],
  watch: {
    followShow(newVal) {
      this.follwAdd = newVal;
    },
    followData(newVal) {
      this.followFrom.followTargetId = newVal.id;
      this.followFrom.followTargetName = newVal.name;
      this.data = newVal;
    }
  },
  methods: {
    beforeUpload(file) {
      this.name.title = file.name;
    },
    successUpload(res) {
      if (res.code == 200) {
        this.followFrom.annexNames = res.message;
      }
    },
    cancel() {
      this.$emit("followFlase", false);
    },
    followOk() {
      let time = dateFormat(this.time);
      this.followFrom.followTime = time;
      saveFollow(this.followFrom).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          sessionStorage.setItem("rowObj", res.result);
          this.$emit("followFlase", false);
        }
      });
    },
    followCancel() {
      this.$emit("followFlase", false);
    }
  }
};
</script>