import { Modal, Message } from 'view-design';
import { contactDel } from '@/api'
import bus from '@/utils/bus';
export const Contacts = [
    { title: '姓名', key: 'name', align: 'center' },
    { title: '性别', key: 'sex', align: 'center' },
    { title: '所属部门', key: 'department', align: 'center' },
    { title: '职位', key: 'position', align: 'center' },
    { title: '电话', key: 'telephone', align: 'center' },
    { title: '手机号码', key: 'mobilePhone', align: 'center' },
    // { title: '备注', key: 'zip' },
    {
        title: '操作',
        align: 'center',
        width: 400,
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    },
                    style: {
                        marginRight: '10px'
                    },
                    on: {
                        click: () => {
                            Modal.confirm({
                                title: '删除联系人',
                                content: '<p>确定要删除改联系人吗?</p>',
                                onOk: () => {
                                    let obj = { ids: params.row.id }
                                    contactDel(obj).then(res => {
                                        if (res.code == 200) {
                                            Message.success('删除成功');
                                            bus.$emit('delOk', false)
                                        }
                                    })
                                },
                                onCancel: () => {
                                    Message.info('取消删除');
                                }
                            });
                        }
                    }
                }, '删除'),
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            bus.$emit('item', params)
                        }
                    }
                }, '编辑')
            ]);
        }
    }
];
export const accountInformation = [
    { title: '账号名', key: 'cstName', align: 'center' },
    { title: '审核状态', key: 'age', align: 'center' },
    { title: '账号关联类型', key: 'accountType', align: 'center' },
    { title: '总业绩金额', key: 'city', align: 'center' },
    { title: '首次消费时间', key: 'address', align: 'center' },
    { title: '归属电销', key: 'zip', align: 'center' },
    { title: '归属直销', key: 'zip', align: 'center' },
    { title: '更新时间', key: 'zip', align: 'center' },
    {
        title: '操作',
        align: 'center',
        width: 400,
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    }
                }, '删除'),
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    }
                }, '编辑')
            ]);
        }
    }
];
export const Business = [
    { title: '商机标题', key: 'name', sortable: true, align: 'center' },
    { title: '直销负责人', key: 'age', sortable: true, align: 'center' },
    { title: '状态', key: 'province', sortable: true, align: 'center' },
    { title: '阶段', key: 'city', sortable: true, align: 'center' },
    { title: '预计成单金额', key: 'address', sortable: true, align: 'center' },
    { title: '预计成单时间', key: 'zip', sortable: true, align: 'center' },
    { title: '成单率', key: 'zip', sortable: true, align: 'center' },
    { title: '更新人', key: 'zip', sortable: true, align: 'center' },
    { title: '更新时间', key: 'zip', sortable: true, align: 'center' },
    {
        title: '操作',
        align: 'center',
        width: 400,
        render: (h, params) => {
            return h('Button', [
                h('Button', {
                    props: {
                        type: '编辑',
                        size: 'small'
                    },
                    style: {
                        marginRight: '10px'
                    },
                }, 'View'),
                h('Button', {
                    props: {
                        type: '删除',
                        size: 'small'
                    }
                }, 'Edit')
            ]);
        }
    }
];
export const Enclosure = [
    { title: '文件名', key: 'name' },
    { title: '文件后缀', key: 'age' },
    { title: '模块', key: 'province' },
    { title: '标签', key: 'city' },
    { title: '更新人', key: 'address' },
    { title: '更新时间', key: 'zip' },
    { title: '备注', key: 'zip' },
    { title: '附件下载', key: 'zip' },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (h, params) => {
            return h('Button', [
                h('Button', {
                    props: {
                        type: '编辑',
                        size: 'small'
                    }
                }, 'View'),
                h('Button', {
                    props: {
                        type: '删除',
                        size: 'small'
                    }
                }, 'Edit')
            ]);
        }
    }
];
export const CommissionTask = [
    { title: '任务标题', key: 'name' },
    { title: '执行人', key: 'age' },
    { title: '完成期限', key: 'province' },
    { title: '级别', key: 'city' },
    { title: '状态', key: 'address' },
    { title: '联系人', key: 'zip' },
    { title: '附件', key: 'zip' },
    { title: '任务描述', key: 'zip' },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (h, params) => {
            return h('Button', [
                h('Button', {
                    props: {
                        type: '编辑',
                        size: 'small'
                    }
                }, 'View'),
                h('Button', {
                    props: {
                        type: '删除',
                        size: 'small'
                    }
                }, 'Edit')
            ]);
        }
    }
];
export const operation = [
    // { title: '序号', key: 'index' },
    { title: '操作类型', key: 'operation' },
    { title: '字段名', key: 'ip' },
    { title: '旧字段值', key: 'ip' },
    { title: '新字段值', key: 'ip' },
    { title: '描述', key: 'method' },
    { title: '操作人', key: 'operation' },
    { title: '操作时间', key: 'gmtCreate' },
];