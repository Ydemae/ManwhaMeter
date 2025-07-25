FROM node:18-alpine

WORKDIR /frontend

COPY ./frontend ./

RUN npm install
RUN npx ng analytics off

CMD npx ng build --configuration production --output-path=/output