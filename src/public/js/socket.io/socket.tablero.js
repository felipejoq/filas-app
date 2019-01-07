var socket = io();

var url = new URL(window.location.href);
var id_fila = url.searchParams.get("fila");
var audio = new Audio('/sound/alert.mp3');

console.log("Id fila: ", id_fila);

socket.on("connect", function() {
  console.log("Conectado al servidor.");
});

socket.on("disconnect", function() {
  console.log("Se perdió la conexión con el servidor");
});

socket.emit("solicita-tablero", { id: id_fila }, function(resp) {
  console.log(resp);
  if (resp.ok && resp.ultimos4.length > 0) {
    $("#num1").text("Ticket " + resp.ultimos4[0].numero);
    $("#escritorio1").text("Escritorio Nº " + resp.ultimos4[0].escritorio);

    if (resp.ultimos4.length > 1) {
      $("#num2").text("Ticket " + resp.ultimos4[1].numero);
      $("#escritorio2").text("Escritorio Nº " + resp.ultimos4[1].escritorio);
    }

    if (resp.ultimos4.length > 2) {
      $("#num3").text("Ticket " + resp.ultimos4[2].numero);
      $("#escritorio3").text("Escritorio Nº " + resp.ultimos4[2].escritorio);
    }

    if (resp.ultimos4.length > 3) {
      $("#num4").text("Ticket " + resp.ultimos4[3].numero);
      $("#escritorio4").text("Escritorio Nº " + resp.ultimos4[3].escritorio);
    }
  } else {
  }
});

socket.on("actualizar-tablero", function(tablero) {
  console.log("Este es el tablero actualizado: ", tablero);

  if (tablero.ok && tablero.ultimos4.length > 0) {

    audio.play();

    $("#num1").text("Ticket " + tablero.ultimos4[0].numero);
    $("#escritorio1").text("Escritorio Nº " + tablero.ultimos4[0].escritorio);

    if (tablero.ultimos4.length > 1) {
      $("#num2").text("Ticket " + tablero.ultimos4[1].numero);
      $("#escritorio2").text("Escritorio Nº " + tablero.ultimos4[1].escritorio);
    }

    if (tablero.ultimos4.length > 2) {
      $("#num3").text("Ticket " + tablero.ultimos4[2].numero);
      $("#escritorio3").text("Escritorio Nº " + tablero.ultimos4[2].escritorio);
    }

    if (tablero.ultimos4.length > 3) {
      $("#num4").text("Ticket " + tablero.ultimos4[3].numero);
      $("#escritorio4").text("Escritorio Nº " + tablero.ultimos4[3].escritorio);
    }
  } else {
  }
});
