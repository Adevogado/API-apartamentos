const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  child,
  get,
  set,
  push,
  remove,
} = require("firebase/database");

// Configurações do Firebase
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

// Inicializa o Firebase
const appFirebase = initializeApp(firebaseConfig);
const database = getDatabase(appFirebase);

app.use(bodyParser.json({ limit: "15mb" }));
app.use(cors());

app.get("/apartamentos", async (req, res) => {
  try {
    const apartamentosRef = ref(database, "apartamentos");
    const snapshot = await get(apartamentosRef);
    if (snapshot.exists()) {
      const apartamentos = [];
      snapshot.forEach((childSnapshot) => {
        apartamentos.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      res.json(apartamentos);
    } else {
      res.status(404).send("Nenhum apartamento encontrado");
    }
  } catch (error) {
    console.error("Erro ao consultar apartamentos:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/apartamentos/:id", async (req, res) => {
  const apartamentoId = req.params.id;
  try {
    const apartamentoRef = child(
      ref(database),
      `apartamentos/${apartamentoId}`
    );
    const snapshot = await get(apartamentoRef);
    if (snapshot.exists()) {
      res.json({ id: snapshot.key, ...snapshot.val() });
    } else {
      res.status(404).send("Apartamento não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar apartamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.post("/apartamentos", async (req, res) => {
  try {
    const novoApartamento = req.body;
    const apartamentoId = novoApartamento.id; // Obtém o ID fornecido no corpo da solicitação
    const apartamentoRef = child(
      ref(database),
      `apartamentos/${apartamentoId}`
    );
    await set(apartamentoRef, novoApartamento);
    res.status(201).json({ id: apartamentoId, ...novoApartamento });
  } catch (error) {
    console.error("Erro ao inserir novo apartamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.put("/apartamentos/:id", async (req, res) => {
  const apartamentoId = req.params.id;
  try {
    const dadosAtualizados = req.body;
    const apartamentoRef = child(
      ref(database),
      `apartamentos/${apartamentoId}`
    );
    const snapshot = await get(apartamentoRef);
    if (snapshot.exists()) {
      await set(apartamentoRef, dadosAtualizados);
      res.status(200).send("Apartamento atualizado com sucesso");
    } else {
      res.status(404).send("Apartamento não encontrado");
    }
  } catch (error) {
    console.error("Erro ao atualizar apartamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.delete("/apartamentos/:id", async (req, res) => {
  const apartamentoId = req.params.id;
  try {
    const apartamentoRef = child(
      ref(database),
      `apartamentos/${apartamentoId}`
    );
    const snapshot = await get(apartamentoRef);
    if (snapshot.exists()) {
      await remove(apartamentoRef);
      res.status(200).send("Apartamento excluído com sucesso");
    } else {
      res.status(404).send("Apartamento não encontrado");
    }
  } catch (error) {
    console.error("Erro ao excluir apartamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
