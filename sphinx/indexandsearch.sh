#!/bin/bash

etc/var/lib/sphinxsearch/data -c /etc/sphinxsearch/sphinx.conf --all
./searchd.sh

