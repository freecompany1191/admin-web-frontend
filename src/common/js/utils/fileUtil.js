import util from './util.js'

/** 날짜 YYYYMMDD 형식으로 변환 */
Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();

    return yyyy + (mm[1] ? mm : '0'+mm[0]) + (dd[1] ? dd : '0'+dd[0]);
}

export default {
    /** 
     * 엑셀 파일 다운로드 기능 
     * 응답 받은 데이터를 파일로 변환시켜 다운 받을 수 있도록 한다
     **/
    getExcelFile(response, fileName) {
        let result = document.createElement('a');

        console.log((new Date()).yyyymmdd());

        let blob = new Blob([response.data], {type: response.headers['content-type']})

        //파일이름이 없을 경우 기본 파일이름을 셋팅한다 
        // 기본 파일이름 : export_yyyymmdd.xlsx
        fileName = util.isNull(fileName) ? 'export' : fileName;
        fileName = fileName+'_'+(new Date()).yyyymmdd()+'.xlsx';

        //this.fileCheck(fileName);

        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_self';
        link.download = fileName;
        link.click();
    },


    /** 파일명 및 확장자 체크 */
    fileCheck(path) {
        /* 
        if(path=='') {
         alert('파일을 선택하세요.');
         return false;
        }
         */
        // 먼저 파일의 경로에서 디렉토리를 제외한 순수 파일이름과 . 을 포함한 확장자까지만 뽑습니다. (파일이름.확장자)
        let file = path.substring(path.lastIndexOf('\\')+1,path.length);
        
        // 파일이름과 확장자를 뽑습니다. 파일이름에도 점 기호 ( . ) 를 사용하는 경우가 있으므로 이러한 경우까지
        // 염두해서 소스를 만들었습니다. 파일이름에 점기호가 있는 파일을 선택해서 확인해보세요.
        // 파일확장자가 아예 없는 경우도 있으므로 이 경우에는 별도로 메시지를 띄우기로 하겠습니다.
        let filename; let exp;
        if(file.indexOf('.')>=0) {
         filename = file.substring(0,file.lastIndexOf('.'));
         exp = file.substring(file.lastIndexOf('.')+1,file.length);
        } else {
         filename = file;
         exp = '';
        }
        
        // 파일확장자 유무를 반환하여 확장자가 있으면 확장자를 소문자로 반환합니다. 없으면 별도 메시지를 반환합니다.
        let expMsg = exp!='' ? exp.toLowerCase() : '선택하신 파일에 확장자가 없습니다.';
        //alert('파일명 : '+filename+'\n'+'확장자 : '+expMsg);
    }
      
}