// This is the database hosted on Google cloud platform 
// this will handle all the interfacing with the database once it is complete 
// Will be migrating the persistance storage of the task information from the sheets to the DB 
DatabaseUtil = function(){ 
    var address = '';
    var user = '';
    var userPwd = '';
    var db = '';
    var msSqlUrlSyntax ='jdbc:mysql://'

    var dbUrl = msSqlUrlSyntax + address + '/' + db;

    // msSqlUrlSyntax = 'youOptionalTestingQuery'
    var conn = Jdbc.getConnection(dbUrl, user, userPwd) 
    conn.isClosed();
}