<template>
	<div class="chain_page_content">
		<el-card class="form_card">
			<el-form :inline="true" size="mini">
				<el-form-item label="供应商等级：">
					<el-select v-model="grade_list_ids" clearable multiple filterable collapse-tags placeholder="全部">
						<el-option v-for="item in grade_list" :key="item.grade_id" :label="item.grade_name" :value="item.grade_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提供拍照：">
					<el-select v-model="supply_photograph" clearable placeholder="全部">
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提供退货：">
					<el-select v-model="supply_return_goods" clearable placeholder="全部">
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提供换货：">
					<el-select v-model="supply_exchange_goods" clearable placeholder="全部">
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提供代发：">
					<el-select v-model="supply_replace_send" clearable placeholder="全部">
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提供入仓：">
					<el-select v-model="supply_warehousing" clearable placeholder="全部">
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="结算方式：">
					<el-select v-model="supply_monthly_settlement" clearable placeholder="全部">
						<el-option label="月结" :value="1"></el-option>
						<el-option label="现结" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="转正状态：">
					<el-select v-model="status" clearable placeholder="全部">
						<el-option label="已转正" :value="1"></el-option>
						<el-option label="未转正" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="form_item">
					<el-input clearable v-model="search" placeholder="搜索供应商、主营"></el-input>
				</el-form-item>
				<el-form-item class="form_item">
					<el-button type="primary" @click="checkPage(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card_box" id="card_box">
			<TableTitle title="数据列表" id="table_title">
					<el-button size="mini" type="primary" @click="addFn('1')">添加</el-button>
				</TableTitle>
				<el-table size="mini" :data="data.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}" :max-height="max_height" v-loading="loading">
					<el-table-column label="供应商名称" prop="supplier_name"></el-table-column>
					<el-table-column label="供应商编码" prop="grade_list_ids"></el-table-column>
					<el-table-column label="供应商地址" prop="address"></el-table-column>
					<el-table-column label="联系人" width="120" prop="contactor"></el-table-column>
					<el-table-column label="联系方式" width="120" prop="contact_information"></el-table-column>
					<el-table-column label="市场" prop="main_business"></el-table-column>
					<el-table-column label="主营" prop="main_business"></el-table-column>
					<el-table-column label="微信" prop="weixin"></el-table-column>
					<el-table-column label="拍照">
						<template slot-scope="scope">
							{{scope.row.supply_photograph == 1?'是':'否'}}
						</template>
					</el-table-column>
					<el-table-column label="退货">
						<template slot-scope="scope">
							{{scope.row.supply_return_goods == 1?'是':'否'}}
						</template>
					</el-table-column>
				<el-table-column label="代发">
					<template slot-scope="scope">
						{{scope.row.supply_replace_send == 1?'是':'否'}}
					</template>
				</el-table-column>
				<el-table-column label="入仓">
					<template slot-scope="scope">
						{{scope.row.supply_warehousing == 1?'是':'否'}}
					</template>
				</el-table-column>
				<el-table-column label="转正状态" prop="status"></el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="checkSupplierStatus(scope.row.supplier_id,scope.row.supplier_name,scope.row.status)">{{scope.row.status == '未转正'?'转正':'取消转正'}}</el-button>
						<el-button type="text" size="small" @click="getDetail(scope.row.supplier_id)" v-if="button_list.view == 1">查看</el-button>
						<el-button type="text" size="small" @click="addFn('2',scope.row.supplier_id)" v-if="button_list.edit == 1">编辑</el-button>
						<el-button type="text" size="small" @click="deleteFn(scope.row.supplier_id)" v-if="button_list.del == 1">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<PaginationWidget id="bottom_row" :total="data.total" :page="page" :pagesize="20" @checkPage="checkPage"/>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
	.chain_page_content{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 24rem;
		display: flex;
		flex-direction: column;
		.form_card{
			margin-bottom: 16rem;
			.form_item{
				margin-bottom:0 !important;
			}
		}
		.card_box{
			flex:1;
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
	}
</style>
<script>
	import { exportPost } from "../../../api/export.js";

	import { MessageBox, Message } from "element-ui";
	import resource from '../../../api/chain_resource.js'
	import commonResource from '../../../api/common_resource.js'

	import TableTitle from '../components/table_title.vue'
	import PaginationWidget from '../../../components/pagination_widget.vue'
	export default{
		data(){
			return{
				loading:false,
				search:"",				//供应商、主营
				supply_photograph:'',	//是否拍照
				supply_return_goods:'',	//是否退货
				supply_exchange_goods:'',//是否换货
				supply_replace_send:'',	//是否代发
				supply_warehousing:'',	//是否入仓
				supply_monthly_settlement:'',	//结算方式
				grade_list:[],			//供应商等级
				grade_list_ids:[],		//选中的供应商等级
				status:'',				//转正状态
				max_height:0,	
				page:1,
				data:{},				//获取的数据
				button_list:{},
			}
		},
		beforeRouteLeave(to,from,next){
			if(to.path == '/chain_supplier_detail' || to.path == '/add_edit_supplier'){	
				from.meta.use_cache = true;
			}else{
				from.meta.use_cache = false;
			}
			next();
		},
		activated(){
			console.log("asd")
			if(!this.$route.meta.use_cache){
				this.page = 1;
			}
			//供应商等级
			this.ajaxSupplierGradeList();
			//获取供应商列表
			this.supplierManagerList();
			this.$route.meta.use_cache = false;
		},
		destroyed() {
			window.removeEventListener("resize", () => {});
		},
		mounted() {
    		//获取表格最大高度
			this.onResize();
			window.addEventListener("resize", this.onResize());
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
			//供应商等级
			ajaxSupplierGradeList(){
				commonResource.ajaxSupplierGradeList().then(res => {
					if(res.data.code == 1){
						this.grade_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
    		//获取供应商列表
			supplierManagerList(){
				let arg = {
					search:this.search,
    				supply_photograph:this.supply_photograph,	//是否拍照
					supply_return_goods:this.supply_return_goods,	//是否退货
					supply_exchange_goods:this.supply_exchange_goods,//是否换货
					supply_replace_send:this.supply_replace_send,	//是否代发
					supply_warehousing:this.supply_warehousing,	//是否入仓
					supply_monthly_settlement:this.supply_monthly_settlement,	//结算方式
					grade_id:this.grade_list_ids.join(','),
					status:this.status,
					pagesize:20,
					page:this.page
				}
				this.loading = true;
				resource.supplierManagerList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.data = res.data.data;
						this.button_list =  res.data.data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换页码
			checkPage(v){
				this.page = v;
				//获取供应商列表
				this.supplierManagerList();
			},
			//切换供应商转正状态
			checkSupplierStatus(supplier_id,supplier_name,status){
				this.$confirm(`是否将供应商【${supplier_name}】${status == '转正'?'取消转正':'转正'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						supplier_id:supplier_id,
						status:status == '转正'?0:1
					}
					resource.editSupplierStatus(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取供应商列表
							this.supplierManagerList();
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
			//点击查看
			getDetail(supplier_id){
				this.$router.push(`/chain_supplier_detail?supplier_id=${supplier_id}`);
			},
			//点击添加或编辑
			addFn(type,supplier_id){
				if(type == '1'){
					this.$router.push('/add_edit_supplier?supplier_type=1')
				}else{
					this.$router.push(`/add_edit_supplier?supplier_type=2&supplier_id=${supplier_id}`);
				}
			},
			//点击删除
			deleteFn(supplier_id){
				this.$confirm('确认删除该供应商?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						supplier_id:supplier_id
					}
					resource.supplierManagerDel(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取供应商列表
							this.supplierManagerList();
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
			TableTitle,
			PaginationWidget
		}
	}
</script>






