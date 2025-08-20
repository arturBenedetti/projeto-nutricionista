function executaAplicacao() {
    require(['src/controller/ViewController'], function (ViewController) {

        //ViewController.TelaLogin();

        window.buttonClick = function () {
            ViewController.Alert("Erro", "Teste", 'error');
        }
        
    });
}