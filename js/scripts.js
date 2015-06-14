$(function() {
	$( ".datepicker" ).datepicker();
	$( "#divColorpicker").removeClass("open");
	getAllEvents();
});

var events=[];

function getAllEvents() {
	$.ajax({
		url: "ajax.php",
		type:'post',
		data:{action:'getAllEvents'},
		dataType: "json",
		success: function(data) {
			data.forEach(function(currEvent) {
				addEventToTimeline(currEvent,false);
			});
		},
		error: function(xhr, status, error) {
			showError("Error while trying to connect to database");
		}
	});
}

function compareTwoEvents(a,b) {
	var firstEventDate=new Date(a.eventDate).getTime();
	var secondEventDate=new Date(b.eventDate).getTime();
	
	if (firstEventDate > secondEventDate) {
		return -1;
	}
	else if (firstEventDate < secondEventDate){
		return 1;
	}
	else {
		return 0;
	}
}


function addEventToTimeline (currEvent,withAnimation) {
	
	events.push(currEvent);
	events.sort(compareTwoEvents);
	
	var indexes = $.map(events, function(obj, index) {
    if(obj.id == currEvent["id"]) {
        return index;
		}
	})

	var currEventIndex = indexes[0];
	for(var i=currEventIndex+1;i<events.length;i++) {
		var currDomElement=$('#event'+events[i]['id']);
		if (withAnimation) {
			currDomElement.animate({top : "+=" + currDomElement.css('height')},2000);
		}
		else {
			currDomElement.css("top","+=" + currDomElement.css('height'));
		}
	}
	
	var timelineDiv=$('#timeline');
	
	var mainDiv=$('<div>').addClass('event').attr({id : 'event' + currEvent["id"]})
	var dateDiv=$('<div>').addClass('event-date').append($('<p>').html(currEvent["eventDate"]));
	var timeDiv=$('<div>').addClass('event-time').css({"background" : currEvent["color"]});
	var nameDiv=$('<div>').addClass('event-name').append($('<p>').html(currEvent["name"]));
	var endDiv=$('<div>').addClass('clearfix');
	
	mainDiv.append(dateDiv);
	mainDiv.append(timeDiv);
	mainDiv.append(nameDiv);
	mainDiv.append(endDiv);
	
	timelineDiv.append(mainDiv);
	
	timeDiv.css('height',timeDiv.css('width'));
	
	if (withAnimation) {
		mainDiv.animate({
			top: "-=" + (events.length-(currEventIndex+1))*parseInt(dateDiv.css('height'))		
		},2000
		);
	}
	else {
		mainDiv.css("top","-=" + (events.length-(currEventIndex+1))*parseInt(dateDiv.css('height')));
	}
	
	checkLineHeight(dateDiv.css('height'));

}

function checkLineHeight(divHeight) {
	
	var length=events.length;
	var height=$('#timeline').css('height');
	
	eventsHeight=length*parseInt(divHeight);
	if(eventsHeight>parseInt(height)) {
			$('#timeline').css('height',eventsHeight);
	}
	
}

function addNewEvent() {
	showError('');
	var error = false;
	var ajaxData={"action" : 'addNewEvent'};
	var inputs = $('input');
	for(var i=0; i<inputs.length;i++) {
		var currentElement=$(inputs[i]);
		var name =currentElement.attr("name");
		var value=currentElement.val();

		currentElement.removeClass("error");
		if(!value) {
			showError("Please enter " + name);
			currentElement.addClass("error");	
			error=true;
		}
		ajaxData[name]= value;
		
	}
	if(!error) {
		$.ajax({
			url: "ajax.php",
			type:'post',
			data:ajaxData,
			dataType: "json",
			success: function(data) {
				addEventToTimeline(data[0],true);
				var inputs = $('input');
				for(var i=0; i<inputs.length;i++) {
					$(inputs[i]).val('');
				}
				$('.bfh-colorpicker-icon').removeAttr('style');
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				showError("Error while trying to insert a record in database");
			}
		});
	}
}

function showError(msg) {
	$('#errorMsg').html(msg);
	
}