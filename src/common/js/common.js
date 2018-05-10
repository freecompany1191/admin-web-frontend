'use strict'
import Constant from '@/common/js/constant'
import store from '@/store'
import {mapGetters} from 'vuex'

const TEST_MODE = true	// 개발모드 여부 (true:개발 false:상용)

const common = {
	CLIENT_VERSION: '201803091425'	// 컴파일 버전
	, SERVER_VERSION: ''
	, BASE_URL: TEST_MODE ? 'http://appsis.iptime.org:18080/wmg/v1/manager/'
						: 'http://admapi.mannashop.co.kr:8080/wmg/v1/manager/'	// API 서버 URL
	, IMG_URL: TEST_MODE ? 'http://appsis.iptime.org:8083'
						: 'http://img.mannashop.co.kr'							// IMG 서버 URL
	, SERVICE_YN: TEST_MODE ? 'N' : 'Y'											// DB 테스트 처리여부(N:테스트 Y:상용)

	, DEVICE : 'WMG'	// 디바이스 타입
	, LANGUAGE: '0001'	// 언어 기본 - 한글

	, IS_LOADING: false
}

const commonParam = (param) => {		// 공통 파라메터 셋팅
	param.DEVICE=common.DEVICE;			// 디바이스 타입 공통설정
	param.LANGUAGE=common.LANGUAGE;		// 언어 공통설정
	param.SERVICE_YN=common.SERVICE_YN	// 서비스 타입 공통설정
	return param;
}

export {
	common,
	commonParam
}