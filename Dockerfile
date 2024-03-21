FROM node:20-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /goit-node-rest-api
COPY . .
RUN npm install --production
CMD ["node", "/goit-node-rest-api/app.js"]