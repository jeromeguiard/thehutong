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
                "api/account/v1/apikey/?format=json",
                true);
   request.setRequestHeader("Authorization", "Basic "+btoa(team+":"+password));
   request.onloadend = function(){
                       if(request.status == 200){
                           object = JSON.parse(request.response).objects[0];
                           sessionStorage.setItem("username",object.user.username);
                           sessionStorage.setItem("key",object.key);
                           getHunt();
                       }
                      };
   request.send();
}

function getHunt(){
    var request = new XMLHttpRequest();
    request.open("GET",
                 "api/hunt/v1/hunt/?format=json",
                 True);
    request.setRequestHeader("Authorization", "ApiKey "+
                                             sessionStorage.get("team")+
                                             ":"+
                                             sessionStorage.get("password"));
   request.onloadend = function(){};
}

try{
    'localStorage' in window && window['localStorage'] !== null;
    generateLogin();
} catch(e){
    document.getElementById("container").innerHTML="Your Bowser doesn't support some HTML5 functions. Please upgrade to a modern one for more features and safety.";
}
