<template>
	<div class="pop-layer">
		<div class="pop-top" >
			상품목록
		</div>
		<div class="pop-center">
			<div class="table-list">
				<table>
					<thead>
						<tr>
							<th width="20%">순번</th>
							<th width="80%">상품명</th>
						</tr>
					</thead>
					<tbody id="elList">
						<tr v-if="arrList.length == 0">
							<td colspan="7">내역이 없습니다</td>
						</tr>
						<tr v-else v-for="(row, index) in arrList" :key="row.ST_GOODS_NO" v-on:click="listClick(row);">
							<td>{{index + 1}}</td>
							<td class="textLeft">{{row.GOODS_NAME}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="pop-bottom" >
			<!-- <a class="btn-box bgGray overflowH btn_l" v-on:click="popupClose();">확인</a>
			<a class="btn-box bgGray overflowH btn_r" v-on:click="popupClose();">취소</a> -->
			<a class="btn-box bgGray overflowH btn_f" v-on:click="popupClose();">확인</a>
		</div>
	</div>
</template>

<script>
//HTTP 통신 임포트
import httpCommon from '@/common/js/http/http-common.js';
import util from '@/common/js/utils/util.js';
import stEventView from '@/components/st/event/view';
import eventBus from '@/common/include/eventBus.js';

export default {
	name: "contactForm",
	data: function() {
		return {
			arrList: []
			, goods_no: ''
		}
	},
	props: [ 'st_code' ],
	created() {
		window.addEventListener('keyup', (e) => {
			if (e.keyCode == 27) // esc 버튼 클릭시 창 닫기
				this.popupClose();
		});

		this.schGoodsList();

		this.$nextTick(function () {
			// 모든 화면이 렌더링된 후 실행합니다.
			this.$EventBus.$emit(eventBus.APP_VUE_CALLBACK, {popup:true});
		})
	},
	computed: {
		
	},
	mounted: function() {
		
	},
	methods: {
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//상품검색
		schGoodsList: function() {
			if (util.isNull(this.st_code)) {
				alert("가맹점 코드가 없습니다.");
				this.popupClose();
				return;
			}
			//통신 호출
			httpCommon.sendPost(this, "202", "AW02_06_V01"
				, this.st_code + "│"	// 검색_가맹점_코드 (NULL: 전체)
				+ '1' + "│"				// 검색_상태 (NULL: 전체, 0: 삭제, 1: 정상, 2: 정지)
				+ '' + "│"				// 검색_구분 (NULL: 검색안함, 1: 상품명, ... 검색구분 추가 가능)
				+ '' + "│"				// 검색_단어
				+ '' + "│"				// 마지막_동기화_일시 (NULL: 전체, YYYYMMDDHH24MISS (예: 20160518085059)
			, function suc(vue, data) {
				if (data.out_ROW1 == undefined || data.out_ROW1.length == 0) {
					alert("상품 목록이 없습니다.");
					vue.popupClose();
				}
				vue.arrList = data.out_ROW1;
			});
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 리스트 선택 이벤트
		listClick: function(row) {
			// 값 리턴
			opener.document.getElementById("FREE_GOODS_1").value = row.ST_GOODS_NO;
			opener.document.getElementById("FREE_GOODS_NAME_1").value = row.GOODS_NAME;
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 팝업창 닫기
		popupClose: function() {
			window.close();
		}
	}
}
</script>

<style scoped>
.table-list {
	padding-top: 0px;
}

.pop-layer {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	bottom:0px;
}
.pop-top {
	background-color: #FF5846;
	padding-top:10px;
	padding-bottom:10px;
	color: #fff;
	font-size: 20px;
	font-weight: bold;
	text-align: center;
}
.pop-center {
	position: absolute;
	width: 100%;
	top: 45px;
	bottom: 50px;
	overflow: hidden;
	overflow-y: scroll;
	-webkit-overflow-scrolling:touch;
}
.pop-bottom .btn_l {
	width: 50%;
	font-size: 20px;
	font-weight: bold;
	height:40px;
	line-height: 40px;
	position:absolute;
	bottom: 0px;
	left:0%;
}
.pop-bottom .btn_r {
	width: 50%;
	font-size: 20px;
	font-weight: bold;
	height:40px;
	line-height: 40px;
	position:absolute;
	bottom: 0px;
	left:50%;
	float: left;
}
.pop-bottom .btn_f {
	width: 100%;
	font-size: 20px;
	font-weight: bold;
	height:40px;
	line-height: 40px;
	position:absolute;
	bottom: 0px;
}
</style>