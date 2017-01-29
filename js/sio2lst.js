$(function() {

    var ref = firebase.database().ref("pcustomers");
	ref.on("value", 
	function(snapshot) {
	   	jsfRenewList(snapshot);
	}, 
	function(error) {
	   	console.log("Error: " + error.code);
	});

});

function jsfRenewList(snapshot) {
	var vsBody = "";
	var key = "";
	var childData = {};
	snapshot.forEach(function(childSnapshot) {
	    key = childSnapshot.key;
	    childData = childSnapshot.val();
	    vsBody += "<tr><td>"+childData.pcid+"</td><td>"+childData.pcname+"</td><td>"+childData.pcaddr+"</td><td>"+childData.pctel+"</td></tr>";
	});

	$("#theList > tbody").html(vsBody);
}