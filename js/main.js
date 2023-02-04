const abrirCarrito = document.getElementById("abrirCarrito");
const modalCarrito = document.getElementById("modalCarrito");
const vaciarCarrito = document.getElementById("vaciarCarrito");
const contenidoCarrito = document.getElementById("contenidoCarrito");
const precioTotal = document.getElementById("precioTotal");
const confirmarCarrito = document.getElementById("confirmarCarrito");

const carrito = [];

const productos = [];
const miLocalStorage = window.localStorage;
const cargarProductos = async () => {
    const response = await fetch("json/productos.json");
    const elementos = await response.json();
    elementos.forEach((elemento) => {
        productos.push(elemento);
    });
};

export const agruparAsync = async () => {
    await cargarProductos();
    mostrarProductos(productos);
};
agruparAsync();

const mostrarProductos = (productos) => {
    productos.forEach((producto) => {
        const div = document.createElement("div");
        div.innerHTML += `<div class="card " style="width: 18rem;">
                    <img src="${producto.img}" class="card-img-top" alt="...">
                    <div class="card-body text-center">
                        <h5 class="card-text">${producto.descripcion}</h5>
                        <p class="card-text">Precio: $ ${producto.precio}</p>
                        <button class="btn btn-warning" id="boton${producto.id}">Comprar</button>
                    </div>
                </div>`;
        menu.appendChild(div);
        const boton = document.getElementById(`boton${producto.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
            Toastify({
                text: "Producto agregado al carrito",
                duration: 2000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#FEBD59",
                },
            }).showToast();
        });
    });
};
mostrarProductos(productos);

const agregarAlCarrito = (prodId) => {
    const existe = carrito.some((producto) => producto.id === prodId);
    if (existe) {
        const prod = carrito.map((prod) => {
            if (prod.id === prodId) {
                prod.cantidad++;
            }
        });
    } else {
        const item = productos.find((prod) => prod.id === prodId);
        if (item) {
            const prod = productos.map((prod) => {
                if (prod.id === prodId) {
                    prod.cantidad = 1;
                }
            });
        }
        carrito.push(item);
    }
    console.log(carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
};

const eliminarDelCarrito = (prodId) => {
    console.log(prodId);
    const item = carrito.find((prod) => prod.id === prodId);
    const indice = carrito.indexOf(item);
    carrito.splice(indice, 1);
    actualizarCarrito();
};

const actualizarCarrito = () => {
    contenidoCarrito.innerHTML = "";
    carrito.forEach((prod) => {
        const div = document.createElement("div");
        div.className = "itemsCarrito";
        div.innerHTML = `
        <img class="px-1" src="${prod.img}" alt="" width="40px" height="40px">
        <p class="px-2"> <b>${prod.descripcion}</b></p>
        <p class="px-2"><b>Precio: $${prod.precio}</b></p
        <p class="px-2"><b>Cantidad: <span id ="cantidad" class="px-2">${prod.cantidad}</b> </span></p>
        <button id="id${prod.id}" class ="botonEliminar"><i class="fa-solid fa-trash"></i></button>`;
        contenidoCarrito.appendChild(div);
        let botonid = document.getElementById(`id${prod.id}`);
        botonid.addEventListener("click", () => eliminarDelCarrito(prod.id));
    });
    calculoPrecioTotal();
    const contadorCarrito = document.getElementById("contadorCarrito");
    contadorCarrito.innerText = carrito.length;
};

const calculoPrecioTotal = () => {
    let total = 0
    carrito.forEach (producto => {
        total += producto.precio * producto.cantidad;
    })
    precioTotal.innerHTML = total;
};

if(localStorage.getItem("carrito")) {
    let productosCarrito = JSON.parse(localStorage.getItem("carrito"));
    for (let i = 0; i < productosCarrito.length; i++) {
        carrito.push(productosCarrito[i]);
    }
}

// Eventos de botones del carrito:

abrirCarrito.addEventListener("click", () => {
    modalCarrito.classList.toggle("d-none");
})

vaciarCarrito.addEventListener("click", () => {
    carrito.length = 0;
    actualizarCarrito();
    localStorage.clear();
});

confirmarCarrito.addEventListener("click", () => {
    let suma = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    console.log (suma);
    if (carrito.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: '¡Tu carrito está vacío!',
            confirmButtonColor: "#E25C5A"
        })
    } else {
        Swal.fire({
            icon: "success",
            title: "¡Pedido confirmado!",
            text: `El importe a abonar es de $${suma}. Pulse PAGAR para ser redirigido al sitio`, 
            confirmButtonText: "Pagar",
            confirmButtonColor: "#E25C5A"
    });
    carrito.length = 0;
    actualizarCarrito();
}});
