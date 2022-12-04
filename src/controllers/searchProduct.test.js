import request from "supertest";
import app from "../app.js";
import product from "./product.controller.js";

test("Busqueda de medicamentos registrados por nombre", async () => {
    let result = await product.searchProduct("1", "Exaliv", "productName", "11", "1", false);

    expect(typeof result).toBe("object");
    expect(result.length).toBe(1);
});

test("Busqueda de medicamento registrado por descripcion", async () => {
    let result = await product.searchProduct("1", "600mg", "description", "11", "1", false);

    expect(typeof result).toBe("object");
    expect(result.length).toBe(1);
});

test("Busqueda de medicamento registrado por soluciones", async () => {
    let result = await product.searchProduct("1", "dolor", "solutions", "11", "1", false);

    expect(typeof result).toBe("object");
    expect(result.length).toBe(1);
});

test("Busqueda de medicamento registrado por stock", async () => {
    let result = await product.searchProduct("1", "10", "stock", "11", "1", false);

    expect(typeof result).toBe("object");
    expect(result.length).toBe(1);
});

test("Busqueda de medicamento registrado por precio unitario", async () => {
    let result = await product.searchProduct("1", "1000", "unitPrice", "11", "1", false);

    expect(typeof result).toBe("object");
    expect(result.length).toBe(1);
    
});

// NOTE: routes
// NOTE: POST /dashboard/product/find
let sessid = "sessid=a596f404c30e3e41f619e24b11a8d7dd2ddc90fe41c11e7a0a3f8f6786484acf33985fa5875cfa7639f67c320748f36e97f23006c448564322e61f2c055247069a61f6d3c1bdcbb73bbd6a3b20f37e3d58cb2c28ded63976186cc1ac51fd0361a8ef30ec774690ac8cb32ecc4827d49ef1d6df9dc81bfb306e6667d9fb7936dae794a25facc73ca5de7ca44ff99a259e24";

test("Peticion sin enviar cookie de sesion, deberia retornar un statuscode 401", async () => {
    let data = { valueToSearch: 'Exaliv', criteria: 'productName', lastId: 0, rowCount: 12, biggerThan: true };
    await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .expect(401);
});

test ("Deberia dar error al insertar un caracter invalido", async () => {
    let data = { valueToSearch: '#', criteria: 'any', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);

    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors).toContain("El termino de busqueda solo puede tener letras y/o numeros");
});

test ("Busqueda de un medicamento inexistente con el filtro any", async () => {
    let data = { valueToSearch: 'asdf ', criteria: 'any', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);
    expect(response.body.length).toBe(0);
});

test ("Busqueda de medicamento existente con el filtro any", async () => {
    let data = { valueToSearch: 'dolor', criteria: 'any', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
});

test ("Busqueda de medicamento existente con el filtro de nombre del producto", async () => {
    let data = { valueToSearch: 'Exaliv', criteria: 'productName', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
});

test ("Busqueda de medicamento existente con el filtro de descripcion", async () => {
    let data = { valueToSearch: 'mg', criteria: 'description', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
});

test ("Busqueda de medicamento existente con el filtro de soluciones", async () => {
    let data = { valueToSearch: 'dolor', criteria: 'solutions', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
});

test ("Busqueda de medicamento existente con el filtro de stock", async () => {
    let data = { valueToSearch: '100', criteria: 'stock', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
});

test ("Busqueda de medicamento existente con el filtro del precio unitario", async () => {
    let data = { valueToSearch: '25', criteria: 'unitPrice', lastId: 0, rowCount: 12, biggerThan: true };
    let response = await request(app)
        .post("/dashboard/product/find")
        .send(data)
        .set("Cookie", sessid)
        .expect(200);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
});
