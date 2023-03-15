# 노드 이미지를 최신 버전으로 가져옴
FROM node:18-alpine

# working directory 지정
WORKDIR /app

RUN npm install pm2 -g

# app dependencies, install 및 caching
COPY package.json .
RUN yarn set version berry
COPY yarn.lock .yarn .yarnrc.yml ./

# 앱 실행
COPY . .
RUN yarn build

CMD ["pm2", "start", "dist/index.html", "--watch"]
