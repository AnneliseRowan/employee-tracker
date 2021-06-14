USE employee_trackerDB;

INSERT INTO department (department_name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal'); 


INSERT INTO employee_role
    (title, salary, department_id)
VALUES  ('Sales Manager', 85000, 1),
        ('Sales Person', 45000, 1),

        ('Mechanical Engineer', 100000, 2),
        ('Softare Engineer', 115000, 2),

        ('Account Manager', 120000, 3),
        ('Accountant', 75000, 3),

        ('Legal Advisor Lead', 160000, 4),
        ('Lawyer', 150000, 4); 


INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES  ('Ronald', 'McDonald', 1, 2),
        ('Panda', 'Express', 2, NULL),
        ('Little', 'Ceasars', 3, 4),
        ('Taco', 'Bell', 4, 1),
        ('Dairy', 'Queen', 5, NULL),
        ('Auntie', 'Annes', 6, 5),
        ('Sweet', 'Frog', 7, 2),
        ('Five', 'Guys', 8, NULL),
        ('Church', 'Chicken', 9, 7),
        ('Burger', 'King', 10, NULL);


     (first_name, last_name, role_id, manager_id)
 VALUES  ('Ronald', 'McDonald', 1, 1),
         ('Panda', 'Express', 2, NULL),
         ('Little', 'Ceasars', 3, 2),
         ('Taco', 'Bell', 4, 3),
         ('Dairy', 'Queen', 5, NULL),
         ('Auntie', 'Annes', 6, 4),
         ('Sweet', 'Frog', 7, 5),
         ('Five', 'Guys', 8, NULL),
         ('Church', 'Chicken', 9, 6),
         ('Burger', 'King', 10, NULL)	
         
