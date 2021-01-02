FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5858

CMD ["npm", "start"]