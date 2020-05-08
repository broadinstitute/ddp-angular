render "pepperConfig.js.ctmpl"
<<<<<<< HEAD
render "dispatch.yaml.ctmpl"
=======
copy_file "study-nginx.conf"
copy_secret_from_path "secret/pepper/#{$env}/#{$version}/#{$study_key}/cert.key"
copy_secret_from_path "secret/pepper/#{$env}/#{$version}/#{$study_key}/cert.crt"
>>>>>>> develop
