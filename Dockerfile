#Specify the version of nodejs.
FROM buildkite/puppeteer:10.0.0
#FROM dayyass/muse_as_service:1.1.2

RUN mkdir -p /app/

RUN npm link iconv-lite@0.6.3
RUN npm link sequelize@6.7.0
RUN npm link sqlite3@5.0.2
RUN npm link papaparse@5.3.2

CMD ["node", "/app/index.js"]