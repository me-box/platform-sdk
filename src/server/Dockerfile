FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
ADD static static
ADD views views
COPY package.json .
COPY config.sample.js config.js
COPY build/bundle.js index.js
RUN npm install

EXPOSE 8086