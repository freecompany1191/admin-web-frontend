//http 요청을 위한 axios 설치 
//npm install axios --save
// import axios from 'axios'
import axios from '@/common/js/http/interceptor.js'
import fileUtil from '../utils/fileUtil.js'
import HTTPCONF from './constantHttp.js'
import util from '@/common/js/utils/util.js';

import { common } from '@/common/js/common'

export default {

	//공통 파라메터 셋팅
	commonParam: function(param) {
		param.DEVICE=common.DEVICE;			// 디바이스 타입 공통설정
		param.LANGUAGE=common.LANGUAGE;		// 언어 공통설정
		param.SERVICE_YN=common.SERVICE_YN	// 서비스 타입 공통설정
	},
	
	sendPost: function(vue, reqType, reqNum, values, suc, fail) {
		common.IS_LOADING = true;

		if (common.SERVICE_YN == 'Y') {
			if (!util.isNull(common.SERVER_VERSION) && common.CLIENT_VERSION != common.SERVER_VERSION) {
				common.IS_LOADING = false;
				alert('업데이트 되었습니다. 새로고침 하십시오.');
				return;
			}
			
			let URI = "http://adm.mannashop.co.kr/version.html";
			axios.post(
				`${URI}`
				, {REQ_NUM:'VERSION'}
			)
			.then(
				(ret) => {
					// console.log(ret);
					common.SERVER_VERSION = ret.data;
				}
			)
			.catch(e => {
				// console.log(e);
				common.SERVER_VERSION = "";
			})
		}

		// console.log(common.BASE_URL);
		// console.log(reqType);
		// console.log(reqNum);
		// console.log(values);
		var param = {
			INFO:""
			, REQ_TYPE:reqType
			, REQ_NUM:reqNum
			, VALUE:values
		};

		//공통 파라메터 셋팅
		this.commonParam(param);

		let URI = common.BASE_URL + "api";
		axios.post(
			`${URI}`
			, param
		)
		.then(
			(ret) => {
				common.IS_LOADING = false;

				//console.log('| status OK : '+JSON.stringify(ret));
				//console.log('| status : '+ret.status);
				//console.log('| statusText : '+ret.statusText);
				//console.log('| header : '+ JSON.stringify(ret.headers));
				//console.log('| data : '+JSON.stringify(ret.data));

				if (!util.isNull(common.SERVER_VERSION) && common.CLIENT_VERSION != common.SERVER_VERSION) {
					ret.data.out_MSG = "업데이트 되었습니다. 새로고침 하십시오.";

					if (fail != undefined) {
						fail(vue, ret.data);
					}
					alert(ret.data.out_MSG);
					return;
				}

				if (ret.data.out_CODE != 1) {
					if (fail != undefined) {
						fail(vue, ret.data);
					}
					alert(ret.data.out_MSG);
					return;
				}
				if (suc != undefined) {
					suc(vue, ret.data);
				}
			}
		)
		.catch(e => {
			common.IS_LOADING = false;
			if (fail != undefined) {
				fail(vue, e);
			}
		})
	},
	/** 파일&객체 전송시 이용하는 기능(vue, 파일업로드경로, 삭제할원본파일명, 업로드할 파일) */
	sendFilePost: function(vue, uploadPath, stCode, delFileName, file, suc, fail) {
		common.IS_LOADING = true;
		// console.log(reqType);
		// console.log(reqNum);
		// console.log(delFileName);
		var param = {
			UPLOAD_PATH: uploadPath
			, ST_CODE: stCode
			, DEL_FILE_NAME: delFileName
		};

		var data = new FormData();
		// console.log(JSON.stringify(param));
		// console.log( '&#9474;' == '│' );
		// console.log( '&#x2502;' == '│' );
		//파라미터 폼 데이터 셋팅
		data.append('param',encodeURI(JSON.stringify(param)));
		//파일 폼 데이터 셋팅
		data.append('file', file);
		
		let URI = common.BASE_URL + "fileApi";
		axios.post(
			`${URI}`
			, data
		)
		.then(
			(ret) => {
				common.IS_LOADING = false;

				//console.log('| status OK : '+JSON.stringify(ret));
				//console.log('| status : '+ret.status);
				//console.log('| statusText : '+ret.statusText);
				//console.log('| header : '+ JSON.stringify(ret.headers));
				//console.log('| data : '+JSON.stringify(ret.data));     
				if (ret.data.out_CODE != 1) {
					
					if (fail != undefined) {
						fail(vue, ret.data);
					}
					alert(ret.data.out_MSG);
					return;
				}
				if (suc != undefined) {
					// console.log(ret.data);
					suc(vue, ret.data);
				}
			}
		)
		.catch(e => {
			common.IS_LOADING = false;

			// console.log(e);
			if (fail != undefined) {
				fail(vue, e);
			}
		})
	},

	//비즈톡 상태확인 기능
	sendBizTalk: function(vue, param, suc, fail) {
		common.IS_LOADING = true;

		let URI = common.BASE_URL + "template/bizTalkSender";
		axios.post(
			`${URI}`
			, param
		)
		.then(
			(ret) => {
				common.IS_LOADING = false;

				if (ret.data.out_CODE != 1) {
					if (fail != undefined) {
						fail(vue, ret.data);
					}
					alert(ret.data.out_MSG);
					return;
				}
				if (suc != undefined) {
					suc(vue, ret.data);
				}
			}
		)
		.catch(e => {
			common.IS_LOADING = false;

			if (fail != undefined) {
				fail(vue, e);
			}
		})
	},

	/** 
	 * 엑셀다운로드 기능
	 * 
	 * [HEADER 지정]
	 * 기존 전문 요청 형식과 똑같고 추가로 HEADER에 컬럼 헤더 제목을 지정한다
	 * 지정하지 않으면 기본으로 컬럼 키값으로 셋팅 된다
	 * 
	 * [파일이름 지정]
	 * fileName 설정하려면 fileName에 원하는 파일이름을 담아서 넘긴다
	 * 
	 * [요청방법]
	 * EXCEL 다운로드할 전문 및 프로시저를 생성하고 
	 * VALUE에 조회조건을 셋팅해 엑셀 다운로드를 요청한다
	 * 아래의 예시와 같이 호출하는 곳에서 param을 셋팅해서 요청 하면된다
	 * 
	 * ex)
	 * var param = {
			REQ_TYPE:"203"
			, REQ_NUM:'AW03_05_V01'
			, VALUE:"│" //조회 조건
			// 엑셀 헤더 String 배열로 입력된 그대로 헤더를 만든다
			// 헤더를 지정하지 않으면 기본 컬럼 키 값으로 헤더를 만든다
			, HEADER: ["템플릿_코드","템플릿_구분","템플릿_구분 값","템플릿_제목","템플릿_내용","버튼_정보 (버튼명)","입력_일시","승인_상태","승인_상태 값","반려 메세지"]
		}
	 * 
	 */
	sendExcelDown: function(vue, param, suc, fail) {
		common.IS_LOADING = true;

		//공통 파라메터 적용 셋팅
		this.commonParam(param);

		let URI = common.BASE_URL + "excelDownApi";
		
		axios.post(
			`${URI}`
			, param
			,{responseType: 'arraybuffer'}
		)
		.then((ret) => {
				common.IS_LOADING = false;
				//파일 이름 지정 지정하지 않으면 export_yyyymmdd.xlsx 가 기본값이 된다
				var filename = '';
				fileUtil.getExcelFile(ret, filename);
			}
		)
		.catch(e => {
			common.IS_LOADING = false;
			
			if (fail != undefined) {
				fail(vue, e);
			}
		})
	}
}