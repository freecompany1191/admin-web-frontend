<template>
  <div class="innerContent overflowH">
        <!-- 타이틀 -->
        <div>
            <h2 class="bighead-Title">
                <span v-text="pageTitle">{{pageTitle}}</span>
                <span class="bighead-Title-sub" v-text="pageTitle_sub">{{pageTitle_sub}}</span>
            </h2>
        </div>

        <!-- 텝메뉴 -->
        <div>
            <div class="table-view">
                <tr>
                    <td>
                        <table>
                            <tbody>
                                <tr v-if="this.no != '0'">
                                    <td class="w150 bgGray textCenter">발송여부</td>
                                    <td class="w350">
                                        <label><input type="radio" name="DATA_STATUS" id="DATA_STATUS" v-model="viewData.DATA_STATUS" value="1" checked/>발송</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="DATA_STATUS" id="DATA_STATUS" v-model="viewData.DATA_STATUS" value="2"/>발송안함</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="DATA_STATUS" id="DATA_STATUS" v-model="viewData.DATA_STATUS" value="0"/>삭제</label>&nbsp;&nbsp;
                                    </td>
                                </tr> 
                                <tr v-if="this.no == '0' && this.userInfo.multiType != 'N' && this.userInfo.multiType != 'S'" >
                                    <td class="w150 bgGray textCenter">가맹점 명</td>

                                    <td v-if="this.userInfo.multiType != 'S' && this.userInfo.multiType != 'N'" class="w500">
                                        <select v-if="this.user_type_cd == '9'" class="w100" v-model="selectHd" v-on:change="getBrList();">                                
                                            <option value="">제휴본사 전체</option>
                                            <option v-for="row in arrSelectHd" :key="row.HD_CODE" v-bind:value="row">
                                                {{row.HD_NAME}}
                                            </option>
                                        </select>
                                        <select v-if="this.user_type_cd == '9' || this.user_type_cd == '7'" class="w100" v-model="selectBr" v-on:change="getStList();">                                
                                            <option value="">총판 전체</option>
                                            <option v-for="row in arrSelectBr" :key="row.BR_CODE" v-bind:value="row">
                                                {{row.BR_NAME}}
                                            </option>
                                        </select>
                                        <select v-if="this.user_type_cd != '3'" class="w100" v-model="selectSt" v-on:change="getStMultiList();">                                
                                            <option value="">가맹점 전체</option>
                                            <option v-for="row in arrSelectSt" :key="row.ST_CODE" v-bind:value="row">
                                                {{row.ST_NAME}}
                                            </option>
                                        </select>
                                        <select v-if="this.selectSt.MULTI_TYPE == 'M' || this.userInfo.multiType == 'M'" class="w100" v-model="selectStMulti">
                                            <option value="">멀티가맹점 전체</option>
                                            <option v-for="row in arrSelectStMulti" :key="row.ST_CODE" v-bind:value="row">
                                                {{row.ST_NAME}}
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr v-if="this.no != '0'">
                                    <td class="w150 bgGray textCenter">가맹점 명</td>
                                    <td class="w350">{{talkInfo.ST_NAME_STR}}</td>
                                </tr>
                                <tr>
                                    <td class="w150 bgGray textCenter">발송시점</td>
                                    <td class="w350">
                                        <label><input type="radio" name="SEND_TIME_TYPE" id="SEND_TIME_TYPE" v-model="viewData.SEND_TIME_TYPE" value="1" v-on:change="getTpltList()" />접수</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="SEND_TIME_TYPE" id="SEND_TIME_TYPE" v-model="viewData.SEND_TIME_TYPE" value="2"  v-on:change="getTpltList()"/>출발</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="SEND_TIME_TYPE" id="SEND_TIME_TYPE" v-model="viewData.SEND_TIME_TYPE" value="3" v-on:change="getTpltList()"/>완료</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="SEND_TIME_TYPE" id="SEND_TIME_TYPE" v-model="viewData.SEND_TIME_TYPE" value="5" v-on:change="getTpltList()"/>취소</label>&nbsp;&nbsp;

                                        <select class="w120" name="SEND_TIME" id="SEND_TIME" v-model="viewData.SEND_TIME">
                                            <option value="0">즉시</option>
                                            <option value="5">5분 후</option>
                                            <option value="10">10분 후</option>
                                            <option value="15">15분 후</option>
                                            <option value="20">20분 후</option>
                                            <option value="25">25분 후</option>
                                            <option value="30">30분 후</option>
                                        </select>
                                    </td>
                                </tr> 
                                <tr>
                                    <td class="w150 bgGray textCenter">대상구분</td>
                                    <td class="w350">
                                        <label><input type="radio" name="SEND_CU_TYPE" id="SEND_CU_TYPE" v-model="viewData.SEND_CU_TYPE" value="0" checked/>모든 고객</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="SEND_CU_TYPE" id="SEND_CU_TYPE" v-model="viewData.SEND_CU_TYPE" value="1"/>웹 주문 고객</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="SEND_CU_TYPE" id="SEND_CU_TYPE" v-model="viewData.SEND_CU_TYPE" value="2"/>전화 주문 고객</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="w150 bgGray textCenter">누적 이용회수</td>
                                    <td class="w350">
                                        <br>
                                        <label><input type="radio" name="SEND_CU_END_TYPE" id="SEND_CU_END_TYPE" v-model="viewData.SEND_CU_END_TYPE" value="0" checked/>회수 무관</label>&nbsp;&nbsp;
                                        <label><input type="radio" name="SEND_CU_END_TYPE" id="SEND_CU_END_TYPE" v-model="viewData.SEND_CU_END_TYPE" value="1"/>이용회수 선택</label>
                                        <br><br>
                                        <tr v-if="this.viewData.SEND_CU_END_TYPE != '0'">
                                            <label><input type="checkbox" v-model="selected" :value="1"/>1회</label>
                                            <label><input type="checkbox" v-model="selected" :value="2"/>2회</label>
                                            <label><input type="checkbox" v-model="selected" :value="3"/>3회</label>
                                            <label><input type="checkbox" v-model="selected" :value="4"/>4회</label>
                                            <label><input type="checkbox" v-model="selected" :value="5"/>5회</label>
                                            <label><input type="checkbox" v-model="selected" :value="6"/>6회</label>
                                            <label><input type="checkbox" v-model="selected" :value="7"/>7회</label>
                                            <label><input type="checkbox" v-model="selected" :value="8"/>8회</label>
                                            <label><input type="checkbox" v-model="selected" :value="9"/>9회</label>
                                            <br><br>
                                        </tr>
                                    </td>
                                </tr>  
                                <tr>
                                    <td class="w150 bgGray textCenter">발송 메세지</td>
                                    <td class="w350">
                                        <textarea readonly rows="7" cols="47" v-model="viewData.TPLT_CONTENT" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <div style="height:420px;overflow:scroll;border:1px groove ;">
                        <td>
                            <table style="width:400px;">
                                <thead>
                                    <tr>
                                        <td colspan="1" class="w350 bgGray textCenter">발송 메세지 선택</td>
                                        
                                    </tr>       
                                </thead>

                                <tr v-if="arrTplit.length == 0">
                                    <td colspan="7">내역이 없습니다</td>
                                </tr>
                                <tr v-else v-for="row in arrTplit" :key="row.TPLT_CODE" >
                                    <tbody id="">
                                        <tr>
                                            <td style="width:400px;" class="bgGray textCenter">{{row.TPLT_TITLE}}</td>
                                        </tr>
                                        <tr>
                                            <textarea readonly rows="7" cols="55" v-model="row.TPLT_CONTENT" />
                                        </tr>
                                        <tr>
                                            <button  class="btn-box-r bgGray overflowH" style="line-height: 25px;width:90px; margin-left:5px" v-on:click="selectTplt(row)">선택</button>
                                        </tr>
                                    </tbody>
                                     <br>
                                </tr>        
                            </table>
                        </td>
                    </div>
                </tr>
                
            </div>
            
        </div>

        <!-- 목록으로 버튼 -->
        <div style="padding-top: 15px;width:970px;">
            <button v-if="this.no == '0'" class="btn-box-r bgGray overflowH floatRight" style="line-height: 30px;width:90px;" v-on:click="addData()">등록</button>
            <button v-else class="btn-box-r bgGray overflowH floatRight" style="line-height: 30px;width:90px;" v-on:click="updateData()">수정</button>
            <button class="btn-box bgGray overflowH floatleft"  v-on:click="back()"><i class="fa fa-undo"></i> 목록으로</button>
        </div>


    </div>
</template>

<script>
//HTTP 통신 임포트
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import util_validate from '@/common/js/utils/util_validate.js';
import authUtil from '@/common/js/utils/authUtil.js';

export default {
    name: 'talkView',
    data () {
        return {
            pageTitle: '해피톡 발송설정'
            , pageTitle_sub: '해피톡 발송설정을 관리하실수 있습니다.'
            // 톡데이터
            , talkInfo: ''
            // 가맹점명
            , ST_NAME: ''
            // 템플릿 리스트
            , arrTplit: []
            // 멀티가맹점
            , stMulti: ''
            // 체크박스 리스트
            , selected: []
            // 유저정보
            , userInfo: ''
            // HD 리스트
			, arrSelectHd: []
			// 선택된 HD 오브젝트
			, selectHd: ''
            // 총판 리스트
            , arrSelectBr: []
            // 선택된 총판 오브젝트
            , selectBr: ''
            // 가맹점 리스트
            , arrSelectSt: []
            //선택된 가맹점 오브젝트
            , selectSt: ''
            // 멀티가맹점 리스트
            , arrSelectStMulti: []
            //선택된 가맹점 오브젝트
            , selectStMulti: ''
            //상세데이터
            , viewData: { DATA_STATUS:'1', SEND_TIME_TYPE: '1'
                        , SEND_TIME: '0', SEND_CU_TYPE: "0"
                        , SEND_CU_END_TYPE: '0'
                        , SEND_CU_END_CNT: '0'
                        , ARR_SEND_CU_END_CNT: []
                        , TPLT_CONTENT: ''
                        , TPLT_TITLE: ''
                        , TPLT_CODE: ''
                        , ST_CODE: ''
                        , ST_TYPE: ''

                        }

            ,user_type_cd: ''

        }
    },
    props : [ 'no' ], 
    created(){        
        
        var userInfo = authUtil.getUserInfo();
        this.userInfo = userInfo;

        this.user_type_cd = this.userInfo.userTypeCd.substr(0, 1);
        
        //로드시 실행

        if(this.no != '0'){
            this.getData();
        } else{

            this.getTpltList();

            if(this.user_type_cd == "9"){
				this.getHdList();
			} else if(this.user_type_cd == "7"){
                this.getBrList();
            } else if(this.user_type_cd == "5"){
                this.getStList();
            } else if(this.user_type_cd == "3" && this.userInfo.multiType == 'M'){
                this.getStMultiList();
            }
        }
        
    },
    computed : {
        //계산형 단일 실행
    },
    methods: { 
        //이벤트 기능정의
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        getData: function(){

            this.talkInfo = '';

            //변수할당
            var tmp0 = this.no;
            //전문번호
            var IN_REQ_NUM = "AW04_03_V01";
            //전문데이터
            var IN_VALUE = tmp0 + "│";  // 알림톡_일련_번호
            //통신 호출
            httpCommon.sendPost(this, "204", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {
                              
                if(data.out_CODE != "1" && data.out_ROW1.length == 0)
                {
                    return;
                }       
                
                vue.talkInfo = data.out_ROW1[0];

                vue.viewData.DATA_STATUS = vue.talkInfo.DATA_STATUS;
                vue.viewData.SEND_TIME =  vue.talkInfo.SEND_TIME;
                vue.viewData.SEND_CU_TYPE = vue.talkInfo.SEND_CU_TYPE;
                vue.viewData.SEND_TIME_TYPE = vue.talkInfo.SEND_TIME_TYPE;
                vue.viewData.SEND_CU_END_CNT = util.getNull(vue.talkInfo.SEND_CU_END_CNT, "0");
                vue.viewData.TPLT_CONTENT = vue.talkInfo.TPLT_CONTENT;
                vue.viewData.TPLT_TITLE = vue.talkInfo.TPLT_TITLE;
                vue.viewData.TPLT_CODE = vue.talkInfo.TPLT_CODE;
                vue.viewData.ST_TYPE = vue.talkInfo.ST_TYPE;
                vue.viewData.ST_CODE = vue.talkInfo.ST_CODE;

                if(vue.viewData.SEND_CU_END_CNT == '0'){
                    vue.viewData.SEND_CU_END_TYPE = '0';
                } else{
                    vue.viewData.SEND_CU_END_TYPE = '1';

                    var tmp = vue.viewData.SEND_CU_END_CNT.split(',');
                    for(var i = 0 ; i < tmp.length; i++)
                    {
                        vue.selected[tmp[i] - 1] = tmp[i];
                    }

                }

                
                vue.getTpltList();
            });
        },        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // 템플릿 선택
        selectTplt: function(row)
        {
            this.viewData.TPLT_CONTENT = row.TPLT_CONTENT;
            this.viewData.TPLT_TITLE = row.TPLT_TITLE;
            this.viewData.TPLT_CODE = row.TPLT_CODE;
        },
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // 템플릿 가져오기
        getTpltList: function()
        {
            var IN_REQ_NUM = "AW04_05_V01";

            // 발송_시점_구분 (1: 접수, 2: 출발, 3: 완료, 4: 요일지정, 5: 취소)
            var tmp0;   

            if(this.viewData.SEND_TIME_TYPE == "1"){
                tmp0 = "3";   
            } else if(this.viewData.SEND_TIME_TYPE == "2"){
                tmp0 = "4";   
            } else if(this.viewData.SEND_TIME_TYPE == "5"){
                tmp0 = "5";   
            }else{
                tmp0 = "2";   
            }

            var tmp1 = "1";   

            var IN_VALUE = tmp0 + "│"   // 템플릿_구분 (1: 주문하기 (주문톡/모두), 2: 평가하기 (해피톡/완료), 3: 주문접수 (해피톡/접수), 4: 출발안내 (해피톡/출발))
                    + tmp1 + "│" // 알림톡_구분 (1: 해피톡, 2: 주문톡)
                    ;

            this.arrTplit = [];

            //통신 호출
            httpCommon.sendPost(this, "204", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {           
                
                if(data.out_CODE == "1"){
                    vue.arrTplit = data.out_ROW1;
                } 

            });
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 등록 
        addData: function(){

            if((this.user_type_cd == '9' || this.user_type_cd == '7' || this.user_type_cd == '5') && util.isNull(this.selectSt.ST_CODE)){
                alert("가맹점을 선택하세요");
                return;
            } 

            if(this.viewData.TPLT_CODE == ''){
                alert("발송메세지를 선택하세요");
                return;
            }

            var IN_REQ_NUM = "AW04_01_V01";

            var tmp0 = this.userInfo.userId;                  
            var tmp1 = "1";                       
            var tmp2 = util.getNull(this.selectSt.ST_CODE, this.userInfo.stCode);    
            var tmp3 = "0";
            
            // 멀티가맹점 전체인지 체크
            if(util.getNull(this.selectSt.MULTI_TYPE, this.userInfo.multiType) == 'M' && util.isNull(this.selectStMulti.ST_CODE)){
                tmp3 = "1";
            } 

            var tmp4 = this.viewData.SEND_TIME_TYPE;     
            var tmp5 = this.viewData.SEND_TIME; 
            var tmp6 = "0";   
            var tmp7 = "0";    
            var tmp8 = "0"; 
            var tmp9 = "0"     
            var tmp10 = this.viewData.SEND_CU_TYPE; 
            var tmp11 = this.getSendCuCnt(); 

            if(this.viewData.SEND_CU_END_TYPE == "0"){
                tmp11 = "";
            }

            var tmp12 = this.viewData.TPLT_CODE; 

            var IN_VALUE = tmp0 + "│"   // 사용자_ID (로그인정보)
                    + tmp1 + "│" // 알림톡_구분 (1: 해피톡, 2: 주문톡)
                    + tmp2 + "│" // 가맹점_코드 (아래 가맹점_구분이 1이면 마스터가맹점 코드)
                    + tmp3 + "│" // 가맹점_구분 (0: 가맹점별, 1: 멀티가맹점 전체)
                    + tmp4 + "│" // 발송_시점_구분 (1: 접수, 2: 출발, 3: 완료, 4: 요일지정)
                    + tmp5 + "│" // 발송_시간 (단위: 분, 0: 즉시, 해피톡 00분 후)
                    + tmp6 + "│" // 발송_일자 (0일 후, 주문톡 완료설정, 00일 후)
                    + tmp7 + "│" // 발송_일자_시간 (HH24MI, 주문톡 완료시 설정, 00:00)
                    + tmp8 + "│" // 발송_요일 (일~토, 해당 요일이 1, 주문톡 요일설정)
                    + tmp9 + "│" // 발송_반복_회수 (0: 계속반복, 주문톡 요일설정)
                    + tmp10 + "│" // 발송_고객_구분 (0: 전체, 1: 웹주문고객, 2: 전화주문고객)
                    + tmp11 + "│" // 발송_고객_완료_회수 (NULL: 모든고객, 회수를 컴마로 구분)
                    + tmp12 + "│" // 템플릿_코드 (그룹템플릿코드)
                    ;

            //통신 호출
            httpCommon.sendPost(this, "204", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {    

                if (data.out_CODE == '1')
                {
                    alert("등록이 완료되었습니다.");
                    window.history.go(-1)
                }
                else
                {
                    alert("등록을 실패하였습니다.");
                }
                
            });

        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 등록 
        updateData: function(){

            if(this.viewData.TPLT_CODE == ''){
                alert("발송메세지를 선택하세요");
                return;
            }

            var IN_REQ_NUM = "AW04_04_V01";

            var tmp0 = this.userInfo.userId;                  
            var tmp1 = "1";                       
            var tmp2 = this.viewData.ST_CODE;              
            var tmp3 = this.viewData.ST_TYPE;                      
            var tmp4 = this.viewData.SEND_TIME_TYPE;     
            var tmp5 = this.viewData.SEND_TIME; 
            var tmp6 = "0";   
            var tmp7 = "0";    
            var tmp8 = "0"; 
            var tmp9 = "0"     
            var tmp10 = this.viewData.SEND_CU_TYPE; 
            var tmp11 = this.getSendCuCnt(); 

            if(this.viewData.SEND_CU_END_TYPE == "0"){
                tmp11 = "";
            }


            var tmp12 = this.viewData.TPLT_CODE; 
            var tmp13 = this.no;
            var tmp14 = this.viewData.DATA_STATUS;

            var IN_VALUE = tmp0 + "│"   // 사용자_ID (로그인정보)
                    + tmp1 + "│" // 알림톡_구분 (1: 해피톡, 2: 주문톡)
                    + tmp2 + "│" // 가맹점_코드 (아래 가맹점_구분이 1이면 마스터가맹점 코드)
                    + tmp3 + "│" // 가맹점_구분 (0: 가맹점별, 1: 멀티가맹점 전체)
                    + tmp4 + "│" // 발송_시점_구분 (1: 접수, 2: 출발, 3: 완료, 4: 요일지정)
                    + tmp5 + "│" // 발송_시간 (단위: 분, 0: 즉시, 해피톡 00분 후)
                    + tmp6 + "│" // 발송_일자 (0일 후, 주문톡 완료설정, 00일 후)
                    + tmp7 + "│" // 발송_일자_시간 (HH24MI, 주문톡 완료시 설정, 00:00)
                    + tmp8 + "│" // 발송_요일 (일~토, 해당 요일이 1, 주문톡 요일설정)
                    + tmp9 + "│" // 발송_반복_회수 (0: 계속반복, 주문톡 요일설정)
                    + tmp10 + "│" // 발송_고객_구분 (0: 전체, 1: 웹주문고객, 2: 전화주문고객)
                    + tmp11 + "│" // 발송_고객_완료_회수 (NULL: 모든고객, 회수를 컴마로 구분)
                    + tmp12 + "│" // 템플릿_코드 (그룹템플릿코드)
                    + tmp13 + "│" // 알림톡_일련_번호
                    + tmp14 + "│" // 데이터_상태 (0: 삭제, 1: 발송, 2: 발송안함)
                    ;

            //통신 호출
            httpCommon.sendPost(this, "204", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {    

                if (data.out_CODE == '1')
                {
                    alert("수정이 완료되었습니다.");
                    window.history.go(-1)
                }
                else
                {
                    alert("수정을 실패하였습니다.");
                }
                
            });

        },
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 제휴본사 가져오기
        getHdList: function(){
			//변수할당
			var tmp0 = "A";
			var tmp1 = "2";

			//전문번호
			var IN_REQ_NUM = "GR00_01_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
						+ tmp1 + "│" // 정렬_구분 (1: 코드순, 2: 이름순)
					;

			//console.log('IN_VALUE:'+IN_VALUE);
			//배열초기화
			this.arrSelectHd = [];
            this.selectHd = '';
            this.arrSelectBr = [];
            this.selectBr = '';
            this.arrSelectSt = [];
            this.selectSt = '';
            this.arrSelectStMulti = [];
            this.selectStMulti = '';


			//통신 호출
			httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {            
				vue.arrSelectHd = data.out_ROW1;
			});
		},
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 총판리스트 가져오기
        getBrList: function(){
            //변수할당
            var tmp0 = "A";
			var tmp1 = "2";
			var tmp2 = util.getNull(this.selectHd.HD_CODE, this.userInfo.hdCode);
			//전문번호
			var IN_REQ_NUM = "GR00_02_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ tmp1 + "│" // 정렬_구분 (1: 코드순, 2: 이름순)
					+ tmp2 + "│" // 검색_제휴본사_코드
					;

            //배열초기화
            this.arrSelectBr = [];
            this.selectBr = '';
            this.arrSelectSt = [];
            this.selectSt = '';
            this.arrSelectStMulti = [];
			this.selectStMulti = '';


            //통신 호출
            httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {            
                vue.arrSelectBr = data.out_ROW1;
            });
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 가맹점리스트 가져오기
        getStList: function(){
            //변수할당
            var tmp0 = "A";
			var tmp1 = "2";
			var tmp2 = util.getNull(this.selectHd.HD_CODE, this.userInfo.hdCode);
			var tmp3 = util.getNull(this.selectBr.BR_CODE, this.userInfo.brCode);
			var tmp4 = "";

			//전문번호
			var IN_REQ_NUM = "GR00_03_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ tmp1 + "│" // 정렬_구분 (1: 코드순, 2: 이름순)
					+ tmp2 + "│" // 검색_제휴본사_코드
					+ tmp3 + "│" // 검색_총판_코드
					+ tmp4 + "│" // 검색_멀티_구분 (NULL: 전체, N: 개별, M: 마스터, S: 종속, A: 개별/마스터) 
					;

            //배열초기화
            this.arrSelectSt = [];
            this.selectSt = '';
            this.arrSelectStMulti = [];
            this.selectStMulti = '';


            //통신 호출
            httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {            
                vue.arrSelectSt = data.out_ROW1;
                //console.log(data);
            });
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 멀티가맹점리스트 가져오기
        getStMultiList: function(){
            // 멀티가맹점이 아니면 가져오지 않음
            if(util.getNull(this.selectSt.MULTI_TYPE, this.userInfo.multiType) != 'M')
            {
                return;
            }

            //변수할당
            var tmp0 = "A";
			var tmp1 = "2";
			var tmp2 = util.getNull(this.selectSt.ST_CODE, this.userInfo.stCode);

			//전문번호
			var IN_REQ_NUM = "GR00_04_V01";
			//전문데이터
			var IN_VALUE = tmp0 + "│"   // 데이터_상태 (NULL: 전체, A: 삭제 외 전체, 0: 삭제, 1: 정상, 2: 정지, 9: 캐쉬부족)
					+ tmp1 + "│" // 정렬_구분 (1: 코드순, 2: 이름순)
					+ tmp2 + "│" // 검색_가맹점_코드 (마스터 가맹점)
					;

            //배열초기화
            this.arrSelectStMulti = [];
            this.selectStMulti = '';
            //통신 호출
            httpCommon.sendPost(this, "200", IN_REQ_NUM, IN_VALUE, function suc(vue, data) {            
                vue.arrSelectStMulti = data.out_ROW1;
            });

        },
        getSendCuCnt: function(){

            var sendCuCnt = "";
            
            for(var i = 0 ; i < this.selected.length; i++)
            {
                if(!util.isNull(this.selected[i])){
                    sendCuCnt += this.selected[i];

                    if(i < this.selected.length - 1){
                        sendCuCnt += ",";
                    }
                }
            }

            return sendCuCnt;
        },
        back: function(){
            window.history.go(-1)
         }
    },
    watch: {
		//데이터가 변할시마다 함수 호출
		'$route' (to, from) {
			if (to.name == "happyTalkView") {
                this.$router.go(-1);
			}
		}
	}

}
</script>

<style scoped>
.btn-box-r {
	line-height: 82px;
	min-width: 95px;
}
</style>