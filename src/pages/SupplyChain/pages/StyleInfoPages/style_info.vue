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
				<el-form-item label="供应商：">
					<el-select v-model="supplier_ids" clearable multiple filterable collapse-tags placeholder="全部">
						<el-option v-for="item in supplier_list" :key="item.supplier_id" :label="item.supplier_name" :value="item.supplier_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类目：">
					<el-select v-model="category_ids" clearable multiple filterable collapse-tags placeholder="全部">
						<el-option v-for="item in cate_list" :key="item.category_id" :label="item.category_name" :value="item.category_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="拍摄风格：">
					<el-select v-model="shooting_style_ids" clearable multiple filterable collapse-tags placeholder="全部">
						<el-option v-for="item in style_list" :key="item.shooting_style_id" :label="item.shooting_style_name" :value="item.shooting_style_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="市场：">
					<el-select v-model="market_ids" clearable multiple filterable collapse-tags placeholder="全部">
						<el-option v-for="item in market_list" :key="item.market_id" :label="item.market_name" :value="item.market_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类：">
					<el-select v-model="classification_ids" clearable multiple filterable collapse-tags placeholder="全部">
						<el-option v-for="item in class_list" :key="item.classification_id" :label="item.classification_name" :value="item.classification_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上新日期：">
					<el-date-picker v-model="date" size="mini" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" placeholder="款号/款式编码" v-model="search">
					</el-input>
				</el-form-item>
				<el-form-item class="form_item">
					<el-button type="primary" @click="checkPage(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card_box" id="card_box">
			<TableTitle title="数据列表" id="table_title">
				<el-button size="mini" type="primary" @click="allSetting('1')" v-if="button_list.in_out == 1">批量上架</el-button>
				<el-button size="mini" type="primary" @click="allSetting('0')" v-if="button_list.in_out == 1">批量下架</el-button>
				<el-button size="mini" type="primary" @click="allSetting('3')" v-if="button_list.del == 1">批量删除</el-button>
				<el-button size="mini" type="primary" @click="importFn('2')" v-if="button_list.add == 1">导入</el-button>
				<el-button size="mini" type="primary" @click="exportFn">导出</el-button>
				<el-button size="mini" type="primary" @click="openForm('1')">添加</el-button>
			</TableTitle>
			<el-table size="mini" :data="data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}" :max-height="max_height" @selection-change="handleSelectionChange" v-loading="loading">
				<el-table-column type="selection" width="55" fixed>
				</el-table-column>
				<el-table-column label="标题" prop="title"></el-table-column>
				<el-table-column label="款号" prop="style_name"></el-table-column>
				<el-table-column label="图片" width="150" >
					<template slot-scope="scope">
						<div v-if="scope.row.images.length == 0">暂无</div>
						<el-carousel trigger="hover" indicator-position="none" :autoplay="false" height="100px" v-if="scope.row.images.length > 0 && loading == false">
							<el-carousel-item v-for="item in scope.row.images" :key="item">
								<el-image :z-index="2006" class="image" :src="item" fit="scale-down" :preview-src-list="scope.row.images"></el-image>
							</el-carousel-item>
						</el-carousel>
					</template>
				</el-table-column>
				<el-table-column label="供应商" prop="supplier"></el-table-column>
				<el-table-column label="网盘地址">
					<template slot-scope="scope">
						<el-button class="pre_wrap" size="small" type="text" @click="windowOpen(scope.row.net_disk_address,scope.row.or_net_disk_address)" v-if="scope.row.or_net_disk_address !== ''">访问链接</el-button>
						<div v-else></div>
					</template>
				</el-table-column>
				<el-table-column label="供货价" prop="cost_price" width="150">
					<template slot-scope="scope">
						<div>{{scope.row.price_status == '1'?'原成本价：':''}}{{scope.row.cost_price}}</div>
						<div v-if="scope.row.price_status == '1'">调后成本价：{{scope.row.edit_price}}</div>
					</template>
				</el-table-column>
				<el-table-column label="分销价" prop="cost_price" width="150">
					<template slot-scope="scope">
						<div>{{scope.row.price_status == '1'?'原成本价：':''}}{{scope.row.cost_price}}</div>
						<div v-if="scope.row.price_status == '1'">调后成本价：{{scope.row.edit_price}}</div>
					</template>
				</el-table-column>
				<el-table-column label="控价" prop="price_control"></el-table-column>
				<el-table-column label="颜色" prop="color"></el-table-column>
				<el-table-column label="尺码" prop="size"></el-table-column>
				<el-table-column label="面料" width="120" show-overflow-tooltip prop="fabric"></el-table-column>
				<el-table-column label="类目" prop="category"></el-table-column>
				<el-table-column label="上新时间" width="160" prop="new_time_name"></el-table-column>
				<el-table-column label="备注" prop="remark"></el-table-column>
				<el-table-column label="审核状态" prop="common_text">
					<template slot-scope="scope">
						<div v-if="scope.row.check_status == 1">上架待审核</div>
						<div v-if="scope.row.check_status == 2">已上架</div>
						<div v-if="scope.row.check_status == 3">拒绝上架</div>
						<div v-if="scope.row.check_status == 4">下架待审核</div>
						<div v-if="scope.row.check_status == 5">已下架</div>
						<div v-if="scope.row.check_status == 6">拒绝下架</div>
					</template>
				</el-table-column>
				<!-- <el-table-column label="款式编码" width="140">
					<template slot-scope="scope">
						<div class="item_row" v-if="scope.row.new_supplier_ksbm">
							<div class="item_label">供应商：</div>
							<div class="item_value">
								<div v-for="item in scope.row.new_supplier_ksbm">{{item}}</div>
							</div>
						</div>
						<div class="item_row" v-if="scope.row.new_i_id">
							<div class="item_label">普通：</div>
							<div class="item_value">
								<div v-for="item in scope.row.new_i_id">{{item}}</div>
							</div>
						</div>
						<div class="item_row" v-if="scope.row.new_bd_i_id">
							<div class="item_label">BD：</div>
							<div class="item_value">
								<div v-for="item in scope.row.new_bd_i_id">{{item}}</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="市场" prop="market"></el-table-column>
				<el-table-column label="是否对接推单" width="100">
					<template slot-scope="scope">
						<div>{{scope.row.abutment_type == 1?'是':'否'}}</div>
					</template>
				</el-table-column>
				<el-table-column label="提供拍照" prop="common_text">
					<template slot-scope="scope">
						<div>{{scope.row.photograph == 1?'是':'否'}}</div>
					</template>
				</el-table-column>
				<el-table-column label="拍摄风格" prop="shooting_style"></el-table-column>
				<el-table-column label="分类" prop="classification"></el-table-column>
				<el-table-column label="合作模式" prop="mode"></el-table-column> -->
				<el-table-column label="操作" width="180" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-if="(scope.row.check_status == 2 || scope.row.check_status == 5 || scope.row.check_status == 6) && button_list.in_out == 1" @click="checkStatus(scope.row.style_id,scope.row.check_status)">{{scope.row.check_status == 2 || scope.row.check_status == 6?'下架':'上架'}}</el-button>
						<el-button style="margin-right: 10px" type="text" size="small" v-if="scope.row.check_status != 3 && scope.row.check_status != 5 && button_list.edit == 1" @click="openForm('2')">编辑</el-button>
						<el-button type="text" size="small" v-if="(scope.row.check_status == 3 || scope.row.check_status == 5) && button_list.reset == 1" @click="$router.push('/edit_goods?page_type=goods&goods_type=5&style_id=' + scope.row.style_id)">重新提交</el-button>
						<el-dropdown style="margin-left: 10px;" size="small" @command="handleCommand($event,scope.row.style_id,scope.row.style_id,scope.row.style_name)" v-if="scope.row.check_status != 1 && scope.row.check_status != 4 && (button_list.info == 1 || button_list.del == 1)">
							<el-button type="text" size="small">
								更多<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="1" v-if="button_list.info == 1">查看</el-dropdown-item>
								<el-dropdown-item command="2" v-if="scope.row.check_status == 2 || scope.row.check_status == 6">图片管理</el-dropdown-item>
								<el-dropdown-item command="3" v-if="(scope.row.check_status == 3 || scope.row.check_status == 5) && button_list.del == 1">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<PaginationWidget id="bottom_row" :total="total" :page="page" :pagesize="100" @checkPage="checkPage"/>
		</el-card>
		<!-- 导入 -->
		<el-dialog :visible.sync="import_dialog" width="30%">
			<div slot="title" class="dialog_title">
				<div>导入</div>
				<img class="close_icon" src="../../../../static/close_icon.png" @click="import_dialog = false">
			</div>
			<div class="down_box">
				<el-button type="primary" plain size="small" @click="downTemplate">下载模版<i class="el-icon-download el-icon--right"></i></el-button>
				<div class="upload_box">
					<el-button type="primary" size="small">
						导入
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
				</div>
			</div>
			<div slot="footer" class="dialog_footer">
				<el-button size="small" @click="import_dialog = false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 添加或编辑 -->
		<el-dialog :visible.sync="ae_dialog" :show-close="false" top="30px" width="65%">
			<div slot="title" class="dialog_title">
				<div>{{dialog_type == '1'?'添加':' 编辑'}}</div>
				<img class="close_icon" src="../../../../static/close_icon.png" @click="ae_dialog = false">
			</div>
			<div class="ae_box">
				<!-- 上面表单 -->
				<div class="flex jsb">
					<el-form size="mini" style="width: 50%;">
						<el-form-item label="商品款号：" required>
							<el-input placeholder="款号" style="width: 172px;" v-model="ae_arg.style_name">
							</el-input>
						</el-form-item>
						<el-form-item label="标题：">
							<el-input placeholder="标题" style="width: 172px;" v-model="ae_arg.title">
							</el-input>
						</el-form-item>
						<el-form-item label="类目：">
							<el-select v-model="ae_arg.category_id" clearable filterable placeholder="全部">
								<el-option v-for="item in cate_list" :key="item.category_id" :label="item.category_name" :value="item.category_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="分类：">
							<el-select v-model="ae_arg.classification_id" clearable filterable placeholder="全部">
								<el-option v-for="item in class_list" :key="item.classification_id" :label="item.classification_name" :value="item.classification_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="面料：">
							<el-input placeholder="面料" style="width: 172px;" v-model="ae_arg.fabric">
							</el-input>
						</el-form-item>
						<el-form-item label="供应商：" required>
							<el-select v-model="ae_arg.supplier_id" clearable filterable placeholder="全部">
								<el-option v-for="item in supplier_list" :key="item.supplier_id" :label="item.supplier_name" :value="item.supplier_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注：">
							<el-input type="textarea" style="width: 172px;" :autosize="{ minRows: 1, maxRows: 4}" placeholder="备注" v-model="ae_arg.remark">
							</el-input>
						</el-form-item>
					</el-form>
					<el-form size="mini" style="width: 50%;">
						<el-form-item label="建议零售价：">
							<el-input placeholder="建议零售价" type="number" style="width: 172px;" v-model="ae_arg.msrp">
							</el-input>
						</el-form-item>
						<el-form-item label="控价：" required>
							<el-input placeholder="控价" type="number" style="width: 172px;" v-model="ae_arg.price_control">
							</el-input>
							<el-tooltip class="item" effect="dark" content="默认结算价的1.8倍" placement="right">
								<i class="el-icon-question" style="margin-left: 5px;"></i>
							</el-tooltip>
						</el-form-item>
						<el-form-item label="吊牌价：">
							<el-input placeholder="吊牌价" type="number" style="width: 172px;" v-model="ae_arg.tag_price">
							</el-input>
						</el-form-item>
						<el-form-item label="结算价：" required>
							<el-input placeholder="结算价" type="number" style="width: 172px;" v-model="ae_arg.settlement_price">
							</el-input>
							<el-tooltip class="item" effect="dark" content="供应商实际结算的价格" placement="right">
								<i class="el-icon-question" style="margin-left: 5px;"></i>
							</el-tooltip>
						</el-form-item>
						<el-form-item label="供货价：">
							<el-input placeholder="供货价" type="number" style="width: 172px;" v-model="ae_arg.supply_price">
							</el-input>
							<el-tooltip class="item" effect="dark" content="批价 供应商的采购价默认聚水潭接口取的采购价" placement="right">
								<i class="el-icon-question" style="margin-left: 5px;"></i>
							</el-tooltip>
						</el-form-item>
						<el-form-item label="分销价：">
							<el-input placeholder="分销价" type="number" style="width: 172px;" v-model="ae_arg.distribution_price">
							</el-input>
							<el-tooltip class="item" effect="dark" content="该款跟合作商家结算的价格" placement="right">
								<i class="el-icon-question" style="margin-left: 5px;"></i>
							</el-tooltip>
						</el-form-item>
						<el-form-item label="网盘地址：">
							<el-input placeholder="网盘地址" style="width: 172px;" v-model="ae_arg.net_disk_address">
							</el-input>
						</el-form-item>
					</el-form>
				</div>
				<!-- 商品规格 -->
				<el-card class="goods_style_card">
					<div slot="header" class="clearfix">
						<span>商品规格</span>
					</div>
					<el-form size="mini">
						<el-form-item label="尺码：">
							<el-tag size="medium" :key="tag" v-for="tag in size_list" closable @close="sizeClose(tag)">
								{{tag}}
							</el-tag>
							<el-input class="input-new-tag" v-if="size_visible" v-model="size_value" ref="sizeTagInput" size="mini" @keyup.enter.native="sizeInputConfirm" @blur="sizeInputConfirm">
							</el-input>
							<el-button v-else class="button-new-tag" size="mini" @click="addSize">+添加</el-button>
						</el-form-item>
						<el-form-item label="颜色：">
							<el-tag size="medium" :key="tag" v-for="tag in color_list" closable @close="colorClose(tag)">
								{{tag}}
							</el-tag>
							<el-input class="input-new-tag" v-if="color_visible" v-model="color_value" ref="colorTagInput" size="mini" @keyup.enter.native="colorInputConfirm" @blur="colorInputConfirm">
							</el-input>
							<el-button v-else class="button-new-tag" size="mini" @click="addColor">+添加</el-button>
						</el-form-item>
					</el-form>
					<el-table size="mini" :data="size_color_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}" :max-height="240">
						<el-table-column label="颜色" prop="color" width="120"></el-table-column>
						<el-table-column label="尺码" prop="size" width="120"></el-table-column>
						<el-table-column label="SKU编码">
							<template slot-scope="scope">
								<el-input size="small" placeholder="SKU款式编码不能重复" v-model="scope.row.sku_code">
								</el-input>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="deleteRow(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
				<!-- 商品图 -->
				<el-card class="goods_style_card">
					<div slot="header" class="clearfix">
						<span>商品图</span>
					</div>
					<UploadFile :is_multiple="true" :max_num="6" :current_num="goods_img_list.length" :img_list="goods_img_list" @callbackFn="goodsImgCallBackFn"/>
				</el-card>
				<!-- 风格图 -->
				<el-card class="goods_style_card">
					<div slot="header" class="clearfix">
						<span>风格图</span>
					</div>
					<div>
						<div class="flex border_bottom">
							<div class="relative style_item flex" :class="[{'active_item':active_style_index == index}]" v-for="(item,index) in style_card_list">
								<img class="delete_style_icon" src="../../../../static/delete_style_icon.png" @click="import_dialog = false">
								<div>{{item.shooting_style_name}}</div>
							</div>
							<el-popover placement="right-start" width="400" trigger="click">
								<div>
									<div style="margin-bottom: 10px;">选择风格</div>
									<el-table size="mini" :data="style_table_data" :max-height="240" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" :cell-style="{'text-align':'center'}" @selection-change="styleChange">
										<el-table-column type="selection" width="55" fixed>
										</el-table-column>
										<el-table-column label="风格" prop="shooting_style_name">
										</el-table-column>
									</el-table>
									<div class="dialog_footer">
										<el-button size="small" type="primary" @click="setStyleFn">保存</el-button>
									</div>
								</div>
								<div class="style_item flex ac pointer" slot="reference">
									<img class="add_style_icon" src="../../../../static/add_style_icon.png" @click="import_dialog = false">
									<div>新增</div>
								</div>
							</el-popover>
							
						</div>
					</div>
				</el-card>
				<!-- 详情图 -->
				<el-card class="goods_style_card">
					<div slot="header" class="clearfix">
						<span>详情图</span>
					</div>
					<UploadFile :is_multiple="true" :max_num="6" :current_num="detail_img_list.length" :img_list="detail_img_list" @callbackFn="detailImgCallBackFn"/>
				</el-card>
			</div>
			<div slot="footer" class="dialog_footer">
				<el-button size="small" @click="ae_dialog = false">取消</el-button>
				<el-button size="small" type="primary" @click="saveAeFn">保存</el-button>
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
	}
	// .border_all{
	// 	border-top:1px solid #DDDDDD;
	// 	border-right:1px solid #DDDDDD;
	// }
	// .border_left{
	// 	border-left:1px solid #DDDDDD;
	// }
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
				supplier_list:[],		//供应商列表
				supplier_ids:[],		//选中的供应商
				cate_list:[],			//类目列表
				category_ids:[],		//选中的类目
				market_list:[],			//市场列表
				market_ids:[],			//选中的市场
				style_list:[],			//拍摄风格列表
				shooting_style_ids:[],	//选中的拍摄风格
				class_list:[],			//分类列表
				classification_ids:[],	//选中的分类
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
				max_height:0,	
				page:1,
				data:[],				//获取的数据
				total:0,
				button_list:{},
				import_dialog:false,	//导入或批量修改弹窗
				import_type:"1",		//导入弹窗类型
				multiple_selection:[],
				fullscreenLoading:false,
				style_id:"",				//点击的款式ID
				dialog_type:'',				//1:添加；2:编辑
				ae_dialog:false,			//添加或编辑弹窗
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
				style_card_list:[],								//风格列表
				selected_style:[],				//表格已选中的列表
				style_table_data:[],			//未选择的风格列表
				active_style_index:0,			//风格列表选中的下标
			}
		},
		created(){
			//获取供应商列表
			this.ajaxSupplierList();
    		//获取类目列表
			this.ajaxCateList();
    		//市场列表
			this.ajaxMarketList();
    		//拍摄风格列表
			this.ajaxStyleList();
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
			//拍摄风格列表
			ajaxStyleList(){
				commonResource.ajaxStyleList().then(res => {
					if(res.data.code == 1){
						this.style_list = res.data.data;
						this.style_table_data = this.style_list;
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
			//点击添加或编辑
			openForm(type){
				this.dialog_type = type;
				this.ae_dialog = true;
			},
			//删除已添加的尺寸
			sizeClose(tag) {
				this.size_list.splice(this.size_list.indexOf(tag), 1);
				//根据颜色和尺码生成表格
				this.setSizeColorTable();
			},
			//点击添加尺寸
			addSize() {
				this.size_visible = true;
				this.$nextTick(_ => {
					this.$refs.sizeTagInput.$refs.input.focus();
				});
			},
			//回车或失去焦点追加尺寸
			sizeInputConfirm() {
				let size_value = this.size_value;
				if (size_value) {
					this.size_list.push(size_value);
				}
				this.size_visible = false;
				this.size_value = '';
				//根据颜色和尺码生成表格
				this.setSizeColorTable();
			},
			//删除已添加的颜色
			colorClose(tag) {
				this.color_list.splice(this.color_list.indexOf(tag), 1);
				//根据颜色和尺码生成表格
				this.setSizeColorTable();
			},
			//点击添加颜色
			addColor() {
				this.color_visible = true;
				this.$nextTick(_ => {
					this.$refs.colorTagInput.$refs.input.focus();
				});
			},
			//回车或失去焦点追加颜色
			colorInputConfirm() {
				let color_value = this.color_value;
				if (color_value) {
					this.color_list.push(color_value);
				}
				this.color_visible = false;
				this.color_value = '';
				//根据颜色和尺码生成表格
				this.setSizeColorTable();
			},
			//根据颜色和尺码生成表格
			setSizeColorTable(){
				this.size_color_data = [];
				this.size_list.map(size => {
					this.color_list.map(color => {
						let table_row = {
							size:size,
							color:color,
							sku_code:""
						}
						this.size_color_data.push(table_row);
					})
				})
			},
			//删除某行
			deleteRow(index){
				this.size_color_data.splice(index,1);
				//根据列表获取上面尺码和颜色列表
				this.getSizeColorList();
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
			//监听商品图列表回调
			goodsImgCallBackFn(img_arr) {
				this.goods_img_list = img_arr;
			},
			//监听详情图列表回调
			detailImgCallBackFn(img_arr){
				this.detail_img_list = img_arr;
			},
			//切换商品风格添加表格切换多选
			styleChange(val){
				this.selected_style = val;
			},
			//确认商品风格添加表格切换多选
			setStyleFn(){
				this.selected_style.map(item => {
					item['image_arr'] = [];
					this.style_card_list.push(item);
				})
			},
			//点击添加或编辑的保存
			saveAeFn(){
				if(this.ae_arg.style_name == ''){
					this.$message.warning('请输入商品款号！');
				}else if(this.ae_arg.supplier_id == ''){
					this.$message.warning('请选择供应商！');
				}else if(this.ae_arg.price_control == ''){
					this.$message.warning('请输入控价！');
				}else if(this.ae_arg.settlement_price == ''){
					this.$message.warning('请输入结算价！');
				}else if(this.size_color_data.length == 0){
					this.$message.warning('商品规格不能为空！');
				}else{
					//处理商品规格
					let sku_null_arr = this.size_color_data.filter(item => {
						return item.sku_code == '';
					})
					if(sku_null_arr.length > 0){
						this.$message.warning('商品规格SKU编码不能存在空白项！');
						return;
					}

					let sku_list_arr = [];
					this.size_color_data.map(item => {
						sku_list_arr.push(`color-${item.color}_size-${item.size}_skucode-${item.sku_code}`)
					})
					console.log(sku_list_arr)
					
				}
			},
			//点击批量编辑或导入
			importFn(type){
				this.import_type = type;
				this.import_dialog = true;
			},
			//下载模版
			downTemplate(){
				if(this.import_type == '1'){
					window.open(`${this.downLoadUrl}/file/批量更新款式编码模板.xlsx`);
				}else{
					window.open(`${this.downLoadUrl}/file/商品批量导入模板.xlsx`);
				}
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					this.fullscreenLoading = true;
					if(this.import_type == '1'){	//批量修改
						resource.editGoodsIid({file:files[0]}).then(res => {
							this.$refs.csvUpload.value = null;
							this.import_dialog = false;
							this.fullscreenLoading = false;
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.page = 1;
								//获取列表
								this.getGoodsList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{	//导入
						resource.addAllProductStyle({file:files[0]}).then(res => {
							this.$refs.csvUpload.value = null;
							this.import_dialog = false;
							this.fullscreenLoading = false;
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.page = 1;
								//获取列表
								this.getGoodsList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}
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
						supplier_id:this.supplier_ids.join(','),
						category_id:this.category_ids.join(','),
						market_id:this.market_ids.join(','),
						classification_id:this.classification_ids.join(','),
						shooting_id:this.shooting_style_ids.join(','),
						start_time:this.date && this.date.length > 0?this.date[0]:"",
						end_time:this.date && this.date.length > 0?this.date[1]:""
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
					supplier_id:this.supplier_ids.join(','),
					category_id:this.category_ids.join(','),
					market_id:this.market_ids.join(','),
					classification_id:this.classification_ids.join(','),
					shooting_id:this.shooting_style_ids.join(','),
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
				resource.getGoodsList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.button_list = res.data.data.button_list;
						this.total = res.data.data.total;
						let data = res.data.data.data;
						data.map(item => {
							let images = [];
							item.img.map(i => {
								images.push(this.domain + i);
							})
							item.images = images;
							if(item.i_id){
								item.new_i_id = item.i_id.split(',')
							}
							if(item.bd_i_id){
								item.new_bd_i_id = item.bd_i_id.split(',')
							}
							if(item.supplier_ksbm){
								item.new_supplier_ksbm = item.supplier_ksbm.split(',')
							}
						})
						this.data = data;
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

				if(type == '0'){	//下架
					title = '确认下架？'
					let unset_list = this.multiple_selection.filter(item => {
						return item.check_status == 2 || item.check_status == 6;
					})
					unset_list.map(item => {
						style_id.push(item.style_id)
					})
					unset_num = total_num - unset_list.length;
				}else if(type == '1'){	//上架
					title = '确认上架？'
					let unset_list = this.multiple_selection.filter(item => {
						return item.check_status == 5;
					})
					unset_list.map(item => {
						style_id.push(item.style_id)
					})
					unset_num = total_num - unset_list.length;
				}else if(type == '3'){	//删除
					title = '确认批量删除？'
					let unset_list = this.multiple_selection.filter(item => {
						return item.check_status == 3 || item.check_status == 5;
					})
					unset_list.map(item => {
						style_id.push(item.style_id)
					})
					unset_num = total_num - unset_list.length;
				}
				if(total_num == unset_num){
					this.$message.warning('没有符合操作条件的记录！');
					return;
				}
				this.$confirm(`您选择了${total_num}项，其中不可操作${unset_num}项，${title}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(type == '0' || type == '1'){	//上架或下架
						let arg = {
							style_id:style_id.join(','),
							type:type
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
					}else if(type == '3'){	//删除
						let arg = {
							style_id:style_id.join(',')
						}
						resource.delGoods(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								//获取列表
								this.getGoodsList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
			//监听更多操作按钮
			handleCommand(e,id,name){
				if(e == '1'){	//查看
					this.$router.push('/edit_goods?page_type=goods&goods_type=3&style_id=' + id);
				}else if(e == '2'){	//图片管理
					this.$router.push('/image_setting?style_id=' + id + '&style_name=' + name)
				}else if(e == '3'){	//删除
					this.$confirm(`确认删除?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let arg = {
							style_id:id
						}
						resource.delGoods(arg).then(res => {
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
				}
			},
			//切换上架或下架
			checkStatus(style_id,type){
				this.$confirm(`确认${type == 5?'上架':'下架'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						style_id:style_id,
						type:type == 5?1:0
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
			windowOpen(url,old_url){
				if(!old_url || old_url.indexOf('https://pan.baidu.com') == -1){
					this.$message.warning('该地址不是网盘地址格式!')
				}else{
					window.open(url)
				}
			},
		},
		components:{
			TableTitle,
			PaginationWidget,
			UploadFile
		}
	}
</script>






