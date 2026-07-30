FROM node:16-alpine3.15

WORKDIR /usr/src/mock

COPY server.js divisions.json employees.json ./

EXPOSE 4000

CMD [ "node", "server.js" ]
