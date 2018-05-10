import util from '@/common/js/utils/util.js';
import util_validate from '@/common/js/utils/util_validate.js';
import funUtil from '@/common/js/utils/function.js';

export default {
	/**
	 * DB테이블의 문구 체크
	 * obj : 입력값
	 * name : 알림이름
	 * tableName : DB테이블명
	 * fieldName : DB필드명
	 * addCondition : 추가 조건
	 * refsFocus : 포커스이동
	 * return : true : 이상없음, false : 이상있음
	 */
	validate_table: function(obj, name, tableName, fieldName, addCondition, refsFocus) {
		let condition = tableData.get(tableName + "." + fieldName);
		condition = addCondition + "|" + condition;
		return this.validate_input(obj, name, condition, refsFocus);
	},
	/**
	 * 문구 체크
	 * obj : 입력값
	 * name : 알림이름
	 * condition : 조건(다수 조건은 |(파이브) 사용)  ex: null|min:0|max:10|number:''|email|korean|id|pwd|tel|phone
	 * refsFocus : 포커스이동
	 * return : true : 이상없음, false : 이상있음
	 */
	validate_input: function(obj, name, condition, refsFocus) {
		let arr_condition = condition.split("|");
		let retFlag = true;

		for (let i = 0; i < arr_condition.length; i++) {
			const element = arr_condition[i];
			
			let message = "";
			let ret = element.replace(/(null|min|max|number|email|korean|id|pwd|tel|phone)/gi, function($1) {
				let callBackFlag = true;
				switch ($1) {
					case "null":
						callBackFlag = !util.isNull(obj);
						message = " 값을 입력해 주세요.";
						break;
					case "min":
						callBackFlag = util_validate.checkMinLength(obj, element.split(":")[1]);
						message = " 길이가 적습니다.";
						break;
					case "max":
						callBackFlag = util_validate.checkMaxLength(obj, element.split(":")[1]);
						message = " 길이를 초과하였습니다.";
						break;
					case "number":
						let arrTmp = element.split(":");
						let opt = arrTmp.length > 0 ? arrTmp[1] : '';
						callBackFlag = util_validate.checkNumber(obj, opt);
						if (opt == '2') message = "에 0이상의 숫자만 입력하십시오";
						else if (opt == '4') message = "에 소수점을 사용할 수 없습니다.";
						else message = "에 숫자만 입력하십시오";
						break;
					case "email":
						callBackFlag = funUtil.checkEmail(obj);
						message = " 이메일 형식이 아닙니다.";
						break;
					case "korean":
						callBackFlag = funUtil.checkKorean(obj);
						message = " 한글이 포함되어있습니다.";
						break;
					case "id":
						callBackFlag = util_validate.checkUserId(obj);
						message = "에 사용할 수 없는 ID형식 입니다.";
						break;
					case "pwd":
						callBackFlag = util_validate.checkUserPwd(obj);
						message = "에 사용할 수 없는 비밀번호 형식 입니다.";
						break;
					case "tel":
						callBackFlag = util_validate.checkHomeTelNumber(obj);
						message = "은 전화번호 형식이 아닙니다.";
						break;
					case "phone":
						callBackFlag = util_validate.checkPhoneNumber(obj);
						message = "은 핸드폰번호 형식이 아닙니다.";
						break;
				}
				return callBackFlag;
			});
			if (ret.indexOf('false') >= 0) {
				retFlag = false;
				alert(name + message);

				if (refsFocus != undefined) {
					refsFocus.focus();
				}
				break;
			}
		}
		
		return retFlag;
	},
	/**
	 * 입력된 텍스트의 바이트 최소 길이 체크
	 * obj : 입력값
	 * min_len : 체크할 최소길이
	 * return : true : 이상없음, false : 길이가적음
	 */
	checkMinLength: function(obj, min_len) {
		if (util.isNull(obj)) {
			if (min_len == 0) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			let byLen = funUtil.checkBytes(obj);

			if (min_len <= byLen) {
				return true;
			}
			else {
				return false;
			}
		}
	},
	/**
	 * 입력된 텍스트의 바이트 최대 길이 체크
	 * obj : 입력값
	 * max_len : 체크할 최대길이
	 * return : true : 이상없음, false : 길이가큼
	 */
	checkMaxLength: function(obj, max_len) {
		if (util.isNull(obj)) {
			return true;
		}
		else {
			let byLen = funUtil.checkBytes(obj);

			if (max_len >= byLen) {
				return true;
			}
			else {
				return false;
			}
		}
	},
	/**
	 * 숫자 체크
	 * num 체크할 숫자
	 * opt 
	 * return : true : 이상없음, false : 문자포함됨
	 * 
checkNumber( "-10" ) // true
checkNumber( "+10" ) // true
checkNumber( "-10", 2 ) // false
checkNumber( "+10", 2 ) // false
checkNumber( "0" ) // true
checkNumber( "0xFF" ) // false
checkNumber( "8e5" ) // false
checkNumber( "3.1415" ) // true
checkNumber( "3.1415", 4 ) // false
checkNumber( "0144" ) // true
checkNumber( ".423" ) // false
checkNumber( "" ) // true
checkNumber( "432,000" ) // true
checkNumber( "432,000", 3 ) // false
checkNumber( "23,223.002" ) // true
checkNumber( "3,23,423" ) // false
checkNumber( "-0x42" ) // false
checkNumber( "7.2acdgs" ) // false
checkNumber( {} ) // false
checkNumber( NaN ) // false
checkNumber( null ) // false
checkNumber( true ) // false
checkNumber( false ) // false
checkNumber( Infinity ) // false
checkNumber( undefined ) // true
	 */
	checkNumber(num, opt) {
		if (util.isNull(num)) {
			return true;
		}

		// 좌우 trim(공백제거)을 해준다.
		num = String(num).replace(/^\s+|\s+$/g, "");
		let pattern = "";
		if (util.isNull(opt) || opt == "1") {
			// 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
			pattern = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
		} else if (opt == "2") {
			// 부호 미사용, 자릿수구분기호 선택, 소수점 선택
			pattern = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
		} else if (opt == "3") {
			// 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
			pattern = /^[0-9]+(\.[0-9]+)?$/g;
		} else {
			// only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
			pattern = /^[0-9]*$/g;
		}
		
		if (pattern.test(num)) {
			num = num.replace(/,/g, "");
			return isNaN(num) ? false : true;
		} 
		else {
			return false;
		}
	},
	/**
	 * 아이디 체크
	 */
	checkUserId(str) {
		// 아이디 방지
		pattern = "admin,system,script,test,default,administrator";
		if (pattern.indexOf(str) >= 0) {
			return false;
		}

		// 정규식 체크
		let pattern = /^.*(?=^.{4,10}$)[a-zA-Z]{1}[a-zA-Z0-9]+$/;
		if (pattern.test(str)) {
			return true;
		}
		return false;
	},
	/**
	 * 비밀번호 체크
	 */
	checkUserPwd(str) {
		let pattern = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&amp;+=]).*$/;
		if (pattern.test(str)) {
			return true;
		}
		return false;
	},
	/**
	 * 집 전화번호 형식 체크
	 */
	checkHomeTelNumber(data) {
		let pattern = /^(0[1234567][01236789])[0-9]{3,4}[0-9]{4}$/;
		if(pattern.test(data))
			return true;
		else
			return false;
	},
	/**
	 * 핸드폰번호 형식 체크
	 */
	checkPhoneNumber(data) {
		// let pattern = /(01[016789])(\d{4}|\d{3})\d{5}$/g; 
		let pattern = /(01[016789])[0-9]{3,4}[0-9]{4}$/;
		if(pattern.test(data))
			return true;
		else
			return false;
	},
	getTableData(name) {
		return tableData.get(name);
	}
}

const tableData = new Map();
tableData.set("MN_GR_BR.BR_CODE", "max:5");
tableData.set("MN_GR_BR.PUT_DATE", "date");
tableData.set("MN_GR_BR.PUT_USER_ID", "max:20");
tableData.set("MN_GR_BR.DATA_STATUS", "max:1");
tableData.set("MN_GR_BR.MOD_DATE", "date");
tableData.set("MN_GR_BR.MOD_USER_ID", "max:20");
tableData.set("MN_GR_BR.SERVICE_YN", "max:1");
tableData.set("MN_GR_BR.HD_CODE", "max:5");
tableData.set("MN_GR_BR.BR_NAME", "max:50");
tableData.set("MN_GR_BR.BR_OWNER", "max:50");
tableData.set("MN_GR_BR.BR_TEL", "max:20");
tableData.set("MN_GR_BR.BR_MNG_NAME", "max:50");
tableData.set("MN_GR_BR.MEMO_SERVICE", "max:200");
tableData.set("MN_GR_BR.MEMO_AREA", "max:200");
tableData.set("MN_GR_BR.MEMO_BR", "max:200");
tableData.set("MN_GR_BR.AUTH_TEL", "max:15");
tableData.set("MN_GR_BR.CASH_BR", "number");
tableData.set("MN_GR_BR.CASH_DEPOSIT", "number");
tableData.set("MN_GR_BR.CYBANK_TYPE_CD", "max:4");
tableData.set("MN_GR_BR.CYBANK_ACCOUNT", "max:20");
tableData.set("MN_GR_BR.PIN_NUM", "max:100");
tableData.set("MN_GR_BR.BANK_TYPE_CD", "max:4");
tableData.set("MN_GR_BR.BANK_ACCOUNT", "max:20");
tableData.set("MN_GR_BR.BANK_OWNER", "max:50");
tableData.set("MN_GR_BR.CHARGE_USE_BR_RATE", "number");
tableData.set("MN_GR_BR.CHARGE_POS_BR_RATE", "number");
tableData.set("MN_GR_BR.CHARGE_INS_BR_RATE", "number");
tableData.set("MN_GR_BR.CHARGE_ORD_BR_RATE", "number");
tableData.set("MN_GR_BR.CHARGE_PRE_BR_RATE", "number");
tableData.set("MN_GR_BR.CHARGE_TKO_BR_RATE", "number");
tableData.set("MN_GR_BR.CHARGE_NUM_BR_RATE", "number");
tableData.set("MN_GR_BR.CHARGE_ADB_BR_RATE", "number");
tableData.set("MN_GR_BR.VAN_TYPE_CD", "max:4");
tableData.set("MN_GR_BR.VAN_TMN_ID", "max:20");
tableData.set("MN_GR_BR.PRICE_SMS", "number");
tableData.set("MN_GR_BR.PRICE_MMS", "number");
tableData.set("MN_GR_BR.PRICE_LMS", "number");
tableData.set("MN_GR_BR.BIZ_NUM", "max:15");
tableData.set("MN_GR_BR.BIZ_NAME", "max:100");
tableData.set("MN_GR_BR.BIZ_OWNER", "max:50");
tableData.set("MN_GR_BR.BIZ_CON", "max:100");
tableData.set("MN_GR_BR.BIZ_TYPE", "max:200");
tableData.set("MN_GR_BR.BIZ_ADDR", "max:200");
tableData.set("MN_GR_BR.BIZ_EMAIL", "max:50");
tableData.set("MN_GR_BR.DVRY_TYPE_CD", "max:4");
tableData.set("MN_GR_BR.BR_FAX", "max:20");
tableData.set("MN_GR_BR.CHARGE_SMS", "number");
tableData.set("MN_GR_BR.CHARGE_MMS", "number");
tableData.set("MN_GR_BR.CHARGE_LMS", "number");
tableData.set("MN_GR_BR.SYNC_DATE", "date");
tableData.set("MN_GR_BR.FR_TYPE_CD", "max:4");
tableData.set("MN_GR_BR.MNG_AUTH_YN", "max:1");
tableData.set("MN_GR_BR.MNG_AUTH_DATE", "date");
tableData.set("MN_GR_BR.MNG_AUTH_ID", "max:20");
tableData.set("MN_GR_HD.HD_CODE", "max:5");
tableData.set("MN_GR_HD.PUT_DATE", "date");
tableData.set("MN_GR_HD.PUT_USER_ID", "max:20");
tableData.set("MN_GR_HD.DATA_STATUS", "max:1");
tableData.set("MN_GR_HD.MOD_DATE", "date");
tableData.set("MN_GR_HD.MOD_USER_ID", "max:20");
tableData.set("MN_GR_HD.SERVICE_YN", "max:1");
tableData.set("MN_GR_HD.HD_NAME", "max:50");
tableData.set("MN_GR_HD.HD_OWNER", "max:50");
tableData.set("MN_GR_HD.HD_TEL", "max:20");
tableData.set("MN_GR_HD.HD_MNG_NAME", "max:50");
tableData.set("MN_GR_HD.MEMO_SERVICE", "max:200");
tableData.set("MN_GR_HD.MEMO_AREA", "max:200");
tableData.set("MN_GR_HD.MEMO_HD", "max:200");
tableData.set("MN_GR_HD.AUTH_TEL", "max:15");
tableData.set("MN_GR_HD.CASH_HD", "number");
tableData.set("MN_GR_HD.CASH_DEPOSIT", "number");
tableData.set("MN_GR_HD.CYBANK_TYPE_CD", "max:4");
tableData.set("MN_GR_HD.CYBANK_ACCOUNT", "max:20");
tableData.set("MN_GR_HD.PIN_NUM", "max:100");
tableData.set("MN_GR_HD.BANK_TYPE_CD", "max:4");
tableData.set("MN_GR_HD.BANK_ACCOUNT", "max:20");
tableData.set("MN_GR_HD.BANK_OWNER", "max:50");
tableData.set("MN_GR_HD.CHARGE_USE_HD_RATE", "number");
tableData.set("MN_GR_HD.CHARGE_POS_HD_RATE", "number");
tableData.set("MN_GR_HD.CHARGE_INS_HD_RATE", "number");
tableData.set("MN_GR_HD.CHARGE_ORD_HD_RATE", "number");
tableData.set("MN_GR_HD.CHARGE_PRE_HD_RATE", "number");
tableData.set("MN_GR_HD.CHARGE_TKO_HD_RATE", "number");
tableData.set("MN_GR_HD.CHARGE_NUM_HD_RATE", "number");
tableData.set("MN_GR_HD.CHARGE_ADB_HD_RATE", "number");
tableData.set("MN_GR_HD.VAN_TYPE_CD", "max:4");
tableData.set("MN_GR_HD.VAN_TMN_ID", "max:20");
tableData.set("MN_GR_HD.PRICE_SMS", "number");
tableData.set("MN_GR_HD.PRICE_MMS", "number");
tableData.set("MN_GR_HD.PRICE_LMS", "number");
tableData.set("MN_GR_HD.BIZ_NUM", "max:15");
tableData.set("MN_GR_HD.BIZ_NAME", "max:100");
tableData.set("MN_GR_HD.BIZ_OWNER", "max:50");
tableData.set("MN_GR_HD.BIZ_CON", "max:100");
tableData.set("MN_GR_HD.BIZ_TYPE", "max:200");
tableData.set("MN_GR_HD.BIZ_ADDR", "max:200");
tableData.set("MN_GR_HD.BIZ_EMAIL", "max:50");
tableData.set("MN_GR_HD.HD_FAX", "max:20");
tableData.set("MN_GR_HD.CHARGE_SMS", "number");
tableData.set("MN_GR_HD.CHARGE_MMS", "number");
tableData.set("MN_GR_HD.CHARGE_LMS", "number");
tableData.set("MN_GR_HD.SYNC_DATE", "date");
tableData.set("MN_GR_HD.TAX_ADJ_TYPE", "max:1");
tableData.set("MN_GR_HD.DVRY_MNG_YN", "max:1");
tableData.set("MN_GR_ST.ST_CODE", "max:7");
tableData.set("MN_GR_ST.PUT_DATE", "date");
tableData.set("MN_GR_ST.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST.MOD_DATE", "date");
tableData.set("MN_GR_ST.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST.SERVICE_YN", "max:1");
tableData.set("MN_GR_ST.HD_CODE", "max:5");
tableData.set("MN_GR_ST.BR_CODE", "max:5");
tableData.set("MN_GR_ST.BR_MASTER_YN", "max:1");
tableData.set("MN_GR_ST.ST_NAME", "max:50");
tableData.set("MN_GR_ST.ST_NAME_APP", "max:50");
tableData.set("MN_GR_ST.ST_OWNER", "max:50");
tableData.set("MN_GR_ST.ST_TEL", "max:20");
tableData.set("MN_GR_ST.ST_MNG_NAME", "max:50");
tableData.set("MN_GR_ST.AUTH_TEL", "max:15");
tableData.set("MN_GR_ST.CASH_ST", "number");
tableData.set("MN_GR_ST.CASH_DEPOSIT", "number");
tableData.set("MN_GR_ST.CYBANK_TYPE_CD", "max:4");
tableData.set("MN_GR_ST.CYBANK_ACCOUNT", "max:20");
tableData.set("MN_GR_ST.PIN_NUM", "max:100");
tableData.set("MN_GR_ST.BANK_TYPE_CD", "max:4");
tableData.set("MN_GR_ST.BANK_ACCOUNT", "max:20");
tableData.set("MN_GR_ST.BANK_OWNER", "max:50");
tableData.set("MN_GR_ST.CHARGE_USE_ST", "number");
tableData.set("MN_GR_ST.CHARGE_S_DAY_USE", "max:8");
tableData.set("MN_GR_ST.CHARGE_DAY", "number");
tableData.set("MN_GR_ST.CHARGE_POS_YN", "max:1");
tableData.set("MN_GR_ST.CHARGE_POS_ST", "number");
tableData.set("MN_GR_ST.CHARGE_S_DAY_POS", "max:8");
tableData.set("MN_GR_ST.CHARGE_DAY_POS", "number");
tableData.set("MN_GR_ST.CHARGE_INS_ST", "number");
tableData.set("MN_GR_ST.CHARGE_ORD_ST", "number");
tableData.set("MN_GR_ST.CHARGE_PRE_ST", "number");
tableData.set("MN_GR_ST.CHARGE_TKO_ST", "number");
tableData.set("MN_GR_ST.CHARGE_DVY_TYPE", "max:1");
tableData.set("MN_GR_ST.CHARGE_DVY_ST", "number");
tableData.set("MN_GR_ST.CHARGE_DVY_FREE_CNT", "number");
tableData.set("MN_GR_ST.CHARGE_DVY_EXCD_PRICE", "number");
tableData.set("MN_GR_ST.CHARGE_DVY_ORD", "number");
tableData.set("MN_GR_ST.CHARGE_DVY_ORD_LIMIT_CNT", "number");
tableData.set("MN_GR_ST.CHARGE_DVY_ORD_EXCD_PRICE", "number");
tableData.set("MN_GR_ST.CHARGE_S_DAY_DVY", "max:8");
tableData.set("MN_GR_ST.CHARGE_DAY_DVY", "number");
tableData.set("MN_GR_ST.CHARGE_NUM_ST", "number");
tableData.set("MN_GR_ST.CHARGE_DAY_NUM", "number");
tableData.set("MN_GR_ST.CHARGE_ADB_ST", "number");
tableData.set("MN_GR_ST.CHARGE_DAY_ADB", "number");
tableData.set("MN_GR_ST.RCM_ORD_ST_RATE", "number");
tableData.set("MN_GR_ST.RCM_PRE_ST_RATE", "number");
tableData.set("MN_GR_ST.RCM_TAK_ST_RATE", "number");
tableData.set("MN_GR_ST.TEL_TYPE_CD", "max:4");
tableData.set("MN_GR_ST.CALL_ST_CODE", "max:7");
tableData.set("MN_GR_ST.VAN_TYPE_CD", "max:4");
tableData.set("MN_GR_ST.VAN_TMN_ID", "max:20");
tableData.set("MN_GR_ST.PRICE_SMS", "number");
tableData.set("MN_GR_ST.PRICE_MMS", "number");
tableData.set("MN_GR_ST.PRICE_LMS", "number");
tableData.set("MN_GR_ST.PRICE_N_TALK", "number");
tableData.set("MN_GR_ST.PRICE_F_TALK", "number");
tableData.set("MN_GR_ST.BIZ_NUM", "max:15");
tableData.set("MN_GR_ST.BIZ_NAME", "max:100");
tableData.set("MN_GR_ST.BIZ_OWNER", "max:50");
tableData.set("MN_GR_ST.BIZ_CON", "max:100");
tableData.set("MN_GR_ST.BIZ_TYPE", "max:200");
tableData.set("MN_GR_ST.BIZ_ADDR", "max:200");
tableData.set("MN_GR_ST.BIZ_EMAIL", "max:50");
tableData.set("MN_GR_ST.AUTO_RECHARGE_YN", "max:1");
tableData.set("MN_GR_ST.AUTO_RECHARGE_COND", "number");
tableData.set("MN_GR_ST.AUTO_RECHARGE_PRICE", "number");
tableData.set("MN_GR_ST.ST_FAX", "max:20");
tableData.set("MN_GR_ST.MEMO_ST", "max:500");
tableData.set("MN_GR_ST.CHARGE_DVY_ORD_SUM", "number");
tableData.set("MN_GR_ST.CHARGE_N_TALK", "number");
tableData.set("MN_GR_ST.CHARGE_F_TALK", "number");
tableData.set("MN_GR_ST.CHARGE_SMS", "number");
tableData.set("MN_GR_ST.CHARGE_MMS", "number");
tableData.set("MN_GR_ST.CHARGE_LMS", "number");
tableData.set("MN_GR_ST.SYNC_DATE", "date");
tableData.set("MN_GR_ST.CHARGE_DVY_ADJ_TYPE", "max:1");
tableData.set("MN_GR_ST.MNG_AUTH_YN", "max:1");
tableData.set("MN_GR_ST.MNG_AUTH_DATE", "date");
tableData.set("MN_GR_ST.MNG_AUTH_ID", "max:20");
tableData.set("MN_GR_ST.CHARGE_DVY_ORD_MAX_PRICE", "number");
tableData.set("MN_GR_ST.CHARGE_USE_YN", "max:1");
tableData.set("MN_GR_ST_050.ST_CODE", "max:7");
tableData.set("MN_GR_ST_050.ST_050_NUM", "max:15");
tableData.set("MN_GR_ST_050.PUT_DATE", "date");
tableData.set("MN_GR_ST_050.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_050.MOD_DATE", "date");
tableData.set("MN_GR_ST_050.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_050.ST_050_CON", "max:15");
tableData.set("MN_GR_ST_050.SMS_YN", "max:1");
tableData.set("MN_GR_ST_050.WAV_FILE", "max:100");
tableData.set("MN_GR_ST_ACC.ST_CODE", "max:7");
tableData.set("MN_GR_ST_ACC.CU_050_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.CU_DOWN_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.CU_AUTH_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.CU_ORD_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.CU_END_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.DVRY_ORD_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.DVRY_END_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.TAKEOUT_ORD_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.TAKEOUT_END_ALL_CNT", "number");
tableData.set("MN_GR_ST_ACC.CU_ALL_CNT", "number");
tableData.set("MN_GR_ST_ADD.ST_CODE", "max:7");
tableData.set("MN_GR_ST_ADD.MOD_DATE", "date");
tableData.set("MN_GR_ST_ADD.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_ADD.MULTI_TYPE", "max:1");
tableData.set("MN_GR_ST_ADD.MASTER_ST_CODE", "max:7");
tableData.set("MN_GR_ST_ADD.OWNER_BIRTH", "max:6");
tableData.set("MN_GR_ST_ADD.TERMS_YN", "max:1");
tableData.set("MN_GR_ST_ADD.TERMS_DATE", "date");
tableData.set("MN_GR_ST_ADD.MKT_TAKER", "max:50");
tableData.set("MN_GR_ST_ADD.ST_ADDR_1", "max:30");
tableData.set("MN_GR_ST_ADD.ST_ADDR_2", "max:100");
tableData.set("MN_GR_ST_ADD.ST_ADDR_3", "max:100");
tableData.set("MN_GR_ST_ADD.ST_ADDR_4", "max:200");
tableData.set("MN_GR_ST_ADD.ST_ADDR_5", "max:200");
tableData.set("MN_GR_ST_ADD.ST_LAT_Y", "max:20");
tableData.set("MN_GR_ST_ADD.ST_LNG_X", "max:20");
tableData.set("MN_GR_ST_ADD.ST_APP_ADDR", "max:100");
tableData.set("MN_GR_ST_ADD.ST_APP_MEMO", "max:500");
tableData.set("MN_GR_ST_ADD.READY_TIME", "number");
tableData.set("MN_GR_ST_ADD.AUTO_READY_YN", "max:1");
tableData.set("MN_GR_ST_ADD.DISTANCE_RATIO", "number");
tableData.set("MN_GR_ST_ADD.DVRY_LOCK_TIME", "number");
tableData.set("MN_GR_ST_ADD.DVRY_TYPE_CD", "max:4");
tableData.set("MN_GR_ST_ADD.DVRY_TAX_YN", "max:1");
tableData.set("MN_GR_ST_ADD.DVRY_PAY_ADJ_TYPE", "max:1");
tableData.set("MN_GR_ST_ADD.DVRY_AUTO_YN", "max:1");
tableData.set("MN_GR_ST_ADD.DVRY_PAY_TYPE", "max:1");
tableData.set("MN_GR_ST_ADD.DVRY_CANCEL_TIME", "number");
tableData.set("MN_GR_ST_ADD.APP_USE_TYPE", "max:1");
tableData.set("MN_GR_ST_ADD.ST_APP_USE_TYPE", "max:1");
tableData.set("MN_GR_ST_ADD.ORIGIN_MEMO", "max:500");
tableData.set("MN_GR_ST_ADD.ORD_WORK_STATUS", "max:1");
tableData.set("MN_GR_ST_ADD.ORD_WORK_DAY", "max:7");
tableData.set("MN_GR_ST_ADD.ORD_WORK_TIME", "max:8");
tableData.set("MN_GR_ST_ADD.ORD_CATEGORY", "max:200");
tableData.set("MN_GR_ST_ADD.DVRY_YN", "max:1");
tableData.set("MN_GR_ST_ADD.TAKEOUT_YN", "max:1");
tableData.set("MN_GR_ST_ADD.DVRY_MIN_PRICE_1", "number");
tableData.set("MN_GR_ST_ADD.DVRY_MIN_SRV_1", "number");
tableData.set("MN_GR_ST_ADD.DVRY_MIN_PRICE_2", "number");
tableData.set("MN_GR_ST_ADD.DVRY_MIN_SRV_2", "number");
tableData.set("MN_GR_ST_ADD.PRE_WORK_STATUS", "max:1");
tableData.set("MN_GR_ST_ADD.PRE_WORK_DAY", "max:7");
tableData.set("MN_GR_ST_ADD.PRE_WORK_TIME", "max:8");
tableData.set("MN_GR_ST_ADD.PRE_CATEGORY", "max:200");
tableData.set("MN_GR_ST_ADD.IMG_TITLE_T_FILE", "max:100");
tableData.set("MN_GR_ST_ADD.IMG_TITLE_T_MOD_DATE", "date");
tableData.set("MN_GR_ST_ADD.IMG_TITLE_FILE", "max:100");
tableData.set("MN_GR_ST_ADD.IMG_TITLE_MOD_DATE", "date");
tableData.set("MN_GR_ST_ADD.IMG_HOME_FILE", "max:100");
tableData.set("MN_GR_ST_ADD.IMG_HOME_MOD_DATE", "date");
tableData.set("MN_GR_ST_ADD.SHARE_CU_YN", "max:1");
tableData.set("MN_GR_ST_ADD.FR_CATEGORY", "max:200");
tableData.set("MN_GR_ST_ADD.ST_050_NUM_1", "max:15");
tableData.set("MN_GR_ST_ADD.ST_050_CON_1", "max:15");
tableData.set("MN_GR_ST_ADD.ST_050_NUM_2", "max:15");
tableData.set("MN_GR_ST_ADD.ST_050_CON_2", "max:15");
tableData.set("MN_GR_ST_ADD.ST_050_WAV_FILE1", "max:100");
tableData.set("MN_GR_ST_ADD.ST_050_WAV_FILE1_MOD_DATE", "date");
tableData.set("MN_GR_ST_ADD.ST_050_WAV_FILE2", "max:100");
tableData.set("MN_GR_ST_ADD.ST_050_WAV_FILE2_MOD_DATE", "date");
tableData.set("MN_GR_ST_ADD.PRE_CHARGE_RATE", "number");
tableData.set("MN_GR_ST_ADD.CARD_CHARGE_RATE", "number");
tableData.set("MN_GR_ST_ADD.POS_TYPE_CD", "max:4");
tableData.set("MN_GR_ST_ADD.POS_CON_YN", "max:1");
tableData.set("MN_GR_ST_ADD.POS_SHOP_CODE", "max:20");
tableData.set("MN_GR_ST_ADD.ORD_CNT_MONTHLY", "number");
tableData.set("MN_GR_ST_ADD.PRE_CNT_MONTHLY", "number");
tableData.set("MN_GR_ST_ADD.GRADE_CNT", "number");
tableData.set("MN_GR_ST_ADD.GRADE_SUM", "number");
tableData.set("MN_GR_ST_ADD.FAVORITE_CNT", "number");
tableData.set("MN_GR_ST_ADD.BAROGO_YN", "max:1");
tableData.set("MN_GR_ST_ADD.APP_ORD_CNT", "number");
tableData.set("MN_GR_ST_ADD.DVRY_ACC_CNT", "number");
tableData.set("MN_GR_ST_ADD.DVRY_WK_PAY_TYPE", "max:1");
tableData.set("MN_GR_ST_ADD.DVRY_CTH_YN", "max:1");
tableData.set("MN_GR_ST_CATEGORY.ST_CODE", "max:7");
tableData.set("MN_GR_ST_CATEGORY.CATEGORY_TYPE_CD", "max:2");
tableData.set("MN_GR_ST_CATEGORY.CATEGORY_DETAIL_CD", "max:4");
tableData.set("MN_GR_ST_CHARGE.ST_CHARGE_NO", "number");
tableData.set("MN_GR_ST_CHARGE.PUT_DATE", "date");
tableData.set("MN_GR_ST_CHARGE.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_CHARGE.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_CHARGE.MOD_DATE", "date");
tableData.set("MN_GR_ST_CHARGE.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_CHARGE.ST_CODE", "max:7");
tableData.set("MN_GR_ST_CHARGE.ST_CHARGE_TYPE_CD", "max:4");
tableData.set("MN_GR_ST_CHARGE.ST_CHARGE_NAME", "max:100");
tableData.set("MN_GR_ST_CHARGE.CHARGE_TYPE", "max:1");
tableData.set("MN_GR_ST_CHARGE.CHARGE_DAY", "number");
tableData.set("MN_GR_ST_CHARGE.CHARGE_S_DAY", "max:8");
tableData.set("MN_GR_ST_CHARGE.CHARGE_CNT", "number");
tableData.set("MN_GR_ST_CHARGE.REMAIN_CNT", "number");
tableData.set("MN_GR_ST_CHARGE.CHARGE_PRICE", "number");
tableData.set("MN_GR_ST_CON_DVRY.ST_CODE", "max:7");
tableData.set("MN_GR_ST_CON_DVRY.DVRY_TYPE_CD", "max:4");
tableData.set("MN_GR_ST_CON_DVRY.MOD_DATE", "date");
tableData.set("MN_GR_ST_CON_DVRY.DVRY_SHOP_CODE", "max:20");
tableData.set("MN_GR_ST_CON_DVRY.CON_YN", "max:1");
tableData.set("MN_GR_ST_COUPON.ST_COUPON_NO", "number");
tableData.set("MN_GR_ST_COUPON.PUT_DATE", "date");
tableData.set("MN_GR_ST_COUPON.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_COUPON.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_COUPON.ST_CODE", "max:7");
tableData.set("MN_GR_ST_COUPON.USE_TARGET_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.USE_TARGET_CODE", "max:7");
tableData.set("MN_GR_ST_COUPON.SERVICE_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.COUPON_TITLE", "max:200");
tableData.set("MN_GR_ST_COUPON.USE_PERIOD", "max:16");
tableData.set("MN_GR_ST_COUPON.USE_TIME", "max:8");
tableData.set("MN_GR_ST_COUPON.DIS_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.DIS_PRICE", "number");
tableData.set("MN_GR_ST_COUPON.USE_LIMIT", "number");
tableData.set("MN_GR_ST_COUPON.SEND_CU_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.ORD_CNT_S", "number");
tableData.set("MN_GR_ST_COUPON.ORD_CNT_E", "number");
tableData.set("MN_GR_ST_COUPON.ORD_PERIOD_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.DISTANCE_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.COUPON_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.SEND_CNT", "number");
tableData.set("MN_GR_ST_COUPON.REWARD_TYPE", "max:1");
tableData.set("MN_GR_ST_COUPON.FREE_GOODS", "number");
tableData.set("MN_GR_ST_COUPON.FREE_GOODS_CNT", "number");
tableData.set("MN_GR_ST_COUPON.GIFT_MEMO", "max:200");
tableData.set("MN_GR_ST_CPN.ST_CPN_NO", "number");
tableData.set("MN_GR_ST_CPN.PUT_DATE", "date");
tableData.set("MN_GR_ST_CPN.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_CPN.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_CPN.ST_CODE", "max:7");
tableData.set("MN_GR_ST_CPN.USE_TARGET_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.USE_TARGET_CODE", "max:7");
tableData.set("MN_GR_ST_CPN.SERVICE_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.CPN_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.CPN_TITLE", "max:200");
tableData.set("MN_GR_ST_CPN.USE_PERIOD_S", "max:8");
tableData.set("MN_GR_ST_CPN.USE_PERIOD_E", "max:8");
tableData.set("MN_GR_ST_CPN.USE_TIME_S", "max:4");
tableData.set("MN_GR_ST_CPN.USE_TIME_E", "max:4");
tableData.set("MN_GR_ST_CPN.USE_LIMIT", "number");
tableData.set("MN_GR_ST_CPN.REWARD_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.DIS_PRICE", "number");
tableData.set("MN_GR_ST_CPN.DIS_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.FREE_GOODS", "number");
tableData.set("MN_GR_ST_CPN.FREE_GOODS_CNT", "number");
tableData.set("MN_GR_ST_CPN.GIFT_MEMO", "max:200");
tableData.set("MN_GR_ST_CPN.SEND_CU_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.ORD_CNT_S", "number");
tableData.set("MN_GR_ST_CPN.ORD_CNT_E", "number");
tableData.set("MN_GR_ST_CPN.ORD_PERIOD_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.DISTANCE_TYPE", "max:1");
tableData.set("MN_GR_ST_CPN.SEND_CNT", "number");
tableData.set("MN_GR_ST_CPN.ORD_NO", "number");
tableData.set("MN_GR_ST_CU.ST_CU_NO", "number");
tableData.set("MN_GR_ST_CU.PUT_DATE", "date");
tableData.set("MN_GR_ST_CU.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_CU.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_CU.MOD_DATE", "date");
tableData.set("MN_GR_ST_CU.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_CU.ST_CODE", "max:7");
tableData.set("MN_GR_ST_CU.CU_TEL", "max:15");
tableData.set("MN_GR_ST_CU.CU_NAME", "max:50");
tableData.set("MN_GR_ST_CU.CU_TYPE_CD", "max:4");
tableData.set("MN_GR_ST_CU.CU_LEVEL_CD", "max:4");
tableData.set("MN_GR_ST_CU.CU_MEMO", "max:500");
tableData.set("MN_GR_ST_CU.APP_MEMO", "max:200");
tableData.set("MN_GR_ST_CU.ORD_CNT", "number");
tableData.set("MN_GR_ST_CU.END_CNT", "number");
tableData.set("MN_GR_ST_CU.CANCEL_CNT", "number");
tableData.set("MN_GR_ST_CU.LAST_ORD_DATE", "date");
tableData.set("MN_GR_ST_CU.FIRST_END_DATE", "date");
tableData.set("MN_GR_ST_CU.APP_DOWN_DATE", "date");
tableData.set("MN_GR_ST_CU.MULTI_END_CNT", "number");
tableData.set("MN_GR_ST_CU.SMS_CNT", "number");
tableData.set("MN_GR_ST_CU.SMS_YN", "max:1");
tableData.set("MN_GR_ST_CU.APP_ORD_CNT", "number");
tableData.set("MN_GR_ST_CU.APP_END_CNT", "number");
tableData.set("MN_GR_ST_CU.LAST_APP_ORD_DATE", "date");
tableData.set("MN_GR_ST_CU.LAST_APP_END_DATE", "date");
tableData.set("MN_GR_ST_CU.TALK_CNT", "number");
tableData.set("MN_GR_ST_CU.TALK_YN", "max:1");
tableData.set("MN_GR_ST_CW_REQ.ST_CODE", "max:7");
tableData.set("MN_GR_ST_CW_REQ.REQ_NO", "number");
tableData.set("MN_GR_ST_CW_REQ.REQ_USER_ID", "max:20");
tableData.set("MN_GR_ST_CW_REQ.REQ_DATE", "date");
tableData.set("MN_GR_ST_CW_REQ.REQ_STATUS", "max:1");
tableData.set("MN_GR_ST_CW_REQ.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_CW_REQ.MOD_DATE", "date");
tableData.set("MN_GR_ST_CW_REQ.CON_ST_CODE", "max:7");
tableData.set("MN_GR_ST_CW_REQ.PLUS_EMAIL", "max:100");
tableData.set("MN_GR_ST_CW_REQ.PLUS_PWD", "max:50");
tableData.set("MN_GR_ST_CW_REQ.PLUS_NAME", "max:100");
tableData.set("MN_GR_ST_CW_REQ.YELLOW_ID", "max:100");
tableData.set("MN_GR_ST_CW_REQ.SENDER_KEY", "max:40");
tableData.set("MN_GR_ST_CW_REQ.MKT_NAME", "max:50");
tableData.set("MN_GR_ST_CW_REQ.SETUP_AMT", "number");
tableData.set("MN_GR_ST_DVRY_FEE.ST_CODE", "max:7");
tableData.set("MN_GR_ST_DVRY_FEE.DEFAULT_DISTANCE", "number");
tableData.set("MN_GR_ST_DVRY_FEE.DEFAULT_FEE", "number");
tableData.set("MN_GR_ST_DVRY_FEE.ADD_DISTANCE", "number");
tableData.set("MN_GR_ST_DVRY_FEE.ADD_FEE", "number");
tableData.set("MN_GR_ST_DVRY_FEE.EX_CHARGE_TIME", "number");
tableData.set("MN_GR_ST_DVRY_FEE.EX_S_TIME", "max:4");
tableData.set("MN_GR_ST_DVRY_FEE.EX_E_TIME", "max:4");
tableData.set("MN_GR_ST_DVRY_FEE.EX_CHARGE_DAY", "number");
tableData.set("MN_GR_ST_DVRY_FEE.EX_DAY", "max:7");
tableData.set("MN_GR_ST_DVRY_FEE.MAX_FEE", "number");
tableData.set("MN_GR_ST_DVRY_FEE_AREA.SEQ_NO", "number");
tableData.set("MN_GR_ST_DVRY_FEE_AREA.ST_CODE", "max:7");
tableData.set("MN_GR_ST_DVRY_FEE_AREA.AREA_TEXT", "max:50");
tableData.set("MN_GR_ST_DVRY_FEE_AREA.START_TIME", "number");
tableData.set("MN_GR_ST_DVRY_FEE_AREA.END_TIME", "number");
tableData.set("MN_GR_ST_DVRY_FEE_AREA.FEE_1", "number");
tableData.set("MN_GR_ST_DVRY_FEE_AREA.FEE_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.ST_CODE", "max:7");
tableData.set("MN_GR_ST_EVENT.MOD_DATE", "date");
tableData.set("MN_GR_ST_EVENT.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_EVENT.EV1_USE_YN", "max:1");
tableData.set("MN_GR_ST_EVENT.EV1_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVENT.EV1_TIME", "max:8");
tableData.set("MN_GR_ST_EVENT.EV1_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV1_PRICE", "number");
tableData.set("MN_GR_ST_EVENT.EV2_USE_YN", "max:1");
tableData.set("MN_GR_ST_EVENT.EV2_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVENT.EV2_TIME", "max:8");
tableData.set("MN_GR_ST_EVENT.EV2_ORD_LIMIT", "number");
tableData.set("MN_GR_ST_EVENT.EV2_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV2_DIS_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV2_DIS_PRICE", "number");
tableData.set("MN_GR_ST_EVENT.EV2_FREE_GOODS", "number");
tableData.set("MN_GR_ST_EVENT.EV2_MEMO", "max:200");
tableData.set("MN_GR_ST_EVENT.EV3_USE_YN", "max:1");
tableData.set("MN_GR_ST_EVENT.EV3_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVENT.EV3_TIME", "max:8");
tableData.set("MN_GR_ST_EVENT.EV3_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV3_ORD_LIMIT_1", "number");
tableData.set("MN_GR_ST_EVENT.EV3_DIS_TYPE_1", "max:1");
tableData.set("MN_GR_ST_EVENT.EV3_DIS_PRICE_1", "number");
tableData.set("MN_GR_ST_EVENT.EV3_ORD_LIMIT_2", "number");
tableData.set("MN_GR_ST_EVENT.EV3_DIS_TYPE_2", "max:1");
tableData.set("MN_GR_ST_EVENT.EV3_DIS_PRICE_2", "number");
tableData.set("MN_GR_ST_EVENT.EV3_ORD_LIMIT_3", "number");
tableData.set("MN_GR_ST_EVENT.EV3_DIS_TYPE_3", "max:1");
tableData.set("MN_GR_ST_EVENT.EV3_DIS_PRICE_3", "number");
tableData.set("MN_GR_ST_EVENT.EV4_USE_YN", "max:1");
tableData.set("MN_GR_ST_EVENT.EV4_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVENT.EV4_TIME", "max:8");
tableData.set("MN_GR_ST_EVENT.EV4_ORD_CNT", "number");
tableData.set("MN_GR_ST_EVENT.EV4_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV4_DIS_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV4_DIS_PRICE", "number");
tableData.set("MN_GR_ST_EVENT.EV4_FREE_GOODS", "number");
tableData.set("MN_GR_ST_EVENT.EV4_MEMO", "max:200");
tableData.set("MN_GR_ST_EVENT.EV5_USE_YN", "max:1");
tableData.set("MN_GR_ST_EVENT.EV5_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVENT.EV5_TIME", "max:8");
tableData.set("MN_GR_ST_EVENT.EV5_ORD_LIMIT", "number");
tableData.set("MN_GR_ST_EVENT.EV5_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV5_DIS_TYPE", "max:1");
tableData.set("MN_GR_ST_EVENT.EV5_DIS_PRICE", "number");
tableData.set("MN_GR_ST_EVENT.EV5_FREE_GOODS", "number");
tableData.set("MN_GR_ST_EVENT.EV5_MEMO", "max:200");
tableData.set("MN_GR_ST_EVENT.EV1_ST_COUPON_NO", "number");
tableData.set("MN_GR_ST_EVENT.EV2_ST_COUPON_NO", "number");
tableData.set("MN_GR_ST_EVENT.EV3_ST_COUPON_NO", "number");
tableData.set("MN_GR_ST_EVENT.EV4_ST_COUPON_NO", "number");
tableData.set("MN_GR_ST_EVENT.EV5_ST_COUPON_NO", "number");
tableData.set("MN_GR_ST_EVENT.EV2_FREE_CNT", "number");
tableData.set("MN_GR_ST_EVENT.EV3_FREE_GOODS_1", "number");
tableData.set("MN_GR_ST_EVENT.EV3_FREE_CNT_1", "number");
tableData.set("MN_GR_ST_EVENT.EV3_MEMO_1", "max:200");
tableData.set("MN_GR_ST_EVENT.EV3_FREE_GOODS_2", "number");
tableData.set("MN_GR_ST_EVENT.EV3_FREE_CNT_2", "number");
tableData.set("MN_GR_ST_EVENT.EV3_MEMO_2", "max:200");
tableData.set("MN_GR_ST_EVENT.EV3_FREE_GOODS_3", "number");
tableData.set("MN_GR_ST_EVENT.EV3_FREE_CNT_3", "number");
tableData.set("MN_GR_ST_EVENT.EV3_MEMO_3", "max:200");
tableData.set("MN_GR_ST_EVENT.EV4_FREE_CNT", "number");
tableData.set("MN_GR_ST_EVENT.EV5_FREE_CNT", "number");
tableData.set("MN_GR_ST_EVNT.ST_CODE", "max:7");
tableData.set("MN_GR_ST_EVNT.EV1_YN", "max:1");
tableData.set("MN_GR_ST_EVNT.EV1_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVNT.EV1_TIME", "max:8");
tableData.set("MN_GR_ST_EVNT.EV1_CONTENT", "max:200");
tableData.set("MN_GR_ST_EVNT.EV2_YN", "max:1");
tableData.set("MN_GR_ST_EVNT.EV2_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVNT.EV2_TIME", "max:8");
tableData.set("MN_GR_ST_EVNT.EV2_CONTENT", "max:200");
tableData.set("MN_GR_ST_EVNT.EV3_YN", "max:1");
tableData.set("MN_GR_ST_EVNT.EV3_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVNT.EV3_TIME", "max:8");
tableData.set("MN_GR_ST_EVNT.EV3_CONTENT_1", "max:200");
tableData.set("MN_GR_ST_EVNT.EV3_CONTENT_2", "max:200");
tableData.set("MN_GR_ST_EVNT.EV3_CONTENT_3", "max:200");
tableData.set("MN_GR_ST_EVNT.EV4_YN", "max:1");
tableData.set("MN_GR_ST_EVNT.EV4_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVNT.EV4_TIME", "max:8");
tableData.set("MN_GR_ST_EVNT.EV4_CONTENT", "max:200");
tableData.set("MN_GR_ST_EVNT.EV5_YN", "max:1");
tableData.set("MN_GR_ST_EVNT.EV5_PERIOD", "max:16");
tableData.set("MN_GR_ST_EVNT.EV5_TIME", "max:8");
tableData.set("MN_GR_ST_EVNT.EV5_CONTENT", "max:200");
tableData.set("MN_GR_ST_EVNT.EV3_IMG_FILE", "max:100");
tableData.set("MN_GR_ST_EVNT_CFG.ST_CODE", "max:7");
tableData.set("MN_GR_ST_EVNT_CFG.EV_TYPE", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.PUT_DATE", "date");
tableData.set("MN_GR_ST_EVNT_CFG.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_EVNT_CFG.MOD_DATE", "date");
tableData.set("MN_GR_ST_EVNT_CFG.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_EVNT_CFG.USE_YN", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.PERIOD_S", "max:8");
tableData.set("MN_GR_ST_EVNT_CFG.PERIOD_E", "max:8");
tableData.set("MN_GR_ST_EVNT_CFG.TIME_S", "max:4");
tableData.set("MN_GR_ST_EVNT_CFG.TIME_E", "max:4");
tableData.set("MN_GR_ST_EVNT_CFG.GIVE_TYPE", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_TITLE", "max:200");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_PEROID_TYPE", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_PERIOD_S", "max:8");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_PERIOD_E", "max:8");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_TIME_S", "max:4");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_TIME_E", "max:4");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_PEROID_LIMIT", "number");
tableData.set("MN_GR_ST_EVNT_CFG.CPN_USE_LIMIT", "number");
tableData.set("MN_GR_ST_EVNT_CFG.REWARD_TYPE", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.ORD_CNT", "number");
tableData.set("MN_GR_ST_EVNT_CFG.ORD_LIMIT_1", "number");
tableData.set("MN_GR_ST_EVNT_CFG.DIS_PRICE_1", "number");
tableData.set("MN_GR_ST_EVNT_CFG.DIS_TYPE_1", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.FREE_GOODS_1", "number");
tableData.set("MN_GR_ST_EVNT_CFG.FREE_GOODS_CNT_1", "number");
tableData.set("MN_GR_ST_EVNT_CFG.GIFT_MEMO_1", "max:200");
tableData.set("MN_GR_ST_EVNT_CFG.ORD_LIMIT_2", "number");
tableData.set("MN_GR_ST_EVNT_CFG.DIS_PRICE_2", "number");
tableData.set("MN_GR_ST_EVNT_CFG.DIS_TYPE_2", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.FREE_GOODS_2", "number");
tableData.set("MN_GR_ST_EVNT_CFG.FREE_GOODS_CNT_2", "number");
tableData.set("MN_GR_ST_EVNT_CFG.GIFT_MEMO_2", "max:200");
tableData.set("MN_GR_ST_EVNT_CFG.ORD_LIMIT_3", "number");
tableData.set("MN_GR_ST_EVNT_CFG.DIS_PRICE_3", "number");
tableData.set("MN_GR_ST_EVNT_CFG.DIS_TYPE_3", "max:1");
tableData.set("MN_GR_ST_EVNT_CFG.FREE_GOODS_3", "number");
tableData.set("MN_GR_ST_EVNT_CFG.FREE_GOODS_CNT_3", "number");
tableData.set("MN_GR_ST_EVNT_CFG.GIFT_MEMO_3", "max:200");
tableData.set("MN_GR_ST_EVNT_CFG.IMG_FILE", "max:100");
tableData.set("MN_GR_ST_GOODS.ST_CODE", "max:7");
tableData.set("MN_GR_ST_GOODS.ST_GOODS_NO", "number");
tableData.set("MN_GR_ST_GOODS.PUT_DATE", "date");
tableData.set("MN_GR_ST_GOODS.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_GOODS.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_GOODS.MOD_DATE", "date");
tableData.set("MN_GR_ST_GOODS.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_GOODS.GOODS_NAME", "max:100");
tableData.set("MN_GR_ST_GOODS.BAR_CODE", "max:20");
tableData.set("MN_GR_ST_GOODS.GOODS_TYPE_CD", "max:4");
tableData.set("MN_GR_ST_GOODS.GOODS_DETAIL_CD", "max:4");
tableData.set("MN_GR_ST_GOODS.STOCK_YN", "max:1");
tableData.set("MN_GR_ST_GOODS.STOCK_CNT", "number");
tableData.set("MN_GR_ST_GOODS.TAX_YN", "max:1");
tableData.set("MN_GR_ST_GOODS.SELL_STATUS", "max:1");
tableData.set("MN_GR_ST_GOODS.SELL_PRICE", "number");
tableData.set("MN_GR_ST_GOODS.SELL_DN_PRICE", "number");
tableData.set("MN_GR_ST_GOODS.SELL_DN_PERIOD", "max:16");
tableData.set("MN_GR_ST_GOODS.SELL_DN_TIME", "max:8");
tableData.set("MN_GR_ST_GOODS.SELL_LIMIT_DAY", "number");
tableData.set("MN_GR_ST_GOODS.SELL_LIMIT_ONCE", "number");
tableData.set("MN_GR_ST_GOODS.ORD_STATUS", "max:1");
tableData.set("MN_GR_ST_GOODS.ORD_PRICE", "number");
tableData.set("MN_GR_ST_GOODS.ORD_DN_PRICE", "number");
tableData.set("MN_GR_ST_GOODS.ORD_DN_PERIOD", "max:16");
tableData.set("MN_GR_ST_GOODS.ORD_DN_TIME", "max:8");
tableData.set("MN_GR_ST_GOODS.ORD_LIMIT_DAY", "number");
tableData.set("MN_GR_ST_GOODS.ORD_LIMIT_ONCE", "number");
tableData.set("MN_GR_ST_GOODS.GOODS_MEMO", "max:300");
tableData.set("MN_GR_ST_GOODS.IMG_MAIN_FILE", "max:100");
tableData.set("MN_GR_ST_GOODS.IMG_MAIN_MOD_DATE", "date");
tableData.set("MN_GR_ST_GOODS.GRP_CNT", "number");
tableData.set("MN_GR_ST_GOODS.IMG_MAIN_T_FILE", "max:100");
tableData.set("MN_GR_ST_GOODS.IMG_MAIN_T_MOD_DATE", "date");
tableData.set("MN_GR_ST_GOODS.RECOMM_CNT", "number");
tableData.set("MN_GR_ST_GOODS.TOTAL_ORD_CNT", "number");
tableData.set("MN_GR_ST_GOODS.OPTION_1_CNT", "number");
tableData.set("MN_GR_ST_GOODS.OPTION_2_CNT", "number");
tableData.set("MN_GR_ST_GOODS.ADD_GOODS_CNT", "number");
tableData.set("MN_GR_ST_GOODS.VIEW_ORDER", "number");
tableData.set("MN_GR_ST_GOODS.FR_GOODS_CODE", "max:8");
tableData.set("MN_GR_ST_GOODS.POS_GOODS_CODE", "max:20");
tableData.set("MN_GR_ST_GOODS_MAPP.ST_CODE", "max:7");
tableData.set("MN_GR_ST_GOODS_MAPP.ST_GOODS_NO", "number");
tableData.set("MN_GR_ST_GOODS_MAPP.CON_ST_GOODS_NO", "number");
tableData.set("MN_GR_ST_GOODS_MAPP.VIEW_ORDER", "number");
tableData.set("MN_GR_ST_GOODS_OP.ST_GOODS_OP_NO", "number");
tableData.set("MN_GR_ST_GOODS_OP.PUT_DATE", "date");
tableData.set("MN_GR_ST_GOODS_OP.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_GOODS_OP.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_GOODS_OP.MOD_DATE", "date");
tableData.set("MN_GR_ST_GOODS_OP.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_GOODS_OP.ST_CODE", "max:7");
tableData.set("MN_GR_ST_GOODS_OP.ST_GOODS_NO", "number");
tableData.set("MN_GR_ST_GOODS_OP.OPTION_TYPE", "max:1");
tableData.set("MN_GR_ST_GOODS_OP.OPTION_NAME", "max:50");
tableData.set("MN_GR_ST_GOODS_OP.OPTION_PRICE", "number");
tableData.set("MN_GR_ST_GOODS_OP.VIEW_ORDER", "number");
tableData.set("MN_GR_ST_GOODS_OUT.SEQ_NO", "number");
tableData.set("MN_GR_ST_GOODS_OUT.ST_CODE", "max:7");
tableData.set("MN_GR_ST_GOODS_OUT.ST_GOODS_NO", "number");
tableData.set("MN_GR_ST_GOODS_OUT.LINK_TYPE", "max:1");
tableData.set("MN_GR_ST_GOODS_OUT.LINK_NAME", "max:100");
tableData.set("MN_GR_ST_GOODS_OUT.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_GOODS_OUT.MOD_DATE", "date");
tableData.set("MN_GR_ST_GRADE.ST_GRADE_NO", "number");
tableData.set("MN_GR_ST_GRADE.PUT_DATE", "date");
tableData.set("MN_GR_ST_GRADE.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_GRADE.ST_CODE", "max:7");
tableData.set("MN_GR_ST_GRADE.CU_NO", "number");
tableData.set("MN_GR_ST_GRADE.ORD_NO", "number");
tableData.set("MN_GR_ST_GRADE.GRADE_TYPE", "max:1");
tableData.set("MN_GR_ST_GRADE.GRADE_POINT", "number");
tableData.set("MN_GR_ST_GRADE.CU_INFO", "max:20");
tableData.set("MN_GR_ST_GRADE.GRADE_MEMO", "max:500");
tableData.set("MN_GR_ST_GRADE.IMG_FILE_1", "max:100");
tableData.set("MN_GR_ST_GRADE.IMG_FILE_2", "max:100");
tableData.set("MN_GR_ST_GRADE.IMG_FILE_3", "max:100");
tableData.set("MN_GR_ST_GRADE.WK_GRADE_POINT", "number");
tableData.set("MN_GR_ST_GRADE.ST_REPLY", "max:500");
tableData.set("MN_GR_ST_GRADE.ST_REPLY_DATE", "date");
tableData.set("MN_GR_ST_GRADE.ADD_MILEAGE", "number");
tableData.set("MN_GR_ST_GRADE.WK_CODE", "max:6");
tableData.set("MN_GR_ST_GRP.GRP_NO", "number");
tableData.set("MN_GR_ST_GRP.PUT_DATE", "date");
tableData.set("MN_GR_ST_GRP.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_GRP.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_GRP.MOD_DATE", "date");
tableData.set("MN_GR_ST_GRP.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_GRP.ST_CODE", "max:7");
tableData.set("MN_GR_ST_GRP.GRP_NAME", "max:50");
tableData.set("MN_GR_ST_GRP.VIEW_ORDER", "number");
tableData.set("MN_GR_ST_GRP.GRP_USE_TYPE", "max:1");
tableData.set("MN_GR_ST_GRP_GOODS.GRP_NO", "number");
tableData.set("MN_GR_ST_GRP_GOODS.ST_GOODS_NO", "number");
tableData.set("MN_GR_ST_GRP_GOODS.PUT_DATE", "date");
tableData.set("MN_GR_ST_GRP_GOODS.VIEW_ORDER", "number");
tableData.set("MN_GR_ST_IMG.IMG_NO", "number");
tableData.set("MN_GR_ST_IMG.PUT_DATE", "date");
tableData.set("MN_GR_ST_IMG.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_IMG.MOD_DATE", "date");
tableData.set("MN_GR_ST_IMG.ST_CODE", "max:7");
tableData.set("MN_GR_ST_IMG.CON_SEQ_NO", "number");
tableData.set("MN_GR_ST_IMG.IMG_TYPE", "max:1");
tableData.set("MN_GR_ST_IMG.IMG_FILE", "max:100");
tableData.set("MN_GR_ST_IMG.MAIN_YN", "max:1");
tableData.set("MN_GR_ST_IMG.IMG_T_FILE", "max:100");
tableData.set("MN_GR_ST_IMG.USER_TYPE", "max:1");
tableData.set("MN_GR_ST_IMG.USER_CODE", "max:7");
tableData.set("MN_GR_ST_NAME.SEQ_NO", "number");
tableData.set("MN_GR_ST_NAME.ST_CODE", "max:7");
tableData.set("MN_GR_ST_NAME.LINK_TYPE", "max:1");
tableData.set("MN_GR_ST_NAME.LINK_NAME", "max:100");
tableData.set("MN_GR_ST_NAME.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_NAME.MOD_DATE", "date");
tableData.set("MN_GR_ST_NTALK_CFG.NTALK_SEQ_NO", "number");
tableData.set("MN_GR_ST_NTALK_CFG.ST_CODE", "max:7");
tableData.set("MN_GR_ST_NTALK_CFG.MOD_DATE", "date");
tableData.set("MN_GR_ST_NTALK_CFG.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_NTALK_CFG.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_NTALK_CFG.NTALK_TYPE", "max:1");
tableData.set("MN_GR_ST_NTALK_CFG.ST_TYPE", "max:1");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_TIME_TYPE", "max:1");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_TIME", "number");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_DAY", "number");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_DAY_TIME", "max:4");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_WEEK_DAY", "max:7");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_RPT_CNT", "number");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_CU_TYPE", "max:1");
tableData.set("MN_GR_ST_NTALK_CFG.SEND_CU_END_CNT", "max:30");
tableData.set("MN_GR_ST_NTALK_CFG.TPLT_CODE", "max:7");
tableData.set("MN_GR_ST_ORD_WK.ST_CODE", "max:7");
tableData.set("MN_GR_ST_ORD_WK.WK_CODE", "max:6");
tableData.set("MN_GR_ST_ORD_WK.CTH_CNT", "number");
tableData.set("MN_GR_ST_ORD_WK.END_CNT", "number");
tableData.set("MN_GR_ST_ORD_WK.CANCEL_CNT", "number");
tableData.set("MN_GR_ST_PRE.ST_PRE_NO", "number");
tableData.set("MN_GR_ST_PRE.PUT_DATE", "date");
tableData.set("MN_GR_ST_PRE.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_PRE.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_PRE.MOD_DATE", "date");
tableData.set("MN_GR_ST_PRE.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_PRE.ST_CODE", "max:7");
tableData.set("MN_GR_ST_PRE.PRE_TIME", "max:8");
tableData.set("MN_GR_ST_PRE.DIS_TYPE", "max:1");
tableData.set("MN_GR_ST_PRE.DIS_PRICE", "number");
tableData.set("MN_GR_ST_PRE.LIMIT_CNT", "number");
tableData.set("MN_GR_ST_PRE.TODAY_CNT", "number");
tableData.set("MN_GR_ST_TALK.ST_TALK_NO", "number");
tableData.set("MN_GR_ST_TALK.PUT_DATE", "date");
tableData.set("MN_GR_ST_TALK.RESERVE_DATE", "date");
tableData.set("MN_GR_ST_TALK.ST_CODE", "max:7");
tableData.set("MN_GR_ST_TALK.TALK_TYPE", "max:1");
tableData.set("MN_GR_ST_TALK.ORD_NO", "number");
tableData.set("MN_GR_ST_TALK.SEND_CNT", "number");
tableData.set("MN_GR_ST_TALK.RCV_CNT", "number");
tableData.set("MN_GR_ST_TALK.CHARGE_SUM", "number");
tableData.set("MN_GR_ST_TALK_CFG.ST_CODE", "max:7");
tableData.set("MN_GR_ST_TALK_CFG.TALK_TYPE", "max:1");
tableData.set("MN_GR_ST_TALK_CFG.PUT_USER_ID", "max:20");
tableData.set("MN_GR_ST_TALK_CFG.PUT_DATE", "date");
tableData.set("MN_GR_ST_TALK_CFG.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_TALK_CFG.MOD_DATE", "date");
tableData.set("MN_GR_ST_TALK_CFG.SEND_CU_TYPE", "max:1");
tableData.set("MN_GR_ST_TALK_CFG.SEND_CU_END_CNT", "max:30");
tableData.set("MN_GR_ST_TALK_CFG.SEND_MSG", "max:7");
tableData.set("MN_GR_ST_TALK_CFG.SEND_TIME", "number");
tableData.set("MN_GR_ST_TALK_CFG.SEND_CU_STAMP_CNT", "max:30");
tableData.set("MN_GR_ST_TALK_CFG.EVNT_CONTENT", "max:500");
tableData.set("MN_GR_ST_UPLOAD.SEQ_NO", "number");
tableData.set("MN_GR_ST_UPLOAD.PUT_DATE", "date");
tableData.set("MN_GR_ST_UPLOAD.PUT_USER_ID", "max:15");
tableData.set("MN_GR_ST_UPLOAD.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_UPLOAD.MOD_DATE", "date");
tableData.set("MN_GR_ST_UPLOAD.MOD_USER_ID", "max:15");
tableData.set("MN_GR_ST_UPLOAD.ST_CODE", "max:7");
tableData.set("MN_GR_ST_UPLOAD.FILE_TYPE", "max:1");
tableData.set("MN_GR_ST_UPLOAD.FILE_NAME", "max:200");
tableData.set("MN_GR_ST_VAN.ST_CODE", "max:7");
tableData.set("MN_GR_ST_VAN.VAN_TYPE_CD", "max:4");
tableData.set("MN_GR_ST_VAN.VAN_TMN_ID", "max:20");
tableData.set("MN_GR_ST_VAN.MOD_DATE", "date");
tableData.set("MN_GR_ST_VAN.VAN_PWD", "max:20");
tableData.set("MN_GR_ST_WK_GRP.WK_GRP_NO", "number");
tableData.set("MN_GR_ST_WK_GRP.MOD_DATE", "date");
tableData.set("MN_GR_ST_WK_GRP.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_WK_GRP.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_WK_GRP.ST_CODE", "max:7");
tableData.set("MN_GR_ST_WK_GRP.WK_GRP_NAME", "max:100");
tableData.set("MN_GR_ST_WK_GRP_RULE.WK_GRP_RULE_NO", "number");
tableData.set("MN_GR_ST_WK_GRP_RULE.MOD_DATE", "date");
tableData.set("MN_GR_ST_WK_GRP_RULE.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_WK_GRP_RULE.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_WK_GRP_RULE.WK_GRP_NO", "number");
tableData.set("MN_GR_ST_WK_GRP_RULE.DVRY_TYPE", "max:1");
tableData.set("MN_GR_ST_WK_GRP_RULE.DVRY_CNT_S", "number");
tableData.set("MN_GR_ST_WK_GRP_RULE.DVRY_CNT_E", "number");
tableData.set("MN_GR_ST_WK_GRP_RULE.DVRY_PAY_S", "number");
tableData.set("MN_GR_ST_WK_GRP_RULE.DVRY_PAY_E", "number");
tableData.set("MN_GR_ST_WK_GRP_RULE.DVRY_CHARGE_TYPE", "max:1");
tableData.set("MN_GR_ST_WK_GRP_RULE.DVRY_CHARGE", "number");
tableData.set("MN_GR_ST_WORD.ST_WORD_NO", "number");
tableData.set("MN_GR_ST_WORD.MOD_DATE", "date");
tableData.set("MN_GR_ST_WORD.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_WORD.DATA_STATUS", "max:1");
tableData.set("MN_GR_ST_WORD.ST_CODE", "max:7");
tableData.set("MN_GR_ST_WORD.WORD_TYPE", "max:1");
tableData.set("MN_GR_ST_WORD.ST_WORD", "max:100");
tableData.set("MN_GR_ST_WORD.VIEW_ORDER", "number");
tableData.set("MN_GR_ST_WORD.ORG_ST_WORD_NO", "number");
tableData.set("MN_GR_ST_WORD_ADDR.ST_CODE", "max:7");
tableData.set("MN_GR_ST_WORD_ADDR.WORD_ADDR_NO", "number");
tableData.set("MN_GR_ST_WORD_ADDR.MOD_DATE", "date");
tableData.set("MN_GR_ST_WORD_ADDR.MOD_USER_ID", "max:20");
tableData.set("MN_GR_ST_WORD_ADDR.VIEW_ORDER", "number");
tableData.set("MN_GR_USER.USER_ID", "max:20");
tableData.set("MN_GR_USER.PUT_DATE", "date");
tableData.set("MN_GR_USER.DATA_STATUS", "max:1");
tableData.set("MN_GR_USER.USER_SEQ_NO", "number");
tableData.set("MN_GR_USER.USER_PWD", "max:50");
tableData.set("MN_GR_USER.USER_NAME", "max:50");
tableData.set("MN_GR_USER.USER_TYPE_CD", "max:4");
tableData.set("MN_GR_USER.PUT_USER_ID", "max:20");
tableData.set("MN_GR_USER.MOD_DATE", "date");
tableData.set("MN_GR_USER.USER_TEL", "max:15");
tableData.set("MN_GR_USER.USER_MEMO", "max:300");
tableData.set("MN_GR_USER.HD_CODE", "max:5");
tableData.set("MN_GR_USER.BR_CODE", "max:5");
tableData.set("MN_GR_USER.ST_CODE", "max:7");
tableData.set("MN_GR_USER.EM_CODE", "max:6");
tableData.set("MN_GR_USER_EM.EM_CODE", "max:6");
tableData.set("MN_GR_USER_EM.MOD_DATE", "date");
tableData.set("MN_GR_USER_EM.MOD_USER_ID", "max:20");
tableData.set("MN_GR_USER_EM.BANK_TYPE_CD", "max:4");
tableData.set("MN_GR_USER_EM.BANK_ACCOUNT", "max:20");
tableData.set("MN_GR_USER_EM.BANK_OWNER", "max:50");
tableData.set("MN_GR_USER_EM.EM_BIZ_NUM", "max:20");
tableData.set("MN_GR_USER_EM.EM_AUTH_TEL", "max:15");
tableData.set("MN_GR_USER_EM.EM_TEL", "max:15");
tableData.set("MN_GR_USER_EM.EM_ATTEND_CD", "max:4");
tableData.set("MN_GR_USER_EM.EM_HOME_ADDR", "max:200");
tableData.set("MN_GR_USER_EM.EM_BIRTH", "max:6");
tableData.set("MN_GR_USER_EM.EM_GENDER", "max:1");
tableData.set("MN_GR_USER_EM.WORK_TIME", "max:8");
tableData.set("MN_GR_USER_EM.JOIN_DATE", "max:8");
tableData.set("MN_GR_USER_EM.RETIRE_DATE", "max:8");
tableData.set("MN_GR_USER_EM.WORK_PLACE", "max:1");
tableData.set("MN_GR_USER_EM.IMG_EM_FILE", "max:100");
tableData.set("MN_GR_USER_EM.IMG_EM_MOD_DATE", "date");
tableData.set("MN_GR_USER_EM.SAL_TYPE", "max:1");
tableData.set("MN_GR_USER_EM.SAL_TAX_TYPE", "max:1");
tableData.set("MN_GR_USER_EM.SAL_PAY_TYPE", "max:1");
tableData.set("MN_GR_USER_EM.SAL_AMT", "number");
tableData.set("MN_GR_USER_EM.TERMS_YN", "max:1");
tableData.set("MN_GR_USER_EM.TERMS_DATE", "date");
tableData.set("MN_GR_USER_EM.IMG_1_CNT", "number");
tableData.set("MN_GR_USER_EM.IMG_2_CNT", "number");
tableData.set("MN_GR_WK.WK_CODE", "max:6");
tableData.set("MN_GR_WK.PUT_DATE", "date");
tableData.set("MN_GR_WK.PUT_USER_ID", "max:20");
tableData.set("MN_GR_WK.DATA_STATUS", "max:1");
tableData.set("MN_GR_WK.MOD_DATE", "date");
tableData.set("MN_GR_WK.MOD_USER_ID", "max:20");
tableData.set("MN_GR_WK.SERVICE_YN", "max:1");
tableData.set("MN_GR_WK.HD_CODE", "max:5");
tableData.set("MN_GR_WK.BR_CODE", "max:5");
tableData.set("MN_GR_WK.ST_CODE", "max:7");
tableData.set("MN_GR_WK.WK_NAME", "max:50");
tableData.set("MN_GR_WK.WK_ID", "max:20");
tableData.set("MN_GR_WK.WK_PWD", "max:50");
tableData.set("MN_GR_WK.WK_BIZ_NUM", "max:20");
tableData.set("MN_GR_WK.WK_AUTH_TEL", "max:15");
tableData.set("MN_GR_WK.WK_TEL", "max:15");
tableData.set("MN_GR_WK.CASH_WK", "number");
tableData.set("MN_GR_WK.CASH_DEPOSIT", "number");
tableData.set("MN_GR_WK.CYBANK_TYPE_CD", "max:4");
tableData.set("MN_GR_WK.CYBANK_ACCOUNT", "max:20");
tableData.set("MN_GR_WK.PIN_NUM", "max:100");
tableData.set("MN_GR_WK.BANK_TYPE_CD", "max:4");
tableData.set("MN_GR_WK.BANK_ACCOUNT", "max:20");
tableData.set("MN_GR_WK.BANK_OWNER", "max:50");
tableData.set("MN_GR_WK.WK_ATTEND_CD", "max:4");
tableData.set("MN_GR_WK.WK_HOME_ADDR", "max:200");
tableData.set("MN_GR_WK.WK_BIRTH", "max:6");
tableData.set("MN_GR_WK.WK_GENDER", "max:1");
tableData.set("MN_GR_WK.WORK_TIME", "max:8");
tableData.set("MN_GR_WK.JOIN_DATE", "max:8");
tableData.set("MN_GR_WK.RETIRE_DATE", "max:8");
tableData.set("MN_GR_WK.IMG_WK_FILE", "max:100");
tableData.set("MN_GR_WK.IMG_WK_MOD_DATE", "date");
tableData.set("MN_GR_WK.IMG_1_CNT", "number");
tableData.set("MN_GR_WK.IMG_2_CNT", "number");
tableData.set("MN_GR_WK.VEHICLE_TYPE_CD", "max:4");
tableData.set("MN_GR_WK.SHARE_YN", "max:1");
tableData.set("MN_GR_WK.NO_SHARE_TIME", "max:8");
tableData.set("MN_GR_WK.ONCE_CTH_CNT", "number");
tableData.set("MN_GR_WK.END_ABLE_TIME", "number");
tableData.set("MN_GR_WK.DVRY_1_TYPE", "max:1");
tableData.set("MN_GR_WK.DVRY_1_PRICE", "number");
tableData.set("MN_GR_WK.DVRY_2_TYPE", "max:1");
tableData.set("MN_GR_WK.DVRY_2_PRICE", "number");
tableData.set("MN_GR_WK.DVRY_PAY_VIEW_YN", "max:1");
tableData.set("MN_GR_WK.SAL_TYPE", "max:1");
tableData.set("MN_GR_WK.SAL_TAX_TYPE", "max:1");
tableData.set("MN_GR_WK.SAL_PAY_TYPE", "max:1");
tableData.set("MN_GR_WK.SAL_AMT", "number");
tableData.set("MN_GR_WK.GRADE_CNT", "number");
tableData.set("MN_GR_WK.GRADE_SUM", "number");
tableData.set("MN_GR_WK.END_CNT", "number");
tableData.set("MN_GR_WK.CANCEL_CNT", "number");
tableData.set("MN_GR_WK.CTH_CNT", "number");
tableData.set("MN_GR_WK.TERMS_YN", "max:1");
tableData.set("MN_GR_WK.TERMS_DATE", "date");
tableData.set("MN_GR_WK.APP_USE_TYPE", "max:1");
tableData.set("MN_GR_WK.FIND_RANGE", "number");
tableData.set("MN_GR_WK.FIND_DVRY_DISTANCE", "number");
tableData.set("MN_GR_WK.SYNC_DATE", "date");
tableData.set("MN_GR_WK.AUTO_ATTEND_YN", "max:1");
tableData.set("MN_GR_WK.JUMIN_NUM", "max:100");
tableData.set("MN_GR_WK.WK_GRP_NO", "number");
tableData.set("MN_GR_WK.LOC_SEND_YN", "max:1");
tableData.set("MN_GR_WK_CHARGE.WK_CHARGE_NO", "number");
tableData.set("MN_GR_WK_CHARGE.PUT_USER_ID", "max:20");
tableData.set("MN_GR_WK_CHARGE.PUT_DATE", "date");
tableData.set("MN_GR_WK_CHARGE.MOD_USER_ID", "max:20");
tableData.set("MN_GR_WK_CHARGE.MOD_DATE", "date");
tableData.set("MN_GR_WK_CHARGE.DATA_STATUS", "max:1");
tableData.set("MN_GR_WK_CHARGE.WK_CODE", "max:6");
tableData.set("MN_GR_WK_CHARGE.CHARGE_TYPE_CD", "max:4");
tableData.set("MN_GR_WK_CHARGE.CHARGE_PRICE", "number");
tableData.set("MN_GR_WK_CHARGE.CHARGE_PERIOD_S", "max:8");
tableData.set("MN_GR_WK_CHARGE.CHARGE_PERIOD_E", "max:8");
tableData.set("MN_GR_WK_CHARGE.CHARGE_MNT_TYPE", "max:1");
tableData.set("MN_GR_WK_VAN.WK_CODE", "max:6");
tableData.set("MN_GR_WK_VAN.VAN_TYPE_CD", "max:4");
tableData.set("MN_GR_WK_VAN.DEVICE_TYPE", "max:1");
tableData.set("MN_GR_WK_VAN.DATA_STATUS", "max:1");
tableData.set("MN_GR_WK_VAN.MOD_DATE", "date");
tableData.set("MN_SY_ACC_SET.SEQ_NO", "number");
tableData.set("MN_SY_ACC_SET.PUT_DATE", "date");
tableData.set("MN_SY_ACC_SET.PUT_USER_ID", "max:15");
tableData.set("MN_SY_ACC_SET.DATA_STATUS", "max:1");
tableData.set("MN_SY_ACC_SET.MOD_DATE", "date");
tableData.set("MN_SY_ACC_SET.MOD_USER_ID", "max:15");
tableData.set("MN_SY_ACC_SET.PARENT_TYPE", "max:1");
tableData.set("MN_SY_ACC_SET.PARENT_GR_CODE", "max:7");
tableData.set("MN_SY_ACC_SET.TARGET_TYPE", "max:1");
tableData.set("MN_SY_ACC_SET.TARGET_GR_CODE", "max:7");
tableData.set("MN_SY_ACC_SET.AT_TYPE", "max:1");
tableData.set("MN_SY_ACC_SET.ACC_PAY_TYPE", "max:1");
tableData.set("MN_SY_ACC_SET.ACC_PRICE", "number");
tableData.set("MN_SY_ACC_SET.ACC_START_DAY", "max:8");
tableData.set("MN_SY_ACC_SET.ACC_END_DAY", "max:8");
tableData.set("MN_SY_ACC_SET.DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_BANKING.TRAN_NO", "number");
tableData.set("MN_SY_BANKING.PUT_DATE", "date");
tableData.set("MN_SY_BANKING.MOD_DATE", "date");
tableData.set("MN_SY_BANKING.TRAN_RTN_CODE", "max:9");
tableData.set("MN_SY_BANKING.BANK_TYPE", "max:1");
tableData.set("MN_SY_BANKING.DOC_TYPE", "max:4");
tableData.set("MN_SY_BANKING.ACT_TYPE", "max:3");
tableData.set("MN_SY_BANKING.TRAN_CNT", "number");
tableData.set("MN_SY_BANKING.TRAN_TODAY_NO", "number");
tableData.set("MN_SY_BANKING.TRAN_CODE", "max:4");
tableData.set("MN_SY_BANKING.TRAN_STATUS", "max:1");
tableData.set("MN_SY_BANKING.TRAN_TYPE", "max:1");
tableData.set("MN_SY_BANKING.TRAN_RECORD_NO", "number");
tableData.set("MN_SY_BANKING.TRAN_RECORD_TODAY_NO", "number");
tableData.set("MN_SY_BANKING.OUT_BANK_ACCOUNT", "max:15");
tableData.set("MN_SY_BANKING.BANK_TYPE_CD", "max:3");
tableData.set("MN_SY_BANKING.BANK_ACCOUNT", "max:15");
tableData.set("MN_SY_BANKING.REQ_CASH", "number");
tableData.set("MN_SY_BANKING.TRAN_CASH", "number");
tableData.set("MN_SY_BANKING.TRAN_NOT_CASH", "number");
tableData.set("MN_SY_BANKING.TRAN_FEE", "number");
tableData.set("MN_SY_BANKING.TRAN_DATE", "max:6");
tableData.set("MN_SY_BANKING.REMAIN_TYPE", "max:1");
tableData.set("MN_SY_BANKING.REMAIN_CASH", "number");
tableData.set("MN_SY_BANKING.BANK_OWNER", "max:50");
tableData.set("MN_SY_BANKING.TRAN_MEMO", "max:50");
tableData.set("MN_SY_BANKING.PART_CNT", "number");
tableData.set("MN_SY_BANKING.PART_NO", "number");
tableData.set("MN_SY_BANKING.BANK_TRAN_NUM", "number");
tableData.set("MN_SY_BANKING.BANK_NOT_CASH", "max:13");
tableData.set("MN_SY_BANKING.RSLT_CODE", "max:4");
tableData.set("MN_SY_BANKING.REQ_GRP_TYPE", "max:1");
tableData.set("MN_SY_BANKING.REQ_GRP_CODE", "max:20");
tableData.set("MN_SY_BANKING.REQ_CU_NO", "number");
tableData.set("MN_SY_BOARD.SEQ_NO", "number");
tableData.set("MN_SY_BOARD.PUT_DATE", "date");
tableData.set("MN_SY_BOARD.PUT_USER_ID", "max:20");
tableData.set("MN_SY_BOARD.DATA_STATUS", "max:1");
tableData.set("MN_SY_BOARD.MOD_DATE", "date");
tableData.set("MN_SY_BOARD.MOD_USER_ID", "max:20");
tableData.set("MN_SY_BOARD.BOARD_TYPE", "max:1");
tableData.set("MN_SY_BOARD.ARTICLE_TITLE", "max:100");
tableData.set("MN_SY_BOARD.ARTICLE_BODY", "max:4000");
tableData.set("MN_SY_BOARD.HD_CODE", "max:5");
tableData.set("MN_SY_BOARD.BR_CODE", "max:5");
tableData.set("MN_SY_BOARD.ST_CODE", "max:7");
tableData.set("MN_SY_BOARD.PUT_GRP_TYPE", "max:1");
tableData.set("MN_SY_BOARD.PUT_GRP_CODE", "max:7");
tableData.set("MN_SY_BOARD.PUT_GRP_NAME", "max:50");
tableData.set("MN_SY_BOARD.IMG_FILE_1", "max:100");
tableData.set("MN_SY_BOARD.IMG_FILE_2", "max:100");
tableData.set("MN_SY_BOARD.IMG_FILE_3", "max:100");
tableData.set("MN_SY_BOARD.SOS_YN", "max:1");
tableData.set("MN_SY_BOARD.ARTICLE_REPLY", "max:4000");
tableData.set("MN_SY_BOARD.ARTICLE_REPLY_DATE", "date");
tableData.set("MN_SY_BOARD.DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_BOARD.TOP_YN", "max:1");
tableData.set("MN_SY_BOARD.TARGET_TYPE", "max:1");
tableData.set("MN_SY_BOARD.ARTICLE_TYPE", "max:1");
tableData.set("MN_SY_BOARD_CS.SEQ_NO", "number");
tableData.set("MN_SY_BOARD_CS.PUT_DATE", "date");
tableData.set("MN_SY_BOARD_CS.MOD_DATE", "date");
tableData.set("MN_SY_BOARD_CS.DATA_STATUS", "max:1");
tableData.set("MN_SY_BOARD_CS.REQ_NAME", "max:20");
tableData.set("MN_SY_BOARD_CS.ST_NAME", "max:50");
tableData.set("MN_SY_BOARD_CS.ST_ADDR", "max:200");
tableData.set("MN_SY_BOARD_CS.ST_TEL", "max:20");
tableData.set("MN_SY_BOARD_CS.CALL_TIME", "max:50");
tableData.set("MN_SY_BOARD_CS.CSLT_MEMO", "max:500");
tableData.set("MN_SY_BOARD_CS.CSLT_NAME", "max:20");
tableData.set("MN_SY_BOARD_CU.SEQ_NO", "number");
tableData.set("MN_SY_BOARD_CU.PUT_DATE", "date");
tableData.set("MN_SY_BOARD_CU.PUT_USER_ID", "max:20");
tableData.set("MN_SY_BOARD_CU.DATA_STATUS", "max:1");
tableData.set("MN_SY_BOARD_CU.MOD_DATE", "date");
tableData.set("MN_SY_BOARD_CU.MOD_USER_ID", "max:20");
tableData.set("MN_SY_BOARD_CU.BOARD_TYPE", "max:1");
tableData.set("MN_SY_BOARD_CU.ARTICLE_TITLE", "max:300");
tableData.set("MN_SY_BOARD_CU.ARTICLE_BODY", "max:4000");
tableData.set("MN_SY_BOARD_CU.PUT_GRP_NAME", "max:50");
tableData.set("MN_SY_BOARD_CU.IMG_FILE_1", "max:100");
tableData.set("MN_SY_BOARD_CU.IMG_FILE_2", "max:100");
tableData.set("MN_SY_BOARD_CU.IMG_FILE_3", "max:100");
tableData.set("MN_SY_BOARD_CU.ARTICLE_REPLY", "max:4000");
tableData.set("MN_SY_BOARD_CU.ARTICLE_REPLY_DATE", "date");
tableData.set("MN_SY_BOARD_CU.ARTICLE_CU_NO", "number");
tableData.set("MN_SY_BOARD_CU.COUNSEL_TYPE", "max:1");
tableData.set("MN_SY_BOARD_CU.USER_NAME", "max:20");
tableData.set("MN_SY_BOARD_CU.SOS_YN", "max:1");
tableData.set("MN_SY_BOARD_SYS.SEQ_NO", "number");
tableData.set("MN_SY_BOARD_SYS.PUT_DATE", "date");
tableData.set("MN_SY_BOARD_SYS.PUT_USER_ID", "max:20");
tableData.set("MN_SY_BOARD_SYS.DATA_STATUS", "max:1");
tableData.set("MN_SY_BOARD_SYS.MOD_DATE", "date");
tableData.set("MN_SY_BOARD_SYS.MOD_USER_ID", "max:20");
tableData.set("MN_SY_BOARD_SYS.BOARD_TYPE", "max:1");
tableData.set("MN_SY_BOARD_SYS.ARTICLE_TITLE", "max:300");
tableData.set("MN_SY_BOARD_SYS.ARTICLE_BODY", "max:4000");
tableData.set("MN_SY_BOARD_SYS.HD_CODE", "max:5");
tableData.set("MN_SY_BOARD_SYS.BR_CODE", "max:5");
tableData.set("MN_SY_BOARD_SYS.ST_CODE", "max:7");
tableData.set("MN_SY_BOARD_SYS.PUT_GRP_NAME", "max:50");
tableData.set("MN_SY_BOARD_SYS.IMG_FILE_1", "max:100");
tableData.set("MN_SY_BOARD_SYS.IMG_FILE_2", "max:100");
tableData.set("MN_SY_BOARD_SYS.IMG_FILE_3", "max:100");
tableData.set("MN_SY_BOARD_SYS.SOS_YN", "max:1");
tableData.set("MN_SY_BOARD_SYS.TOP_YN", "max:1");
tableData.set("MN_SY_CODE.SY_CODE", "max:2");
tableData.set("MN_SY_CODE.DT_CODE", "max:4");
tableData.set("MN_SY_CODE.PUT_DATE", "date");
tableData.set("MN_SY_CODE.DATA_STATUS", "max:1");
tableData.set("MN_SY_CODE.SY_NAME", "max:100");
tableData.set("MN_SY_CODE.DT_NAME", "max:100");
tableData.set("MN_SY_CODE.CODE_MEMO", "max:300");
tableData.set("MN_SY_CODE.MOD_DATE", "date");
tableData.set("MN_SY_CODE.PARENT_SY_CODE", "max:2");
tableData.set("MN_SY_CODE.PARENT_DT_CODE", "max:4");
tableData.set("MN_SY_CODE.VIEW_ORDER", "number");
tableData.set("MN_SY_CODE.DT_VALUE", "max:20");
tableData.set("MN_SY_CODE_ADDR.SEQ_NO", "number");
tableData.set("MN_SY_CODE_ADDR.SY_CODE", "max:2");
tableData.set("MN_SY_CODE_ADDR.AR_CODE", "max:4");
tableData.set("MN_SY_CODE_ADDR.PUT_DATE", "date");
tableData.set("MN_SY_CODE_ADDR.DATA_STATUS", "max:1");
tableData.set("MN_SY_CODE_ADDR.MOD_DATE", "date");
tableData.set("MN_SY_CODE_ADDR.AR_NAME", "max:50");
tableData.set("MN_SY_CODE_ADDR.PARENT_SEQ_NO", "number");
tableData.set("MN_SY_CODE_ADDR.AR_LAT_Y", "max:20");
tableData.set("MN_SY_CODE_ADDR.AR_LNG_X", "max:20");
tableData.set("MN_SY_CODE_ADDR.VIEW_ORDER", "number");
tableData.set("MN_SY_CODE_ADDR.TMP_VAL", "max:20");
tableData.set("MN_SY_CODE_GRP.SY_CODE", "max:2");
tableData.set("MN_SY_CODE_GRP.PUT_DATE", "date");
tableData.set("MN_SY_CODE_GRP.PUT_USER_ID", "max:20");
tableData.set("MN_SY_CODE_GRP.MOD_DATE", "date");
tableData.set("MN_SY_CODE_GRP.MOD_USER_ID", "max:20");
tableData.set("MN_SY_CODE_GRP.SY_NAME", "max:50");
tableData.set("MN_SY_CONFIG.CFG_TYPE", "max:20");
tableData.set("MN_SY_CONFIG.CFG_NAME", "max:100");
tableData.set("MN_SY_CONFIG.CFG_VALUE", "max:100");
tableData.set("MN_SY_CONFIG.ADD_VALUE_1", "max:200");
tableData.set("MN_SY_CONFIG.ADD_VALUE_2", "max:200");
tableData.set("MN_SY_CONFIG.REF_CODE", "max:20");
tableData.set("MN_SY_CONFIG.MOD_DATE", "date");
tableData.set("MN_SY_CONFIG.DATA_STATUS", "max:1");
tableData.set("MN_SY_CONFIG.VIEW_ORDER", "number");
tableData.set("MN_SY_COUPON.COUPON_CODE", "max:15");
tableData.set("MN_SY_COUPON.CODE_SEQ_NO", "number");
tableData.set("MN_SY_COUPON.USE_YN", "max:1");
tableData.set("MN_SY_CU_ADDR.SEQ_NO", "number");
tableData.set("MN_SY_CU_ADDR.PUT_DATE", "date");
tableData.set("MN_SY_CU_ADDR.REQ_STATUS", "max:1");
tableData.set("MN_SY_CU_ADDR.MOD_DATE", "date");
tableData.set("MN_SY_CU_ADDR.ST_CODE", "max:7");
tableData.set("MN_SY_CU_ADDR.CU_TEL", "max:15");
tableData.set("MN_SY_CU_ADDR.ORD_DATE", "max:14");
tableData.set("MN_SY_CU_ADDR.CU_ADDR_1", "max:30");
tableData.set("MN_SY_CU_ADDR.CU_ADDR_2", "max:100");
tableData.set("MN_SY_CU_ADDR.CU_ADDR_5", "max:200");
tableData.set("MN_SY_CU_BANNER.SEQ_NO", "number");
tableData.set("MN_SY_CU_BANNER.PUT_DATE", "date");
tableData.set("MN_SY_CU_BANNER.PUT_USER_ID", "max:15");
tableData.set("MN_SY_CU_BANNER.DATA_STATUS", "max:1");
tableData.set("MN_SY_CU_BANNER.MOD_DATE", "date");
tableData.set("MN_SY_CU_BANNER.MOD_USER_ID", "max:15");
tableData.set("MN_SY_CU_BANNER.GR_TYPE", "max:1");
tableData.set("MN_SY_CU_BANNER.GR_CODE", "max:7");
tableData.set("MN_SY_CU_BANNER.BN_TYPE", "max:1");
tableData.set("MN_SY_CU_BANNER.BN_TITLE", "max:300");
tableData.set("MN_SY_CU_BANNER.BN_BODY", "max:4000");
tableData.set("MN_SY_CU_BANNER.BN_PRICE", "number");
tableData.set("MN_SY_CU_BANNER.ACC_GR_TYPE", "max:1");
tableData.set("MN_SY_CU_BANNER.ACC_GR_CODE", "max:7");
tableData.set("MN_SY_CU_BANNER.BN_START_DAY", "max:8");
tableData.set("MN_SY_CU_BANNER.BN_START_TIME", "max:4");
tableData.set("MN_SY_CU_BANNER.BN_END_DAY", "max:8");
tableData.set("MN_SY_CU_BANNER.BN_END_TIME", "max:4");
tableData.set("MN_SY_CU_BANNER.IMG_FILE", "max:100");
tableData.set("MN_SY_CU_BANNER.VIEW_ORDER", "number");
tableData.set("MN_SY_CU_EVENT.SEQ_NO", "number");
tableData.set("MN_SY_CU_EVENT.PUT_DATE", "date");
tableData.set("MN_SY_CU_EVENT.PUT_USER_ID", "max:15");
tableData.set("MN_SY_CU_EVENT.DATA_STATUS", "max:1");
tableData.set("MN_SY_CU_EVENT.MOD_DATE", "date");
tableData.set("MN_SY_CU_EVENT.MOD_USER_ID", "max:15");
tableData.set("MN_SY_CU_EVENT.EV_TYPE", "max:1");
tableData.set("MN_SY_CU_EVENT.EV_TITLE", "max:300");
tableData.set("MN_SY_CU_EVENT.EV_BODY", "max:4000");
tableData.set("MN_SY_CU_EVENT.IMG_FILE_1", "max:100");
tableData.set("MN_SY_CU_EVENT.IMG_FILE_2", "max:100");
tableData.set("MN_SY_CU_EVENT.IMG_FILE_3", "max:100");
tableData.set("MN_SY_CU_EVENT.EV_START_DAY", "max:8");
tableData.set("MN_SY_CU_EVENT.EV_START_TIME", "max:4");
tableData.set("MN_SY_CU_EVENT.EV_END_DAY", "max:8");
tableData.set("MN_SY_CU_EVENT.EV_END_TIME", "max:4");
tableData.set("MN_SY_DVRY.DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_DVRY.MNG_BR_CODE", "max:5");
tableData.set("MN_SY_DVRY.MOD_DATE", "date");
tableData.set("MN_SY_DVRY.MOD_USER_ID", "max:20");
tableData.set("MN_SY_DVRY.CON_TYPE", "max:1");
tableData.set("MN_SY_DVRY.MNG_1_FEE", "number");
tableData.set("MN_SY_DVRY.MNG_1_FEE_ADJ_TYPE", "max:1");
tableData.set("MN_SY_DVRY.MNG_1_FEE_ADJ_FP", "number");
tableData.set("MN_SY_DVRY.MNG_1_FEE_ADJ_CTH", "number");
tableData.set("MN_SY_DVRY.MNG_1_ORD_ADJ_GRP_TYPE", "max:1");
tableData.set("MN_SY_DVRY.MNG_1_CTH_ADJ_GRP_TYPE", "max:1");
tableData.set("MN_SY_DVRY.MNG_2_FEE", "number");
tableData.set("MN_SY_DVRY.CTH_MNG_2_FEE_TYPE", "max:1");
tableData.set("MN_SY_DVRY.MNG_2_FEE_ADJ_FP", "number");
tableData.set("MN_SY_DVRY.CTH_MNG_2_FEE_RATE", "number");
tableData.set("MN_SY_DVRY.ORD_ADJ_GRP_TYPE", "max:1");
tableData.set("MN_SY_DVRY.ADJ_GRP_TYPE", "max:1");
tableData.set("MN_SY_DVRY.MNG_3_FEE_ADJ_TYPE", "max:1");
tableData.set("MN_SY_DVRY.MNG_4_FEE_ADJ_TYPE", "max:1");
tableData.set("MN_SY_DVRY.CHARGE_TYPE", "max:1");
tableData.set("MN_SY_DVRY.CHARGE_PRICE", "number");
tableData.set("MN_SY_DVRY.CHARGE_HD_RATE", "number");
tableData.set("MN_SY_DVRY.CHARGE_BR_RATE", "number");
tableData.set("MN_SY_DVRY.EX_YN", "max:1");
tableData.set("MN_SY_DVRY.EX_CHARGE", "number");
tableData.set("MN_SY_DVRY.EX_S_TIME", "max:4");
tableData.set("MN_SY_DVRY.EX_E_TIME", "max:4");
tableData.set("MN_SY_DVRY.EX_DATE", "date");
tableData.set("MN_SY_DVRY.DVRY_STATUS_TYPE", "max:1");
tableData.set("MN_SY_DVRY.DVRY_STATUS_DATE", "date");
tableData.set("MN_SY_DVRY.DVRY_DELAY_TIME", "number");
tableData.set("MN_SY_DVRY.ADJ_GRP_CODE", "max:5");
tableData.set("MN_SY_DVRY.ORD_ADJ_GRP_CODE", "max:5");
tableData.set("MN_SY_DVRY.DVRY_STATUS_TEXT", "max:200");
tableData.set("MN_SY_DVRY_AREA.DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_DVRY_AREA.AR_SEQ_NO", "number");
tableData.set("MN_SY_DVRY_AREA.PUT_DATE", "date");
tableData.set("MN_SY_DVRY_AREA.MOD_DATE", "date");
tableData.set("MN_SY_DVRY_AREA.VIEW_ORDER", "number");
tableData.set("MN_SY_DVRY_FEE.SEQ_NO", "number");
tableData.set("MN_SY_DVRY_FEE.DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_DVRY_FEE.START_TIME", "number");
tableData.set("MN_SY_DVRY_FEE.END_TIME", "number");
tableData.set("MN_SY_DVRY_FEE.DVRY_DAY", "number");
tableData.set("MN_SY_DVRY_FEE.START_DIS", "number");
tableData.set("MN_SY_DVRY_FEE.END_DIS", "number");
tableData.set("MN_SY_DVRY_FEE.FEE_1", "number");
tableData.set("MN_SY_DVRY_FEE.FEE_2", "number");
tableData.set("MN_SY_DVRY_FEE.FEE_3", "number");
tableData.set("MN_SY_DVRY_FEE_AREA.SEQ_NO", "number");
tableData.set("MN_SY_DVRY_FEE_AREA.ST_CODE", "max:7");
tableData.set("MN_SY_DVRY_FEE_AREA.AREA_TEXT", "max:50");
tableData.set("MN_SY_DVRY_FEE_AREA.START_TIME", "number");
tableData.set("MN_SY_DVRY_FEE_AREA.END_TIME", "number");
tableData.set("MN_SY_DVRY_FEE_AREA.FEE_1", "number");
tableData.set("MN_SY_DVRY_SHARE.DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_DVRY_SHARE.SH_DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_DVRY_SHARE.SHARE_TIME", "number");
tableData.set("MN_SY_DVRY_ST.DVRY_TYPE_CD", "max:4");
tableData.set("MN_SY_DVRY_ST.ST_CODE", "max:7");
tableData.set("MN_SY_DVRY_ST.DVRY_STATUS_TYPE_ST", "max:1");
tableData.set("MN_SY_FILE.FILE_NO", "number");
tableData.set("MN_SY_FILE.MOD_DATE", "date");
tableData.set("MN_SY_FILE.MOD_USER_ID", "max:20");
tableData.set("MN_SY_FILE.DATA_STATUS", "max:1");
tableData.set("MN_SY_FILE.FILE_TYPE", "max:1");
tableData.set("MN_SY_FILE.FILE_PATH", "max:100");
tableData.set("MN_SY_FILE.CON_GRP_TYPE", "max:1");
tableData.set("MN_SY_FILE.CON_GRP_CODE", "max:5");
tableData.set("MN_SY_GOODS.GOODS_NO", "number");
tableData.set("MN_SY_GOODS.PUT_DATE", "date");
tableData.set("MN_SY_GOODS.DATA_STATUS", "max:1");
tableData.set("MN_SY_GOODS.MOD_DATE", "date");
tableData.set("MN_SY_GOODS.BAR_CODE", "max:20");
tableData.set("MN_SY_GOODS.GOODS_NAME", "max:100");
tableData.set("MN_SY_GOODS.GOODS_PRICE", "number");
tableData.set("MN_SY_GOODS.GOODS_TYPE_CD", "max:4");
tableData.set("MN_SY_GOODS.GOODS_DETAIL_CD", "max:4");
tableData.set("MN_SY_GOODS.GOODS_MEMO", "max:200");
tableData.set("MN_SY_GOODS.STOCK_YN", "max:1");
tableData.set("MN_SY_GOODS.TAX_YN", "max:1");
tableData.set("MN_SY_GOODS.IMG_FILE", "max:100");
tableData.set("MN_SY_GOODS.IMG_MOD_DATE", "date");
tableData.set("MN_SY_GOODS.FRAN_TYPE_CD", "max:4");
tableData.set("MN_SY_GOODS.IMG_T_FILE", "max:100");
tableData.set("MN_SY_GOODS.IMG_T_MOD_DATE", "date");
tableData.set("MN_SY_GOODS_FR.FR_GOODS_CODE", "max:8");
tableData.set("MN_SY_GOODS_FR.FR_GOODS_NAME", "max:200");
tableData.set("MN_SY_GOODS_FR.FR_TYPE_CD", "max:4");
tableData.set("MN_SY_GOODS_FR.DATA_STATUS", "max:1");
tableData.set("MN_SY_GOODS_FR.MOD_DATE", "date");
tableData.set("MN_SY_GOODS_FR.BAR_CODE", "max:20");
tableData.set("MN_SY_GOODS_FR.MAPP_NAME_1", "max:100");
tableData.set("MN_SY_GOODS_FR.MAPP_NAME_2", "max:100");
tableData.set("MN_SY_GOODS_FR.MAPP_NAME_3", "max:100");
tableData.set("MN_SY_GOODS_FR.MAPP_NAME_4", "max:100");
tableData.set("MN_SY_GOODS_FR.GOODS_PRICE", "number");
tableData.set("MN_SY_GOODS_FR.GOODS_TYPE_CD", "max:4");
tableData.set("MN_SY_GOODS_FR.GOODS_DETAIL_CD", "max:4");
tableData.set("MN_SY_GOODS_FR.GOODS_MEMO", "max:200");
tableData.set("MN_SY_GOODS_FR.STOCK_YN", "max:1");
tableData.set("MN_SY_GOODS_FR.TAX_YN", "max:1");
tableData.set("MN_SY_GOODS_FR.IMG_FILE", "max:100");
tableData.set("MN_SY_GOODS_FR.IMG_MOD_DATE", "date");
tableData.set("MN_SY_GOODS_FR.IMG_T_FILE", "max:100");
tableData.set("MN_SY_GOODS_FR.IMG_T_MOD_DATE", "date");
tableData.set("MN_SY_GRP_TPLT.TPLT_CODE", "max:7");
tableData.set("MN_SY_GRP_TPLT.PUT_USER_ID", "max:20");
tableData.set("MN_SY_GRP_TPLT.PUT_DATE", "date");
tableData.set("MN_SY_GRP_TPLT.MOD_USER_ID", "max:20");
tableData.set("MN_SY_GRP_TPLT.MOD_DATE", "date");
tableData.set("MN_SY_GRP_TPLT.DATA_STATUS", "max:1");
tableData.set("MN_SY_GRP_TPLT.APPR_STATUS", "max:1");
tableData.set("MN_SY_GRP_TPLT.TPLT_TYPE", "max:1");
tableData.set("MN_SY_GRP_TPLT.TPLT_TITLE", "max:100");
tableData.set("MN_SY_GRP_TPLT.TPLT_CONTENT", "max:1000");
tableData.set("MN_SY_GRP_TPLT.BTN_INFO", "max:100");
tableData.set("MN_SY_GRP_TPLT.SERVICE_TYPE", "max:1");
tableData.set("MN_SY_GRP_TPLT.SENDER_KEY_TYPE", "max:1");
tableData.set("MN_SY_GRP_TPLT.SENDER_KEY", "max:1");
tableData.set("MN_SY_POS_URL.POS_TYPE_CD", "max:4");
tableData.set("MN_SY_POS_URL.POS_URL", "max:200");
tableData.set("MN_SY_SRCH_WORD.SRCH_WORD", "max:50");
tableData.set("MN_SY_SRCH_WORD.SRCH_TYPE", "max:1");
tableData.set("MN_SY_SRCH_WORD.VIEW_ORDER", "number");
tableData.set("MN_SY_TALK_TPLT.TPLT_CODE", "max:7");
tableData.set("MN_SY_TALK_TPLT.DATA_STATUS", "max:1");
tableData.set("MN_SY_TALK_TPLT.TPLT_TYPE", "max:1");
tableData.set("MN_SY_TALK_TPLT.TPLT_NAME", "max:100");
tableData.set("MN_SY_TALK_TPLT.TPLT_CONTENT", "max:1000");
tableData.set("MN_SY_TALK_TPLT.BTN_INFO", "max:50");
tableData.set("MN_SY_TALK_TPLT.BTN_CON_URL", "max:200");
tableData.set("MN_SY_TALK_TPLT.SERVICE_TYPE", "max:1");
tableData.set("MN_SY_TALK_TPLT.SENDER_KEY", "max:40");
tableData.set("MN_SY_WORD_ADDR.WORD_ADDR_NO", "number");
tableData.set("MN_SY_WORD_ADDR.PUT_DATE", "date");
tableData.set("MN_SY_WORD_ADDR.PUT_USER_ID", "max:20");
tableData.set("MN_SY_WORD_ADDR.DATA_STATUS", "max:1");
tableData.set("MN_SY_WORD_ADDR.MOD_DATE", "date");
tableData.set("MN_SY_WORD_ADDR.MOD_USER_ID", "max:20");
tableData.set("MN_SY_WORD_ADDR.WORD_ADDR", "max:100");
tableData.set("MN_SY_WORD_ADDR.ADDR_1", "max:30");
tableData.set("MN_SY_WORD_ADDR.ADDR_2", "max:100");
tableData.set("MN_SY_WORD_ADDR.ADDR_3", "max:100");
tableData.set("MN_SY_WORD_ADDR.ADDR_4", "max:200");
tableData.set("MN_SY_WORD_ADDR.ADDR_6", "max:200");
tableData.set("MN_SY_WORD_ADDR.ADDR_8", "max:100");
tableData.set("MN_SY_WORD_ADDR.ADDR_9", "max:100");
tableData.set("MN_SY_WORD_ADDR.ADDR_10", "max:100");
tableData.set("MN_SY_WORD_ADDR.ADDR_11", "max:50");
tableData.set("MN_SY_WORD_ADDR.ADDR_12", "max:50");
tableData.set("MN_SY_WORD_ADDR.ADDR_LAT_Y", "max:20");
tableData.set("MN_SY_WORD_ADDR.ADDR_LNG_X", "max:20");
