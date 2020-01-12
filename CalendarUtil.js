// This class handles the Google calendar API and is the way new tasks are added to 
// the calendar
CalendarUtility = function(){
  this.cal = CalendarApp.getCalendarById(''); 
  
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
  

  
  this.findAndInsert = function(task){
  
      // while item isn't inserted 
      // get Item 
      // initialize a start date time and an end datetime increment by a day for now 
      // set the start date time to 8 am set the end datetime to 11 pm 
      // Get the total number of events 
      // get all the events and store them in a global var 
      // set a var for the first item and a var for the second item 
      // while the index of first and the index of second aren't equal to the max number of items 
      // compare the first item's end time with that of the second 
      // if the first ends before the second check the difference in time between them 
      // if that difference is less than the amount of time the new task takes then insert the new task right after the first task 
      // if the first does not end before the second increment the second to get the next item  
      // repeat until the new item is inserted or the day is incremented 
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