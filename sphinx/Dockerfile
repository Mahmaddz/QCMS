FROM phusion/baseimage:0.11

# Update package lists and install necessary dependencies
RUN apt-get update && \
    apt-get install -y wget build-essential software-properties-common \
    libmysqlclient-dev mysql-client && \
    apt-get clean

# Download and build Sphinx from source
RUN wget https://sphinxsearch.com/files/sphinx-2.2.11-release.tar.gz && \
    tar -xzf sphinx-2.2.11-release.tar.gz && \
    cd sphinx-2.2.11-release && \
    ./configure --with-mysql && \
    make && \
    make install && \
    cd .. && \
    rm -rf sphinx-2.2.11-release sphinx-2.2.11-release.tar.gz

# Create necessary directories for Sphinx
RUN mkdir -p /var/lib/sphinx/data /var/log/sphinx /var/run/sphinx

# Add and set permissions for scripts
ADD indexandsearch.sh /
RUN chmod a+x /indexandsearch.sh

ADD searchd.sh /
RUN chmod a+x /searchd.sh

ADD lordsearchd.sh /
RUN chmod a+x /lordsearchd.sh

