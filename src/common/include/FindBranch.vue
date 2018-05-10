<template>
	<div style="padding:0; margin:0;" v-if="userInfo.multiType != 'S' && userInfo.multiType != 'N'">
		<select v-if="view.HD_YN" v-bind:style="{width:view.HD_WIDTH}" v-model="info.hdCode" v-on:change="getBrList();">
			<option v-if="!optionCheck(view.OPTION) && !optionCheck(view.OPTION.ALL) && view.OPTION.ALL" value="">
				<span v-if="!optionCheck(view.OPTION.ALL_NAME)">{{view.OPTION.ALL_NAME}}</span>
				<span v-else>본사 전체</span>
			</option>
			<option v-for="row in getHdCodeList" :key="row.HD_CODE" v-bind:value="row.HD_CODE" >
				{{row.HD_NAME}}
			</option>
		</select>
		<select v-if="view.BR_YN" v-bind:style="{width:view.BR_WIDTH}" v-model="info.brCode" v-on:change="getStList();">
			<option value="">총판 전체</option>
			<option v-for="row in getBrCodeList" :key="row.BR_CODE" v-bind:value="row.BR_CODE">
				{{row.BR_NAME}}
			</option>
		</select>
		<select v-if="view.ST_YN" v-bind:style="{width:view.ST_WIDTH}" v-model="info.stCode" v-on:change="getStMultiList();">
			<option value="">가맹점 전체</option>
			<option v-for="row in getStCodeList" :key="row.ST_CODE" v-bind:value="row.ST_CODE">
				{{row.ST_NAME}} : {{row.MULTI_TYPE}}
			</option>
		</select>
		<select v-if="view.ST_MULTI_YN" v-bind:style="{width:view.ST_MULTI_WIDTH}" v-model="info.multiStCode" v-on:change="setStMultiInfo();">
			<option value="">멀티가맹점 전체</option>
			<option v-for="row in getStMultiCodeList" :key="row.ST_CODE" v-bind:value="row.ST_CODE">
				{{row.ST_NAME}} : {{row.MULTI_TYPE}}
			</option>
		</select>
	</div>

	
</template>

<script>
import Constant from '@/common/js/constant'
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil.js';
import { mapGetters } from 'vuex';

export default {
	name: 'findBranch',
	data () {
		return {
			//파라메터 오브젝트
			param: {
				hdCode:''
				, brCode:''
				, stCode:''
				, multiType: ''
				, multiStCode: ''
			},
			userInfo: authUtil.getUserInfo()
		}
	},
	// 계산형 단일 실행
	computed:{
		... mapGetters({
			storage : Constant.GET_SESSION_STORAGE,   //세션스토리지 가져오기
			selected : Constant.GET_SESSION_SELECTED, //세션스토리지 선택값 가져오기
			info : Constant.GET_FIND_BRANCH_INFO,     //FIND_BRANCH 검색 시 참조할 선택값
			view : Constant.GET_FIND_BARNCH_VIEW,     //FIND_BRANCH 표출 정보
			getHdCodeList : Constant.GET_HD_CODE_LIST, //본사 리스트
			getBrCodeList : Constant.GET_BR_CODE_LIST, //총판 리스트
			getStCodeList : Constant.GET_ST_CODE_LIST, //가맹점 리스트
			getStMultiCodeList : Constant.GET_ST_MULTI_CODE_LIST //멀티 가맹점 리스트
		})
	},
	methods: {
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 셀렉트 박스 초기화
		resetSelect(opt) {
			switch(opt){
				case "HD" : this.info.hdCode = this.view.OPTION.ALL ? '' : this.getHdCodeList[0].HD_CODE;
				case "BR" : this.info.brCode = ''
				case "ST" : this.info.stCode = ''
				case "ST_MULTI" : this.info.multiStCode = ''
				break;
			}
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 총판리스트 가져오기
		getBrList(){
			this.resetSelect("BR");

			this.param.multiType = '';
			//본사 코드 셋팅
			this.param.hdCode = util.getNull(this.info.hdCode, this.userInfo.hdCode);
			//총판 리스트 요청 await
			this.$store.dispatch(Constant.SEARCH_BR_CODE_LIST, this.param);
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 가맹점리스트 가져오기
		getStList(){
			this.resetSelect("ST");

			this.param.multiType = '';

			this.param = this.info;
			//총판 코드 셋팅
			this.param.brCode = util.getNull(this.info.brCode, this.userInfo.brCode);
			//가맹점 리스트 요청 await
			this.$store.dispatch(Constant.SEARCH_ST_CODE_LIST, this.param);
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 멀티가맹점리스트 가져오기
		getStMultiList(){
			this.resetSelect("ST_MULTI");

			let multiYN = {};
			multiYN.MULTI_TYPE = "";

			//선택된 가맹점 코드가 있으면 가맹점 코드 리스트에서 선택된 가맹점 배열 정보를 가져온다
			if(this.info.stCode != ''){
				multiYN = this.getStCodeList.find( item => item.ST_CODE ==  this.info.stCode)
			}
			//가져온 배열 정보에서 멀티타입을 셋팅
			this.param.multiType = multiYN.MULTI_TYPE;
			// 가맹점 코드 셋팅
			this.param.stCode = util.getNull(this.info.stCode, this.userInfo.stCode);
			//멀티가맹점 리스트 요청 await
			this.$store.dispatch(Constant.SEARCH_ST_MULTI_CODE_LIST, this.param); 
		},
		//멀티가맹점 선택값 업데이트
		setStMultiInfo() {
			this.param.multiStCode = this.info.multiStCode;
			//리스트 화면에서 검색시 참조할 선택 값 셋팅
			this.$store.dispatch(Constant.SET_FIND_BRANCH_INFO, this.param)
			
		},
		optionCheck(obj) {
			return util.isNull(obj);
		}
	},
	watch: {
		// 비동기 적합
		// 데이터가 변할시마다 함수 호출
	},
	//beforeCreate() { //console.log('find branch beforeCreate');},
	created() {//console.log('...find branch created');
		// 로드시 실행
		if(!util.isNull(this.selected)){
			//sessionStorage 에 저장된 선택값 VUEX info store에 저장(info는 list에서 선택된 값을 참조하기 위한 저장소)
			// this.$store.dispatch(Constant.GET_FIND_BRANCH_INFO , this.selected)
			this.param = this.selected;  //sessionStorage 에 저장된 선택값으로 파라메터 셋팅
		}else{ //sessionStorage에 저장된 선택값이 없으면
			//최초 빈 오브젝트로 세션 생성
			this.$store.dispatch(Constant.SET_SESSION_SELECTED, this.param);
			//OPTION 설정이 있을 경우 적용
			if(!util.isNull(this.view.OPTION.DEFAULT_SELECTED))
				this.param.hdCode = this.view.OPTION.DEFAULT_SELECTED
		}

		//최초 선택값으로 본사 리스트 조회
		this.$store.dispatch(Constant.SEARCH_HD_CODE_LIST, this.param);
	}
	//,beforeMount(){console.log('find branch beforeMount');}
	// ,mounted() {console.log('find branch  mounted');}
	// ,beforeUpdate() {console.log('find branch  beforeUpdate');}
	// ,updated() {console.log('find branch  updated');}
	// ,activated() {console.log('find branch  activated');}
	// ,deactivated() {console.log('find branch  deactivated');}
	// ,beforeDestroy() {console.log('find branch  beforeDestroy');}
	,destroyed() {//console.log('find branch  destroyed');
		//라우터 이동시 선택 버튼 정보 초기화
		this.$store.dispatch(Constant.RESET_FIND_BRANCH_INFO);
	}
}
</script>

<style>

</style>
