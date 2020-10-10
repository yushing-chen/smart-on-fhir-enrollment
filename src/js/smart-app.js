(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {  
      alert(JSON.stringify(smart));

      if (smart.hasOwnProperty('patient')) {
        console.log(JSON.stringify(smart));
        var patient = smart.patient;
        var pt = patient.read();

        $.when(pt).fail(onError);
        
        $.when(pt).done(function(patient) {
            if (smart.hasOwnProperty('userId')) {
              console.log(smart.userId);
	      alert(smart.userId);
              alert(smart.tokenResponse.access_token);
              alert(smart.patient);
              ret.resolve(patient);
            } else {
              onError();
            }
        });
      } else {
        onError();
      }
    }
    alert("versionES-url-1013-1");
    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();
  };

//function getPatientEDIPI(patient)
 function getPatientEDIPI(patient) {
      const dsvDodIdentifierSystemName = 'urn:oid:2.16.840.1.113883.3.42.10001.100001.12';
      let patientId = '';
      let found = false;

      console.log('extracting the patient identifier EPIPI');
      for(let i = 0; i < patient.identifier.length; i++) {
        if (patient.identifier[i].system === dsvDodIdentifierSystemName) {
          patientId = patient.identifier[i].value;
          found = true;
          console.log(patientId);
          break;
        }
      }
      return patientId;
    }
 
//function getPatientICN(patient)
 function getPatientICN(patient) {
     const dsvIcnIdentifierSystemName = 'urn:oid:2.16.840.1.113883.4.349'

      let patientId = '';
      let found = false;

      console.log('extracting the patient identifier ICN');
      for(let i = 0; i < patient.identifier.length; i++) {
        if (patient.identifier[i].system === dsvIcnIdentifierSystemName) {
          patientId = patient.identifier[i].value;
          found = true;
          console.log(patientId);
          break;
        }
      }
      return patientId;
    }
 
//function getPatientMRN(patient) 
 function getPatientMRN(patient) {
  const dsvIdentifierSystemName = 'urn:oid:2.16.840.1.113883.3.787.0.0';
  
      let patientId = '';
      let found = false;

      console.log('extracting the patient identifier MRN');
      for(let i = 0; i < patient.identifier.length; i++) {
        if (patient.identifier[i].system === dsvIdentifierSystemName) {
          patientId = patient.identifier[i].value;
          found = true;
          console.log(patientId);
          break;
        }
      }
      return patientId;
    }

//window.redirectToES = function(patient)
  window.redirectToES = function(patient) {
      //alert(JSON.stringify(patient));
      //console.log(JSON.stringify(patient));
      //getPractitioner(patient);
      alert(JSON.stringify(patient));
      var edipi = getPatientEDIPI(patient);
      var icn = getPatientICN(patient);
      var mrn = getPatientMRN(patient);
      var deb_id = 'EDIPI=***' + edipi + '***ICN=***' + icn +  '***MRN***='  + mrn + '***' ;
      alert(deb_id);
//	if ( (edipi == 'undefined' ) && ( icn == 'undefined' ) && ( mrn == 'undefined' )  )
	if ( (edipi == '' ) && ( icn == '' )   )		
	{   console.log('No patient identifier found');
		alert('The Patient is missing an EDIPI and ICN. Contact System Administrator.');
      }
	     
      var fname = '';
      var lname = '';
 
      if (typeof patient.name[0] !== 'undefined' ) {
        fname = patient.name[0].given;
        lname = patient.name[0].family;
      }
      var nm = fname + "+" + lname;
      console.log(nm);

      var gender = patient.gender;

      var dob = new Date(patient.birthDate);
      var day = dob.getDate();
      var monthIndex = dob.getMonth() + 1;
      var year = dob.getFullYear();
      var dobStr = monthIndex + '/' + day + '/' + year
      console.log(dobStr);
      var fin="";	

//Data Url      
//edipi=12312313&icn=1008834677V755078&name=John+Adams&age=38&dob=10%2F10%2F1961&sex=M&fin=12345544&mrn=33355632221     
//Hostname Url
//https://usvadceapp.lcahncrls.net/?data=
//https://vaausappesr801.aac.va.gov:7401/es-rs/ratingapp/postform         
//var es_dataUrl = "edipi=" + edipi + "&" + "icn=" + icn + "&" + "name=" + nm + "&" + "dob=" + dobStr + "&" +"sex=" + gender + "&" + "fin=" + fin + "&" + "mrn=" + mrn  ;
//var es_url = "https://usvadceapp.lcahncrls.net/?data="+ es_dataUrl;
//var es_url = "https://vaww.esrstage1a.aac.va.gov/es-rs/ratingapp/postform/?data="+ es_dataUrl;
     var es_dataUrl = '{"parameters":{' +
      '"edipi":"'      + edipi +'",'+
      '"icn":"'        + icn +'",'+
      '"name":"'       + nm +'",'+
      '"dob":"'        + dobStr +'",'+
      '"sex":"'        + gender +'",'+
      '"fin":"'        + fin +'",'+
      '"mrn":"'        + mrn + '"}}';	  
var base64_text = btoa(es_dataUrl);

var es_url = "https://usvadceapp.lcahncrls.net/cern-mutual-auth-service/b1930.lcahncrls.net/service/buildpostrequest?data="+ base64_text;  
      console.log(es_url);
      alert(es_url);
      window.location.replace(es_url);
      window.location.reload();
  };

})(window);

