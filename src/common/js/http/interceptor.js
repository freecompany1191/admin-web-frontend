// import es6Promise from 'es6-promise' 
// es6Promise.polyfill()
// import 'es6-promise/auto'
import Constant from '@/common/js/constant'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import authUtil from '@/common/js/utils/authUtil.js'

//axios.default.timeout = 5000
//axios.defaults.headers.post['Content-Type'] = 'application/json'

// axios 요청 가로 채기
axios.interceptors.request.use (
	//로딩 이미지 표출
	config => {
		store.dispatch(Constant.CHANGE_LOADING, true);
		// 토큰 localStorage가 있는지 여부를 확인한 다음 각 http 헤더와 토큰을 비교합니다.

		// console.log(config);
		// console.log(config.data.REQ_NUM);
		// console.log('TEST : '+authUtil.getUserInfo());

		//로그인 전문인 경우 인터셉터 예외
		if (config.data.REQ_NUM == 'GR01_01_V01') {
			
		} else {
			//로그인 페이지에서는 체크하지 않는다.
			if (router.history.current.fullPath == '/login') {
				store.dispatch(Constant.CHANGE_LOADING, false);
				return;
			}
			
			// 로그인 전문 이외에 쿠키 정보가 없으면 로그인 화면으로 강제 이동
			// 실서비스 전까지 주석처리
			if (!authUtil.getUserInfo()) {
				store.dispatch(Constant.CHANGE_LOADING, false);
				alert("로그인 후 사용하십시오.");
				router.push({ path: '/login'})
				return;
			}
		}
		return config;
	},
	err => {
		return Promise.reject(err)
	})


// axios 인터셉트 응답
axios.interceptors.response.use(res => {
	store.dispatch(Constant.CHANGE_LOADING, false);
	// 점프의 기초로 반환 된 checkLogin json 데이터의 백 엔드
	/* 
	if (!res.data) {
		router.replace({
			path: 'login',
			query: {
				redirect: router.currentRoute.fullPath
			}
		})
	}
	 */
	return res;
}, err => {
	return Promise.reject(err)
})

export default axios;