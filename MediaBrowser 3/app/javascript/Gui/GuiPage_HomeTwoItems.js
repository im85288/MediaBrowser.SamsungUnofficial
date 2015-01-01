var GuiPage_HomeTwoItems = {
		
		selectedBannerItem : 0,
		
		ItemData : null,
		selectedItem : 0,
		topLeftItem : 0,
		isResume : false,
		
		ItemData2 : null,
		selectedItem2 : -1,
		topLeftItem2 : 0,
		isResume2 : false,
		
		menuItems : [],
		
		MAXCOLUMNCOUNTPORTRAIT : 7,
		MAXCOLUMNCOUNT : 3,
		MAXROWCOUNT : 1,
		
		divprepend1 : "",
		divprepend2 : "bottom_",
		
		startParams : []
}

GuiPage_HomeTwoItems.getMaxDisplay = function() {
	if ((this.ItemData.Items[0].Type == "Series" || this.ItemData.Items[0].Type == "Movie") && this.isResume != true) {
		return this.MAXCOLUMNCOUNTPORTRAIT * this.MAXROWCOUNT;
	} else {
		return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
	}
}

GuiPage_HomeTwoItems.getMaxDisplayBottom = function() {
	if ((this.ItemData2.Items[0].Type == "Series" || this.ItemData2.Items[0].Type == "Movie")&& this.isResume2 != true) {
		return this.MAXCOLUMNCOUNTPORTRAIT * this.MAXROWCOUNT;
	} else {
		return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
	}
}

GuiPage_HomeTwoItems.start = function(title1, url1, title2, url2,selectedItem,topLeftItem,isTop) {
	//Save Start Params
	this.startParams = [title1, url1, title2, url2];
	alert (url2);
	
	//If Music alter MaxColumnCount
	this.MAXCOLUMNCOUNT = 3;
	if (title1 == "Latest Albums") {
		this.MAXCOLUMNCOUNT = 5;
	}
	
	//Load Data
	this.ItemData = Server.getContent(url1);
	this.ItemData2 = Server.getContent(url2);	
	
	//If array like MoviesRecommended alter 
	if (title1 == "Suggested For You") {
		if (this.ItemData[0] === undefined){
			this.ItemData[0] = {"Items":[]}; //Create empty Items array and continue
		}
		this.ItemData = this.ItemData[0];
	}
	if (title2 == "Suggested For You") {
		if (this.ItemData2[0] === undefined){
			this.ItemData2[0] = {"Items":[]}; //Create empty Items array and continue
		}
		this.ItemData2 = this.ItemData2[0];
	}
	
	//Latest Page Fix
	if (title1 == "New TV") {
		this.ItemData.Items = this.ItemData;
	}
	if (title2 == "New TV") {
		this.ItemData2.Items = this.ItemData2;
	}
	
	if (this.ItemData.Items.length > 0 && this.ItemData2.Items.length > 0) {
		//Proceed as Normal
		//Set TopLeft
		if (isTop == false) {
			this.selectedItem = -1;
			this.selectedItem2 = selectedItem; //Prevents any item being shown as selected! 
			this.topLeftItem = 0;
			this.topLeftItem2 = topLeftItem;
			//Set Focus for Key Events
			document.getElementById("GuiPage_HomeTwoItemsBottom").focus();	
		} else {
			this.selectedItem = selectedItem;
			this.selectedItem2 = -1; //Prevents any item being shown as selected! 
			this.topLeftItem = topLeftItem;
			this.topLeftItem2 = 0;
			//Set Focus for Key Events
			document.getElementById("GuiPage_HomeTwoItems").focus();			
		}
		
		//Set PageContent
		document.getElementById("pageContent").innerHTML = "<div id=bannerSelection class='guiDisplay_Series-Banner'></div>" +
				"<div id=Center class='HomeOneCenter'>" + 
				"<p style='font-size:18px;padding-left:11px;'>"+title1+"</p><div id='TopRow' style='margin-bottom:30px'><div id=Content></div></div>" +
				"<p style='font-size:18px;padding-left:11px;'>"+title2+"</p><div id='BottomRow'><div id=Content2></div></div>" +
				"</div>";
	
		//Set isResume based on title - used in UpdateDisplayedItems
		if (title1 == "Resume" || title1 == "Resume All Items"  || title1 == "TV Next Up") {
			this.isResume = true;
		} else {
			this.isResume = false;
		}
		
		//If to determine positioning of content
		document.getElementById("Center").style.top = "70px";
		document.getElementById("Center").style.left = "100px";
		document.getElementById("Center").style.width = "760px";
		
		if ((this.ItemData.Items[0].Type == "Series" || this.ItemData.Items[0].Type == "Movie") && this.isResume != true) {
			document.getElementById("TopRow").style.marginLeft = "20px";
		}
		
		if ((this.ItemData2.Items[0].Type == "Series" || this.ItemData2.Items[0].Type == "Movie") && this.isResume2 != true) {
			document.getElementById("BottomRow").style.marginLeft = "20px";
		}
		
		//Generate Banner Items
		this.menuItems = GuiMainMenu.menuItems.slice(1); 
		
		//Remove Settings, Logout & Music-Player from the end!
		if (this.menuItems[this.menuItems.length-1] == "Log-Out") {
			this.menuItems.pop();
		}
		if (this.menuItems[this.menuItems.length-1] == "Settings") {
			this.menuItems.pop();
		}
		if (this.menuItems[this.menuItems.length-1] == "Music-Player") {
			this.menuItems.pop();
		}
		
		//Generate Banner display
		for (var index = 0; index < this.menuItems.length; index++) {
			if (index != this.menuItems.length-1) {
				document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding'>"+this.menuItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";			
			} else {
				document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem'>"+this.menuItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";					
			}
		}
		
		//Display first XX series
		this.updateDisplayedItems();
		
		//Update Selected Collection CSS
		var updateCounter = (isTop == true) ? false : true;
		this.updateSelectedItems(updateCounter);	

		//Set isResume based on title - used in UpdateDisplayedItems
		if (title2 == "Resume" || title2 == "Resume All Items" || title2 == "TV Next Up") {
			this.isResume2 = true;
		} else {
			this.isResume2 = false;
		}
		
		//Display first XX series
		this.updateDisplayedItems2();
			
		//Update Selected Collection CSS 
		var updateCounter2 = (isTop == true) ? true : false;
		this.updateSelectedItems2(updateCounter2);
		
		
	} else if (this.ItemData.Items.length > 0 && this.ItemData2.Items.length == 0) {
		GuiPage_HomeOneItem.start(title1,url1,0,0);
	} else if (this.ItemData.Items.length == 0 && this.ItemData2.Items.length > 0) {
		GuiPage_HomeOneItem.start(title2,url2,0,0);
	} else if (this.ItemData.Items.length == 0 && this.ItemData2.Items.length == 0) {
		//No data to Show at all!!
		//Generate Media Collections title & URL!
		GuiPage_HomeOneItem.start(title1,url1,0,0);
	}
}

//---------------------------------------------------------------------------------------------------
//      TOP ITEMS HANDLERS
//---------------------------------------------------------------------------------------------------
GuiPage_HomeTwoItems.updateDisplayedItems = function() {
		Support.updateDisplayedItems(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Content",this.divprepend1,this.isResume);
}

//Function sets CSS Properties so show which user is selected
GuiPage_HomeTwoItems.updateSelectedItems = function (bypassCounter) {
	if ((this.ItemData.Items[0].Type == "Series" || this.ItemData.Items[0].Type == "Movie") && this.isResume != true) {
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"SeriesPortrait Selected","SeriesPortrait",this.divprepend1,bypassCounter);
	} else {
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Series Collection Selected","Series Collection",this.divprepend1,bypassCounter);

	}
}

GuiPage_HomeTwoItems.updateSelectedBannerItems = function() {
	for (var index = 0; index < this.menuItems.length; index++) {
		if (index == this.selectedBannerItem) {
			if (index != this.menuItems.length-1) {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding red";
			} else {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem red";
			}		
		} else {
			if (index != this.menuItems.length-1) {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
			} else {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem";
			}
		}
	}
}

GuiPage_HomeTwoItems.keyDown = function()
{
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode)
	{
		case tvKey.KEY_LEFT:
			alert("LEFT");	
			if (this.selectedItem == -2) {
				this.selectedBannerItem--;
				if (this.selectedBannerItem < 0) {
					this.selectedBannerItem = 0;
				}
				this.updateSelectedBannerItems();	
			} else {
				this.selectedItem--;
				if (this.selectedItem < 0) {
					this.selectedItem = 0;
				} else {
					if (this.selectedItem < this.topLeftItem) {
						this.topLeftItem = this.selectedItem - (this.getMaxDisplay() - 1);
						if (this.topLeftItem < 0) {
							this.topLeftItem = 0;
						}
						this.updateDisplayedItems();
					}
				}
				this.updateSelectedItems();
			}
			
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");	
			if (this.selectedItem == -2) {
				this.selectedBannerItem++;
				if (this.selectedBannerItem >= this.menuItems.length) {
					this.selectedBannerItem--;
				}
				this.updateSelectedBannerItems();
			} else {
				this.selectedItem++;
				if (this.selectedItem >= this.ItemData.Items.length) {
					this.selectedItem--;
				} else {
					if (this.selectedItem >= this.topLeftItem+this.getMaxDisplay() ) {
						this.topLeftItem++;
						this.updateDisplayedItems();
					}
					this.updateSelectedItems();
				}
			}
			break;
		case tvKey.KEY_UP:	
			this.selectedBannerItem = 0;
			this.topLeftItem = 0;
			this.selectedItem = -2;
			//Hide red
			this.updateDisplayedItems();
			this.updateSelectedItems(true);	
			//update selected banner item
			this.updateSelectedBannerItems();
			break;	
		case tvKey.KEY_DOWN:
			alert ("DOWN");
			if (this.selectedItem == -2) {
				this.selectedItem = 0;
				this.selectedBannerItem = -1;
				this.updateSelectedBannerItems();
				this.updateSelectedItems(false);	
			} else {
				//1st row to 2nd row items
				if (this.ItemData2.Items.length > 0) {
					//Set to 0 and reset display, then set to -1 and update selected so none are selected, then reset to 0
					this.selectedItem = 0;
					this.topLeftItem = 0;
					//Only update if there are items to show!!!
					if (this.ItemData.Items.length > 0) {
						this.updateDisplayedItems();
					}
					this.selectedItem = -1;
					this.updateSelectedItems(true);		
					this.selectedItem = 0;
					
					//Set Focus
					document.getElementById("GuiPage_HomeTwoItemsBottom").focus();
					//Update Selected 
					this.selectedItem2 = 0;
					this.updateSelectedItems2(false);
				}
			}
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			this.processSelectedItem(this.ItemData,true);
			break;	
		case tvKey.KEY_PLAY:
			alert ("PLAY");
			this.playSelectedItem(this.ItemData.Items,true);
			break;
		case tvKey.KEY_TOOLS:
			alert ("TOOLS KEY");
			widgetAPI.blockNavigation(event);	
			//Return added here - deleted in MainMenu if user does return
			if (this.selectedItem == -2) {
				document.getElementById("bannerItem"+this.selectedBannerItem).class = "guiDisplay_Series-BannerItem";
				this.selectedItem = 0;
				this.topLeftItem = 0;
			}
			Support.updateURLHistory("GuiPage_HomeTwoItems",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],this.selectedItem,this.topLeftItem,true);
			GuiMainMenu.requested("GuiPage_HomeTwoItems",this.divprepend1 + this.ItemData.Items[this.selectedItem].Id);
			break;
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;
		case tvKey.KEY_GREEN:
			if (this.ItemData.Items[this.selectedItem].MediaType == "Video") {
				if (this.ItemData.Items[this.selectedItem].UserData.Played == true) {
					Server.deleteWatchedStatus(this.ItemData.Items[this.selectedItem].Id);
					this.ItemData.Items[this.selectedItem].UserData.Played = false
				} else {
					Server.setWatchedStatus(this.ItemData.Items[this.selectedItem].Id);
					this.ItemData.Items[this.selectedItem].UserData.Played = true
				}
				this.updateDisplayedItems();
				this.updateSelectedItems();
			}
			break;	
		case tvKey.KEY_BLUE:	
			Support.logout();
			break;
		case tvKey.KEY_INFO:
			alert ("INFO KEY");
			GuiHelper.toggleHelp("GuiPage_HomeTwoItems");
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}


//---------------------------------------------------------------------------------------------------
//      BOTTOM ITEMS HANDLERS
//---------------------------------------------------------------------------------------------------

GuiPage_HomeTwoItems.updateDisplayedItems2 = function() {
	Support.updateDisplayedItems(this.ItemData2.Items,this.selectedItem2,this.topLeftItem2,
			Math.min(this.topLeftItem2 + this.getMaxDisplayBottom(),this.ItemData2.Items.length),"Content2",this.divprepend2,this.isResume2);
}

//Function sets CSS Properties so show which user is selected
GuiPage_HomeTwoItems.updateSelectedItems2 = function (bypassCounter) {
	if ((this.ItemData2.Items[0].Type == "Series" || this.ItemData2.Items[0].Type == "Movie") && this.isResume2 != true) {
		Support.updateSelectedNEW(this.ItemData2.Items,this.selectedItem2,this.topLeftItem2,
				Math.min(this.topLeftItem2 + this.getMaxDisplayBottom(),this.ItemData2.Items.length),"SeriesPortrait Selected","SeriesPortrait",this.divprepend2,bypassCounter);
	} else {
		Support.updateSelectedNEW(this.ItemData2.Items,this.selectedItem2,this.topLeftItem2,
				Math.min(this.topLeftItem2 + this.getMaxDisplayBottom(),this.ItemData2.Items.length),"Series Collection Selected","Series Collection",this.divprepend2,bypassCounter);

	}
}


GuiPage_HomeTwoItems.bottomKeyDown = function()
{
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode)
	{
		case tvKey.KEY_LEFT:
			alert("LEFT BOTTOM");	
			this.selectedItem2--;
			if (this.selectedItem2 < 0) {
				this.selectedItem2++;
			} else {
				if (this.selectedItem2 < this.topLeftItem2) {
					this.topLeftItem2--;
					if (this.topLeftItem2 < 0) {
						this.topLeftItem2 = 0;
					}
					this.updateDisplayedItems2();
				}			
			}
			this.updateSelectedItems2();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT BOTTOM");	
			this.selectedItem2++;
			if (this.selectedItem2 >= this.ItemData2.Items.length) {
				this.selectedItem2--;
			} else {
				if (this.selectedItem2 >= this.topLeftItem2+this.getMaxDisplayBottom() ) {
					this.topLeftItem2++;
					this.updateDisplayedItems2();
				}			
			}
			this.updateSelectedItems2();
			break;
		case tvKey.KEY_UP:
			alert("UP BOTTOM");
			if (this.ItemData.Items.length > 0) {
				//Set to 0 and reset display, then set to -1 and update selected so none are selected, then reset to 0
				this.selectedItem2 = 0;
				this.topLeftItem2 = 0;
				//Only update if there are items to show!!!
				if (this.ItemData2.Items.length > 0) {
					this.updateDisplayedItems2();
				}
				this.selectedItem2 = -1;
				this.updateSelectedItems2(true);		
				this.selectedItem2 = 0;

				//Set Focus
				document.getElementById("GuiPage_HomeTwoItems").focus();
				//Update Selected 
				this.selectedItem = 0;
				this.updateSelectedItems(false);
			}
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER BOTTOM");
			this.processSelectedItem(this.ItemData2,false);
			break;	
		case tvKey.KEY_PLAY:
			this.playSelectedItem(this.ItemData2.Items,false);
			break;	
		case tvKey.KEY_YELLOW:
			GuiMusicPlayer.showPlayer();
			break;
		case tvKey.KEY_TOOLS:
			alert ("TOOLS KEY BOTTOM");
			widgetAPI.blockNavigation(event);
			Support.updateURLHistory("GuiPage_HomeTwoItems",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],this.selectedItem2,this.topLeftItem2,false);				
			GuiMainMenu.requested("GuiPage_HomeTwoItemsBottom",this.divprepend2 + this.ItemData2.Items[this.selectedItem2].Id);
			break;
		case tvKey.KEY_RETURN:
			alert("RETURN BOTTOM");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;
		case tvKey.KEY_GREEN:
			if (this.ItemData2.Items[this.selectedItem2].MediaType == "Video") {
				if (this.ItemData2.Items[this.selectedItem2].UserData.Played == true) {
					Server.deleteWatchedStatus(this.ItemData2.Items[this.selectedItem2].Id);
					this.ItemData2.Items[this.selectedItem2].UserData.Played = false
				} else {
					Server.setWatchedStatus(this.ItemData2.Items[this.selectedItem2].Id);
					this.ItemData2.Items[this.selectedItem2].UserData.Played = true
				}
				this.updateDisplayedItems2();
				this.updateSelectedItems2();
			}
			break;	
		case tvKey.KEY_BLUE:	
			Support.logout();
			break;	
		case tvKey.KEY_INFO:
			alert ("INFO KEY");
			GuiHelper.toggleHelp("GuiPage_HomeTwoItems");
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY BOTTOM");
			widgetAPI.sendExitEvent();
			break;
	}
}

//--------------------------------------------------------------------------------------------------------

GuiPage_HomeTwoItems.processSelectedItem = function (array,isTop) {
	if (this.selectedItem == -2) {
		Support.updateURLHistory("GuiPage_HomeTwoItems",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],0,0,true);
		switch (this.menuItems[this.selectedBannerItem]) {
		case "Media-Folders":
			var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&CollapseBoxSetItems=false&fields=SortName");	
			GuiDisplayOneItem.start("Media Folders", url,0,0);
			break;
		case "Channels":
			var url = Server.getCustomURL("/Channels?userId="+Server.getUserID()+"&format=json");	
			GuiDisplayOneItem.start("Channels", url,0,0);
			break;
		case "Collections":	
			var url = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=BoxSet&Recursive=true&fields=SortName");
			GuiDisplayOneItem.start("Collections", url,0,0);
			break;		
		case "TV":
			var url = Server.getItemTypeURL("&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&CollapseBoxSetItems=false&recursive=true");
			GuiDisplay_Series.start("All Series",url,0,0);
			break;	
		case "Movies":
			var url = Server.getItemTypeURL("&IncludeItemTypes=Movie&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&CollapseBoxSetItems=false&recursive=true");
			GuiDisplay_Series.start("All Movies",url,0,0);
			break;
		}
	} else {
		var selectedItem = 0;
		var topLeftItem = 0;
		var isLatest = false;
		
		if (isTop == true) {
			selectedItem = this.selectedItem;
			topLeftItem = this.topLeftItem;
			if (this.startParams[0] == "New TV") {
				isLatest = true;
			}
		} else {
			selectedItem = this.selectedItem2;
			topLeftItem = this.topLeftItem2;
			if (this.startParams[2] == "New TV") {
				isLatest = true;
			}
		}
		
		Support.processSelectedItem("GuiPage_HomeTwoItems",array,this.startParams,selectedItem,topLeftItem,isTop,null,isLatest); 
	}
}

GuiPage_HomeTwoItems.playSelectedItem = function (array,isTop) {
	var selectedItem = 0;
	var topLeftItem = 0;
		
	if (isTop == true) {
		selectedItem = this.selectedItem;
		topLeftItem = this.topLeftItem;
	} else {
		selectedItem = this.selectedItem2;
		topLeftItem = this.topLeftItem2;
	}
	
	if (array[selectedItem].MediaType == "Video") {
		Support.updateURLHistory("GuiPage_HomeTwoItems",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],selectedItem,topLeftItem,isTop);
		var url = Server.getItemInfoURL(array[selectedItem].Id);
		GuiPlayer.start("PLAY",url,array[selectedItem].UserData.PlaybackPositionTicks / 10000);
	}	
}