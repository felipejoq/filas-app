var socket = io();
var id_fila = $("#_fila").val();
var num_escritorio = $("#_escritorio").val();
var lblNumTicket = $('#lblNumTicket');

// Conexión y desconexión del servidor.
socket.on("connect", function() {
  console.log("Conectado al servidor.");
});

socket.on("disconnect", function() {
  console.log("Se perdió la conexión con el servidor");
});


$('#btnAtenderTicket').on('click', function(){
    console.log('Click en el boton para solicitar ticket');
    socket.emit('atender-ticket', { id: id_fila, escritorio: num_escritorio }, function(resp){
      console.log(resp);
      if(resp.ok){
        lblNumTicket.text(resp.ticket.numero); 
      }else{
        lblNumTicket.text(resp.ticket);
      }
    });
  });