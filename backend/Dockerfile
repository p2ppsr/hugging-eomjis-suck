FROM node:24-alpine
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
