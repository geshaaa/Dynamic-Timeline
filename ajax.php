<?php
	$action=$_POST["action"];
	switch ($action) {
		case 'addNewEvent':
			require_once ("controllers/EventController.php");
            $eventController = new Controllers\EventController();
            $eventController->addNewEvent();
			break;
			
		case 'getAllEvents':
			require_once ("controllers/EventController.php");
            $eventController = new Controllers\EventController();
            $eventController->getAllEvents();
			break;
		
		default:
			# code...
			break;
	}




?>