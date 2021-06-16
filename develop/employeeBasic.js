const inquirer = require('inquirer');
const util = require("util"); 
const mysql = require('mysql');

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
      choices: ['View All Employees By Lastname', 'View All Employees By Department', 'View All Employees By Titles', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Quit'],
    }).then((answer) => {
      if (answer.intro === 'View All Employees By Lastname') {
        viewAllByEmployee(); 
      } else if (answer.intro === 'View All Employees By Department') {
        viewByDepartment(); 
      } else if (answer.intro === 'View All Employees By Titles') {
        viewByRoles(); 
      } else if (answer.intro === 'Add Employee') {
        addEmployee();
      } else if (answer.intro === 'Remove Employee') {
        removeEmployee();
      } else if (answer.intro === 'Update Employee Role') {
        updateEmployeeRole(); 
      } else if (answer.intro === 'Update Employee Manager') {
        updateManager(); 
      } else if (answer.intro === 'Quit') {
        connection.end(); 
      }
    })  
};


/*
SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, employee_role.title AS Title, department_name AS Department, employee_role.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager 
FROM employee e
LEFT JOIN employee m ON m.id = e.manager_id JOIN employee_role ON e.role_id = employee_role.id JOIN department ON department.id = employee_role.department_id 
*/

const viewAllByEmployee = () => {
  console.log(`Loading all information... \n`)
  connection.query(
    "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, employee_role.title AS Title, department_name AS Department, employee_role.salary AS Salary, CONCAT(m.first_name,' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN employee_role ON e.role_id = employee_role.id JOIN department ON department.id = employee_role.department_id ORDER BY e.last_name ASC", 
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

const viewByRoles = () => {
  console.log(`Loading information by roles... \n`)
  connection.query(
    "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, employee_role.title AS Title, department_name AS Department, employee_role.salary AS Salary, CONCAT(m.first_name,' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN employee_role ON e.role_id = employee_role.id JOIN department ON department.id = employee_role.department_id ORDER BY employee_role.title ASC",
    (err, res) => {
      if(err) {
        console.error(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )
};

const addEmployee = async () => { 
  //const employeeNames = await helperEmployee(); 
  //const rolesName = await helperRoles(); 
  
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
        type: 'input',
        message: `What is the employee's role? ['Sales Manager = 1', 'Sales Person = 2']`
      },
      {
        name: 'manager',
        type: 'inputt',
        message: `Have a manager? ['Ronald McDonald = 1', 'Panda Express = 2']`,
        // choices: helperEmployee(),
        // when: ({ confirmManager }) => confirmManager
      },
    ])
    .then(answer => {
      let name = answer.firstName; 
      let last = answer.lastName; 
      let roleIdEmployee = answer.role; 
      let managerId = answer.manager || null; 

      connection.query("INSERT INTO employee first_name=?, last_name=?, rol_id=?, manager_id=? VALUES", [name, last, roleIdEmployee, managerId], (err, res) => {
        if (err) {console.error(`Ahhhhh : `, err)}; 
        console.log(`${name} ${last} ${roleIdEmployee} ${managerId} Employee added! \n`)
        start(); 
      }
      );
    });
};


// const removeEmployee = () => {
//   connection.query("SELECT * FROM employee") //should maybe use connection.promise().query()????
//     .then((res) => {
//       return res[0].map(employee => {
//         return {
//           name: employee.first_name,
//           value: employee.id
//         }
//       })
//     .then()
//         (err) => {
//           if (err) console.log(`Ahhhhh : `, err); ;
//           console.table(answer); 
//           console.log(`You've successfully added an employee!!`);
//           start();
//         }

//     });
// };

// HELPER FUNCTIONS!!!!!!!!!!!!!!!!!!!!!!

const helperEmployee = async () => {
  let res = await connection.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS fullName, employee.id FROM employee`); 
  let employeeName = []; 
  res.forEach(emp => {
    employeeName.push({ name: emp.fullName, value: emp.id})
  })
  return employeeName; 
}

const helperRoles = async () => {
  let res = await connection.query(`SELECT employee_role.title, employee_role.id FROM employee_role`); 
  let roleChoices = []; 

  res.forEach(roles => {
    roleChoices.push({ name: roles.title, value: roles.id })
  })
  return roleChoices; 
}


// CONNECTIONS

connection.connect((err) => {
  if (err) console.log(`Ahhhhh : `, err); 
  start(); 
});

connection.query = util.promisify(connection.query).bind(connection); //NEED TO LOOK INTO THIS MORE -- I THINK CREATED A NICE TABLE FORMAT




