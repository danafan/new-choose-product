import Vue from "vue";
import Router from "vue-router";

const tab_menu = (resolve) => require(["@/pages/tab_menu"], resolve);
const login = (resolve) => require(["@/pages/login"], resolve);
const index = (resolve) => require(["@/pages/Index/index"], resolve);
const notice_page = (resolve) => require(["@/pages/NoticePage/notice_page"], resolve);
const goods_detail = (resolve) => require(["@/pages/GoodsDetail/goods_detail"], resolve);
const selected = (resolve) => require(["@/pages/Selected/selected"], resolve);
const car_page = (resolve) => require(["@/pages/CarPage/car_page"], resolve);
const supply_chain = (resolve) => require(["@/pages/SupplyChain/supply_chain"], resolve);
const chain_style_info = (resolve) => require(["@/pages/SupplyChain/pages/chain_style_info"], resolve);
const chain_message_page = (resolve) => require(["@/pages/SupplyChain/pages/chain_message_page"], resolve);
const chain_supplier_page = (resolve) => require(["@/pages/SupplyChain/pages/chain_supplier_page"], resolve);
const add_edit_supplier = (resolve) => require(["@/pages/SupplyChain/pages/SupplierPages/add_edit_supplier"], resolve);
const chain_supplier_detail = (resolve) => require(["@/pages/SupplyChain/pages/SupplierPages/supplier_detail"], resolve);
const account_list = (resolve) => require(["@/pages/SupplyChain/pages/SupplierPages/account_list"], resolve);
const chain_permissions_page = (resolve) => require(["@/pages/SupplyChain/pages/chain_permissions_page"], resolve);
const chain_feekback_page = (resolve) => require(["@/pages/SupplyChain/pages/chain_feekback_page"], resolve);
const setting_record_page = (resolve) => require(["@/pages/SupplyChain/pages/setting_record_page"], resolve);

Vue.use(Router);

const router = new Router({
  routes: [
  {
    path: "/login",
    name: "登录",
    component: login
  },
  {
    path: "/tab_menu",
    component: tab_menu,
    name: "",
    children: [
    {
      path: "/notice_page",
      name: "公告详情",
      component: notice_page
    },
    {
      path: "/index",
      name: "首页",
      component: index
    },
    {
      path: "/goods_detail",
      name: "选品详情",
      component: goods_detail
    },
    {
      path: "/car_page",
      name: "待选记录",
      component: car_page
    },
    {
      path: "/supply_chain",
      name: "供应链中心",
      component: supply_chain,
      children: [
        {
        path: "/chain_style_info",
        name: "款式资料",
        component: chain_style_info
      },
      {
        path: "/chain_message_page",
        name: "公告",
        component: chain_message_page
      },
      {
      path: "/chain_supplier_page",
      name: "供应商",
      meta:{
        is_back:true
      },
      component: chain_supplier_page
    },
    
    {
      path: "/add_edit_supplier",
      name: "添加/编辑供应商",
      meta:{
        is_back:true
      },
      component: add_edit_supplier
    },
    {
      path: "/chain_supplier_detail",
      name: "供应商详情",
      meta:{
        is_back:true
      },
      component: chain_supplier_detail
    },
    {
      path: "/chain_permissions_page",
      name: "权限",
      component: chain_permissions_page
    },
    {
      path: "/chain_feekback_page",
      name: "反馈",
      component: chain_feekback_page
    },
    {
      path: "/setting_record_page",
      name: "操作日志",
      component: setting_record_page
    },
    ]
    },
    ],
  },
  ],
});

// router.beforeEach((to, from, next) => {
//   next();
// });

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
