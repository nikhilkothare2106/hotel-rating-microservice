CREATE DATABASE userservice;
CREATE DATABASE hotelservice;

CREATE USER 'appuser'@'%' IDENTIFIED BY 'app123';

GRANT ALL PRIVILEGES ON userservice.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON hotelservice.* TO 'appuser'@'%';

FLUSH PRIVILEGES;