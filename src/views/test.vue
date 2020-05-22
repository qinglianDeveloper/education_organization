<template>
  <div>
    测试富文本
    <tinymce :height="400" ref="editor" :value="viewModel.content" @input="aaa"></tinymce>
    {{viewModel.content}}
  </div>
</template>
<script>
import tinymce from "@/components/tinymce/index.vue";
export default {
  components: { tinymce },
  data() {
    return {
      viewModel: {
        content: "测试"
      }
    };
  },
  methods: {
    aaa(val) {
      this.viewModel.content = val;
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>