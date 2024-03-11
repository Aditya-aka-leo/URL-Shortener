FROM node:20.9-alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 8081

# RUN rm /etc/nginx/conf.d/default.conf


CMD ["npm", "start"]
