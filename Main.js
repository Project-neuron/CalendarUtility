
// Adding a database to the application to further help with data persistance 
// Using Google cloud platform to do so
function dbconnect(){
  var db = new DatabaseUtil();
}


// function that removes all the complete tasks as per status from the spread sheet 
function removeComplete(){
  var inputSheet = new sheet(0);
  var UISheet = new sheet(1); 
  var list = new TaskList();
  list.pullAlltasks(UISheet); 
  list.clearAllTasks(UISheet);
  list.removeComplete();
  list.setTasks(UISheet);
  
  
}

// Function that references the calendar to remove tasks that have already been done from 
// the spreadsheet
function getAllCompletedTasks(){
   var UISheet = new sheet(1);
   var list = new TaskList(); 
   var calUtil = new CalendarUtility();
   list.pullAlltasks(UISheet); 
   calUtil.removeCompletedTasks(list) 
   list.clearAllTasks(UISheet); 
   list.removeComplete(); 
   list.setTasks(UISheet);
   
}



// A life cycle function that watches for changes on the sheet 
// used to execute functions from the mobile platform as custom menu items do not show up on mobile 
// use key words that are the same name as the functions listed here to execute functions 
function onEdit(e) {
  if (e.range.getA1Notation() == 'I3') {
    if (/^\w+$/.test(e.value)) {        
      eval(e.value)();
      e.range.clear();
    }
  }
}

 


function assignDropDowns(){
  var dropDownSheet = new sheet(2).getActiveSheet(); 
  var FormDropDown = new FormDropDownUtil();
 
 var dropDownTitles = dropDownSheet.getRange(1,1,1,dropDownSheet.getLastColumn()).getValues()[0]; 
  dropDownTitles.forEach(function(label, i){  
         Logger.log(label);
         var dropDownValues = dropDownSheet.getRange(2,i + 1,dropDownSheet.getLastRow()-1,1)  
                             .getValues() 
                             .map(function(o){return o[0]})  
                             .filter(function(o){ return o !== ""});  
         
        var dropDownID = FormDropDown.getDropDown(label); 
        FormDropDown.assignDropDownValues(dropDownID, dropDownValues); 
                             
                             
  }); 
    
  
  
  
} 

// Adds new tasks from the form input sheet to the main task list, formatting them as they are added

function addNewTasks(){
  var inputSheet = new sheet(0);
  var UISheet = new sheet(1);
  var taskList = new TaskList();
  taskList.addNewTasks(inputSheet);
  taskList.pullAlltasks(UISheet) 
  taskList.removeComplete();
  taskList.setTasks(UISheet); 
  assignDropDowns();
  

  
} 

// function that adds the new tasks to the calendar 
function setTasksToCalendar(){
  var inputSheet = new sheet(0);
  var UISheet = new sheet(1);
  var taskList = new TaskList();
  var row = 3;
  taskList.pullAlltasks(UISheet)
  var calUtil = new CalendarUtility();
  for(var i = 0; i < taskList.list.length; i++){
      var isUnScheduled = taskList.list[i].getStatus() == "unscheduled"
      if(isUnScheduled){ 
        taskList.setTaskStatus(UISheet,i);
        calUtil.findAndInsert(taskList.list[i]);
        
       }
  } 
  
}


   
// function that creates the custom menu items to launch the functions from the PC 
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Tasks Updator')
      .addItem('add new tasks', 'menuItem1')
      .addSeparator()
      .addItem('Add tasks to Calendar', 'menuItem2')
      .addToUi();
      addNewTasks();
}

function menuItem1() {
  addNewTasks();
     
}

function menuItem2() {
  setTasksToCalendar()
  
}






