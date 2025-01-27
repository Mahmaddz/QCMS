FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]