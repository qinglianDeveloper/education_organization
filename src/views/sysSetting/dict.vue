<!-- 数据字典 --->
<template>
  <section>
    <Card>
      <!-- 头部 -->
      <div ref="header" style="min-width: 980px;">
        <div class="serach">
          <div>
            <Button type="primary" icon="md-add" @click="handelSomeadd">批量导入</Button>
            <Button type="success" icon="md-add" class="search-add" @click="handelAdd">添加</Button>
            <Button type="error" icon="md-close" @click="handelDel">删除</Button>
          </div>

          <div>
            <Form ref="searchFrom" :model="searchFrom" class="serach-r">
              <FormItem label="归属中心:">
                <Select v-model="searchFrom.select">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
                </Select>
              </FormItem>
              <FormItem label="字典类型:" class="serach-r-type">
                <Input v-model="searchFrom.type" placeholder="请输入字典类型"></Input>
              </FormItem>
              <FormItem label="字典描述:">
                <Input v-model="searchFrom.descripe" placeholder="请输入字典描述"></Input>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <!-- 头部 -->
      <!-- 表格 -->
      <Table border :columns="columns1" :data="data1" sortable="custom" :height="tableHeight"></Table>
      <!-- 表格 -->
      <!-- 尾部 -->
      <div ref="footer" class="footer">
        <Page
          :current="1"
          :total="0"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </div>
      <!-- 尾部 -->
    </Card>
  </section>
</template>
<script>
export default {
  name: "dic-manage",
  data() {
    return {
      searchFrom: {
        select: "",
        type: "",
        descripe: ""
      },
      /* 表格标题 */
      columns1: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "序号",
          key: "name",
          align: "center",
          width: 120
        },
        {
          title: "归属中心",
          key: "age",
          width: 120,
          sortable: true,
          align: "center"
        },
        {
          title: "父级名称",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "字典类型",
          key: "age",
          width: 120,
          sortable: true,
          align: "center",
          width: 120
        },
        {
          title: "字典名称",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "数据值",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "字典描述",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "排序",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "备注",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "更新者",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "更新时间",
          key: "address",
          align: "center",
          width: 120
        },
        {
          title: "操作",
          key: "action",
          width: 130,
          align: "center",
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.listEdit(params.row);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.listDel(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      /* 表格内容 */
      data1: [
        {
          name: "测试",
          age: 18,
          address: "北京"
        }
      ],
      tableHeight: 0
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // 销毁全局方法
    window.onresize = null;
  },
  methods: {
    /**
     * 页面初始化
     */
    init() {
      this.pageHeight();
    },

    /**
     * 页面高度
     */
    pageHeight() {
      let pageHeight = Number(
        document.getElementsByClassName("single-page")[0].clientHeight
      );
      let headerHeight = this.$refs.header.clientHeight;
      let footerHeight = this.$refs.footer.clientHeight;
      this.tableHeight = pageHeight - headerHeight - footerHeight - 47;
    },

    /**
     * 批量导入按钮
     */
    handelSomeadd() {
      console.log("批量导入");
    },

    /**
     * 添加按钮
     */
    handelAdd() {
      console.log("添加");
    },

    /**
     * 删除按钮
     */
    handelDel() {
      console.log("删除");
    },

    /**
     * 分页
     */
    changePage() {},
    changePageSize() {},

    /**
     * 列表编辑
     */
    listEdit(row) {
      console.log("列表编辑", row);
    },

    /**
     * 列表删除
     */
    listDel(row) {
      console.log("列表删除", row);
    }
  }
};
</script>
<style lang="scss" scoped>
.serach {
  display: flex;
  justify-content: space-between;
}
.serach-r {
  display: flex;
}
.serach-r-type {
  margin: 0 10px 0 10px;
}
.search-add {
  margin: 0 10px 0 10px;
}
.ivu-form-item-content {
  display: flex;
}
.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>