# Use Node v4 as the base image.
FROM node:7.7.4-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

# Expose our server port.
EXPOSE 8090

# Run our app.
CMD [ "npm", "start" ]