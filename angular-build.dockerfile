FROM node:22-alpine AS builder

WORKDIR /frontend

COPY ./frontend ./

RUN npm install && npx ng analytics off && npx ng build --configuration production

FROM nginx:alpine

COPY --from=builder /frontend/dist/frontend/browser /usr/share/nginx/html
COPY ./nginx/angular.conf /etc/nginx/conf.d/default.conf
