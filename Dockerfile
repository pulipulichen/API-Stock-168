#Specify the version of nodejs.
FROM buildkite/puppeteer
#FROM dayyass/muse_as_service:1.1.2

RUN mkdir -p /app/

CMD ["node", "app/index.js"]