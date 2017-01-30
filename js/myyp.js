$(function() {

    var ref = firebase.database().ref("glass");
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
	    vsBody += "<tr><td>"+childData.glid+"</td><td>"+childData.glname+"</td><td>"+childData.gladdr+"</td><td>"+childData.gltel+"</td><td>"+childData.glweb+"</td></tr>";
	});

	$("#theList > tbody").html(vsBody);
}