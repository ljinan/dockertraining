FROM node:16-alphine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install --loglevel verbose
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
#change the default port that nginx listens from. by default is 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html