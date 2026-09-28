const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

const userController = {
    register: (req, res) => {
        res.render('pages/register', { title: 'Registro' });
    },
    processRegister: async (req, res) => {
        // 1. Sanitización
        let { firstName, lastName, email, password } = req.body;
        firstName = firstName ? firstName.trim() : '';
        lastName = lastName ? lastName.trim() : '';
        email = email ? email.trim() : '';

        const errors = {};

        // 2. Validaciones obligatorias
        if (!firstName) errors.firstName = 'El nombre es obligatorio.';
        if (!lastName) errors.lastName = 'El apellido es obligatorio.';
        if (!email) errors.email = 'El email es obligatorio.';
        if (!password) errors.password = 'La contraseña es obligatoria.';

        // 3. Formato de Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.email = 'El formato de email no es válido.';
        }

        // 4. Validación de Contraseña (Estricta)
        if (password) {
            // Longitud
            if (password.length < 8) {
                errors.password = 'La contraseña debe tener al menos 8 caracteres.';
            } else {
                // Letra, número y carácter especial
                const hasLetter = /[a-zA-Z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

                if (!hasLetter || !hasNumber || !hasSpecial) {
                    errors.password = 'La contraseña debe incluir al menos una letra, un número y un carácter especial.';
                }

                // Cadenas prohibidas
                const forbidden = ['password', '1234', 'qwerty', 'vimet', firstName.toLowerCase()];
                if (forbidden.some(word => password.toLowerCase().includes(word))) {
                    errors.password = 'La contraseña contiene palabras prohibidas o información personal.';
                }

                // Igual al email
                if (password === email) {
                    errors.password = 'La contraseña no puede ser igual al email.';
                }
            }
        }

        // 5. Manejo de errores
        if (Object.keys(errors).length > 0) {
            return res.render('pages/register', {
                title: 'Registro',
                errors,
                oldData: req.body
            });
        }

        // Si pasa todas las validaciones: hashear y persistir
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = userService.create({
                name: `${firstName} ${lastName}`,
                email,
                password_hash: passwordHash,
                role: 'cliente'
            });

            req.session.user = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            };

            return res.redirect('/');
        } catch (err) {
            return res.render('pages/register', {
                title: 'Registro',
                errors: { email: err.message || 'No se pudo completar el registro.' },
                oldData: req.body
            });
        }
    },

    login: (req, res) => {
        res.render('pages/login', { title: 'Iniciar Sesión' });
    },

    processLogin: async (req, res) => {
        const { email, password } = req.body;

        const user = email ? userService.findByEmail(email.trim()) : null;
        const passwordMatches = user && user.password_hash
            ? await bcrypt.compare(password || '', user.password_hash)
            : false;

        if (!user || !passwordMatches) {
            return res.render('pages/login', {
                title: 'Iniciar Sesión',
                error: 'Email o contraseña incorrectos'
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return res.redirect('/');
    },

    logout: (req, res) => {
        req.session.destroy(() => res.redirect('/'));
    },

    profile: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        res.render('pages/profile', { title: 'Mi Perfil', user: req.session.user });
    }
};

module.exports = userController;
