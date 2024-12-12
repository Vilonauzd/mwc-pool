FROM node:14
# Install system dependencies
RUN apt-get update && \
    apt-get --no-install-recommends --yes install \
    build-essential \
    libssl-dev \
    vim \
    net-tools \
    psmisc \
    htop \
    curl \
    telnet \
    python3-pip \
    libssl-dev \
    python3-venv  # Install python3-venv package

# Set working directory for API
WORKDIR /api
RUN mkdir -p /logs



EXPOSE 3009

COPY py/. /py/
RUN pip3 install -r /py/requirements.txt
# Install Python dependencies in a virtual environment
#RUN python3 -m venv /venv && \
#    /venv/bin/pip install --upgrade pip && \
#    /venv/bin/pip install -r /py/requirements.txt
#
# Copy Node.js application code
COPY code/. /api/

# Install Node.js dependencies and configure environment
RUN yarn global add forever && \
    yarn
ENV NODE_ENV=production

ENV BLOCK_REWARD=0.05

# Copy entrypoint script
COPY entrypoint.sh /

# Define entrypoint
CMD ["/entrypoint.sh"]
