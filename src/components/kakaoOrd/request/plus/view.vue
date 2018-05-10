<template>
	<div class="innerContent overflowH">
		<!-- 뷰 영역 -->
		<div class="table-view">
			<table>
				<tbody>
					<tr>
						<td class="w150 bgGray textCenter">플러스친구 구분</td>
						<td class="w350">                            
							<select style="width:163px" name="CON_ST_CODE" id="CON_ST_CODE" v-model="CON_ST_CODE" v-on:change="schList('2');">
								<option value="">개별 사용</option>
								<option v-for="row in arrSelectSt" :key="row.ST_CODE" v-bind:value="row.ST_CODE">
									{{row.ST_NAME}}
								</option>
							</select>
						</td>
						<td>
							<label>개별 또는 정보를 공통으로 사용할 가맹점을 선택합니다.</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter" >내가게 접속 경로</td>
						<td colspan="2" style="border-right: 1px solid #d8d8d8;">
							{{this.STORE_URL}}
						</td>						
					</tr>
					<tr>
						<td class="bgGray textCenter">계정관리 이메일</td>
						<td>
							<input type="text" class="w150" name="PLUS_EMAIL" id="PLUS_EMAIL" ref="PLUS_EMAIL" v-model="arrList[0].PLUS_EMAIL"/>
						</td>
						<td>
							<label>플러스친구 관리용 이메일을 입력합니다.</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">계정관리 비밀번호</td>
						<td>
							<input type="text" class="w150" name="PLUS_PWD" id="PLUS_PWD" ref="PLUS_PWD" v-model="arrList[0].PLUS_PWD"/>
						</td>
						<td>
							<label>플러스친구 관리용 비밀번호를 입력합니다.</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">플러스친구 가맹점명</td>
						<td>
							<input type="text" class="w150" name="PLUS_NAME" id="PLUS_NAME" ref="PLUS_NAME" v-model="arrList[0].PLUS_NAME"/>
						</td>
						<td>
							<label>플러스친구에 등록한 가맹점명을 입력합니다.</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">플러스 친구 ID</td>
						<td>
							<input type="text" class="w150" name="YELLOW_ID" id="YELLOW_ID" ref="YELLOW_ID" v-model="arrList[0].YELLOW_ID"/>
						</td>
						<td>
							<label>비즈톡에 등록한 가맹점별 옐로우 ID 를(을) 입력합니다.</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">SenderKey</td>
						<td>
							<input type="text" class="w150" name="SENDER_KEY" id="SENDER_KEY" ref="SENDER_KEY" v-model="arrList[0].SENDER_KEY"/>
						</td>
						<td>
							<label>비즈톡에서 발급받은 가맹점별 Sender Key를 입력합니다.</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">담당자 명</td>
						<td>
							<input type="text" class="w150" name="MKT_NAME" id="MKT_NAME" ref="MKT_NAME" v-model="arrList[0].MKT_NAME"/>
						</td>
						<td>
							<label>신청관리 담당자 이름을 입력합니다.</label>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 목록으로 버튼 -->
		<div style="padding-top: 15px;">
			<router-link class="btn-box bgGray overflowH floatleft" to="/kakaoOrdReqList"><i class="fa fa-undo"></i> 목록으로</router-link>
			<a class="btn-box bgGray overflowH floatRight" v-on:click="uddData();"><i class="fa fa-check"></i> 정보수정</a>
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
	name: 'plusView',
	data () {
		return {
			//상세데이터 배열
			arrList: [{
				CON_ST_CODE: ""
				, PLUS_EMAIL: ""
				, PLUS_PWD: ""
				, PLUS_NAME: ""
				, YELLOW_ID: ""
				, SENDER_KEY: ""
				, MKT_NAME: ""
			}]
			//플러스친구 구분 가맹정 추출
			, arrSelectSt: []
			//인풋 바인딩 변수
			, CON_ST_CODE: ''
			//내가게 접속 경로	
			, STORE_URL: ''
		}
	},
	props : [ 'st_code', 'multi_type' ], //multi_type : 멀티/개별가맹점 구분변수 (멀티_구분 (M: 마스터, S: 종속, N: 개별))
	created(){        
		//로드시 실행
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.schList('1');
			this.schStCode();
			this.storeKey();
		})
		
	},
	computed : {
		//계산형 단일 실행
	},
	methods: { 
		//이벤트 기능정의       
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		schStCode: function(){
			//변수할당
			var tmp0 = this.st_code;
			//전문번호
			var IN_REQ_NUM = "AW01_07_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│";  // 가맹점_코드
			//배열초기화
			this.arrSelectSt = [];
			//console.log('IN_VALUE:'+IN_VALUE);
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				vue.arrSelectSt = data.out_ROW1;
				//console.log(data);
			});
		},        
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		schList: function(Type){
			//변수할당
			var tmp0 = this.st_code;
			var tmp1 = this.CON_ST_CODE;			
			//플러스친구 구분 처리
			if (tmp1 == undefined || tmp1 == ""){
				tmp1 = tmp0;                
			}
			//셀렉트박스 변경시 input readonly 처리
			if (tmp0 == tmp1){
				$("#PLUS_EMAIL").attr('readonly', false);
				$("#PLUS_PWD").attr('readonly', false);
				$("#PLUS_NAME").attr('readonly', false);
				$("#YELLOW_ID").attr('readonly', false);
				$("#SENDER_KEY").attr('readonly', false);
			}else{
				$("#PLUS_EMAIL").attr('readonly', true);
				$("#PLUS_PWD").attr('readonly', true);
				$("#PLUS_NAME").attr('readonly', true);
				$("#YELLOW_ID").attr('readonly', true);
				$("#SENDER_KEY").attr('readonly', true);
			}
			switch (Type) {
				case '1': 
					tmp0 = tmp0;                    
					break;
				case '2':
					tmp0 = tmp1;                    
					break;            
				default:
					tmp0 = tmp0;                    
					break;
			}
			//전문번호
			var IN_REQ_NUM = "AW01_06_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│";  // 가맹점_코드
			// console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
			this.arrList = [
				{
					CON_ST_CODE: ""
					, PLUS_EMAIL: ""
					, PLUS_PWD: ""
					, PLUS_NAME: ""
					, YELLOW_ID: ""
					, SENDER_KEY: ""
					, MKT_NAME: ""
				}
			];
			//console.log('IN_VALUE:'+IN_VALUE);
			if (tmp0 == undefined && tmp0 == ""){
				return;
			}
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
				// console.log(data.out_ROW1.length);
				if (data.out_ROW1.length > 0){
					vue.arrList = data.out_ROW1;
					for (var i = 0; i < vue.arrList.length; i++) {
						// console.log(Type);
						if (Type == "1"){
							vue.CON_ST_CODE = util.getNull(vue.arrList[i].CON_ST_CODE, "");
							//최초 로드시 input readonly 처리
							// console.log(vue.CON_ST_CODE);
							if(vue.CON_ST_CODE == undefined || vue.CON_ST_CODE == ""){
								$("#PLUS_EMAIL").attr('readonly', false);
								$("#PLUS_PWD").attr('readonly', false);
								$("#PLUS_NAME").attr('readonly', false);
								$("#YELLOW_ID").attr('readonly', false);
								$("#SENDER_KEY").attr('readonly', false);
							}else{
								$("#PLUS_EMAIL").attr('readonly', true);
								$("#PLUS_PWD").attr('readonly', true);
								$("#PLUS_NAME").attr('readonly', true);
								$("#YELLOW_ID").attr('readonly', true);
								$("#SENDER_KEY").attr('readonly', true);
							}
						}
						
					}// end for
				//	vue.storeKey();
				}
			});

			

		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		uddData: function(){
			//변수할당
			var tmp0 = authUtil.getUserInfo().userId;
			var tmp1 = this.st_code;
			var tmp2 = this.CON_ST_CODE;
			var tmp3 = this.arrList[0].PLUS_EMAIL;
			var tmp4 = this.arrList[0].PLUS_PWD;
			var tmp5 = this.arrList[0].PLUS_NAME;
			var tmp6 = this.arrList[0].YELLOW_ID;
			var tmp7 = this.arrList[0].SENDER_KEY;
			var tmp8 = this.arrList[0].MKT_NAME;
			//전문번호
			var IN_REQ_NUM = "AW01_08_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 사용자_ID (신청/수정 사용자)
					+ tmp1 + "│"    // 가맹점_코드
					+ tmp2 + "│"    // 관련_가맹점_코드 (NULL: 개별)
					+ tmp3 + "│"    // 플러스친구_계정이메일
					+ tmp4 + "│"    // 플러스친구_계정비밀번호
					+ tmp5 + "│"    // 플러스친구_이름 (가맹점명)
					+ tmp6 + "│"    // 옐로우_ID (비즈톡등록ID)
					+ tmp7 + "│"    // 센더_키 (비즈톡발급)
					+ tmp8 + "│"    // 영업_담당자명
					;
			if (!util_validate.validate_table(tmp3, "계정관리 이메일", "MN_GR_ST_CW_REQ", "PLUS_EMAIL", "null|email", this.$refs.PLUS_EMAIL)) { return; }
			if (!util_validate.validate_table(tmp4, "계정관리 비밀번호", "MN_GR_ST_CW_REQ", "PLUS_PWD", "null", this.$refs.PLUS_PWD)) { return; }
			if (!util_validate.validate_table(tmp5, "플러스친구 가맹점명", "MN_GR_ST_CW_REQ", "PLUS_NAME", "null", this.$refs.PLUS_NAME)) { return; }
			if (!util_validate.validate_table(tmp6, "플러스 친구 ID", "MN_GR_ST_CW_REQ", "YELLOW_ID", "null", this.$refs.YELLOW_ID)) { return; }
			if (!util_validate.validate_table(tmp7, "SenderKey", "MN_GR_ST_CW_REQ", "SENDER_KEY", "null", this.$refs.SENDER_KEY)) { return; }
			if (!util_validate.validate_table(tmp8, "담당자 명", "MN_GR_ST_CW_REQ", "MKT_NAME", "null", this.$refs.MKT_NAME)) { return; }

			//console.log('IN_VALUE:'+IN_VALUE);
			//return;
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				//console.log(data);
				if (data.out_CODE == '1') {
					alert("상태변경이 완료되었습니다.");
					vue.schList('1');                    
				}
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		storeKey: function(){
			//변수할당
			var tmp0 = this.st_code;
			var tmp1 = this.CON_ST_CODE
		
			//전문번호
			var IN_REQ_NUM = "AW01_11_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 가맹점_코드
					+ tmp1 + "│"    	// 관련_가맹점_코드(NULL: 개별)
					;
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				//console.log(data);
				if (data.out_CODE == '1') {
					vue.STORE_URL = data.out_ROW1[0].ORDER_URL;
				}
			});
					
		}
	},
	watch : {    
		//데이터가 변할시마다 함수 호출
		CON_ST_CODE: function(val){
			//console.log(val);
			this.storeKey();
		}
	}

}
</script>

<style scoped>
.table-view label{color: #555;font-size: 8pt;}
.table-view table tbody tr td:nth-child(2){border-right:0px;}
</style>