#FROM node:alpine
FROM node:14.14.0-alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install --loglevel verbose
COPY . .
CMD ["npm", "run", "start"]

# everything is the same as the Dockerfile.dev except the command which dev -> start