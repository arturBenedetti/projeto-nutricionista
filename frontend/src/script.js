function executaAplicacao() {
    require(['src/controller/ViewController'], function (ViewController) {

        window.buttonClick = function () {
            ViewController.Alert("Erro", "Teste", 'error');
        }
        
    });
}