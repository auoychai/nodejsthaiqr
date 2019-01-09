
const fbc = require('../app/services/firebaseMgr');


  fbc.getOAuth2Token().then((data)=>{
      
      console.log(data);
  });

       // 2018-05-10T08:28:45.072Z
/*
       var date ="20170825";


       var YYYY = date.substring(0, 4);
       var MM = date.substring(4, 6);
       var DD = date.substring(6, 8);

       date=YYYY+'-'+MM+'-'+DD;

       console.log(date);

       var time ="153422";

       var hh = time.substring(0, 2);
       var mm = time.substring(2, 4);
       var ss = time.substring(4, 6);

       

       time=hh+':'+mm+':'+ss+'.000Z';
       console.log(time);

       isoDT = date+'T'+time;

       console.log(isoDT);
*/