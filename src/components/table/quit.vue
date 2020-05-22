<template>
  <Modal v-model="quitShow" title="离职提示" width="800" @on-cancel="cancel">
    <Row type="flex" justify="center" align="middle">
      <Col span="3">选择时间</Col>
      <Col span="14">
        <DatePicker
          size="large"
          type="date"
          placeholder="Select date"
          style="width: 300px"
          @on-change="dateChange"
        ></DatePicker>
      </Col>
    </Row>
    <div slot="footer">
      <Button type="text" @click="handelSubmitGroup">取消</Button>
      <Button type="primary" @click="addClick">提交</Button>
    </div>
  </Modal>
</template>
<script>
import { changeDate } from "@/api";
export default {
  data() {
    return {
      quitShow: false,
      date: "",
      id: ""
    };
  },
  props: ["quitId"],
  watch: {
    quitId(newVal) {
      this.id = newVal;
      this.quitShow = !this.quitShow;
    }
  },
  methods: {
    cancel() {
      this.quitShow = false;
      this.$emit('quitok',false)
    },
    dateChange(e) {
      this.date = e;
    },
    handelSubmitGroup() {
      this.quitShow = false;
      this.$emit('quitok',false)
    },
    addClick() {
      if (this.date == "") {
        this.$Message.error("时间不能为空");
        return;
      }
      let obj = {
        id: this.id,
        leaveTime: this.date
      };
      changeDate(obj).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.quitShow = false;
          this.$emit('quitok',false)
        }
      });
    }
  }
};
</script>