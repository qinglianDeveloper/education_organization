<template>
  <Breadcrumb>
    <BreadcrumbItem v-for="(item,index) in currentPath" :href="item.path" :key="index">
      <Icon :type="item.icon"></Icon>
      {{ showTitle(item) }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
import { showTitle } from "@/libs/util";
export default {
  name: "breadcrumbNav",
  props: {
    currentPath: Array
  },
  methods: {
    showTitle(item) {
      // console.log(item);
      return item.meta.title;
      // console.log(item);
      // return showTitle(item, this);
    }
  }
};
</script>

<style lang="scss" scoped>
.ivu-breadcrumb {
  font-size: 10px;
  color: #c5cae9;
}
.ivu-breadcrumb > span:last-child {
  color: #c5cae9 !important;
  font-size: 10px !important;
}
</style>

