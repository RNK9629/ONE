FROM node:15.0.1

RUN node --version
RUN npm --version

# Create app directory
WORKDIR /srv/api/

# Bundle app source

COPY package*.json /srv/api/
RUN npm install 
COPY . /srv/api/

# Confirm the working directory

RUN ls -ltr
EXPOSE 5000
CMD ["sh", "-c","ALTER_DB=$ALTER_DB SYNC_DB=$SYNC_DB npm run $START_CMD"]
