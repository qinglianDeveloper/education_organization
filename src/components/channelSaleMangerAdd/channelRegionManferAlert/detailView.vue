<template>
  <div class="detail-box" :modals='modals'>
    <Modal v-model="modal" :title="title" @on-ok="ok" @on-cancel="cancel">
      <div class="box">
        <div class="text">用户昵称：</div>
        <Input v-model="detailData.corpName" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box">
        <div class="text">性质：</div>
        <Input v-model="detailData.companyNature" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box">
        <div class="text">真实姓名：</div>
        <Input v-model="detailData.legalPersonName" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box">
        <div class="text">手机号：</div>
        <Input v-model="detailData.mobilePhone" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box">
        <div class="text">身份证号：</div>
        <Input v-model="name" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box">
        <div class="text">其他联系人：</div>
        <Input v-model="detailData.legalPersonName" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box">
        <div class="text">手机号：</div>
        <Input v-model="detailData.legalPersonPhone" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box">
        <div class="text">佣金比列：</div>
        <Input v-model="name" :disabled="disabled" style="width: 400px" />
      </div>
      <div class="box-img">
        <div class>身份证正反面:</div>
        <div class="content">
          <img :src="detailData.idBackPic" title="身份证正面" />
          <img :src="detailData.idFrontPic" title="身份证反面" />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getById } from "@/api";
export default {
  data() {
    return {
      detailData:{},
      disabled: true,
      modal: false,
      apiId: 0,
      name: "",
      title: "详情"
    };
  },
  props: ["detailShow", "id", "type"],
  computed: {
    modals() {
      if (this.modal == true) {
        this._getById();
      } else {
        window.onload = null;
      }
    }
  },
  watch: {
    type(newVal) {
      newVal == "1" ? (this.title = "详情") : (this.title = "编辑");
      newVal == "2" ? (this.disabled = false) : (this.disabled = true);
    },
    id(newVal) {
      this.apiId = newVal;
    },
    detailShow(newVal) {
      this.modal = newVal;
    }
  },
  methods: {
    _getById() {
      let obj = { id:this.id }
      getById(obj).then(res => {
        if(res.code == 200) {
          this.detailData = res.result;
        }
      });
    },
    ok() {
      this.$emit("show", false);
    },
    cancel() {
      this.$emit("show", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  height: 60px;
  align-items: center;
  //   justify-content: space-around;
  .text {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
}
.box-img {
  .text {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
  .content {
    display: flex;
    justify-content: space-around;
    img {
      width: 200px;
      height: 80px;
      border: 1px solid #ccc;
    }
  }
}
</style>