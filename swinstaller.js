document.addEventListener('DOMContentLoaded', function(event) {

  if ('serviceWorker' in navigator) {
  
    navigator.serviceWorker.register('./sw.js').then(function(reg) {

      if ('sync' in reg) {

        window.cachedRegisterSW = reg;

       // return reg.sync.register('outbox');

       console.log('syn is not registered here');

        

      }
    }).catch(function(err) {

      console.error(err); // the Service Worker didn't install correctly
      
    });
  }
});


function updateOnlineStatus(e)
{

  console.log('status has changed or updated');

}
  
  
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);