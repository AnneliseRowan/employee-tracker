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

        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 115000, 2),

        ('Account Manager', 120000, 3),
        ('Accountant', 75000, 3),

        ('Legal Advisor Lead', 160000, 4),
        ('Lawyer', 150000, 4); 


INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES  ('Ronald', 'McDonald', 1, NULL),
        ('Panda', 'Express', 2, 1),
        ('Little', 'Ceasars', 3, 2),
        ('Taco', 'Bell', 4, 3),
        ('Dairy', 'Queen', 5, NULL),
        ('Auntie', 'Annes', 6, 5),
        ('Sweet', 'Frog', 7, 4),
        ('Five', 'Guys', 8, NULL),
        ('Church', 'Chicken', 2, 8),
        ('Burger', 'King', 6, NULL);

        

         
