FROM node:latest
COPY . .
RUN npm install
EXPOSE 4001
CMD ["node", "src/index.js"]
