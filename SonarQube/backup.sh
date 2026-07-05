#!/bin/bash

DATE=$(date +%F)

docker exec sonarqube-postgres-1 pg_dump -U sonar sonarqube > sonarqube.sql

aws s3 cp \
  /tmp/sonarqube-$DATE.sql \
  s3://jenkins-configuration-123/sonarqube/