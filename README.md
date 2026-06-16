# Geo Fencing

Geo-location redirect logic for multi-storefront setups like Shopify.

## What it does

This repository contains a client-side geo redirect script that routes visitors to the correct regional storefront based on IP geolocation.

### Current country mappings

- `DE` → `www.echelonfit.de`
- `FR` → `www.echelonfit.fr`
- `IE` → `www.echelonfit.uk`
- `GB` → `www.echelonfit.uk`
- `CA` → `www.echelonfit.ca`
- `US` → `www.echelonfit.com`

## Behavior

- Prevents repeated redirects on the same host during one browser session
- Preserves the current path and query string during redirect
- Skips execution in Shopify admin and checkout paths
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

Recommended file:

- `layout/theme.liquid`

## Notes

- IP geolocation can be inconsistent for some VPN endpoints.
- For best results, use the same redirect logic across every regional storefront.
- Test in an incognito/private window when validating redirects, since `sessionStorage` prevents repeat redirects on the same host during a session.

## Script

```html
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
        // Fail silently
      });
  })();
</script>
```

## How it works

1. Checks the current path and exits early for `/admin` and `/checkout`.
2. Maps the detected country to the correct regional storefront.
3. Uses `sessionStorage` to prevent repeated redirects on the same host during the current browser session.
4. Calls `/browsing_context_suggestions.json` to read the visitor's detected country.
5. Redirects to the target storefront while preserving the current path and query string.

## Troubleshooting

If redirects do not work as expected, check the following:

- The script is present in `layout/theme.liquid`
- The script is placed before `</head>`
- The country code is included in the `countryToHost` mapping
- `sessionStorage` is not preventing a repeat test
- The user is not on `/admin` or `/checkout`
- `/browsing_context_suggestions.json` is returning the expected country
- The target storefront domain is live and accessible
