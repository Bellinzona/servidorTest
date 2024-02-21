const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 8080;
const usuarios = []; // Almacena los nombres de los usuarios conectados


app.get("/", (req,res) => {
    res.send("holaa")
})

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("nuevoUsuario", (nombreUsuario) => {
    usuarios.push(nombreUsuario);
    io.emit("nuevoUsuario", nombreUsuario, usuarios);
  });

  socket.on("solicitarMensajes", () => {
    socket.emit("mensajesAnteriores", mensajes);
  });

  socket.on("envioMensaje", (data) => {
    mensajes.push(data);
    io.emit("envioMensaje", data);
  });

  socket.on("disconnect", () => {
    const index = usuarios.findIndex(usuario => usuario.socket === socket);

    if (index !== -1) {
        const usuarioDesconectado = usuarios[index];
        usuarios.splice(index, 1);
        io.emit('usuarioDesconectado', usuarioDesconectado.userId);
    }
  });
});

server.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
