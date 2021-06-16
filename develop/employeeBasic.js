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
        viewAllByEmployee(); //working
      } else if (answer.intro === 'View All Employees By Department') {
        viewByDepartment(); //working
      } else if (answer.intro === 'View All Employees By Titles') {
        viewByRoles(); //working
      } else if (answer.intro === 'Add Employee') {
        addEmployee(); //working
      } else if (answer.intro === 'Remove Employee') {
        removeEmployee();
      } else if (answer.intro === 'Update Employee Role') {
        updateEmployeeRole(); //working
      } else if (answer.intro === 'Update Employee Manager') {
        updateManager(); //working
      } else if (answer.intro === 'Quit') {
        connection.end(); //working
      }
    })  
};


/*
SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, employee_role.title AS Title, department_name AS Department, employee_role.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager 
FROM employee e
LEFT JOIN employee m ON m.id = e.manager_id JOIN employee_role ON e.role_id = employee_role.id JOIN department ON department.id = employee_role.department_id 
*/

const viewAllByEmployee = () => { //WORKSSSSSSSSSS
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

const viewByDepartment = () => { //WORKSSSSSSSSSSSSS
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

const viewByRoles = () => { //WORKSSSSSSSSSSSSSS
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

const addEmployee = async () => { // WORKS ALL OF A SUDDEN!!!!!!!!!!!!! 
  const employeeNames = await helperEmployee(); 
  const rolesName = await helperRoles(); 
  
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
        message: 'Select a title for the employee',
        choices: rolesName
      },
      {
        name: 'manager',
        type: 'list',
        message: `What is the name of the manager (Can press enter if there is not a manager)`,
        choices: employeeNames
        // when: ({ confirmManager }) => confirmManager
      },
    ])
    .then(answer => {
      let name = answer.firstName; 
      let last = answer.lastName; 
      let roleIdEmployee = answer.role; 
      let managerId = answer.manager || null; 

      let inserts = [
        [name, last, roleIdEmployee, managerId]
      ]

      connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES?", [inserts],  (err, res) => {
        if (err) {console.error(`Ahhhhhhhhhhh : `, err)}; 
        console.log(`${name} ${last} ${roleIdEmployee} ${managerId} Employee added! \n`)
        start(); 
      }
      );
    });
};


const removeEmployee = async () => { //NOT WORKING YET
  let employees = await helperEmployee(); 

  inquirer
    .prompt([
      {
        type:'list',
        name: 'employeeDelete',
        message: 'Select An Employee To Remove!',
        choices: employees
      }
    ])
    .then((res) => {
      let deleteId = res.empDelete; 
      
      connection.query("DELETE FROM employee WHERE id=?", [deleteId], (err, res) => {
        if (err) {console.error("AHHHHHHHHHH : ", err)}; 

        console.log(`${deleteId} Employee deleted!! \n`); 
        start();
      })
      
    });
};


const updateEmployeeRole = async () => { //WORKS THANK GOD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  let employeeNames = await helperEmployee(); 
  let titleNames = await helperRoles(); 

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employeeName',
        message: 'Select an employee to update his title',
        choices: employeeNames
      },
      {
        type: 'list',
        name: 'selectRole',
        message: 'Select a new title for an employee',
        choices: titleNames
      }
    ])
    .then(res => {
      let employeeName = res.employeeName;
      let newRole = res.selectRole; 

      connection.query("UPDATE employee SET employee.role_id=? WHERE employee.id=?", [newRole, employeeName], (err, res) => {
        if (err) {console.log("AHHHHHHHHHH : ", err)}

        console.log(`${employeeName}, ${newRole} Updated!!!! \n`);
        start(); 
      })
    })
}

const updateManager = async () => { //WORKSSSSSSSSSSSSSSSSSSSSS
  let allNames = await helperEmployee(); 

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Select An Employee For Updating New Manager',
        choices: allNames
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Select A Manager Name',
        choices: allNames
      }
    ])
    .then(res => {

      let employeeName = res.employee;
      let managerName = res.manager; 

      connection.query("UPDATE employee SET employee.manager_id=? WHERE employee.id=?", [managerName, employeeName], (err, res) => {
        if (err) {console.log("AHHHHHHHH : ", err)}; 

        console.log(`${employeeName}, ${managerName} UPDATED!!`);
        start(); 
      })
    })
}

// HELPER FUNCTIONS!!!!!!!!!!!!!!!!!!!!!!

const helperEmployee = async () => { //helperEmpManager
  let res = await connection.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS fullName, employee.id FROM employee`); 
  let employeeName = []; 
  res.forEach(emp => {
    employeeName.push({ name: emp.fullName, value: emp.id})
  })
  return employeeName; 
}

const helperRoles = async () => { //helperEmployee
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




