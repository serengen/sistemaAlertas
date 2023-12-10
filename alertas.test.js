const {
    Usuario,
    Tema,
    Alerta,
    SistemaAlertas
} = require('./alertas'); // Asegúrate de que la importación sea correcta

describe('Sistema de Alertas', () => {
    let sistema;

    beforeEach(() => {
        sistema = new SistemaAlertas();
    });

    test('Se pueden registrar usuarios', () => {
        const usuario = sistema.registrarUsuario('Usuario1');
        expect(usuario.nombre).toBe('Usuario1');
        expect(sistema.usuarios).toContain(usuario);
    });

    test('Se pueden registrar temas', () => {
        const tema = sistema.registrarTema('Tema1');
        expect(tema.nombre).toBe('Tema1');
        expect(sistema.temas).toContain(tema);
    });

    test('Se pueden enviar alertas', () => {
        const usuario = sistema.registrarUsuario('Usuario1');
        const tema = sistema.registrarTema('Tema1');

        sistema.enviarAlerta('Alerta Urgente', 'Urgente', tema);
        sistema.enviarAlerta('Alerta Informativa', 'Informativa', tema, null, usuario);

        expect(sistema.alertas.length).toBe(2);
        expect(usuario.alertasRecibidas.length).toBe(1);
    });

    test('Se pueden obtener alertas no leídas para un usuario', () => {
        const usuario = sistema.registrarUsuario('Usuario1');
        const tema = sistema.registrarTema('Tema1');

        sistema.enviarAlerta('Alerta Urgente', 'Urgente', tema);
        sistema.enviarAlerta('Alerta Informativa', 'Informativa', tema, null, usuario);

        const alertasNoLeidas = sistema.obtenerAlertasNoLeidasUsuario(usuario);

        expect(alertasNoLeidas.length).toBe(1);
        expect(alertasNoLeidas[0].tipo).toBe('Informativa');
    });

    test('Se pueden obtener alertas no leídas para un tema', () => {
        const usuario = sistema.registrarUsuario('Usuario1');
        const tema = sistema.registrarTema('Tema1');

        sistema.enviarAlerta('Alerta Urgente', 'Urgente', tema);
        sistema.enviarAlerta('Alerta Informativa', 'Informativa', tema, null, usuario);

        const alertasNoLeidas = sistema.obtenerAlertasNoLeidasTema(tema);

        expect(alertasNoLeidas.length).toBe(2);
        expect(alertasNoLeidas[0].tipo).toBe('Urgente');
        expect(alertasNoLeidas[1].tipo).toBe('Informativa');
    });

    test('Se pueden marcar alertas como leídas', () => {
        const usuario = sistema.registrarUsuario('Usuario1');
        const tema = sistema.registrarTema('Tema1');

        sistema.enviarAlerta('Alerta Urgente', 'Urgente', tema);
        const alertaInformativa = sistema.enviarAlerta('Alerta Informativa', 'Informativa', tema, null, usuario);

        sistema.marcarAlertaLeida(usuario, alertaInformativa);

        expect(alertaInformativa.leida).toBe(true);
    });
});
