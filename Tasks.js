// task Class that encapsulates task functionality 
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

