const validateUser = (req) => {
    let errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null || req.body.name.length < 5) {
        errors.push({ text: "Nome inválido" });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ text: "Slug inválido" });
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({ text: "Descrição inválida" });
    }

    if (req.body.password.length < 8) {
        errors.push({ text: "Senha muito curta. Mínimo de 8 caracteres" });
    }

    if (req.body.password != req.body.password2) {
        errors.push({ text: "Senhas não conferem. Tente novamente" });
    }

    return errors;
};

module.exports = {
    validateUser: validateUser,
};
