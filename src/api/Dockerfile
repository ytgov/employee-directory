FROM node:16.14.0-alpine


RUN npm install -g pm2@latest
RUN npm install -g html-pdf

WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g html-pdf
RUN npm install -g nodemon


COPY ./ ./

EXPOSE 8080

CMD npm run start