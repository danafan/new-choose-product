<template>
	<div class="flex fc height-100" v-loading.fullscreen.lock="fullscreenLoading">
		<el-card class="form_card">
			<div class="up_down_row" :class="{'between':!is_up}">
				<div class="search_title" v-if="!is_up">查询条件</div>
				<div class="selected_right" @click="is_up = !is_up">
					<div>{{is_up?'收起':'展开'}}</div>
					<img class="down_arrow" :class="{'rotate':is_up == true}" src="../../../../static/down_arrow.png">
				</div>
			</div>
			<el-form style="margin-top: 10px;" :inline="true" size="mini" v-show="is_up">
				<el-form-item>
					<el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" placeholder="款号/款式编码" v-model="search">
					</el-input>
				</el-form-item>
				<el-form-item label="审核状态：">
					<el-select v-model="check_status" clearable filterable placeholder="全部">
						<el-option v-for="item in check_status_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上新日期：">
					<el-date-picker v-model="date" size="mini" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item class="form_item">
					<el-button type="primary" @click="checkPage(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card_box" id="card_box">
			<TableTitle title="数据列表" id="table_title">
				<el-button size="mini" type="primary" @click="allSetting(1)">批量上架</el-button>
				<el-button size="mini" type="primary" @click="allSetting(4)">批量下架</el-button>
				<!-- <el-button size="mini" type="primary" @click="auditFn('1')">批量同意</el-button>
					<el-button size="mini" type="primary" @click="auditFn('2')">批量拒绝</el-button> -->
					<el-button size="mini" type="primary" @click="exportFn">导出</el-button>
				</TableTitle>
				<el-table size="mini" :data="data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}" :max-height="max_height" @selection-change="handleSelectionChange" v-loading="loading">
					<el-table-column type="selection" width="55" fixed>
					</el-table-column>
					<el-table-column label="标题" prop="title"></el-table-column>
					<el-table-column label="款号" prop="style_name"></el-table-column>
					<el-table-column label="图片" width="150" >
						<template slot-scope="scope">
							<div v-if="scope.row.img.length == 0">暂无</div>
							<el-carousel trigger="hover" indicator-position="none" :autoplay="false" height="100px" v-if="scope.row.img.length > 0 && loading == false">
								<el-carousel-item v-for="(item,index) in scope.row.img" :key="index">
									<el-image :z-index="2006" class="image" :src="item" fit="scale-down" :preview-src-list="scope.row.img"></el-image>
								</el-carousel-item>
							</el-carousel>
						</template>
					</el-table-column>
					<el-table-column label="网盘地址">
						<template slot-scope="scope">
							<el-button class="pre_wrap" size="small" type="text" @click="windowOpen(scope.row.net_disk_address,scope.row.or_net_disk_address)" v-if="scope.row.or_net_disk_address !== ''">访问链接</el-button>
							<div v-else></div>
						</template>
					</el-table-column>
					<el-table-column label="供货价">
						<template slot-scope="scope">
							<div>¥{{scope.row.supply_price}}</div>
						</template>
					</el-table-column>
					<el-table-column label="分销价">
						<template slot-scope="scope">
							<div>¥{{scope.row.distribution_price}}</div>
						</template>
					</el-table-column>
					<el-table-column label="控价">
						<template slot-scope="scope">
							<div>¥{{scope.row.price_control}}</div>
						</template>
					</el-table-column>
					<el-table-column label="拍摄风格" prop="shooting_style"></el-table-column>
					<el-table-column label="类目" prop="category"></el-table-column>
					<el-table-column label="分类" prop="classification"></el-table-column>
					<el-table-column label="备注" prop="remark"></el-table-column>
					<el-table-column label="审核状态">
						<template slot-scope="scope">
							<div v-if="scope.row.check_status == 1">上架待审核</div>
							<div v-if="scope.row.check_status == 2">已上架</div>
							<div v-if="scope.row.check_status == 3">拒绝上架</div>
							<div v-if="scope.row.check_status == 4">下架待审核</div>
							<div v-if="scope.row.check_status == 5">已下架</div>
							<div v-if="scope.row.check_status == 6">拒绝下架</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" fixed="right">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="examEditGoods(scope.row.style_id)">审核</el-button>
						</template>
					</el-table-column>
				</el-table>
				<PaginationWidget id="bottom_row" :total="total" :page="page" :pagesize="100" @checkPage="checkPage"/>
			</el-card>
			<!-- 审核 -->
			<el-dialog :visible.sync="ae_dialog" :show-close="false" top="30px" width="65%">
				<div slot="title" class="dialog_title">
					<div>{{check_status == 1?'上架':'下架'}}待审核</div>
					<img class="close_icon" src="../../../../static/close_icon.png" @click="ae_dialog = false">
				</div>
				<div class="ae_box">
					<!-- 上面表单 -->
					<div class="flex jsb">
						<el-form size="mini" style="width: 50%;">
							<el-form-item label="商品款号：">
								<div class="info_value">{{ae_arg.style_name}}</div>
							</el-form-item>
							<el-form-item label="标题：">
								<div class="info_value">{{ae_arg.title}}</div>
							</el-form-item>
							<el-form-item label="类目：">
								<div class="info_value">{{ae_arg.category_id | categoryFilter(cate_list)}}</div>
							</el-form-item>
							<el-form-item label="分类：">
								<div class="info_value">{{ae_arg.classification_id | classFilter(class_list)}}</div>
							</el-form-item>
							<el-form-item label="面料：">
								<div class="info_value">{{ae_arg.fabric}}</div>
							</el-form-item>
							<el-form-item label="供应商：">
								<div class="info_value">{{ae_arg.supplier_id | supplierFilter(supplier_list)}}</div>
							</el-form-item>
							<el-form-item label="备注：">
								<div class="info_value">{{ae_arg.remark}}</div>
							</el-form-item>
						</el-form>
						<el-form size="mini" style="width: 50%;">
							<el-form-item label="建议零售价：">
								<div class="info_value">¥{{ae_arg.msrp}}</div>
							</el-form-item>
							<el-form-item label="控价：">
								<div class="info_value">¥{{ae_arg.price_control}}</div>
							</el-form-item>
							<el-form-item label="吊牌价：">
								<div class="info_value">¥{{ae_arg.tag_price}}</div>
							</el-form-item>
							<el-form-item label="结算价：">
								<div class="info_value">¥{{ae_arg.settlement_price}}</div>
							</el-form-item>
							<el-form-item label="供货价：">
								<div class="info_value">¥{{ae_arg.supply_price}}</div>
							</el-form-item>
							<el-form-item label="分销价：">
								<div class="info_value">¥{{ae_arg.distribution_price}}</div>
							</el-form-item>
							<el-form-item label="网盘地址：">
								<div class="info_value">{{ae_arg.net_disk_address}}</div>
							</el-form-item>
						</el-form>
					</div>
					<!-- 商品规格 -->
					<el-card class="goods_style_card">
						<div slot="header" class="clearfix">
							商品规格
						</div>
						<el-form size="mini">
							<el-form-item label="尺码：">
								<el-tag size="medium" :key="tag" v-for="tag in size_list">
									{{tag}}
								</el-tag>
							</el-form-item>
							<el-form-item label="颜色：">
								<el-tag size="medium" :key="tag" v-for="tag in color_list">
									{{tag}}
								</el-tag>
							</el-form-item>
						</el-form>
						<el-table size="mini" :data="size_color_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}" :max-height="240">
							<el-table-column label="颜色" prop="color" width="120"></el-table-column>
							<el-table-column label="尺码" prop="size" width="120"></el-table-column>
							<el-table-column label="SKU编码">
								<template slot-scope="scope">
									<div>{{scope.row.sku_code}}</div>
								</template>
							</el-table-column>
						</el-table>
					</el-card>
					<!-- 商品图 -->
					<el-card class="goods_style_card">
						<div slot="header" class="clearfix">
							<span>商品图</span>
						</div>
						<UploadFile :only_view="true" :img_list="goods_img_list"/>
					</el-card>
					<!-- 风格图 -->
					<el-card class="goods_style_card">
						<div slot="header" class="clearfix">
							<span>风格图</span>
						</div>
						<div>
							<div class="flex border_bottom">
								<div class="relative style_item flex pointer" :class="[{'active_item':active_style_index == index}]" :key="item.shooting_style_id" v-for="(item,index) in style_card_list" @click="checkStyleTab(index)">
									<div>{{item.shooting_style_name}}</div>
								</div>
							</div>
							<UploadFile v-if="style_card_list.length > 0" :img_list="style_card_list.length > 0?style_card_list[active_style_index].image_arr:[]" :only_view="true"/>
							</div>
						</el-card>
						<!-- 详情图 -->
						<el-card class="goods_style_card">
							<div slot="header" class="clearfix">
								<div class="flex jsb">
									<div>详情图</div>
									<el-popover placement="left-start" trigger="click">
										<div class="view_box flex fc">
											<el-image :src="item" fit="contain" v-for="item in detail_img_list"></el-image>
										</div>
										<el-button slot="reference" type="text" :disabled="detail_img_list.length == 0" size="mini">预览</el-button>
									</el-popover>
								</div>
							</div>
							<UploadFile :only_view="true" :img_list="detail_img_list"/>
						</el-card>
					</div>
					<div slot="footer" class="dialog_footer">
						<el-button size="small" @click="auditFn('2')">拒绝</el-button>
						<el-button size="small" type="primary" @click="auditFn('1')">同意</el-button>
					</div>
				</el-dialog>
			</div>
		</template>
		<style type="text/css">
			.goods_style_card .el-card__header{
				padding:10px 20px!important;
			}
			.goods_style_card .el-tag + .el-tag {
				margin-left: 10px;
			}
			.goods_style_card .button-new-tag {
				margin-left: 10px;
			}
			.goods_style_card .input-new-tag {
				width: 90px;
				margin-left: 10px;
				vertical-align: bottom;
			}
		</style>
		<style lang="less" scoped>
			.form_card{
				margin-bottom: 16rem;
				.up_down_row{
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.search_title{
						font-size: 14px;
						font-weight: bold;
					}
					.selected_right{
						display: flex;
						align-items: center;
						cursor: pointer;
						.down_arrow{
							margin-left: 5rem;
							transform: rotate(-90deg);
							width: 14rem;
							height: 8rem;
						}
						.rotate{
							transform: rotate(0deg);
						}
					}

				}
				.between{
					justify-content:space-between;
				}
				.form_item{
					margin-bottom:0 !important;
				}
			}
			.card_box{
				flex:1;
				.image{
					height: 100px;
				}
				.item_row{
					display: flex;
					.item_label{
						width: 56px;
						text-align:end;
					}
					.item_value{
						flex: 1;
					}
				}
			}
			.down_box{
				display:flex;
				padding:30rem;
				.upload_box{
					margin-left: 10px;
					position: relative;
					.upload_file{
						position: absolute;
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
						width: 100%;
						height: 100%;
						opacity: 0;
					}
				}
			}
			.ae_box{
				max-height: 960rem;
				padding:30rem;
				overflow-y: scroll;
			}
			.goods_style_card{
				margin-bottom: 15rem;
			}
			.style_item{
				border: 1px solid #DDDDDD;
				padding: 10rem 20rem;
				font-size: 14rem;
				color: #333333;
				position:relative;
				.delete_style_icon{
					position: absolute;
					top: 0;
					right: 0;
					width: 14rem;
					height: 14rem;
				}
				.add_style_icon{
					margin-right: 6rem;
					width: 14rem;
					height: 14rem;
				}
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
			.view_box{
				height: 360rem;
				overflow-y: scroll;
			}
			.info_value{
				display: initial;
				font-size: 13rem;
				color: #333333;
			}
		</style>
		<script>
			import commonResource from '../../../../api/common_resource.js'
			import resource from '../../../../api/chain_resource.js'
			import { getNowDate,getCurrentDate } from "../../../../api/date.js";

			import { exportPost } from "../../../../api/export.js";

			import { MessageBox, Message } from "element-ui";

			import TableTitle from '../../components/table_title.vue'
			import PaginationWidget from '../../../../components/pagination_widget.vue'
			import UploadFile from '../../../../components/upload_file.vue'
			export default{
				data(){
					return{
						is_up:false,
						loading:false,
					date:[],				//上新日期
					pickerOptions: {
						shortcuts: [
						{
							text: "今日上新",
							onClick(picker) {
								const start = getNowDate();
								const end = getNowDate();
								picker.$emit("pick", [start, end]);
							},
						},
						{
							text: "三日上新",
							onClick(picker) {
								const start = getCurrentDate(3);
								const end = getNowDate();
								picker.$emit("pick", [start, end]);
							},
						},
						{
							text: "七日上新",
							onClick(picker) {
								const start = getCurrentDate(7);
								const end = getNowDate();
								picker.$emit("pick", [start, end]);
							},
						},
						],
					}, 
					search:"",				//款式编码
					check_status_list:[{
						id:1,
						name:'上架待审核'
					},{
						id:4,
						name:'下架待审核'
					}],						//审核状态列表
					check_status:'',		//选中的审核状态
					supplier_list:[],		//供应商列表
					cate_list:[],			//类目列表
					market_list:[],			//市场列表
					class_list:[],			//分类列表
					max_height:0,	
					page:1,
					data:[],				//获取的数据
					total:0,
					button_list:{},
					multiple_selection:[],	//主表已选中的列表
					fullscreenLoading:false,
					style_id:"",				//点击的款式ID
					ae_dialog:false,			//添加或编辑弹窗
					check_status:"",			//当前选中的审核状态
					ae_arg:{
						style_name:"",
						title:"",
						category_id:"",
						classification_id:"",
						fabric:"",
						supplier_id:"",
						remark:"",
						msrp:"",
						price_control:"",
						tag_price:"",
						settlement_price:"",
						supply_price:"",
						distribution_price:"",
						net_disk_address:""
					},								//添加或编辑的内容
					size_list: [],					//已添加的尺码列表
					size_visible: false,			//是否展示添加尺码输入框
					size_value: '',					//输入的添加尺码的内容
					color_list: [],					//已添加的颜色列表
					color_visible: false,			//是否展示添加颜色输入框
					color_value: '',				//输入的添加颜色的内容
					size_color_data:[],				//尺码和颜色生成的表格数据
					goods_img_list:[],				//商品图列表
					detail_img_list:[],				//详情图列表
					style_card_list:[],				//风格列表
					selected_style:[],				//表格已选中的列表
					style_table_data:[],			//未选择的风格列表
					active_style_index:0,			//风格列表选中的下标
					show_style_upload:true,			//是否显示风格图图片组件
				}
			},
			created(){
				//获取供应商列表
				this.ajaxSupplierList();
    			//获取类目列表
				this.ajaxCateList();
    			//市场列表
				this.ajaxMarketList();
    			//分类列表
				this.ajaxClassList();
				this.supplier_ids = [];
				this.category_ids = [];
				this.market_ids = [];
				this.classification_ids = [];
				this.shooting_style_ids = [];
				this.date = [];
				this.search = "";
				this.page = 1;
				//获取列表
				this.getGoodsList();
			},
			mounted() {
    		//获取表格最大高度
				this.onResize();
				window.addEventListener("resize", this.onResize());
			},
			computed:{
			//图片前缀
				domain(){
					return this.$store.state.domain;
				}
			},
			watch:{
				search:function(){
				//获取表格最大高度
					this.onResize();
				},
				is_up:function(n,o){
    			//获取表格最大高度
					this.onResize();
				}
			},
			methods: {
    		//监听屏幕大小变化
				onResize() {
					this.$nextTick(() => {
						let card_box_height = document.getElementById("card_box").offsetHeight;
						let table_title_height = document.getElementById("table_title").offsetHeight;
						let bottom_row_height = document.getElementById("bottom_row").offsetHeight;
						this.max_height =
						card_box_height -
						table_title_height -
						bottom_row_height -
						60 +
						"px";
					});
				},
    		//获取供应商列表
				ajaxSupplierList(){
					commonResource.ajaxSupplierList().then(res => {
						if(res.data.code == 1){
							this.supplier_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				},
			//获取类目列表
				ajaxCateList(){
					commonResource.ajaxCateList().then(res => {
						if(res.data.code == 1){
							this.cate_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				},
			//市场列表
				ajaxMarketList(){
					commonResource.ajaxMarketList().then(res => {
						if(res.data.code == 1){
							this.market_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				},
			//分类列表
				ajaxClassList(){
					commonResource.ajaxClassList().then(res => {
						if(res.data.code == 1){
							this.class_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				},
				//审批前获取商品信息
				examEditGoods(style_id){
					this.style_id = style_id;
					resource.examEditGoods({style_id:this.style_id}).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							this.check_status = data.check_status;
							for(let k in this.ae_arg){
								this.ae_arg[k] = data[k];
							}
							this.size_color_data = data.sku.list;		//商品规格
							this.getSizeColorList();
							this.goods_img_list = data.img;				//商品图
							let style_imgs = data.style_imgs;			//风格图
							style_imgs.map(item => {
								item['image_arr'] = item.img;
								delete item.img;
							})
							this.style_card_list = style_imgs;
							this.detail_img_list = data.detail_imgs;	//详情图
							this.ae_dialog = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				},
				//根据列表获取上面尺码和颜色列表
				getSizeColorList(){
					let size_list = [];
					let color_list = [];
					this.size_color_data.map(item => {
						size_list.push(item.size);
						color_list.push(item.color);
					})
					this.size_list = Array.from(new Set(size_list));
					this.color_list = Array.from(new Set(color_list));
				},
				//点击切换已选的风格
				checkStyleTab(index){
					this.show_style_upload = false;
					this.active_style_index = index;
					this.$nextTick(()=>{
						this.show_style_upload = true;
					})
				},
			//审批
				auditFn(type){
					let arg = {
						type:type,
						id:this.style_id
					}
					if(type == '1'){
					this.$confirm('确认同意?', '提示', {		//同意
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						resource.auditGoods(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.ae_dialog = false;
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
				}else{						//拒绝
					this.$prompt('请输入拒绝原因', '拒绝', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({ value }) => {
						if(!value){
							this.$message.warning('请输入拒绝原因');
							return;
						}
						arg.refuse_reason = value;
						resource.auditGoods(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.ae_dialog = false;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
					});
				}
			},
			//批量操作
			allSetting(type){
				let title = "";			//提示标题
				let total_num = this.multiple_selection.length;	//选中的总数
				let unset_num = 0;	//不能操作的数量
				let style_id = [];
				if(total_num == 0){
					this.$message.warning('至少选择一条！');
					return;
				}

				title = type == 1?'确认上架？':'确认下架？'
				let current_arr = this.multiple_selection.filter(item => {
					return item.check_status == type;
				})
				if(current_arr.length == 0){
					this.$message.warning('没有符合操作条件的记录！');
					return;
				}
				current_arr.map(item => {
					style_id.push(item.style_id);
				})
				unset_num = total_num - current_arr.length;
				
				this.$confirm(`您选择了${total_num}项，其中不可操作${unset_num}项，${title}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						style_id:style_id.join(','),
						type:type == 4?0:1
					}
					resource.checkStatus(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getGoodsList();
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
			//导出
			exportFn() {
				MessageBox.confirm("确认导出?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
				.then(() => {
					let arg = {
						check_status:this.check_status,
						start_time:this.date && this.date.length > 0?this.date[0]:"",
						end_time:this.date && this.date.length > 0?this.date[1]:"",
					}
					let search = JSON.parse(JSON.stringify(this.search));
					if(search.indexOf("\n") > -1 || search.indexOf(" ") > -1 || search.indexOf("+") > -1){
						if (search.indexOf("\n") > -1) {
							search = search.replaceAll("\n", ",");
						}
						if (search.indexOf(" ") > -1) {
							search = search.replaceAll(" ", ",");
						}
						if (search.indexOf("+") > -1) {
							search = search.replaceAll("+", "%2B");
						}
					}
					
					arg.search = search;

					var arr = [];
					for(let k in arg){
						if(arg[k]){
							arr.push(`${k}=${arg[k]}`)
						}
					}

					let baseURL = `${location.origin}/api/productstyle/derivegetallproductstyle?${arr.join('&')}`
					window.open(baseURL)
				})
				.catch(() => {
					Message({
						type: "info",
						message: "取消导出",
					});
				});
			},
			//获取列表
			getGoodsList(){
				let arg = {
					check_status:this.check_status,
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:100
				}
				let search = JSON.parse(JSON.stringify(this.search));
				if(search.indexOf("\n") > -1 || search.indexOf(" ") > -1 || search.indexOf("+") > -1){
					if (search.indexOf("\n") > -1) {
						search = search.replaceAll("\n", ",");
					}
					if (search.indexOf(" ") > -1) {
						search = search.replaceAll(" ", ",");
					}
					if (search.indexOf("+") > -1) {
						search = search.replaceAll("+", "%2B");
					}
				}
				arg.search = search;

				this.loading = true;
				resource.auditGoodsList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.button_list = data.button_list;
						this.total = data.total;
						this.data = data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换页码
			checkPage(v){
				this.page = v;
				//获取列表
				this.getGoodsList();
			},
			//切换多选
			handleSelectionChange(val) {
				this.multiple_selection = val;
			},
			windowOpen(url,old_url){
				if(!old_url || old_url.indexOf('https://pan.baidu.com') == -1){
					this.$message.warning('该地址不是网盘地址格式!')
				}else{
					window.open(url)
				}
			},
		},
		filters:{
			//类目过滤
			categoryFilter:(v,cate_list) => {
				let arr = cate_list.filter(item => {
					return item.category_id == v;
				})
				return arr.length > 0?arr[0].category_name:'';
			},
			//分类过滤
			classFilter:(v,class_list) => {
				let arr = class_list.filter(item => {
					return item.classification_id == v;
				})
				return arr.length > 0?arr[0].classification_name:'';
			},
			//供应商过滤
			supplierFilter:(v,supplier_list) => {
				let arr = supplier_list.filter(item => {
					return item.supplier_id == v;
				})
				return arr.length > 0?arr[0].supplier_name:'';
			},
		},
		components:{
			TableTitle,
			PaginationWidget,
			UploadFile
		}
	}
</script>






