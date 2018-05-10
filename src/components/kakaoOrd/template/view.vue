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
				<tbody>
					<tr>
						<td class="w150 bgGray textCenter">템플릿 코드</td>
						<td class="w350">
							<label>{{viewData.TPLT_CODE}}</label>
						</td>
						<td></td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">템플릿 구분</td>
						<td class="w350">
							<select class="w120" v-model="viewData.TPLT_TYPE">
								<option v-for="row in TPLT_TYPE_LIST" :key="row.CODE" v-bind:value="row.CODE">
									{{row.NAME}}
								</option>
							</select>
						</td>
						<td>템플릿 구분에 따라, 발송 시 연결URL이 자동설정 됩니다.</td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">템플릿 제목</td>
						<td class="w350"><input type="text" class="w100p" v-model="viewData.TPLT_TITLE" ref="TPLT_TITLE"/></td>
						<td>템플릿 제목을 입력하세요.</td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">템플릿 내용</td>
						<td>
							<textarea rows="10" cols="45" v-model="viewData.TPLT_CONTENT" ref="TPLT_CONTENT">
							</textarea>
						</td>
						<td>템플릿 내용을 입력하세요.</td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">버튼 타입</td>
						<td class="w350">
							<select class="w120" v-model="viewData.BTN_TYPE" :disabled="tplt_code != '0'">
								<option value="">없음</option>
								<option value="Y">자유설정</option>
							</select>
						</td>
						<td>버튼 타입을 선택하세요.</td>
					</tr>
					<tr v-show="viewData.BTN_TYPE == 'Y'">
						<td class="w150 bgGray textCenter">버튼 명</td>
						<td class="w350"><input type="text" class="w100p" v-model="viewData.BTN_INFO" ref="BTN_INFO"/></td>
						<td>버튼명을 입력하세요.</td>
					</tr>
					<tr v-show="viewData.BTN_TYPE == 'Y'">
						<td class="w150 bgGray textCenter">아웃링크 URL</td>
						<td class="w350"><input type="text" class="w100p" v-model="viewData.BTN_URL" v-bind:readonly="true"/></td>
						<td>버튼에 할당할 변수를 입력하세요.</td>
					</tr>
					<tr v-show="viewData.APPR_STATUS == '2'">
						<td class="w150 bgGray textCenter">반려 사유</td>
						<td class="w350">
							{{viewData.ERROR_MSG}}
						</td>
						<td>반려된 사유를 표시합니다.</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 목록으로 버튼 -->
		<div style="padding-top: 15px;">
			<router-link class="btn-box bgGray overflowH floatleft" to="/kakaoOrdTmpList"><i class="fa fa-undo"></i> 목록으로</router-link>
			<a v-if="tplt_code == '0'" class="btn-box-r bgGray overflowH floatRight" v-on:click="uddData();"><i class="fa fa-search grayicon"></i>등록</a>
			<span v-if="tplt_code != '0'" class="floatRight">수정불가</span>
		</div>
		<transition name="fade">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
//HTTP 통신 임포트
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import util_validate from '@/common/js/utils/util_validate.js';
import authUtil from '@/common/js/utils/authUtil.js';

export default {
	name: 'elView',
	data () {
		return {
			pageTitle: '그룹 템플릿 관리'
			, pageTitle_sub: '그룹 템플릿 관리 등록'
			
			//상세데이터
			, viewData: {
				TPLT_TYPE:'1'		// 템플릿_구분 (1: 주문하기, 2: 평가하기, 3: 주문접수, 4: 출발안내)
				, TPLT_TITLE:''		// 템플릿_제목
				, TPLT_CONTENT:''	// 템플릿_내용
				, BTN_INFO:''		// 버튼_정보 (버튼명)
				, BTN_TYPE:''		// 버튼타입
				, BTN_URL:'#{url}'	// 버튼URL
			}
			, TPLT_TYPE_LIST: [
				{CODE:"1", NAME:"주문하기"}
				, {CODE:"2", NAME:"평가하기"}
				, {CODE:"3", NAME:"접수하기"}
				, {CODE:"4", NAME:"출발안내"}
				, {CODE:"5", NAME:"취소안내"}
			]
		}
	},
	props: [ 'tplt_code' ],
	created() {
		//로드시 실행
		this.schView();
	},
	computed: {
		//계산형 단일 실행
	},
	methods: { 
		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상세뷰
		schView: function() {
			if (util.isNull(this.tplt_code) || this.tplt_code == '0') {
				// 신규등록
				return;
			}
			//통신 호출
			httpCommon.sendPost(this, "203", "AW03_04_V01"
				, this.tplt_code + "│"
			, function suc(vue, data) {
				if (data.out_ROW1 == undefined || data.out_ROW1.length == 0) {
					alert("데이터가 없습니다.");
					return;
				}
				
				data.out_ROW1[0].BTN_TYPE = util.getNull(data.out_ROW1[0].BTN_TYPE, "");
				data.out_ROW1[0].BTN_INFO = util.getNull(data.out_ROW1[0].BTN_INFO, "");
				data.out_ROW1[0].BTN_URL = util.getNull(data.out_ROW1[0].BTN_URL, "#{url}");

				data.out_ROW1[0].BTN_TYPE = data.out_ROW1[0].BTN_INFO == '' ? "" : "Y";

				vue.viewData = data.out_ROW1[0];
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//정보 등록
		uddData: function() {
			if (!util_validate.validate_table(this.viewData.TPLT_TITLE, "템플릿 제목", "MN_SY_GRP_TPLT", "TPLT_TITLE", "null", this.$refs.TPLT_TITLE)) { return; }
			if (!util_validate.validate_table(this.viewData.TPLT_CONTENT, "템플릿 내용", "MN_SY_GRP_TPLT", "TPLT_CONTENT", "null", this.$refs.TPLT_CONTENT)) { return; }

			// 버튼 사용안할경우 버튼명 제거
			if (util.isNull(this.viewData.BTN_TYPE))
				this.viewData.BTN_INFO = "";
			if (!util_validate.validate_table(this.viewData.BTN_INFO, "버튼명", "MN_SY_GRP_TPLT", "BTN_INFO", "", this.$refs.BTN_INFO)) { return; }

			// 통신 호출
			httpCommon.sendPost(this, "203", "AW03_02_V01"
				, authUtil.getUserInfo().userId + "│"					// 사용자 ID

				+ util.getNull(this.viewData.TPLT_TYPE, "") + "│"		// 템플릿_구분 (1: 주문하기, 2: 평가하기, 3: 주문접수, 4: 출발안내)
				+ util.getNull(this.viewData.TPLT_TITLE, "") + "│"		// 템플릿_제목
				+ util.getNull(this.viewData.TPLT_CONTENT, "") + "│"	// 템플릿_내용
				+ util.getNull(this.viewData.BTN_INFO, "") + "│"		// 버튼_정보 (버튼명)
			, function suc(vue, data) {
				alert("정보가 저장되었습니다.");
			});
		}
	},
	watch: {
		//데이터가 변할시마다 함수 호출
	}
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
	transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
	opacity: 0
}
</style>
