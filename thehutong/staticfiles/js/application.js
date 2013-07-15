function generateLogin(){
    var container = document.getElementById("container");
    var containerLoginContent = document.createElement("div");
    containerLoginContent.setAttribute("id","containerLogin");
    containerLoginContent.setAttribute("class","hero-unit");
    containerLoginContent.innerHTML= '<h1>Login</h1><input type="text" value="Team name" id="team"><br/></input><input type="password" id="password"></input><br/><input type="button" class="btn" value="login" onclick="login();"></input>';
    container.appendChild(containerLoginContent); 
}
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
                           sessionStorage.setItem("username",object.user.username);
                           sessionStorage.setItem("key",object.key);
                           getHunts();
                       }
                      };
   request.send();
}

function getHunts(){
    var request = new XMLHttpRequest();
    request.open("GET",
                 "/api/hunt/v1/hunt/?format=json",
                 true);
    request.setRequestHeader("Authorization", "ApiKey "+
                                             sessionStorage.getItem("team")+
                                             ":"+
                                             sessionStorage.getItem("password"));
   request.onloadend = function(){displayHunts(JSON.parse(request.response));};
   request.send();
}

function displayHunts(objects){
    console.log(objects);
    var container = document.getElementById("container");
    container.innerHTML = "";
    objects.objects.forEach(function(element){
        sessionStorage.setItem("hunt_"+element.id, JSON.stringify(element)); 
        var objectDiv = document.createElement("div");
        objectDiv.setAttribute("class","row-fluid hero-unit");
        objectDiv.innerHTML = "<div class=\"span4\"><div>"+element.title +"</div><div>Hunt from "+element.startingPOI.title+" to "+ element.endingPOI.title+"</div><span class=\"btn\" onclick=\"viewHuntDetails("+ element.id+");\">View hunt</span></div>";
        container.appendChild(objectDiv);
    }
    );
}

function viewHuntDetails(huntId){
    huntInfo = JSON.parse(sessionStorage.getItem("hunt_"+huntId));
    var container = document.getElementById("container");
    container.innerHTML = "";
    objectDiv = document.createElement("div"); 
    objectDiv.innerHTML = "<div class=\"hero-unit\" <div>"+huntInfo.title+"</div> <div>Starting from : "+ huntInfo.startingPOI.title+"</div><div>Ending at  : "+ huntInfo.endingPOI.title+"</div><div>The hunt contains "+ huntInfo.challenges.length + " challenges. When you start it you will have "+ huntInfo.duration+" minutes to achieve all challenges.</div><span class=\"btn\" onclick=\"takePartInHunt("+ huntId+");\">Take part in hunt</span></div>";
    container.appendChild(objectDiv);
}

function takePartInHunt(huntId, firstTry ){
    if(typeof(firstTry)==='undefined') firstTry = true;
    var password;
    if (firstTry )
        password = window.prompt("Password for the hunt:");
    else
        password = window.prompt("Wrong pass try again:");
        
    var huntInfo = JSON.parse(sessionStorage.getItem("hunt_"+huntId));
    debugger;
    if (password == huntInfo.unlockingPass){
        alert("ok");
    }else{
       takePartInHunt(huntId, false); 
    }
}

try{
    'localStorage' in window && window['localStorage'] !== null;
    generateLogin();
} catch(e){
    document.getElementById("container").innerHTML="Your Bowser doesn't support some HTML5 functions. Please upgrade to a modern one for more features and safety.";
}
