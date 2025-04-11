FROM alpine:3.21

WORKDIR /frontend

COPY ./frontend ./

RUN apk update
RUN apk add npm

RUN npm install
RUN npx ng analytics off

CMD npx ng build --configuration production