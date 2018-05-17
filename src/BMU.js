;"use strict";
var BMU = BMU || (function(){
	var oP={},oC={},oV={},silent=false,noCK=!navigator.cookieEnabled,noLS=false,
		oU={
			host : window.location.hostname,
			path : window.location.pathname,
			protcol : window.location.protocol,
			query : window.location.search,
			href : window.location.href
		};
	if(oU.query.length){
		var qString = (oU.query.substring(0,1) === '?')? oU.query.substring(1) : oU.query;
		var aPairs = qString.split('&');
		for(var i=0;i<aPairs.length;i++) {
			var aKeyVal = aPairs[i].split('=');
			if(aKeyVal[0].trim().length) oP[aKeyVal[0].trim()] = (aKeyVal[1])? aKeyVal[1].trim() : true;
		}
	}
	try{ localStorage; } catch (err) { noLS = true; }
	if(noCK){
		document.cookie = 'testCookies';
		noCK = (document.cookie.indexOf('testCookies') == -1)? true : false;
	}
	var APP = {
		v:function(){return '1.0.0';},
		ROM:{
			url : {
				SRC : function() { return oU.href; },
				GET : function(k) {	return (oU.hasOwnProperty(k))? oU[k] : null; },
				DAT : function() { return oU; }
			},
			params : {
				SRC : function() { return oU.query; },
				GET : function(k) {	return (oP.hasOwnProperty(k))? oP[k] : null; },
				DAT : function() { return oP; }
			},
			cookies : {
				SRC : function() { return document.cookie; },
				DAT : function() { return oC; },
				GET : function(k) {	return (oC.hasOwnProperty(k))? oC[k] : null; },
				refresh:function(){ if(!noCK){
					var arrCookies = document.cookie.split('; ');
					for(var i=0;i<arrCookies.length;i++) {
						var arrCookie = arrCookies[i].split('=');
						if(arrCookie[1]) oC[arrCookie[0]] = arrCookie[1];
					}
				} }
			}
		},
		DAT:oV,
		setAlerts:function(bSilent){
			if(bSilent !== true) bSilent = false;
			silent = bSilent;
		},
		insert:function(bmuJSON){ if(typeof(bmuJSON) === 'string'){
			try{ var oNew = JSON.parse(bmuJSON); } catch (e){ var oNew = {}; }
			for(k in oNew){
				if(oV.hasOwnProperty(k)) confirm('This will overwrite existing '+k+' save data! OK?');
				oV[k] = oNew[k];
				APP.save(k);
			}
		} },
		eject:function(){
			if(!silent) confirm('Your BMU data will now be copied to your clipboard.');
			//APP.saveAll();
			var BMUinput = document.createElement("input");
				document.body.appendChild(BMUinput);
				BMUinput.setAttribute("id", "BMUinput_id");
				document.getElementById("BMUinput_id").value=JSON.stringify(oV);
				BMUinput.select();
				document.execCommand("copy");
				document.body.removeChild(BMUinput);
			if(!silent) alert("Your BMU is in your clipboard. Don't forget to paste it somewhere!");
		},
		save:function(k){ if(oV.hasOwnProperty(k)){
			if(!noLS){
				if(!silent) confirm('Update backup '+k+' data to your browser?');
				localStorage.setItem('BMU_'+k,oV[k]);
			}
		} },
		load:function(k){ if(!noLS){
			if(localStorage.getItem('BMU_'+k) !== null){
				if(oV.hasOwnProperty(k) && !silent) confirm('This will overwrite existing '+k+' save data! OK?');
				oV[k] = localStorage.getItem('BMU_'+k);
			}
		} },
		delete:function(k){
			if(oV.hasOwnProperty(k)){
				if(!silent) confirm('Clear '+k+' data from your active BMU?');
				delete oV[k];
			}
			if(!noLS){
				if(localStorage.getItem('BMU_'+k) !== null){
					if(!silent) confirm('Clear backup '+k+' data from your browser?');
					oV[k] = localStorage.removeItem('BMU_'+k);
				}
			}
		},
		saveAll:function(){ for(k in oV) APP.save(k); },
		loadAll:function(){	if(!noLS){
			for(k in localStorage){
				if(k.length >= 4 && k.substring(0,4) === 'BMU_') APP.load(k.substring(4));
			}
		} },
		deleteAll:function(){ for(k in oV) APP.delete(k); }
	};
	APP.loadAll();
	APP.ROM.cookies.refresh();
	return APP;
})();