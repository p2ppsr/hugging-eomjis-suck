FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53
RUN test "$(node --version)" = "v24.22.1"
LABEL org.opencontainers.image.source="https://github.com/p2ppsr/hugging-eomjis-suck"
RUN apk add --no-cache font-dejavu
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend/server.mjs ./backend/server.mjs
COPY frontend/package.json ./frontend/package.json
COPY frontend/src/illustration.js frontend/src/hug-state.js ./frontend/src/
ENV NODE_ENV=production PORT=8080
USER node
EXPOSE 8080
CMD ["node", "backend/server.mjs"]
