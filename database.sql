CREATE USER 'sqladmin'@'localhost' IDENTIFIED BY 'admin'; GRANT ALL PRIVILEGES ON *.* TO 'sqladmin'@'localhost' WITH GRANT OPTION; FLUSH PRIVILEGES;
CREATE DATABASE scba CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE TABLE IF NOT EXISTS scba ( 
  id             int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name           varchar(32) NOT NULL,
  mac            varchar(32) NOT NULL,
  rssi           int,
  pressure       int NOT NULL,
  lv_pressure    int,
  lv_temperature int, 
  lv_battery     int,
  ts             timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS watch (
  id             int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name           varchar(32) NOT NULL,
  v1             float NOT NULL,
  v2             float,
  v3             float,
  ts             timestamp NOT NULL
);

