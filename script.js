// Recuperar los pedidos del almacenamiento local al cargar la página
window.addEventListener('load', function() {
    cargarPedidos();
});

// Función para agregar un pedido
document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const personaje = document.getElementById('personaje').value;
    const cantidad = document.getElementById('cantidad').value;
    const total = document.getElementById('total').value;
    const cliente = document.getElementById('cliente').value;
    const fechaEntrega = document.getElementById('fechaEntrega').value;
    const fecha = new Date().toLocaleDateString();

    const pedido = {
        fecha,
        personaje,
        cantidad,
        total,
        cliente,
        fechaEntrega,
        pagado: false
    };

    agregarPedido(pedido);

    // Limpiar el formulario después de agregar
    document.getElementById('pedidoForm').reset();
});

// Función para agregar un pedido a la tabla y al almacenamiento local
function agregarPedido(pedido) {
    const pedidoLista = document.getElementById('pedidoLista');
    const fila = document.createElement('tr');

    fila.innerHTML = `
        <td>${pedido.fecha}</td>
        <td>${pedido.personaje}</td>
        <td>${pedido.cantidad}</td>
        <td>$${pedido.total}</td>
        <td>${pedido.cliente}</td>
        <td>${pedido.fechaEntrega}</td>
        <td>
            <input type="checkbox" class="checkPagado" ${pedido.pagado ? 'checked' : ''}>
        </td>
        <td><button class="eliminarPedido">Eliminar</button></td>
    `;

    // Agregar evento para marcar como pagado
    fila.querySelector('.checkPagado').addEventListener('change', function() {
        pedido.pagado = this.checked;
        if (pedido.pagado) {
            fila.classList.add('pagado');
        } else {
            fila.classList.remove('pagado');
        }
        actualizarTotales();
        guardarPedidos();
    });

    // Agregar evento para eliminar pedido
    fila.querySelector('.eliminarPedido').addEventListener('click', function() {
        if (confirm('¿Estás seguro de eliminar este pedido?')) {
            pedidoLista.removeChild(fila);
            actualizarTotales();
            guardarPedidos();
        }
    });

    pedidoLista.appendChild(fila);

    actualizarTotales();
    guardarPedidos();
}

// Función para guardar los pedidos en el almacenamiento local
function guardarPedidos() {
    const pedidos = [];
    const filas = document.querySelectorAll('#pedidoLista tr');
    filas.forEach(fila => {
        const celdas = fila.children;
        const pedido = {
            fecha: celdas[0].textContent,
            personaje: celdas[1].textContent,
            cantidad: celdas[2].textContent,
            total: parseFloat(celdas[3].textContent.replace('$', '')),
            cliente: celdas[4].textContent,
            fechaEntrega: celdas[5].textContent,
            pagado: celdas[6].querySelector('input').checked
        };
        pedidos.push(pedido);
    });
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Función para cargar los pedidos desde el almacenamiento local
function cargarPedidos() {
    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidosGuardados.forEach(pedido => agregarPedido(pedido));
}

// Función para actualizar los totales
function actualizarTotales() {
    const filas = document.querySelectorAll('#pedidoLista tr');
    let totalGeneral = 0;
    let totalPagado = 0;

    filas.forEach(fila => {
        const total = parseFloat(fila.children[3].textContent.replace('$', ''));
        if (fila.classList.contains('pagado')) {
            totalPagado += total;
        } else {
            totalGeneral += total;
        }
    });

    document.getElementById('totalGeneral').textContent = `$${totalGeneral.toFixed(2)}`;
    document.getElementById('totalPagado').textContent = `$${totalPagado.toFixed(2)}`;
    document.getElementById('totalPendiente').textContent = `$${(totalGeneral - totalPagado).toFixed(2)}`;
}

// Función para eliminar todos los pedidos
document.getElementById('eliminarTodos').addEventListener('click', function() {
    if (confirm('¿Estás seguro de eliminar todos los pedidos?')) {
        document.getElementById('pedidoLista').innerHTML = '';
        actualizarTotales();
        guardarPedidos();
    }
});
