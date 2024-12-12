# Multistage docker build, requires docker 17.05

# builder stage
FROM rust:1.77 as builder

RUN set -ex && \
    apt-get update && \
    apt-get --no-install-recommends --yes install \
        clang \
        libclang-dev \
        llvm-dev \
        libncurses5 \
        libncursesw5 \
        libssl-dev \
        libssl3 \
        cmake \
        git \
        vim \
        net-tools \
        procps
        
# Vim Settings
RUN echo "set mouse=v" >> /root/.vimrc

WORKDIR /stratum

# Copying mwc-pool source
COPY src/. /stratum/src/
COPY mwc-pool.toml Cargo.toml /stratum/

# Building mwc-pool
RUN cargo build --release

# runtime stage
FROM debian:12

RUN set -ex && \
    apt-get update && \
    apt-get --no-install-recommends --yes install \
        libssl-dev \
        procps \
        htop \
        net-tools \
        vim

WORKDIR /stratum
COPY --from=builder /stratum/target/*/mwc-pool /usr/local/bin/
COPY mwc-pool.toml /usr/local/bin/
COPY mwc-pool.toml /stratum
COPY run.sh /

ENV RUST_BACKTRACE=1
ENV PATH=/usr/local/bin:$PATH
EXPOSE 3333
CMD ["/run.sh"]
