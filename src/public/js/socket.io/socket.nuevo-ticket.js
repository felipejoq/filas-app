var socket = io();
var id_fila = $("#_fila").val();
var numeroTicket = $('#numeroTicket');

socket.on("connect", function() {
  console.log("Conectado al servidor.");

});

socket.on("disconnect", function() {
  console.log("Se perdió la conexión con el servidor");
});

$('#btnSolTicket').on('click', function(){
  console.log('Click en el boton para solicitar ticket');
  socket.emit('solicita-ticket', { id: id_fila }, function(siguienteTicket){
    console.log(siguienteTicket);
    numeroTicket.text(siguienteTicket.numero);
  });
});

socket.on('siguienteTicket', function(siguienteTicket) {
  console.log(siguienteTicket);
  numeroTicket.text(siguienteTicket.numero);
})

socket.on('tamano-fila', function(info) {
  console.log('Tamaño de la fila: ', info);
})
