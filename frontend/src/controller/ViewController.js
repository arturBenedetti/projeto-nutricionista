define([
    'src/view/modais/Alert',
    'src/view/telas/TelaLogin',
], function (
    ModalAlert,
    TelaLogin,
) {
    return {
        Alert: ModalAlert.modalAlert,
        TelaLogin: TelaLogin,
    };
});
