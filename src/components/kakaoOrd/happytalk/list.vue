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
						<li class="search-title">발송시점</li>
						<li>
							<label><input type="radio" name="send_time_type" v-model="send_time_type" value="" checked/>전체</label>
							<label><input type="radio" name="send_time_type" v-model="send_time_type" value="1"/>접수</label>
							<label><input type="radio" name="send_time_type" v-model="send_time_type" value="2"/>출발</label>
							<label><input type="radio" name="send_time_type" v-model="send_time_type" value="3"/>완료</label>
							<label><input type="radio" name="send_time_type" v-model="send_time_type" value="5"/>취소</label>
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
		<div class="search-box">
			<div class="table-top floatLeft"><span>*전체 <strong class="theRed">{{pagingInfo.totalData}}</strong>개의 데이타가 있습니다.</span></div>

			<button class="btn-box-r bgGray overflowH floatRight" style="line-height: 30px;width:90px; margin-left:5px" v-on:click="schView('0')">등록</button>
		</div>

		<!-- 리스트 -->
		<div class="table-list">
			<table>
				<thead>
					<tr>
						<th width="5%"><input type="checkbox" v-model="selectAll" ></th>
						<th width="25%">가맹점명</th>
						<th width="10%">발송여부</th>
						<th colspan="2" width="20%">발송시점</th>
						<th width="13%">대상구분</th>
						<th width="13%">누적이용회수</th>
						<th width="20%">수정일시</th>
					</tr>
				</thead>
				<tbody id="happyTalkList">
					<tr v-if="arrTalk.length == 0">
						<td colspan="8">내역이 없습니다</td>
					</tr>
					<tr v-else v-for="talk in arrTalk" :key="talk.NTALK_SEQ_NO">
						<td><input type="checkbox" v-model="selected" :value="talk.NTALK_SEQ_NO"></td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);" style="text-align:left;">{{talk.ST_NAME_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.DATA_STATUS_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_TIME_TYPE_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_TIME_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_CU_TYPE_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_CU_END_CNT_STR}} </td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.MOD_DATE_STR}}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<br><br>

		<div>
			<ul>
				<button class="btn-box-r bgGray overflowH floatLeft" style="line-height: 30px;width:90px;" v-on:click="updateStatus('1')">발송</button>
				<button class="btn-box-r bgGray overflowH floatLeft" style="line-height: 30px;width:90px; margin-left:5px" v-on:click="updateStatus('2')">발송안함</button>
				<button class="btn-box-r bgGray overflowH floatLeft" style="line-height: 30px;width:90px; margin-left:5px" v-on:click="updateStatus('0')">삭제</button>
			</ul>
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
	name: 'happyTalkList',
	data () {
		return {
			pageTitle: '해피톡관리'
			, pageTitle_sub: '해피톡 목록을 설정하실수 있습니다'
			
			, find_branch: {}	// 가맹점선택 selectBox 값
			
			, arrTalk: []		// 리스트
			, selected: []		// 체크박스 리스트
			, send_time_type: ''

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

		this.send_time_type = util.getNull(this.$route.query.send_time_type, "");

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

		//로드시 실행
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.$EventBus.$emit(eventBus.FIND_BRANCH_CALLBACK, {type_cd:'A'});
		})
	},
	computed : {
		//계산형 단일 실행
		selectAll: {
			get: function () {
				return this.arrTalk ? this.selected.length == this.arrTalk.length : false;
			},
			set: function (value) { 
				var selected = [];

				if (value) {
					this.arrTalk.forEach(function (talk) {
						selected.push(talk.NTALK_SEQ_NO);
					});
				}

				this.selected = selected;
			}
		}
	},
	methods: {
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 상태수정
		updateStatus: function(dataStatus) {
			if (this.selected.length == 0) {
				alert("선택된 톡이 없습니다");
				return;
			}

			// 삭제시 확인창 출력
			if (dataStatus == 0) {
				var result = confirm("삭제 하시겠습니까?"); 
				if (result == false) {
					return;
				}
			}
			
			for (var i = 0 ; i < this.selected.length; i++) {
				//전문번호
				var IN_REQ_NUM = "AW04_06_V01";

				var tmp0 = this.userInfo.userId;
				var tmp1 = this.selected[i];
				var tmp2 = dataStatus;

				var IN_VALUE = tmp0 + "│"	// 사용자_ID (로그인정보)
					+ tmp1 + "│"			// 알림톡_일련_번호
					+ tmp2 + "│"			// 데이터_상태 (0: 삭제, 1: 발송, 2: 발송안함)
					;

				// 통신 호출
				httpCommon.sendPost(this, "204", IN_REQ_NUM, IN_VALUE, function suc(vue, data) { 
					 if (data.out_CODE == '1') {
					 }
				});
			}

			for (var j = 0 ; j < this.selected.length; j++) {

				for (var i = 0; i < this.arrTalk.length; i++) {

					if (this.arrTalk[i].NTALK_SEQ_NO == this.selected[j]) {

						if (dataStatus == 0) {
							this.arrTalk.splice(i, 1);
						} else if (dataStatus == 1) {
							this.arrTalk[i].DATA_STATUS = dataStatus;
							this.arrTalk[i].DATA_STATUS_STR = "발송";
						} else {
							this.arrTalk[i].DATA_STATUS = dataStatus;
							this.arrTalk[i].DATA_STATUS_STR = "발송안함";
						}
						break;
					}
				}
			}

			alert("변경완료");
			this.selected = [];
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 해피톡 리스트 가져오기
		getTalkList: function() { 
			//변수할당
			var tmp0 = this.pagingInfo.pageNo;
			var tmp1 = this.pagingInfo.pageSize;
			let tmp_hdCode = util.getNull(this.find_branch.selectHd.HD_CODE, this.find_branch.hd_code);
			var tmp_brCode = util.getNull(this.find_branch.selectBr.BR_CODE, this.find_branch.br_code);
			var tmp_stCode = util.getNull(this.find_branch.selectSt.ST_CODE, this.find_branch.st_code);
			var tmp_multiType = util.getNull(this.find_branch.selectSt.MULTI_TYPE, this.find_branch.multi_type);
			var tmp_multiStCode = util.getNull(this.find_branch.selectStMulti.ST_CODE, this.find_branch.multi_st_code);
			var tmp7 = this.send_time_type;

			//전문번호
			var IN_REQ_NUM = "AW04_02_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"		// 페이지_요청번호
					+ tmp1 + "│"			// 페이지_출력개수 (화면출력 데이터 수)
					+ tmp_hdCode + "│"		// 검색_제휴본사_코드 (로그인정보, NULL: 전체)
					+ tmp_brCode + "│"		// 검색_총판_코드 (로그인정보, NULL: 전체)
					+ tmp_stCode + "│"		// 검색_가맹점_코드 (로그인정보, NULL: 전체)
					+ tmp_multiType + "│"	// 검색_멀티_구분 (로그인정보, 검색가맹점의 멀티구분)
					+ tmp_multiStCode + "│"	// 검색_멀티_가맹점_코드 (NULL: 전체)
					+ tmp7 + "│"			// 검색_발송_시점_구분 (NULL: 전체, 1: 접수, 2: 출발, 3: 완료)
					;
			
			//배열초기화
			this.arrTalk = [];
			this.selected = [];

			// 통신 호출
			httpCommon.sendPost(this, "204", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
				vue.pagingInfo.totalData = Number(data.out_VALUE);
				vue.arrTalk = data.out_ROW1;

				vue.$EventBus.$emit(eventBus.LIST_PAGING_CALLBACK, 1, vue.pagingInfo);
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//페이징 페이지 전환
		pageChange: function(no) {
			if (no == 0) {
				no = 1;
			}
			this.$router.push({
				name: 'happyTalkList'
				, query: {
					pageNo: no
					, hd_code: util.getNull(this.find_branch.selectHd.HD_CODE, '')
					, br_code: util.getNull(this.find_branch.selectBr.BR_CODE, '')
					, st_code: util.getNull(this.find_branch.selectSt.ST_CODE, '')
					, multi_type: util.getNull(this.find_branch.selectSt.MULTI_TYPE, '')
					, multi_st_code: util.getNull(this.find_branch.selectStMulti.ST_CODE, '')
					, send_time_type: util.getNull(this.send_time_type, '')
				}
			})
			this.pagingInfo.pageNo = no;
			this.$EventBus.$emit(eventBus.LIST_PAGING_CALLBACK, 0, this.pagingInfo);

			this.getTalkList();
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		schView: function(idx) {
			this.$router.push({ name: 'happyTalkView', params: {no: idx} })
		}
	},
	watch : {
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			if (to.name == "happyTalkList") {
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
.btn-box-r {
	line-height: 82px;
	min-width: 95px;
}
</style>
