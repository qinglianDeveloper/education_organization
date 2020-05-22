<template>
  <Modal v-model="update" title="团队变更" width="800" @on-cancel="cancel">
    <div v-if="type == 1">
      <div class="box">
        <Row type="flex" justify="center" align="middle">
          <Col span="3">选择团队</Col>
          <Col span="14">
            <div class="model-show" @click="btnsales">{{ name }}</div>
          </Col>
        </Row>
      </div>
      <div class="box">
        <Row type="flex" justify="center" align="middle">
          <Col span="3">选择时间</Col>
          <Col span="14">
            <DatePicker
              size="large"
              type="date"
              placeholder="Select date"
              @on-change="dateChange"
              v-model="dateChoose"
            ></DatePicker>
          </Col>
        </Row>
      </div>
    </div>
    <Tree v-if="type == 2" :data="treeData" @on-select-change="selectChange"></Tree>
    <div slot="footer">
      <Button type="text" @click="handelSubmitGroup">取消</Button>
      <Button type="primary" @click="addClick">提交</Button>
    </div>
  </Modal>
</template>
<script>
import bus from "@/utils/bus";
import { salesTransfor, salesTeam } from "@/api";
import { StateTree } from "@/utils/current";
export default {
  props: ["list"],
  data() {
    return {
      type: 1,
      update: false,
      name: "",
      date: "",
      dateChoose: "",
      id: "",
      salesTeamId: "",
      treeData: []
    };
  },
  mounted() {
    bus.$off("update");
    bus.$on("update", item => {
      this.salesTeamId = item.salesTeamId;
      this.id = item.id;
      // this.update = !this.update;
    });
  },
  created() {
    // this._salesTeam();
  },
  watch: {
    list(val) {
      if (val) {
        // this._salesTeam();
      }
    }
  },
  methods: {
    btnsales() {
      this.type = 2;
    },
    async _salesTeam() {
      this.date = "";
      this.dateChoose = "";
      this.name = "";
      this.type = 1;
      this.treeData = [];
      this.update = true;
      let obj = {};
      await new Promise((resolve, reject) => {
        StateTree(this.list, this.switch1, obj, this.treeData);
        console.log("fff", this.treeData);
      });
    },
    cancel() {
      this.update = false;
      this.name = "";
      this.date = "";
      this.dateChoose = "";
    },
    handelSubmitGroup() {
      this.update = false;
      this.name = "";
      this.date = "";
      this.dateChoose = "";
    },
    addClick() {
      if (this.type == 2) {
        this.type = 1;
      } else {
        if (this.data == "") {
          this.$Message.error("日期不能为空");
          return;
        }
        if (this.name == "") {
          this.$Message.error("请选择要调整的团队");
          return;
        }
        let obj = {
          id: this.id,
          salesTeamId: this.salesTeamId,
          changeTime: this.date
        };
        salesTransfor(obj).then(res => {
          if (res.code == 200) {
            this.update = false;
            this.$Message.success(res.message);
            bus.$emit("salesTransfor", false);
          }
        });
      }
    },
    dateChange(e) {
      this.date = e;
    },
    selectChange(e) {
      // console.log(e);
      if (e[0]) {
        this.name = e[0].title;
        this.salesTeamId = e[0].label == undefined ? e[0].id : e[0].label;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  margin-top: 10px;
}
.model-show {
  border: 1px solid #e8eaec;
  min-width: 100px;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>