<template>
	<div class="padding_page white_back" id="white_back">
		<div class="padding_page_content">
			<PageTitle title="选品详情"/>
			<div class="detail_content">
				<div class="detail_top_row">
					<!-- 主图部分 -->
					<MainImage :image_list="banner_list" v-if="over_loading"/>
					<!-- 商品信息 -->
					<GoodsInfo :goods_info="goods_info"/>
				</div>
				<div class="bottom_content">
					<TabDetail :goods_info="goods_info" v-if="over_loading"/>
				</div>
			</div>
			<CarWidget :is_fixed="true"/>
		</div>
	</div>
</template>
<script>
	import resource from '../../api/chain_resource.js'

	import PageTitle from '../../components/page_title.vue'
	import MainImage from './components/main_image.vue'
	import GoodsInfo from './components/goods_info.vue'
	import StoreInfo from './components/store_info.vue'
	import TabDetail from './components/tab_detail.vue'
	import CarWidget from '../../components/car_widget.vue'
	export default{
		data(){
			return{
				over_loading:false,	//是否加载完成
				style_id:"",		//商品ID
				goods_info:{},		//商品详情
				banner_list:[],		//所有图片列表
				active_index:0,		//详情或选中记录下标
			}
		},
		created(){
			this.style_id = this.$route.query.style_id;
			//获取商品详情
			this.getGoodsInfo();
		},
		
		computed:{
			//图片前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		methods:{
			//获取商品详情
			getGoodsInfo(){
				let arg = {
					style_id:this.style_id
				}
				resource.homeGoodsInfo(arg).then(res => {
					if(res.data.code == 1){
						this.goods_info = res.data.data;
						//处理banner图片
						let banner = this.goods_info.banner;
						let banner_list = [];
						banner.map((item,index) => {
							let img_obj = {
								url:this.domain + item,
								is_active:index == 0?true:false
							}
							banner_list.push(img_obj);
						})
						let newCardList = [];
						for (var i = 0; i < banner_list.length; i += 5) {
							newCardList.push(banner_list.slice(i, i + 5));
						}
						this.banner_list = newCardList;
						this.over_loading = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		components:{
			PageTitle,
			MainImage,
			GoodsInfo,
			StoreInfo,
			TabDetail,
			CarWidget
		}
	}
</script>
<style lang="less" scoped>
.white_back{
	background: #ffffff;
	overflow-y: scroll;
}
.padding_page_content{
	width: 1330rem;
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	.detail_content{
		flex:1;
		padding-left: 100rem;
		.detail_top_row{
			display: flex;
			justify-content: space-between;
		}
		.bottom_content{
			margin-top: 20rem;
			border:1px solid #E5E5E5;
		}
	}
}
.white_back::-webkit-scrollbar{display:none}
</style>
