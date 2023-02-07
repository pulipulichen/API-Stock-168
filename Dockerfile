#Specify the version of nodejs.
FROM buildkite/puppeteer:10.0.0
#FROM dayyass/muse_as_service:1.1.2

RUN mkdir -p /app/

COPY package.json /app/package.json
WORKDIR /app/
RUN npm install

CMD ["node", "/app/index.js"]