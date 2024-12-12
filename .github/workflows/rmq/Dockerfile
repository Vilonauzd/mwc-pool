FROM rabbitmq

RUN set -ex && \
    apt-get update && \
    apt-get --no-install-recommends --yes install python3 && \
    ln -s /usr/bin/python3 /usr/bin/python

COPY rabbitmqadmin /
COPY definitions.json /etc/rabbitmq/
COPY definitions.json /
COPY import_config.sh /
COPY entrypoint.sh /

RUN rabbitmq-plugins enable rabbitmq_management
