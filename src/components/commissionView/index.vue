<template>
  <div class="commission-box">
    <Modal v-model="modal" title="返佣配置" @on-ok="ok" @on-cancel="cancel" width="1000">
      <Form :model="formItem" label-position="left" :label-width="120">
        <FormItem label="佣金比例上限">
          <Input v-model="formItem.limit" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="默认佣金比例">
          <Row>
            <Col span="4">
              <Input v-model="formItem.ratioTop" placeholder="区域代理比列" style="width:120px"></Input>
            </Col>
            <Col span="12">
              <Input v-model="formItem.ratioCustomer" placeholder="客户比列" style="width:120px"></Input>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { updateRakeBackRule } from "@/api";
export default {
  data() {
    return {
      modal: false,
      formItem: {
        topAgentCode: "",
        ratioTop: "",
        ratioCustomer: "",
        limit: ""
      }
    };
  },
  props: ["commissionShow", "Commissionid"],
  watch: {
    commissionShow(newVal) {
      this.modal = newVal;
    },
    Commissionid(newVal) {
      this.formItem.topAgentCode = newVal.agentCode;
      this.formItem.ratioTop = newVal.ratioTop;
      this.formItem.ratioCustomer = newVal.ratioCustomer;
      this.formItem.limit = newVal.limit;
    }
  },
  methods: {
    ok() {
      updateRakeBackRule(this.formItem).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
        }
      });
      this.$emit("cShow", false);
    },
    cancel() {
      this.$emit("cShow", false);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>