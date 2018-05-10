<template>
  <div class="innerContent overflowH">
		<!-- 타이틀 -->
		<div>
			<h2 class="bighead-Title">
				<span v-text="pageTitle">{{pageTitle}}</span>
				<span class="bighead-Title-sub" v-text="pageTitle_sub">{{pageTitle_sub}}</span>
			</h2>
		</div>
		<!-- 뷰 영역 -->
		<div class="table-view">
			<table>
				<tbody v-for="row in arrList" :key="row.ST_CODE">
					<tr>
						<td class="w150 bgGray textCenter">가맹점 명</td>
						<td class="w350">{{row.ST_NAME}}</td>
						<td class="w150 bgGray textCenter">가맹점 코드</td>
						<td>{{row.ST_CODE}}</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">가맹점 주</td>
						<td>{{row.ST_OWNER}}</td>
						<td class="bgGray textCenter">연락처</td>
						<td>{{row.ST_TEL}}</td>
					</tr>
					<tr>
						<td class="bgGray textCenter">신청 상태</td>
						<td colspan="3">
							<label><input type="radio" name="REQ_STATUS" id="REQ_STATUS" ref="REQ_STATUS" v-model="REQ_STATUS" value="1" />신청</label>
							<label><input type="radio" name="REQ_STATUS" id="REQ_STATUS" ref="REQ_STATUS" v-model="REQ_STATUS" value="2"/>신청처리중</label>
							<label><input type="radio" name="REQ_STATUS" id="REQ_STATUS" ref="REQ_STATUS" v-model="REQ_STATUS" value="3"/>처리완료</label>
							<label><input type="radio" name="REQ_STATUS" id="REQ_STATUS" ref="REQ_STATUS" v-model="REQ_STATUS" value="0"/>신청취소</label>                            
							<a class="btn-box-r bgGray overflowH floatRight" v-on:click="uddData();"><i class="fa fa-search grayicon"></i>상태변경</a>
						</td>
					</tr>                    
				</tbody>
			</table>
		</div>

		<!-- 텝메뉴 -->
		<div>
			<div class="tabmenu">
				<ul>
					<li style="back" @click="ischList('ins');">설치비 정보</li>
					<li @click="ischList('plus');">플러스친구 정보</li>
					<li @click="ischList('act');">과금 정보</li>
				</ul>
			</div>
			<div class="innerContent overflowH">
				<router-view/>
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
	name: 'reqView',
	data () {
		return {
			pageTitle: '신청관리'
			, pageTitle_sub: '카카오 웹 주문 서비스 신청내역을 관리하실수 있습니다.'
			//신청상태
			, REQ_STATUS: '1'
			//상세데이터 배열
			, arrList: []
		}
	},
	props : [ 'st_code', 'multi_type' ],
	created(){
		//로드시 실행             
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.schList();
			this.ischList('ins');
		})
	},
	computed : {
		//계산형 단일 실행
	},
	methods: { 
		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//신청관리 상세뷰
		schList: function(){
			//변수할당
			var tmp0 = this.st_code;
			//전문번호
			var IN_REQ_NUM = "AW01_02_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│";  // 가맹점_코드
			//console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
			this.arrList = [];
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				vue.arrList = data.out_ROW1;                
				vue.REQ_STATUS = vue.arrList[0].REQ_STATUS;
				//console.log(data);
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//신청상태 변경
		uddData: function(){
			//변수할당
			var tmp0 = authUtil.getUserInfo().userId;
			var tmp1 = this.st_code;
			var tmp2 = this.REQ_STATUS;
			//전문번호
			var IN_REQ_NUM = "AW01_03_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 사용자_ID (신청/수정 사용자)
					+ tmp1 + "│"    // 가맹점_코드
					+ tmp2 + "│"    // 신청_상태 (1: 신청, 2: 신청처리중, 3: 처리완료, 0: 신청취소) 
					;
			if (!util_validate.validate_input(tmp2, "신청_상태", "null", this.$refs.REQ_STATUS)) { return; }
			//console.log(IN_VALUE);
			//통신 호출
			httpCommon.sendPost(this, "201", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {                
				//console.log(data);
				if (data.out_CODE == '1') {
					alert("상태변경이 완료되었습니다.");
				}
			});
		},        
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//탭메뉴 라우터 전환처리
		ischList: function(type){			
			this.$router.push({ name: type, params: {st_code: this.st_code, multi_type: this.multi_type} })
		}
	},
	watch : {    
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			if (to.name == "kakaoOrdReqView"){
				this.$router.go(-1);
			}else{
				//CSS 배경 화면 처리
				$(".tabmenu ul li").css('background-color', '#ffffff')            
				switch (to.name) {
					case 'ins':
						$(".tabmenu ul li").eq(0).css('background-color', '#efefef')                    
						break;
					case 'plus':
						$(".tabmenu ul li").eq(1).css('background-color', '#efefef')
						break;
					case 'act':
						$(".tabmenu ul li").eq(2).css('background-color', '#efefef')
						break;            
					default:
						$(".tabmenu ul li").eq(0).css('background-color', '#efefef')
						break;
				}
			}
		}
	}

}
</script>

<style scoped>

</style>
