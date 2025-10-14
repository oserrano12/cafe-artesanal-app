// script.js - Manejo del catálogo interactivo con POO - CORREGIDO

// Clase Producto: Representa un producto con sus propiedades
class Producto {
    constructor(nombre, descripcion, categoria, precio, imagen, estado) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.precio = precio;
        this.imagen = imagen;
        this.estado = estado;
    }
}

// Clase GestorCatalogo: Gestiona el array de productos y sus operaciones
class GestorCatalogo {
    constructor() {
        this.productos = [];
        this.productosOriginales = []; // Copia de respaldo para restaurar
    }

    // Método para agregar productos al array
    agregarProducto(producto) {
        this.productos.push(producto);
    }

    // Método para formatear precios en pesos colombianos
    formatearPrecioCOP(precio) {
        return new Intl.NumberFormat('es-CO').format(precio);
    }

    // Método para mostrar productos en tarjetas HTML dinámicas (usa un bucle)
    mostrarProductos(contenedorId) {
        const contenedor = document.getElementById(contenedorId);
        contenedor.innerHTML = '';
        const mensajeVacio = document.getElementById('mensajeVacio');

        if (this.productos.length === 0) {
            mensajeVacio.classList.remove('hidden');
            contenedor.classList.add('hidden');
        } else {
            mensajeVacio.classList.add('hidden');
            contenedor.classList.remove('hidden');
            
            // BUCLE for...of para iterar sobre los productos
            for (const producto of this.productos) {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'bg-white rounded-2xl shadow-2xl p-6 hover-lift animate-fadeIn';
                tarjeta.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover rounded-t-xl mb-4">
                    <h4 class="text-xl font-bold text-amber-900">${producto.nombre}</h4>
                    <p class="text-gray-600 mt-2">${producto.descripcion}</p>
                    <p class="text-sm text-gray-500 mt-2">Categoría: <span class="font-semibold">${producto.categoria}</span></p>
                    <p class="text-2xl font-bold text-amber-700 mt-3">$${this.formatearPrecioCOP(producto.precio)} COP</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                            producto.estado === 'disponible' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }">
                            ${producto.estado === 'disponible' ? '✅ Disponible' : '❌ Agotado'}
                        </span>
                        <button onclick="window.gestor.cambiarEstado('${producto.nombre}')" 
                                class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-medium">
                            Cambiar Estado
                        </button>
                    </div>
                `;
                contenedor.appendChild(tarjeta);
            }
            this.actualizarContador();
        }
    }

    // Método para filtrar productos (usa un condicional)
    filtrarProductos(nombre, categoria) {
        return this.productos.filter(producto => {
            const coincideNombre = producto.nombre.toLowerCase().includes(nombre.toLowerCase());
            // CONDICIONAL if para filtrar
            if (categoria === 'todos') {
                return coincideNombre;
            } else {
                return coincideNombre && producto.categoria === categoria;
            }
        });
    }

    // Método para eliminar o cambiar estado de un producto
    cambiarEstado(nombreProducto) {
        const producto = this.productos.find(p => p.nombre === nombreProducto);
        if (producto) {
            producto.estado = producto.estado === 'disponible' ? 'agotado' : 'disponible';
            this.mostrarProductos('contenedorProductos');
        }
    }

    // FUNCIÓN 1: Manipular DOM - Actualizar el contador de productos
    actualizarContador() {
        const contadorElement = document.getElementById('contadorProductos');
        if (contadorElement) {
            const total = this.productos.length;
            const disponibles = this.productos.filter(p => p.estado === 'disponible').length;
            contadorElement.textContent = `Mostrando ${total} productos (${disponibles} disponibles)`;
        }
    }

    // FUNCIÓN 2: Manipular DOM - Mostrar/ocultar secciones
    toggleSeccion(seccionId, mostrar) {
        const seccion = document.getElementById(seccionId);
        if (seccion) {
            if (mostrar) {
                seccion.classList.remove('hidden');
            } else {
                seccion.classList.add('hidden');
            }
        }
    }

    // Método para restaurar productos originales
    restaurarProductosOriginales() {
        this.productos = [...this.productosOriginales];
    }
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Hacer gestor global para que sea accesible desde HTML
    window.gestor = new GestorCatalogo();

    // Agregar productos de ejemplo con precios en pesos colombianos
    const productosIniciales = [
        new Producto('Café Supremo', 'Café premium de exportación calidad suprema', 'premium', 45000, 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400', 'disponible'),
        new Producto('Café Orgánico', 'Cultivo 100% natural sin pesticidas', 'organico', 38000, 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400', 'disponible'),
        new Producto('Café Especial', 'Edición limitada tostado medio artesanal', 'especial', 52000, 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400', 'agotado'),
        new Producto('Café Tradicional', 'Sabor clásico santandereano de siempre', 'tradicional', 28000, 'https://images.unsplash.com-1587734195503-904fca47e0e9?w=400', 'disponible'),
        new Producto('Café Excelso', 'Granos seleccionados premium exportación', 'premium', 42000, 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400', 'disponible'),
        new Producto('Café Descafeinado', 'Todo el sabor sin cafeína natural', 'especial', 48000, 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400', 'agotado')
    ];

    productosIniciales.forEach(producto => {
        gestor.agregarProducto(producto);
    });

    // Guardar copia de los productos originales
    gestor.productosOriginales = [...productosIniciales];

    // Mostrar productos automáticamente al cargar
    gestor.mostrarProductos('contenedorProductos');

    // Conectar con elementos HTML
    const buscarInput = document.getElementById('buscarInput');
    const filtroCategoria = document.getElementById('filtroCategoria');
    const btnLimpiar = document.getElementById('btnLimpiar');

    // Función para aplicar filtro en tiempo real
    function aplicarFiltro() {
        const nombre = buscarInput.value;
        const categoria = filtroCategoria.value;
        const productosFiltrados = gestor.filtrarProductos(nombre, categoria);
        
        // Crear array temporal para mostrar resultados filtrados
        const productosTemporales = productosFiltrados.length > 0 
            ? productosFiltrados 
            : [];
        
        gestor.productos = productosTemporales;
        gestor.mostrarProductos('contenedorProductos');
    }

    // Event listeners para filtrado en tiempo real
    buscarInput.addEventListener('input', aplicarFiltro);
    filtroCategoria.addEventListener('change', aplicarFiltro);

    // Event listener para el botón de limpiar
    btnLimpiar.addEventListener('click', () => {
        buscarInput.value = '';
        filtroCategoria.value = 'todos';
        gestor.restaurarProductosOriginales();
        gestor.mostrarProductos('contenedorProductos');
    });

    // Manejar formulario de contacto
    const formularioContacto = document.getElementById('formularioContacto');
    const mensajeExito = document.getElementById('mensajeExito');

    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envío exitoso
            mensajeExito.classList.remove('hidden');
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                mensajeExito.classList.add('hidden');
            }, 5000);
            
            // Limpiar formulario
            formularioContacto.reset();
        });
    }

    // Ejemplo de uso de toggleSeccion
    gestor.toggleSeccion('mensajeVacio', false);
});

// Función global para probar desde consola
window.mostrarEstado = function() {
    console.log('Productos en catálogo:', window.gestor.productos);
    console.log('Total productos:', window.gestor.productos.length);
};