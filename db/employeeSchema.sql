DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department(
  id                 INT NOT NULL AUTO_INCREMENT,
  department_name    VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee_role(
  id                INT NOT NULL AUTO_INCREMENT,
  title             VARCHAR(30) NOT NULL,
  salary            DECIMAL NOT NULL,
  department_id     INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
  id            INTEGER NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(30) NOT NULL,
  last_name     VARCHAR(30) NOT NULL,
  role_id       INTEGER NOT NULL,
  manager_id    INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES employee_role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

--Error Code: 1452. Cannot add or update a child row: a foreign key constraint fails (`employee_trackerdb`.`employee`, CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `employee_role` (`id`))	0.000 sec
