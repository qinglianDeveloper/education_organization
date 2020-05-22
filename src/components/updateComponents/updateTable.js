import { Modal, Message } from 'view-design';
import { calTaskRemove } from '@/api';
import bus from '@/utils/bus';

export const column = [
    {
        title: '序号',
        width: 70,
        fixed: 'center',
        render: (h, params) => {
            return h('span', params.index + 1)
        },
        align: "center",
        fixed: "left"
    },
    {
        title: '数据类型',
        key: 'dataType',
        minWidth: 140,
        align: "center"
    },
    {
        title: '源文件',
        slot: 'uploadAttachmentsUrl',
        minWidth: 180,
        align: "center"
    },
    {
        title: '反馈文件',
        slot: 'downloadAttachmentsUrl',
        minWidth: 120,
        align: "center"
    },
    {
        title: '任务类型',
        key: 'taskType',
        minWidth: 100,
        align: "center"

    },
    {
        title: '状态',
        key: 'status',
        minWidth: 100,
        align: "center"
    },
    {
        title: '错误信息',
        key: 'errorMsg',
        minWidth: 160,
        tooltip: true
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 150,
        align: 'center',
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    style: {
                        marginRight: '5px'
                    },
                    on: {
                        click: () => {
                            Modal.info({
                                title: '<h3>信息明细</h3>',
                                content: `<div>
                                    <div>
                                        <span>上传类型：</span>
                                        <span>${params.row.dataType}</span>
                                    </div>
                                    <div>
                                        <span>文件名：</span>
                                        <span></span>
                                    </div>
                                    <div>
                                        <span>上传人：</span>
                                        <span></span>
                                    </div>
                                    <div>
                                        <span>状态：</span>
                                        <span>${params.row.status}</span>
                                    </div>
                                    <div>
                                        <span>错误信息：</span>
                                        <span>${params.row.errorMsg}</span>
                                    </div>
                                    <div>
                                        <span>备注：</span>
                                        <span>${params.row.remark}</span>
                                    </div>
                                    <div>
                                        <span>上传时间</span>
                                        <span>${params.row.updateTime}</span>
                                    </div>
                                </div>`
                            });
                        }
                    }
                }, '查看'),
                h('Button', {
                    props: {
                        type: 'error',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            Modal.confirm({
                                title: '删除该文件',
                                content: '<p>确定要删除该文件吗?</p>',
                                onOk: () => {
                                    calTaskRemove(params.row.id).then(res => {
                                        console.log(res)
                                        if (res.code == 200) {
                                            Message.success(res.message);
                                            bus.$emit('delOk', res.message)
                                        } else {
                                            Message.error(res.message);
                                        }
                                    })
                                },
                                onCancel: () => {
                                    Message.info('取消删除');
                                }
                            });
                        }
                    }
                }, '删除')
            ]);
        }
    }
]