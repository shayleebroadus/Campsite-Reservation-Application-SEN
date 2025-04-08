let mysql = require('mysql2');

var dbConnectionInfo = require('./connectionInfo');

var con = mysql.createConnection({
  host: dbConnectionInfo.host,
  user: dbConnectionInfo.user,
  password: dbConnectionInfo.password,
  port: dbConnectionInfo.port,
  multipleStatements: true              // Needed for stored proecures with OUT results
});

con.connect(function (err) {
  if (err) {
    throw err;
  }
  else {
    console.log("database.js: Connected to server!");

    con.query("CREATE DATABASE IF NOT EXISTS Fam_Camp", function (err, result) {
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Fam_Camp database created if it didn't exist");
      selectDatabase();
    });
  }
});

function selectDatabase() {
  let sql = "USE Fam_Camp";
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: Selected Fam_Camp database");
      CreateTables();
      createStoredProcedure();
    }
  });
}

function CreateTables() {
  //users table for login
  let sql = "CREATE TABLE IF NOT EXISTS users (\n" +
    "user_id INT NOT NULL AUTO_INCREMENT, \n" +
    "username VARCHAR(255) NOT NULL, \n " +
    "hashedPassword VARCHAR(255) NOT NULL, \n" +
    "salt VARCHAR(255) NOT NULL, \n" +
    "role VARCHAR(6) NOT NULL, \n" +
    "PRIMARY KEY (user_id) \n" +
    ")";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: users table Created!");
    }
  });
  // create personal_data table
  sql = "CREATE TABLE IF NOT EXISTS personal_data (\n" +
    "personal_id INT NOT NULL AUTO_INCREMENT, \n" +
    "first_name VARCHAR(255) NOT NULL, \n"+
    "last_name VARCHAR(255) NOT NULL, \n"+
    "address_line_1 VARCHAR (255) NOT NULL,\n" +
    "address_line_2 VARCHAR (255) NULL,\n" +
    "city VARCHAR (255) NOT NULL, \n" +
    "state VARCHAR (50) NOT NULL, \n" +
    "zip VARCHAR (20) NOT NULL, \n" +
    "email_address VARCHAR (255) NOT NULL, \n" +
    " _rank VARCHAR(255) NOT NULL, \n" +
    "branch_of_service VARCHAR (255) NOT NULL, \n" +
    "duty_status VARCHAR (255) NOT NULL, \n" +
    "phone_number VARCHAR (255) NOT NULL, \n" +
    "user_id INT NOT NULL, \n" +
    "PRIMARY KEY (personal_id), \n" +
    "FOREIGN KEY (user_id) REFERENCES users(user_id) \n" +
    ")";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: personal_data table created!");
    }
  });

  // create site table
  sql = "CREATE TABLE IF NOT EXISTS sites (\n" +
    "site_count INT NOT NULL DEFAULT 0,\n"+
    "site_id VARCHAR(3) NOT NULL, \n" +
    "site_type VARCHAR(255) NOT NULL,\n"+
    "length int NOT NULL,\n"+
    "has_hookups TINYINT(1) NOT NULL DEFAULT 0, \n" +
    "cost_per_night DECIMAL(10,2) NOT NULL, \n" +
    "is_available TINYINT(1) NOT NULL DEFAULT 0, \n" +
    "PRIMARY KEY (site_id) \n" +
    ");";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: sites table created!")
    }
  });

  // Create Reservation table
  sql = "CREATE TABLE IF NOT EXISTS reservations (\n" +
    "reservation_id INT NOT NULL AUTO_INCREMENT, \n" +
    "user_id INT NOT NULL, \n"+
    "site_id VARCHAR(3) NOT NULL, \n" +
    "length_of_stay VARCHAR(255) NOT NULL, \n" +
    "PCS VARCHAR(255) NOT NULL, \n" +
    "first_night DATETIME NOT NULL, \n" +
    "last_night DATETIME NOT NULL, \n" +
    "PRIMARY KEY (reservation_id), \n" +
    "FOREIGN KEY (user_id) REFERENCES users(user_id), \n"+
    "FOREIGN KEY (site_id) REFERENCES sites(site_id) \n" +
    ");";

  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: reservations table created!")
    }
  });

  // Create transaction tables
  sql = "CREATE TABLE IF NOT EXISTS transactions (\n" +
    "transaction_id INT NOT NULL AUTO_INCREMENT, \n" +
    "transaction_date DATETIME NOT NULL, \n" +
    "transaction_amount DECIMAL(10,2) NOT NULL, \n" +
    "transaction_memo VARCHAR(255) NOt NULL, \n" +
    "PRIMARY KEY (transaction_id) \n" +
    ");";

  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: transactions table created!")
    }
  });
  //create intermediary table for transactions and reservation circular dependency
  sql = "CREATE TABLE IF NOT EXISTS reservation_transactions (\n" +
    "res_tran_id INT AUTO_INCREMENT,"+
    "reservation_id INT NOT NULL, \n" +
    "transaction_id INT NOT NULL, \n" +
    "PRIMARY KEY (res_tran_id), \n" +
    "FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id), \n" +
    "FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) \n" +
    ");";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: reservation_transactions table created!")
    }
  });

  createStoredProcedure()
}
//create stored procedures
function createStoredProcedure() {

  // register user procedure
// register user procedure
let sql = "CREATE PROCEDURE IF NOT EXISTS register_user (\n" +
    "IN username VARCHAR(255), \n" +
    "IN hashedPassword VARCHAR (255), \n" + 
    "IN salt VARCHAR (255), \n" +
    "IN role VARCHAR (6), \n" +
    "OUT result INT\n" +
    ")\n" +
    "BEGIN\n" +
    "DECLARE nCount INT DEFAULT 0;\n" +
    "SET result = 0;\n" +
    "SELECT COUNT (*) INTO nCount FROM users WHERE users.username = username;\n " +
    "IF nCount = 0 THEN\n" +
    "INSERT INTO users(username, hashedPassword, salt, role)\n" +
    "VALUES (username, hashedPassword, salt, role);\n" +
    "ELSE\n" +
    "SET result = 1;\n" +
    "END IF;\n" +
    "END;\n"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure register_user created!");
    }
  });

  // Get the salt for the password
  sql = "CREATE PROCEDURE IF NOT EXISTS `get_salt`(\n" +
    "IN username VARCHAR(255)\n" +
    ")\n" +
    "BEGIN\n" +
    "SELECT salt FROM users\n" +
    "WHERE users.username = username\n" +
    "LIMIT 1;\n" +
    "END;";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure get_salt created if it didn't exist");
    }
  });

  sql = "CREATE PROCEDURE IF NOT EXISTS `user_change_password`(\n" +
        "IN p_username VARCHAR(45),\n" +
        "IN p_new_hashed_password VARCHAR(255), \n" +
        "IN p_new_salt VARCHAR(255) \n" +
        ")\n" +
      "BEGIN\n" +
        "UPDATE users \n" +
        "SET hashedPassword = p_new_hashed_password, salt = p_new_salt \n" +
        "WHERE username = p_username; \n" +
        "\n" +
      "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure user_change_password created if it didn't exist");
      }
    });


  // Check credentials against the database
  sql = "CREATE PROCEDURE IF NOT EXISTS `check_credentials`(\n" +
    "IN username VARCHAR(255),\n" +
    "IN hashedPassword VARCHAR(255)\n" +
    ")\n" +
    "BEGIN\n" +
    "SELECT EXISTS(\n" +
    "SELECT * FROM users\n" +
    "WHERE users.username = username AND users.hashedPassword = hashedPassword\n" +
    ") AS result;\n" +
    "END;";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure check_credentials created if it didn't exist");
    }
  });

  sql = "CREATE PROCEDURE IF NOT EXISTS `check_sites`(\n"+
  ")\n"+
  "BEGIN\n"+
  "DECLARE count int DEFAULT 0;\n"+
  "SELECT COUNT(*) INTO count FROM sites;\n"+
  "IF count = 0 THEN \n"+
    "INSERT INTO sites(site_count, site_id, site_type, length, has_hookups, cost_per_night, is_available) \n"+
    "VALUES(1, '1', 'trailer', 50, 1, 25.00, 1),\n"+
    "(2, '2', 'trailer', 40, 1, 25.00, 1), (3, '3', 'trailer', 40, 1, 25.00, 1), (4, '4', 'trailer', 40, 1, 25.00, 1),\n"+
    "(5, '5', 'trailer', 40, 1, 25.00, 1), (6, '6', 'trailer', 40, 1, 25.00, 1), (7, '7', 'trailer', 40, 1, 25.00, 1), \n"+
    "(8, '8', 'trailer', 40, 1, 25.00, 1), (9, '9', 'trailer', 40, 1, 25.00, 1), (10, '10', 'trailer', 40, 1, 25.00, 1),\n"+
    "(11, '11', 'trailer', 40, 1, 25.00, 1), (46, '11B', 'A site with a trailer for rent', 40, 1, 30.00, 1), (12, '12', 'trailer', 40, 1, 25.00, 1),\n"+
    "(47, '12B', 'A site with a trailer for rent', 40, 1, 30.00, 1), (13, '13', 'trailer', 40, 1, 25.00, 1), (14, '14', 'trailer', 40, 1, 25.00, 1),\n"+
    "(15, '15', 'trailer', 40, 1, 0.00, 0), (16, '16', 'trailer', 40, 1, 25.00, 1), (17, '17', 'trailer', 43, 1, 25.00, 1),\n"+
    "(18, '18', 'trailer', 43, 1, 25.00, 1), (19, '19', 'trailer', 50, 1, 25.00, 1), (20, '20', 'trailer', 43, 1, 25.00, 1),\n"+
    "(21, '21', 'trailer', 50, 1, 25.00, 1), (22, '22', 'trailer', 43, 1, 25.00, 1), (23, '23', 'trailer', 43, 1, 25.00, 1),\n"+
    "(24, '24', 'trailer', 43, 1, 25.00, 1), (25, '25', 'trailer', 43, 1, 25.00, 1), (26, '26', 'trailer', 43, 1, 25.00, 1),\n"+
    "(27, '27', 'trailer', 43, 1, 25.00, 1), (28, '28', 'trailer', 43, 1, 25.00, 1), (29, '29', 'trailer', 43, 1, 25.00, 1),\n"+
    "(30, '30', 'trailer', 43, 1, 25.00, 1), (31, '31', 'trailer', 43, 1, 25.00, 1), (32, '32', 'trailer', 65, 1, 25.00, 1),\n"+
    "(33, '33', 'trailer', 65, 1, 25.00, 1), (34, '34', 'trailer', 65, 1, 25.00, 1), (35, '35', 'trailer', 65, 1, 25.00, 1),\n"+
    "(36, '36', 'trailer', 65, 1, 25.00, 1), (37, '37', 'trailer', 65, 1, 25.00, 1), (38, '38', 'trailer', 65, 1, 25.00, 1),\n"+
    "(39, '39', 'trailer', 65, 1, 25.00, 1), (40, '40', 'trailer', 65, 1, 25.00, 1), (41, '41', 'trailer', 65, 1, 25.00, 1),\n"+
    "(42, '42', 'trailer', 65, 1, 25.00, 1), (43, '43', 'trailer', 65, 1, 25.00, 1), (44, '44', 'trailer', 65, 1, 25.00, 1),\n"+
    "(45, '45', 'trailer', 65, 1, 25.00, 1), (48, 'tnt','Tent', 40, 1, 17.00, 1), (49, 'DA', 'Dry Storage', 50, 0, 5.00, 1),\n"+
    "(50, 'DB', 'Dry Storage', 50, 0, 5.00, 1), (51, 'DC', 'Dry Storage', 50, 0, 5.00, 1), (52, 'DD', 'Dry Storage', 50, 0, 5.00, 1);\n"+
  "END IF;\n"+
  "END;"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure check_sites created if it didn't exist");
    }
  });


  sql="SET GLOBAL event_scheduler = ON;\n"+
  "CREATE EVENT IF NOT EXISTS check_res_not_available\n"+
  "ON SCHEDULE AT CURDATE() + INTERVAL 1 MINUTE\n"+
  "DO\n"+
  "UPDATE sites\n"+
  "SET is_available = 0\n"+
  "WHERE site_id IN (\n"+
  "SELECT site_id FROM reservations WHERE CURDATE() BETWEEN first_night AND last_night);"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: EVENT check_res_not_available created if it didn't exist");
    }
  });

  "CREATE EVENT IF NOT EXISTS check_res_available\n"+
  "ON SCHEDULE AT CURDATE() + INTERVAL 1 MINUTE\n"+
  "DO\n"+
  "UPDATE sites\n"+
  "SET is_available = 1\n"+
  "WHERE is_available = 0 AND site_id IN (\n"+
  "SELECT site_id FROM reservations WHERE CURDATE() NOT BETWEEN first_night AND last_night);"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: EVENT check_res_available created if it didn't exist");
    }
  });


  // Insert personal data. used for adding personal data for new customers and updating current personal data for returning
  sql = "CREATE PROCEDURE IF NOT EXISTS `insert_personal_data` (\n" +
    "first VARCHAR(255), \n"+
    "last VARCHAR(255),\n"+
    "IN address_line_1 VARCHAR (255), \n" +
    "IN address_line_2 VARCHAR (255), \n" +
    "IN city VARCHAR (255), \n" +
    "IN state VARCHAR (50), \n" +
    "IN zip VARCHAR (20), \n" +
    "IN email_address VARCHAR (255), \n" +
    "IN \`rank\`  VARCHAR (255), \n" +
    "IN branch_of_service VARCHAR (255), \n" +
    "IN duty_status VARCHAR (255), \n" +
    "IN phone_number VARCHAR (255), \n" +
    "IN user_id INT,\n" +
    "OUT result INT\n" +
    ")\n " +
    "BEGIN\n" +
      "SET result = 0;\n" +
      "INSERT INTO personal_data(first_name, last_name, address_line_1, address_line_2, city, state, zip, email_address, _rank,"+
        "branch_of_service, duty_status, phone_number, user_id)\n" +
      "VALUES (first, last, address_line_1, address_line_2, city, state, zip, email_address, _rank, branch_of_service,"+
      "duty_status, phone_number, user_id);\n " +
      "SET result = 1;\n" +
    "END;\n";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure insert_personal_data created if it didn't exist");
    }
  });

  //check if a site is available for a date 
  sql = "CREATE PROCEDURE IF NOT EXISTS `check_avail`(\n"+
  "IN start DATETIME, \n"+
  "IN end DATETIME, \n"+
  "IN site VARCHAR(3), \n"+
  "OUT result INT)\n"+
  "BEGIN\n"+
  "DECLARE rcount int DEFAULT 0;\n"+
  "SELECT COUNT(*) INTO rcount FROM reservations WHERE ((first_night BETWEEN start AND end) OR (last_night BETWEEN start AND end)\n"+
  "OR (start BETWEEN first_night AND last_night) OR (end BETWEEN first_night AND last_night)) AND site_id = site;\n"+
  "IF rcount >= 1 THEN\n"+
  "SET result = 0;\n"+
  "ELSE\n"+
  "SET result=1;\n"+
  "END IF;\n"+
  "END;"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure check_avail created if it didn't exist");
    }
  });


  // Insert reservation. used for modifying and adding reservations
  // 0. checks that the site is available
  // 1. Inserts a reservation
  // 2. Gets the just inserted reservation_id into refres
  // 3. gets the site cost into siteCost from sites table using site_id
  // 4. Inserts into transaction 
  // 5. Gets the just inserted transaction_id into reftrans
  // 6. Inserts the refres and reftrans into the reservation_transactions table
  sql = "CREATE PROCEDURE IF NOT EXISTS insert_reservation (\n" +
    "IN site_id VARCHAR(3), \n" +
    "IN length_of_stay INT, \n" +
    "IN first_night DATETIME, \n" +
    "IN last_night DATETIME, \n" +
    "IN pcs VARCHAR (255), \n" +
    "IN user_id INT,\n" +
    "IN memo VARCHAR(255),\n"+
    "OUT result int \n"+
    ")\n" +
    "BEGIN\n"+
      "DECLARE refres INT DEFAULT 0;\n"+
      "DECLARE reftrans INT DEFAULT 0;\n"+
      "DECLARE siteCost INT DEFAULT 0; \n"+
      "DECLARE check1 INT DEFAULT 0;\n"+
      "SET result = 0;\n" +

      "SET first_night = date_add(first_night, INTERVAL 1 day);\n"+
      "SET last_night = date_add(last_night, INTERVAL 1 day);\n"+

      "CALL check_avail(first_night, last_night, site_id, @result);\n"+
      "SELECT @result INTO check1;\n"+

      "IF check1=1 THEN\n"+
          "SELECT cost_per_night INTO siteCost FROM sites WHERE sites.site_id = site_id;\n"+ 

          "INSERT INTO transactions(transaction_date, transaction_amount, transaction_memo)\n"+
          "VALUES (CURRENT_TIMESTAMP(), (length_of_stay * siteCost), memo);\n"+

          "SELECT LAST_INSERT_ID() INTO reftrans;\n"+

          "INSERT INTO reservations(site_id, length_of_stay, first_night, last_night, pcs, user_id)\n" +
          "VALUES (site_id, length_of_stay, first_night, last_night, pcs, user_id);\n" + 

          "SELECT LAST_INSERT_ID() INTO refres;\n"+

          "INSERT INTO reservation_transactions(reservation_id, transaction_id)\n"+
          "VALUES(refres, reftrans);\n"+

          "SET result = refres;\n" +
      "ELSE\n"+
          "SET result = 0;\n" +
      "END IF;\n"+
    "END;\n";

con.query(sql, function (err, results, fields) {
  if (err) {
    console.log(err.message)
    throw err;
  } else {
    console.log("database.js: procedure insert_reservation created if it didn't exist")
  }
});



//used to insert reservations without any checks
  sql = "CREATE PROCEDURE IF NOT EXISTS insert_reservation_unsafe (\n" +
    "IN site_id VARCHAR(3), \n" +
    "IN spot_type VARCHAR (255), \n" +
    "IN length_of_stay INT, \n" +
    "IN first_night DATETIME, \n" +
    "IN last_night DATETIME, \n" +
    "IN pcs VARCHAR (255), \n" +
    "IN user_id INT,\n" +
    "IN memo VARCHAR(255),\n"+
    "OUT result int \n"+
    ")\n" +
    "BEGIN\n"+
      "DECLARE refres INT DEFAULT 0;\n"+
      "DECLARE reftrans INT DEFAULT 0;\n"+
      "DECLARE siteCost INT DEFAULT 0; \n"+
      "SET result = 0;\n" +

      "SELECT cost_per_night INTO siteCost FROM sites WHERE sites.site_id = site_id;\n"+

      "INSERT INTO transactions(transaction_date, transaction_amount, transaction_memo)\n"+
      "VALUES (CURRENT_TIMESTAMP(), (length_of_stay * siteCost), memo);\n"+

      "SELECT LAST_INSERT_ID() INTO reftrans;\n"+

      "INSERT INTO reservations(site_id, spot_type, length_of_stay, first_night, last_night, pcs, user_id)\n" +
      "VALUES (site_id, spot_type, length_of_stay, first_night, last_night, pcs, user_id);\n" +
      
      "SELECT LAST_INSERT_ID() INTO refres;\n"+

      "INSERT INTO reservation_transactions(reservation_id, transaction_id)\n"+
      "VALUES(refres, reftrans);\n"+

      "SET result = 1;\n" +
    "END;\n";


  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure insert_reservation_unsafe created if it didn't exist")
    }
  });






  sql = "CREATE PROCEDURE IF NOT EXISTS update_site (\n" +
    "IN site_id INT, \n" +
    "IN has_hookups TINYINT(1), \n" +
    "IN cost_per_night DECIMAL(10, 2), \n" +
    "IN is_Available TINYINT(1) \n" +
    ")\n" +
    "BEGIN\n" +
    "UPDATE sites\n" +
    "SET has_hookups = has_hookups, \n" +
    "cost_per_night = cost_per_night, \n" +
    "is_available = is_available\n" +
    "WHERE site_id = site_id;\n" +
    "END;\n";
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure update_site created if it didn't exist")
    }
  });


  sql= "CREATE PROCEDURE IF NOT EXISTS `get_up_reservations`(\n"+
    ")\n" +
    "BEGIN\n"+
    "SELECT * FROM reservations WHERE last_night >= CURDATE();\n"+
    "END;\n";
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_up_reservations created if it didn't exist")
    }
  });

  
  sql= "CREATE PROCEDURE IF NOT EXISTS `get_avail_trailer`(\n"+
    ")\n" +
  "BEGIN\n"+
  "SELECT * FROM sites WHERE is_available = 1 AND site_id NOT IN ('12B', '11B', 'tnt');\n"+
  "END;\n";
  
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure insert_reservation created if it didn't exist")
    }

    //insertDummyData();

  });

  sql= "CREATE PROCEDURE IF NOT EXISTS `get_avail_tent`(\n"+
    ")\n" +
  "BEGIN\n"+
  "SELECT * FROM sites WHERE site_id = 'tnt' AND is_available = 1;\n"+
  "END;\n";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_avail_tent created if it didn't exist")
    }
  });

  /* Dry site (hookups = 0) */
  sql= "CREATE PROCEDURE IF NOT EXISTS `get_avail_dry`(\n"+
    ")\n" +
  "BEGIN\n"+
  "SELECT * FROM sites WHERE has_hookups = 0 AND is_available = 1;\n"+
  "END;\n";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_avail_dry created if it didn't exist")
    }
  });

  /* Get available rent trailers (site_id = 11B or 12B) */
  sql= "CREATE PROCEDURE IF NOT EXISTS `get_avail_rent_trailer`(\n"+
  ")\n"+
  "BEGIN\n"+
  "SELECT * FROM sites WHERE is_available = 1 AND site_id IN ('11B', '12B');\n"+
  "END;\n";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_avail_rent_trailer created if it didn't exist")
    }
  });
 
  sql= "CREATE PROCEDURE IF NOT EXISTS `get_res_details`(\n"+
  "IN reservationID INT\n"+
  ")\n" +
  "BEGIN\n"+
  "SELECT * FROM reservations WHERE reservation_id = reservationID;\n"+
  "END;";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_res_details created if it didn't exist")
    }
  });

  sql= "CREATE PROCEDURE IF NOT EXISTS `get_res_by_date`(\n"+
  "IN start_date DATE,\n"+
  "IN end_date DATE\n"+
  ")\n" +
  "BEGIN\n"+
  "SELECT * FROM reservations WHERE first_night >= start_date AND last_night <= end_date;\n"+
  "END;\n";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_res_by_date created if it didn't exist")
    }
  });
 
  sql= "CREATE PROCEDURE IF NOT EXISTS `get_res_by_username`(\n"+
  "IN username VARCHAR(255)\n"+
  ")\n"+
  "BEGIN\n"+
  "SELECT * FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE username = username LIMIT 1);\n"+
  "END;\n";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_res_by_username created if it didn't exist")
    }
  });
 
  sql= "CREATE PROCEDURE IF NOT EXISTS `get_res_by_site`(\n"+
  "IN r_site_id VARCHAR(3)\n"+
  ")\n"+
  "BEGIN\n"+
  "SELECT * FROM reservations WHERE site_id = r_site_id;\n"+
  "END;\n";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_res_by_site created if it didn't exist")
    }
  });

  sql="CREATE PROCEDURE IF NOT EXISTS `get_trailer_size`(\n"+
  "IN size INT)\n"+
  "BEGIN\n"+
  "SELECT length FROM sites\n"+
  "WHERE is_available=1 \n"+
  "GROUP BY length\n"+
  "ORDER BY ABS(size-length) asc limit 2;\n"+
  "END;"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_trailer_size created if it didn't exist")
    }
  });

  sql="CREATE PROCEDURE IF NOT EXISTS `get_site_by_size`(\n"+
  "IN size1 INT,\n"+
  "IN size2 INT\n"+
  ")\n"+
  "BEGIN\n"+
    "IF size1 < size2 THEN\n"+
      "SELECT *\n"+
      "FROM sites\n"+
      "WHERE (is_available=1 AND (length BETWEEN size1 AND size2)) OR (is_available=1 AND site_id IN ('11B', '12B', 'DA', 'DB', 'DC', 'DD'))\n"+
      "ORDER BY site_count;\n"+
    "ELSE\n"+
      "SELECT *\n"+
      "FROM sites\n"+
      "WHERE (is_available=1 AND (length BETWEEN size2 AND size1)) OR (is_available=1 AND site_id IN ('11B', '12B', 'DA', 'DB', 'DC', 'DD'))\n"+
      "ORDER BY site_count;\n"+
    "END IF;\n"+
  "END;"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_site_by_size created if it didn't exist")
    }
  });


  //get user by username

  sql="CREATE PROCEDURE IF NOT EXISTS `get_by_username`(\n"+
  "IN username VARCHAR(255)\n"+
  ")\n"+
  "BEGIN\n"+
  "SELECT user_id FROM users u WHERE u.username= username;\n"+
  "END;";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_by_username created if it didn't exist")
    }
  });

  sql="CREATE PROCEDURE IF NOT EXISTS `get_occupancy`()\n"+
  "BEGIN\n"+
  "SELECT p.last_name, site_id, first_night, last_night\n"+
  "FROM reservations r\n"+
  "JOIN personal_data p ON p.personal_id = r.user_id\n"+
  "WHERE current_timestamp() < first_night OR current_timestamp() BETWEEN first_night AND last_night;\n"+
  "END;"

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_occupancy created if it didn't exist")
    }
  });


  sql="CREATE PROCEDURE IF NOT EXISTS `get_vacancy`()\n"+
  "BEGIN\n"+
	  "SELECT site_count, s.site_id, first_night AS Vacant, s.has_hookups, cost_per_night\n"+
    "FROM reservations r\n"+
    "JOIN sites s ON s.site_id = r.site_id\n"+
    "WHERE s.site_id IN (\n"+
    "SELECT site_id\n"+
    "FROM sites\n"+
    "WHERE is_available=1)\n"+
    "AND datediff(first_night, curdate()) >0\n"+
    "UNION\n"+
    "SELECT site_count, site_id, date_add(curdate(), INTERVAL 7 Month) AS Vacant, has_hookups, cost_per_night\n"+
    "FROM sites\n"+
    "WHERE site_id NOT IN (SELECT site_id FROM reservations)\n"+
    "ORDER BY site_count;\n"+
    "END;"
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_vacancy created if it didn't exist")
    }
  });


  sql="CREATE PROCEDURE IF NOT EXISTS `get_site_details`(\n"+
  "IN site VARCHAR(3)\n"+
  ")\n"+
  "BEGIN\n"+
  "   SELECT site_id, site_type, length, has_hookups, cost_per_night, is_available \n"+
  "   FROM sites WHERE site_id = site;\n"+
  "END;"
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message)
      throw err;
    } else {
      console.log("database.js: procedure get_site_details created if it didn't exist")
    }
  });

  InsertData()
}

function InsertData(){

  // 
  sql="CALL check_sites();"
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: Called check_sites")
    }
  });


  // sql = "CALL register_user('user1', 'gbreb', 'saltfr', 'ude', @result); SELECT @result as result;";
  // con.query(sql, function(err,rows){
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   }
  //     console.log("database.js: Added 'user1' to ")
  // });

  // sql = "CALL register_user('user14', 'hash', 'salttoko', 'idl', @result); SELECT @result as result;";
  // con.query(sql, function(err,rows){
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   }
  //     console.log("database.js: Added 'user2' to ")
  // });

  // sql = "CALL insert_personal_data('Cletus', 'Thompson', '485 delano ln', 'apt 3', 'ogden', 'ut', '84402', 'fekgfr@gmail.cim', 'cpl', 'marines', 'active', '619-344-4589', '1', @result)";
  // con.query(sql, function(err,rows){
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   }
  //     console.log("database.js: Added 'user1 personal data' to ")
  // });

  // sql = "CALL insert_personal_data('David', 'Wright', '499 Ronaldo Dr', 'apt 4', 'ogden', 'ut', '84402', 'lokol@gmail.cim', 'sgt', 'army', 'active', '431-562-9876', '2', @result)";
  // con.query(sql, function(err,rows){
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   }
  //     console.log("database.js: Added 'user14 personal data' to ")
  // });

  sql="SELECT COUNT(*) from users WHERE username='ScottFamCamp';"
  con.query(sql, function(err, rows){
    if(err){
      throw err;
    }
    else{
      console.log("Number of accounts for Scott", rows[0]['COUNT(*)'])
      if(rows[0]['COUNT(*)']== 0){
        let sql="CALL register_user(?, ?, ?, ?, @result); SELECT @result;"
        //username, hash, salt, role, result
        con.query(sql, ['ScottFamCamp', 'be5298c31aa167b451560f812e1825fe74da92dea4936e800f4c8bc1c1e89296', 'cf291bb8ed7b56d90697d8c971ab7166', 'admin' ], function(err, res){
          if(err){
            throw err;
          }
          else{
            if(res[1][0]['@result']==1){
              console.log(res[1])
              console.log("Success creating Admin!")
            }
            else if(res[1][0]['@result']!==1){
              console.log(res[1])
              console.log("Failed to insert Admin Account");
            }
          }
        }); //end inner query to insert Admin
      }
      else{
        console.log("Scott Admin account (role 1) already exists");
      }
    }
  });


  // sql = "CALL insert_reservation('1', '1', '2025-01-20', '2025-02-03', 'No', '1', '1', @result)";
  // con.query(sql, function(err,rows){
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   }
  //     console.log("database.js: Added 'reservation1' to reservations");
  //   });

  //   sql = "CALL insert_reservation('2', '2', '2025-03-20', '2025-04-03', 'In', '2', '2', @result)";
  //   con.query(sql, function(err,rows){
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //       console.log("database.js: Added 'reservation2' to reservations");
  //     });

  // sql = "CALL get_res_by_site('1')";
  // con.query(sql, function(err,rows){
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   }
  //     console.log("database.js: Results from 'get_res_by_site':");
  //     console.log(rows);
  //   });

}

module.exports = con;