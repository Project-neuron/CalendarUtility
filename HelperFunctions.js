// All the extra utility functions needed to do things like date calculation 
// and google sheet manipulation as well as sorting 

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

// sheet manipulation helper 
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

