/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-16 15:46:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-08 10:49:27
 */
export const columnMarket = [
  { title: "姓名", key: "name", minWidth: 100, align: "center", fixed: "left" },
  { title: "手机号", key: "mobile", minWidth: 150, align: "center" },
  { title: "销售职位", key: "isLeader", minWidth: 120, align: "center" },
  { title: "销售类型", key: "salesType", minWidth: 120, align: "center" },
  { title: "二维码", slot: "qrcodeUrl", minWidth: 150, align: "center" },
  { title: "邀请码", key: "inviteCode", minWidth: 150, align: "center" },
  { title: "状态", slot: "status", minWidth: 120, align: "center" },
  {
    title: "操作",
    slot: "action",
    align: "center",
    minWidth: 220,
    fixed: "right"
  }
];
export const columnsService = [
  { title: "姓名", key: "name", minWidth: 100, align: "center" },
  {
    title: "佳信用户名",
    key: "jxUsername",
    minWidth: 150,
    align: "center"
  },
  {
    title: "是否团队领导",
    key: "isLeader",
    minWidth: 130,
    align: "center"
  },
  // { title: "状态", slot: "status", minWidth: 100, align: "center" },
  {
    title: "操作",
    slot: "action",
    align: "center",
    minWidth: 140,
    fixed: "right"
  }
];
export const columnsEngineer = [
  { title: "姓名", key: "name", minWidth: 100, align: "center", fixed: "left" },
  { title: "手机号", key: "mobile", minWidth: 150, align: "center" },
  { title: "级别", key: "level", minWidth: 100, align: "center" },
  {
    title: "是否团队领导",
    key: "isLeader",
    minWidth: 130,
    align: "center"
  },
  {
    title: "所在团队",
    key: "groupName",
    minWidth: 200,
    align: "center"
  },
  // { title: "状态", slot: "status", minWidth: 100, align: "center" },
  {
    title: "操作",
    slot: "action",
    align: "center",
    minWidth: 140,
    fixed: "right"
  }
];