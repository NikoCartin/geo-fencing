(function () {
  // Don't run in Shopify admin
  if (window.location.pathname.includes('/admin')) return;

  var currentHost = window.location.hostname;
  var path = window.location.pathname;
  var search = window.location.search;
  var redirectKey = 'geoRedirectDone_' + currentHost;
  var normalizeHost = function (host) {
    return host.replace(/^www\./, '');
  };

  // Avoid repeated redirect checks in the same session on the same host
  if (sessionStorage.getItem(redirectKey) === 'true') return;

  fetch('https://ipapi.co/json/')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var country = data.country_code;
      var targetHost = null;

      if (country === 'DE') {
        targetHost = 'www.echelonfit.de';
      } else if (country === 'FR') {
        targetHost = 'www.echelonfit.fr';
      } else if (country === 'IE') {
        targetHost = 'www.echelonfit.uk';
      } else if (country === 'GB') {
        targetHost = 'www.echelonfit.uk';
      } else if (country === 'CA') {
        targetHost = 'www.echelonfit.ca';
      } else if (country === 'US') {
        targetHost = 'www.echelonfit.com';
      } else {
        return;
      }

      // If already on the correct host, stop here
      if (normalizeHost(currentHost) === normalizeHost(targetHost)) {
        sessionStorage.setItem(redirectKey, 'true');
        return;
      }

      sessionStorage.setItem(redirectKey, 'true');
      window.location.href = 'https://' + targetHost + path + search;
    })
    .catch(function (err) {
      console.log('Geo redirect failed:', err);
    });
})();
