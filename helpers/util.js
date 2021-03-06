const moment = require('moment')

function formatDate(dateString) {
    var date = new Date(dateString)
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  
function standarDate(tgl){
  return moment(tgl).format("YYYY-MM-DD")
}


  module.exports = {
    formatDate,
    standarDate
  }