#!/bin/bash

apt-get update
apt-get install python python-dev python-setuptools -y
apt-get install curl -y
curl -O https://raw.github.com/pypa/pip/master/contrib/get-pip.py && python get-pip.py
pip install virtualenv
mkdir ~/.virtualenv
virtualenv ~/.virtualenv/thehutong 
apt-get install mysql-server

pip install 
