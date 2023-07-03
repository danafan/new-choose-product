<template>
	<div class="padding_page">
		<div class="padding_page_content">
			<SearchWidget page_path="car_history" @callback="searchFn" placeholder="搜索款号"/>
			<PageTitle title="待选记录"/>
			<el-card class="card_box" id="card_box">
				<div class="all_title" id="all_title">待选（全部{{car_goods.length}}）</div>
				<el-table ref="multipleTable" size="mini" :data="car_goods" tooltip-effect="dark" style="width: 100%" @selection-change="changeSelected" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}" :max-height="max_height" v-loading="loading">
					<el-table-column type="selection" width="85" fixed="left" :selectable="setStatus">
					</el-table-column>
					<el-table-column label="图片" width="150">
						<template slot-scope="scope">
							<div class="sx" v-if="scope.row.status == 1">失效</div>
							<div v-else-if="scope.row.img.length == 0">暂无</div>
							<el-carousel trigger="hover" indicator-position="none" :autoplay="false" height="100px" v-else>
								<el-carousel-item v-for="item in scope.row.img" :key="item">
									<el-image :z-index="2006" class="image" :src="item" fit="scale-down" :preview-src-list="scope.row.img"></el-image>
								</el-carousel-item>
							</el-carousel>
						</template>
					</el-table-column>

					<el-table-column label="标题" prop="price" width="160">
						<template slot-scope="scope">
							<div class="record_title">{{scope.row.title}}</div>
						</template>
					</el-table-column>
					<el-table-column label="款号" prop="style_name"></el-table-column>
					<el-table-column label="拍摄风格" prop="shooting_style_name"></el-table-column>
					<el-table-column label="供货价" prop="supply_price">
						<template slot-scope="scope">
							<div>¥{{scope.row.supply_price}}</div>
						</template>
					</el-table-column>
					<el-table-column label="上新时间" prop="new_time_name" width="150">
					</el-table-column>
					<el-table-column label="操作" width="80" fixed="right">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="deleteFn('1',scope.row.select_cart_id)">移除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="bottom_row" id="bottom_row">
					<el-button size='mini' type="text" :disabled="selected_list.length == 0" @click="deleteFn('2')">移除</el-button>
					<div>已选 {{selected_list.length}} 件</div>
				</div>
			</el-card>
		</div>
	</div>
</template>
<script>
	import resource from '../../api/resource.js'
	import commonResource from '../../api/common_resource.js'

	import PageTitle from '../../components/page_title.vue'
	import SearchWidget from '../../components/search_widget.vue'
	export default{
		data(){
			return{
				search:"",
				loading:false,
				car_goods:[],				//购物车列表
				button_list:{},
				selected_list: [],			//已选中的列表
				max_height:0
				
			}
		},
		destroyed() {
			window.removeEventListener("resize", () => {});
		},
		created(){
			//获取购物车列表数量
			this.getCarList();
		},
		updated(){
			this.addTableIndex();
		},
		computed:{
			//图片前缀
			domain(){
				return this.$store.state.domain;
			},
			//去选中按钮是否可以点击
			disabled(){
				let disabled = false;
				let arr = this.selected_list.filter(item => {
					return item.cost_price == '';
				})
				disabled = arr.length > 0 || this.selected_list.length == 0;
				return disabled;
			},
			//确认选择按钮是否可点击
			confirmDisabled(){
				return this.shop_code.length == 0 || this.demand_type.length == 0 || this.send_type.length == 0 || this.is_loading;
			}
		},
		mounted() {
    		//获取表格最大高度
			this.onResize();
			window.addEventListener("resize", this.onResize());
		},
		methods: {
			//搜索
			searchFn(value){
				this.search = value;
				//获取购物车列表数量
				this.getCarList();
			},
			addTableIndex() {
				let table = document.querySelector(".el-table__body-wrapper");
				let tableSelect = table.getElementsByClassName(
					"el-table-column--selection"
					);

				var arr = Array.from(tableSelect);
				arr.forEach((item, index) => {
					if (item.childNodes.length == 2) {
						item.removeChild(item.lastChild);
					}
					let span = document.createElement("span");
					span.innerText = index + 1;
					item.appendChild(span);
				});
			},
    		//监听屏幕大小变化
			onResize() {
				this.$nextTick(() => {
					let card_box_height = document.getElementById("card_box").offsetHeight;
					let all_title_height = document.getElementById("all_title").offsetHeight;
					let bottom_row_height = document.getElementById("bottom_row").offsetHeight;
					this.max_height =
					card_box_height -
					all_title_height -
					bottom_row_height -
					30 +
					"px";
				});
			},
    		//获取购物车列表数量
			getCarList(){
				this.loading = true;
				resource.getCarList().then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.car_goods = res.data.data.data;
					}else{
						this.$message,warning(res.data.msg);
					}
				})
			},
    		//判断是否可以选中
			setStatus(row){
				if (row.status == '0') { 
					return true;  
				}else{
					return false;
				}
			},
			//切换选中
			changeSelected(val) {
				this.selected_list = val;
			},
			//点击删除
			deleteFn(type,style_id){
				this.$confirm('确认删除商品图?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//商品ID
					let style_id_arr = [];
					this.selected_list.map(item => {
						style_id_arr.push(item.select_cart_id);
					})
					let arg = {
						select_cart_id:type == '1'?style_id:style_id_arr.join(',')
					}
					resource.removeCarGoods(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getCarList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
		},
		components:{
			PageTitle,
			SearchWidget
		}
	}
</script>
<style lang="less" scoped>
	.padding_page_content{
		width: 1440rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		.card_box{
			flex:1;
			.all_title{
				padding-bottom: 8rem;
				font-size: 14rem;
				color: #333333;
			}
			.sx{
				background: #D8D8D8;
				border:1px solid #979797;
				width: 40px;
				text-align: center;
				height: 16px;
				line-height: 16px;
				border-radius: 8px;
				position: absolute;
				left: -12px;
				top: 45%;
				transform: translate(-50%,0);
				z-index: 999;
				font-size: 12px;
				color: #333333;
			}
			.image{
				width: 100px;
				height: 100px;
			}
			.item_row{
				display: flex;
				.item_label{
					width: 48px;
					text-align:end;
				}
			}
		}

		.record_title{
			font-size:12rem;
			color: var(--color);
		}
		.bottom_row{
			padding-top: 18rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
	.select_content{
		padding: 18rem 20rem;
		.info_title{
			margin-bottom: 14rem;
			font-size:14rem;
			color: #333333;
		}
		.form_box{
			display: flex;
			justify-content: space-between;
			.form_content{
				.form_item{
					margin-bottom: 20rem;
					display: flex;
					align-items: center;
					.lable{
						width: 80rem;
						font-size:14rem;
						color: #333333;
						span{
							color: red;
						}
					}
				}
			}
		}
	}
	.toast_content{
		padding: 10rem 20rem;
		.toast_text{
			margin-bottom: 15rem;
		}
	}
</style>