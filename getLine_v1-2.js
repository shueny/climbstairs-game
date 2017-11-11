$(function(){
	$("body").css({"height":document.documentElement.clientHeight});
	//$(".inputArea").css({"height":$("input[name=totlaverticalLine]").height()});
	/** 清除 **/
	$("input[name=totlaverticalLine]").focus(function(){
			if($("input[name=totlaverticalLine]").val() != 0){
				$("input[name=totlaverticalLine]").val("");
				$(".verticalLineArea, .levelLineArea, .btnArea, .runLineArea").empty();
				$(".dotArea, svg, .endResult div").remove();
				$(".btnArea").on("click",".btn");
			}
	});
	
	/** 輸入垂直與水平線的數量產生需要的黑線 **/
	$("input[name=totlaverticalLine]").keyup(function(){
		$(".climbLadderArea .verticalLineArea").html("");
		$(".inputArea").css({"top":"-90px"});
		$(".climbLadderArea .endResult").show();
		
		totalLine = parseInt($("input[name=totlaverticalLine]").val());
		leftVal = Math.floor($(".climbLadderArea").width()/(totalLine+1)); //寬度等於總寬度除以線數+1
		
		$(".climbLadderArea .btnArea").before("<div class='dotArea'></div>");
		
		//產生直線與起始按鈕
		for (i=0; i<totalLine; i++) {document.do
			$(".climbLadderArea .verticalLineArea").append("<span class='verticalLine' style='left:"+(leftVal*(i+1))+"px'></span>");
			$(".climbLadderArea .btnArea").append("<a id='btn_"+i+"' class='btn' startLine='"+i+"' style='left:"+(leftVal*(i+1))+"px'><img id='momoco' src='momoco.svg'/></a>");
			//$(".climbLadderArea .endResult").append("<span id='end_"+i+"' class='end end-envelope end-transform move' style='left:"+(leftVal*(i+1))+"px'><b class='envelope-flap'></b></span>");
			$(".climbLadderArea .endResult").append("<div id='end_"+i+"' class='envelope move' style='left:"+(leftVal*(i+1))+"px; margin-left:"+$(this).width()/2 *-1+"px'><div class='paper'><ul><li></li><li></li><li></li><li></li></ul><div class='noti'>1</div></div><div class='topCap'></div></div>");
		}
		
		var line_length = $(".climbLadderArea .verticalLineArea .verticalLine").length;
		for (j=0; j<parseInt(line_length-1); j++) { //要跑幾次產生左到右的線(線數-1次)
			
			verticalLeftVal = parseInt($(".climbLadderArea .verticalLineArea .verticalLine").eq(j).css("left")); //取得左到右線的x位置
			
			
			var org_pos_yArray = new Array(totalLine+1);
			for (k=0; k<(totalLine+1); k++) {
				var min = 5;
				var max = $(".climbLadderArea").width() - 5;
				org_pos_yArray[k] = Math.floor(Math.random() * ((max - min + 1) + 5)); //讓值不會等於0及400
			}
			
			org_pos_yArray.sort(function(a,b){
				return a-b;
			});
			
			//刪除重複的數字
			var pos_yArray = [];
			org_pos_yArray.forEach(function(value){
				if(pos_yArray.indexOf(value) == -1){
					pos_yArray.push(value);
				}
			});
			
			var left_pos = $(".climbLadderArea .verticalLineArea .verticalLine").eq(j).css("left");
			for(l=0; l<pos_yArray.length; l++){
				$(".climbLadderArea .levelLineArea").append("<b class='levelLine' vertical="+j+" level="+l+" style='width:"+leftVal+"px; height:3px; margin:0px; position:absolute; left:"+verticalLeftVal+"px; top:"+pos_yArray[l]+"px'></b>");
				$(".climbLadderArea .dotArea").append("<b class='dot dot_"+j+"' style='background-color:#fff; width:2px; height:2px; margin:0px; position:absolute; left:"+left_pos+"; top:"+pos_yArray[l]+"px'></b>");	
			}
			
		}
		
		//複製前一條線上的點
		for(j= totalLine-2; j >= 0; j--){
			$(".climbLadderArea .dotArea .dot_"+j+"").clone().removeClass("dot_"+j+"").addClass("dot_"+parseInt(j+1)+"").appendTo(".climbLadderArea .dotArea").css({"left":$(".climbLadderArea .verticalLineArea .verticalLine").eq(j+1).css("left")});
		}
		
		//輸入完之後移除焦點
		$("input[name=totlaverticalLine]").blur();
	});
	
	
	/** 點擊箭頭 **/
	$(".climbLadderArea .btnArea").on("click").delegate(".btn","click",function(){
		
		var btn_index = $(this).index();		
		var start = 0;
		var start_x = parseInt($(this).position().left); //取得按鈕的x值
		var start_y = $(this).position().top; //取得按鈕的y值
		var V = 0;
		var H = 0;
		//設定其他的a不能點選_start
		$(this).siblings("a").css({"cursor":"auto"});
		$(".btnArea").off("click",".btn");
		//設定其他的a不能點選_end
		
		//畫線
		makePath(btn_index,start_x,start_y,V,H); 
		
	});

	/** 點擊清除鈕時 **/
	$(".climbLadderArea .againBtnArea").delegate("a","click",function(){
		$("input[name=totlaverticalLine]").val("");
		$(".climbLadderArea .verticalLineArea, .climbLadderArea .levelLineArea, .climbLadderArea .btnArea, .climbLadderArea .runLineArea").html("");
		$(".climbLadderArea .againBtnArea").hide();
	});

})


function makePath(btn_index,start_x,start_y,V,H){
	var goPath = [];
	//goPath.push(start_x,start_y);
	var current_XY = 0; //0代表:用x值取y值；1代表: 用y值取x值
	XorY(btn_index, goPath, current_XY, start_x);
	
	var imgWidth = $(".climbLadderArea .btnArea a").width()/2; //抓取圖片寬度的一半
	
	var lastPath = goPath[goPath.length-2] - imgWidth;
	
	console.log(lastPath);
	console.log(goPath.length);
	console.log(goPath);
	
	var finalpath = 0; //把點串成路徑
	for (i=0; i < (goPath.length/2); i++){
		finalpath = finalpath + (goPath[2*i] - imgWidth) +","+ goPath[2*i+1] +" ";
	};
	finalpath = finalpath + lastPath +","+"0";
	console.log(finalpath);
	
	$(".climbLadderArea .btnArea a").eq(btn_index).hide();
	//moveOnPath(start_x,imgWidth,start_y,path);
	//alert(start_x+",imgWidth:"+imgWidth);
	$(".runLineArea").append("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100% 100%'><path id='linePath' class='path_1' d='M"+(start_x -imgWidth)+" "+start_y+" "+finalpath+"' stroke='none' stroke-width='2' fill='none'/><g id='momoco_head' style='z-index:10'><path id='head' fill='#E52D8A' d='M24.959,0c15.386,8.32,24.959,15.158,24.959,26.099S37.438,44.333,24.959,44.333S0,35.33,0,25.757	S7.864,8.775,24.959,0z'/><ellipse id='face' fill='#FFFFFF' cx='24.959' cy='33.45' rx='14.531' ry='9.63'/><circle id='right-eye' fill='#231815' cx='14.825' cy='32.538' r='2.45'/><circle id='left-eye' fill='#231815' cx='35.453' cy='32.538' r='2.45'/><ellipse id='right-rouge' fill='#F6C7CE' cx='35.453' cy='36.812' rx='2.08' ry='0.513'/><ellipse id='left-rouge' fill='#F6C7CE' cx='14.825' cy='36.812' rx='2.08' ry='0.513'/><polygon id='start' fill='#FFFFFF' points='10.3,27.559 7.977,27.359 6.495,29.159 5.967,26.889 3.797,26.036 5.794,24.832 5.935,22.505 7.697,24.032 9.953,23.446 9.045,25.594 '/><polygon id='start_x5F_s' fill='#FFFFFF' points='14.547,24.716 13.664,23.911 12.499,24.182 12.992,23.092 12.375,22.068 13.563,22.201 14.346,21.297 14.587,22.468 15.689,22.933 14.649,23.524 '/><path id='mouth' fill='none' stroke='#E52D8A' stroke-width='0.4559' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' d='	M21.996,34.19c0.242,1.068,2.223,2.564,3.362,0c1.083,2.621,3.006,1.097,3.205,0'/><animateMotion dur='5s' repeatCount='1' rotate='none' fill='freeze'><mpath xlink:href='#linePath'/></animateMotion></g></svg>");
	$(".endResult > div").each(function(){
		$(this).removeClass("move");
		if( parseInt($(this).css("left")) == parseInt(lastPath)+parseInt($(".climbLadderArea .btnArea a").width()/2)){
			$(this).delay(5000).queue(function (){
				$(this).addClass("open-envelop")
			});
		}
	})
}

function XorY(btn_index, goPath, current_XY, start_x, V,H){
	if(current_XY){
		$(".climbLadderArea .dotArea .dot").each(function(){
			if(parseInt($(this).css("top")) > V){
				$(this).remove();
			}else if (parseInt($(this).css("top")) == V){
				H = parseInt($(this).css("left")); //取出相同y值的x值
				$(this).remove();
			}
		});
		
		if(H > start_x){
			btn_index = btn_index +1; //新的值大於舊的值，代表往右跑
		}else{
			btn_index = btn_index -1; //新的值小於舊的值，代表往左跑
		}
		
		goPath.push(H); //x值
		goPath.push(V); //y值
		start_x = H;
		current_XY = 0; //做完把current定位改成0，切換至else取y值
		
	}else{
		if(parseInt($(".climbLadderArea .dotArea .dot_"+btn_index+"").length) == 0){
			return;
		}else{
			//alert("UP, btn_index:"+btn_index+",這條線上的點數:"+parseInt($(".climbLadderArea .dotArea .dot_"+btn_index+"").length));
			var temp = [];
			
			$(".climbLadderArea .dotArea .dot_"+btn_index+"").each(function(){
				temp.push(parseInt($(this).css("top"))); //把所有這條線上點的top值(y)，放進暫存的temp array裡
			});
			
			V = Math.max.apply(Math,temp); //取最大值(最靠近下面箭頭的)
			
			//刪除取出來的這個點
			$(".climbLadderArea .dotArea .dot").each(function(){
				if($(this).attr("class").split(" ")[1] == "dot_"+btn_index){ //先判斷是在哪條線上的點
					if(parseInt($(this).css("top")) == V){ //再判斷是這條線上的哪個點
						$(this).remove();
					}
				}
			});
			
			goPath.push(start_x); //x值
			goPath.push(V); //y值
			current_XY = 1; //做完把current定位改成1，切換至上面取x值
		}
		
	}
	
	
	var dotLength = $(".climbLadderArea .dotArea .dot").length;
	if(btn_index < 0 || dotLength == 0){
		return;
	}else{
		XorY(btn_index, goPath, current_XY, start_x, V,H);

	}
	
}

function moveOnPath(start_x,imgWidth,start_y,path){
	//.before("<style>@keyframes momo-move{100%{offset-distance:100%}}</style>")
	//$(".climbLadderArea .btnArea a").eq(btn_index).addClass("momo-move").css({"offset-path":"path('M"+(start_x - imgWidth)+" "+start_y+" "+path+" "+lastPath+",0')","animation":"momo-move 3s forwards"}); 
	//$(".momo-move").css("<animateMotion dur='5s' repeatCount='1' rotate='none' fill='freeze'><mpath xlink:href='#linePath'/></animateMotion></svg>");

	$(document).find(".runLineArea").append("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100% 100%'><path id='linePath' class='path_1' d='M"+(start_x - imgWidth)+" "+start_y+" "+path+"' stroke='none' stroke-width='2' fill='none'/><g id='momoco_head' style='z-index:10'><path id='head' fill='#E52D8A' d='M24.959,0c15.386,8.32,24.959,15.158,24.959,26.099S37.438,44.333,24.959,44.333S0,35.33,0,25.757	S7.864,8.775,24.959,0z'/><ellipse id='face' fill='#FFFFFF' cx='24.959' cy='33.45' rx='14.531' ry='9.63'/><circle id='right-eye' fill='#231815' cx='14.825' cy='32.538' r='2.45'/><circle id='left-eye' fill='#231815' cx='35.453' cy='32.538' r='2.45'/><ellipse id='right-rouge' fill='#F6C7CE' cx='35.453' cy='36.812' rx='2.08' ry='0.513'/><ellipse id='left-rouge' fill='#F6C7CE' cx='14.825' cy='36.812' rx='2.08' ry='0.513'/><polygon id='start' fill='#FFFFFF' points='10.3,27.559 7.977,27.359 6.495,29.159 5.967,26.889 3.797,26.036 5.794,24.832 5.935,22.505 7.697,24.032 9.953,23.446 9.045,25.594 '/><polygon id='start_x5F_s' fill='#FFFFFF' points='14.547,24.716 13.664,23.911 12.499,24.182 12.992,23.092 12.375,22.068 13.563,22.201 14.346,21.297 14.587,22.468 15.689,22.933 14.649,23.524 '/><path id='mouth' fill='none' stroke='#E52D8A' stroke-width='0.4559' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' d='	M21.996,34.19c0.242,1.068,2.223,2.564,3.362,0c1.083,2.621,3.006,1.097,3.205,0'/><animateMotion dur='5s' repeatCount='1' rotate='none' fill='freeze'><mpath xlink:href='#linePath'/></animateMotion></g></svg>");
	alert(path.length)
}


