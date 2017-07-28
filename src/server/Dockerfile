FROM tlodge/databox-sdk-base

WORKDIR /usr/src/app

# Install app dependencies
ADD static static
ADD views views
ADD conf conf
COPY build/bundle.js index.js