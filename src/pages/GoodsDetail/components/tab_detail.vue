<template>
	<div>
		<div class="detail_title">SKU编码表</div>
		<div class="detail_box" >
			<el-table size="mini" :data="sku_data" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}">
				<el-table-column prop="color" label="颜色" width="180"></el-table-column>
				<el-table-column prop="size" label="尺码" width="180"></el-table-column>
				<el-table-column prop="sku" label="SKU编码"></el-table-column>
			</el-table>
		</div>
		<div class="detail_title">商品风格图</div>
		<div class="detail_box">
			<!-- <el-image :z-index="2006" class="style_image" :src="item" fit="scale-down" :preview-src-list="style_image_list" v-for="item in style_image_list"></el-image>
				<div class="style_image" v-if="style_image_list.length%2 > 0"></div> -->
			</div>
			<div class="detail_title">商品详情图</div>
			<div class="detail_box">

			</div>
		</div>
	</template>
	<script>
		export default{
			data(){
				return{
					max_height:0,
					active_style_index:0,			//当前选中的风格下标
					shooting_style_name:"",
					style_image_list:[],			//图片列表
					sku_data:[{
						color:'黑色',
						size:'xl',
						sku:'23123'
					}]
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
					let style_img = this.goods_info.style_img;
					this.shooting_style_name = style_img.shooting_style_name;
					let images = [];
					if( this.goods_info.style_img.length == 0){
						return;
					}
					style_img.img.map((item,index) => {
						images.push(this.domain + item);
					})
					this.style_image_list = images;
				},
			//跳转
				windowOpen(link){
					window.open(link);
				}
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
	</style>











