<template>
	<div class="goods_info">
		<div class="goods_name">{{goods_info.title}}</div>
		<div class="info_content">
			<div class="content_row">
				<div class="row_lable">供货价</div>
				<div class="row_price">¥{{goods_info.cost_price}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">建议零售价</div>
				<div class="row_value">¥{{goods_info.cost_price}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">控价</div>
				<div class="row_value">¥{{goods_info.cost_price}}</div>
			</div>
			<!-- <div class="content_row" v-if="goods_info.supplier_ksbm != ''">
				<div class="row_lable">供应商款式编码</div>
				<div class="row_value">{{goods_info.supplier_ksbm}}</div>
			</div> -->
			<!-- <div class="content_row">
				<div class="row_lable">款式编码</div>
				<div class="row_value">{{goods_info.i_id}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">BD款式编码</div>
				<div class="row_value">{{goods_info.bd_i_id}}</div>
			</div> -->
			<div class="content_row">
				<div class="row_lable">款号</div>
				<div class="row_value">{{goods_info.style_name}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">类目</div>
				<div class="row_value">{{goods_info.category_name}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">分类</div>
				<div class="row_value">{{goods_info.classification_name}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">面料</div>
				<div class="row_value">{{goods_info.fabric}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">浏览量</div>
				<div class="row_value">{{goods_info.fabric}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">销量</div>
				<div class="row_value">{{goods_info.fabric}}</div>
			</div>
			<div class="content_row">
				<div class="row_lable">网盘地址</div>
				<div class="link" @click="windowOpen(goods_info.net_disk_address)">{{goods_info.or_net_disk_address}}</div>
			</div>
			<!-- <div class="content_row">
				<div class="row_lable">备注</div>
				<div class="row_value">{{goods_info.remark}}</div>
			</div> -->
		</div>
		<div class="button_row">
			<div class="button_item select" :class="{'drak_back':goods_info.cost_price == ''}" @click="downLoadFile">
				<div>下载数据包</div>
			</div>
			<div class="button_item add" @click="addCar">
				<img class="add_car" src="../../../static/add_car.png">
				<div>加入选中</div>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import commonResource from '../../../api/common_resource.js'
	export default{
		data(){
			return{
				
			}
		},
		props:{	
			//商品信息
			goods_info:{
				type:Object,
				default:{}
			},
		},
		computed:{
			//图片前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		methods:{
			//点击下载数据包
			downLoadFile(){

			},
			//点击加入购物车
			addCar(){
				if(this.goods_info.cost_price != ''){
					let arg = {
						style_id:this.goods_info.style_id
					}
					resource.addSelectCart(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							let arg = {
								type:'add',
								num:1
							}
							this.$store.commit('setCarGoods',arg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.$message.warning('该商品没有成本价,不能加入待选!')
				}
			},
			windowOpen(url){
				if(!this.goods_info.or_net_disk_address || this.goods_info.or_net_disk_address.indexOf('https://pan.baidu.com') == -1){
					this.$message.warning('该地址不是网盘地址格式!')
				}else{
					window.open(url)
				}
			}
		}
	}
</script>
<style lang="less" scoped>
.goods_info{
	width: 512rem;
	height: 546rem;
	display: flex;
	flex-direction: column;
	.goods_name{
		padding-bottom: 20rem;
		font-size: 16rem;
		color: #333333;
		font-weight: bold;
	}
	.info_content{
		flex:1;
		padding: 10rem 20rem;
		background: #FFF8F2;
		.content_row{
			margin-bottom: 16rem;
			display: flex;
			.row_lable{
				width: 135rem;
				font-size:12rem;
				color: #666666;
			}
			.row_price{
				color: var(--color);
				font-size:24rem;
				font-weight: 500;
			}
			.row_value{
				flex:1;
				font-size:12rem;
				color: #333333;
			}
			.link{
				cursor: pointer;
				flex:1;
				font-weight: bold;
				color: var(--color);
			}
		}
	}
	.button_row{
		height: 88rem;
		display: flex;
		align-items: center;
		.button_item{
			border:1px solid var(--color);
			border-radius: 4rem;
			width: 184rem;
			height: 42rem;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size:12rem;
			cursor:pointer;
			.add_car{
				margin-right: 8rem;
				width: 14rem;
				height: 14rem;
			}
		}
		.add{
			background: #FEEDDD;
			color: var(--color);
		}
		.select{
			margin-right: 22rem;
			background: var(--color);
			color: #ffffff;
		}
		.drak_back{
			border:1px solid #999999;
			background-color: #999999;
		}
	}
}
</style>