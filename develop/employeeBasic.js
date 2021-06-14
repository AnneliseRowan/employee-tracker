const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'password',
  database: 'employee_trackerDB',
});


const start = () => {
  inquirer
    .prompt({
      name: 'intro',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees', 
        'View All Employees By Department', 
        'View All Employees By Manager', 
        'Add Employee', 
        'Remove Employee', 
        'Update Employee Role', 
        'Update Employee Manager'
      ],
    })
      if (answer.intro === 'View All Employees') {
        viewAll(); 
      } else if (answer.intro === 'View All Employees By Department') {
        viewByDepartment(); 
      } else if (answer.intro === 'View All Employees By Manager') {
        viewByManager(); 
      } else if (answer.intro === 'Add Employee') {
        addEmployee();
      } else if (answer.intro === 'Remove Employee') {
        removeEmployee();
      } else if (answer.intro === 'Update Employee Role') {
        updateEmployeeRole(); 
      } else if (answer.intro === 'Update Employee Manager') {
        updateManager(); 
      }
};

const viewAll = () => {
  connection.query(
    'SELECT * FROM department', (err, res) => {
      if(err) {
        console.log(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )
};

const viewByDepartment = () => {
  connection.query(
    'SELECT * FROM department', (err, res) => {
      if(err) {
        console.log(`Ahhhhh : `, err); 
      }
      console.table(res); 
      start(); 
    }
  )
};

const viewByManager = () => {
  connection.query(
    'SELECT * FROM employee_role', (err, res) => {
      if(err) {
        console.log(`Ahhhhh : `, err); 
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
        type: 'input',
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
          if (err) throw err;
          console.table(answer); 
          console.log(`You've successfully added an employee!!`);
          start();
        }
      );
    });
};


const removeEmployee = () => {
  connection.promise().query("SELECT * FROM employee")
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







// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) console.log(`Ahhhhh : `, err); 
  // run the start function after the connection is made to prompt the user
  start();
});
