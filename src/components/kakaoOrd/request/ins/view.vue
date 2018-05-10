<template>
	<div class="innerContent overflowH">
		<!-- 뷰 영역 -->
		<div class="table-view">
			<table>
				<tbody>
					<tr>
						<td class="w150 bgGray textCenter">설치비</td>
						<td class="w350">
							<input type="number" class="w150" name="ADD_CASH" id="ADD_CASH" ref="ADD_CASH" v-model="ADD_CASH"/>
						</td>
						<td class="w150 bgGray textCenter">차감 메모</td>
						<td>
							<input type="text" class="w200"  name="LOG_MEMO" id="LOG_MEMO" ref="LOG_MEMO" v-model="LOG_MEMO" maxlength="200"/>
							<a class="btn-box-r bgGray overflowH floatRight" v-on:click="uddData();"><i class="fa fa-search grayicon"></i>상태변경</a>
						</td>
					</tr>                    
					<tr>
						<td class="bgGray textCenter">설치비 차감 내역</td>
						<td colspan="3">
							<ul v-if="arrList.length == 0">
								<li>설치비 차감 내역 없음.</li>
							</ul>
							<ul v-else v-for="row in arrList" :key="row.PUT_DATE">
								<li>[{{row.PUT_DATE}}] {{row.ADD_CASH}} ({{row.LOG_MEMO}})</li>
							</ul>
						</td>
					</tr>                    
				</tbody>
			</table>
		</div>        
		<!-- 목록으로 버튼 -->
		<div style="padding-top: 15px;">
			<router-link class="btn-box bgGray overflowH floatleft" to="/kakaoOrdReqList"><i class="fa fa-undo"></i> 목록으로</router-link>
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
	name: 'insView',
	data () {
		return {
			//상세데이터 배열
			arrList: []
			//인풋 바인딩 변수
			, ADD_CASH: ''
			, LOG_MEMO: ''
		}
	},
	props : [ 'st_code' ],
	created(){        
		//로드시 실행
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.schList();    
		})
	},
	computed : {
		//계산형 단일 실행
	},
	methods: { 
		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		schList: function(){
			//변수할당
			var tmp0 = this.st_code;
			//전문번호
			var IN_REQ_NUM = "AW01_04_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│";  // 가맹점_코드
			//배열초기화
			this.arrList = [];
			//console.log('IN_VALUE:'+IN_VALUE);
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				vue.arrList = data.out_ROW1;
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		uddData: function(){
			//변수할당
			var tmp0 = authUtil.getUserInfo().userId;
			var tmp1 = this.st_code;
			var tmp2 = '1';
			var tmp3 = '1';
			var tmp4 = this.ADD_CASH;
			var tmp5 = this.LOG_MEMO;            
			//전문번호
			var IN_REQ_NUM = "AW01_05_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 사용자_ID
					+ tmp1 + "│"    // 가맹점_코드
					+ tmp2 + "│"    // (1: 카웹설치비)
					+ tmp3 + "│"    // (1: 차감, 2: 차감취소)
					+ tmp4 + "│"    // 입력_금액
					+ tmp5 + "│"    // 로그_메모
					;

			
			if (!util_validate.validate_table(tmp4, "설치비", "MN_GR_ST_CW_REQ", "SETUP_AMT", "null|number:2|max:8", this.$refs.ADD_CASH)) { return; }
			if (!util_validate.validate_table(tmp4, "설치비", "MN_GR_ST_CW_REQ", "SETUP_AMT", "null|number:4|max:8", this.$refs.ADD_CASH)) { return; }
			if (!util_validate.validate_input(tmp5, "차감 메모", "null|max:500", this.$refs.LOG_MEMO)) { return; }
			
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				//console.log(data);
				if (data.out_CODE == '1') {
					alert("상태변경이 완료되었습니다.");
					vue.schList();
					vue.ADD_CASH = '';
					vue.LOG_MEMO = '';
				}
			});
		}
	},
	watch : {    
		//데이터가 변할시마다 함수 호출
  }

}
</script>

<style scoped>

</style>
