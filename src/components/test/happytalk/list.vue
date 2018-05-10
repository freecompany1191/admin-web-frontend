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
					<tr v-if="this.userInfo.multiType != 'S' && this.userInfo.multiType != 'N'">
						<td class="search-title">가맹점선택</td>
						<td><include-find-branch></include-find-branch></td>
					</tr>
					<tr>
						<td class="search-title">발송시점</td>
						<td>
							<label><input type="radio" name="sendTimeType" v-model="sendTimeType" value="" checked/>전체</label>
							<label><input type="radio" name="sendTimeType" v-model="sendTimeType" value="1"/>접수</label>
							<label><input type="radio" name="sendTimeType" v-model="sendTimeType" value="2"/>출발</label>
							<label><input type="radio" name="sendTimeType" v-model="sendTimeType" value="3"/>완료</label>
							<label><input type="radio" name="sendTimeType" v-model="sendTimeType" value="5"/>취소</label>
						</td>
					</tr>
				</table>
			</div>
			<!-- 검색버튼 -->
			<div class="search-btn-box">
				<a class="btn-box-r bgGray overflowH" v-on:click="search();"><i class="fa fa-search grayicon"></i> 검색</a>
			</div>
		</div>

		<!-- 검색결과 -->
		<div class="search-box">
			<div class="table-top floatLeft"><span>*전체 <strong class="theRed">{{pageInfo.totalCount}}</strong>개의 데이타가 있습니다.</span></div>
			<button class="btn-box-r bgGray overflowH floatRight" style="line-height: 30px;width:90px; margin-left:5px" v-on:click="schView('0')">등록</button>
		</div>

		<!-- 리스트 -->
		<div class="table-list">
			<table>
				<thead>
					<tr>
						<th width="5%"><input type="checkbox" v-model="selectAll" ></th>
						<th width="25%">가맹점명</th>
						<th width="10%">발송여부</th>
						<th colspan="2" width="20%">발송시점</th>
						<th width="13%">대상구분</th>
						<th width="13%">누적이용회수</th>
						<th width="20%">수정일시</th>
					</tr>
				</thead>
				<tbody id="happyTalkList">
					<tr v-if="pageInfo.totalCount == 0">
						<td colspan="8">내역이 없습니다</td>
					</tr>
					<tr v-else v-for="talk in dataList" :key="talk.NTALK_SEQ_NO">
						<td><input type="checkbox" v-model="selected" :value="talk.NTALK_SEQ_NO"></td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);" style="text-align:left;">{{talk.ST_NAME_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.DATA_STATUS_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_TIME_TYPE_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_TIME_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_CU_TYPE_STR}}</td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.SEND_CU_END_CNT_STR}} </td>
						<td v-on:click="schView(talk.NTALK_SEQ_NO);">{{talk.MOD_DATE_STR}}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<br><br>

		<div>
			<ul>
				<button class="btn-box-r bgGray overflowH floatLeft" style="line-height: 30px;width:90px;" v-on:click="updateStatus('1')">발송</button>
				<button class="btn-box-r bgGray overflowH floatLeft" style="line-height: 30px;width:90px; margin-left:5px" v-on:click="updateStatus('2')">발송안함</button>
				<button class="btn-box-r bgGray overflowH floatLeft" style="line-height: 30px;width:90px; margin-left:5px" v-on:click="updateStatus('0')">삭제</button>
			</ul>
		</div>
		<!-- 페이징 -->
		<include-list-paging></include-list-paging>
	</div>
</template>

<script>
import Constant from '@/common/js/constant'
import httpCommon from '@/common/js/http/http-common.js'
import util from '@/common/js/utils/util.js'
import authUtil from '@/common/js/utils/authUtil.js'
import includeFindBranch from '@/common/include/FindBranch'
import includeListPaging from '@/common/include/ListPaging'
import eventBus from '@/common/include/eventBus.js'
import { mapGetters } from 'vuex'

export default {
	name: 'testList',
	data () {
		return {
			pageTitle: '해피톡관리'
			, pageTitle_sub: '해피톡 목록을 설정하실수 있습니다'
			, selected: []		  // 체크박스 리스트
			, sendTimeType: ''    // 발송시점 라디오 박스
			//선택값 유지 변수
			, saveValue: {
				sendTimeType: '' //발송시점
			}
			, userInfo: authUtil.getUserInfo()
		}
	},
	components: {
		'include-find-branch' : includeFindBranch
		, 'include-list-paging' : includeListPaging
	},
	computed : {
		//계산형 단일 실행
		...mapGetters({
			branchInfo : Constant.GET_FIND_BRANCH_INFO, //Vuex 가맹점 선택 정보 가져오기
			pageInfo   : Constant.GET_PAGE_INFO,        //Vuex 페이지 정보 가져오기
			dataList   : Constant.GET_OUT_ROW1,         //Vuex 리스트 데이터 가져오기
			sessionValue : Constant.GET_SESSION_VALUE	//Vuex 세션스토리지 파라메터 VALUE 가져오기
		}),
		//전체선택
		selectAll: {
			get: function () {
				return this.dataList ? this.selected.length == this.dataList.length : false;
			},
			set: function (value) { 
				let selected = [];
				if (value) {
					this.dataList.forEach(function (talk) {
						selected.push(talk.NTALK_SEQ_NO);
					});
				}

				this.selected = selected;
			}
		}
	},
	methods: {
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 상태수정
		updateStatus: function(dataStatus) {
			if (this.selected.length == 0) {
				alert("선택된 톡이 없습니다");
				return;
			}

			// 삭제시 확인창 출력
			if (dataStatus == 0) {
				var result = confirm("삭제 하시겠습니까?"); 
				if (result == false) {
					return;
				}
			}
			
			for (var i = 0 ; i < this.selected.length; i++) {
				//전문번호
				var IN_REQ_NUM = "AW04_06_V01";

				var tmp0 = this.userInfo.userId;
				var tmp1 = this.selected[i];
				var tmp2 = dataStatus;

				var IN_VALUE = tmp0 + "│"	// 사용자_ID (로그인정보)
					+ tmp1 + "│"			// 알림톡_일련_번호
					+ tmp2 + "│"			// 데이터_상태 (0: 삭제, 1: 발송, 2: 발송안함)
					;

				// 통신 호출
				httpCommon.sendPost(this, "204", IN_REQ_NUM, IN_VALUE, function suc(vue, data) { 
					 if (data.out_CODE == '1') {
					 }
				});
			}

			for (var j = 0 ; j < this.selected.length; j++) {

				for (var i = 0; i < this.dataList.length; i++) {

					if (this.dataList[i].NTALK_SEQ_NO == this.selected[j]) {

						if (dataStatus == 0) {
							this.dataList.splice(i, 1);
						} else if (dataStatus == 1) {
							this.dataList[i].DATA_STATUS = dataStatus;
							this.dataList[i].DATA_STATUS_STR = "발송";
						} else {
							this.dataList[i].DATA_STATUS = dataStatus;
							this.dataList[i].DATA_STATUS_STR = "발송안함";
						}
						break;
					}
				}
			}

			alert("변경완료");
			this.selected = [];
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 해피톡 리스트 가져오기
		getDataList() {
			//체크박스 리스트 배열초기화
			this.selected = [];

			//전문데이터 조합을 위한 배열 생성
			let inValue = [];
			inValue.push(this.pageInfo.pageNo);		// 페이지_요청번호	
			inValue.push(this.pageInfo.pageSize);		// 페이지_출력개수 (화면출력 데이터 수)
			inValue.push(this.branchInfo.hdCode);		// 검색_제휴본사_코드 (로그인정보, NULL: 전체)
			inValue.push(this.branchInfo.brCode);		// 검색_총판_코드 (로그인정보, NULL: 전체)
			inValue.push(this.branchInfo.stCode);		// 검색_가맹점_코드 (로그인정보, NULL: 전체)
			inValue.push(this.branchInfo.multiType);	// 검색_멀티_구분 (로그인정보, 검색가맹점의 멀티구분)	
			inValue.push(this.branchInfo.multiStCode);	// 검색_멀티_가맹점_코드 (NULL: 전체)
			inValue.push(this.sendTimeType);			// 발송시점
			
			//전문 데이터
			let param = {
				REQ_TYPE : "204",        //전송타입
				REQ_NUM : "AW04_02_V01", //전문번호
				VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
			}

			//페이징 리스트 조회
			this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)
		},
		//화면에서 직접 검색 클릭시에만 세션에 저장
		search() {
			this.getDataList();

			//FIND_BRANCH 선택값 유지 정보(세션스토리지 SELECTED에 저장)
			this.$store.dispatch(Constant.SET_SESSION_SELECTED, this.branchInfo)
			//발송시점 선택값 유지를 위해 saveValue에 담아 세션스토리지 VALUE에 저장
			this.saveValue.sendTimeType = this.sendTimeType;
			//화면별 커스텀 선택값 유지 정보(세션스토리지 VALUE에 저장)
			this.$store.dispatch(Constant.SET_SESSION_VALUE, this.saveValue)
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		schView(idx) {
			this.$router.push({ name: 'testView', params: {no: idx} })
		}
	},
	//비동기 적합
	//데이터가 변할시마다 함수 호출
	watch : {},
  	beforeCreate() {// console.log('...list beforeCreate');
		//VUEX HTTP DATA 리셋
		this.$store.dispatch(Constant.RESET_HTTP_DATA);
	},
	//로드시 실행
	created() {// console.log('...list created');
		//가맹점 선택 셀렉트 박스 표출 TYPE ALL 셋팅(ALL, HD, BR, ST)
		let viewType = {
			TYPE: 'ALL',
			OPTION : {
				ALL : true
				,ALL_NAME : '커스텀 전체'
				,DEFAULT_SELECTED : 'H0003'
			}
		}

		this.$store.dispatch(Constant.SET_FIND_BRANCH_TYPE, viewType);
		//로드시 라우터 초기화
		// this.$router.push({ path: this.$route.name });
		// console.log('list this.$route.query : ',this.$route.query); 
	}
	 
	// ,beforeMounted(){console.log('...list beforeMounted');}
	,mounted() {//console.log('...list mounted');
		//세션스토리지에 발송시점 선택 정보 있으면 셋팅
		if(!util.isNull(this.sessionValue)){
			if(!util.isNull(this.sessionValue.sendTimeType)){
				this.sendTimeType = this.sessionValue.sendTimeType;
			}
		}

		//컴포넌트 created 후 페이지 로드
		//컴포넌트에서 선택값 셋팅 이 후 로드 하기 위함
		 this.getDataList();
	}
	// ,beforeUpdate() {console.log('...list beforeUpdate');}
	// ,updated() {console.log('...list updated');}
	// ,activated() {console.log('...list activated');}
	// ,deactivated() {console.log('...list deactivated');}
	// ,beforeDestroy() {console.log('...list beforeDestroy');}
	,destroyed() {// console.log("★★★★★list destroyed");
		//VUEX HTTP DATA 리셋
		this.$store.dispatch(Constant.RESET_HTTP_DATA);
		
		//유지시킬 페이지 목록을 배열에 담는다
		let keepPage = [];
		keepPage.push('testView');

		//라우터 이동 후 선택값 유지를 위한 페이지 설정
		for( let keepPageStr of keepPage){
			if(this.$route.name != keepPageStr){
				//세션스토리지 초기화
				this.$store.dispatch(Constant.RESET_SESSION_STORAGE);
			}
		}
	}
	
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-box-r {
	line-height: 82px;
	min-width: 95px;
}
</style>
