FROM node:16-alpine3.15

WORKDIR /usr/src/web

COPY package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 8080

CMD ["npm", "run", "start:dev"]
