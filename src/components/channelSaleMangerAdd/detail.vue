<template>
  <Modal v-model="detailShow" title="详情" width="480" @on-ok="ok" @on-cancel="cancel">
    <CellGroup>
      <Cell title="销售：" :extra="objs.corpName" />
      <Cell v-if="objs.status == 'ENABLE'" title="状态：" extra="启用" />
      <Cell v-else title="状态：" extra="禁用" />
    </CellGroup>
  </Modal>
</template>
<script>
import { SGetById } from "@/api";
export default {
  data() {
    return {
      detailShow: false,
      id: {},
      objs: {}
    };
  },
  props: ["modalDetail", "Did"],
  watch: {
    modalDetail(newVal) {
      this.detailShow = newVal;
    },
    Did(newVal) {
      this.id = newVal;
      this._SGetById();
    }
  },
  methods: {
    _SGetById() {
      let obj = { id: this.id };
      SGetById(obj).then(res => {
        if (res.code == 200) {
          this.objs = res.result;
        }
      });
    },
    ok() {
      this.$emit("dChildrenS", false);
    },
    cancel() {
      this.$emit("dChildrenS", false);
    }
  }
};
</script>