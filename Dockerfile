FROM node:alpine

ADD . /app

WORKDIR /app

RUN npm install && npm run dist

ENV PORT 3000

EXPOSE 3000

CMD npm start
