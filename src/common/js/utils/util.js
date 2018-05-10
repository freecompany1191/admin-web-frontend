import util from '@/common/js/utils/util.js';

export default {
	/**
	 * null 체크
	 */ 
	isNull: function(str) {
		if (str == undefined || str == '' || str == 'null') {
			return true;
		}
		return false;
	},
	/**
	 * null 체크 하여 변환
	 */ 
	getNull: function(str, restr) {
		if (this.isNull(str)) {
			// 숫자 타입 체크
			if (typeof restr == 'number') {
				return restr;
			}

			if (this.isNull(restr)) {
				return "";
			}
			return restr;
		}
		return str;
	},
	/**
	 * 정해진 길이만큼 왼쪽에 채운다
	 */
	getLPAD: function(str, strLen, restr) {
		str = this.getNull(str, "");
		restr = this.getNull(restr, " ");

		let result = str + "";
		let len = result.length;

		// 정해진 길이만큼 왼쪽에 문자추가
		for(let i = len; i < strLen; i++) {
			result = restr + result;
		}
		return result;
	},
	/**
	 * 정해진 길이만큼 오른쪽에 채운다
	 */
	getRPAD: function(str, strLen, restr) {
		str = this.getNull(str, "");
		restr = this.getNull(restr, " ");

		let result = str + "";
		let len = result.length;
		
		// 정해진 길이만큼 오른쪽에 문자추가
		for(let i = len; i < strLen; i++) {
			result = result + restr;
		}
		return result;
	},
	/**
	 * 스트링을 숫자로 변형
	 */
	toInteger: function(str, reNum) {
		if (this.isNull(str)) {
			if (this.isNull(reNum))
				return 0;
			return reNum;
		}
		str = str + "";	// 스트링으로 변환
		str = str.replace(/,/g, ""); // 쉼표 모두 제거
		return parseFloat(str);
	},
	/**
	 * 전화번호 하이픈 추가
	 */
	telFormat: function(num, type) {
		if (this.isNull(num))
			return "";
		
		let formatNum = '';
		if (num.length == 11) {
			if (type == 0) {
				formatNum = num.replace(/(\d{3})(\d{4})(\d{1})(\d{3})/, '$1-$2-*$4');
			} else {
				formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
			}
		} else if (num.length == 8) {
			if (type == 0) {
				formatNum = num.replace(/(\d{4})(\d{1})(\d{3})/, '$1-*$3');
			} else {
				formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
			}
		} else {
			if (num.indexOf('02') == 0) {
				if (type == 0) {
					formatNum = num.replace(/(\d{2})(\d{4})(\d{1})(\d{3})/, '$1-$2-*$4');
				} else {
					formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
				}
			} else {
				if (type == 0) {
					formatNum = num.replace(/(\d{3})(\d{3})(\d{1})(\d{3})/, '$1-$2-*$4');
				} else {
					formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				}
			}
		}
		return formatNum;
	},
	/**
	 * 금액에 컴마 추가
	 */
	moneyFormat: function(str) {
		if (this.isNull(str)) return "0";
		
		str = str + "";
		return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	/**
	 * 날짜 및 시간 리턴
	 * str : 설정날짜 (20180101090000 OR 2018-01-01 09:00:00)
	 * dateformatting : yyyyMMddhhmmss
	 */
	dateFormat: function(str, dateformatting) {
		let date = new Date();

		if (!this.isNull(str)) {
			let tmp = str.replace(/-|:| /gi, '');
			let tmpLen = tmp.length;

			date.setFullYear(tmpLen >= 4 ? tmp.substr(0, 4) : '0000');
			date.setMonth(tmpLen >= 6 ? tmp.substr(4, 2) - 1 : '00');
			date.setDate(tmpLen >= 8 ? tmp.substr(6, 2) : '01');
			date.setHours(tmpLen >= 10 ? tmp.substr(8, 2) : '01');
			date.setMinutes(tmpLen >= 12 ? tmp.substr(10, 2) : '00');
			date.setSeconds(tmpLen >= 14 ? tmp.substr(12, 2) : '00');
		}
		
		let weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

		return dateformatting.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
			let ret = '';
			let h = '';
			let retLen = 0;
			switch ($1) {
				case "yyyy": ret = date.getFullYear(); break;
				case "yy": ret = (date.getFullYear() % 1000); retLen = 2; break;
				case "MM": ret = (date.getMonth() + 1); retLen = 2; break;
				case "dd": ret = date.getDate(); retLen = 2; break;
				case "E": ret = weekName[date.getDay()]; break;
				case "HH": ret = date.getHours(); retLen = 2; break;
				case "hh": ret = ((h = date.getHours() % 12) ? h : 12); retLen = 2; break;
				case "mm": ret = date.getMinutes(); retLen = 2; break;
				case "ss": ret = date.getSeconds(); retLen = 2; break;
				case "a/p": ret = date.getHours() < 12 ? "오전" : "오후"; retLen = 2; break;
				default: ret = $1; break;
			}
			return util.getLPAD(ret, retLen, '0');
		});
	},
	
	/**
	 * 파라메터 VALUE 값에 자동으로 │ 를 조합하여 문자열을 만든다
	 * (기본적으로 조합후 오류 방지를 위해 │ 두개를 더 붙인다)
	 * 빈 배열 값이면 │ 두개를 추가한 문자열을 리턴한다
	 * @param {any} arr 배열에 담은 VALUE 값
	 * @returns │ 가 조합된 문자열 VALUE
	 */
	getValue: (arr) => {
		// let len = Object.keys(obj).length;
		let str = arr.join('│');
		str+='│'.repeat(2);

		if(!str.includes('│')) {
			str+='│'.repeat(2);
		}
		return str;
	}
}