render "docker-compose-angio.yaml.ctmpl"
render "AngioDDPConfig.js.ctmpl","ddpConfig.js",nil
copy_file "angio-nginx.conf"
copy_secret_from_path "secret/pepper/#{$env}/#{$version}/angio-cert.key",nil,"cert.key"
copy_secret_from_path "secret/pepper/#{$env}/#{$version}/angio-cert.crt",nil,"cert.crt"