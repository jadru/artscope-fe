IMAGE_FILE_PATH="/home/ubuntu/deploy-front/fe-image.txt"
IMAGE_NAME=$(cat "$IMAGE_FILE_PATH")
CONTAINER_ENV_PATH="/home/ubuntu/env/.env.fe"
SERVICE_NAME=art-fe

echo "IMAGE_NAME: $IMAGE_NAME 도커 실행"
echo "version: '3.8'

services:
  art-fe:
    container_name: art-frontend-production
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
