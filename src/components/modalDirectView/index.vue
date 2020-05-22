<template>
  <Modal v-model="modalShow" title="用户详情" width="800" @on-ok="ok" @on-cancel="cancel">
    <CellGroup>
      <Cell title="用户名称：" :extra="searchForm.corpName" />
      <Cell title="性质：" :extra="nature" />
      <Cell title="真实姓名：" :extra="searchForm.corpName" />
      <Cell title="手机号：" :extra="searchForm.mobilePhone" />
      <Cell title="身份证号：" :extra="searchForm.idNum" />
      <Cell title="其他联系人：" :extra="searchForm.legalPersonName" />
      <Cell title="手机号：" :extra="searchForm.legalPersonPhone" />
      <Cell title="佣金比列：" :extra="searchForm.corpName" />
      <Cell>
        <span>{{ alertText }}</span>
        <div class="apply-img-ground">
          <img :src="searchForm.idBackPic" />
          <img :src="searchForm.idFrontPic" />
          <!-- <img v-if="alertText == '身份证正反面：'" :src="applyDetail.idFrontPic" alt />
          <img v-if="alertText == '营业执照照片：'" :src="applyDetail.idFrontPic" alt />-->
        </div>
      </Cell>
    </CellGroup>
  </Modal>
</template>
<script>
import { getById } from "@/api";
export default {
  data() {
    return {
      modalShow: false,
      alertText: "身份证正反面",
      searchForm: {},
      nature: "",
      animal: "是"
    };
  },
  props: ["id", "modalEdit"],
  watch: {
    modalEdit(newVal) {
      this.modalShow = newVal;
    },
    id(newVal) {
      this._getById();
    }
  },
  created() {},
  methods: {
    _getById() {
      let obj = { id: this.id };
      getById(obj).then(res => {
        this.nature = res.result.nature == "COMPANY" ? "企业" : "个人";
        this.searchForm = res.result;
      });
    },
    ok() {
      this.$emit("modalShow", false);
    },
    cancel() {
      this.$emit("modalShow", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.apply-img-ground {
  display: flex;
  justify-content: space-around;
  width: 800px;
  img {
    display: block;
    width: 300px;
    height: 200px;
  }
}
</style>