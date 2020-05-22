<template>
  <Modal v-model="modalAdds" title="新增" width="480" @on-ok="ok" @on-cancel="cancel">
    <Form :model="addModel" :label-width="100" :rules="ruleValidate">
      <FormItem label="销售" prop="salesId">
        <Select v-model="addModel.salesId">
          <Option v-for="item in salesListS" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="佣金比例" prop="ratioSales">
        <Input v-model="addModel.ratioSales" placeholder="请输入佣金比例" />
      </FormItem> -->
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
import { salesList,salesChannelAdd } from "@/api";
export default {
  data() {
    return {
      modalAdds: false,
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
      addModel: {
        salesId: "",
        status: "ENABLE",
      }
    };
  },
  created() {
    this._salesList();
  },
  props: ["modalAdd"],
  watch: {
    modalAdd(newVal) {
      this.modalAdds = newVal;
    }
  },
  methods: {
    ok() {
      salesChannelAdd(this.addModel).then(res => {
          if(res.code == 200) {
              console.log(res)
              this.$Message.success(res.message)
          }
      });
      this.$emit("addShow", false);
    },
    cancel() {
      this.$emit("addShow", false);
    },
    _salesList() {
      salesList().then(res => {
        if (res.code == 200) {
          let arr = res.result;
          console.log(arr)
          arr.map(item => {
            let obj = { value: item.id, label: item.name };
            this.salesListS.push(obj);
          });
        }
      });
    },
    radioChang(e) {
        e == '是'? this.addModel.status = 'ENABLE' : this.addModel.status = 'DISABLE'
    }  
  }
};
</script>
<style lang="scss" scoped>
</style>