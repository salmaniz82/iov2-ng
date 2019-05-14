
/*

CONVERT MYSQL DATE TIME TO JAVASCRIPT DATE OBJECT

*/


// Split timestamp into [ Y, M, D, h, m, s ]
var t = "2019-04-30 21:50:00".split(/[- :]/);

// Apply each element to the Date function
var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

console.log(d);
// -> Wed Jun 09 2010 14:12:01 GMT+0100 (BST)




/*

SHOW X TIME AGO FROM DATE TIME OBJECT

*/


function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
var aDay = 24*60*60*1000
console.log(timeSince(new Date(Date.now()-aDay)));
console.log(timeSince(new Date(Date.now()-aDay*2)));






var t = "2019-04-30 21:50:00".split(/[- :]/);
var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
var tms = d.getTime();