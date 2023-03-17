FROM node:18-alpine as build

# working directory 지정
WORKDIR /app

# dependency 설치
COPY . .
RUN yarn install

# 앱 실행
CMD ["yarn", "serve:dev"]
