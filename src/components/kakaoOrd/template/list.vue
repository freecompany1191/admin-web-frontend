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
					<ul>
						<li class="search-title">신청 상태</li>
						<li>
							<label><input type="radio" name="APPR_STATUS" v-model="APPR_STATUS" value=""/>전체</label>
							<label><input type="radio" name="APPR_STATUS" v-model="APPR_STATUS" value="0"/>승인요청</label>
							<label><input type="radio" name="APPR_STATUS" v-model="APPR_STATUS" value="1"/>승인완료</label>
							<label><input type="radio" name="APPR_STATUS" v-model="APPR_STATUS" value="2"/>반려</label>
						</li>
					</ul>
				</div>
			</div>
			<!-- 검색버튼 -->
			<div class="search-btn-box floatLeft">
				<a class="btn-box-s bgGray overflowH floatLeft" v-on:click="pageChange(1);"><i class="fa fa-search grayicon"></i> 검색</a>
				<a class="btn-box-s bgGray overflowH floatLeft" v-on:click="excelDown();">엑셀</a>
			</div>
		</div>
		<!-- 검색결과 -->
		<div class="table-top">
			<span class="floatLeft overflowH">*전체 <strong class="theRed">{{totalData}}</strong>개의 데이타가 있습니다.</span>
			<button class="btn-box-r bgGray overflowH floatRight btn-add-custom" v-on:click="schView('0')">등록</button>
		</div>
		<!-- 리스트 -->
		<div class="table-list">
			<table>
				<thead>
					<tr>
						<th width="8%">템플릿 구분</th>
						<th width="8%">템플릿 코드</th>
						<th width="15%">템플릿 제목</th>
						<th width="30%">템플릿 내용</th>
						<th width="10%">버튼 정보</th>
						<th width="10%">등록 일자</th>
						<th width="10%">신청 상태</th>
						<th width="8%">처리</th>
					</tr>
				</thead>
				<tbody id="elList">
					<tr v-if="arrList.length == 0">
						<td colspan="8">내역이 없습니다</td>
					</tr>
					<tr v-else v-for="row in arrList" :key="row.TPLT_CODE" v-on:click="schView(row.TPLT_CODE);">
						<td>{{row.TPLT_TYPE_TEXT}}</td>
						<td>{{row.TPLT_CODE}}</td>
						<td class="textLeft">{{row.TPLT_TITLE}}</td>
						<td class="textLeft" v-tooltip="{
							content: row.TPLT_CONTENT,
							placement:'bottom-center',
							delay: {
								show: 500,
								hide: 300,
							}}">
							{{row.TPLT_CONTENT_CUT}}
						</td>
						<td>{{row.BTN_INFO}}</td>
						<td>{{row.PUT_DATE}}</td>
						<td v-if="row.APPR_STATUS != '2'">{{row.APPR_STATUS_TEXT}}</td>
						<td v-if="row.APPR_STATUS == '2'" v-tooltip="{
							content: row.ERROR_MSG,
							placement:'bottom-center',
							delay: {
								show: 500,
								hide: 300,
							}}">
							{{row.APPR_STATUS_TEXT}}
						</td>
						<td>
							<button class="btn-box-r bgGray overflowH floatRight btn-list-custom" v-if="row.APPR_STATUS == '0' || row.APPR_STATUS == '3'" v-on:click="schStatus(row)">
								<span v-if="row.APPR_STATUS == '0'">상태확인</span><span v-if="row.APPR_STATUS == '3'">재등록</span></button>
							<button class="btn-box-r bgGray overflowH floatRight btn-list-custom" v-if="row.APPR_STATUS != '0' && row.APPR_STATUS != '3'" v-on:click="delData(row.TPLT_CODE)">삭제</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 페이징 -->
		<div class="paging-box" v-if="arrPaging.length != 0">
			<div class="paging-inner">
				<a class="arr arr-prev" v-if="pageNo > 1" v-on:click="pageChange(pageNo - 1);"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
				<a class="arr arr-prev" v-else><i class="fa fa-angle-left" aria-hidden="true"></i></a>

				<a class="num" v-for="row in arrPaging" :key="row.no" v-if="pageNo != row.no" v-on:click="pageChange(row.no);" >
					{{row.no}}
				</a>
				<b class="num" v-else>{{row.no}}</b>
				
				<a class="arr arr-next" v-if="pageLength > pageNo" v-on:click="pageChange(pageNo + 1);"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
				<a class="arr arr-next" v-else><i class="fa fa-angle-right" aria-hidden="true"></i></a>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import Tooltip from 'v-tooltip';

Vue.use(Tooltip);

//HTTP 통신 임포트
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import util_auth from '@/common/js/utils/authUtil.js';
import fnc from '@/common/js/utils/function.js';

export default {
	name: 'elList',
	data () {
		return {
			pageTitle: '그룹 템플릿 관리'
			, pageTitle_sub: '그룹 템플릿 검색 목록'

			, LIST_CLICK_FLAG: true
			, APPR_STATUS: ''	// 신청상태 ('':전체 0:승인요청 1:승인완료 2:반려)

			, arrList: []		// 리스트
			, pageNo: 1
			, pageSize: 30
			, totalData: 0
			, pageLength: 1
			, arrPaging: []
		}
	},
	created() {
		this.pageNo = this.$route.query.pageNo;
		if (util.isNull(this.pageNo)) {
			this.pageNo = 1;
		}
		this.APPR_STATUS = util.getNull(this.$route.query.APPR_STATUS, "");
		
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.pageChange(this.pageNo);
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
				name: 'kakaoOrdTmpList'
				, query: {
					pageNo: no
					, APPR_STATUS: this.APPR_STATUS
				}
			})
			this.pageNo = no;
			this.schList();
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//리스트
		schList: function() {
			//초기화
			this.arrList = [];
			//통신 호출
			httpCommon.sendPost(this, "203", "AW03_01_V01"
				, this.pageNo + "│"			// 페이지_요청번호
				+ "30" + "│"				// 페이지_출력개수 (화면출력 데이터 수)
				+ this.APPR_STATUS + "│"	// 신청상태 ('':전체 0:승인요청 1:승인완료 2:반려)
			, function suc(vue, data) {
				vue.totalData = Number(data.out_VALUE);

				// 템플릿 내용이 길어서 자르기
				for (let i = 0; i < data.out_ROW1.length; i++) {
					data.out_ROW1[i].TPLT_CONTENT_CUT = fnc.cutStr(data.out_ROW1[i].TPLT_CONTENT, 30);
				}

				vue.arrList = data.out_ROW1;
				vue.schPaging();
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상태확인 OR 재등록
		schStatus: function(row) {
			this.LIST_CLICK_FLAG = false;
			//전송타입 등록(CREATE), 조회(SEARCH)
			if(row.APPR_STATUS == '0') { //승인요청 상태 시에는 조회
				row.TRAN_TYPE = 'SEARCH';
			}
			else if(row.APPR_STATUS == '3') { //승인요청실패 상태 시에는 등록
				row.TRAN_TYPE = 'CREATE';
			}
			//사용자ID 추가
			row.USER_ID = util_auth.getUserInfo().userId;
			//통신 호출
			httpCommon.sendBizTalk(this, row
			, function suc(vue, data) {
				vue.LIST_CLICK_FLAG = true;
				if (data.out_CODE == '1') {
					//리턴된 승인상태가 있고 기존 승인상태와 같지 않을때 승인상태를 업데이트된 상태로 변경한다
					if(data.out_ROW1[0].APPR_STATUS != '' 
						&& row.APPR_STATUS != data.out_ROW1[0].APPR_STATUS) {
						row.APPR_STATUS = data.out_ROW1[0].APPR_STATUS;
					}
					if(data.out_MSG != '') { //메세지가 있으면
						alert(data.out_MSG);
					}
				}
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//삭제
		delData: function(code) {
			this.LIST_CLICK_FLAG = false;
			if (confirm('삭제하시겠습니까?')) {
				//통신 호출
				httpCommon.sendPost(this, "203", "AW03_03_V01"
					, util_auth.getUserInfo().userId + "│"	// 사용자 ID

					+ util.getNull(code, "") + "│"			// 템플릿_구분 (1: 주문하기, 2: 평가하기, 3: 주문접수, 4: 출발안내)
					+ '0' + "│"								// 데이터_상태 (NULL: 변경안함, 0: 삭제, 1: 정상)
					+ '' + "│"								// 승인_상태 (NULL: 변경안함, 0: 승인요청, 1: 승인완료, 2: 반려)
				, function suc(vue, data) {
					vue.LIST_CLICK_FLAG = true;
					if (data.out_CODE == '1') {
						// 목록에서 제거
						for (let i = 0; i < vue.arrList.length; i++) {
							if (vue.arrList[i].TPLT_CODE == code) {
								vue.arrList.splice(i, 1);
								break;
							}
						}
						alert("삭제되었습니다.");
					}
				});
			}
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//페이징
		schPaging : function() {
			this.arrPaging = [];
			var pagingLength = Math.ceil(this.totalData / this.pageSize);
			var ForNum = 1;
			var ToNum = ((((this.pageNo - 1) / 10) + 1) * 10);
			ToNum -= this.pageNo;
			for (var i = 1; i <= pagingLength; i++) {
				if ( i % 10 == 0 ) {
					ForNum = i;
					ToNum = i + 9;
				} else {
					ForNum = ForNum;
					ToNum = ToNum;
				}
				if (this.pageNo == i) {
					break;
				}
			}
			for (var i = ForNum; i <= ToNum; i++) {
				if (i > pagingLength) {
					break;
				}     
				if (i == this.pageNo) {
					this.arrPaging.push({no:i});
				} else {
					this.arrPaging.push({no:i});
				}
			}
			this.pageLength = pagingLength;
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상세뷰 전환
		schView: function(code) {
			if (!this.LIST_CLICK_FLAG) {
				this.LIST_CLICK_FLAG = true;
				return;
			}
			this.$router.push({ name: 'kakaoOrdTmpView', params: {tplt_code: code} })
		},

		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		excelDown: function() { //전문 데이터 전송
			
			var param = {
					REQ_TYPE:"203"
				, REQ_NUM:'AW03_05_V01'
				, VALUE:"│" //조회 조건
				// 엑셀 헤더 String 배열로 입력된 그대로 헤더를 만든다
				// 헤더를 지정하지 않으면 기본 컬럼 키 값으로 헤더를 만든다
				, HEADER: ["템플릿_코드","템플릿_구분","템플릿_구분 값","템플릿_제목","템플릿_내용","버튼_정보 (버튼명)","입력_일시","승인_상태","승인_상태 값","반려 메세지"]
			}

			// 통신 호출
			httpCommon.sendExcelDown(this, param, function suc(vue, data) {
				//console.log('test complete');
			});
		
		}
	},
	watch: {
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			if (to.name == "kakaoOrdTmpList") {
				if (!util.isNull(to.query.pageNo)) {
					this.pageChange(to.query.pageNo);
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
	line-height: 48px;
	min-width: 95px;
}
.btn-box-s {
	color:#717171!important;
    display: inline-block; *display: inline; 
	zoom: 0; 
	text-decoration: none; 
	padding: 2px 10px 3px 10px; 
	line-height: 20px; 
	min-width: 60px; 
	text-align: center; 
	font-size: 12px;    
    border-radius: 5px;
    text-shadow: 0 1px 0 #fff;
    border: 1px solid #e7e7e7;
	cursor: pointer;
	
	line-height: 48px;
	min-width: 36%;
	margin-left: 5px;
}
.table-top {
	margin-top: 8px;
}
/* 등록버튼 */
.btn-add-custom {
	line-height:30px;
	width:90px;
	margin-right:5px;
	margin-bottom:5px;
}
/* 리스트 버튼 */
.btn-list-custom {
	line-height:30px;
	width:90px;
	margin-top:5px;
	margin-bottom:5px;
}
.inner-search-box {
	width: 80%;
}
.search-btn-box {
	width: 19%;
}
</style>