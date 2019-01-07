const { io } = require("../index");
const Fila = require("../models/Fila");
const Ticket = require("../models/Ticket");

io.on("connection", client => {
  console.log("Cliente conectado: ", client.id);

  client.on("disconnect", () => {
    console.log("El cliente se ha desconectado");
  });

  client.on("solicita-ticket", async (fila, callback) => {
    console.log("me envian id de la fila: ", fila.id);
    client.join(fila.id);
    console.log("Salas a las que está conectado el cliente: ", client.rooms);

    if (!fila.id) {
      return callback({
        ok: false,
        mensaje: "Faltan datos para solicitar el ticket"
      });
    }

    Fila.findById(fila.id, async (err, filaDB) => {
      if (err) {
        return callback({
          ok: false,
          mensaje: "Hubo un error, vuelva a intentarlo."
        });
      }

      console.log("La fila tiene una cola de: ", filaDB.resumen.ultimo);

      const nuevoTicket = new Ticket({
        numero: filaDB.resumen.ultimo + 1,
        atendido: false,
        fila: filaDB.id
      });

      nuevoTicket.save((err, ticketGuardado) => {
        if (err) {
          return callback({
            ok: false,
            mensaje: "Hubo un error al generar el ticket, vuelva a intentarlo."
          });
        }

        filaDB.tickets.push(nuevoTicket);
        console.log(new Date().getDate());

        if (filaDB.resumen.ultimo) {
          filaDB.resumen = {
            ultimo: filaDB.resumen.ultimo + 1,
            hoy: new Date().getDate()
          };
        } else {
          filaDB.resumen.ultimo = filaDB.resumen.ultimo + 1;
          filaDB.resumen.hoy = new Date().getDate();
        }

        filaDB.save();
      });
      console.log(
        "La fila tiene una cola de (DESPUES): ",
        filaDB.resumen.ultimo
      );

      client.broadcast.to(filaDB.id).emit("siguienteTicket", {
        fila: filaDB,
        numero: filaDB.resumen.ultimo + 1
      });

      callback({
        fila: filaDB,
        numero: filaDB.resumen.ultimo + 1
      });
    });
  });

  client.on("atender-ticket", async (fila, callback) => {
    console.log("Solicitan atender ticket de la fila: ", fila.id);
    client.join(fila.id);

    Fila.findOne({ _id: fila.id })
      .populate("tickets")
      .populate("ultimos4")
      .exec(async (err, filaDB) => {
        if (filaDB.tickets.length === 0) {
          return callback({
            ok: false,
            mensaje: "Hubo un error",
            ticket: "No hay gente en la fila."
          });
        }

        const ticketFila = filaDB.tickets[0];
        filaDB.tickets.shift(); // Elimina el primer ticket de la Fila.

        ticketFila.atendido = true;
        ticketFila.escritorio = fila.escritorio;

        filaDB.ultimos4.unshift(ticketFila); // Agrega el ticket al inicio de la fila de atendidos

        if (filaDB.ultimos4.length > 4) {
          filaDB.ultimos4.splice(-1, 1); // Borrar el último elemento de un arreglo.
        }

        filaDB.save((err, filaGuardada) => {

          if (filaGuardada) {
            Ticket.findOneAndUpdate(
              { _id: ticketFila._id },
              {
                atendido: ticketFila.atendido,
                escritorio: ticketFila.escritorio
              },
              { new: true },
              (err, ticketActualizado) => {
                client.broadcast.to(filaGuardada._id).emit("atender-ticket", {
                  ok: true,
                  mensaje: "Siguiente ticket",
                  ticket: ticketActualizado,
                  ultimos4: filaGuardada.ultimos4
                });
  
                client.broadcast.to(filaGuardada._id).emit("actualizar-tablero", {
                  ok: true,
                  ultimos4: filaGuardada.ultimos4,
                  fila: filaGuardada
                });
                
                return callback({
                  ok: true,
                  mensaje: "Siguiente ticket",
                  ticket: ticketActualizado,
                  ultimos4: filaGuardada.ultimos4
                });
              }
            );
          }
        });

        
      });
  });

  client.on("solicita-tablero", async (fila, callback) => {
    client.join(fila.id);
    Fila.findOne({ _id: fila.id })
      .populate("ultimos4")
      .exec((err, filaDB) => {

        if(err){
          return callback({
            ok: false,
            ultimos4: null,
            fila: null
          });
        }

        return callback({
          ok: true,
          ultimos4: filaDB.ultimos4,
          fila: filaDB
        });
      });
  });
});
