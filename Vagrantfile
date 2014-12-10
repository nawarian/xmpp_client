Vagrant.configure("2") do |config|
    config.vm.box = "debian32"

    # Porta de administração do OpenFire XMPP
    config.vm.network :forwarded_port, guest: 9090, host: 9090

    # Porta de conexões XMPP
    config.vm.network :forwarded_port, guest: 5222, host: 5222 # client-server
    config.vm.network :forwarded_port, guest: 7070, host: 7070 # BOSH

    config.ssh.forward_agent = true

    config.vm.provider :virtualbox do |v, override|
        override.vm.box_url = "http://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_debian-6.0.8-i386_chef-provisionerless.box"
	
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--memory", 256]
    end

    config.vm.synced_folder ".", "/opt/xmpp-server"
    config.vm.provision :shell, :path => "./server-provision.sh"

end
