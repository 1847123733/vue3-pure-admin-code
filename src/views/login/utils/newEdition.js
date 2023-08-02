!(function (window, document) {
  function DTFrameLogin(dom, parameter, resolve, reject) {
    let e = null;
    const c = document.createElement('iframe');
    // iframe=true&
    let d = 'https://login.dingtalk.com/oauth2/challenge.htm?redirect_uri=' + parameter.redirect_uri;
    d += parameter.response_type ? '&response_type=' + parameter.response_type : '';
    d += parameter.client_id ? '&client_id=' + parameter.client_id : '';
    d += parameter.scope ? '&scope=' + parameter.scope : '';
    d += parameter.prompt ? '&prompt=' + parameter.prompt : '';
    d += parameter.state ? '&state=' + parameter.state : '';
    c.src = d;
    console.log('[ d ] >', d);
    c.frameBorder = '0';
    c.allowTransparency = 'true';
    c.scrolling = 'no';
    // c.sandbox = 'allow-same-origin';
    c.width = dom.width ? dom.width : '365px';
    c.height = dom.height ? dom.height : '400px';
    e = document.getElementById(dom.id);
    e.innerHTML = '';
    e.appendChild(c);

    window.addEventListener('message', function (message) {
      console.log('[ message ] >', message);
      const data = message.data;
      const origin = message.origin;

      // alert(message);
      if (/login\.dingtalk\.com/.test(origin) && data) {
        // window.parent.postMessage({ msg: 'MessageFromIframePage' }, '*');
        if (data.success && data.redirectUrl) {
          resolve({ redirectUrl: data.redirectUrl });
          // const u = data.redirectUrl,
          // c = r(u, 'authCode') || '',
          // d = r(u, 'state') || '',
          // s = r(u, 'error') || '';
          // c ? resolve && resolve({ redirectUrl: u, authCode: c, state: d }) : reject && reject(s);
        } else {
          reject && reject(data.errorMsg);
        }
      }
    });
  }
  window.DTFrameLogin = DTFrameLogin;
})(window, document);
