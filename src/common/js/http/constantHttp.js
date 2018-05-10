import { common } from '@/common/js/common'

export default {

    /** 공통전문 전송 */
    SEND_POST : `${common.BASE_URL}api`,
    /** 파일&객체 전송 */
    SEND_FILE_POST : `${common.BASE_URL}fileApi`,
    /** 비즈톡 상태확인 */
    SEND_BIZ_TALK : `${common.BASE_URL}template/bizTalkSender`,
    /** 엑셀다운로드 */
    SEND_EXCEL_DOWN : `${common.BASE_URL}template/bizTalkSender`

}