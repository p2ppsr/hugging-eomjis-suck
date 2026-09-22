# Hugging Emojis Suck

A tiny browser-only studio for making the hug emoji you actually wanted. Choose one to four people, set each person's presentation and skin tone, then export the resulting illustration as PNG or SVG.

## Development

```sh
npm ci
npm --prefix frontend ci
npm run frontend:test
npm run frontend:build
```

The app has no backend, account, analytics, or uploaded data. A compact configuration is stored in the page URL so a hug can be shared.

## Deployment

Pushes to `master` run browser tests, build the static frontend, and deploy it through CARS. Production is `https://hugging-eomjis-suck.metanet.app/`.
