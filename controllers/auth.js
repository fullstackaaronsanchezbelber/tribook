const USERNAME = "admin";
const PASSWORD = "admin";

// Controlador para mostrar el formulario de login
const getLoginForm = (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Usuario" required />
            <input type="password" name="password" placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
        </form>
    `);
};

// Controlador para procesar el login
const postLoginForm = (req, res) => {
    const { username, password } = req.body;

    if (username === USERNAME && password === PASSWORD) {
        req.session.isAuthenticated = true;
        res.locals.isAdmin = true;
        req.flash('success_msg', `Sesión iniciada correctamente para el usuario ${username}`);
        res.redirect('/');
    } else {
        res.send('Usuario o contraseña incorrectos');
    }
};

// Controlador para cerrar sesión
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
};

module.exports = {
    getLoginForm,
    postLoginForm,
    logout
};
