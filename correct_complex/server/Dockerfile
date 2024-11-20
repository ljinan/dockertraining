#FROM node:16-alpine
FROM node:14.14.0-alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]

#when changing the command, verify that there is a script inside the package.json file