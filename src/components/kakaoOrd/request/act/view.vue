<style>
/**/
.datepicker-input-css{
	width: 162px!important;
	height: 25px!important;
}
</style>


<template>
	<div class="innerContent overflowH">
		<!-- 뷰 영역 -->
		<div class="table-view">
			<table>
				<tbody>
					<tr>
						<td class="w150 bgGray textCenter">서비스 사용 여부</td>
						<td class="w350">
							<label><input type="radio" name="CHARGE_USE_YN" id="CHARGE_USE_YN" ref="CHARGE_USE_YN" value="Y" v-model="arrList[0].CHARGE_USE_YN"> 사용</label>
							<label><input type="radio" name="CHARGE_USE_YN" id="CHARGE_USE_YN" ref="CHARGE_USE_YN" value="N" v-model="arrList[0].CHARGE_USE_YN"> 사용 안함</label>                            
						</td>
						<td>
							<label>카카오 웹 주문 서비스 사용 여부를 선택 합니다. (최초 차감 후 1달 이내 변경 불가)</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">월비용</td>
						<td>
							<input type="number" class="w150" name="CHARGE_USE_ST" id="CHARGE_USE_ST" ref="CHARGE_USE_ST" v-model="arrList[0].CHARGE_USE_ST"/>                            
						</td>
						<td>
							<label>카카오 웹 주문 사용 시, 월 비용을 입력합니다. (최초 차감 후 1달 이내 변경 불가)</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">차감 시작일자</td>
						<td>
							<datepicker :language="language" :format="format" v-model="arrList[0].CHARGE_S_DAY_USE" input-class="datepicker-input-css" ref="CHARGE_DAY"></datepicker>
						</td>
						<td>
							<label>월 비용 차감 시작일자를 선택합니다. (최초 차감 후 1달 이내 변경 불가)</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">차감일</td>
						<td>
							<select name="CHARGE_DAY" id="CHARGE_DAY" ref="CHARGE_DAY" v-model="arrList[0].CHARGE_DAY" >
								<option v-for="day in arrDay" :key="day.key" v-bind:value="day.key">
									{{day.value}}
								</option>
							</select>
						</td>
						<td>
							<label>월 비용 차감 일자를 선택합니다. (최초 차감 후 1달 이내 변경 불가)</label>
						</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">MCS 과금 정보</td>
						<td>
							<label>{{arrList[0].CHARGE_MSG}}</label>
						</td>
						<td></td>
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
	name: 'actView',
	components: {
		Datepicker
	},
	data () {
		return {
			//데이터 피커 설정
			format: 'yyyy-MM-dd'
			, language: 'ko'            
			//차감일 배열
			, arrDay: []
			//상세데이터 배열
			, arrList: [{
				CHARGE_USE_YN: 'N'
				, CHARGE_USE_ST: ''
				, CHARGE_S_DAY_USE: ''
				, CHARGE_DAY: '32'
			}]
			//날짜 비교를 위한 변수 할당 처리
			, OLD_CHARGE_USE_YN: 'N'
			, OLD_CHARGE_USE_ST: ''
			, OLD_CHARGE_S_DAY_USE: ''
			, OLD_CHARGE_DAY: '32'

		}
	},
	props : [ 'st_code', 'multi_type' ], //multi_type : 멀티/개별가맹점 구분변수 (멀티_구분 (M: 마스터, S: 종속, N: 개별))
	created(){
		//로드시 실행
		//차감일 배열
		for (var i = 0; i <= 32; i++) {
			if (i == 32){
				this.arrDay.push({key:i, value:"말일"});
			}else{
				var dd = i
				if (dd < 10){
					dd = '0'+i
				}
				if (Number(dd) <= 27){
					this.arrDay.push({key:i, value:dd+"일"});
				}
			}
		}
		
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			//상세데이터
			this.schList();
		})
	},
	computed : {
		//계산형 단일 실행
	},
	methods: { 
		//이벤트 기능정의
		schList: function(){
			//변수할당
			var tmp0 = this.st_code;
			//전문번호
			var IN_REQ_NUM = "AW01_09_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│";  // 가맹점_코드
			//배열초기화
			this.arrList = [
				{
					CHARGE_USE_YN: 'N'
					, CHARGE_USE_ST: ''
					, CHARGE_S_DAY_USE: ''
					, CHARGE_DAY: '32'
				}
			];
			//통신 호출
			 httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
				 // console.log(data.out_ROW1.length);
				 if (data.out_ROW1.length > 0){
					vue.arrList = data.out_ROW1;
					//console.log(data);
					if (vue.arrList[0].CHARGE_DAY == "0"){
						vue.arrList[0].CHARGE_DAY = "1";
					}
					vue.OLD_CHARGE_USE_YN = vue.arrList[0].CHARGE_USE_YN;
					vue.OLD_CHARGE_USE_ST = vue.arrList[0].CHARGE_USE_ST;
					vue.OLD_CHARGE_DAY = vue.arrList[0].CHARGE_DAY;

					if (vue.arrList[0].CHARGE_S_DAY_USE != undefined && vue.arrList[0].CHARGE_S_DAY_USE != ""){
						vue.arrList[0].CHARGE_S_DAY_USE = moment(vue.arrList[0].CHARGE_S_DAY_USE).format('YYYY-MM-DD')
						vue.OLD_CHARGE_S_DAY_USE = vue.arrList[0].CHARGE_S_DAY_USE;
					}

				 }
			 });
		}, 
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		uddData: function(){
			//변수할당
			var tmp0 = authUtil.getUserInfo().userId;
			var tmp1 = this.st_code;
			var tmp2 = this.arrList[0].CHARGE_USE_YN;
			var tmp3 = this.arrList[0].CHARGE_USE_ST;
			var tmp4 = this.arrList[0].CHARGE_S_DAY_USE;            
			var tmp5 = this.arrList[0].CHARGE_DAY;

			if (tmp4 != undefined && tmp4 != ""){
				tmp4 = moment(tmp4).format('YYYYMMDD');
			}

			//전문번호
			var IN_REQ_NUM = "AW01_10_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 사용자_ID (신청/수정 사용자)
					+ tmp1 + "│"    // 가맹점_코드
					+ tmp2 + "│"    // 요금_주문플랫폼_사용여부
					+ tmp3 + "│"    // 요금_주문플랫폼_가맹점 (월정액)
					+ tmp4 + "│"    // 요금_시작_차감일자_주문플랫폼 (YYYYMMDD)
					+ tmp5 + "│"    // 요금_차감일_주문플랫폼 (32 매월말일)
					;
			//console.log('IN_VALUE:'+IN_VALUE);
			//return;
			if (!util_validate.validate_table(tmp3, "요금_주문플랫폼_가맹점 (월정액)", "MN_GR_ST", "CHARGE_USE_ST", "null|max:7", this.$refs.CHARGE_USE_ST)) { return; }
			if (!util_validate.validate_table(tmp4, "요금_시작_차감일자_주문플랫폼 (YYYYMMDD)", "MN_GR_ST", "CHARGE_S_DAY_USE", "null|max:8")) { return; }
			if (!util_validate.validate_table(tmp5, "요금_차감일_주문플랫폼 (32 매월말일)", "MN_GR_ST", "CHARGE_DAY", "null|number:4|max:8")) { return; }
			
			//차감 시작일자 추출
			var startYYYY = moment(this.OLD_CHARGE_S_DAY_USE).format('YYYY');
			var startMM = moment(this.OLD_CHARGE_S_DAY_USE).format('MM');
			var startDD = moment(this.OLD_CHARGE_S_DAY_USE).format('DD');			
			var startYYYYMMDD = startYYYY+startMM+startDD;
			
			//비교 날짜 연산(입력된 데이터 한달뒤 추출)
			var compareYYYY = moment(this.OLD_CHARGE_S_DAY_USE).format('YYYY');
			var compareMM = moment(this.OLD_CHARGE_S_DAY_USE).format('MM');
			var compareDD = moment(this.OLD_CHARGE_S_DAY_USE).format('DD');
			//달추출 +1
			compareMM = Number(compareMM)+1;
			if (compareMM < 10){
				compareMM = "0" + compareMM;
			}                
			//해당달의 말일 체크후 해당달의 말일 추출
			var endDayOfMay = new Date(Number(compareYYYY),Number(compareMM),0)
			// var lastDay =  moment(endDayOfMay).format('DD');
			// //설정달일 의 말일이 차감일 상태값과 비교후 더 크면 말일 처리
			// if (Number(compareDD) > Number(lastDay)){
			//     compareDD = lastDay;
			// }
			//차감일 처리
			if(this.OLD_CHARGE_DAY == "32"){ //말일
				compareDD = moment(endDayOfMay).format('DD');
				//console.log("말일:" + compareDD);
			}else{
				compareDD = this.OLD_CHARGE_DAY
				if (Number(compareDD)< 10){
					compareDD = "0" + Number(compareDD);
				}
			}
			var compareYYYYMMDD = compareYYYY+compareMM+compareDD;
			
			//현제 날짜 추출
			var nowDate = new Date();
			var nowYYYY = moment(nowDate).format('YYYY');
			var nowMM = moment(nowDate).format('MM');
			var nowDD = moment(nowDate).format('DD');
			var nowYYYYMMDD = nowYYYY + nowMM + nowDD;
			
			//최초 차감 후 1달 이내 변경 불가 처리
			if (this.OLD_CHARGE_S_DAY_USE != undefined && this.OLD_CHARGE_S_DAY_USE != ""){
				//서비스 사용 여부 및 차감일 유효성 처리				
				if (this.OLD_CHARGE_USE_YN.toUpperCase() == "Y" && Number(compareYYYYMMDD) >= Number(nowYYYYMMDD) && Number(nowYYYYMMDD) >= Number(startYYYYMMDD) ){
					alert("최초 차감 후 1달 이내 변경 불가 합니다.");
					return;
				}
			}            


			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				//console.log(data);
				if (data.out_CODE == '1') {
					alert("상태변경이 완료되었습니다.");
					vue.schList();                    
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
.innerContent {min-height: 400px;;}
.table-view label{color: #555;font-size: 8pt;}
.table-view table tbody tr td:nth-child(2){border-right:0px;}
</style>
