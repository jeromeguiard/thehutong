function generateLogin(){var e=document.getElementById("container");var t=document.createElement("div");t.setAttribute("id","containerLogin");t.setAttribute("class","hero-unit");t.innerHTML='<h1>Login</h1><input type="text" value="Team name"'+' id="team" onfocus="this.value=\'\'"><br/></input><input type="password" '+'id="password"></input><br/><input type="button" '+' class="btn" value="login" onclick="login();"></input>';e.appendChild(t)}function login(){var e=document.getElementById("team").value;var t=document.getElementById("password").value;var n=new XMLHttpRequest;n.open("GET","/api/account/v1/apikey/?format=json",true);n.setRequestHeader("Authorization","Basic "+btoa(e+":"+t));n.onloadend=function(){if(n.status==200){object=JSON.parse(n.response).objects[0];var e=document.getElementById("menu");var t=document.createElement("li");t.setAttribute("id","userNavBar");t.innerHTML="<a>"+object.user.username+"</a>";e.appendChild(t);sessionStorage.setItem("username",object.user.username);sessionStorage.setItem("key",object.key);sessionStorage.setItem("userId",object.user.id);getHunts()}};n.send()}function getHunts(){var e=new XMLHttpRequest;e.open("GET","/api/hunt/v1/hunt/?format=json",true);e.setRequestHeader("Authorization","ApiKey "+sessionStorage.getItem("username")+":"+sessionStorage.getItem("key"));e.onloadend=function(){if(e.status==200){displayHunts(JSON.parse(e.response),true)}else{displayServerError()}};e.send()}function displayHunts(e,t){if(t)sessionStorage.setItem("huntInformations",JSON.stringify(e));else e=JSON.parse(sessionStorage.getItem("huntInformations"));var n=document.getElementById("container");n.innerHTML="";var r=document.createElement("div");r.setAttribute("class","jumbotron");r.innerHTML='<h2>List of hunts</h2><div class="lead">Select the'+" hunt you want to take part in. All hunts here are private (need a password)</div>";n.appendChild(r);var i=null;e.objects.forEach(function(e,t){sessionStorage.setItem("hunt_"+e.id,JSON.stringify(e));if(t%3==0){i=document.createElement("div");i.setAttribute("class","row-fluid")}console.log(i);i.innerHTML+='<div class="span4"><div class="well"><h2>'+e.title+"</h2><p>Hunt from "+e.startingPOI.title+" to "+e.endingPOI.title+'</p><span class="btn" onclick="viewHuntDetails('+e.id+');">View hunt</span></div></div>';n.appendChild(i)});var s=document.createElement("footer");s.setAttribute("class","footer");s.innerHTML="The hutong";n.appendChild(s)}function viewHuntDetails(e){if(document.getElementById("returnBtn")==null){var t=document.getElementById("menu");var n=document.createElement("li");n.setAttribute("id","returnBtn");t.appendChild(n)}else{var n=document.getElementById("returnBtn")}n.innerHTML='<a  onclick="displayHunts(null,false);">Return</a>';huntInfo=JSON.parse(sessionStorage.getItem("hunt_"+e));var r=document.getElementById("container");r.innerHTML="";objectDiv=document.createElement("div");objectDiv.innerHTML='<div><div class="jumbotron"> <h2>'+huntInfo.title+'</h2><div class="lead">The hunt contains '+huntInfo.challenges.length+" challenges. When you start it you will have "+huntInfo.duration+' minutes to achieve all challenges.</div><span class="btn btn-large btn-success" onclick="takePartInHunt('+e+');">Take part in hunt</span></div> <div class="hero-unit">Starting from : '+huntInfo.startingPOI.title+"<br/>Ending at  : "+huntInfo.endingPOI.title+"</div></div>";r.appendChild(objectDiv)}function takePartInHunt(e,t){if(typeof t==="undefined")t=true;var n;if(t)n=window.prompt("Password for the hunt:");else n=window.prompt("Wrong pass try again:");console.log(n);var r=JSON.parse(sessionStorage.getItem("hunt_"+e));if(n==r.unlockingPass){var i={user:"/api/account/v1/user/"+sessionStorage.getItem("userId")+"/",hunt:"/api/hunt/v1/hunt/"+e+"/",challenge:[]};var s=JSON.stringify(i);var o=new XMLHttpRequest;o.open("POST","/api/account/v1/teamhunt/",false);o=setRequestHeaderAuthorization(o);o.setRequestHeader("Content-Type","application/json");o.send(s);getTeamHuntAndChallenge(o.getResponseHeader("Location"))}else if(n==null){return}else{takePartInHunt(e,false)}}function getTeamHuntAndChallenge(e){var t=new XMLHttpRequest;t.open("GET","/api/account/v1/teamhunt/"+e.split("/").reverse()[1]+"/?format=json",true);t=setRequestHeaderAuthorization(t);t.onloadend=function(){teamHuntData=JSON.parse(t.response);sessionStorage.setItem("challenges",JSON.stringify(teamHuntData.challenge));displayChallenges()};t.send()}function displayChallenges(){var e=document.getElementById("container");container.innerHTML="";if(document.getElementById("mapNavBar")==null){var t=document.createElement("li");var n=document.getElementById("menu");var r=document.createElement("a");r.setAttribute("onclick","displayMap();");r.setAttribute("id","mapNavBar");r.innerText="Map";t.appendChild(r);n.appendChild(t)}else{var i=document.getElementById("mapNavBar");i.setAttribute("onclick","displayMap()");i.innerText="Map"}var s=document.getElementById("returnBtn");s.innerHTML="";var o=document.getElementById("map_canvas");if(o!=null){o.innerHTML=""}challenges=JSON.parse(sessionStorage.getItem("challenges"));challenges.forEach(function(e,t){objectDiv=document.createElement("div");objectDiv.setAttribute("class","row-fluid hero-unit");if(e.lock==1){objectDiv.innerHTML='<div id="challenge_'+e.id+'"><h1>Challenge '+(t+1)+"</h1><div>Please go to the POI "+e.challenge.poi.title+"</div><p>And answer the following question: <br/>"+e.challenge.question+'</p> <button class="btn btn-success btn-large" onclick="submitAnswer('+e.id+', this);">Answer</button></div>'}else{objectDiv.innerHTML='<div id="challenge_'+e.id+'"><h3 challengeId="'+(t+1)+'">Challenge '+(t+1)+" is lock</h3></div>"}container.appendChild(objectDiv)})}function displayMap(){var e=document.getElementById("container");e.innerHTML="";var t=document.createElement("div");t.setAttribute("id","map_canvas");t.setAttribute("style","width:"+window.innerWidth+"px;height:"+window.innerHeight+"px;");var n=document.getElementById("returnBtn");returnBtnMenu=document.createElement("a");returnBtnMenu.innerHTML="Return";returnBtnMenu.setAttribute("onclick","displayChallenges();");n.appendChild(returnBtnMenu);var r=document.getElementById("mapNavBar");r.setAttribute("onclick","calcRoute()");r.innerText="Direction";e.appendChild(t);initialize();populateWithUnlockPOI();navigator.geolocation.getCurrentPosition(displayMyLocation);directionsService=new google.maps.DirectionsService;directionsDisplay=new google.maps.DirectionsRenderer;directionsDisplay.setMap(map)}function displayMyLocation(e){var t=new google.maps.LatLng(e.coords.latitude,e.coords.longitude);start=t;var n=new google.maps.Marker({position:t,titile:"Me",icon:"http://maps.google.com/mapfiles/ms/icons/green-dot.png"});n.setMap(map)}function initialize(){var e=document.getElementById("map_canvas");var t={center:new google.maps.LatLng(39.93,116.42),zoom:13,mapTypeId:google.maps.MapTypeId.ROADMAP};map=new google.maps.Map(e,t)}function populateWithUnlockPOI(){var e=JSON.parse(sessionStorage.getItem("challenges"));e.forEach(function(e){if(e.lock==1){var t=e.challenge.poi.point.replace("POINT (","").replace(")","");var n=new google.maps.LatLng(parseFloat(t.split(" ")[1]),parseFloat(t.split(" ")[0]));if(e.status==2){end=n;var r=new google.maps.Marker({position:n,title:e.challenge.poi.title,icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"})}else{var r=new google.maps.Marker({position:n,title:e.challenge.poi.title})}r.setMap(map)}})}function submitAnswer(e,t){var n=JSON.parse(sessionStorage.getItem("challenges"));var r=null;var i=null;n.forEach(function(t,n){if(t.id==e){r=t;currentChallengeIndex=n}if(t.id==e+1){i=t;nextChallengeIndex=n}});answer=window.prompt("Please type the answer:");if(answer.toLowerCase()==r.challenge.answer.toLowerCase()){var s=new XMLHttpRequest;var o='{"points":'+r.challenge.numberOfPoints+', "status":'+1+"}";s.open("PATCH","/api/account/v1/challengeteamhunt/"+r.id+"/",false);s=setRequestHeaderAuthorization(s);s.setRequestHeader("Content-Type","application/json");if(i!=null){var u=new XMLHttpRequest;var a='{"lock":'+1+', "status":'+2+"}";u.open("PATCH","/api/account/v1/challengeteamhunt/"+(r.id+1)+"/",false);u=setRequestHeaderAuthorization(u);u.setRequestHeader("Content-Type","application/json")}s.send(o);if(i!=null){u.send(a);var f=document.getElementById("challenge_"+i.id);var e=f.children[0].getAttribute("challengeId");f.innerHTML='<div id="challenge_'+i.id+'"><h1>Challenge '+e+"</h1><div>Please go to the POI "+i.challenge.poi.title+"</div><p>And answer the following question: <br/>"+i.challenge.question+'</p> <button class="btn btn-large btn-success" onclick="submitAnswer('+i.id+', this);">Answer</button></div>'}n[currentChallengeIndex].points=r.challenge.numberOfPoints;n[currentChallengeIndex].status=1;if(i!=null){n[nextChallengeIndex].status=2;n[nextChallengeIndex].lock=1}sessionStorage.setItem("challenges",JSON.stringify(n));t.setAttribute("disabled","disabled");if(i!=null){alert("Your answer has been submitted correctly go to the next challenge")}else{alert("Congratulation you finish the hunt with "+retrieveTotalPoints()+" points.")}}else{alert("Bad answer")}}function retrieveTotalPoints(){var e=JSON.parse(sessionStorage.getItem("challenges"));var t=0;e.forEach(function(e){t+=parseInt(e.points)});return t}function setRequestHeaderAuthorization(e){e.setRequestHeader("Authorization","ApiKey "+sessionStorage.getItem("username")+":"+sessionStorage.getItem("key"));return e}function calcRoute(){var e={origin:start,destination:end,travelMode:google.maps.TravelMode.DRIVING};directionsService.route(e,function(e,t){directionsDisplay.setDirections(e)})}var map=null;var start=null;var end=null;var directionDisplay;var directionsService=null;try{"localStorage"in window&&window["localStorage"]!==null;generateLogin()}catch(e){document.getElementById("container").innerHTML="Your Bowser doesn't support some HTML5 functions. Please upgrade to a modern one for more features and safety."}
