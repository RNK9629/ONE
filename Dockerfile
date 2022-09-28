FROM tomcat:8
COPY dockerfile/webapp* /usr/local/tomcat/webapps/
