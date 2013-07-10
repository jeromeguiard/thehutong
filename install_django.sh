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

#Install the database
sudo debconf-set-selections <<< 'mysql-server-5.5.31 mysql-server/root_password password P0ww0w'
sudo debconf-set-selections <<< 'mysql-server-5.5.31 mysql-server/root_password_again password P0ww0w'

apt-get install mysql-server libmysqlclient-dev mysql-python

mysql -pP0ww0w < create database thehutong CHARACTER SET="UTF8";   
mysql -pP0ww0w < create user thehutong identified by 'thehutong'; 
mysql -pP0ww0w < grant all privileges on thehutong.* to 'thehutong'@'localhost' identified by "thehutong";

#Install pip requirments
pip install -e requirements.txt 

