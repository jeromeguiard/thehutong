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
                                     " id=\"team\" onfocus=\"this.value=''\"><br/></input><input type=\"password\" "+
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
    var huntTitle = document.createElement("div");
    huntTitle.setAttribute("class","jumbotron");
    huntTitle.innerHTML = "<h2>List of hunts</h2><div class=\"lead\">Select the"+
                          " hunt you want to take part in. All hunts here are private (need a password)</div>";
    container.appendChild(huntTitle);
    var objectDiv= null;
    objects.objects.forEach(function(element, index){
        sessionStorage.setItem("hunt_"+element.id, JSON.stringify(element));
        if(index % 3==0){
           // var hrElement = document.createElement("hr");
            //container.appendChild(hrElement);
            objectDiv = document.createElement("div");
            objectDiv.setAttribute("class","row-fluid");
        }
        console.log(objectDiv);
        objectDiv.innerHTML += "<div class=\"span4\"><div class=\"well\"><h2>"+element.title +"</h2><p>Hunt from "+
                               element.startingPOI.title+" to "+ element.endingPOI.title+
                               "</p><span class=\"btn\" onclick=\"viewHuntDetails("+ element.id+
                               ");\">View hunt</span></div></div>";
        container.appendChild(objectDiv);
    });
    var footerElement = document.createElement("footer");
    footerElement.setAttribute("class", "footer");
    footerElement.innerHTML = "The hutong";
    container.appendChild(footerElement);
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
    objectDiv.innerHTML = "<div><div class=\"jumbotron\"> <h2>"+huntInfo.title+
                          "</h2><div class=\"lead\">The hunt contains "+ huntInfo.challenges.length +
                          " challenges. When you start it you will have "+ huntInfo.duration+
                          " minutes to achieve all challenges.</div><span class=\"btn btn-large btn-success\" onclick=\"takePartInHunt("
                          + huntId+");\">Take part in hunt</span></div> <div class=\"hero-unit\">Starting from : "+ huntInfo.startingPOI.title+
                          "<br/>Ending at  : "+ huntInfo.endingPOI.title+
                          "</div></div>";
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
        
    console.log(password);
    var huntInfo = JSON.parse(sessionStorage.getItem("hunt_"+huntId));
    if (password == huntInfo.unlockingPass){
        var huntTeam = {'user':'/api/account/v1/user/' + sessionStorage.getItem("userId")+'/',
                        'hunt':'/api/hunt/v1/hunt/'+huntId+'/',
                        'challenge':[]};
        var jsonTosend = JSON.stringify(huntTeam);
        var request= new XMLHttpRequest();
        request.open("POST", "/api/account/v1/teamhunt/",false);
        request = setRequestHeaderAuthorization(request);
        request.setRequestHeader("Content-Type","application/json");
        request.send(jsonTosend);
        getTeamHuntAndChallenge(request.getResponseHeader("Location"));
    }else if(password == null){
        return;
    }
    else{
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

    if(document.getElementById("mapNavBar") == null){
        var mapInNav = document.createElement("li");
        var menu = document.getElementById("menu");
        var mapInMenu = document.createElement("a");
        mapInMenu.setAttribute("onclick", "displayMap();");
        mapInMenu.setAttribute("id", "mapNavBar");
        mapInMenu.innerText = "Map";
        mapInNav.appendChild(mapInMenu); 
        menu.appendChild(mapInNav);
    }else{ 
        var mapNavBar = document.getElementById("mapNavBar");
        mapNavBar.setAttribute("onclick", "displayMap()");
        mapNavBar.innerText = "Map";
    }

    var returnBtn = document.getElementById("returnBtn");
    returnBtn.innerHTML = "";

    var mapCanvas = document.getElementById("map_canvas");
    if(mapCanvas != null){
        mapCanvas.innerHTML = "";
    }

    challenges = JSON.parse(sessionStorage.getItem("challenges"));
    challenges.forEach(function(item, index){
        objectDiv = document.createElement("div");
        objectDiv.setAttribute("class", "row-fluid hero-unit");
        if (item.lock == 1){
             objectDiv.innerHTML = "<div id=\"challenge_"+item.id+
                                  "\"><h1>Challenge "+(index +1)+"</h1><div>Please go to the POI "+
                                  item.challenge.poi.title+
                                  "</div><p>And answer the following question: <br/>"+
                                  item.challenge.question +
                                  "</p> <button class=\"btn btn-success btn-large\" onclick=\"submitAnswer("+
                                  item.id+", this);\">Answer</button></div>";
        }else{
            objectDiv.innerHTML = "<div id=\"challenge_"+item.id+
                               "\"><h3 challengeId=\""+(index+1)+"\">Challenge "+(index+1)+" is lock</h3></div>";   
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
    mapContainer.setAttribute("style", "width:"+window.innerWidth+"px;height:"+window.innerHeight+"px;");

    var returnBtn = document.getElementById("returnBtn");
    returnBtnMenu = document.createElement("a");
    returnBtnMenu.innerHTML = "Return";
    returnBtnMenu.setAttribute("onclick", "displayChallenges();");
    returnBtn.appendChild(returnBtnMenu);

    var mapNavBar = document.getElementById("mapNavBar");
    mapNavBar.setAttribute("onclick", "calcRoute()");
    mapNavBar.innerText = "Direction";

    container.appendChild(mapContainer);
    initialize();
    populateWithUnlockPOI();
    navigator.geolocation.getCurrentPosition(displayMyLocation);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
}

/*
 *
 * display the current position on the map
 *
 */

function displayMyLocation(position){
    var coordinates = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);
    start = coordinates;
    var marker = new google.maps.Marker({
        position : coordinates,
        titile : "Me",
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });
    marker.setMap(map);
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
            //var symbolStatus = new google.maps.Symbol({
            //    fillColor : "blue"
           // });
            if (element.status == 2 ){
                end = coordinates;
                var marker = new google.maps.Marker({
                    position: coordinates,
                    title: element.challenge.poi.title,
                    icon : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });
            }else{
                var marker = new google.maps.Marker({
                    position: coordinates,
                    title: element.challenge.poi.title,
                }); 
            }
            marker.setMap(map);
        }
    });
}

function submitAnswer(challengeId, btn){
    var challenges = JSON.parse(sessionStorage.getItem("challenges"));
    var currentChallenge = null; 
    var nextChallenge = null;
    challenges.forEach(function(element, index){
        if (element.id == challengeId){
            currentChallenge = element;
            currentChallengeIndex = index;
        }
        if (element.id == challengeId+1){
            nextChallenge = element;
            nextChallengeIndex = index;
        }
    });
    answer = window.prompt("Please type the answer:");
    if (answer.toLowerCase() == currentChallenge.challenge.answer.toLowerCase()){
        //Preparing request for the current challenge
        var request = new XMLHttpRequest();
        var currentJsonToSend = "{\"points\":"+currentChallenge.challenge.numberOfPoints
                         +", \"status\":"+1+"}";
        request.open("PATCH",
                     "/api/account/v1/challengeteamhunt/"+currentChallenge.id+"/",
                     false);
        request = setRequestHeaderAuthorization(request);
        request.setRequestHeader("Content-Type", "application/json");

        //Preparing request for the next challenge
        if (nextChallenge != null){
            var requestNext = new XMLHttpRequest();
            var nextJsonToSend = "{\"lock\":"+1
                            +", \"status\":"+2+"}";
            requestNext.open("PATCH",
                         "/api/account/v1/challengeteamhunt/"+(currentChallenge.id+1)+"/",
                         false);
            requestNext = setRequestHeaderAuthorization(requestNext);
            requestNext.setRequestHeader("Content-Type", "application/json");
        }

        //Send requests
        request.send(currentJsonToSend);
        
        if (nextChallenge != null){
            requestNext.send(nextJsonToSend);
            var nextObjectDiv = document.getElementById("challenge_"+nextChallenge.id);
            var challengeId = nextObjectDiv.children[0].getAttribute("challengeId");
            nextObjectDiv.innerHTML = "<div id=\"challenge_"+nextChallenge.id+
                                      "\"><h1>Challenge "+ challengeId+"</h1><div>Please go to the POI "+ nextChallenge.challenge.poi.title+
                                      "</div><p>And answer the following question: <br/>"+
                                      nextChallenge.challenge.question +
                                      "</p> <button class=\"btn btn-large btn-success\" onclick=\"submitAnswer("+
                                      nextChallenge.id+", this);\">Answer</button></div>";
        }

        challenges[currentChallengeIndex].points = currentChallenge.challenge.numberOfPoints;
        challenges[currentChallengeIndex].status = 1;
        if (nextChallenge != null){
            challenges[nextChallengeIndex].status = 2;
            challenges[nextChallengeIndex].lock = 1;
        }
        sessionStorage.setItem("challenges", JSON.stringify(challenges));
        btn.setAttribute("disabled", "disabled");

        if(nextChallenge != null){
            alert("Your answer has been submitted correctly go to the next challenge");
        }else{
            alert("Congratulation you finish the hunt with " + retrieveTotalPoints() + " points.");
        }
    }else {
        alert("Bad answer");
    }
}

function retrieveTotalPoints(){
    var challenges = JSON.parse(sessionStorage.getItem("challenges"));
    var totalPoints = 0;
    challenges.forEach(function(element){
        totalPoints += parseInt(element.points);
    });
    return totalPoints;
}
/*
 *
 *Set Authorization request header
 *
 */

function setRequestHeaderAuthorization(request){
    request.setRequestHeader("Authorization", "ApiKey "+
                                               sessionStorage.getItem("username")+
                                             ":"+
                                              sessionStorage.getItem("key"));
    return request;
}

function calcRoute(){
    var request = {
        origin: start,
        destination : end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status){
       // if(status == google.maps.DirectionStatus.OK){
           directionsDisplay.setDirections(result);
       // }
    });
}

/*
 *
 *First execution with the test if local/session storage is on
 *
 */


var map = null;
var start = null;
var end = null;
var directionDisplay;
var directionsService = null; 
try{
    'localStorage' in window && window['localStorage'] !== null;
    generateLogin();
} catch(e){
    document.getElementById("container").innerHTML="Your Bowser doesn't support some HTML5 functions. Please upgrade to a modern one for more features and safety.";
}
