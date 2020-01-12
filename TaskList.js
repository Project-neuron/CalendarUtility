// This function is the cointainer for the list of task items
// it handles the transfer of tasks from form list to the main task list  
// It also handles the task list management 

TaskList = function(){
  this.list = []
  
  this.addNewTasks = function(sheet){
    var form = FormApp.openByUrl("");
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
  
  this.setTaskStatus = function(sheet, row){
    var column = 8; 
    sheet.setItem(row+3,column,'scheduled');
    
    
  
  }
  
  
  this.removeComplete = function(){
    var index = 0; 
    var newList = this.list.filter(function(element, index, arr){

    return element.getStatus() !== 'complete';  
    }) 
    this.list = newList;
      
   }
}
