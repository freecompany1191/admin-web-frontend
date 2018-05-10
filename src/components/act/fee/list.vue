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
						<td class="search-title">업무그룹 선택</td>
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
						<td class="search-title">수수료대상</td>
						<td>
							<label  v-for="chkbox in arrSyCode" :key="chkbox.DT_CODE" ><input type="checkbox" v-model="charge_type_cd" v-bind:value="chkbox.DT_CODE">{{chkbox.DT_NAME}}</label>
						</td>
					</tr>
				</table>
			</div>
			<!-- 검색버튼 -->
			<div class="search-btn-box">
				<a class="btn-box-r bgGray overflowH" style="line-height: 83px; width: 100px;" v-on:click="pageChange(1);"><i class="fa fa-search grayicon"></i> 검색</a>
			</div>
		</div>
		<!-- 검색결과 -->
		<div class="table-top"><span>*전체 <strong class="theRed">{{totalData}}</strong>개의 데이타가 있습니다.</span></div>
		<!-- 리스트 -->
		<div class="table-list">
			<table>
                <colgroup>
                    <col width="10%"/>
                    <col width="10%"/>
                    <col width="10%"/>				
                    <col width="10%"/>
                    <col width="10%"/>
                    <col width="10%"/>
                    <col width="10%"/>
                    <col width="10%"/>
                    <col width="10%"/>
                    <col width="10%"/>
                </colgroup>
				<thead>
					<tr>
						<th>제휴본사</th>
						<th>총판</th>
						<th>수수료대상</th>
						<th>수정일시</th>
						<th>수정ID</th>
						<th>제휴본사 비율</th>
						<th>총판 비율</th>
                        <th>플랫폼사 비율</th>
                        <th>기타 비율</th>
                        <th>수정</th>
					</tr>
				</thead>
				<tbody id="elList">
					<!-- <tr v-if="arrList.length == 0">
						<td colspan="10">내역이 없습니다</td>
					</tr>
					<tr v-else v-for="row in arrList" :key="row.REQ_NO"> -->
					<tr>
						<td class="textLeft"></td>
						<td class="textLeft"></td>
                        <td></td>
                        <td></td>
                        <td class="textLeft"></td>
                        <td class="textLeft"><input type=text class="w60"> %</td>
                        <td class="textLeft"><input type=text class="w60"> %</td>
                        <td class="textLeft"><input type=text class="w60"> %</td>
                        <td class="textLeft"><input type=text class="w60"> %</td>
                        <td style="padding-top:2px;"><a class="btn-box bgGray overflowH " ><i class="fa fa-undo"></i> 수정</a></td>
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
	name: 'feeList',
	data () {
		return {
			pageTitle: '수수료 정산비율'
			, pageTitle_sub: '수수료 정산비율를(을) 설정하실수 있습니다.'
			//가맹점선택(제휴본사)
			, hd_code: ''
			, arrSelectHd: []
			//가맹점선택(총판)
			, br_code: ''
			, arrSelectBr: []
			//수수료대상
			, charge_type_cd: []
			//시스템코드(수수료대상)
			, arrSyCode: []
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
		//수수료대상

		
		//로드시 실행
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.            
			this.schHdCode();
			this.schBrCode();
			this.schSyCode();
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
				name: 'feeList'
				, query: { 
					pageNo: no
					, hd_code: this.hd_code
					, br_code: this.br_code
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
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////시스템코드
        schSyCode: function(){
            //변수할당
			var tmp0 = "RT"//수수료_구분_코드 (SY_CODE = 'RT')
			var tmp1 = "";
            var tmp2 = "";
            var tmp3 = "1";
            var tmp4 = "";            
			//전문번호
			var IN_REQ_NUM = "GR00_05_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   //분류_코드 (NULL: 전체)
					+ tmp1 + "│" //상위_분류_코드 (NULL: 없음)
                    + tmp2 + "│" //상위_구분_코드 (NULL: 없음)
                    + tmp3 + "│" //(NULL: 전체, 0: 삭제, 1: 정상, 2: 정지)
                    + tmp4 + "│" //마지막_동기화_일시 (NULL: 전체, YYYYMMDDHH24MISS (예: 20160518085059)
					;
			// console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
            this.arrSyCode = [];			
			//통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				vue.arrSyCode = data.out_ROW1;				
			});
        },	
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//리스트
		schList: function() {
			//변수할당
			var tmp0 = this.pageNo;
			var tmp1 = this.pageSize;			
			var tmp2 = this.hd_code;
            var tmp3 = this.br_code;      
            var tmp4 = this.charge_type_cd;
			//전문번호
			var IN_REQ_NUM = "";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 페이지_요청번호
					+ tmp1 + "│"    // 페이지_출력개수 (화면출력 데이터 수)
					+ tmp2 + "│"    // 검색_제휴본사_코드 (NULL: 전체)
					+ tmp3 + "│"    // 검색_총판_코드 (NULL: 전체)	 
					+ tmp4 + "│"    // 수수료_구분_코드 (SY_CODE = 'RT')
					;
			console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
			this.arrList = [];
			//console.log(IN_REQ_NUM);
			return;
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				//console.log(data.out_VALUE);
				//vue.arrList.push({REQ_NO:"1", ST_NAME:"테스트데이터", ST_CODE:"S000001", REQ_STATUS:"1", MOD_DATE:"2018-01-19", SETUP_AMT:"0", MKT_NAME:"0"});
				vue.totalData = Number(data.out_VALUE);
				vue.arrList = data.out_ROW1;
				vue.schPaging();   
			});
		}
		
	},
	watch : {
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			// console.log("watch route start");
			// console.log(to);
			// console.log(from);
			if (to.name == "feeList"){                
				if (to.query.pageNo != undefined && to.query.pageNo != ""){
					if (this.pageNo != to.query.pageNo){
						this.pageChange(to.query.pageNo);
					}
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

