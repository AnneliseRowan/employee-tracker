const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table'); //don't know if I need this?


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_trackerDB',
});


const start = () => {
  inquirer
    .prompt({
      name: 'intro',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Roles', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager'],
    }).then((answer) => {
      if (answer.intro === 'View All Employees') {
        viewAll(); 
      } else if (answer.intro === 'View All Employees By Department') {
        viewByDepartment(); 
      } else if (answer.intro === 'View All Employees By Roles') {
        viewByRoles(); 
      } else if (answer.intro === 'Add Employee') {
        addEmployee();
      } else if (answer.intro === 'Remove Employee') {
        removeEmployee();
      } else if (answer.intro === 'Update Employee Role') {
        updateEmployeeRole(); 
      } else if (answer.intro === 'Update Employee Manager') {
        updateManager(); 
      } else {
        connection.end(); 
      }
    })  
};

/* Reference from W3Schools
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name = table2.column_name;
*/

/*
SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, employee_role.title AS Title, department_name AS Department, employee_role.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager 
FROM employee e
LEFT JOIN employee m ON m.id = e.manager_id JOIN employee_role ON e.role_id = employee_role.id JOIN department ON department.id = employee_role.department_id 
*/

const viewAll = () => {
  console.log(`Loading all information... \n`)
  connection.query(
    "SELECT * FROM employee INNER JOIN employee_role ON employee.role_id = employee_role.id INNER JOIN department ON employee_role.department_id = department.id", 
    (err, res) => {
      if(err) {
        console.error(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )
};

const viewByDepartment = () => {
  console.log(`Loading information by department... \n`)
  connection.query(
    "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, employee_role.title AS Title, department_name AS Department, employee_role.salary AS Salary, CONCAT(m.first_name,' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN employee_role ON e.role_id = employee_role.id JOIN department ON department.id = employee_role.department_id ORDER BY department_name ASC", 
    (err, res) => {
      if(err) {
        console.log(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )
};

/* Reference from W3Schools
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name = table2.column_name;
*/

const viewByRoles = () => {
  console.log(`Loading information by roles... \n`)
  connection.query(
    "SELECT * FROM employee_role INNER JOIN department ON employee_role.department_id",
    (err, res) => {
      if(err) {
        console.error(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: `What is the employee's first name?`,
      },
      {
        name: 'lastName',
        type: 'input',
        message: `What is the employee's last name?`,
      },
      {
        name: 'role',
        type: 'list',
        message: `What is the employee's role?`,
        choices: [
          'Sales Manager', 
          'Sales Person', 
          'Lead Engineer', 
          'Software Engineer', 
          'Account Manager', 
          'Accountant', 
          'Legal Team Lead',
          'Lawyer'
        ] // MAYBE EASIER WAY TO REUSE?
      },
      {
        name: 'manager',
        type: 'input',
        message: `Who is the employee's manager?`,
        choices: selectingManager(), 
      },
    ])
    .then((answer) => {
      let roleId = answer.role; 
      let managerId = answer.manager; 

      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
          manager_id: managerId,
        },
        (err) => {
          if (err) console.error(`Ahhhhh : `, err);
          console.table(answer); 
          console.log(`You've successfully added ${answer.firstName} ${answer.lastName}!!`);
          start();
        }
      );
    });
};


const removeEmployee = () => {
  connection.query("SELECT * FROM employee") //should maybe use connection.promise().query()????
    .then((res) => {
      return res[0].map(employee => {
        return {
          name: employee.first_name,
          value: employee.id
        }
      })
    .then()
        // (err) => {
        //   if (err) console.log(`Ahhhhh : `, err); ;
        //   console.table(answer); 
        //   console.log(`You've successfully added an employee!!`);
        //   start();
        // }

    });
};

const updateEmployeeRole = () => {

}

const updateManager = () => {
  connection.query("SELECT * FROM employee", (err, res) => { //maybe should use connection.promisefy()???
    console.table(res); 


  })
}

// const selectingManager = () => {
//   return connection.prependOnceListener().query("SELECT * FROM EMPLOYEE")
//   .then(res => {
//     return res[0].map(manager => {
//       return {
//         name: `${manager.first_name} ${manager.last_name}`,
//         value: manager.id,
//       }
//     })
//   })
// }







connection.connect((err) => {
  if (err) console.log(`Ahhhhh : `, err); 

  start();
});
