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

#apt-get install mysql-server libmysqlclient-dev -y 
apt-get install postgreql postgresql-server-dev-9.1 postgresql-contrib-9.1 postgres-client-9.1 libxml2 libxml2-dev libpq-dev python-gdal libgeoip1 -y 

#mysql -pP0ww0w < sql_ini.sql 

#spatial libraries installation
apt-get install binutils libproj-dev gdal-bin bzip2 g++ make libpq-dev -y
wget http://download.osgeo.org/geos/geos-3.3.8.tar.bz2
tar xjf geos-3.3.8.tar.bz2
cd geos-3.3.8
./configure
make
make install
cd ..

wget http://download.osgeo.org/proj/proj-4.8.0.tar.gz
wget http://download.osgeo.org/proj/proj-datumgrid-1.5.tar.gz
tar xzf proj-4.8.0.tar.gz
cd proj-4.8.0/nad/
tar xzf ../../proj-datumgrid-1.5.tar.gz
cd ..
./configure
make
make install 
cd .. 

wget http://download.osgeo.org/gdal/gdal-1.9.2.tar.gz
tar xzf gdal-1.9.2.tar.gz
cd gdal-1.9.2
./configure
make
make install
cd ..

wget http://download.osgeo.org/postgis/source/postgis-2.0.3.tar.gz
tar xvf postgis-2.0.3.tar.gz 
cd postgis-2.0.3
./configure 
make 
make install
cd ..

#Install pip requirments
pip install -r requirements.txt
