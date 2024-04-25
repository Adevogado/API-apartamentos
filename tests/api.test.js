// Importe o aplicativo Express
const app = require("../server.js"); // Certifique-se de que o caminho para o seu arquivo server.js está correto

// Importe a biblioteca supertest
const request = require("supertest");

describe("Testes das Rotas da API", () => {
  // Teste para a rota GET /apartamentos
  it("Deve retornar uma lista de apartamentos", async () => {
    const response = await request(app).get("/apartamentos");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Teste para a rota GET /apartamentos/:id
  it("Deve retornar um apartamento específico", async () => {
    // Suponha que o ID do apartamento seja '1', ajuste conforme necessário
    const idApartamento = 6;
    const response = await request(app).get(`/apartamentos/${idApartamento}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(idApartamento);
  });

  // Teste para a rota POST /apartamentos
  it("Deve criar um novo apartamento", async () => {
    const novoApartamento = {
      id: "7", // Ajuste o ID conforme necessário
      nome: "Novo Apartamento",
      preco: "2000",
      regiao: "Centro",
      tamanho: "80",
      endereco: "Rua X, 123",
      quartos: "3",
      banheiros: "2",
      contato: "1234567890",
      fotos: "base64",
    };

    const response = await request(app)
      .post("/apartamentos")
      .send(novoApartamento);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(novoApartamento.id);
  });

  // Teste para a rota PUT /apartamentos/:id
  it("Deve atualizar um apartamento existente", async () => {
    const idApartamento = "7"; // Suponha que o ID do apartamento a ser atualizado seja '1'
    const dadosAtualizados = {
      nome: "Apartamento Atualizado",
      preco: "2500",
      // Adicione outras propriedades atualizadas conforme necessário
    };

    const response = await request(app)
      .put(`/apartamentos/${idApartamento}`)
      .send(dadosAtualizados);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Apartamento atualizado com sucesso");
  });

  // Teste para a rota DELETE /apartamentos/:id
  it("Deve excluir um apartamento existente", async () => {
    const idApartamento = "7"; // Suponha que o ID do apartamento a ser excluído seja '2'
    const response = await request(app).delete(
      `/apartamentos/${idApartamento}`
    );
    expect(response.status).toBe(200);
    expect(response.text).toBe("Apartamento excluído com sucesso");
  });
});
