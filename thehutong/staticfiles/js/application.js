/*
 *
 * function used in order to generate the login form used to access the application
 *
 */

function generateLogin(){
    var container = document.getElementById("container");
    var containerLoginContent = document.createElement("div");
    containerLoginContent.setAttribute("id","containerLogin");
    containerLoginContent.setAttribute("class","hero-unit");
    containerLoginContent.innerHTML= "<h1>Login</h1><input type=\"text\" value=\"Team name\""+
                                     " id=\"team\"><br/></input><input type=\"password\" "+
                                     "id=\"password\"></input><br/><input type=\"button\" "+
                                     " class=\"btn\" value=\"login\" onclick=\"login();\"></input>";
    container.appendChild(containerLoginContent); 
}

/*
 *
 *Login process
 *
 */

function login(){
   var team = document.getElementById("team").value;
   var password = document.getElementById("password").value;
   var request = new XMLHttpRequest();
   request.open("GET",
                "/api/account/v1/apikey/?format=json",
                true);
   request.setRequestHeader("Authorization", "Basic "+btoa(team+":"+password));
   request.onloadend = function(){
                       if(request.status == 200){
                           object = JSON.parse(request.response).objects[0];
                           var menu = document.getElementById("menu");
                           var userId = document.createElement("li");
                           userId.setAttribute("id","userNavBar");
                           userId.innerHTML = "<a>"+object.user.username+"</a>";
                           menu.appendChild(userId);
                           sessionStorage.setItem("username", object.user.username);
                           sessionStorage.setItem("key", object.key);
                           sessionStorage.setItem("userId", object.user.id);
                           getHunts();
                       }
                      };
   
   request.send();
}

/*
 *
 * retrieve hunt informations
 *
 */

function getHunts(){
    var request = new XMLHttpRequest();
    request.open("GET",
                 "/api/hunt/v1/hunt/?format=json",
                 true);
    request.setRequestHeader("Authorization", "ApiKey "+
                                             sessionStorage.getItem("username")+
                                             ":"+
                                             sessionStorage.getItem("key"));
   request.onloadend = function(){
             if(request.status == 200){
                 displayHunts(JSON.parse(request.response), true);}
             else{
                 displayServerError();
             }
   };
   request.send();
}

/*
 *
 *Display hunts on the webpage and store informations in sessionstorage for fster purpose
 *
 */

function displayHunts(objects, firstTime){
    if (firstTime)
        sessionStorage.setItem("huntInformations", JSON.stringify(objects));
    else
        objects = JSON.parse(sessionStorage.getItem("huntInformations"));
    var container = document.getElementById("container");
    container.innerHTML = "";
    objects.objects.forEach(function(element){
        sessionStorage.setItem("hunt_"+element.id, JSON.stringify(element)); 
        var objectDiv = document.createElement("div");
        objectDiv.setAttribute("class","row-fluid hero-unit");
        objectDiv.innerHTML = "<div class=\"span4\"><div>"+element.title +"</div><div>Hunt from "+
                               element.startingPOI.title+" to "+ element.endingPOI.title+
                               "</div><span class=\"btn\" onclick=\"viewHuntDetails("+ element.id+
                               ");\">View hunt</span></div>";
        container.appendChild(objectDiv);
    });
}

/*
 *
 * Show from the sessionStorage informations about the hunt
 *
 */

function viewHuntDetails(huntId){
    if( document.getElementById("returnBtn") == null){
        var menu = document.getElementById("menu");
        var returnBtn = document.createElement("li");
        returnBtn.setAttribute("id", "returnBtn");
        menu.appendChild(returnBtn);
    }else{
        var returnBtn = document.getElementById("returnBtn");
    }
    returnBtn.innerHTML = "<a  onclick=\"displayHunts(null,false);\">Return</a>";
    huntInfo = JSON.parse(sessionStorage.getItem("hunt_"+huntId));
    var container = document.getElementById("container");
    container.innerHTML = "";
    objectDiv = document.createElement("div"); 
    objectDiv.innerHTML = "<div class=\"hero-unit\" <div>"+huntInfo.title+
                          "</div> <div>Starting from : "+ huntInfo.startingPOI.title+
                          "</div><div>Ending at  : "+ huntInfo.endingPOI.title+
                          "</div><div>The hunt contains "+ huntInfo.challenges.length +
                          " challenges. When you start it you will have "+ huntInfo.duration+
                          " minutes to achieve all challenges.</div><span class=\"btn\" onclick=\"takePartInHunt("
                          + huntId+");\">Take part in hunt</span></div>";
    container.appendChild(objectDiv);
}


/*
 *
 * Validate the user password and let him take part in hunt
 *
 */

function takePartInHunt(huntId, firstTry ){
    if(typeof(firstTry)==='undefined') firstTry = true;
    var password;
    if (firstTry )
        password = window.prompt("Password for the hunt:");
    else
        password = window.prompt("Wrong pass try again:");
        
    var huntInfo = JSON.parse(sessionStorage.getItem("hunt_"+huntId));
    if (password == huntInfo.unlockingPass){
        var huntTeam = {'user':'/api/account/v1/user/' + sessionStorage.getItem("userId")+'/',
                        'hunt':'/api/hunt/v1/hunt/'+huntId+'/',
                        'challenge':[]};
        console.log(huntTeam);
        var jsonTosend = JSON.stringify(huntTeam);
        var request= new XMLHttpRequest();
        request.open("POST", "/api/account/v1/teamhunt/",false);
        request = setRequestHeaderAuthorization(request);
        request.setRequestHeader("Content-Type","application/json");
        request.send(jsonTosend);
        getTeamHuntAndChallenge(request.getResponseHeader("Location"));
    }else{
       takePartInHunt(huntId, false); 
    }
}

/*
 *
 *Retrieve challenges from server thanks to previous answer header
 *
 */

function getTeamHuntAndChallenge(headers){
    var request = new XMLHttpRequest();
    request.open("GET",
                 "/api/account/v1/teamhunt/"+headers.split("/").reverse()[1]+"/?format=json",
                 true);
    
    request = setRequestHeaderAuthorization(request);
    request.onloadend = function(){ 
        teamHuntData = JSON.parse(request.response);
        sessionStorage.setItem("challenges",
                   JSON.stringify(teamHuntData.challenge));
        displayChallenges(); 
    }; 
    request.send();
}

/*
 *
 * Display challenges and store informaitons in session storage
 *
 */

function displayChallenges(){
    var containter = document.getElementById("container");
    container.innerHTML = "";

    var buttonMap = document.createElement("button");
    buttonMap.innerHTML = "display map";
    buttonMap.setAttribute("onclick","displayMap();");
    buttonMap.setAttribute("class","btn");
    container.appendChild(buttonMap);

    var mapCanvas = document.getElementById("map_canvas");
    if(mapCanvas != null){
        mapCanvas.innerHTML = "";
    }

    challenges = JSON.parse(sessionStorage.getItem("challenges"));
    challenges.forEach(function(item, index){
    objectDiv = document.createElement("div");
    objectDiv.setAttribute("class", "row-fluid hero-unit");
    console.log(item.lock);
    if (item.lock == 1){
         objectDiv.innerHTML = "<div id=\"challenge_"+item.id+
                              "\"><div>Go to the POI "+ item.challenge.poi.title+
                              "</div><p>And answer the following question: "+
                              item.challenge.question +
                              "</p> <button class=\"btn\" onclick=\"submitAnswer("+
                              item.id+");\">Answer</button></div>";
       }else{
         objectDiv.innerHTML = "<div id=\"challenge_"+item.id+
                               "\">The challenge is lock</div>";   
      }
         container.appendChild(objectDiv);
      });
}

/*
 *
 *Prepare element on the webpage to display the map
 *
 */

function displayMap(){
    var container = document.getElementById("container");
    container.innerHTML = "";
 
    var mapContainer = document.createElement("div");
    mapContainer.setAttribute("id", "map_canvas");
    mapContainer.setAttribute("style", "width:500px;height:400px;");

    var returnBtn = document.getElementById("returnBtn");
    returnBtn.children[0].setAttribute("onclick", "displayChallenges();");
    container.appendChild(mapContainer);
    initialize();
    populateWithUnlockPOI();

}

/*
 *
 * Initialize the map
 *
 */

function initialize(){
    var map_canvas = document.getElementById("map_canvas");
    var map_option = {
      center : new google.maps.LatLng(39.93,116.42),
      zoom : 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(map_canvas, map_option)
}

/*
 *
 * Populate the map unlock poi
 *
 */

function populateWithUnlockPOI(){
    var challenges = JSON.parse(sessionStorage.getItem("challenges"));
    challenges.forEach(function(element){
        if (element.lock == 1){
            var coordinateAsString = element.challenge.poi.point.replace("POINT (","").replace(")",""); 
            var coordinates = new google.maps.LatLng(parseFloat(coordinateAsString.split(" ")[1]),
                                                     parseFloat(coordinateAsString.split(" ")[0]));
            var marker = new google.maps.Marker({
                position: coordinates,
                title: element.challenge.poi.title
            });
            marker.setMap(map);
        }
    });
}

function submitAnswer(challengeId){
     var challenges = JSON.parse(sessionStorage.getItem("challenges"));
     var currentChallenge = null; 
     var nextChallenge = null;
     challenges.forEach(function(element, index){
         if (element.id == challengeId){
             currentChallenge = element;
         }
         if (element.id == challengeId+1){
             nextChallenge = element;
         }
    });
    answer = window.prompt("Please type the answer:");
    if (answer.toLowerCase() == currentChallenge.challenge.answer.toLowerCase()){
        //Preparing request for the current challenge
        var request = new XMLHttpRequest();
        var jsonToSend = "{\"points\":"+currentChallenge.challenge.numberOfPoints
                         +", \"status\":"+1+"}";
        request.open("PATCH",
                     "/api/account/v1/challengeteamhunt/"+currentChallenge.id+"/",
                     false);
        request = setRequestHeaderAuthorization(request);
        request.setRequestHeader("Content-Type", "application/json");

        //Preparing request for the next challenge
        var requestNext = new XMLHttpRequest();
        var jsonToSend = "{\"lock\":"+1
                         +", \"status\":"+2+"}";
        requestNext.open("PATCH",
                     "/api/account/v1/challengeteamhunt/"+(currentChallenge.id+1)+"/",
                     false);
        requestNext = setRequestHeaderAuthorization(requestNext);
        requestNext.setRequestHeader("Content-Type", "application/json");

        //Send requests
        requestNext.send(jsonToSend);
        request.send(jsonToSend);

        var nextObjectDiv = document.getElementById("challenge_"+nextChallenge.id);
        nextObjectDiv.innerHTML = "<div id=\"challenge_"+nextChallenge.id+
                                  "\"><div>Go to the POI "+ nextChallenge.challenge.poi.title+
                                  "</div><p>And answer the following question: "+
                                  nextChallenge.challenge.question +
                                  "</p> <button class=\"btn\" onclick=\"submitAnswer("+
                                  nextChallenge.id+");\">Answer</button></div>";
        alert("Your answer has been submitted correctly go to the next challenge");         
    }else {
        alert("Bad answer");
    }
}

function setRequestHeaderAuthorization(request){
    request.setRequestHeader("Authorization", "ApiKey "+
                                               sessionStorage.getItem("username")+
                                             ":"+
                                              sessionStorage.getItem("key"));
    return request;
}

/*
 *
 *First execution with the test if local/session storage is on
 *
 */


var map = null;

try{
    'localStorage' in window && window['localStorage'] !== null;
    generateLogin();
} catch(e){
    document.getElementById("container").innerHTML="Your Bowser doesn't support some HTML5 functions. Please upgrade to a modern one for more features and safety.";
}
