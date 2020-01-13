FROM nginx:1.14.2

# install some handy utilities.  do this early in docker so they are cached in a layer
RUN \
  apt-get update \
  && apt-get install -y curl \
  && apt-get install -y nano \
  && apt-get install -y git

RUN apt-get install -qy git libpcre3 libpcre3-dev libz-dev  apache2-dev wget libxml2-dev lua5.1 lua5.1-dev && \
    cd /root && \
    git clone https://github.com/nbs-system/naxsi.git && \
    curl -fSL http://nginx.org/download/nginx-1.14.2.tar.gz -o nginx.tar.gz && \
    tar -xvzf nginx.tar.gz && \
    cd nginx-1.14.2 && \
     ./configure --with-compat --add-dynamic-module=../naxsi/naxsi_src && \
    make modules && \
    cp objs/ngx_http_naxsi_module.so /etc/nginx/modules

RUN cp -rfp /root/naxsi/naxsi_config/naxsi_core.rules /etc/nginx/modules/

COPY nginx.conf /etc/nginx/nginx.conf

# install node in another early layer so it can be cached
ENV NODE_VERSION v10.16.0
# download and install node
RUN curl -SLO https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.gz
RUN tar -xzf "node-$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

# install angular in a separate cached layer
RUN mkdir -p /ddp-workspace/projects
ENV ANGULAR_CLI @angular/cli@8.3.21
RUN npm install -g $ANGULAR_CLI

# now install most of the dependencies early for the sdk and test-app builds
# when package.json-ish files change, a fresh download will happen.  otherwise, they'll be cached.
ADD ddp-workspace/angular.json /ddp-workspace/
ADD ddp-workspace/package.json /ddp-workspace/
ADD ddp-workspace/package-lock.json /ddp-workspace/
ADD ddp-workspace/tsconfig.json /ddp-workspace/

RUN mkdir -p /ddp-workspace/projects/ddp-sdk

RUN mkdir -p /ddp-workspace/projects/toolkit

RUN mkdir -p /ddp-workspace/projects/sandbox-app
ADD ddp-workspace/projects/sandbox-app/tsconfig.app.json /ddp-workspace/projects/sandbox-app/
ADD ddp-workspace/projects/sandbox-app/tsconfig.spec.json /ddp-workspace/projects/sandbox-app/
ADD ddp-workspace/projects/sandbox-app/browserslist /ddp-workspace/projects/sandbox-app/

# setup source dirs
COPY ddp-workspace/projects/ddp-sdk/src/ /ddp-workspace/projects/ddp-sdk/src
COPY ddp-workspace/projects/toolkit/src/ /ddp-workspace/projects/toolkit/src
COPY ddp-workspace/projects/sandbox-app/src/ /ddp-workspace/projects/sandbox-app/src

WORKDIR /ddp-workspace

RUN ["npm", "cache", "clean", "--force"]

# install dependencies
RUN ["npm", "ci"]

# build app
RUN ["ng", "build", "sandbox-app", "--prod", "--aot", "--preserve-symlinks", "--base-href=/sandbox-app/","--output-path=/usr/share/nginx/html/sandbox-app"]