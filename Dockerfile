FROM node:lts-alpine3.23 AS build

WORKDIR /bot
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:lts-alpine3.23

WORKDIR /bot
COPY --from=build /bot/package*.json ./
RUN npm install --omit=dev

COPY --from=build /bot/dist ./dist

CMD ["node", "dist/index.js"]
