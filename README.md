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
