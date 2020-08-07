/* function getEdit(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl,false); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Ty    pe", "text/plain;charset=UTF-8");
    xmlHttp.send();
    console.log("in the function");
    
}
function postDelete(id){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", '/delete'); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    xmlHttp.send(id);
    console.log("in the function");
}
*/
/*
$("#edit").click(function(event){
    console.log("inside the function");
    $.get('/',function(responsetext){
        alert(responsetext);
    });

});
*/

$("#logout").click(function(){
    var csrf= $(this).find("input").val();
    console.log(csrf);
    console.log("inside function");
    $.post('https://kay-shop.herokuapp.com/logout', {_csrf:csrf}  ,// url
   function(data, status, jqXHR) {// success callback
          //  $('p').append('status: ' + status + ', data: ' + data);
          window.location.replace("https://kay-shop.herokuapp.com");
    });
  });
