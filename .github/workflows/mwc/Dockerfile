# Multistage docker build, requires docker 17.05

# builder stage
FROM rust:latest as builder

# Install required packages
RUN rustup update && \
    set -ex && \
    apt-get update && \
    apt-get --no-install-recommends --yes install \
        clang \
        libclang-dev \
        llvm-dev \
        libncurses5 \
        libncursesw5 \
        cmake \
        git \
        libssl-dev

##
# Build mwc and mwc Wallet
WORKDIR /usr/src

# Clone mwc
RUN git clone https://github.com/mwcproject/mwc-node.git && \
    mv mwc-node mwc
    #&&  \
    #cd mwc-node && \
    #git checkout 4.4.3 && \
    #git fetch

# Clone mwc-wallet
RUN git clone https://github.com/mwcproject/mwc-wallet.git
    #&& #\
    #cd mwc-wallet && \
    #git checkout 4.5.0 && \
    #git fetch

# Build mwc
WORKDIR /usr/src/mwc
RUN cargo build --release

# Generate configuration
RUN target/release/mwc server config



# Build mwc Wallet
WORKDIR /usr/src/mwc-wallet

# Monkey Patch mwc-wallet
RUN sed -i -e 's/\.header(CONTENT_TYPE, "application\/json")//g'  controller/src/controller.rs
RUN sed -i -e 's/127\.0\.0\.1/0.0.0.0/g' config/src/types.rs

RUN cargo build --release




# runtime stage
FROM debian:12

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    locales \
    procps \
    libssl-dev \
    vim \
    telnet \
    curl \
    python3 \
    netcat-openbsd \
    net-tools \
    libncursesw6 \
    tor \
      && \
    apt-get autoremove -y && \
    rm -rf /var/cache/apt

RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    dpkg-reconfigure --frontend=noninteractive locales && \
    update-locale LANG=en_US.UTF-8 

ENV LANG en_US.UTF-8

COPY --from=builder /usr/src/mwc/target/release/mwc /usr/local/bin/
COPY --from=builder /usr/src/mwc-wallet/target/release/mwc-wallet /usr/local/bin/

COPY mwc-wallet.toml /usr/src/mwc/mwc-wallet.toml
COPY mwc-server.toml /usr/src/mwc/mwc-server.toml



# floonet ports
EXPOSE 13413
EXPOSE 13414
EXPOSE 13415
EXPOSE 13416
EXPOSE 13420

# mainnet ports
EXPOSE 3413
EXPOSE 3414
EXPOSE 3415
EXPOSE 3416
EXPOSE 3420

COPY run.sh /
COPY run-wallet.sh /
COPY libheath.py /
CMD ["/run.sh"]
