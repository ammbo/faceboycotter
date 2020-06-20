(function() {

	var queries = new Array(
		'[href^="https://facebook.com/"]',
		'[href^="https://www.facebook.com/"]',
		'[href^="https://www.twitter.com/"]',
		'[href^="https://twitter.com/"]'
	);
	var input;
	var twitter;
	
	if (window.location.href.startsWith('https://www.facebook.com/ads/library/')) {
	
		chrome.storage.local.get(['twitterHandle', 'fbpname'], function (result) {
			if (typeof(result.fbpname) !== 'undefined') {
		    	var searchthis = document.createElement('div');
		    	searchthis.setAttribute('style','position:fixed;bottom:0;padding:8px;font-size:16px;border:1px solid #ddd;background:#fff;border-radius:0 5px 0 0;');
		    	searchthis.innerHTML = '<img src="'+chrome.extension.getURL("icon16.png")+'" height="16" width="16"><strong> Search for "'+result.fbpname+'"</strong>';
		    	if (typeof(result.twitterHandle) !== 'undefined') searchthis.innerHTML += '<br><a href="https://twitter.com/intent/tweet?url=&text=%40'+result.twitterHandle+'%20supports%20%40Facebook\'s%20willful%20ignoring%20of%20propaganda%20with%20advertising%20dollars.%20I%20am%20boycotting%20BOTH.%20%23FBoycott%20%23FaceBoycott" target="_BLANK" >Tweet @'+result.twitterHandle+'</a>';
				document.body.appendChild(searchthis);
				
// could not get this working to pre-fill. Could also try to find the page ID and feed it into the URL.

//				window.setTimeout(() => {  document.querySelector('input[type="text"]').focus(); }, 1.1);
//				window.setTimeout(() => {  document.querySelector('input[type="text"]').value = result.fbpname; console.log('done'); }, 1.1);
			}
   		});
	}
	
	// can we find some FB/Twitter URLs?
	inputs = document.querySelectorAll(queries);
	
	// Let's make sure it at least looks like a page name. Certainly not foolproof.
	inputs.forEach((el) => {
		if (/facebook.com\/([\w\-\.]*)[\/]?$/g.test(el.href)) input = el;
		if (/twitter.com\/([\w\-\.]*)[\/]?$/g.test(el.href)) twitter = el;
	});
  
  if (input) {
  
	// OK, there's a FB page on this site. Get the last part of the URL and save it for later. Twitter, too.
	var path = new URL(input.href).pathname.replace(/\//g, "");
	var handle = new URL(twitter.href).pathname.replace(/\//g, "");
			
	// Remember the page ID
	chrome.storage.local.set({'fbpname': path, 'twitterHandle': handle});
	
    var notification = document.createElement('div');
    notification.setAttribute('style','position:fixed;bottom:0;left:0;width:36px;height:36px;cursor:pointer;padding:10px;');
    notification.innerHTML = '<img src="'+chrome.extension.getURL("icon16.png")+'" title="This site may support Facebook propaganda through advertising.">';
  
	var dialog = document.createElement('DIV');
	dialog.setAttribute("id","FBoycotter");    

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		dialog.innerHTML = this.responseText;
	  }
	};
	xhttp.open("GET", chrome.extension.getURL("dialog.html"), false);
	xhttp.send();

	document.body.appendChild(dialog);

	var shadow = document.querySelector('#FBoycotter').attachShadow( { mode: 'open' } );
	var template = document.querySelector('#nameTagTemplate');
	var clone = document.importNode(template.content, true);
	shadow.appendChild(clone);
	
	shadow.getElementById('confirm-shopping').onclick=function(){
		shadow.getElementById('confirm-shopping').close();
	}

	shadow.getElementById('close').onclick=function(){
	  shadow.getElementById('confirm-shopping').close();
	  shadow.transition = window.setTimeout(function() {
		  shadow.getElementById('confirm-shopping').setAttribute('class', 'site-dialog dialog-scale');
		  shadow.getElementById('confirm-shopping').style.visibility = 'visible';
		  window.location.replace('https://www.facebook.com/ads/library/');
	  }, 0.5);
	}
	shadow.getElementById('continue').onclick=function(){
	  shadow.getElementById('confirm-shopping').close();
	  window.setTimeout(function() {
		  shadow.getElementById('confirm-shopping').setAttribute('class', 'site-dialog');
		  shadow.getElementById('confirm-shopping').style.visibility = 'hidden';
		  notification.style.visibility = 'hidden';
		  clearTimeout(shadow.transition);
	  }, 0.5);
	}
		
	notification.onclick=function(){
		shadow.transition = window.setTimeout(function() {
			shadow.getElementById('confirm-shopping').showModal();
			shadow.getElementById('confirm-shopping').setAttribute('class', 'site-dialog dialog-scale');
			shadow.getElementById('confirm-shopping').style.visibility = 'visible';
		}, 0.75);
	}
  
	document.body.appendChild(notification);
  }
})();