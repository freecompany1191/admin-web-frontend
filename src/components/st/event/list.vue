<template>
	<div class="innerContent overflowH">
		<!-- 타이틀 -->
		<div>
			<h2 class="bighead-Title">
				<span v-text="pageTitle">{{pageTitle}}</span>
				<span class="bighead-Title-sub" v-text="pageTitle_sub">{{pageTitle_sub}}</span>
			</h2>
		</div>
		<!-- 검색 -->
		<div class="search-box">
			<div class="inner-search-box floatLeft">
				<div>
					<ul v-if="this.userInfo.multiType != 'S' && this.userInfo.multiType != 'N'">
						<li class="search-title">가맹점선택</li>
						<li><include-find-branch></include-find-branch></li>
					</ul>
				</div>
				<div>
					<ul>
						<li class="search-title">이벤트 사용여부</li>
						<li>
							<select class="w80" v-model="find_event_yn">
								<option value="">전체</option>
								<option value="Y">사용</option>
								<option value="N">사용안함</option>
							</select>
						</li>
						<li class="search-title2">검색어</li>
						<li>
							<select class="w100" v-model="find_type">
								<option value="1">가맹점명</option>
								<option value="2">가맹점코드</option>
							</select>
							<input type="text" class="w220" v-model="find_val" v-on:keyup.enter="pageChange(1);"/>
						</li>
					</ul>
				</div>
			</div>
			<!-- 검색버튼 -->
			<div class="search-btn-box">
				<a class="btn-box-r bgGray overflowH" v-on:click="pageChange(1);"><i class="fa fa-search grayicon"></i> 검색</a>
			</div>
		</div>
		<!-- 검색결과 -->
		<div class="table-top"><span>*전체 <strong class="theRed">{{pagingInfo.totalData}}</strong>개의 데이타가 있습니다.</span></div>
		<!-- 리스트 -->
		<div class="table-list">
			<table>
				<thead>
					<tr>
						<th width="5%">순번</th>
						<th width="24%">가맹점 명</th>
						<th width="8%">가맹점 코드</th>
						<th width="10%">설정 여부</th>
						<th width="24%">이벤트 제목</th>
						<th width="10%">해택 구분</th>
						<th width="15%">마지막 변경 일시</th>
					</tr>
				</thead>
				<tbody id="elList">
					<tr v-if="arrList.length == 0">
						<td colspan="7">내역이 없습니다</td>
					</tr>
					<tr v-else v-for="(row, index) in arrList" :key="row.REQ_NO" v-on:click="schView(row.ST_CODE);">
						<td>{{(pagingInfo.pageNo - 1) * pagingInfo.pageSize + index + 1}}</td>
						<td class="textLeft">{{row.ST_NAME}}</td>
						<td>{{row.ST_CODE}}</td>
						<td>{{row.EV3_YN}}</td>
						<td>{{row.EV3_CONTENT_1}}</td>
						<td>{{row.EV3_REWARD_TYPE}}</td>
						<td>{{row.MOD_DATE}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 페이징 -->
		<include-list-paging></include-list-paging>
	</div>
</template>

<script>
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil.js';
import include_find_branch from '@/common/include/find_branch.vue';
import include_list_paging from '@/common/include/list_paging.vue';
import eventBus from '@/common/include/eventBus.js';

export default {
	name: 'elList',
	data () {
		return {
			pageTitle: '가맹점 이벤트'
			, pageTitle_sub: '가맹점 이벤트 관리'

			, find_branch: {}	// 가맹점선택 selectBox 값

			, find_event_yn: ''	// 이벤트 사용여부

			, find_type: '' 	// 검색어
			, find_val: ''

			, arrList: []		// 리스트

			, pagingInfo: {}	// 페이지관련

			, userInfo: authUtil.getUserInfo()
		}
	},
	components: {
		'include-find-branch' : include_find_branch
		, 'include-list-paging' : include_list_paging
	},
	created() {
		//로드시 실행
		this.pagingInfo.pageNo = util.getNull(this.$route.query.pageNo, 1);
		
		this.find_event_yn = util.getNull(this.$route.query.find_event_yn, "");
		this.find_type = util.getNull(this.$route.query.find_type, "1");
		this.find_val = util.getNull(this.$route.query.find_val, "");

		/**
		 * 가맹점선택 이벤트버스
		 * type : 0:정보만 넘기기, 1:정보넘기면서 리스트 검색
		 * info : 정보
		 */
		this.$EventBus.$on(eventBus.FIND_BRANCH_RECEIVER, (type, info) => {
			this.find_branch = info;

			if (type == 1) {
				this.pageChange(1);
			}
		});

		/**
		 * 리스트페이징 이벤트버스
		 * type : 0:정보만 넘기기, 1:정보넘기면서 리스트 검색
		 * info : 정보
		 */
		this.$EventBus.$on(eventBus.LIST_PAGING_RECEIVER, (type, info) => {
			this.pagingInfo = info;

			if (type == 1) {
				this.pageChange(this.pagingInfo.pageNo);
			}
		});

		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.$EventBus.$emit(eventBus.FIND_BRANCH_CALLBACK, {type_cd:'A'});
		})
	},
	computed : {
		//계산형 단일 실행
	},
	methods: {
		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//페이징 페이지 전환
		pageChange: function(no) {
			if (no == 0) {
				no = 1;
			}
			this.$router.push({
				name: 'stEventList'
				, query: {
					pageNo: no
					, hd_code: util.getNull(this.find_branch.selectHd.HD_CODE, '')
					, br_code: util.getNull(this.find_branch.selectBr.BR_CODE, '')
					, st_code: util.getNull(this.find_branch.selectSt.ST_CODE, '')
					, multi_type: util.getNull(this.find_branch.selectSt.MULTI_TYPE, '')
					, multi_st_code: util.getNull(this.find_branch.selectStMulti.ST_CODE, '')
					, find_event_yn: util.getNull(this.find_event_yn, '')
					, find_type: util.getNull(this.find_type, '')
					, find_val: util.getNull(this.find_val, '')
				} 
			})
			this.pagingInfo.pageNo = no;
			this.$EventBus.$emit(eventBus.LIST_PAGING_CALLBACK, 0, this.pagingInfo);

			this.schList();
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//리스트
		schList: function() {
			//초기화
			this.arrList = [];

			let tmp_hdCode = util.getNull(this.find_branch.selectHd.HD_CODE, this.find_branch.hd_code);
			let tmp_brCode = util.getNull(this.find_branch.selectBr.BR_CODE, this.find_branch.br_code);
			let tmp_stCode = util.getNull(this.find_branch.selectSt.ST_CODE, this.find_branch.st_code);
			let tmp_multiType = util.getNull(this.find_branch.selectSt.MULTI_TYPE, "A");
			let tmp_multiStCode = util.getNull(this.find_branch.selectStMulti.ST_CODE, this.find_branch.multi_st_code);

			//통신 호출
			httpCommon.sendPost(this, "202", "AW02_01_V01"
				, this.pagingInfo.pageNo + "│"	// 페이지_요청번호
				+ this.pagingInfo.pageSize + "│"	// 페이지_출력개수 (화면출력 데이터 수)
				+ tmp_hdCode + "│"			// 검색_제휴본사_코드 (NULL: 전체)
				+ tmp_brCode + "│"			// 검색_총판_코드 (NULL: 전체)
				+ tmp_stCode + "│"			// 검색_가맹점_코드 (로그인정보, NULL: 전체)
				+ tmp_multiType + "│"		// 검색_멀티_구분 (로그인정보, 검색가맹점의 멀티구분)
				+ tmp_multiStCode + "│"		// 검색_멀티_가맹점_코드 (NULL: 전체)
				+ this.find_event_yn + "│"	// 검색_이벤트 사용여부
				+ this.find_type + "│"		// 검색_구분 (1: 가맹점명, 2: 가맹점코드)
				+ this.find_val + "│"		// 검색_단어
			, function suc(vue, data) {
				vue.pagingInfo.totalData = Number(data.out_VALUE);
				vue.arrList = data.out_ROW1;

				vue.$EventBus.$emit(eventBus.LIST_PAGING_CALLBACK, 1, vue.pagingInfo);
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상세뷰 전환
		schView: function(st_code) {
			this.$router.push({ name: 'stEventView', params: {st_code: st_code} })
		}
	},
	watch: {
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			if (to.name == "stEventList") {
				if (!util.isNull(to.query.pageNo)) {
					if (this.pagingInfo.pageNo != to.query.pageNo){
						this.pageChange(to.query.pageNo);
					}
				} else {
					this.$router.go(-1);
				}
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 검색버튼 */
.btn-box-r {
	line-height: 82px;
	min-width: 95px;
}

.search-title2{width:50px; padding-left:44px; font-weight: bold; color: #7c7c7c;}
</style>