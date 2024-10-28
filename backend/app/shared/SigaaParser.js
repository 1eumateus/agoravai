import { decode } from 'html-entities';

function clean (text) {
    if (text.indexOf ('<dd:')) {
        text = text.substring (text.indexOf ('<dd>') + 4);
        text = text.substring (0, text.indexOf ('</dd>'));
    }
    text = text.replaceAll ('\n', '');
    text = text.replaceAll ('\t', '');
    if (text.indexOf ('n&#227;o cadastrad') != -1 || text.indexOf ('n&#227;o informad') != -1) {
        text = '';
    }
    while (text.charAt (0) == ' ') {
        text = text.substring (1);
    }
    while (text.charAt (text.length - 1) == ' ') {
        text = text.substring (0, text.length - 1);
    }
    return text;
}

function filtrarPerfil1 (text) {
    text = text.substring (text.indexOf ('<h4>Perfil Pessoal</h4>'));
    let descricao = text.substring (0, text.indexOf ('</div>'));
    descricao = clean (descricao)
    
    text = text.substring (text.indexOf ('<h4>Forma&#231;&#227;o Acad&#234;mica</h4>'));
    let formacao = text.substring (0, text.indexOf ('</div>'));
    formacao = clean (formacao);
    return {
        'descricao': descricao,
        'formacao': formacao,
        'interesse': '',
        'lattes': '',
    }
}

function filtrarPerfil2 (text) {
    text = text.substring (text.indexOf('<dl>') + 4);
    let descricao = text.substring (0, text.indexOf ('</dl>'));
    descricao = clean (descricao);
    
    text = text.substring (text.indexOf ('<dl>') + 4);
    let formacao = text.substring (0, text.indexOf ('</dl>'));
    formacao = clean (formacao);
    
    text = text.substring (text.indexOf ('<dl>') + 4);
    let interesse = text.substring (0, text.indexOf ('</dl>'));
    interesse = clean (interesse);
    
    text = text.substring (text.indexOf ('<dl>') + 4);
    let lattes = text.substring (0, text.indexOf ('</dl>'));
    if (lattes.indexOf ('n&#227;o informad') != -1)  lattes = '';
    else {
        lattes = lattes.substring (lattes.indexOf ('href') + 6);
        lattes = lattes.substring (0, lattes.indexOf ('"'));
    }

    return {
        'descricao': descricao,
        'formacao': formacao,
        'interesse': interesse,
        'lattes': lattes
    }
}

function filtrar (text) {
    let tipo = text.substring (0, text.indexOf ('<div id="contato">'));
    let dados = null

    if(tipo.indexOf ('<dl>')){
        dados = filtrarPerfil2 (text)
    }else{
        dados = filtrarPerfil1 (text);
    }
    
    let nome = text.substring(text.indexOf('<h3>') + 4, text.indexOf('</h3>'))?.trim();
    let nomePartes = nome.split(' ');
    dados['nome'] = nomePartes[0];
    dados['sobrenome'] = nomePartes?.slice(1)?.join(' ');

    text = text.substring (text.indexOf ('<div id="contato">'));
    
    dados ['telefone'] = text.substring(
        text.indexOf('<dd>', text.indexOf('Telefone/Ramal')) + 4, 
        text.indexOf('</dd>', text.indexOf('Telefone/Ramal')) 
    )?.trim();

    dados ['email'] = text.substring(
        text.indexOf('<dd>', text.indexOf('Endere&#231;o eletr&#244;nico')) + 4, 
        text.indexOf('</dd>', text.indexOf('Endere&#231;o eletr&#244;nico')) 
    )?.trim();
    
    return dados;
}

function filtrarTrabalhoFimCurso (text) {
    text = text.substring (text.indexOf ('<div id="producao-docente">'));
    text = text.substring(text.indexOf('<h2>Trabalho de Fim de'), text.length)
    const lista = text.substring(text.indexOf('<ul>'), text.indexOf('</ul>'));

    const items = lista.split('<li>').slice(1);
    
    const resultados = items.map(item => {
        let corrigido = formatHtmlTags(item.substring(0, item.indexOf('</li>')))
        return corrigido.replace(/\s+/g, ' ').trim();
    });

    return resultados
}

function formatHtmlTags(str) {
    return decode(str.replace(/<[^>]*>/g, ' '));
}

function formatTel(str) {
    return str.replace(/\D/g, ''); 
}

function formatNome(str) {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); 
}

export {formatNome, formatTel, formatHtmlTags, filtrarTrabalhoFimCurso, filtrar}