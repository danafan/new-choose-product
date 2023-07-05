<template>
	<div class="goods_item">
		<div class="image_box" @click="getMoreImage" v-if="info.img != ''">
			<el-popover
			:open-delay="500"
			:close-delay="0"
			placement="right-start"
			trigger="hover"
			>
			<el-image class="popover_image" fit="scale-down" :src="domain + info.img"></el-image>
			<el-image class="goods_img" :src="domain + info.img" slot="reference" fit="scale-down"></el-image>
		</el-popover>
	</div>
	<img class="image_box" src="../static/load_failure.png" @click="getMoreImage" v-else>
	<div class="goods_info" @click="getDetail" @mousedown="mouseDownFn" @mouseup="mouseUpFn">
		<div class="flex ac jsb">
			<div class="title_name">{{info.title}}</div>
			<div class="title_name">{{info.style_name}}</div>
		</div>
		<div class="new_time_name mt-6">{{info.new_time_name}}</div>
		<div class="line mt-6 mb-6"></div>
		<div class="flex ac jsb">
			<div class="flex ac f12">
				<div class="dark">分销价：</div>
				<div class="primary_color">¥{{info.distribution_price}}</div>
			</div>
			<div class="flex ac f12">
				<div class="dark">控价：</div>
				<div class="primary_color">¥{{info.price_control}}</div>
			</div>
			<div class="flex ac f12">
				<div class="dark">建议售卖价：</div>
				<div class="primary_color">¥{{info.msrp}}</div>
			</div>
		</div>
		<div class="line mt-6 mb-6"></div>
		<div class="flex ac jsb">
			<div class="new_time_name">
				款号：{{info.sstyle_name}}
			</div>
			<div class="button_row">
				<div class="add" @click.stop="addCar(info.cost_price)" v-if="info.in_cart == 0">
					<img class="add_car" src="../static/add_car.png">
					<div>待选</div>
				</div>
				<div class="yjr" v-else @click.stop>已加入</div>
			</div>
		</div>
		<div class="line mt-6 mb-6"></div>
		<div class="flex ac">
			<div class="mr-10">浏览量：{{info.views_num}}</div>
			<div>销量：{{info.sales_num_all}}</div>
		</div>
	</div>
	<!-- 更多图片 -->
	<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="more_image_dialog">
		<div slot="title" class="dialog_title">
			<div>更多图片</div>
			<img class="close_icon" src="../static/close_icon.png" @click="more_image_dialog = false">
		</div>
		<div class="image_content">
			<div class="tab_row">
				<div class="tab_item" :class="{'active_tab_item':active_tab_index == index}" v-for="(item,index) in image_title_list" @click="active_tab_index = index">
					<div>{{item}}</div>
					<div class="active_line" v-if="active_tab_index == index"></div>
				</div>
			</div>
			<div class="source_url">拍摄风格：
				{{shooting_style_name}}
			</div>
			<div class="source_url">网盘地址：
				<el-button type="text" @click="windowOpen(net_disk_address)">{{or_net_disk_address}}</el-button>
			</div>
			<div class="more_image">
				<el-image :z-index="9009" class="more_image_item" :src="img_url" fit="scale-down" v-for="(img_url,i) in img_arr" :key="i" :preview-src-list="img_arr"></el-image>
			</div>
		</div>
		<div slot="footer" class="dialog_footer">
			<el-button type="primary" size="small" @click="more_image_dialog = false">关闭</el-button>
		</div>
	</el-dialog>
	
</div>
</template>
<style type="text/css">
	.popover_image{
		height: 400px!important;
		width: 400px!important;
	}
</style>
<style lang="less" scoped>
	.goods_item{
		margin-bottom: 20rem;
		border:1px solid #EDEDED;
		width: 265rem;
		cursor:pointer;
		.image_box{
			position: relative;
			width: 263rem;
			height: 263rem;
			display: flex;
			align-items: center;
			justify-content: center;
			.goods_img{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}
		.goods_info{
			padding: 8rem 10rem;
			.title_name{
				font-size:12rem;
				color: #333333;
				word-break: break-all;
				text-overflow: ellipsis;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.new_time_name{
				width: 70%;
				font-size:12rem;
				color: #999999;
				word-break: break-all;
				text-overflow: ellipsis;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.line{
				background:#F0F0F0;
				width: 100%;
				height: 1px;
			}
			.mr-10{
				margin-right: 10rem;
			}
			.mt-6{
				margin-top: 6rem;
			}
			.mb-6{
				margin-bottom: 6rem;
			}
			.primary_color{
				color: #F37605;
			}
			.button_row{
				display: flex;
				align-items: center;
				.add{
					border:1px solid var(--color);
					border-radius: 2rem;
					padding: 0 3rem;
					height: 20rem;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 12rem;
					color: var(--color);
					.add_car{
						margin-right: 4rem;
						width: 12rem;
						height: 12rem;
					}
				}
				.yjr{
					font-size: 12rem;
					color: #999999;
				}
				.xk{
					margin-left: 10rem;
					border-radius: 2rem;
					background: var(--color);
					padding: 0 3rem;
					height: 20rem;
					line-height: 20rem;
					font-size: 12rem;
					color: #ffffff;
				}
				.drak_back{
					background-color: #999999;
				}
			}
			.image_content{
				padding: 10rem 20rem;
				.tab_row{
					margin-bottom: 13rem;
					padding-left: 30rem;
					border-radius:2rem;
					border:1px solid #FFC998;
					background: #FFFCFA;
					width: 100%;
					height: 36rem;
					display: flex;
					.tab_item{
						margin-right: 68rem;
						position: relative;
						height: 36rem;
						display: flex;
						align-items: center;
						font-size:14rem;
						color:#333333;
						.active_line{
							background: #FFC998;
							position: absolute;
							left: 0;
							bottom:3rem;
							width: 100%;
							height: 1px;
						}
					}
					.active_tab_item{
						color: var(--color);
					}
				}
				.source_url{
					margin-bottom: 10rem;
					font-size:14rem;
					color: #333333;
					cursor: initial;
				}
				.more_image{
					display: flex;
					flex-wrap: wrap;
					.more_image_item{
						margin-right: 25rem;
						margin-bottom: 25rem;
						width: 220rem;
						height: 220rem;
					}
				}
			}
		}
	}
</style>
<script>
	import resource from '../api/resource.js'
	import commonResource from '../api/common_resource.js'
	export default{
		data(){
			return{
				more_image_dialog:false,		//更多图片
				image_title_list:['风格'],	//更多图片类型
				active_tab_index:0,		//选中的下标
				img_arr:[],				//风格图图片列表
				net_disk_address:"",	//网盘地址（跳转）
				or_net_disk_address:"",	//显示地址
				shooting_style_name:"",
				commodity_data:[],		//封面图数据
				commodity_url:"",		//封面图网盘地址(显示)
				commodity_open_url:"",	//封面图网盘地址（可跳转）
				firstTime: '', 			// mousedown的时间戳
				lastTime: '', 			// mouseup的时间戳
				isClick: false, 		// false--禁止点击，true--可点击
			}
		},
		props:{
			//单个商品
			info:{
				type:Object,
			default:{}
			}
		},
		watch:{
			active_tab_index:function(n,o){
				if(n == 0){
					//获取风格图
					this.getMoreImage();
				}else{
					//获取封面图
					this.moreImgCommodity();
				}
			}
		},
		computed:{
			//图片前缀
			domain(){
				return this.$store.state.domain;
			},
		},
		methods:{
			mouseDownFn () {
				this.firstTime = new Date().getTime();
			},
			mouseUpFn () {
				this.lastTime = new Date().getTime();
				if((this.lastTime - this.firstTime) < 200){
					this.isClick = true
				} else {
					this.isClick = false
				}
			},
			//获取风格图
			getMoreImage(){
				let arg = {
					style_id:this.info.style_id
				}
				resource.moreImgStyle(arg).then(res => {
					if(res.data.code == 1){
						let style_data = res.data.data;
						if(style_data.length == 0){
							this.$message.warning('没有更多图片!')
							return;
						}
						let img_arr = [];
						style_data.img.map(item => {
							img_arr.push(this.domain + item)
						})
						this.img_arr = img_arr;
						this.net_disk_address = style_data.net_disk_address;	//网盘地址（跳转）
						this.or_net_disk_address = style_data.or_net_disk_address;	//显示地址
						this.shooting_style_name = style_data.shooting_style_name;
						this.more_image_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})		
			},
			//获取封面图
			moreImgCommodity(){
				let arg = {
					style_id:this.info.style_id
				}
				resource.moreImgCommodity(arg).then(res => {
					if(res.data.code == 1){
						let commodity_data = res.data.data.img;
						let img_arr = [];
						commodity_data.map(item => {
							img_arr.push(this.domain + item);
						})
						this.commodity_data = img_arr;
						this.commodity_url = res.data.data.or_net_disk_address;
						this.commodity_open_url = res.data.data.net_disk_address;
						this.more_image_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击加入购物车
			addCar(cost_price){
				if(cost_price == ''){
					this.$message.warning('该商品没有成本价，不能加入待选！')
					return;
				}
				let arg = {
					style_id:this.info.style_id
				}
				resource.addSelectCart(arg).then(res => {
					if(res){
						this.$message.success(res.data.msg);
						this.$emit('setStatus',this.info.style_id)
						let arg = {
							type:'add',
							num:1
						}
						this.$store.commit('setCarGoods',arg);
					}
				})
			},
    		//点击跳转详情
			getDetail(){
				if(!this.isClick) return;
				let active_path = `/goods_detail?style_id=${this.info.style_id}`;
				const routeData = this.$router.resolve(active_path);
				window.open(routeData.href);
			},
    		//点击查看网盘
			windowOpen(url){
				if(!this.or_net_disk_address || this.or_net_disk_address.indexOf('https://pan.baidu.com') == -1){
					this.$message.warning('该地址不是网盘地址格式!')
				}else{
					window.open(url)
				}

			}
		}
	}
</script>







