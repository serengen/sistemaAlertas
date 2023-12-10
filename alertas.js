class Usuario {

    // Representa a un usuario registrado en el sistema.

	constructor(nombre) {
		this.nombre = nombre;
		this.alertasRecibidas = [];
		this.temasInteres = [];
	}

	recibirAlerta(alerta) {
		this.alertasRecibidas.push(alerta);
	}

	marcarAlertaLeida(alerta) {
		alerta.leer();
	}
}

class Tema {

    // Representa un tema sobre el cual se pueden enviar alertas.

	constructor(nombre) {
		this.nombre = nombre;
	}
}

class Alerta {

    // Representa una alerta que puede ser enviada a usuarios sobre un tema específico.

	constructor(mensaje, tipo, tema, fechaExpiracion = null, destinatario = null) {
		this.mensaje = mensaje;
		this.tipo = tipo;
		this.tema = tema;
		this.fechaExpiracion = fechaExpiracion;
		this.destinatario = destinatario;
		this.leida = false;
	}

	leer() {
		this.leida = true;
	}

	get expirada() {
		return this.fechaExpiracion && new Date() > this.fechaExpiracion;
	}
}

class SistemaAlertas {

    // gestiona la lógica principal del sistema.

	constructor() {
		this.usuarios = [];
		this.temas = [];
		this.alertas = [];
	}

    // Registra un nuevo usuario en el sistema.
	registrarUsuario(nombre) {
		const usuario = new Usuario(nombre);
		this.usuarios.push(usuario);
		return usuario;
	}

    // Registra un nuevo tema en el sistema.
	registrarTema(nombre) {
		const tema = new Tema(nombre);
		this.temas.push(tema);
		return tema;
	}

    // Envía una alerta a usuarios o a un usuario específico.
	enviarAlerta(mensaje, tipo, tema, fechaExpiracion = null, destinatario = null) {
		const alerta = new Alerta(mensaje, tipo, tema, fechaExpiracion, destinatario);
		this.alertas.push(alerta);

		if (destinatario) {
			destinatario.recibirAlerta(alerta);
		} else {
			this.usuarios.forEach((usuario) => {
				if (usuario.temasInteres.includes(tema)) {
					usuario.recibirAlerta(alerta);
				}
			});
		}
		return alerta;
	}

    // Obtiene todas las alertas no leídas para un usuario.
	obtenerAlertasNoLeidasUsuario(usuario) {
		return usuario.alertasRecibidas.filter((alerta) => !alerta.leida && !alerta.expirada);
	}

    // Obtiene todas las alertas no leídas para un tema, ordenadas según su tipo.
    // Urgentes van al inicio, siendo la última en llegar la primera en obtenerse (LIFO)
    // Informativas despues de las Urgentes, siendo la primera en llegar la primera en obtenerse (FIFO).
	obtenerAlertasNoLeidasTema(tema) {
		const alertas = this.alertas.filter(
			(alerta) => !alerta.leida && alerta.tema === tema && !alerta.expirada
		);
		return alertas.sort((a, b) => (a.tipo === 'Urgente' ? -1 : 1));
	}

    // Marca una alerta como leída para un usuario específico.
    
	marcarAlertaLeida(usuario, alerta) {
		if (alerta instanceof Alerta) {
			usuario.marcarAlertaLeida(alerta);
		} else {
			console.error('La alerta no es válida');
		}
	}
}

module.exports = {
	Usuario,
	Tema,
	Alerta,
	SistemaAlertas
};