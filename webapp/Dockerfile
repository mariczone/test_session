# Use Node v4 as the base image.
FROM node:7.7.4-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

ENV http_proxy http://10.254.7.89:8080
ENV https_proxy http://10.254.7.89:8080

# Install dependencies
RUN npm install

# Expose our server port.
EXPOSE 8080

# Run our app.
CMD [ "npm", "start" ]