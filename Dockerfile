# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build
USER root
# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install --legacy-peer-deps

RUN chmod 777 node_modules/.bin/ng

# Generate the build of the application
RUN node_modules/.bin/ng build --configuration uat --base-href /treasury/
# RUN ng build --prod

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM pcaifocnrd01.sdc.raj.gov.in:5000/nginx

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
# COPY default.conf  /etc/nginx/conf.d

# Expose port 80
EXPOSE 80



#FROM pcaifocnrd01.sdc.raj.gov.in:5000/nginx
#COPY ./dist /usr/share/nginx/html
#COPY default.conf  /etc/nginx/conf.d
#EXPOSE 80
