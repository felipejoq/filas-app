const router = require("express").Router();
const Fila = require("../models/Fila");
const Escritorio = require("../models/Escritorio");
const { puedeAtender } = require("../middlewares/atender");

router.get("/atender/fila/:id_fila", (req, res) => {
  Fila.findOne({ _id: req.params.id_fila }, (err, filaDB) => {
    if (err) {
      req.flash("error_msg", "Algo salió mal, intentelo de nuevo.");
      return res.redirect("back");
    }
    if (!filaDB) {
      req.flash("error_msg", "Algo salió mal, intentelo de nuevo.");
      return res.redirect("back");
    }

    res.render("atender/atender-login", {
      fila: filaDB,
      title: "Atender fila"
    });
  });
});

router.post("/atender/fila/:id_fila/tickets", puedeAtender, (req, res) => {
  Fila.findOne({ _id: req.params.id_fila })
    .populate("escritorios")
    .exec((err, filaDB) => {

      if (err) {
        req.flash("error_msg", "Algo salió mal, intentelo de nuevo.");
        return res.redirect("back");
      }
      if (!filaDB) {
        req.flash("error_msg", "Algo salió mal, intentelo de nuevo.");
        return res.redirect("back");
      }

      for (let i = 0; i <= filaDB.escritorios.length - 1; i++) {
        if (filaDB.escritorios[i].number === req.body.number) {
          return res.render("escritorios/escritorio-atender", {
            fila: filaDB,
            title: "Atender fila: " + filaDB.name,
            escritorio: filaDB.escritorios[i]
          });
        }
      }
    });
});

module.exports = router;
