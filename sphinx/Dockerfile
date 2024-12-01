
FROM --platform=linux/amd64 alpine:3.19

ENV SPHINX_VERSION 3.7.1-da9f8a4

# install dependencies
RUN apk add --no-cache mariadb-connector-c-dev \
	postgresql-dev \
	wget

RUN mkdir -pv /opt/sphinx/logs /opt/sphinx/indexes
VOLUME /opt/sphinx/indexes

RUN wget http://sphinxsearch.com/files/sphinx-${SPHINX_VERSION}-linux-amd64-musl.tar.gz -O /tmp/sphinxsearch.tar.gz \
	&& cd /opt/sphinx && tar -xf /tmp/sphinxsearch.tar.gz \
	&& rm /tmp/sphinxsearch.tar.gz

ENV PATH "${PATH}:/opt/sphinx/sphinx-3.7.1/bin"
RUN indexer -v

RUN ln -sv /dev/stdout /opt/sphinx/logs/query.log \
    	&& ln -sv /dev/stdout /opt/sphinx/logs/searchd.log

EXPOSE 9306
VOLUME /opt/sphinx/conf

# allow custom config file to be passed
ARG SPHINX_CONFIG_FILE=/opt/sphinx/conf/sphinx.conf
ENV SPHINX_CONFIG_FILE ${SPHINX_CONFIG_FILE}

RUN echo "exec searchd --nodetach --config \${SPHINX_CONFIG_FILE}" > /opt/sphinx/start.sh

CMD sh /opt/sphinx/start.sh