;"use strict";
(function(){
	var BMUvue = new Vue({
		el:'#BMUvue',
		data:{
			v:'0.0.1'
		},
		methods:{
			version:function(){
				return BMU.v();
			}
		}
	});
})();