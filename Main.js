 
// A utility that does datetime calculations 

DateUtility = function(){
  this.addMinutes = function addMinutes(date, minutes) {
    return new Date(date.getTime() + (minutes*60000));
  }
  this.addHours = function(dateIn, hours){ 
   var date = new Date(date.getTime() + (hours*60*60*1000));
   return date
    
  }
  this.addDays = function(days){
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date;
    
    } 
  this.subtractDays = function(days){
    var date = new Date(); 
     date.setDate(date.getDate() - days);
     return date;
    
    
  }
  
   
   this.calTimeDiff = function(earlyDateTime, lateDateTime){
     return lateDateTime - earlyDateTime; 
   }
   
  
  

}
function dhm(ms){
    days = Math.floor(ms / (24*60*60*1000));
//    daysms=ms % (24*60*60*1000);
//    hours = Math.floor((daysms)/(60*60*1000));
//    hoursms=ms % (60*60*1000);
//    minutes = Math.floor((hoursms)/(60*1000));
//    minutesms=ms % (60*1000);
//    sec = Math.floor((minutesms)/(1000));
    return days + 1
}

// A google sheets utility that handles the API for google sheets that I am 
// currently using as a data store for the application 
sheet = function(index){
   this.app = SpreadsheetApp;
   this.sheets = this.app.getActiveSpreadsheet().getSheets();
   this.activeSheet = this.sheets[index];
   
   this.changeSheet = function(index){
     return this.sheets[index]
   }
   
   this.getItem = function(row, column){
     return this.activeSheet.getRange(row, column).getValue();
   }
   
   this.setItem = function(row, column, setting){
     this.activeSheet.getRange(row, column).setValue(setting);
   }
   
   this.getActiveSheet = function(){
     return this.activeSheet;
   }

}



// A task class that handles the creation of the task item 
// this allows manipulations on each task item 
task = function(mainCat, secCat, taskName, dueDate, taskPriority, taskDesc, duration) {
  this.mainCat = mainCat; 
  this.secCat = secCat; 
  this.dueDate = dueDate; 
  this.daysTillDue; 
  this.taskPriority = taskPriority
  this.taskDesc = taskDesc
  this.status = "unscheduled";
  this.duration = duration
  this.priority = taskPriority;
  this.taskName = taskName;
  
  this.setDaysTillDue = function(){
    if(this.dueDate != ''){
      var today = new Date(); 
      var dateDifference = this.dueDate - today;
      this.daysTillDue = dhm(dateDifference);
    }
  }
  this.getCat = function(){
    return this.mainCat;
  }
  this.getSecCat = function(){
    return this.secCat;
  }
  this.getTaskDescription = function(){
    return this.taskDesc;
  }
  this.getDueDate = function(){
    return this.dueDate;
  }
  this.getDaysTillDue = function(){
    return this.daysTillDue;
  }
  
  this.getStatus = function(){
    return this.status;
  }
  
  this.setStatus = function(statusIn){
    this.status = statusIn;
  }
  
  this.getPriority = function(){
    return this.priority;
  }
  
  this.getDuration = function(){
    return this.duration;
  }
  
  this.getTaskName = function(){
    return this.taskName;
  }
  
}

// Selection sort that I use to sort the tasks by priority
function sort(array){
  for(var i = 0; i < array.length; i++){
    //set min to the current iteration of i
    var min = i;
    for(var j = i+1; j < array.length; j++){
      if(array[j].getPriority() > array[min].getPriority()){
       min = j;
      }
    }
    var temp = array[i];
    array[i] = array[min];
    array[min] = temp;
  }
  return array;
};

// A  google calendar utility that handles the manipulation of adding the 
// the tasks to the google calendar 

CalendarUtility = function(){
  this.cal = CalendarApp.getCalendarById('calendar app key'); 
  
  this.isEnd2BeforeEnd1 = function(firstIndex, secondIndex, allEvents){
      var dateUtil = new DateUtility(); 
      var event1 = allEvents[firstIndex];
      var event2 = allEvents[secondIndex];
      var endTime1 = event1.getEndTime(); 
      var endTime2 = event2.getEndTime(); 
      var diff = dateUtil.calTimeDiff(endTime1, endTime2);
      return diff < 0
  }
  
  this.convertTaskDurationToTime = function(task, startTime){
      var durStr = task.getDuration();
      var endStr = durStr.indexOf(" ");
      var num = parseInt(durStr.slice(0, endStr), 10); 
      var timeAmount = durStr.slice(endStr+1,durStr.length);
      var eventTime = new Date();
      if(timeAmount.indexOf("hour") !== -1){
         eventTime.setDate(startTime.getDate()); 
         var hours = startTime.getHours() + num;
         eventTime.setHours(hours,00)
            
      }else{
         eventTime.setDate(startTime.getDate());
         eventTime.setHours(startTime.getHours());
         eventTime.setMinutes(startTime.getMinutes() + num,00);
                  
      }
      return eventTime
      
    
  
  }
  this.isDiffBetweenEnd1AndStart2EnoughToInsert = function(firstIndex, secondIndex, allEvents, task){
      var dateUtil = new DateUtility(); 
      var event1 = allEvents[firstIndex];
      var event2 = allEvents[secondIndex];
      var startTime2 = event2.getStartTime(); 
      var endTime1 = event1.getEndTime();
      var insDiff = dateUtil.calTimeDiff(endTime1, this.convertTaskDurationToTime(task, endTime1));
      var currDiff = dateUtil.calTimeDiff(endTime1, startTime2);
      return currDiff > insDiff;
              
  }
  
  this.insertNewEvent = function(task,firstIndex, secondIndex,allEvents, cal){
     var event1 = allEvents[firstIndex];
     var event2 = allEvents[secondIndex];
     var startTime2 = event2.getStartTime(); 
     var endTime1 = event1.getEndTime();
     var title = "[" + task.getCat() + " : " + task.getSecCat() + " | " + task.getTaskName() + "]";
     var secondTime = this.convertTaskDurationToTime(task, endTime1);
     cal.createEvent(title, endTime1, secondTime, {description: task.getTaskDescription() })
  }
  
  this.insertNewEventByTime = function(task, endTime, cal){
     var title = "[" + task.getCat() + " : " + task.getSecCat() + " | " + task.getTaskName() + "]";
     var secondTime = this.convertTaskDurationToTime(task, endTime);
     cal.createEvent(title, endTime, secondTime, {description: task.getTaskDescription() })
     
  }
  
  this.generateTaskName = function(task){
    var title = "[" + task.getCat() + " : " + task.getSecCat() + " | " + task.getTaskName() + "]";
    return title;
  }
  
  this.setColorAndReminders = function(start, end){ 
      var allEvents = this.cal.getEvents(start, end); 
  
  for(var i = 0; i < allEvents.length; i++){
        var event = allEvents[i];
        var title = event.getTitle();
        var colnPos = title.indexOf(':');
        var mainCat = title.substring(1, colnPos); 
        var color = event.getColor();
        if(color == "1" || color == ""){
       
            if(mainCat.indexOf("Career") !== -1)
              event.setColor("8");
            else if(mainCat.indexOf('House') !== -1)
                event.setColor("3");
            else if (mainCat.indexOf('Purchase') !== -1)
              event.setColor("2");
            else if (mainCat.indexOf('Personal')!== -1)
              event.setColor("11");
            else if(mainCat.indexOf('Finance')!== -1)
              event.setColor("10");
            else if(mainCat.indexOf('Work')!== -1)
               event.setColor("9");
            else if (mainCat.indexOf('Social')!== -1) 
              event.setColor('4') 
             else if(mainCat.indexOf('Career')!==-1) 
               event.setColor("8")
              
            event.removeAllReminders();
            event.addPopupReminder(5); 
            event.addPopupReminder(10);
            event.addPopupReminder(15); 
         }
      }
     
      
  }
  
  // A google sheets function that removes completed tasks from the google sheets
  this.removeCompletedTasks = function(taskList){ 
    var dateUtil = new DateUtility(); 
    var startOfWeek = dateUtil.subtractDays(7); 
    var endOfWeek = new Date() 
    var tasks = taskList.getList();
    var allWeeklyEvents = this.cal.getEvents(startOfWeek, endOfWeek); 
    for(var i = 0; i < tasks.length; i++){ 
       var task = tasks[i];  
       var taskName = task.getTaskName()
       for(var j = 0; j < allWeeklyEvents.length; j++){ 
           var event = allWeeklyEvents[j];  
           var eventTitle = event.getTitle(); 
           var result = event.getTitle().indexOf(task.getTaskName());
           if(event.getTitle().indexOf(task.getTaskName())!==-1){
               task.setStatus('complete') 
               break;
           } 
       
       } 
        
    }
    
    
  
    
    
  }
  
  // a google sheets function that bunches all events that have the same primary and 
  // secondary category into a task bunch in the google calendar where rather than making 
  // two tasks it puts the tasks together and adds the details of both 
    this.bunchLikeTasks = function(task, start, end){ 
      var isInserted = false;
      var allEvents = this.cal.getEvents(start, end); 
      for(var i = 0; i<allEvents.length; i++){
          var title = task.getCat() + " : " + task.getSecCat(); 
          var event = allEvents[i];
          
          if (event.getTitle().indexOf(title) !== -1){
             var eventTitle = event.getTitle(); 
             event.setTitle(title + " | " + "Task Bunch") 
             var eventDescription = event.getDescription(); 
             var newTaskTitle = "[" + task.getCat() + " : " + task.getSecCat() + " | " + task.getTaskName() + "]";
             var oldStartTime = event.getStartTime(); 
             event.setDescription(eventDescription + "\n" + newTaskTitle + "\n" + task.getTaskDescription()) 
             var newEndTime = this.convertTaskDurationToTime(task, event.getEndTime());
             event.setTime(oldStartTime, newEndTime); 
             isInserted = true; 
             break;
          }
      }
      
     return isInserted;  
  }
  

// function that finds a place to add the new tasks in the calendar  
  this.findAndInsert = function(task){
      var inserted = false;
      var dateUtil = new DateUtility();
      var numDays = 1;
      while(inserted == false){
          var start = dateUtil.addDays(numDays);
          var end = dateUtil.addDays(numDays);
          if(task.getDueDate() != ""){
              var date = task.getDueDate();
              start.setDate(date.getDate());
              end.setDate(date.getDate());
          }
          start.setHours(8,00,00);
          end.setHours(23,00,00);
          var numEvents = this.cal.getEvents(start, end).length;
          var allEvents =  this.cal.getEvents(start, end); 
          var firstIndex = 0;
          var secondIndex = 1; 
          var bunched = false;
          while(firstIndex != numEvents && secondIndex != numEvents && numEvents < 12){
              if(this.isEnd2BeforeEnd1(firstIndex, secondIndex, allEvents)){
                 secondIndex++;
              }
              else if(this.isDiffBetweenEnd1AndStart2EnoughToInsert(firstIndex, secondIndex, allEvents, task)){ 
                 bunched = this.bunchLikeTasks(task,start, end) 
                if(bunched == false){
                  this.insertNewEvent(task,firstIndex, secondIndex,allEvents, this.cal)
                  inserted = true;
                  break; 
                }  
                inserted = true;
                break;
              }else{
                firstIndex = secondIndex; 
                secondIndex++;
              }
         }
         if(inserted == false){
             var lastEvent = allEvents[numEvents-1]; 
             var endTime = lastEvent.getEndTime(); 
             if(endTime < end && numEvents < 12){ 
                 bunched = this.bunchLikeTasks(task,start, end) 
                 if(bunched == false){
                  this.insertNewEvent(task,firstIndex, secondIndex,allEvents, this.cal)
                  inserted = true;
                } 
                inserted = true;
                 
             }
         } 
         this.setColorAndReminders(start, end);
         numDays++;
         
      }
        


  } 
  
 
  
}

// A Google sheets utility that handles the transfer from the google form sheet 
// to the tasklist sheets
TaskList = function(){
  // the list that contains all the tasks when they are imported and created 

  this.list = []
  
  // this function takes all the new tasks from the google form and creates task objects from them 
  // then sorts the tasks by priority
  this.addNewTasks = function(sheet){
    var form = FormApp.openByUrl("form key");
    var formResponses = form.getResponses();
    if(formResponses.length > 0){
      for (var i = 0; i < formResponses.length; i++) {
          var formResponse = formResponses[i];
          var itemResponses = formResponse.getItemResponses();
          var mainCategory = itemResponses[0].getResponse();
          var secCategory = itemResponses[1].getResponse();
          var taskName = itemResponses[2].getResponse();
          var inputDate = itemResponses[3].getResponse();
          var parts =inputDate.split('-');
          var taskDueDate = new Date(parts[0], parts[1] - 1, parts[2]);
          var taskPriority = itemResponses[4].getResponse();
          var taskDescription = itemResponses[5].getResponse();
          var taskDuration =  itemResponses[6].getResponse();
          
          var newTask = new task(mainCategory, secCategory, taskName, inputDate, taskPriority, taskDescription, taskDuration);
          //newTask.setDaysTillDue();
          this.list.push(newTask);
         var responseId = formResponse.getId()
         form.deleteResponse(responseId)
          
      }
      sort(this.list);
    }
  
  } 
  
  this.getList = function(){
    return this.list;
  }
  
  
  // clears all the task items from the google sheet 
  this.clearAllTasks = function(sheet, row, column){
    var row = 3; 
    var column = 1;
    while(sheet.getItem(row,column) != ""){
        sheet.setItem(row,column, "");
        column ++;
        sheet.setItem(row,column,"");
        column ++;
        sheet.setItem(row,column, "");
        column ++;
        sheet.setItem(row,column, "");
        column ++;
        sheet.setItem(row,column, "");
        column ++;
        sheet.setItem(row,column, "");
        column++;
        sheet.setItem(row,column, "");
        column++;
        sheet.setItem(row,column, "");
        row ++;
        column=1;
      }
  
  }
  
  // sets the individual task in the google sheet
  this.setTask = function(sheet, task, row ,column){
      sheet.setItem(row,column, task.getClass());
      column ++;
      sheet.setItem(row,column, task.getTaskName());
      column ++;
      sheet.setItem(row,column, task.getTaskDescription());
      column ++;
      sheet.setItem(row,column, task.getDueDate());
      column ++;
      sheet.setItem(row,column, task.getDaysTillDue());
      column ++;
      sheet.setItem(row,column, task.getStatus());
      
  }
  
  // pulls all the tasks from google sheet recreates the task object 
  this.pullAlltasks = function(sheet){
    var row = 3; 
    var column = 1;
    while(sheet.getItem(row,column)!= ""){
      var mainCat = sheet.getItem(row,column);
      column ++;
      var secCat = sheet.getItem(row,column);
      column ++;
      var taskName = sheet.getItem(row,column);
      column ++;
      var taskDueDate = sheet.getItem(row,column);
      column ++;
      var taskPriority = sheet.getItem(row,column);
      column ++;
      var taskDesc = sheet.getItem(row,column);
      column++;
      var dur = sheet.getItem(row,column);
      column++;
      var status = sheet.getItem(row,column);
      column++;
      
      var newTask = new task(mainCat, secCat, taskName, taskDueDate, taskPriority, taskDesc, dur);
      newTask.setStatus(status)
//      if(newTask.getStatus() == "completed" || newTask.getStatus() == "cancelled" ){
//        this.clearTask(sheet,row, column)
//       }
       
      this.list.push(newTask);
      row ++;
      column=1;
    }
    sort(this.list);
  }
  
  
  // sets all the tasks within the google sheet 
  this.setTasks = function(sheet){
    var row = 3; 
    var column = 1;
    var index = 0;
    while(index < this.list.length){
      sheet.setItem(row,column, this.list[index].getCat());
      column ++;
      sheet.setItem(row,column, this.list[index].getSecCat());
      column ++;
      sheet.setItem(row,column, this.list[index].getTaskName());
      column ++;
      
      sheet.setItem(row,column, this.list[index].getDueDate());
      column ++;
      
      sheet.setItem(row,column, this.list[index].getPriority());
      column ++;
      
      sheet.setItem(row,column, this.list[index].getTaskDescription());
      column++; 
      
      sheet.setItem(row,column, this.list[index].getDuration());
      column++;
      sheet.setItem(row,column, this.list[index].getStatus());
      column++;
      
      column=1;
      index ++;
      row++;
    }
    
  }
  
  // sets the task status as complete unscheduled or scheduled 
  this.setTaskStatus = function(sheet, row){
    var column = 8; 
    sheet.setItem(row+3,column,'scheduled');
    
    
  
  }
  
  // removes all the completed tasks from the task list 
  this.removeComplete = function(){
    var index = 0; 
    var newList = this.list.filter(function(element, index, arr){

    return element.getStatus() !== 'complete';  
    }) 
    this.list = newList;
      
   }
} 

// a google sheet custom function that removes completed tasks 

function removeComplete(){
  var inputSheet = new sheet(0);
  var UISheet = new sheet(1); 
  var list = new TaskList();
  list.pullAlltasks(UISheet); 
  list.clearAllTasks(UISheet);
  list.removeComplete();
  list.setTasks(UISheet);
  
  
}

// a google sheets custom function that manipulates the sheets  
// to remove the completed tasks 
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



// life cycle function that allows for the use of the functions 
// on mobile as the custom menu items don't work on the sheets app 
function onEdit(e) {
  if (e.range.getA1Notation() == 'I3') {
    if (/^\w+$/.test(e.value)) {        
      eval(e.value)();
      e.range.clear();
    }
  }
}

 
// sheets function that gets all new tasks from the form and moves them to the 
// main sheet   
function addNewTasks(){
  var inputSheet = new sheet(0);
  var UISheet = new sheet(1);
  var taskList = new TaskList();
  taskList.addNewTasks(inputSheet);
  taskList.pullAlltasks(UISheet) 
  taskList.removeComplete();
  taskList.setTasks(UISheet);

  
}

// function that adds the new tasks to the google calendar 
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


   
// utility lifecycle function that adds custom menu items to the google sheets 
// to access the custom function that were made
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
