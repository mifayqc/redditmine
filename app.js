const axios = require('axios');
var fs = require('fs');
var beautify = require('js-beautify').js;
    
//initially runs main() when program is called then run main() every 8h
main();
setInterval(function(){
    main();
}, 1000 * 60 * 60 * 8);


function main() {
	const jsPathArr = [];
	jsPathArr.push(	"https://www.redditstatic.com/reddit-init.en.4-tSxFR4sOk.js",
			"https://www.redditstatic.com/crossposting.4zJErPF9qdo.js",
			"https://www.redditstatic.com/videoplayer.pRlfb8S7mb4.js",
			"https://www.redditstatic.com/gtm-jail.jTMwZME_TT8.js",
			"https://www.redditstatic.com/reddit.en.d2h9zTNsPbA.js",
			"https://www.redditstatic.com/gtm.aX_QHhLRPyo.js",
			"https://www.redditstatic.com/_chat.mLSe5kQYhig.js",
			"https://www.redditstatic.com/spoiler-text.vsLMfxcst1g.js",
			"https://www.redditstatic.com/onetrust.6tPW2jUogoc.js",
			"https://www.redditstatic.com/desktop2x/Chat~Governance~Reddit.0702840d99d3aab54a31.js",
			"https://www.redditstatic.com/desktop2x/runtime~Chat.4c3a1025685c8826be82.js",
			"https://www.redditstatic.com/desktop2x/vendors~Chat~Governance~Reddit.129ad206362dbdcb7a01.js",
			"https://www.redditstatic.com/desktop2x/vendors~Chat~RedesignChat.1913d26467681b3a7b06.js",	
			"https://www.redditstatic.com/desktop2x/Chat~RedesignChat.dd0121a932bb1e14d2ed.js",		
			"https://www.redditstatic.com/desktop2x/Chat.5f9f4d39938ada71c5ba.js",
			"https://www.redditstatic.com/desktop2x/ChatEmpty.dbbcde7d0cc092042a9f.js",
			"https://www.redditstatic.com/desktop2x/ChatMinimize.44c69e3b0034bf285b68.js"							
	);
	jsPathArr.forEach(jsPath => axios.get(jsPath).then(response => {
		var respStr = beautify(response.data, { indent_size: 2, space_in_empty_paren: true });
		const separatorStr = '|';
		const resFolderPath = './res/';
		const respFileName = jsPath.substring(jsPath.lastIndexOf('/')+1);;
		const respPath = resFolderPath + respFileName;
		const respCachePath = resFolderPath + respFileName + '-cache';
		var cacheRespStr = '';
		if (fs.existsSync(respPath)) {
			cacheRespStr = fs.readFileSync(respPath, 'utf8');
			fs.writeFileSync(respCachePath, cacheRespStr);
		}
		fs.writeFileSync(respPath, respStr);
		console.log(getDateTime() + separatorStr + respFileName + separatorStr + response.status);	
		if (cacheRespStr != respStr) {
			console.log(getDateTime() + separatorStr + respFileName + separatorStr + '***Response changed***'); 
			const respAnomalyPath = resFolderPath + respFileName + '-obs';
			fs.writeFileSync(respAnomalyPath, cacheRespStr);
		}
	    })
	    .catch(error => {
		console.log(error);
		return;
	    })
	);
}

function getDateTime() {
    const date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var minute = date.getMinutes();
    minute = (minute < 10 ? "0" : "") + minute;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "." + month + "." + day + "." + hour + ":" + minute;
};

