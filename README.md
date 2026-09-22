# Hugging Emojis Suck

A tiny studio for making the hug emoji you actually wanted. Choose one to four people, set each person's presentation and skin tone, then export the resulting illustration as PNG or SVG.

## Development

```sh
npm ci
npm --prefix frontend ci
npm --prefix backend ci
npm run frontend:test
npm --prefix backend test
npm run frontend:build
```

The editor and exports run in the browser. A compact configuration is stored in the page URL so a hug can be shared. The preview service serves server-rendered HTML metadata and a 1200 × 630 PNG of that same hug to link unfurlers. It has no accounts, analytics, uploads, or persistent user data.

## Deployment

Pushes to `master` run browser and preview tests, deploy the static editor through CARS, and verify a Linux/amd64 preview image build. Network Ops builds the production preview image on an amd64 cluster node and pins it in the Evans registry. Network Ops owns the two-replica preview Deployment and exact-path Gateway API routes for `/` and `/og.png`. All other assets continue to come from CARS. The preview service obtains the current Vite HTML shell from the CARS frontend Service and inserts the selected hug and metadata. Production is `https://hugging-eomjis-suck.metanet.app/`.

For a coordinated release, wait for both GitHub Actions jobs, run the Network Ops preview image build script, pin the new image digest, apply its manifest, and check `/`, `/og.png`, `/robots.txt`, `/sitemap.xml`, the live editor, and distinct one- and four-person previews. The generic generated CARS hostname remains unindexed. Personalized URLs carry `noindex,follow` and a canonical homepage while Open Graph metadata still describes each exact hug.
