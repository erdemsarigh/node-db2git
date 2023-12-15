
module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "ms",
    password      :  process.env.NODE_ORACLEDB_PASS ||"mspass",
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "COMPILEDEV",
    externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,   

  };
  