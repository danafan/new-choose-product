<template>
	<div>
		<div class="detail_title">SKU编码表</div>
		<div class="detail_box" >
			<el-table size="mini" :data="goods_info.sku" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}">
				<el-table-column prop="color" label="颜色" width="180"></el-table-column>
				<el-table-column prop="size" label="尺码" width="180"></el-table-column>
				<el-table-column prop="sku_code" label="SKU编码"></el-table-column>
			</el-table>
		</div>
		<div class="detail_title">商品风格图</div>
		<div class="detail_box">
			<div>
				<div class="flex border_bottom">
					<div class="relative style_item flex pointer" :class="[{'active_item':active_style_index == index}]" :key="item.shooting_style_id" v-for="(item,index) in style_card_list" @click="checkStyleTab(index)">
						<div>{{item.shooting_style_name}}</div>
					</div>
				</div>
				<UploadFile v-if="show_style_upload && style_card_list.length > 0" :img_list="style_card_list.length > 0?style_card_list[active_style_index].image_arr:[]" :only_view="true"/>
				</div>
			</div>
			<div class="detail_title">商品详情图</div>
			<div class="detail_box">
				<UploadFile :img_list="goods_info.detail_imgs
				" :only_view="true"/>
			</div>
		</div>
	</template>
	<script>
		import UploadFile from '../../../components/upload_file.vue'
		export default{
			data(){
				return{
					max_height:0,
					style_card_list:[],				//风格列表
					selected_style:[],				//表格已选中的列表
					style_table_data:[],			//未选择的风格列表
					active_style_index:0,			//风格列表选中的下标
					show_style_upload:true,			//是否显示风格图图片组件
				}
			},
			props:{
			// 商品详情
				goods_info:{
					type:Object,
				default:{}
				}
			},
			computed:{
			//图片前缀
				domain(){
					return this.$store.state.domain;
				}
			},
			created(){
			//设置默认元素
				this.setInfoFn();
			},
			mounted() {
    		//获取表格最大高度
				this.onResize();
				window.addEventListener("resize", this.onResize());
			},
			watch:{
			//切换风格
				active_style_index:function(n,o){
				//设置默认元素
					this.setInfoFn(n);
				}
			},
			methods:{
			//监听屏幕大小变化
				onResize() {
					this.$nextTick(() => {
						let white_back_height = document.documentElement.clientHeight;
						this.max_height =
						white_back_height - 150 + "px";
					});
				},
			//设置默认元素
				setInfoFn(){
					let style_imgs = this.goods_info.style_imgs;			//风格图
					style_imgs.map(item => {
						item['image_arr'] = item.img;
						delete item.img;
					})
					this.style_card_list = style_imgs;
					// let style_img = this.goods_info.style_img;
					// this.shooting_style_name = style_img.shooting_style_name;
					// let images = [];
					// if( this.goods_info.style_img.length == 0){
					// 	return;
					// }
					// style_img.img.map((item,index) => {
					// 	images.push(this.domain + item);
					// })
					// this.style_image_list = images;
				},
				//点击切换已选的风格
				checkStyleTab(index){
					this.show_style_upload = false;
					this.active_style_index = index;
					this.$nextTick(()=>{
						this.show_style_upload = true;
					})
				},
			//跳转
				windowOpen(link){
					window.open(link);
				}
			},
			components:{
				UploadFile
			}
		}
	</script>
	<style lang="less" scoped>
		.detail_title{
			border-bottom: 1px solid #E5E5E5;
			background: #F6F6F6;
			padding-left: 24rem;
			height: 32rem;
			line-height: 32rem;
			font-size:12rem;
			color: #333333;
		}
		.detail_box{
			padding-top: 30rem;
			padding-bottom: 30rem;
			padding-left: 30rem;
			padding-right: 30rem;
		}
		.style_item{
			border: 1px solid #DDDDDD;
			padding: 10rem 20rem;
			font-size: 14rem;
			color: #333333;
			position:relative;
		}
		.active_item{
			border: 1px solid #FFC998;
			background: #FFFCFA;
			color: #E47A1A;
		}
		.border_bottom{
			border-bottom:1px solid #DDDDDD;
			margin-bottom: 20px;
		}
	</style>











