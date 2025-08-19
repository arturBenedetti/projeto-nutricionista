define(['libs/jquery', 'libs/semantic.min'], function (jquery, semantic) {

    /**
    ######## types para o modal ########
    @positive / @success : fundo verde claro com texto verde escuro
    @negative / @error : fundo vermelho claro com texto vermelho escuro
    @warning : fundo amarelo claro com texto amarelo escuro
    @info : fundo azul claro com texto azul escuro
    ####################################
    
    ####### colors para o modal ########
    passar o nome da cor em ingles, conforme semantic ui
    ####################################
    */

    let contador = 0; // contador caso precise empilhar modais
    const filaDeAbertura = []; // fila de modais chamados
    let isModalAberto = false;

    function modalAlert(textoCabecalho, mensagem, tipo) {
        filaDeAbertura.push({ textoCabecalho, mensagem, tipo });
        processaFila();
    }

    // fila feita para seguir a ordem de chamada do modal, caso tenha mais de um aviso empilhado
    function processaFila() {
        if (isModalAberto || filaDeAbertura.length === 0) return;

        isModalAberto = true;
        const { textoCabecalho, mensagem, tipo } = filaDeAbertura.shift();
        contador++;
        const modalId = `modalTeste-${contador}`;

        openModal(textoCabecalho, mensagem, tipo, modalId);
    }

    function openModal(textoCabecalho, mensagem, tipo, modalId) {
        let conteudoMensagem = '';
        // se o parametro message for um array, cria uma lista na mensagem
        if (Array.isArray(mensagem)) {
            conteudoMensagem = '<ul class="list">';

            mensagem.forEach(msg => {
                conteudoMensagem += `<li>${msg}</li>`;
            });

            conteudoMensagem += '</ul>';
        } else {
            conteudoMensagem = `<div>${mensagem}</div>`;
        }

        const alertHTML = `
            <div class="ui tiny modal" id="${modalId}">
                <div class="header">${textoCabecalho}</div>
                <div id="teste-content">
                    <div class="ui ${tipo} message" style="margin: 10px">
                        ${conteudoMensagem}
                    </div>
                </div>
                <div class="actions">
                    <div class="ui cancel red button">Fechar</div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', alertHTML);

        // timeout para evitar alguns bugs
        setTimeout(() => {
            $('#' + modalId).modal({

                duration: 300, // duracao das animacoes de abertura e fechamento do modal, em ms
                closable: false, // desabilita fechar clicando fora
                allowMultiple: true, // permite multiplos modais abertos

                onHidden: function () {
                    document.getElementById(modalId)?.remove(); // remove o HTML da DOM quando fechado
                    isModalAberto = false;
                    processaFila(); // mostra o proximo modal
                }

            }).modal('show');

        }, 300);

    }

    return { modalAlert };
});
