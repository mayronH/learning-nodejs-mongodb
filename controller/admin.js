const validatePost = (req) => {
    let errors = [];

    if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
        errors.push({ text: "Título inválido" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Slug inválido" });
    }

    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        errors.push({ text: "Descrição inválida" });
    }

    if (!req.body.content || typeof req.body.content == undefined || req.body.content == null) {
        errors.push({ text: "Conteúdo inválido" });
    }

    if (req.body.title.length < 2) {
        errors.push({ text: "Título muito curto, pelo menos 2 caracteres" });
    }

    if (req.body.category == "0") {
        errors.push({ text: "Categoria inválida, registre uma categoria antes de continuar" });
    }

    return errors;
};

const validateCategory = (req) => {
    let errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: "Nome inválido" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Slug inválido" });
    }

    if (req.body.name.length < 2) {
        errors.push({ text: "Nome muito curto, pelo menos 2 caracteres" });
    }

    return errors;
};

module.exports = {
    validatePost: validatePost,
    validateCategory: validateCategory,
};
