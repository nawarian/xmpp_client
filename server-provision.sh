#!/bin/bash

# Corrigindo repositórios da máquina

echo "deb http://ftp.br.debian.org/debian squeeze main contrib non-free" > /etc/apt/sources.list
echo "deb-src http://ftp.br.debian.org/debian squeeze main contrib non-free" >> /etc/apt/sources.list

apt-get update

# Instalando OpenFire XMPP server

apt-get install openjdk-6-jre --yes --force-yes

cd /opt/xmpp-server
wget -q -O openfire_3.9.3_all.deb http://www.igniterealtime.org/downloadServlet?filename=openfire/openfire_3.9.3_all.deb
dpkg -i openfire_*.deb

if [ $? -eq 0]; then
	echo "Servidor OpenFire (XMPP/Jabber) instalado com sucesso."
	echo "Acesse: http://localhost:9090"
fi
