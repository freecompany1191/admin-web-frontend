import cookie from 'vue-cookie'
import util from './util.js'
import Constant from '@/common/js/constant'
import store from '@/store'

/** 유저 인증 유틸 */
/**
 * 선언 import authUtil from '@/common/js/utils/authUtil.js';
 * 
 * 로그인 셋팅      : authUtil.login(obj);
 * 쿠키정보가져오기  : authUtil.getUserInfo();
 * 로그아웃         : authUtil.logout();
 * 
 * KEY별 쿠키정보가져오기 예시 authUtil.getUserInfo().userId;
 */

export default {

	//1. 로그인 시 최초 유저정보 쿠키 저장
	login: function(obj) {
		//로그인 시 기존 유저정보를 비운다
		this.logout();

		if(util.isNull(obj)) return false;
		//auth store Login 값을 true 변경
		store.dispatch(Constant.CHANGE_LOGIN,true)

		return this.setCookie(obj);
	},
	/**
	 * 서버에서 받아온 로그인 데이터를 쿠키에 셋팅한다
	 * 셋팅 성공시 true 리턴
	*/
	setCookie: function(obj) {

		if(util.isNull(obj)) return false;

		//유저정보 KEY 개별 쿠키셋팅
		/* 
		for(var key in obj){
			cookie.set(key, obj[key]);
		}
		*/
		//유저정보 JSON 통째로 쿠키셋팅
		cookie.set('userInfo', JSON.stringify(obj))

		return true;
		
	},

	/* 
		쿠키에 저장된 유저 정보를 가져온다 Json Object 형태로 리턴한다

		업데이트 일자 : 2018.01.30 
		Object 객체 정보 

		userId     //사용자ID   
		userName   //사용자이름
		userSeqNo  //사용자 고유 일련변호(MN_GR_USER_SEQ)
		userTypeCd //사용자 구분 코드
		hdCode     //제휴본사코드
		brCode     //총판코드
		stCode     //가맹점코드
		grpName    //그룹이름
		multiType  //멀티타입

	*/
	getUserInfo: function() {

		let userInfo = JSON.parse(cookie.get('userInfo'));
		
		if(util.isNull(userInfo)) return false;

		return userInfo;
	},
	/** 
	 * 쿠키에 저장된 유저 정보를 삭제 한다. 
	 * 
	*/
	logout: function() {

		var obj = this.getUserInfo();

		//쿠키에 저장된 유저정보를 삭제 한다
		cookie.delete('userInfo');
		//auth store Login 값을 false로 변경
		store.dispatch(Constant.CHANGE_LOGIN,false);
		//쿠키에 저장된 정보가 있으면 모두 삭제한다
		/* 
		if(obj){
			for(var key in obj){
				cookie.delete('key');
				console.log('delete : '+key + ': '+ obj[key]);
			}
		}
		 */
	},

	/** 
	 * 유저 Row Parser 
	 * 성공시 Object 리턴 실패시 false 리턴
	 **/
	userInfoRowParser: function(vue, row) {

		if(util.isNull(row)) return false;
		var userInfo = this.setAutoMapping(row); //JSON 자동 맵핑
		return userInfo;

	},
	/** 
	 * JSON 데이터 자동 맵핑 함수 
	 * JSON 데이터를 자동으로 카멜표기법으로 변형해서 맵핑한다
	*/
	setAutoMapping: function(jsonData){
		
		if(util.isNull(jsonData)) return false;

		var obj = new Object();
		for(var key in jsonData){
			// console.log(key);
			obj[_.camelCase(key)] = util.getNull(jsonData[key], '');
		}
		return obj;
	}
}

// try {
// 	console.log(_.camelCase(key));
// }
// catch(e) {
// 	console.log("Error Message: " + e.message);
// 	console.log("Error Code: " +e.number & 0xFFFF);
// 	console.log("Error Name: " + e.name);
// 	return e.message;
// }