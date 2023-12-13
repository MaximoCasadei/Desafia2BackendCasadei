const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;

    constructor(path){
        this.products = []
        this.path = path
    }

     async addProduct(nuevoObjeto){
        let {title, description, price, img, code, stock} = nuevoObjeto
        
        
        if(!title || !description || !price || !img || !code || !stock){
            console.log('Completá todos los campos bro')
            return;
        }

        if(this.products.some(item => item.code === code)){
            console.log('El código debe ser único')
            return;
        }

        const newProduct = {
            id : ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        this.products.push(newProduct)

        await this.guardarArchivo(this.products)

    }

    getProducts(){
        console.log(this.products)
    }

    async getPoductsById(id){
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id)

            if(!buscado){
                console.log("no encontramos tu producto, vuelve a buscar")

            }else{
                console.log("Producto encontrado")
                return buscado;
            }
        } catch (error) {
            console.log(error)
        }
    }

    async leerArchivo(){
        try {
            const respuesta = await fs.readFile(this.path, "utf-8")
            const arrayProductos = JSON.parse(respuesta)
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer ", error)    
        }
    }

    async guardarArchivo (arrayProductos){
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        } catch (error) {
            console.log("Error al guardar ", error)    
        }
    }

    async updateProduct (id, productActualizado){
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id)

            if(index !== -1){
                arrayProductos.splice(index, 1, productActualizado)
                await this.guardarArchivo(arrayProductos)
            }else{
                console.log("no se encontro")
            }
        } catch (error) {
            console.log(error)
        }
    }


    
    async deleteProduct (id, eliminar){
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id)

            if(index !== -1){
                arrayProductos.splice(index, 1, eliminar)
                await this.guardarArchivo(arrayProductos)
            }else{
                console.log("no se encontro")
            }
        } catch (error) {
            console.log(error)
        }
    }

}


const manager = new ProductManager("./productos.json")

manager.getProducts();

const paquete = {
    title: "yerba",
    description: "Piporé",
    price: 950,
    img: "sin imagen",
    code: "333",
    stock: 10
}


manager.addProduct(paquete);


const paquete2 = {
    title: "yerba",
    description: "Canarias",
    price: 3050,
    img: "sin imagen",
    code: "303",
    stock: 10
}

manager.addProduct(paquete2);

async function testBusqueda() {
    const buscado = await manager.getPoductsById(1);
    console.log(buscado)
}

// Descomentar para accionar
// testBusqueda()

const paquete3 = {
    id: "1",
    title: "yerba",
    description: "Rei Verde",
    price: 3050,
    img: "sin imagen",
    code: "33",
    stock: 10
}
async function testUpdate(){
    await manager.updateProduct(1, paquete3)
}

// Descomentar para accionar
// testUpdate() 




const eliminar = {   
}
async function testDelete(){
    await manager.deleteProduct(1, eliminar)
}
// Descomentar para accionar
// testDelete()