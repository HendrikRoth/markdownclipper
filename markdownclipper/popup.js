function markdown(dom, cb) {
	var xhr = new XMLHttpRequest();
	var data = new FormData();
	data.append('html', dom);
	data.append('output', 'markdown');

	xhr.open('POST', 'http://heckyesmarkdown.com/go/', true);

	xhr.onreadystatechange = function() {
		var result = xhr.responseText;
		cb(result);
	}

	xhr.send(data);
}

function send(content, url, method, cb) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		var result = xhr.responseText;
		cb(result);
	}

	if (method === 'post') {
		var data = new FormData();
		data.append('content', content);
		xhr.open('POST', url, true);
		xhr.send(data);
	} else {
		var encoded = encodeURIComponent('?content=' + content);
		xhr.open('GET', url + encoded, true);
		xhr.send();
	}
}

document.addEventListener('DOMContentLoaded', function() {
	var button = document.getElementById('send');
	var preview = document.getElementById('preview');
	var url = document.getElementById('url');
	var method = document.getElementById('method');

	chrome.storage.sync.get(['url', 'method'], function(data) {
		url.value = data.url;
		method.value = data.method;
	});

	url.addEventListener('input', function(e) {
		chrome.storage.sync.set({ url: e.target.value });
	});

	method.addEventListener('input', function(e) {
		chrome.storage.sync.set({ method: e.target.value });
	});

	var back = function(dom) {
		markdown(dom, function(result) {
			preview.innerHTML = result;
		})
	};

	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, back);
	});

	button.addEventListener('click', function() {
		send(preview.innerHTML, url.value, method.value, function() {
			console.log('Send!')
		})
	});
});
