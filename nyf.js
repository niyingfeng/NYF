/*
*  Author： Yingfeng Ni
*
*  Date： 2012/11/01
*
*  ADD：BJ CHINA
*
*/


window["NYFJS"] = window["NYFJS"]||{};

var NYFJS = window["NYFJS"],
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	slice = Array.prototype.slice,
	d = document;

/********************** $ 可获取单个或多个DOM对象******************************************************/
	function $(str,root){	// $(".classname") & $("#id") & $("#id1,#id2")
		var elements = [],  // , 分割后的数组
			ele_len = 0,  // 数组长度
			reg_spl = /\s*,\s*/, // 截取  ，
			dom_obj = {}, // dom 对象
			ret = [],     // 返回的dom对象
			root = root || document,
			element,i,name;    

		if(typeof str !== "string"){ return []; } //不为string返回空数组

		if(str.indexOf(",") === -1){

			if(false&&root.querySelectorAll){
				return root.querySelectorAll(str);  //使用内置方法
			}else{
				return _$_getDom(str,root);
			}
			
		}  // 单个id的情况

		elements = str.split(reg_spl);
		ele_len = elements.length;
		for(i = 0;i<ele_len;i++){
			element = elements[i];

			if(false&&root.querySelectorAll){
				dom_obj = root.querySelectorAll(element);
			}else{
				dom_obj = slice.call(_$_getDom(element,root));
			}
			if(dom_obj){ ret = ret.concat(dom_obj); }
		}
		return ret;
	}

	function _$_getDom(str,root){ // 获取节点，返回DOM数组形式
		var name = str.slice(1);
		if(str.indexOf("#") === 0){
			return _$_getId(name);
		}else if(str.indexOf(".") === 0){
			return _$_getName(name,root);
		}else{
			return [];
		}
	}

	function _$_getName(classname,obj){  // by class to find dom
		var obj=obj||document,
			arr=[],
			classes=[],
			ret=[];
		//能力检测 是否浏览器具有getElementsByClassName方法
		if(typeof obj.getElementsByClassName === "function"){

			ret=obj.getElementsByClassName(classname);

		}else{

			arr=obj.getElementsByTagName("*");
			for(var i=0,len=arr.length;i<len;i++){
				//正则切割className
				classes=arr[i].className.split(/\s+/);

				for(var j=0,lenc=classes.length;j<lenc;j++){
					if(classes[j]===classname){
						ret.push(arr[i]);
					}
				}

			}
		}
		return slice.call(ret);
	} 

	function _$_getId(id){  // by id to find dom
		return (document.getElementById(id) === null)?[]:[document.getElementById(id)];
	}


	NYFJS["$"] = window["$NYF"] = $;
