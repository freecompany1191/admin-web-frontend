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
				<table>
					<tr>
						<td class="search-title">신청상태</td>
						<td>
							<label><input type="radio" name="data_status" id="data_status" v-model="data_status" value=""/>전체</label>
							<label><input type="radio" name="data_status" id="data_status" v-model="data_status" value="1"/>신청</label>
							<label><input type="radio" name="data_status" id="data_status" v-model="data_status" value="2"/>처리중</label>
							<label><input type="radio" name="data_status" id="data_status" v-model="data_status" value="3"/>처리완료</label>
							<label><input type="radio" name="data_status" id="data_status" v-model="data_status" value="0"/>신청취소</label>
						</td>
					</tr>
					<tr>
						<td class="search-title">가맹점선택</td>
						<td>
							<select class="w120" name="hd_code" id="hd_code" v-model="hd_code" v-on:change="schBrCode();">
								<option value="">제휴본사 전체</option>
								<option v-for="row in arrSelectHd" :key="row.HD_CODE" v-bind:value="row.HD_CODE">
									{{row.HD_NAME}}
								</option>
							</select>
							<select class="w120" name="br_code" id="br_code" v-model="br_code">
								<option value="">총판 전체</option>
								<option v-for="row in arrSelectBr" :key="row.BR_CODE" v-bind:value="row.BR_CODE">
									{{row.BR_NAME}}
								</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class="search-title">검색어</td>
						<td>
							<select class="w120" name="find_type" id="find_type" v-model="find_type">
								<option value="">선택하기</option>
								<option value="1">가맹점명</option>
								<option value="2">가맹점코드</option>
							</select>
							<input type="text" class="w220" name="find_val" id="find_val" v-model="find_val"/>
						</td>
					</tr>
				</table>
			</div>
			<!-- 검색버튼 -->
			<div class="search-btn-box">
				<a class="btn-box-r bgGray overflowH" style="line-height: 113px; width: 100px;" v-on:click="pageChange(1);"><i class="fa fa-search grayicon"></i> 검색</a>
			</div>
		</div>
		<!-- 검색결과 -->
		<div class="table-top"><span>*전체 <strong class="theRed">{{totalData}}</strong>개의 데이타가 있습니다.</span></div>
		<!-- 리스트 -->
		<div class="table-list">
			<table>
				<colgroup>
					<col width="8%"/>
					<col/>
					<col width="10%"/>				
					<col width="10%"/>
					<col width="10%"/>
					<col width="10%"/>
					<col width="10%"/>
				</colgroup>
				<thead>
					<tr>
						<th>순번</th>
						<th>가맹점 명</th>
						<th>가맹점 코드</th>
						<th>신청 상태</th>
						<th>마지막 변경 일시</th>
						<th>차감 설치비</th>
						<th>처리 담당자</th>
					</tr>
				</thead>
				<tbody id="elList">
					<tr v-if="arrList.length == 0">
						<td colspan="7">내역이 없습니다</td>
					</tr>
					<tr v-else v-for="row in arrList" :key="row.REQ_NO" v-on:click="schView(row.ST_CODE, row.MULTI_TYPE);">
						<td>{{row.RN}}</td>
						<td class="textLeft">{{row.ST_NAME}}</td>
						<td>{{row.ST_CODE}}</td>
						<td>{{row.REQ_STATUS}}</td>
						<td>{{row.MOD_DATE}}</td>
						<td class="textRight">{{row.SETUP_AMT}} 원</td>
						<td>{{row.MKT_NAME}}</td>                        
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
//포멧변환
import moment from "moment";
//달력
import Datepicker from 'vuejs-datepicker'
import DateLanguages from '@/common/js/utils/DateLanguages.js'

//HTTP 통신 임포트
import httpCommon from '@/common/js/http/http-common.js';
//로그인 쿠키
import authUtil from '@/common/js/utils/authUtil.js';
//FNC
import util from '@/common/js/utils/util.js';
import util_validate from '@/common/js/utils/util_validate.js';
import fnc from '@/common/js/utils/function.js';

export default {
	name: 'requestList',
	data () {
		return {
			pageTitle: '신청관리'
			, pageTitle_sub: '카카오 웹 주문 서비스 신청내역을 조회하실수 있습니다.'
			//신청상태
			, data_status: ''
			//가맹점선택(제휴본사)
			, hd_code: ''
			, arrSelectHd: []
			//가맹점선택(총판)
			, br_code: ''
			, arrSelectBr: []
			//검색어
			, find_type: ''
			, find_val: ''
			//리스트
			, arrList: []   
			, pageNo: 1
			, pageSize: 30
			, totalData: 0
			, pageLength: 1
			, arrPaging: []
		}
	},
	created() {        
		//최초 실행시 겟 데이터 REQUEST 셋팅
		this.pageNo = this.$route.query.pageNo;
		if (util.isNull(this.pageNo)){
			this.pageNo = 1;
		}
		this.data_status = this.$route.query.data_status;
		if (util.isNull(this.data_status)){
			this.data_status = "";
		}
		this.hd_code = this.$route.query.hd_code;
		if (util.isNull(this.hd_code)){
			this.hd_code = "";
		}
		this.br_code = this.$route.query.br_code;
		if (util.isNull(this.br_code)){
			this.br_code = "";
		}
		this.find_type = this.$route.query.find_type;
		if (util.isNull(this.find_type)){
			this.find_type = "";
		}

		//로드시 실행
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.            
			this.schHdCode();
			this.schBrCode();
			//최초 1페이지 호출 라우터 처리
			this.pageChange(this.pageNo);            
		});		
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
				name: 'kakaoOrdReqList'
				, query: { 
					pageNo: no
					, data_status: this.data_status
					, hd_code: this.hd_code
					, br_code: this.br_code
					, find_type: this.find_type
					, find_val: this.find_val
				} 
			})
			this.pageNo = no;
			this.schList();
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//제휴본사코드
		schHdCode: function(){
			//변수할당
			var tmp0 = "";
			var tmp1 = "2";
			//전문번호
			var IN_REQ_NUM = "GR00_01_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   //데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ tmp1 + "│" //정렬_구분 (1: 코드순, 2: 이름순)
					;
			//배열초기화
			this.arrSelectHd = [];
			//통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				vue.arrSelectHd = data.out_ROW1;
				//console.log(data);
			});

		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//총판코드
		schBrCode: function(){
			//변수할당
			var tmp0 = "";
			var tmp1 = "2";
			var tmp2 = this.hd_code;
			//전문번호
			var IN_REQ_NUM = "GR00_02_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   //데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ tmp1 + "│" //정렬_구분 (1: 코드순, 2: 이름순)
					+ tmp2 + "│" //검색_제휴본사_코드 (NULL: 전체)
					;
			//console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
			this.arrSelectBr = [];
			//전체검색 방지
			if ( tmp1 == undefined || tmp1 == "" ){
				return;            
			}
			//통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				vue.arrSelectBr = data.out_ROW1;
				//console.log(data);
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//리스트
		schList: function() {
			//변수할당
			var tmp0 = this.pageNo;
			var tmp1 = this.pageSize;
			var tmp2 = this.data_status;
			var tmp3 = this.hd_code;
			var tmp4 = this.br_code;
			var tmp5 = this.find_type;
			var tmp6 = this.find_val;            
			//전문번호
			var IN_REQ_NUM = "AW01_01_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 페이지_요청번호
					+ tmp1 + "│"    // 페이지_출력개수 (화면출력 데이터 수)
					+ tmp2 + "│"    // 검색_신청_상태 (NULL: 전체, 1: 신청, 2: 신청처리중, 3: 처리완료, 0: 신청취소)
					+ tmp3 + "│"    // 검색_제휴본사_코드 (NULL: 전체)
					+ tmp4 + "│"    // 검색_총판_코드 (NULL: 전체)
					+ tmp5 + "│"    // 검색_구분 (1: 가맹점명, 2: 가맹점코드)
					+ tmp6 + "│"    // 검색_단어
					;
			//console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
			this.arrList = [];
			//console.log(IN_REQ_NUM);
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				//console.log(data.out_VALUE);
				vue.totalData = Number(data.out_VALUE);
				vue.arrList = data.out_ROW1;
				vue.schPaging();                
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//페이징
		schPaging : function(){
			this.arrPaging = [];
			var pagingLength = Math.ceil(this.totalData / this.pageSize);            
			var ForNum = 1;
			var ToNum = ((((this.pageNo - 1) / 10) + 1) * 10);
			ToNum -= this.pageNo;
			for (var i=1; i <= pagingLength; i++){														                
				if ( i % 10 == 0 ){								
					ForNum = i;
					ToNum = i + 9;
				}else{
					ForNum = ForNum;
					ToNum = ToNum;
				}
				if (this.pageNo == i){
					break;
				}
			}            
			for (var i= ForNum; i <= ToNum; i++){                
				if (i > pagingLength){
					break;
				}     
				if (i == this.pageNo){                    
					this.arrPaging.push({no:i});
				}else{
					this.arrPaging.push({no:i});
				}
			}
			this.pageLength = pagingLength;
			//console.log(this.pageLength);            
		},        
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상세뷰 전환
		schView: function(code, type) {            
			this.$router.push({ name: 'kakaoOrdReqView', params: {st_code: code, multi_type: type} })
		}
	},
	watch : {
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			// console.log("watch route start");
			// console.log(to);
			// console.log(from);
			if (to.name == "kakaoOrdReqList"){                
				if (to.query.pageNo != undefined && to.query.pageNo != ""){
					this.pageChange(to.query.pageNo);
				}else{
					this.$router.go(-1);
				}                
			}
			// console.log("watch route end");
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

