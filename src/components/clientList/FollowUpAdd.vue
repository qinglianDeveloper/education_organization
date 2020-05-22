<template>
  <Modal v-model="modelShow" width="800">
    <div slot="header" class="title">
      <div>新增跟进</div>
    </div>
    <div slot="close"></div>
    <div class="content">
      <div class="header-input">
        <div>
          <Form>
            <FormItem>
              <Input
                size="large"
                disabled
                v-model="FromDataS.followTargetName"
                style="width:200px"
              />
            </FormItem>
          </Form>
        </div>
        <div>
          <Form>
            <FormItem>
              <Select
                size="large"
                style="width:200px"
                placeholder="跟进方式:"
                v-model="FromDataS.followMethod"
              >
                <Option
                  v-for="item in methodsList"
                  :key="item.label"
                  :value="item.label"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form>
            <FormItem>
              <DatePicker
                size="large"
                type="date"
                v-model="FromDataS.followTime"
                placeholder="选择日期"
                style="width:200px"
              ></DatePicker>
            </FormItem>
          </Form>
        </div>
      </div>
      <div>
        <Form>
          <FormItem>
            <Input size="large" v-model="FromDataS.followContent" type="textarea" :rows="4" />
          </FormItem>
        </Form>
      </div>
      <div>
        <Form>
          <FormItem label="跟进对象" :label-width="100">
            <Input
              size="large"
              search
              disabled
              v-model="FromDataS.followTargetName"
              style="width:400px"
            />
          </FormItem>
        </Form>
      </div>
      <!-- <div class="text">
        <div>联系人</div>
        <div>已有联系人</div>
        <div>
          <a href="javascript:;">新增联系人</a>
        </div>
      </div>
      <div class="table">
        <Table border :columns="columns" :data="data"></Table>
      </div>
      <div>已选联系人</div>-->
      <div class="upload">
        <div>附件</div>
        <Upload :action="uploadAction">
          <Button>上传</Button>
        </Upload>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" @click="configOk">提交</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { uploadAction, saveFollow } from "@/api";
import { addColumns, methodsArray, FromData } from "./addfollowup";
import { dateFormat } from "@/utils/current";
export default {
  data() {
    return {
      salesList: [],
      followUpShow: false,
      uploadAction: uploadAction,
      columns: addColumns,
      data: [],
      methodsList: methodsArray,
      FromDataS: FromData,
      modelShow: false
    };
  },
  props: ["followUpData", "addCoopeStatus"],
  watch: {
    followUpData(newVal) {
      this.FromDataS.followTargetName = newVal.name;
      this.FromDataS.followTargetId = newVal.id;
    },
    addCoopeStatus(newVal) {
      this.modelShow = newVal;
    }
  },
  methods: {
    cancel() {
      this.$emit("followUpDataCancel", false);
    },
    configOk() {
      this.FromDataS.followTime = dateFormat(this.FromDataS.followTime);
      saveFollow(this.FromDataS).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.message);
          this.modelShow = false;
          this.$emit("okShow", false);
        } else if (res.code == 502) {
          this.$Message.error(res.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  height: 30px;
  line-height: 30px;
  font-size: 22px;
}
.content {
  padding: 20px;
}
.header-input {
  display: flex;
  justify-content: space-between;
}
.text {
  display: flex;
  div {
    margin-left: 30px;
  }
}
.upload {
  display: flex;
  height: 100px;
  align-items: center;
  div {
    margin-left: 30px;
  }
}
</style>