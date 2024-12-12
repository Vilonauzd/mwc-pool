FROM node:latest

# Install necessary packages
RUN apt-get update && \
    apt-get --no-install-recommends --yes install \
      python3 \
      #python2.7 \
      #vim \
      net-tools \
      procps

# Create symlink from python2 to python
RUN ln -s /usr/bin/python3 /usr/bin/python

ENV POOL_FEE=0
# Set the working directory
WORKDIR /webui

# Copy package.json and install dependencies
COPY package.json /webui/
RUN yarn install

# Expose ports
EXPOSE 3005
EXPOSE 5000

# Copy application files
COPY . /webui

# Build the application
RUN yarn build

# Install serve globally
RUN yarn global add serve

# Copy entrypoint script
COPY entrypoint.sh /

# Set the entrypoint command
CMD ["/entrypoint.sh"]
