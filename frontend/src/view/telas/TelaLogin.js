import { ViewController } from '../../controller/ViewController.js';
import LoginService from '../../service/LoginService.js';

window.efetuaLogin = function () {
    if (LoginService.validaLogin()) {
        ViewController.Alert("Sucesso", "Login efetuado com sucesso!", 'success');
    } else {
        ViewController.Alert("Erro", "Falha ao efetuar login. Verifique suas credenciais.", 'error');
    }
}

export default function () {
    const alertHTML = `
            <div class="ui middle aligned center aligned grid" id="telaLogin">
                <div class="column" style="max-width: 450px;">
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
                            <button class="ui fluid large teal submit button" type="button" onclick="efetuaLogin()">Login</button>
                        </div>
                    </form>
                    <div class="ui message">
                        Não está cadastrado? <a href="#">Cadastre-se</a>
                    </div>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML('beforeend', alertHTML);
}