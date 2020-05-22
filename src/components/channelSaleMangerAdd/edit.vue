<template>
  <Modal v-model="modaledits" title="编辑" width="480" @on-ok="ok" @on-cancel="cancel">
    <Form :model="editModels" :label-width="100" :rules="ruleValidate">
      <FormItem label="销售" prop="salesId">
        <!-- <Select v-model="editModels.salesId" :disabled="disabled">
          <Option v-for="item in salesListS" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>-->
        <Input v-model="editModels.name" :disabled="disabled" />
      </FormItem>
      <!-- <FormItem label="佣金比例" prop="ratioSales">
        <Input v-model="addModel.ratioSales" placeholder="请输入佣金比例" />
      </FormItem>-->
      <FormItem label="是否启用">
        <RadioGroup v-model="animal" @on-change="radioChang">
          <Radio label="是"></Radio>
          <Radio label="否"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { salesList, sCupdate, SGetById } from "@/api";
export default {
  data() {
    return {
      disabled: false,
      modaledits: false,
      animal: "是",
      salesListS: [],
      ruleValidate: {
        salesId: [{ required: true, message: "销售不能为空", trigger: "blur" }],
        ratioSales: [
          { required: true, message: "佣金比列上限不能为空", trigger: "blur" }
        ],
        date: [
          { required: true, message: "佣金比列上限不能为空", trigger: "blur" }
        ]
      },
      editModels: {
        salesId: "",
        name: "",
        status: "ENABLE"
      },
      id: 0
    };
  },
  props: ["modalEdit", "eId"],
  watch: {
    modalEdit(newVal) {
      this.disabled = false;
      this.modaledits = newVal;
    },
    eId(id) {
      this.id = id.id;
      this.editModels.name = id.name;
      this.disabled = true;
      this._SGetById();
    }
  },
  methods: {
    _SGetById() {
      let obj = { id: this.id };
      SGetById(obj).then(res => {
        this.editModels.status = res.result.status;
        this.editModels.status == "ENABLE"
          ? (this.animal = "是")
          : (this.animal = "否");
      });
    },
    ok() {
      let obj = { id: this.id, status: this.editModels.status };
      sCupdate(obj).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.$emit("editShow", false);
        }
      });
    },
    cancel() {
      this.$emit("editShow", false);
    },
    radioChang(e) {
      e == "是"
        ? (this.editModels.status = "ENABLE")
        : (this.editModels.status = "DISABLE");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>