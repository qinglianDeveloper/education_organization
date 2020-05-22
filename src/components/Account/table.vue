<template>
    <div class="table-box">
         <Table border ref="selection" :columns="columns" :data="data"></Table>
    </div>
</template>
<script>
import { columnList } from './table';
export default {
    data() {
        return {
            columns:columnList,
            data:[]
        }
    }
}
</script>
<style lang="scss" scoped>
    .table-box{

    }
</style>