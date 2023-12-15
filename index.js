const fs = require('fs');
const oracledb = require('oracledb');
const dbConfig = require('./configs.js');
const { pipeline } = require('stream');


  

  
 

async function getSmsData(id) {

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
 
    const result = await connection.execute(
      `declare
      inowner         varchar2(88);
      intype          varchar2(88);
      inname          varchar2(88);
        dmh     number;
        ddltext clob;
      begin
        inowner := 'MS';
        intype := 'TABLE';
        inname := 'MAILLOG';
      
        dbms_lob.createtemporary(ddltext, true);
        dmh := dbms_metadata.open('TABLE');
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'STORAGE',FALSE);
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'TABLESPACE',FALSE);
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'PRETTY',true);
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'SQLTERMINATOR',true);
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'FORCE',false);
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'CONSTRAINTS_AS_ALTER',true);
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'SEGMENT_ATTRIBUTES',FALSE);
        dbms_metadata.set_transform_param(dbms_metadata.session_transform,'REMAP_SCHEMA', inowner , NULL);
      
            begin
              dbms_lob.append(ddltext, dbms_metadata.get_ddl(object_type => replace(intype,' ','_'),name        => upper(inname),schema      => upper(inowner)));
            exception
              when others then
                dbms_lob.append(ddltext, sqlerrm);
            end;
        dbms_metadata.close(dmh);
      --  dbms_output.put_line(ddltext); 
        :retval := ddltext;

      end;`,
      {
       
        retval : { dir: oracledb.BIND_OUT, type: oracledb.CLOB},        
       
      });

    //console.log(result.outBinds);

    console.log(result.outBinds.retval.length);

    const clobOutFileName2 = 'out.txt';

    const doStream = new Promise((resolve, reject) => {

        const clob2 = result.outBinds.retval;
        if (clob2 === null) {
          throw new Error('db didnt return ddl text ');
        }
    
        // Stream the LOB to a file
        console.log('   Writing to ' + clobOutFileName2);
        clob2.setEncoding('utf8');  // set the encoding so we get a 'string' not a 'buffer'
        clob2.on('error', (err) => {
          // console.log("clob2.on 'error' event");
          reject (err);
        });
        clob2.on('end', () => {
          // console.log("clob2.on 'end' event");
          clob2.destroy();
        });
        clob2.on('close', () => {
          // console.log("clob2.on 'close' event");
          resolve();
        });
    
        const outStream = fs.createWriteStream(clobOutFileName2);
        outStream.on('error', (err) => {
          // console.log("outStream.on 'error' event");
          clob2.destroy(err);
        });
    
        // Switch into flowing mode and push the LOB to the file
        
         
         
         clob2.pipe(outStream);
         outStream.write('/ -- son satır');

         console.log('in pipe')
       
        
        
        //outStream.append('/ -- son satır',);
      });
    
      await doStream;
      console.log ("   Completed");
    
    

  } catch (err) {
    console.error(err);
   
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
 
 


let res ;
let i=0;
 

async function mainops(){

  
    getSmsData(4) ;
   

}

mainops();