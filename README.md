# Geo Fencing

Geo-location redirect logic for multi-storefront setups like Shopify.

## What it does

This repository contains a client-side geo redirect script that routes visitors to the correct regional storefront based on IP geolocation.

Current country mappings:

- `DE` -> `www.echelonfit.de`
- `FR` -> `www.echelonfit.fr`
- `IE` -> `www.echelonfit.uk`
- `GB` -> `www.echelonfit.uk`
- `CA` -> `www.echelonfit.ca`
- `US` -> `www.echelonfit.com`

## Behavior

- Prevents repeated redirects on the same host during one browser session
- Preserves the current path and query string during redirect
- Skips execution in Shopify admin paths
- Leaves unsupported or unknown countries on the current host

## Example use case

A visitor landing on `www.echelonfit.com` will be redirected to:

- `www.echelonfit.de` for Germany
- `www.echelonfit.fr` for France
- `www.echelonfit.uk` for the UK and Ireland
- `www.echelonfit.ca` for Canada
- `www.echelonfit.com` for the US

## Shopify integration

Add the script to your theme layout file near the end of `<head>`, before `</head>`.

## Notes

- IP geolocation can be inconsistent for some VPN endpoints.
- For best results, use the same redirect logic across every regional storefront.

## Script

<script>
  (function () {
    var path = window.location.pathname || '';
    if (path.indexOf('/admin') === 0) return;
    if (path.indexOf('/checkout') === 0) return;

    var countryToHost = {
      DE: 'www.echelonfit.de',
      FR: 'www.echelonfit.fr',
      IE: 'www.echelonfit.uk',
      GB: 'www.echelonfit.uk',
      CA: 'www.echelonfit.ca',
      US: 'www.echelonfit.com'
    };

    var currentHost = window.location.hostname;
    var sessionKey = 'echelon_geo_redirect_done_' + currentHost;

    if (sessionStorage.getItem(sessionKey)) return;

    function redirectToHost(targetHost) {
      if (!targetHost || targetHost === currentHost) return;
      sessionStorage.setItem(sessionKey, '1');
      var targetUrl =
        window.location.protocol +
        '//' +
        targetHost +
        window.location.pathname +
        window.location.search;
      window.location.replace(targetUrl);
    }

    fetch('/browsing_context_suggestions.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var country =
          data &&
          data.detected_values &&
          data.detected_values.country &&
          data.detected_values.country.handle;

        if (!country) return;

        var targetHost = countryToHost[country];
        if (!targetHost) return;

        redirectToHost(targetHost);
      })
      .catch(function () {
        // fail silently
      });
  })();
</script>
