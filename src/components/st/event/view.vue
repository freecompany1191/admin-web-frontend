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
						<td class="w150 bgGray textCenter">가맹점 명</td>
						<td class="w350">
							<label>{{viewData.ST_NAME}}</label>
						</td>
						<td></td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">가맹점 코드</td>
						<td class="w350">
							<label>{{viewData.ST_CODE}}</label>
						</td>
						<td></td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">사용 여부</td>
						<td class="w350">
							<label><input type="radio" name="USE_YN" v-model="viewData.USE_YN" value="Y"/>사용</label>
							<label><input type="radio" name="USE_YN" v-model="viewData.USE_YN" value="N"/>사용 안함</label>
						</td>
						<td>사용 여부를 체크합니다.</td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">이벤트 제목</td>
						<td class="w350">
							<input type="text" style="width:330px" v-model="viewData.EV3_CONTENT_1" ref="EV3_CONTENT_1"/>
						</td>
						<td>이벤트 제목을 입력하세요.</td>
					</tr>
					<tr v-show="false">
						<td class="w150 bgGray textCenter">할인 적용기간</td>
						<td class="w350">
							<input type="text" v-model="viewData.PERIOD_S_TXT"/> ~
							<input type="text" v-model="viewData.PERIOD_E_TXT"/>
						</td>
						<td></td>
					</tr>
					<tr v-show="false">
						<td class="w150 bgGray textCenter">할인 적용시간</td>
						<td class="w350">
							<input type="text" v-model="viewData.TIME_S_TXT"/> ~
							<input type="text" v-model="viewData.TIME_E_TXT"/>
						</td>
						<td>할인을 적용할 기간을 선택하세요.</td>
					</tr>
					<tr v-show="false">
						<td class="w150 bgGray textCenter">할인 방법</td>
						<td class="w350">
							<label><input type="radio" name="GIVE_TYPE" v-model="viewData.GIVE_TYPE" value="1"/>주문시적용</label>
							<label><input type="radio" name="GIVE_TYPE" v-model="viewData.GIVE_TYPE" value="2"/>쿠폰지급</label>
						</td>
						<td>할인을 적용할 시간을 선택하세요.</td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">해택 구분</td>
						<td class="w350">
							<label><input type="radio" name="REWARD_TYPE" v-model="viewData.REWARD_TYPE" value="1"/>금액할인</label>
							<label><input type="radio" name="REWARD_TYPE" v-model="viewData.REWARD_TYPE" value="2"/>무료상품</label>
							<label><input type="radio" name="REWARD_TYPE" v-model="viewData.REWARD_TYPE" value="3"/>경품증정</label>
						</td>
						<td>이벤트 혜택을 선택하세요.</td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">해택 조건</td>
						<td class="w350">
							<input type="number" v-model="viewData.ORD_LIMIT_1" ref="ORD_LIMIT_1" maxlength="5"/> 원 이상 주문 시
						</td>
						<td>할인혜택 조건 금액을 입력하세요.</td>
					</tr>
					<tr v-show="viewData.REWARD_TYPE == '1'">
						<td class="w150 bgGray textCenter">해택 내용</td>
						<td class="w350">
							<input type="number" v-model="viewData.DIS_PRICE_1"/>
							<label><input type="radio" name="DIS_TYPE_1" v-model="viewData.DIS_TYPE_1" value="1"/>원 할인</label>
							<label><input type="radio" name="DIS_TYPE_1" v-model="viewData.DIS_TYPE_1" value="2"/>% 할인</label>
						</td>
						<td>할인 금액(%)을 입력하세요.</td>
					</tr>
					<tr v-show="viewData.REWARD_TYPE == '2'">
						<td class="w150 bgGray textCenter">해택 내용</td>
						<td class="w350">
							<input type="hidden" id="FREE_GOODS_1" v-model="viewData.FREE_GOODS_1"/>
							<input type="text" class="w170" id="FREE_GOODS_NAME_1" v-model="viewData.FREE_GOODS_NAME_1"/>
							<a class="btn-box-r bgGray" v-on:click="schGoodsList();"><i class="fa fa-search grayicon"></i>상품 선택</a>
							<input type="number" class="w50" v-model="viewData.FREE_GOODS_CNT_1"/>개
						</td>
						<td>무료상품을 선택하세요.</td>
					</tr>
					<tr v-show="viewData.REWARD_TYPE == '3'">
						<td class="w150 bgGray textCenter">해택 내용</td>
						<td class="w350"><input type="text" class="w100p" v-model="viewData.GIFT_MEMO_1" ref="GIFT_MEMO_1"/></td>
						<td>경품내용을 입력하세요.</td>
					</tr>
					<tr>
						<td class="w150 bgGray textCenter">이미지 파일</td>
						<td class="w350">
							<input type="file" style="display:none" ref="IMG_FILE" v-file-uploader />
							<input type="text" class="w170" v-model="viewData.IMG_FILE" readonly>
							<span>
								<button type="button" v-on:click="schFileOpen()">파일찾기</button>
								<button type="button" v-if="viewData.IMG_FILE != undefined && viewData.IMG_FILE != ''" v-on:click="imgPreview()">미리보기</button>
							</span>
						</td>
						<td>카카오 웹 주문화면에 보여질 이벤트 이미지 파일을 선택하세요.</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 목록으로 버튼 -->
		<div style="padding-top: 15px;">
			<router-link class="btn-box bgGray overflowH floatleft" to="/stEventList"><i class="fa fa-undo"></i> 목록으로</router-link>
			<a class="btn-box-r bgGray overflowH floatRight" v-on:click="uddData();"><i class="fa fa-search grayicon"></i>정보수정</a>
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

const common = require('@/common/js/common')

export default {
	name: 'elView',
	data () {
		return {
			pageTitle: '이벤트 관리'
			, pageTitle_sub: '가맹점 이벤트 - 주문 금액별 할인 관리'
			, delFileName: '' //삭제할 파일명
			
			// 상세데이터
			, viewData: {}
		}
	},
	props: [ 'st_code' ],
	directives: {
		fileUploader: {
			bind(el, binding, vnode) {
				el.addEventListener('change', e => {
					vnode.context.viewData.IMG_FILE = e.target.files[0].name;
				});
			}
		},
	},
	created() {
		//로드시 실행
		this.viewData.PERIOD_S = util.dateFormat('', 'yyyyMMdd');
		this.viewData.PERIOD_S_TXT = util.dateFormat(this.viewData.PERIOD_S, 'yyyy-MM-dd');
		
		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.schView();
		})
	},
	computed: {
		//계산형 단일 실행
	}
	,
	methods: {
		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상세뷰
		schView: function() {
			//통신 호출
			httpCommon.sendPost(this, "202", "AW02_02_V01"
				, this.st_code + "│"
			, function suc(vue, data) {
				if (data.out_ROW1 == undefined || data.out_ROW1.length == 0) {
					alert("가맹점 정보가 없습니다.");
					history.back();
					return;
				}

				// 데이터가 없을시 초기화
				if (data.out_ROW2 == undefined || data.out_ROW2.length == 0) {
					data.out_ROW2.push({
						REWARD_TYPE:'2', USE_YN:'N', GIVE_TYPE:'1'
						, PERIOD_S:'', PERIOD_S_TXT:''
						, PERIOD_E:'20301231', PERIOD_E_TXT:'2030.12.31'
						, TIME_S:'0000', TIME_S_TXT:'00:00'
						, TIME_E:'2359', TIME_E_TXT:'23:59'
						, IMG_FILE: ''
					});
				}

				data.out_ROW2[0].ST_CODE = data.out_ROW1[0].ST_CODE;
				data.out_ROW2[0].ST_NAME = data.out_ROW1[0].ST_NAME;

				vue.viewData = data.out_ROW2[0];
				vue.viewData.PERIOD_S_TXT = util.dateFormat(vue.viewData.PERIOD_S, 'yyyy-MM-dd');
				vue.viewData.PERIOD_E_TXT = util.dateFormat(vue.viewData.PERIOD_E, 'yyyy-MM-dd');
				vue.viewData.TIME_S_TXT = util.dateFormat("00000000" + vue.viewData.TIME_S, 'HH:mm');
				vue.viewData.TIME_E_TXT = util.dateFormat("00000000" + vue.viewData.TIME_E, 'HH:mm');
				vue.delFileName = vue.viewData.IMG_FILE;
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상품검색 팝업
		schGoodsList: function() {
			let popupWidth = 400;
			let popupHeight = 492;
			let popupX = window.screen.availLeft + (window.screen.width / 2) - (popupWidth / 2);
			let popupY = (window.screen.height /2) - (popupHeight / 2);
			window.open("/stGoodsPopupView/" + this.st_code, "", "width=" + popupWidth + ", height=" + popupHeight + ", directories=no, status=no, scrollorbars=no, resizable=no, left=" + popupX + ", top=" + popupY);
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//정보 저장
		uddData: function() {
			if (!util_validate.validate_table(this.viewData.EV3_CONTENT_1, "이벤트 제목", "MN_GR_ST_EVNT", "EV3_CONTENT_1", "null", this.$refs.EV3_CONTENT_1)) { return; }
			
			if (!util_validate.validate_table(this.viewData.ORD_LIMIT_1, "해택 조건의 금액", "MN_GR_ST_EVNT_CFG", "ORD_LIMIT_1", "max:8|number:2", this.$refs.ORD_LIMIT_1)) { return; }
			if (this.viewData.DIS_TYPE_1 == '1') { // 원 할인 (%퍼센트 설정일 경우 3자 이하로 조정)
				if (!util_validate.validate_table(this.viewData.DIS_PRICE_1, "금액할인의 해택 내용 할인금액", "MN_GR_ST_EVNT_CFG", "DIS_PRICE_1", "max:8|number:2", this.$refs.DIS_PRICE_1)) { return; }
			} else if (this.viewData.DIS_TYPE_1 == '2') {
				if (!util_validate.validate_table(this.viewData.DIS_PRICE_1, "금액할인의 해택 내용 할인금액", "MN_GR_ST_EVNT_CFG", "DIS_PRICE_1", "max:3|number:2", this.$refs.DIS_PRICE_1)) { return; }
			}
			if (!util_validate.validate_table(this.viewData.FREE_GOODS_CNT_1, "무료상품의 해택 상품 갯수", "MN_GR_ST_EVNT_CFG", "FREE_GOODS_CNT_1", "max:3|number:2", this.$refs.FREE_GOODS_CNT_1)) { return; }

			if (!util_validate.validate_table(this.viewData.GIFT_MEMO_1, "경품증정의 해택 내용", "MN_GR_ST_EVNT_CFG", "GIFT_MEMO_1", "", this.$refs.GIFT_MEMO_1)) { return; }
			
			if (this.viewData.USE_YN == 'Y') {
				if (!util_validate.validate_table(this.viewData.ORD_LIMIT_1, "해택 조건의 금액", "MN_GR_ST_EVNT_CFG", "ORD_LIMIT_1", "min:1|number:2", this.$refs.ORD_LIMIT_1)) { return; }
			}

			if (this.viewData.REWARD_TYPE == '1') {
				if (!util_validate.validate_table(this.viewData.DIS_PRICE_1, "금액할인의 해택 내용 할인금액", "MN_GR_ST_EVNT_CFG", "DIS_PRICE_1", "null", this.$refs.DIS_PRICE_1)) { return; }
				if (!util_validate.validate_table(this.viewData.DIS_TYPE_1, "금액할인의 해택 내용 할인방식", "MN_GR_ST_EVNT_CFG", "DIS_TYPE_1", "null", this.$refs.DIS_PRICE_1)) { return; }
			}
			if (this.viewData.REWARD_TYPE == '2') {
				if (!util_validate.validate_table(this.viewData.FREE_GOODS_CNT_1, "무료상품의 해택 상품 갯수", "MN_GR_ST_EVNT_CFG", "FREE_GOODS_CNT_1", "null", this.$refs.FREE_GOODS_CNT_1)) { return; }
			}
			
			// if (!util_validate.validate_input(this.viewData.GIFT_MEMO_1, "해택 내용", "null|min:1", this.$refs.GIFT_MEMO_1)) { return; }

			//파일이 없으면 파일업로드는 패스
			//파일 업로드 실패시 전문 전송 안함
			if (this.$refs.IMG_FILE.files[0] != undefined) {
				// 통신 호출
				httpCommon.sendFilePost(this, "store_event/"
					, this.st_code
					, this.delFileName				//삭제파일명
					, this.$refs.IMG_FILE.files[0]	//이미지파일
				, function suc(vue, data) {
					//파일 업로드 성공시 전문데이터 전송
					// console.log("file : "+data.out_ROW1[0].FILE_NAME);
					// console.log("path : "+data.out_ROW1[0].UPLOAD_PATH);
					vue.delFileName = data.out_ROW1[0].FILE_NAME;
					vue.viewData.IMG_FILE = "/" + data.out_ROW1[0].UPLOAD_PATH + data.out_ROW1[0].FILE_NAME;
					vue.$refs.IMG_FILE.value = ''; // 파일초기화
					vue.uddTransData();
				});
			} else {
				//파일이 없으면 전문만 전송
				// console.log("nofile : ");
				this.uddTransData();
			}
		},
		uddTransData: function() { //전문 데이터 전송
			this.viewData.FREE_GOODS_1 = document.getElementById("FREE_GOODS_1").value;
			this.viewData.FREE_GOODS_NAME_1 = document.getElementById("FREE_GOODS_NAME_1").value;

			// 통신 호출
			httpCommon.sendPost(this, "202", "AW02_03_V01"
				, this.st_code + "│"									// 가맹점 코드

				+ util.getNull(this.viewData.USER_ID, "") + "│"			// 사용자_고유ID
				+ util.getNull(this.viewData.USE_YN, "") + "│"			// 사용여부
				+ util.getNull(this.viewData.PERIOD_S, "") + "│"		// 할인적용기간_시작
				+ util.getNull(this.viewData.PERIOD_E, "") + "│"		// 할인적용기간_종료
				+ util.getNull(this.viewData.TIME_S, "") + "│"			// 할인적용시간_시작

				+ util.getNull(this.viewData.TIME_E, "") + "│"			// 할인적용시간_종료
				+ util.getNull(this.viewData.GIVE_TYPE, "") + "│"		// 할인방법 구분(1: 주문시적용, 2: 쿠폰지급)
				+ util.getNull(this.viewData.REWARD_TYPE, "") + "│"		// 해택 구분(1: 금액할인, 2: 무료상품, 3: 경품제공)
				+ util.getNull(this.viewData.ORD_LIMIT_1, "") + "│"		// 주문 최소금액_1
				+ util.getNull(this.viewData.DIS_PRICE_1, "") + "│"		// 금액 할인가격_1

				+ util.getNull(this.viewData.DIS_TYPE_1, "") + "│"		// 금액 할인구분_1(1: 원 할인, 2: % 할인)
				+ util.getNull(this.viewData.FREE_GOODS_1, "") + "│"	// 무료 상품_1(상품일련번호)
				+ util.getNull(this.viewData.FREE_GOODS_CNT_1, "") + "│"// 무료 상품 지급개수_1
				+ util.getNull(this.viewData.GIFT_MEMO_1, "") + "│"		// 경품 내용_1
				+ util.getNull(this.viewData.IMG_FILE, "") + "│"		// 이미지 파일명
				+ util.getNull(this.viewData.EV3_CONTENT_1, "") + "│"		// 이벤트 제목
			, function suc(vue, data) {
				alert("정보가 저장되었습니다.");
			});
		},
		// 파일찾기
		schFileOpen: function() {
			this.$refs.IMG_FILE.click();
		},
		// 이미지 미리보기
		imgPreview: function() {
			if (util.isNull(this.viewData.IMG_FILE)) {
				alert("이미지 파일명이 없습니다.");
				return;
			}
			
			if (this.$refs.IMG_FILE.files.length > 0) {
				alert("업로드 후 볼 수 있습니다.");
				return;
			}

			let popupWidth = 500;
			let popupHeight = 500;
			let popupX = window.screen.availLeft + (window.screen.width / 2) - (popupWidth / 2);
			let popupY = (window.screen.height /2) - (popupHeight / 2);
			window.open(common.IMG_URL + this.viewData.IMG_FILE, "", "width=" + popupWidth + ", height=" + popupHeight + ", directories=no, status=no, scrollorbars=no, resizable=no, left=" + popupX + ", top=" + popupY);
		}
	},
	watch: {
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			if (to.name == "stEventView") {
				this.$router.go(-1);
			}
		}
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
