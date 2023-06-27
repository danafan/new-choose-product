<template>
	<div>
		<div class="total_num">共有{{total_num}}件相关商品</div>
		<div class="selected_box" @click.stop="checkFn">
			<div class="selected_left">
				<div>已选条件</div>
				<div class="tj_row" v-if="category_index == 0 && class_index == 0 && style_index == 0">
					<img class="right_arrow" src="../static/down_arrow.png">
					<div>全部</div>
				</div>
				<div class="tj_row" v-else>
					<img class="right_arrow" src="../static/down_arrow.png" v-if="page_type == 'index'">
					<img class="right_arrow" src="../static/down_arrow.png">
					<div v-if="category_list.length > 0">类目（{{category_list[category_index].category_name}}）</div>
					<img class="right_arrow" src="../static/down_arrow.png">
					<div v-if="class_list.length > 0">分类（{{class_list[class_index].classification_name}}）</div>
					<img class="right_arrow" src="../static/down_arrow.png">
					<div v-if="style_list.length > 0">拍摄风格（{{style_list[style_index].shooting_style_name}}）</div>

					<img class="right_arrow" src="../static/down_arrow.png" v-if="page_type == 'index'">
					<div class="reset_button" @click.stop="resetFn">重置选择</div>
				</div>
			</div>
			<div class="selected_right">
				<div>{{screen_open?'收起':'展开'}}</div>
				<img class="down_arrow" :class="{'rotate':screen_open == true}" src="../static/down_arrow.png">
			</div>
		</div>
		<el-card class="conditions_box" v-if="screen_open">
			<div class="conditions_row">
				<div class="lable">类目：</div>
				<div class="list">
					<div class="item" :class="{'active_item':category_index == index}" v-for="(item,index) in category_list" @click.stop="checkIndex('category',index)">{{item.category_name}}</div>
				</div>
			</div>
			<div class="conditions_row">
				<div class="lable">分类：</div>
				<div class="list">
					<div class="item" :class="{'active_item':class_index == index}" v-for="(item,index) in class_list" @click.stop="checkIndex('class',index)">{{item.classification_name}}</div>
				</div>
			</div>
			<div class="conditions_row">
				<div class="lable">拍摄风格：</div>
				<div class="list">
					<div class="item" :class="{'active_item':style_index == index}" v-for="(item,index) in style_list" @click.stop="checkIndex('style',index)">{{item.shooting_style_name}}</div>
				</div>
			</div>
		</el-card>
		<div class="cate_box">
			<div class="sort_row">
				<div class="sort_item" :class="{'active_color':item.sort != 'default'}" v-for="(item,index) in sort_list" @click="sortFn(index)">
					<div>{{item.name}}</div>
					<img class="sort_icon" src="../static/sort_asc.png" v-if="item.sort == 'asc'">
					<img class="sort_icon" src="../static/sort_default.png" v-if="item.sort == 'default'">
					<img class="sort_icon" src="../static/sort_desc.png" v-if="item.sort == 'desc'">
				</div>
			</div>
			<div class="price_row" v-if="page_type != 'gys_supplier'">
				<div>价格：</div>
				<el-input style="width: 50px;" size="mini" type="number" v-model="start_price"></el-input>&nbsp~&nbsp
				<el-input style="width: 50px;" size="mini" type="number" v-model="end_price"></el-input>
				&nbsp
				<el-button size="mini" type="primary" @click="searchPrice">查询</el-button>
			</div>
			<div class="date_row">
				<el-date-picker v-model="date" size="mini" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="上新时间" end-placeholder="上新时间" @change="changeDate">
				</el-date-picker>
			</div>
			<el-checkbox-group v-model="up_type" @change="upTypeChange">
				<el-checkbox :label="1">今日上新</el-checkbox>
				<el-checkbox :label="3">三日上新</el-checkbox>
				<el-checkbox :label="7">七日上新</el-checkbox>
			</el-checkbox-group>
		</div>
	</div>
</template>
<script>
	import { getNowDate,getCurrentDate } from "../api/date.js";

	import commonResource from '../api/common_resource.js'

	import pinyin from '../../node_modules/js-pinyin/index.js'
	export default{
		data(){
			return{
				category_index:0,		//选中的类目下标
				category_list:[],		//类目列表
				class_index:0,			//选中的分类下标
				class_list:[],			//分类列表
				style_index:0,			//选中的拍摄风格下标
				style_list:[],			//拍摄风格列表
				sort_list:[{
					name:'销量',
					key:'sales',
					val:'sales_num_all',
					sort:'default'
				},{
					name:'浏览量',
					key:'views',
					val:'views_num',
					sort:'default'
				}],								//排序列表
				up_type:[],					//上新类型
				date:[],						//上新日期 
				start_price:"",
				end_price:"",
				open_more:false,		//是否更多
			}
		},
		props:{
			//index:首页；supplier:供应商；gys_supplier:供应商来源
			page_type:{
				type:String,
			default:"index"
			},
			//商品总数量
			total_num:{
				type:Number,
			default:0
			}
		},
		created(){
			//获取筛选条件列表
			this.getScreenList();
		},
		computed: {
			screen_open() {
				return this.$store.state.screen_open;
			},
		},
		methods:{
			//切换上新类型
			upTypeChange(value){
				if(this.up_type.length > 1){
					this.up_type.splice(0,1)
				}
				if(this.up_type.length > 0){
					switch(this.up_type[0]){
					case 1:
						this.date = [getNowDate(),getNowDate()];
						//获取当前条件并传递
						this.callbackFn();
						break;
					case 3:
						this.date = [getCurrentDate(3),getNowDate()];
						//获取当前条件并传递
						this.callbackFn();
						break;
					case 7:
						this.date = [getCurrentDate(7),getNowDate()];
						//获取当前条件并传递
						this.callbackFn();
						break;
					default:
						return
					}
				}else{
					this.date = [];
					//获取当前条件并传递
					this.callbackFn();
				}
			},
			//获取筛选条件列表
			getScreenList(){
				commonResource.getScreenList().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						
						let category_list = data.category;
						category_list.unshift({
							category_name:'全部',
							category_id:''
						})
						this.category_list = category_list;
						let class_list = data.classification;
						class_list.unshift({
							classification_name:'全部',
							classification_id:''
						})
						this.class_list = class_list;
						let style_list = data.shooting_style;
						style_list.unshift({
							shooting_style_name:'全部',
							shooting_style_id:''
						})
						this.style_list = style_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			resetFn(){
				this.category_index = 0;
				this.class_index = 0;
				this.style_index = 0;
				//获取当前条件并传递
				this.callbackFn();
			},
			//点击展开或收起
			checkFn(){
				this.$store.commit("setScreen", !this.screen_open);
			},
			// 切换下拉框筛选条件
			checkIndex(type,index){
				switch(type){
				case 'category':
					this.category_index = index;
					break;
				case 'class':
					this.class_index = index;
					break;
				case 'style':
					this.style_index = index;
					break;
				}
				//获取当前条件并传递
				this.callbackFn();
			},
			//点击切换排序条件
			sortFn(index){
				this.sort_list.map((item,i) => {
					if(index == i){
						switch(item.sort){
						case 'default':
							item.sort = 'desc';
							break;
						case 'desc':
							item.sort = 'default';
							break;
						}
					}else{
						item.sort = 'default';
					}
				})
				//获取当前条件并传递
				this.callbackFn();
			},
			//切换上新时间筛选器
			changeDate(){
				this.up_type = [];
				//获取当前条件并传递
				this.callbackFn();
			},
			//点击查询价格区间
			searchPrice(){
				if(this.start_price != '' && !this.isPrice.test(parseFloat(this.start_price))){
					this.$message.warning('价格必须大于0且最多两位小数');
					return;
				}else if(this.end_price != '' && !this.isPrice.test(parseFloat(this.end_price))){
					this.$message.warning('价格必须大于0且最多两位小数');
					return;
				}else if(parseFloat(this.start_price) > parseFloat(this.end_price)){
					this.$message.warning('起始价格不能高于结束金额');
					return;
				}
				//获取当前条件并传递
				this.callbackFn();
			},
			//获取当前条件并传递
			callbackFn(){	
				var arg = {
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:"",
					start_price:this.start_price?parseFloat(this.start_price):'',
					end_price:this.end_price?parseFloat(this.end_price):'',
				}

				//处理排序
				let sort_arr = this.sort_list.filter(item => {
					return item.sort != 'default';
				})
				if(sort_arr.length > 0){
					arg[sort_arr[0].key] = sort_arr[0].val + '-' + sort_arr[0].sort;
				}

				//处理款式分类
				if(this.page_type != 'gys_supplier'){
					arg.depth_inventory = this.cate_style_list[0].is_selected;
					arg.video_style = this.cate_style_list[1].is_selected;
					arg.hot_style = this.cate_style_list[2].is_selected;
					arg.data_style = this.cate_style_list[3].is_selected;
					arg.sole_style = this.cate_style_list[4].is_selected;
					arg.again_style = this.cate_style_list[5].is_selected;
				}
				//处理类目
				if(this.category_index > 0){
					arg.category_id = this.category_list[this.category_index].category_id;
				}
				//处理分类
				if(this.class_index > 0){
					arg.classification_id = this.class_list[this.class_index].classification_id;
				}
				//处理风格
				if(this.style_index > 0){
					arg.shooting_style_id = this.style_list[this.style_index].shooting_style_id;
				}
				this.$emit('callback',arg);
			}
		}
	}
</script>
<style lang="less" scoped>
	.total_num{
		margin-bottom: 10rem;
		text-align: end;
		font-size: 12rem;
		color: #666666;
	}
	.selected_box{
		border: 1px solid #E8E8E8;
		padding-left: 26rem;
		padding-right: 26rem;
		background: #F5F5F5;
		height: 26rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #666666;
		font-size: 12rem;
		.selected_left{
			display: flex;
			align-items: center;
			.tj_row{
				display: flex;
				align-items: center;
				.reset_button{
					cursor: pointer;
					margin-left: 30rem;
					border-radius: 10rem;
					border: 1px solid #F37605;
					width: 74rem;
					text-align: center;
					height: 22rem;
					line-height: 21rem;
					color: #F37605;
					font-size: 14rem;
				}
			}
			.right_arrow{
				margin-left: 5rem;
				margin-right: 5rem;
				transform: rotate(-90deg);
				width: 7rem;
				height: 4rem;
			}
		}
		.selected_right{
			display: flex;
			align-items: center;
			cursor:pointer;

		}
	}
	.down_arrow{
		margin-left: 5rem;
		transform: rotate(-90deg);
		width: 7rem;
		height: 4rem;
	}
	.more_arrow{
		margin-left: 5rem;
		width: 7rem;
		height: 4rem;
	}
	.rotate{
		transform: rotate(0deg);
	}
	.up_rotate{
		transform: rotate(180deg);
	}
	.conditions_box{
		background: #ffffff;
		font-size: 12rem;
		.conditions_row{
			border-bottom: 1px dashed #DEDEDE;
			display: flex;
			.lable{
				white-space:normal;
				width: 110rem;
				color: #999999;
			}
			.szm_row{
				display: flex;
				align-items: center;
				.szm_item{
					margin-right: 20px;
					font-size: 12px;
					cursor: pointer;
				}
				.active_index{
					font-weight: bold;
					color: var(--color);
				}
			}

			.list{
				flex:1;
				display: flex;
				flex-wrap: wrap;
				.item{
					cursor:pointer;
					padding: 4px 12px;
					color: #333333;
				}
				.item:hover{
					color:var(--color);
				}
				.active_item{
					color: var(--color);
				}
			}
			.supplier_list{
				max-height: 50px;
				overflow: hidden;
			}
			.more_text{
				font-size: 12px;
				color: #666666;
			}
		}
		.none_border{
			border:none;
		}
	}
	.cate_box{
		margin-top: 8rem;
		margin-bottom: 10rem;
		border:1px solid #E8E8E8;
		background: #F5F5F5;
		width: 100%;
		height: 40rem;
		padding-left: 26rem;
		padding-right: 26rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12rem;
		color: #666666;
		.sort_row{
			display: flex;
			align-items: center;
			.sort_item{
				border-left:1px solid #F5F5F5;
				border-right:1px solid #F5F5F5;
				height: 40rem;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 25rem;
				display: flex;
				align-items: center;
				padding-left: 3rem;
				padding-right: 3rem;
				cursor:pointer;
				.sort_icon{
					margin-left: 2rem;
					width: 9rem;
					height: 12rem;
				}
			}
			.sort_item:hover{
				border:1px solid #e8e8e8;
				background: #ffffff;
				color:var(--color);
			}
		}
		.style_row{
			display: flex;
			align-items: center;
			.style_item{
				border-left:1px solid #F5F5F5;
				border-right:1px solid #F5F5F5;
				height: 40rem;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 25rem;
				padding-left: 3rem;
				padding-right: 3rem;
				cursor:pointer;
			}
			.style_item:hover{
				border:1px solid #e8e8e8;
				background: #ffffff;
				color:var(--color);
			}
		}
		.price_row{
			display: flex;
			align-items: center;
		}
		.date_row{
			display: flex;
			align-items: center;
		}
		.active_color{
			border:1px solid #e8e8e8;
			background: #ffffff;
			color:var(--color);
		}
	}
</style>