FROM node:latest
MAINTAINER Brandfolder, Inc. <developers@brandfolder.com>

# Set up ENV
ENV BRANDFOLDER_API_ENDPOINT https://api.brandfolder.com/v2
ENV NODE_ENV production
ENV PORT 5000

# Install Packages
ADD package.json package.json
RUN npm prune
RUN npm install

# Install App
ADD . /

# Start the app
CMD npm start
