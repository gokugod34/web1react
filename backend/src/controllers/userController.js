const userController = {
    register: (req, res) => {
        res.render('pages/register', { title: 'Registro' });
    },
    processRegister: (req, res) => {
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

        // Si pasa todas las validaciones
        res.send('Registro exitoso (validaciones aprobadas)');
    }
};

module.exports = userController;
