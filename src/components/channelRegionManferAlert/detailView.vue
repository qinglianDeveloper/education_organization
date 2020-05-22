<template>
  <div class="detail-box" :modals="modals">
    <Modal v-model="modal" :title="title" @on-ok="ok" @on-cancel="cancel" width="1200">
      <div class="box">
        <div class="input">
          <div class="text">手机号</div>
          <Input v-model="detailData.mobilePhone" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">代理名称：</div>
          <Input v-model="detailData.corpName" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">渠道名称：</div>
          <Input v-model="detailData.channelName" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">所属销售：</div>
          <Input v-model="detailData.salesUserId" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">企业名称：</div>
          <Input v-model="detailData.companyName" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">注册时间：</div>
          <Input v-model="detailData.registDate" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">注册机关：</div>
          <Input v-model="detailData.registAuthority" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">注册编号：</div>
          <Input v-model="detailData.registNumber" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">注册资金：</div>
          <Input v-model="detailData.registMoney" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">法人姓名：</div>
          <Input v-model="detailData.legalPersonName" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">法人电话：</div>
          <Input v-model="detailData.legalPersonPhone" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">单位地址：</div>
          <Input v-model="detailData.companyAddress" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">单位电话：</div>
          <Input v-model="detailData.companyPhone" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">企业性质：</div>
          <Input v-model="detailData.companyNature" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">职工人数：</div>
          <Input v-model="detailData.numberOfWorkers" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">主要经营产品类型：</div>
          <Input v-model="detailData.productType" :disabled="disabled" style="width: 300px" />
        </div>
      </div>
      <div class="box">
        <div class="input">
          <div class="text">主要客户群体类型：</div>
          <Input v-model="detailData.customerType" :disabled="disabled" style="width: 300px" />
        </div>
        <div class="input">
          <div class="text">主要业务详细描述：</div>
          <Input
            v-model="detailData.businessDescription"
            :disabled="disabled"
            style="width: 300px"
          />
        </div>
      </div>
      <div class="box-img">
        <div class>附件:</div>
        <div class="content">
          <img :src="urls" title="身份证正面" />
          <!-- <img :src="detailData.idFrontPic" title="身份证反面" /> -->
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getById } from "@/api";
import { dateFormat } from '@/utils/current';
export default {
  data() {
    return {
      urls:'',
      detailData: {},
      disabled: true,
      modal: false,
      apiId: 0,
      name: "",
      title: "详情"
    };
  },
  props: ["detailShow", "id", "type"],
  computed: {
    // eslint-disable-next-line
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
      let obj = { id: this.id };
      getById(obj).then(res => {
        if (res.code == 200) {
          this.detailData = res.result;
          this.urls = res.result.qrcode.url;
          this.detailData.registDate = dateFormat(res.result.createdTime)
          this.detailData.salesUserId = res.result.sales.name;
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
  width: 850px;
  align-items: center;
  //   justify-content: space-around;
  .input {
    display: flex;
    // width: 400px;
    align-items: center;
    justify-content: space-around;
    height: 80px;
    line-height: 80px;
    .text{
      width: 160px;
      text-align: center;
    }
  }
}
.box-img {
  margin-top: 40px;
  .text {
    width: 100px;
    height: 80px;
    line-height: 80px;
  }
  .content {
    display: flex;
    justify-content: space-around;
    img {
      // width: 200px;
      // height: 80px;
      border: 1px solid #ccc;
    }
  }
}
</style>