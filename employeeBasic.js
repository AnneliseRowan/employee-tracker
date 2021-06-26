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
      choices: ['View All Employees By Lastname', 'View All Employees By Department', 'View All Employees By Titles', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'View Departments', 'Add A Department', 'Remove A Department', 'View Titles', 'Add A New Title', 'Remove A Title', 'Update Employee Title', 'Update Employee Manager', 'See The Utilized Budget', 'Quit'],
    }).then((answer) => {
      if (answer.intro === 'View All Employees By Lastname') {
        viewAllByEmployee(); 
      } else if (answer.intro === 'View All Employees By Department') {
        viewByDepartment(); 
      } else if (answer.intro === 'View All Employees By Titles') {
        viewByRoles(); 
      } else if (answer.intro === 'View All Employees By Manager') {
        viewByManagers(); 
      } else if (answer.intro === 'Add Employee') {
        addEmployee();
      } else if (answer.intro === 'Remove Employee') {
        removeEmployee(); 
      } else if (answer.intro === 'View Departments') {
        viewDepartments(); 
      } else if (answer.intro === 'Add A Department') {
        addDepartment(); 
      } else if (answer.intro === 'Remove A Department') { 
        removeDepartment(); 
      } else if (answer.intro === 'View Titles') {
        viewTitles(); 
      } else if (answer.intro === 'Add A New Title') {
        addRole(); 
      } else if (answer.intro === 'Remove A Title') {
        removeRole(); 
      } else if (answer.intro === 'Update Employee Title') {
        updateEmployeeRole(); 
      } else if (answer.intro === 'Update Employee Manager') {
        updateManager(); 
      } else if (answer.intro === 'See The Utilized Budget') {
        budget(); 
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
  console.log(`Loading all information... \n`);
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
  console.log(`Loading information by department... \n`);
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
      if(err) {console.error(`Ahhhhh : `, err)};
      console.table(res); 
      start(); 
    }
  )
};

const viewByManagers = () => { 
  console.log(`Loading information by managers... \n`)
  connection.query(
    "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Employee, employee_role.title AS Title, department_name AS Department, employee_role.salary AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN employee_role ON e.role_id = employee_role.id JOIN department ON department.id = employee_role.department_id ORDER BY e.manager_id",
    (err, res) => {
      if(err) {console.log(`Ahhhhhhh : `, err)}; 
      console.table(res); 
      start(); 
    }
  )
};

const addEmployee = async () => { 
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
        message: `What is the name of the manager?`,
        choices: employeeNames 
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


const removeEmployee = async () => { 
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
      let deleteId = res.employeeDelete; 

      let inserts = [
        [deleteId]
      ]
      
      connection.query("DELETE FROM employee WHERE id=?", [inserts], (err, res) => {
        if (err) {console.error("AHHHHHHHHHH : ", err)}; 

        console.log(`${inserts} Employee deleted!! \n`); 
        start();
      })
      
    });
};

const viewDepartments = () => {
  console.log(`Loading departments... \n`);
  connection.query(
    "SELECT department_name FROM department", 
    (err, res) => {
      if(err) {
        console.log(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )

}

const addDepartment = async () => { 
  
  inquirer
    .prompt([
      {
        name: 'deptName',
        type: 'input',
        message: `What is the Department name you would like to add?`,
      }
    ])
    .then(answer => {
      let deptName = answer.deptName 

      let inserts = [
        [deptName]
      ]

      connection.query("INSERT INTO department (department_name) VALUES?", [inserts],  (err, res) => {
        if (err) {console.error(`Ahhhhhhhhhhh : `, err)}; 
        console.log(`${deptName} added to the Departments! \n`)
        start(); 
      }
      );
    });
};

const  removeDepartment = async () => {
  let deptEmp = await helperArrayFunc(); 

  inquirer
    .prompt([
      {
        type:'list',
        name: 'deptDelete',
        message: 'Select the department you would like to delete!',
        choices: deptEmp
      }
    ])
    .then((res) => {
      let deleteId = res.titleDelete; 
      let inserts = [
        [deleteId]
      ]
      
      connection.query("DELETE FROM department WHERE id=?", [inserts], (err, res) => {
        if (err) {console.error("AHHHHHHHHHH : ", err)}; 
        console.log(`${inserts} Department Removed!! \n`); 
        start();
      })
      
    });
}

const viewTitles = () => {
  console.log(`Loading titles... \n`);
  connection.query(
    "SELECT title FROM employee_role", 
    (err, res) => {
      if(err) {
        console.log(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )
}

const addRole = async () => { 
  let roleChoices = await helperArrayFunc(); 

  inquirer
    .prompt([
      {
        name: 'titleName',
        type: 'input',
        message: `What is the title name you would like to add?`,
      },
      {
        name: 'titleSalary',
        type: 'input',
        message: `What is the salary?`,
      },
      {
        name: 'titleDept',
        type: 'list',
        message: `What is the department?`,
        choices: roleChoices
      }
    ])
    .then(answer => {
      let title = answer.titleName;
      let salary = answer.titleSalary; 
      let dept = answer.titleDept; 

      let inserts = [
        [title, salary, dept]
      ]

      connection.query("INSERT INTO employee_role (title, salary, department_id) VALUES?", [inserts],  (err, res) => {
        if (err) {console.error(`Ahhhhhhhhhhh : `, err)}; 
        console.log(`${title}, ${salary}, ${dept} added to Titles! \n`)
        start(); 
      }
      );
    });
};

const removeRole = async () => { 
  let titleEmployees = await helperRoles(); 

  inquirer
    .prompt([
      {
        type:'list',
        name: 'titleDelete',
        message: 'Select a title you would like to remove!',
        choices: titleEmployees
      }
    ])
    .then((res) => {
      let deleteId = res.titleDelete; 
      let inserts = [
        [deleteId]
      ]
      
      connection.query("DELETE FROM employee_role WHERE id=?", [inserts], (err, res) => {
        if (err) {console.error("AHHHHHHHHHH : ", err)}; 
        console.log(`${inserts} Title Removed!! \n`); 
        start();
      })
      
    });
};


const updateEmployeeRole = async () => { 
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
      });
    });
}

const updateManager = async () => { 
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
        choices: allNames || NULL
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

const budget = async () => { 
  let res = await connection.query("SELECT SUM(salary) AS salary FROM employee_role")
  let budgetTotal = []; 
  res.forEach(bud => budgetTotal.push({ salary: bud.salary }))
  console.log("The total utilized budget is - $", budgetTotal[0].salary);
  start(); 
}

// HELPER FUNCTIONS!!

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

const helperArrayFunc = async () => { 
  let res = await connection.query(`SELECT * FROM department`);
  let deptChoice = [];
  res.forEach(dept => deptChoice.push({ name: dept.department_name, value: dept.id }));

  return deptChoice; 
}

// CONNECTIONS

connection.connect((err) => {
  if (err) console.log(`Ahhhhh : `, err); 
  start(); 
});

connection.query = util.promisify(connection.query).bind(connection); 




