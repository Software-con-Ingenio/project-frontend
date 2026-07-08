const API_BASE_URL = 'http://localhost:8000';

let catalogoJuegos = [];
let detallesVenta = [];

export async function inicializarVentas() {
	const contenedor = document.getElementById('seccion-ventas');
	if (!contenedor) return;

	const token = localStorage.getItem('access_token');
	const idRol = localStorage.getItem('id_rol');
	const autorizado = token && (idRol === '1' || idRol === '2');
	if (!autorizado) return;

	await cargarCatalogoJuegos();
	bindEventosVentas();
	renderDetalleVenta();
}

async function cargarCatalogoJuegos() {
	try {
		const response = await fetch(`${API_BASE_URL}/juegos`);
		if (!response.ok) throw new Error('No se pudo obtener el catalogo de juegos.');
		catalogoJuegos = await response.json();
		poblarSelectJuegos();
	} catch (error) {
		console.error('Error al cargar juegos para ventas:', error);
		mostrarEstadoVenta('No se pudo cargar el catalogo de juegos.', true);
	}
}

function poblarSelectJuegos() {
	const select = document.getElementById('venta-juego-select');
	if (!select) return;

	select.innerHTML = '';

	if (!catalogoJuegos.length) {
		const option = document.createElement('option');
		option.value = '';
		option.textContent = 'No hay juegos disponibles';
		select.appendChild(option);
		return;
	}

	const placeholder = document.createElement('option');
	placeholder.value = '';
	placeholder.textContent = 'Selecciona un juego';
	select.appendChild(placeholder);

	catalogoJuegos.forEach((juego) => {
		const option = document.createElement('option');
		option.value = String(juego.id_juego);
		option.textContent = `${juego.nombre} (Stock: ${juego.stock_local ?? 0})`;
		select.appendChild(option);
	});
}

function bindEventosVentas() {
	const btnAgregar = document.getElementById('btn-agregar-item-venta');
	const btnCalcular = document.getElementById('btn-calcular-venta');
	const btnConfirmar = document.getElementById('btn-confirmar-venta');
	const btnLimpiar = document.getElementById('btn-limpiar-venta');

	if (btnAgregar) btnAgregar.onclick = agregarItemVenta;
	if (btnCalcular) btnCalcular.onclick = calcularResumenVenta;
	if (btnConfirmar) btnConfirmar.onclick = confirmarVenta;
	if (btnLimpiar) btnLimpiar.onclick = limpiarVenta;
}

function agregarItemVenta() {
	const select = document.getElementById('venta-juego-select');
	const inputCantidad = document.getElementById('venta-cantidad');
	if (!select || !inputCantidad) return;

	const idJuego = Number(select.value);
	const cantidad = Number(inputCantidad.value);

	if (!idJuego) {
		alert('Selecciona un juego para agregar.');
		return;
	}
	if (!cantidad || cantidad < 1) {
		alert('Ingresa una cantidad valida.');
		return;
	}

	const juego = catalogoJuegos.find((j) => Number(j.id_juego) === idJuego);
	if (!juego) {
		alert('El juego seleccionado no existe.');
		return;
	}

	const itemExistente = detallesVenta.find((d) => d.id_juego === idJuego);
	const cantidadTotal = (itemExistente ? itemExistente.cantidad : 0) + cantidad;

	if (cantidadTotal > Number(juego.stock_local ?? 0)) {
		alert(`Stock insuficiente para ${juego.nombre}. Stock disponible: ${juego.stock_local ?? 0}`);
		return;
	}

	if (itemExistente) {
		itemExistente.cantidad = cantidadTotal;
	} else {
		detallesVenta.push({ id_juego: idJuego, cantidad });
	}

	inputCantidad.value = '1';
	renderDetalleVenta();
	mostrarResumen(null);
	mostrarEstadoVenta('Producto agregado a la venta.', false);
}

function renderDetalleVenta() {
	const tbody = document.getElementById('tabla-venta-items-body');
	const btnConfirmar = document.getElementById('btn-confirmar-venta');
	if (!tbody) return;

	tbody.innerHTML = '';

	if (!detallesVenta.length) {
		const fila = document.createElement('tr');
		fila.innerHTML = '<td colspan="4">No hay items en la venta.</td>';
		tbody.appendChild(fila);
	} else {
		detallesVenta.forEach((item) => {
			const juego = catalogoJuegos.find((j) => Number(j.id_juego) === Number(item.id_juego));
			const fila = document.createElement('tr');
			fila.innerHTML = `
				<td>${juego ? juego.nombre : item.id_juego}</td>
				<td>${item.cantidad}</td>
				<td>${juego ? Number(juego.stock_local ?? 0) : '-'}</td>
				<td><button data-id-juego="${item.id_juego}" class="btn-eliminar-item-venta">Quitar</button></td>
			`;
			tbody.appendChild(fila);
		});

		tbody.querySelectorAll('.btn-eliminar-item-venta').forEach((btn) => {
			btn.addEventListener('click', (event) => {
				const idJuego = Number(event.currentTarget.getAttribute('data-id-juego'));
				eliminarItemVenta(idJuego);
			});
		});
	}

	if (btnConfirmar) btnConfirmar.disabled = true;
}

function eliminarItemVenta(idJuego) {
	detallesVenta = detallesVenta.filter((item) => Number(item.id_juego) !== Number(idJuego));
	renderDetalleVenta();
	mostrarResumen(null);
}

async function calcularResumenVenta() {
	if (!detallesVenta.length) {
		alert('Agrega al menos un item para calcular el resumen.');
		return;
	}

	try {
		const token = localStorage.getItem('access_token');
		const userId = obtenerIdUsuarioDesdeToken(token);
		const payload = {
			id_usuario: userId || 0,
			detalles: detallesVenta
		};

		const response = await fetch(`${API_BASE_URL}/ventas/calcular`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.detail || 'No se pudo calcular el resumen.');
		}

		mostrarResumen(data);
		mostrarEstadoVenta('Resumen calculado. Puedes confirmar la venta.', false);

		const btnConfirmar = document.getElementById('btn-confirmar-venta');
		if (btnConfirmar) btnConfirmar.disabled = false;
	} catch (error) {
		console.error('Error al calcular venta:', error);
		mostrarEstadoVenta(error.message, true);
	}
}

async function confirmarVenta() {
	if (!detallesVenta.length) {
		alert('No hay detalles para registrar la venta.');
		return;
	}

	try {
		const token = localStorage.getItem('access_token');
		const userId = obtenerIdUsuarioDesdeToken(token);
		if (!userId) {
			throw new Error('No se pudo determinar el usuario actual para registrar la venta.');
		}

		const payload = {
			id_usuario: userId,
			detalles: detallesVenta
		};

		const response = await fetch(`${API_BASE_URL}/ventas`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.detail || 'No se pudo registrar la venta.');
		}

		const ventaId = data.id_venta ? ` #${data.id_venta}` : '';
		mostrarEstadoVenta(`Venta registrada con exito${ventaId}.`, false);
		alert(`Venta realizada correctamente${ventaId}.`);

		limpiarVenta();
		await cargarCatalogoJuegos();
	} catch (error) {
		console.error('Error al confirmar venta:', error);
		mostrarEstadoVenta(error.message, true);
	}
}

function limpiarVenta() {
	detallesVenta = [];
	renderDetalleVenta();
	mostrarResumen(null);

	const inputCantidad = document.getElementById('venta-cantidad');
	const select = document.getElementById('venta-juego-select');
	if (inputCantidad) inputCantidad.value = '1';
	if (select) select.value = '';

	mostrarEstadoVenta('Venta limpiada.', false);
}

function mostrarResumen(resumen) {
	const contenedor = document.getElementById('resumen-venta');
	const btnConfirmar = document.getElementById('btn-confirmar-venta');
	if (!contenedor) return;

	if (!resumen || !Array.isArray(resumen.items) || !resumen.items.length) {
		contenedor.innerHTML = '<p>Sin resumen calculado.</p>';
		if (btnConfirmar) btnConfirmar.disabled = true;
		return;
	}

	const filas = resumen.items.map((item) => `
		<tr>
			<td>${item.nombre}</td>
			<td>${item.cantidad}</td>
			<td>$${Number(item.precio_unitario).toFixed(2)}</td>
			<td>$${Number(item.subtotal).toFixed(2)}</td>
		</tr>
	`).join('');

	contenedor.innerHTML = `
		<table border="1">
			<thead>
				<tr>
					<th>Juego</th>
					<th>Cantidad</th>
					<th>Precio Unitario</th>
					<th>Subtotal</th>
				</tr>
			</thead>
			<tbody>${filas}</tbody>
		</table>
		<p><strong>Total a pagar: $${Number(resumen.total_a_pagar).toFixed(2)}</strong></p>
	`;

	if (btnConfirmar) btnConfirmar.disabled = false;
}

function mostrarEstadoVenta(mensaje, esError) {
	const estado = document.getElementById('estado-venta');
	if (!estado) return;

	estado.textContent = mensaje || '';
	estado.style.color = esError ? '#b00020' : '#1a7f37';
}

function obtenerIdUsuarioDesdeToken(token) {
	if (!token) return null;

	try {
		const partes = token.split('.');
		if (partes.length < 2) return null;

		const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
		const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
		const payload = JSON.parse(atob(padded));
		const sub = Number(payload.sub);
		return Number.isFinite(sub) ? sub : null;
	} catch (error) {
		console.error('No se pudo leer el token:', error);
		return null;
	}
}
