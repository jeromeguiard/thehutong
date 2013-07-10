#!/bin/bash

#Update the database of the packet manager
apt-get update

#install python with modules for dev 
apt-get install python python-dev python-setuptools -y

#install pip
apt-get install curl -y
curl -O https://raw.github.com/pypa/pip/master/contrib/get-pip.py && python get-pip.py

#Create a virtual env
pip install virtualenv
mkdir ~/.virtualenv
virtualenv ~/.virtualenv/thehutong 
source ~/.virtualenv/thehutong/bin/activate
#Install the database
debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password P0ww0w'
debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password P0ww0w'

apt-get install mysql-server libmysqlclient-dev -y 

mysql -pP0ww0w < sql_ini.sql 

#Install pip requirments
pip install -r requirements.txt
