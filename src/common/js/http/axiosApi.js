import HTTPCONF from './constantHttp.js'
import axios from '@/common/js/http/interceptor.js'
import fileUtil from '../utils/fileUtil.js'
import { common, commonParam } from '@/common/js/common'

export default {

	/** 공통전문 전송 */
	SEND_POST: (param) => axios.post(`${HTTPCONF.SEND_POST}`, commonParam(param)),

    /** 파일&객체 전송 */
    SEND_FILE_POST: (param) => axios.post(`${HTTPCONF.SEND_FILE_POST}`, commonParam(param)),
    
    /** 비즈톡 상태확인 */
    SEND_BIZ_TALK: (param) => axios.post(`${HTTPCONF.SEND_BIZ_TALK}`, commonParam(param)),

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
	SEND_EXCEL_DOWN: (param) => axios.post(`${HTTPCONF.SEND_EXCEL_DOWN}`, commonParam(param))

}