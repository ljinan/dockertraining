FROM node:16-alpine as builder

#USER node
#RUN mkdir -p /home/node/app
#WORKDIR /home/node/app
#COPY --chown=node:node ./package.json ./
#RUN npm install
#COPY --chown=node:node ./ ./

WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
