import Vue from "vue";
import Router from "vue-router";

const tab_menu = (resolve) => require(["@/pages/tab_menu"], resolve);
const login = (resolve) => require(["@/pages/login"], resolve);
const index = (resolve) => require(["@/pages/Index/index"], resolve);
const notice_page = (resolve) => require(["@/pages/NoticePage/notice_page"], resolve);
const goods_detail = (resolve) => require(["@/pages/GoodsDetail/goods_detail"], resolve);
const selected = (resolve) => require(["@/pages/Selected/selected"], resolve);
const car_page = (resolve) => require(["@/pages/CarPage/car_page"], resolve);

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
      path: "/selected",
      name: "已选",
      component: selected
    },
    {
      path: "/car_page",
      name: "待选记录",
      component: car_page
    },
    ],
  },
  ],
});

router.beforeEach((to, from, next) => {
  //处理商品管理缓存
  if(to.path == '/chain_goods_page' && (from.path == '/edit_goods' || from.path == '/image_setting')){
    to.meta.use_cache = true;
  }else if(to.path == '/style_info' && (from.path == '/gys_edit_goods' || from.path == '/gys_image_setting')){
    to.meta.use_cache = true;
  }else{
    to.meta.use_cache = false;
  }
  next();
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
