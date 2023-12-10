class Usuario {
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
	constructor(nombre) {
		this.nombre = nombre;
	}
}

class Alerta {
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
	constructor() {
		this.usuarios = [];
		this.temas = [];
		this.alertas = [];
	}

	registrarUsuario(nombre) {
		const usuario = new Usuario(nombre);
		this.usuarios.push(usuario);
		return usuario;
	}

	registrarTema(nombre) {
		const tema = new Tema(nombre);
		this.temas.push(tema);
		return tema;
	}

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

	obtenerAlertasNoLeidasUsuario(usuario) {
		return usuario.alertasRecibidas.filter((alerta) => !alerta.leida && !alerta.expirada);
	}

	obtenerAlertasNoLeidasTema(tema) {
		const alertas = this.alertas.filter(
			(alerta) => !alerta.leida && alerta.tema === tema && !alerta.expirada
		);
		return alertas.sort((a, b) => (a.tipo === 'Urgente' ? -1 : 1));
	}

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