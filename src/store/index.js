// import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import Cookies from 'js-cookie'
//공통모듈
import Constant from '@/common/js/constant'
/** 모듈(modules) */
import auth from './modules/auth'
import httpTransfer from './modules/common/http/httpTransfer'
import findBranch from './modules/common/include/findBranch'
import findSycode from './modules/common/include/findSycode'
import listPaging from './modules/common/include/listPaging'
import session from './modules/common/storage/session'
import local from './modules/common/storage/local'
import cookie from './modules/common/storage/cookie'

Vue.use(Vuex);

/** Vuex 저장소 셋팅 */
//Vuex Session 저장소
const vuexSession = new VuexPersistence({
	//strictMode: true, // This **MUST** be set to true
	storage: window.sessionStorage,
	modules: ['session'] //session 모듈을 sessionStorage를 사용하도록 지정
})

//Vuex Local 저장소
const vuexLocal = new VuexPersistence({
	storage: window.localStorage,
	modules: ['local'] //local 모듈을 localStorage를 사용하도록 지정
})

//Vuex Cookie 저장소
const vuexCookie = new VuexPersistence({
	restoreState: (key, storage) => Cookies.getJSON(key),
	saveState: (key, state, storage) => Cookies.set(key, state, {
		expires: 3
	}),
	modules: ['cookie'] //cookie 모듈을 cookieStorage를 사용하도록 지정
})

/** 공통 상태값 */
const state = {
    isLoading: false
}

const getters = {
	/** 로딩상태 가져오기 */
    [Constant.IS_LOADING]: state => state.isLoading
}

const mutations = {
	/** 로딩상태 변경 적용 */
    [Constant.CHANGE_LOADING]: (state, payload) =>
        state.isLoading = payload
}

const actions = {
	/** 로딩 상태 변경 액션 */
    [Constant.CHANGE_LOADING]: ({commit}, payload) =>
	commit(Constant.CHANGE_LOADING, payload)
}

const store = new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
	modules: {
		auth,         //인증 모듈
		httpTransfer, //HTTP 전송 모듈
		findBranch,   //브랜치 모듈
		findSycode,   //SY_CODE 모듈
		listPaging,    //페이징 모듈
		local,        //로컬 저장소 사용 모듈
		session,      //세션 저장소 사용 모듈
		cookie       //쿠키 저장소 사용 모듈
	}
	//,plugins: [vuexSession.plugin, vuexLocal.plugin, vuexCookie.plugin]
});

export default store;