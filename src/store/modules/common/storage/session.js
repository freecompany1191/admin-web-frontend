import Constant from '@/common/js/constant'
import util from '@/common/js/utils/util.js';
import authUtil from '@/common/js/utils/authUtil'

const state = {
	param : {},
	value : {},
	selected: {},
	arraySelected: []
}

const getters = {
	[Constant.GET_SESSION_STORAGE]: (state) => { 
		state = sessionStorage 
		return state;
	}, //state => state,
	[Constant.GET_SESSION_SELECTED]: (state) => { 
		state.selected = JSON.parse(sessionStorage.getItem('selected'))
		return state.selected;
	}, //state => state.selected,
	[Constant.GET_SESSION_ARRAY_SELECTED]: (state) => { 
		state.arraySelected = JSON.parse(sessionStorage.getItem('arraySelected'))
		return state.arraySelected;
	}, //state => state.arraySelected,
	[Constant.GET_SESSION_PARAM]: (state) => { 
		state.param = JSON.parse(sessionStorage.getItem('param'))
		return state.param;
	}, //state => state.param,
	[Constant.GET_SESSION_VALUE]: (state) => { 
		state.value = JSON.parse(sessionStorage.getItem('value'))
		return state.value;
	} //state => state.value
}

const mutations = {
	[Constant.RESET_SESSION_STORAGE]: (state) =>{ 
		state.param = {};
		state.value = {};
		state.selected = {};
		state.arraySelected = {};
		sessionStorage.clear()
	},
	/* 
	(state) => {
			state.param = {};
			state.value = {};
			state.selected = {};
			state.arraySelected = {};
	} */
	[Constant.SET_SESSION_PARAM]: (state, payload) => state.param = sessionStorage.setItem('param', JSON.stringify(payload)),//(state, payload) => state.param = payload,
	[Constant.SET_SESSION_VALUE]: (state, payload) => state.value = sessionStorage.setItem('value', JSON.stringify(payload)),//(state, payload) => state.value = payload,
	[Constant.SET_SESSION_SELECTED]: (state, payload) =>{
		state.selected = sessionStorage.setItem('selected', JSON.stringify(payload))
	}, //(state, payload) => state.selected = payload,
	[Constant.SET_SESSION_ARRAY_SELECTED]: (state, payload) => state.arraySelected = sessionStorage.setItem('arraySelected', JSON.stringify(payload)),//(state, payload) => state.arraySelected = payload

}

const actions = {
	/** 전체 세션스토리지 초기화 */
	[Constant.RESET_SESSION_STORAGE]: (store) => {
		//선택값 초기화
		store.commit(Constant.RESET_SESSION_STORAGE)
		//sessionStorage selected 데이터 제거
		
		//console.log(sessionStorage);
		//console.log(store.getters.getSessionValue);
	},

	/** 오브젝트 선택값 세션스토리지 셋팅 */
	[Constant.SET_SESSION_SELECTED]: ({commit}, payload) => {
		// console.log('SET_SESSION_SELECTED : ',payload);
		//선택값 sessionStorage에 저장
		if(!util.isNull(payload))
			commit(Constant.SET_SESSION_SELECTED, payload)
	},

	/** 배열 선택값 세션스토리지 셋팅 */
	[Constant.SET_SESSION_ARRAY_SELECTED]: ({commit}, payload) => {
		// console.log('SET_SESSION_ARRAY_SELECTED : ',payload);
		//선택값 sessionStorage에 저장
		if(!util.isNull(payload))
			commit(Constant.SET_SESSION_ARRAY_SELECTED, payload)
	},

	/** 파라메터 세션스토리지 셋팅 */
	[Constant.SET_SESSION_PARAM]: ({commit}, payload) => {
		// console.log('SET_SESSION_PARAM : ',payload);
		//선택값 sessionStorage에 저장
		if(!util.isNull(payload))
			commit(Constant.SET_SESSION_PARAM, payload)
	},
	
	/** VALUE 세션스토리지 셋팅 */
	[Constant.SET_SESSION_VALUE]: ({commit}, payload) => {
		// console.log('SET_SESSION_VALUE : ',payload);
		//선택값 sessionStorage에 저장
		if(!util.isNull(payload))
			commit(Constant.SET_SESSION_VALUE, payload)
	}
	
}

export default {
	state,
	getters,
	mutations,
	actions
}