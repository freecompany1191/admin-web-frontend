<template>
	<div style="padding:0; margin:0;" v-if="this.userInfo.multiType != 'S' && this.userInfo.multiType != 'N'">
		<select v-if="this.hd_view_yn" v-bind:style="{width:find_param.hd_width}" v-model="info.selectHd" v-on:change="getBrList();">
			<option value="">제휴본사 전체</option>
			<option v-for="row in arrSelectHd" :key="row.HD_CODE" v-bind:value="row">
				{{row.HD_NAME}}
			</option>
		</select>
		<select v-if="this.br_view_yn" v-bind:style="{width:find_param.br_width}" v-model="info.selectBr" v-on:change="getStList();">
			<option value="">총판 전체</option>
			<option v-for="row in arrSelectBr" :key="row.BR_CODE" v-bind:value="row">
				{{row.BR_NAME}}
			</option>
		</select>
		<select v-if="this.st_view_yn" v-bind:style="{width:find_param.st_width}" v-model="info.selectSt" v-on:change="getStMultiList();">
			<option value="">가맹점 전체</option>
			<option v-for="row in arrSelectSt" :key="row.ST_CODE" v-bind:value="row">
				{{row.ST_NAME}}
			</option>
		</select>
		<select v-if="this.st_multi_view_yn" v-bind:style="{width:find_param.st_multi_width}" v-model="info.selectStMulti">
			<option value="">멀티가맹점 전체</option>
			<option v-for="row in arrSelectStMulti" :key="row.ST_CODE" v-bind:value="row">
				{{row.ST_NAME}}
			</option>
		</select>
	</div>
</template>

<script>
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil.js';
import eventBus from '@/common/include/eventBus.js';

export default {
	name: 'find_branch',
	data () {
		return {
			info: {
				hd_code: ''
				, br_code: ''
				, st_code: ''
				, multi_type: ''
				, multi_st_code: ''

				// 선택된 오브젝트
				, selectHd: ''
				, selectBr: ''
				, selectSt: ''
				, selectStMulti: ''
			}
			// 본사 리스트
			, arrSelectHd: []
			// 총판 리스트
			, arrSelectBr: []
			// 가맹점 리스트
			, arrSelectSt: []
			// 멀티가맹점 리스트
			, arrSelectStMulti: []

			, userInfo: authUtil.getUserInfo()
			, user_type_cd: ''

			, find_param: {
				type_cd: 'A'	// 가맹점선택 타입(A:전체 HD:본사 BR:총판 ST:가맹점(멀티가맹점제외))
				, hd_width: '170px'
				, br_width: '170px'
				, st_width: '170px'
				, st_multi_width: '170px'
			}

			, hd_view_yn: true
			, br_view_yn: true
			, st_view_yn: true
			, st_multi_view_yn: true
		}
	},
	created() {
		// 로드시 실행
		this.info.hd_code = util.getNull(this.$route.query.hd_code, this.userInfo.hdCode);
		this.info.br_code = util.getNull(this.$route.query.br_code, this.userInfo.brCode);
		this.info.st_code = util.getNull(this.$route.query.st_code, this.userInfo.stCode);
		this.info.multi_type = util.getNull(this.$route.query.multi_type, this.userInfo.multiType);
		this.info.multi_st_code = util.getNull(this.$route.query.multi_st_code, '');

		/**
		 * 이벤트버스
		 * param : 커스텀 정보 수신
		 */
		this.$EventBus.$on(eventBus.FIND_BRANCH_CALLBACK, (param) => {
			this.find_param = param;

			// 빈값일 경우 디폴트값 설정
			this.find_param.type_cd = util.getNull(this.find_param.type_cd, 'A');
			this.find_param.hd_width = util.getNull(this.find_param.hd_width, '170px');
			this.find_param.br_width = util.getNull(this.find_param.br_width, '170px');
			this.find_param.st_width = util.getNull(this.find_param.st_width, '170px');
			this.find_param.st_multi_width = util.getNull(this.find_param.st_multi_width, '170px');
		});
		this.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, this.info);

		this.$nextTick(function () {
			if (this.find_param.type_cd == 'A') {
				this.user_type_cd = this.userInfo.userTypeCd.substr(0, 1);

				this.hd_view_yn = this.user_type_cd == '9' ? true : false;
				this.br_view_yn = this.user_type_cd == '9' || this.user_type_cd == '7' ? true : false;
				this.st_view_yn = this.user_type_cd != '3' ? true : false;
				this.st_multi_view_yn = this.info.selectSt.MULTI_TYPE == 'M' || this.userInfo.multiType == 'M' ? true : false;

				if (this.user_type_cd == '9') {
					this.getHdList();
				}
				else if (this.user_type_cd == '7') {
					this.getBrList();
				}
				else if (this.user_type_cd == '5') {
					this.getStList();
				}
				else if (this.user_type_cd == '3' && this.userInfo.multiType == 'M') {
					this.getStMultiList();
				}
			}
			else if (this.find_param.type_cd == 'HD') {
				this.hd_view_yn = true;
				this.br_view_yn = false;
				this.st_view_yn = false;
				this.st_multi_view_yn = false;
				
				this.getHdList();
			}
			else if (this.find_param.type_cd == 'BR') {
				this.hd_view_yn = true;
				this.br_view_yn = true;
				this.st_view_yn = false;
				this.st_multi_view_yn = false;

				this.getHdList();
			}
			else if (this.find_param.type_cd == 'ST') {
				this.hd_view_yn = true;
				this.br_view_yn = true;
				this.st_view_yn = true;
				this.st_multi_view_yn = false;
				
				this.getHdList();
			}

			// 리스트 조회
			this.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 1, this.info);
		});
	},
	computed: {
		// 계산형 단일 실행
	},
	methods: {
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 제휴본사리스트 가져오기
		getHdList: function() {
			// 전문번호
			let IN_REQ_NUM = "GR00_01_V01";
			// 전문데이터
			let IN_VALUE = "A" + "│"	// 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
				+ "2" + "│"				// 정렬_구분 (1: 코드순, 2: 이름순)
				;

			// 배열초기화
			this.arrSelectHd = [];
			this.info.selectHd = '';
			this.arrSelectBr = [];
			this.info.selectBr = '';
			this.arrSelectSt = [];
			this.info.selectSt = '';
			this.arrSelectStMulti = [];
			this.info.selectStMulti = '';

			this.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, this.info);

			// 통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
				vue.arrSelectHd = data.out_ROW1;

				for (let i = 0; vue.arrSelectHd.length; i++) {
					if (vue.info.hd_code == vue.arrSelectHd[i].HD_CODE) {
						vue.info.selectHd = vue.arrSelectHd[i];
						vue.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, vue.info);

						vue.getBrList();
						break;
					}
				}
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 총판리스트 가져오기
		getBrList: function() {
			// 변수할당
			let tmp_hdCode = util.getNull(this.info.selectHd.HD_CODE, this.userInfo.hdCode);

			// 전문번호
			let IN_REQ_NUM = "GR00_02_V01";
			// 전문데이터
			let IN_VALUE = "A" + "│"	// 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ "2" + "│"			// 정렬_구분 (1: 코드순, 2: 이름순)
					+ tmp_hdCode + "│"	// 검색_제휴본사_코드
					;

			// 배열초기화
			this.arrSelectBr = [];
			this.info.selectBr = '';
			this.arrSelectSt = [];
			this.info.selectSt = '';
			this.arrSelectStMulti = [];
			this.info.selectStMulti = '';

			this.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, this.info);

			if (!this.br_view_yn) return;

			if (util.isNull(tmp_hdCode)) return;

			// 통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
				vue.arrSelectBr = data.out_ROW1;

				for (let i = 0; vue.arrSelectBr.length; i++) {
					if (vue.info.br_code == vue.arrSelectBr[i].BR_CODE) {
						vue.info.selectBr = vue.arrSelectBr[i];
						vue.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, vue.info);

						vue.getStList();
						break;
					}
				}
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 가맹점리스트 가져오기
		getStList: function() {
			// 변수할당
			let tmp_hdCode = util.getNull(this.info.selectHd.HD_CODE, this.userInfo.hdCode);
			let tmp_brCode = util.getNull(this.info.selectBr.BR_CODE, this.userInfo.brCode);

			// 전문번호
			let IN_REQ_NUM = "GR00_03_V01";
			// 전문데이터
			let IN_VALUE = "A" + "│"	// 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ "2" + "│"			// 정렬_구분 (1: 코드순, 2: 이름순)
					+ tmp_hdCode + "│"	// 검색_제휴본사_코드
					+ tmp_brCode + "│"	// 검색_총판_코드
					+ "A" + "│"			// 검색_멀티_구분 (NULL: 전체, N: 개별, M: 마스터, S: 종속, A: 개별/마스터) 
					;

			// 배열초기화
			this.arrSelectSt = [];
			this.info.selectSt = '';
			this.arrSelectStMulti = [];
			this.info.selectStMulti = '';
			
			this.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, this.info);
			
			if (!this.st_view_yn) return;

			if (util.isNull(tmp_hdCode)) return;

			// 통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
				vue.arrSelectSt = data.out_ROW1;
				
				for (let i = 0; vue.arrSelectSt.length; i++) {
					if (vue.info.st_code == vue.arrSelectSt[i].ST_CODE) {
						vue.info.selectSt = vue.arrSelectSt[i];
						vue.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, vue.info);

						if (vue.selectSt.MULTI_TYPE == 'M') {
							vue.getStMultiList();
						}
						break;
					}
				}
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 멀티가맹점리스트 가져오기
		getStMultiList: function() {
			if (this.find_param.type_cd == 'A') {
				this.st_multi_view_yn = this.info.selectSt.MULTI_TYPE == 'M' || this.userInfo.multiType == 'M' ? true : false;
			}

			if (!this.st_multi_view_yn) return;

			// 멀티가맹점이 아니면 가져오지 않음
			if (util.getNull(this.info.selectSt.MULTI_TYPE, this.userInfo.multiType) != 'M') {
				return;
			}

			// 변수할당
			let tmp_stCode = util.getNull(this.info.selectSt.ST_CODE, this.userInfo.stCode);

			// 전문번호
			let IN_REQ_NUM = "GR00_04_V01";
			// 전문데이터
			let IN_VALUE = "A" + "│"	// 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ "2" + "│"			// 정렬_구분 (1: 코드순, 2: 이름순)
					+ tmp_stCode + "│"	// 검색_가맹점_코드 (마스터 가맹점)
					;

			// 배열초기화
			this.arrSelectStMulti = [];
			this.selectStMulti = '';

			this.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, this.info);

			// 통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
				vue.arrSelectStMulti = data.out_ROW1;
				
				for (let i = 0; vue.arrSelectStMulti.length; i++) {
					if (vue.info.multi_st_code == vue.arrSelectStMulti[i].ST_CODE) {
						vue.info.selectStMulti = vue.arrSelectStMulti[i];
						vue.$EventBus.$emit(eventBus.FIND_BRANCH_RECEIVER, 0, vue.info);
						break;
					}
				}
			});
		}
	},
	watch: {
		// 비동기 적합
		// 데이터가 변할시마다 함수 호출
	}
	,
	beforeDestroy() {
		this.$EventBus.$off(eventBus.FIND_BRANCH_CALLBACK);
	}
	
}
</script>

<style>

</style>
