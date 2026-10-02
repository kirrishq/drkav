FROM node:22-bookworm-slim

WORKDIR /app
COPY package.json server.js ./

ENV NODE_ENV=production
ENV PORT=8080
ENV AMO_AUTH_FILE=/run/amo/auth.set

USER node
EXPOSE 8080

CMD ["node", "server.js"]
