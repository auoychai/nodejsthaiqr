FROM    node:8.4.0
LABEL   maintainer "Espree CoreAPI"
WORKDIR /opt/espree/coreapi
COPY    app /usr/local/espree/coreapi
RUN     npm install
EXPOSE  4001
CMD     ["npm","start"]