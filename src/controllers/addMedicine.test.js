import product from './product.controller';
import {expect ,jest, test} from '@jest/globals';
import request from 'supertest';
import app from '../app';

let productData = { ownerId:'5', productName:"Paracetamol", description:"pene", solutions:"descripcion", unitPrice:'24', stock:'34', expirationDate:'10-09-2023' };

test("Agregar medicamento a inventario", async () => {
   let result =  await product.add(productData);
    expect(typeof result).toBe("object");
})

let sessid = "sessid=a23d15ff9dbf1b8d3a24352b6eb7e140918caaea02304003b266f4429145dbbec7e80819e8d78f042906c25856d13e4ac2f9c932246de875e845f21c6748ae9dead021d78cb01a77b829bd970ef45baad4b27484e835f0a6495ca3ada196498bdcb4807928deb90bd8b394c93afc57ef31e4fa1a816a802927d99843067593fc86a455cc1e2ff5910a1e994ce72e47490e5e76038d2dbb";
test ('POST /productos', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'probandoreceta', solutions:'solucionesperras', unitPrice:'123', stock:'345', expirationDate:'2023-01-15'})
    .set("Cookie", [sessid]));
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('json');
});

test ('Debería dar error al dejar el nombre vacio', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'', description:'probandoreceta', solutions:'solucionesperras', unitPrice:'123', stock:'345', expirationDate:'2023-01-15'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("El nombre del producto esta vacio");
});

test ('Debería dar error al dejar la descripcion vacia', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'', solutions:'solucionesperras', unitPrice:'123', stock:'345', expirationDate:'2023-01-15'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("La descripcion esta vacia");
});

test ('Debería dar error al dejar la solucion vacia', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'probandoreceta', solutions:'', unitPrice:'123', stock:'345', expirationDate:'2023-01-15'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("La solucion esta vacia");
});

test ('Debería dar error al dejar el precio vacio', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'probandoreceta', solutions:'solucionesperras', unitPrice:'', stock:'345', expirationDate:'2023-01-15'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("El valor del precio no es correcto");
});

test ('Debería dar error al dejar el stock vacio', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'probandoreceta', solutions:'solucionesperras', unitPrice:'123', stock:'', expirationDate:'2023-01-15'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("El valor de las existencias no es correcto");
});

test ('Debería dar error al dejar la fecha vacia', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'probandoreceta', solutions:'solucionesperras', unitPrice:'123', stock:'345', expirationDate:''})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("La fecha debe tener el formato dd/mm/yyyy");
});


test ('Debería dar error al introducir un caracter no alfanumerico en el nombre', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'\\', description:'probandoreceta', solutions:'solucionesperras', unitPrice:'123', stock:'345', expirationDate:'05-10-2024'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("Solo carateres alfanumericos en el nombre");
});

test ('Debería dar error al introducir un caracter no alfanumerico en la descripcion', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'\\', solutions:'solucionesperras', unitPrice:'123', stock:'345', expirationDate:'05-10-2024'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("Solo caracteres alfanumericos en la descripcion");
});

test ('Debería dar error al introducir un caracter no alfanumerico en las soluciones', async () => {
    
    const response = await ((request(app)
    .post('/dashboard/product/add'))
    .send({ownerId:'1', productName:'Paracetamol', description:'probandoreceta', solutions:'\\', unitPrice:'123', stock:'345', expirationDate:'05-10-2024'})
    .set("Cookie", [sessid]))
    .expect(200);
    expect(typeof response.body.errors).toBe("object");
    expect(response.body.errors[0]).toBe("Solo caracteres alfanumericos en las soluciones");
});