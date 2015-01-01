var Server = {
	serverAddr : "",
	UserID : "",
	UserName : "",
	Device : "Samsung Smart TV",
	DeviceID : "00000000000000000000000000000000",
	AuthenticationToken : null
}

//------------------------------------------------------------
//      Getter & Setter Functions
//------------------------------------------------------------

Server.getAuthToken = function() {
	return this.AuthenticationToken;
}

Server.getServerAddr = function() {
	return this.serverAddr;
}

Server.setServerAddr = function(serverAddr) {
	this.serverAddr = serverAddr;
}

Server.getUserID = function() {
	return this.UserID;
}

Server.setUserID = function(UserID) {
	this.UserID = UserID;
}

Server.getUserName = function() {
	return this.UserName;
}

Server.setUserName = function(UserName) {
	this.UserName = UserName;
}

Server.setDevice = function(Device) {
	this.Device = Device;
}

Server.setDeviceID = function(DeviceID) {
	this.DeviceID = DeviceID;
}

//Required in Transcoding functions
Server.getDeviceID = function(DeviceID) {
	return this.DeviceID;
}
//------------------------------------------------------------
//      Generic Functions
//------------------------------------------------------------
Server.getCustomURL = function(SortParams) {
	if (SortParams != null){
		return  Server.getServerAddr() + SortParams;
	} else {
		return  Server.getServerAddr();
	}	
}

Server.getItemTypeURL = function(SortParams) {
	if (SortParams != null){
		return  Server.getServerAddr() + "/Users/" + Server.getUserID() + "/Items?format=json&ImageTypeLimit=1" + SortParams;
	} else {
		return  Server.getServerAddr() + "/Users/" + Server.getUserID() + "/Items?format=json&ImageTypeLimit=1";
	}	
}

Server.getChildItemsURL = function(ParentID, SortParams) {
	if (SortParams != null){
		return  Server.getServerAddr() + "/Users/" + Server.getUserID() + "/Items?ParentId="+ParentID+"&format=json&ImageTypeLimit=1" + SortParams;
	} else {
		return  Server.getServerAddr() + "/Users/" + Server.getUserID() + "/Items?ParentId="+ParentID+"&format=json&ImageTypeLimit=1";
	}	
}

Server.getItemInfoURL = function(ParentID, SortParams) {
	if (SortParams != null){
		return  Server.getServerAddr() + "/Users/" + Server.getUserID() + "/Items/"+ParentID+"?format=json&ImageTypeLimit=1" + SortParams;
	} else {
		return  Server.getServerAddr() + "/Users/" + Server.getUserID() + "/Items/"+ParentID+"?format=json&ImageTypeLimit=1";
	}		
}

Server.getAdjacentEpisodesURL = function(ShowID,SeasonID,EpisodeID) {
	return  Server.getServerAddr() + "/Shows/" + ShowID +  "/Episodes?format=json&ImageTypeLimit=1&seasonId="+SeasonID+"&userId="+Server.getUserID() +"&AdjacentTo=" + EpisodeID;
}

Server.getImageURL = function(itemId,imagetype,maxwidth,maxheight,unplayedcount,played,playedpercentage) {
	var query = "";
	switch (imagetype) {
	case "Primary":
		query =  Server.getServerAddr() + "/Items/"+ itemId +"/Images/Primary/0?maxwidth="+maxwidth+"&maxheight="+maxheight;
		break;
	case "Banner":
		query =   Server.getServerAddr() + "/Items/"+ itemId +"/Images/Banner/0?maxwidth="+maxwidth+"&maxheight="+maxheight;
		break;
	case "Backdrop":
		query =   Server.getServerAddr() + "/Items/"+ itemId +"/Images/Backdrop/0?maxwidth="+maxwidth+"&maxheight="+maxheight;
		break;
	case "Thumb":
		query =   Server.getServerAddr() + "/Items/"+ itemId +"/Images/Thumb/0?maxwidth="+maxwidth+"&maxheight="+maxheight;
		break;	
	case "Logo":
		query =   Server.getServerAddr() + "/Items/"+ itemId +"/Images/Logo/0?maxwidth="+maxwidth+"&maxheight="+maxheight;
		break;		
	case "UsersPrimary":
		return Server.getServerAddr() + "/Users/" + itemId + "/Images/Primary?maxwidth="+maxwidth+"&maxheight="+maxheight;
		break;
	}
	
	//if (unplayedcount >0){
		//query =  query + "&UnplayedCount=" + unplayedcount;
	//}
	
	//if (played){
		//query = query + "&AddPlayedIndicator=true";
	//}
	
	if (playedpercentage != 0){
	  if (playedpercentage != 100){
		  query = query + "&PercentPlayed=" + playedpercentage;
	  }	
	}
	
	query = query + "&Quality=80"
	
	return query;
}


Server.setRequestHeaders = function (xmlHttp,UserId) {
	if (this.UserID == null) {
		xmlHttp.setRequestHeader("Authorization", "MediaBrowser Client=\"Samsung TV\", Device=\""+this.Device+"\", DeviceId=\""+this.DeviceID+"\", Version=\""+Main.getVersion()+"\", UserId=\""+UserId+"\"");
	} else {
		xmlHttp.setRequestHeader("Authorization", "MediaBrowser Client=\"Samsung TV\", Device=\""+this.Device+"\", DeviceId=\""+this.DeviceID+"\", Version=\""+Main.getVersion()+"\", UserId=\""+this.UserID+"\"");
		if (this.AuthenticationToken != null) {
			xmlHttp.setRequestHeader("X-MediaBrowser-Token", this.AuthenticationToken);		
		}
	}
	xmlHttp.setRequestHeader("Content-Type", 'application/json; charset=UTF-8');	
	return xmlHttp;
}

//------------------------------------------------------------
//      Player Functions
//------------------------------------------------------------
Server.videoStarted = function(showId,MediaSourceID,PlayMethod) {
	var url = this.serverAddr + "/Sessions/Playing";
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		var contentToPost = '{"QueueableMediaTypes":["Video"],"CanSeek":false,"ItemId":'+showId+',"MediaSourceId":'+MediaSourceID+',"IsPaused":false,"IsMuted":false,"PositionTicks":0,"PlayMethod":'+PlayMethod+'}';
		xmlHttp.open("POST", url , true); //must be true!
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(contentToPost);
	}
}

Server.videoStopped = function(showId,MediaSourceID,ticks,PlayMethod) {
	var url = this.serverAddr + "/Sessions/Playing/Stopped";
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		var contentToPost = '{"QueueableMediaTypes":["Video"],"CanSeek":false,"ItemId":'+showId+',"MediaSourceId":'+MediaSourceID+',"IsPaused":false,"IsMuted":false,"PositionTicks":'+(ticks*10000)+',"PlayMethod":'+PlayMethod+'}';
		xmlHttp.open("POST", url , true); //must be true!
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(contentToPost);
	}	
}

Server.videoPaused = function(showId,MediaSourceID,ticks,PlayMethod) {
	var url = this.serverAddr + "/Sessions/Playing/Progress";
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		var contentToPost = '{"QueueableMediaTypes":["Video"],"CanSeek":false,"ItemId":'+showId+',"MediaSourceId":'+MediaSourceID+',"IsPaused":true,"IsMuted":false,"PositionTicks":'+(ticks*10000)+',"PlayMethod":'+PlayMethod+'}';
		xmlHttp.open("POST", url , true); //must be true!
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(contentToPost);
	}	
}

Server.videoTime = function(showId,MediaSourceID,ticks,PlayMethod) {
	alert ("I Ran")
	alert (ticks);
	var url = this.serverAddr + "/Sessions/Playing/Progress";
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		var contentToPost = '{"QueueableMediaTypes":["Video"],"CanSeek":false,"ItemId":'+showId+',"MediaSourceId":'+MediaSourceID+',"IsPaused":false,"IsMuted":false,"PositionTicks":'+(ticks*10000)+',"PlayMethod":'+PlayMethod+'}';
		xmlHttp.open("POST", url , true); //must be true!
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(contentToPost);
	}	
}

//------------------------------------------------------------
//      Item Watched Status Functions
//------------------------------------------------------------

Server.setWatchedStatus = function(id) {
	var url = this.serverAddr + "/Users/" + this.UserID + "/PlayedItems/" + id;
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		xmlHttp.open("POST", url , true); //must be true!
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(null);
	}
}

Server.deleteWatchedStatus = function(id) {
	var url = this.serverAddr + "/Users/" + this.UserID + "/PlayedItems/" + id;
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		xmlHttp.open("DELETE", url , true); //must be true!
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(null);
	}
}

//------------------------------------------------------------
//      GuiIP Functions
//------------------------------------------------------------
Server.testConnectionSettings = function (server,fromFile) {	
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		//xmlHttp.open("GET", ("http://" + server + "/mediabrowser/System/Info?format=json") , false); //must be false
		xmlHttp.open("GET", ("http://" + server + "/mediabrowser/System/Info/Public?format=json") , false); //must be false
		xmlHttp.setRequestHeader("Content-Type", 'application/json');
		xmlHttp.send(null);
		
	    if (xmlHttp.status != 200) {
	    	if (fromFile == true) {
	    		GuiNotifications.setNotification("Please check your server is running and try again","Server Error",true);
		    	GuiPage_Servers.start();
	    	} else {
	    		GuiNotifications.setNotification("Please try again","Wrong Details",true);
	    		GuiPage_NewServer.start();
	    	}
	    } else {
	    	//If server ip changes all saved users and passwords are lost - seems logical
	    	if (fromFile == false) {
	    		var json = JSON.parse(xmlHttp.responseText);
	    		File.saveServerToFile(json.Id,json.ServerName,server); 
	    	}
	       	
	       	//Set Server.serverAddr!
	       	Server.setServerAddr("http://" + server + "/mediabrowser");
	       		
	       	//Check Server Version
	       	if (ServerVersion.checkServerVersion()) {
	       		GuiUsers.start(true);
	       	} else {
	       		ServerVersion.start();
	       	}
	    }
	} else {
	    alert("Failed to create XHR");
	}
}

//------------------------------------------------------------
//      GuiUsers Functions
//------------------------------------------------------------

Server.Authenticate = function(UserId, UserName, Password) {
	var url = Server.getServerAddr() + "/Users/AuthenticateByName?format=json";
    var params =  JSON.stringify({"Username":UserName,"Password":Password});
    
    var xmlHttp = new XMLHttpRequest();	
    xmlHttp.open( "POST", url , false ); //Authenticate must be false - need response before continuing!
    xmlHttp = this.setRequestHeaders(xmlHttp,UserId);
        
    xmlHttp.send(params);
    
    if (xmlHttp.status != 200) {
    	return false;
    } else {
    	var session = JSON.parse(xmlHttp.responseText);
    	this.AuthenticationToken = session.AccessToken;
    	this.setUserName(UserName);
    	return true;
    }
}

Server.Logout = function() {
	var url = this.serverAddr + "/Sessions/Logout";
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		xmlHttp.open("POST", url , true); //must be true!
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(null);
	}	
}

//------------------------------------------------------------
//      Get Content - JSON REQUESTS
//------------------------------------------------------------
Server.getContent = function(url) {
	xmlHttp = new XMLHttpRequest();
	if (xmlHttp) {
		xmlHttp.open("GET", url , false); //must be false
		xmlHttp = this.setRequestHeaders(xmlHttp);
		xmlHttp.send(null);
		    
		if (xmlHttp.status != 200) {
			alert ("Error1")
			Server.Logout;
			GuiUsers.start(true);
		} else {
			return JSON.parse(xmlHttp.responseText);
		}
	} else {
		alert ("Error")
		Server.Logout;
		GuiUsers.start(true);
	}
}