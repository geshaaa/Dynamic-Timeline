<?php namespace Controllers;

use DatabaseController as DB;
	
	class EventController {

		private $db;
		
		public function __construct() {
			$link = mysql_connect('localhost', 'root', '');
			if (!$link) {
				die('Could not connect: ' . mysql_error());
			}
			else {
				mysql_select_db('events',$link);
				$this->db=$link;
			}

		}

		public function addNewEvent() {
			
			$color=$_POST["color"];
			$date=date('Y-m-d',strtotime($_POST["date"]));
			$name=$_POST["name"];
			if(isset($_COOKIE["userIdentificator"])) {
				$user=$_COOKIE["userIdentificator"];
			}
			else $user=1;
			
			$sql="Insert into events (eventDate,color,name,user) values ('$date','$color','$name','$user')";
			$result=mysql_query($sql,$this->db);
			
			if($result) {
				$id=mysql_insert_id($this->db);
				
				$sql="Select * from events where id=$id";
				$result=mysql_query($sql,$this->db);
				
				echo json_encode($this->getArray($result));
			}
			else {
				die("Error while trying to insert a record in database");
			}

		}

		public function getAllEvents() {
			
			if(!isset($_COOKIE["userIdentificator"])) {
				setcookie("userIdentificator", $_SERVER['REMOTE_ADDR'].time(), time() + (60 * 60 * 24 * 30 * 6), "/");
			} else {
				$user=$_COOKIE["userIdentificator"];
				$sql="Select * from events where user like '".$user."' order by eventDate desc";
				$result=mysql_query($sql,$this->db);
				echo json_encode($this->getArray($result));
			}

		}
		
		private function getArray($resource) {
			
			$result=array();
			
			while ($row = mysql_fetch_array($resource, MYSQL_ASSOC)) {
				$result[]=$row;
			}
			
			return $result;
		}
	}




?>