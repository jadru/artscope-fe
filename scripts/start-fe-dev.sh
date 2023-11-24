IMAGE_FILE_PATH="/home/ubuntu/deploy-front-dev/fe-image-dev.txt"
IMAGE_NAME=$(cat "$IMAGE_FILE_PATH")
CONTAINER_ENV_PATH="/home/ubuntu/env/.env.fe-dev"
SERVICE_NAME=art-fe-dev

echo "IMAGE_NAME: $IMAGE_NAME 도커 실행"
echo "version: '3.8'

services:
  art-fe-dev:
    container_name: art-frontend-production-dev
    image: ${IMAGE_NAME}
    ports:
      - 3000:3000
    env_file:
      - ${CONTAINER_ENV_PATH}

networks:
  default:
    name: art
    external: true" > docker-compose.yaml

docker-compose up -d $SERVICE_NAME
