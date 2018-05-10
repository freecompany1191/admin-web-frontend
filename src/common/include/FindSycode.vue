<template>
  <div style="padding:0; margin:0; width:100%;">
	<!-- TYPE이 select 가 아니면 -->
	<label v-if="reqInfo.TYPE != 'select'">
		<label v-if="reqInfo.TYPE == 'radio' && !optionCheck(reqInfo.OPTION) && !optionCheck(reqInfo.OPTION.ALL)">
			<input type="radio" v-if="reqInfo.OPTION.ALL" v-model="param.SELECTED" value=""/>
			<span v-if="!optionCheck(reqInfo.OPTION.ALL_NAME)">{{reqInfo.OPTION.ALL_NAME}}</span>
			<span v-else>전체</span>
		</label>
		<label v-for="row in syCodeList" :key="row.DT_CODE" >
			<!-- TYPE이 checkbox 이면 -->
			<input v-if="reqInfo.TYPE == 'checkbox'" type="checkbox" v-model="param.SELECTED" :value="row.DT_CODE">
			<!-- TYPE이 radio 이면 -->
			<input v-if="reqInfo.TYPE == 'radio'" type="radio" v-model="param.SELECTED" :value="row.DT_CODE"/>{{row.DT_NAME}}
		</label>
	</label>
	<!-- TYPE이 select 이면 -->
	<label v-else>
		<select :style="setWidth" v-model="param.SELECTED">
			<option v-if="!optionCheck(reqInfo.OPTION) && !optionCheck(reqInfo.OPTION.ALL) && reqInfo.OPTION.ALL" value="">
				<span v-if="!optionCheck(reqInfo.OPTION.ALL_NAME)">{{reqInfo.OPTION.ALL_NAME}}</span>
				<span v-else>전체</span>
			</option>
			<option v-for="row in syCodeList" :key="row.DT_CODE" :value="row.DT_CODE">
				{{row.DT_NAME}}
			</option>
		</select>
	</label>
  </div>
</template>
<script>
import Constant from '@/common/js/constant'
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
import eventBus from '@/common/include/eventBus.js';
import { mapGetters } from 'vuex';

export default {
	name: 'findSyCode',
	props: ['reqInfo'],
	data () {
		return {
			//선택값 유지를 위한 param 오브젝트
			param: {
				SY_CODE: ''
				//선택된 SY_CODE
				, SELECTED: []
			}
		}
	},
	//계산형 단일 실행
	computed : {
		//현재 VUEX STORE에 셋팅된 CODE 리스트 가져오기
		...mapGetters({
			storage : Constant.GET_SESSION_STORAGE,   			//세션스토리지 가져오기
			arrSelected : Constant.GET_SESSION_ARRAY_SELECTED, 	//세션스토리지 배열 선택값 가져오기
			findSyCodeList: Constant.GET_FIND_SY_CODE_LIST		//VUEX STORE의 시스템코드 전체 리스트 가져오기
		}),
		//가져온 CODE리스트에서 현재 SY_CODE에 해당되는 데이터를 가져와서 리턴
		syCodeList() {
			return this.findSyCodeList.find( item =>  item.SY_CODE ==  this.reqInfo.SY_CODE).DATA
		},
		//가져온 세션스토리지의 CODE리스트에서 현재 SY_CODE에 해당되는 선택값을 가져와서 리턴
		syCodeSelected() {
			let selected = [];
			//세션스토리지에 시스템 코드 선택값이 있으면 세션스토리지 선택값으로 셋팅
			if(!util.isNull(this.arrSelected) && this.arrSelected.length > 0 )
				selected = this.arrSelected.find( item => item.SY_CODE == this.reqInfo.SY_CODE).SELECTED;
			else{//세션스토리지에 시스템 코드 선택값이 없으면 VUEX에서 옵션에 따라 재설정한 기본값으로 셋팅
				if(this.reqInfo.TYPE == 'select' || this.reqInfo.TYPE == 'radio'){
					if(!util.isNull(this.findSyCodeList) && this.findSyCodeList.length > 0 ){
						selected = this.findSyCodeList.find( item => item.SY_CODE == this.reqInfo.SY_CODE).SELECTED
					}
				}
			}
			this.param.SELECTED = selected;
			return selected;
		},
		//와이드 지정
		setWidth() {
			return {width: util.isNull(this.reqInfo.WIDTH) ? '170px' : this.reqInfo.WIDTH }
		}

	},
	methods: {
		//화면에서 넘어온 SY_CODE로 전문 처리
    	getSyCode() {
			this.$store.dispatch(Constant.SEARCH_FIND_SY_CODE, this.reqInfo)
		},
		optionCheck(obj) {
			return util.isNull(obj);
		}
	},
	watch : {
		//데이터가 변할시마다 함수 호출
		findSyCodeList: function(get) {

			if(util.isNull(this.syCodeSelected)){
				if(this.reqInfo.TYPE == 'select' || this.reqInfo.TYPE == 'radio'){
					// let SET_SELECTED = this.findSyCodeList.find( item =>  item.SY_CODE ==  this.reqInfo.SY_CODE).SELECTED
						// console.log('SY_CODE : ',this.reqInfo.SY_CODE,', SET_SELECTED : ',SET_SELECTED);
				}
			}
		},
		//param.SELECTED가 변경되면 즉시 VUEX STORE의 현재 SY_CODE에 해당되는 오브젝트에 선택값 셋팅
		param: {
			handler(val, oldVal) {
				//VUEX STORE의 codeList에 해당되는 SY_CODE의 SELECTED에 선택값 셋팅
				this.$store.dispatch(Constant.SET_FIND_SY_CODE_SELECTED, this.param)
			},
			deep: true
		}
		
	},
	//beforeCreate() { console.log('find sycode beforeCreate');},
	created() { //console.log('find sycode created'); //로드시 실행
		//선택값 셋팅을 위한 파라메터에 SY_CODE 셋팅
		this.param.SY_CODE = this.reqInfo.SY_CODE;
		//전문 처리 호출
		this.getSyCode();
	}
	// ,beforeMount(){console.log('find sycode beforeMount');}
	// ,mounted() {//console.log('find sycode  mounted');}
	//,beforeUpdate() {console.log('find sycode  beforeUpdate');}
	//,updated() {//console.log('find sycode  updated');}
	// ,activated() {console.log('find sycode  activated');}
	// ,deactivated() {console.log('find sycode  deactivated');}
	// ,beforeDestroy() {console.log('find sycode  beforeDestroy');}
	,destroyed() {//console.log('find sycode  destroyed');
		//라우터 이동시 선택 버튼 정보 초기화
		this.$store.dispatch(Constant.RESET_FIND_SY_CODE_LIST);
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

