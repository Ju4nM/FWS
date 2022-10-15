import Cipher from "./Cipher.js";

test("Descripcion de la prueba", () => {
    // Este es el callback que contendra 
    // el bloque de codigo que ejeuctara la prueba
});

test("Comparacion de hashes unidireccionales funcion: compareHashes", async () => {
    let result = await Cipher.compareHashes("tacos", "$2b$10$VyhL1BG4pkjnpe8l6Lmly.um5inPq/LEuFK9wwdcoumkA.KhWmADW");
    expect(result).toBeTruthy();
});

//Pruebas Unitarias que múy probalemente truenen
test("Se verá si la funcion muestra una cadena de texto encriptada", () =>
{
    let result = Cipher.encrypt("dogos");
    expect(result).not.toBeNull();
    expect(result).toBeDefined();
});

test("Se verá si la funcion desencripta", () =>
{
    let result = Cipher.decrypt("17f0f9c4d03e0fa0c4043d5bae3ed52414441ddd6a2a806fbee600164556627fd057a392bd99dd655adf4aa12b5ce3af293eb6a3b5a6889e2cfbd864ab71ac508974db9b53354fd07fe0eadfbe36cde347d27528daa79825f0614bdefc25b1aefeff69d4bc");
    expect(result).toBe("dogos");
});