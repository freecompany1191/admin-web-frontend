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
					<tr v-for="(code, index) in codeList" :key="index">
						<td class="search-title">{{code.SY_NAME}}</td>
						<td><include-find-sycode :req-info="code"></include-find-sycode></td>
					</tr>
				</table>
			</div>
			<!-- 검색버튼 -->
			<div class="search-btn-box">
				<a class="btn-box-r bgGray overflowH" v-on:click="search();"><i class="fa fa-search grayicon"></i> 검색</a>
			</div>
		</div>
		<div>
			<input type="text" v-model="testVal">
			<input type="button" value="테스트" @click="testClick()">
		</div>

		<!-- 검색결과 -->
		<div class="search-box">
			<div class="table-top floatLeft"><span>*전체 <strong class="theRed">{{pageInfo.totalCount}}</strong>개의 데이타가 있습니다.</span></div>
		</div>

		<!-- 리스트 -->
		<div class="table-list">
			<table>
				<thead>
					<tr>
						<th width="10%">주문일련번호</th>
						<th width="25%">주문구분</th>
						<th width="10%">주문상태</th>
						<th width="10%">주문경로</th>
						<th width="10%">취소사유구분</th>
						<th width="10%">지불구분</th>
						<th width="10%">배달대행구분</th>
						<th width="10%">POS구분</th>
					</tr>
				</thead>
				<tbody id="dataList">
					<tr v-if="pageInfo.totalCount == 0">
						<td colspan="8">내역이 없습니다</td>
					</tr>
					<tr v-else v-for="row in dataList" :key="row.ORD_NO">
						<td style="text-align:left;">{{row.ORD_NO}}</td>
						<td>{{row.ORD_TYPE_CD}}</td>
						<td>{{row.ORD_STATUS_CD}}</td>
						<td>{{row.ORD_PATH_CD}}</td>
						<td>{{row.CANCEL_TYPE_CD}}</td>
						<td>{{row.PAY_TYPE_CD}}</td>
						<td>{{row.DVRY_TYPE_CD}}</td>
						<td>{{row.POS_TYPE_CD}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 페이징 -->
		<include-list-paging></include-list-paging>
  </div>
</template>

<script>
import Constant from '@/common/js/constant'
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil.js';
import includeFindSycode from '@/common/include/FindSycode';
import includeListPaging from '@/common/include/ListPaging';
import { mapGetters} from 'vuex'

export default {
	name: 'login',
	data () {
		return {
			pageTitle: 'SYCODE 테스트화면'
			, pageTitle_sub: 'SYCODE 테스트화면 입니다'
			, testVal:''
			, param:{
				watchTest:''
			}
		}
	},
	components: {
			'include-find-sycode' : includeFindSycode
			, 'include-list-paging' : includeListPaging
	},
	//계산형 단일 실행
	computed : {
		...mapGetters({
			codeList     : Constant.GET_FIND_SY_CODE_LIST, //Vuex 시스템코드 리스트 가져오기
			pageInfo     : Constant.GET_PAGE_INFO,         //Vuex 페이지 정보 가져오기
			dataList     : Constant.GET_OUT_ROW1,          //Vuex 리스트 데이터 가져오기
			sessionValue : Constant.GET_SESSION_VALUE	   //Vuex 세션스토리지 파라메터 VALUE 가져오기
		})
	},
	methods: {      
		//이벤트 기능정의
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		getDataList() {

			//전문데이터 조합을 위한 배열 생성
			let inValue = [];
			inValue.push(this.pageInfo.pageNo);		// 페이지_요청번호	
			inValue.push(this.pageInfo.pageSize);	// 페이지_출력개수 (화면출력 데이터 수)
			//코드리스트 만큼 순서대로 배열에 담는다
			for(let code of this.codeList){
				inValue.push(code.SELECTED);
			}
			inValue.push('');
			inValue.push('');
			inValue.push('');
			inValue.push('');
			inValue.push('');
			inValue.push('');

			//전문 데이터
			let param = {
				REQ_TYPE : "203",        //전송타입
				REQ_NUM : "AW03_06_V01", //전문번호
				VALUE : util.getValue(inValue) //전문데이터 조합 함수 호출
			}

			//페이징 리스트 조회
			this.$store.dispatch(Constant.SEARCH_HTTP_DATA_PAGING, param)
		},
		search(){
			this.getDataList();
			//FIND_SY_CODE 선택값 유지 정보(세션스토리지 SELECTED에 저장)
			this.$store.dispatch(Constant.SET_SESSION_ARRAY_SELECTED, this.codeList)

		}
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	},
	watch : {
		//비동기 적합
		//데이터가 변할시마다 함수 호출
		/* 
		param: {
			handler(val, oldVal) {
				console.log('watchVal : ',val,'this.codeList : ',this.codeList);
			},
			deep: true
		}
		 */
	}
	,beforeCreate() {// console.log('beforeCreate');
		//VUEX HTTP DATA 리셋
		this.$store.dispatch(Constant.RESET_HTTP_DATA);
	}
	,created() {// console.log('created');
		let findSyCodeConfigs= [
				{
					SY_CODE: 'O1'
					, SY_NAME: ''
					, PARENT_SY_CODE: '' //분류_코드 (NULL: 전체)
					, PARENT_DT_CODE: '' //상위_분류_코드 (NULL: 없음)
					, DATA_STATUS: ''    //(NULL: 전체, 0: 삭제, 1: 정상, 2: 정지)
					, LAST_SYNC_DATE: '' //마지막_동기화_일시 (NULL: 전체, YYYYMMDDHH24MISS (예: 20160518085059)
					, TYPE:'checkbox'  	 //템플릿 타입 (checkbox, select, radio)
					, SELECTED:[]		 //선택정보
					, DATA:[]		     //조회된 데이터
				}
				, {SY_CODE: 'O2', TYPE:'checkbox'}
				, {SY_CODE: 'O3', TYPE:'checkbox'}
				, {SY_CODE: 'O4', TYPE:'select', WIDTH:'220px',
					OPTION:{
						ALL:true	//전체 선택 표출여부
						,ALL_NAME:'커스텀 전체'   //전체 선택 표출명
						,DEFAULT_SELECTED:'1001' //기본 선택값
					}
				}
				, {SY_CODE: 'O7', TYPE:'radio',OPTION:{ALL:true}}
				, {SY_CODE: 'O8', TYPE:'select', OPTION:{ALL:true}}
				, {SY_CODE: 'PT', TYPE:'checkbox'}
			]

		//VUEX STORE에 FIND_SY_CODE 초기값 셋팅
		this.$store.dispatch(Constant.SET_FIND_SY_CODE_LIST, findSyCodeConfigs)
	}
		// ,beforeMounted(){console.log('beforeMounted');}
	,mounted() { //console.log('mounted');
		//컴포넌트 created 후 페이지 로드
		//컴포넌트에서 선택값 셋팅 이 후 로드 하기 위함
		this.getDataList();
	}
	// ,beforeUpdate() {console.log('beforeUpdate');}
	// ,updated() {console.log('updated');}
	// ,activated() {console.log(' activated');}
	// ,deactivated() {console.log('deactivated');}
	// ,beforeDestroy() {console.log('beforeDestroy');}
	,destroyed() {//{console.log("destroyed");
		//VUEX HTTP DATA 리셋
		this.$store.dispatch(Constant.RESET_HTTP_DATA);
		
		//유지시킬 페이지 목록을 배열에 담는다
		let keepPage = [];
		keepPage.push('testList');

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

<style scoped>
.btn-box-r {
	line-height: 82px;
	min-width: 95px;
}
</style>
