define(['libs/jquery', 'libs/semantic.min'], function (jquery, semantic) {
    return function () {
        const alertHTML = `
            <div class="ui middle aligned center aligned grid" id="telaLogin">
                <div class="column">
                    <h2 class="ui teal image header">
                        <div class="content">
                            Conecte-se na sua conta
                        </div>
                    </h2>
                    <form class="ui large form">
                        <div class="ui stacked segment">
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="user icon"></i>
                                    <input type="text" name="email" placeholder="Endereço de e-mail">
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="lock icon"></i>
                                    <input type="password" name="password" placeholder="Senha">
                                </div>
                            </div>
                            <div class="ui fluid large teal submit button">Login</div>
                        </div>

                        <div class="ui error message"></div>

                    </form>

                    <div class="ui message">
                        Não esta cadastrado? <a href="#">Cadastre-se</a>
                    </div>
                </div>
            </div>
            `;

        document.body.insertAdjacentHTML('beforeend', alertHTML);

        // timeout para evitar alguns bugs
        setTimeout(() => {
            $('#telaLogin').modal({

                duration: 300, // duracao das animacoes de abertura e fechamento do modal, em ms
                closable: false, // desabilita fechar clicando fora
                allowMultiple: true, // permite multiplos modais abertos

                onHidden: function () {
                    document.getElementById('telaLogin')?.remove(); // remove o HTML da DOM quando fechado
                }

            }).modal('show');

        }, 300);

    }

});
