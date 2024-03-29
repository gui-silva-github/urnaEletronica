let seuVotoPara = document.querySelector('.d-1-1 span')

let cargo = document.querySelector('.d-1-2 span')

let numeros = document.querySelector('.d-1-3')

let descricao = document.querySelector('.d-1-4')

let aviso = document.querySelector('.d-2')

let lateral = document.querySelector('.d-1-right')

let etapaAtual = 0

let numero = ''

let votoBranco = false

let votos = []

let urna = new Audio("../sons/confirma-urna.mp3")

function comecarEtapa(){
    numero = ''
    votoBranco = false

    let etapa = etapas[etapaAtual]

    let numeroHTML = ''

    for (let i=0; i<etapa.numeros; i++){
        if (i==0){
            numeroHTML += '<div class="numero pisca"></div>'
        } else {
            numeroHTML += '<div class="numero"></div>'
        }
    }

    seuVotoPara.style.display = 'none'
    cargo.innerHTML = etapa.titulo
    descricao.innerHTML = ''
    aviso.style.display = 'none'
    lateral.innerHTML = ''
    numeros.innerHTML = numeroHTML
}

comecarEtapa()

function atualizaInterface(){
    let etapa = etapas[etapaAtual]

    let candidato = etapa.candidatos.filter((item)=>{
        if (item.numero === numero){
            return true
        } else {
            return false
        }
    })

    if (candidato.length > 0){
        candidato = candidato[0]
        seuVotoPara.style.display = 'block'
        aviso.style.display = 'block'
        descricao.innerHTML = `
            Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}
        `
        let fotosHTML = ''
        for (let i in candidato.fotos){
            if (candidato.fotos[i].small){
                fotosHTML += `<div class="d-1-image small"><img src="images/${candidato.fotos[i].url}" alt="${candidato.fotos[i].legenda}">${candidato.fotos[i].titulo}</div>`
            } else {
                fotosHTML += `<div class="d-1-image"><img src="images/${candidato.fotos[i].url}" alt="${candidato.fotos[i].legenda}">${candidato.fotos[i].titulo}</div>`
            }
        }
        lateral.innerHTML = fotosHTML
    } else {
        seuVotoPara.style.display = 'block'
        aviso.style.display = 'block'
        descricao.innerHTML = '<div class="aviso-grande pisca">VOTO NULO</div>'
    }
}

function clicou(n){
    let elNumero = document.querySelector('.numero.pisca')

    if (elNumero!==null){
        elNumero.innerHTML = n
        numero = `${numero}${n}`

        elNumero.classList.remove('pisca')
        if (elNumero.nextElementSibling!==null){
            elNumero.nextElementSibling.classList.add('pisca')
        } else {
            atualizaInterface()
        }
    }
}

function branco(){
    let numero = ''
    votoBranco = true
    atualizaInterface()
    seuVotoPara.style.display = 'block'
    aviso.style.display = 'block'
    numeros.innerHTML = ''
    descricao.innerHTML = '<div class="aviso-grande pisca">VOTO EM BRANCO</div>'
    lateral.innerHTML = ''
}

function corrige(){
    comecarEtapa()
}

let reiniciar =  document.querySelector('.reiniciar')
reiniciar.addEventListener('click', iniciarVoto)

function confirma(){
    urna.play()

    let etapa = etapas[etapaAtual]

    let votoConfirmado = false

    if (votoBranco === true){
        votoConfirmado = true
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        })
    } else if (numero.length === etapa.numeros){
        if (etapa.titulo === 'PRESIDENTE' && numero==='22'){
            setTimeout(()=>{
                let bolsonaboSom = new Audio("../sons/bolsonabo.mp3")
                bolsonaboSom.play()
            }, 2500)
        } else if (etapa.titulo === 'PRESIDENTE' && numero==='13'){
            setTimeout(()=>{
                let bulaSom = new Audio("../sons/bula.mp3")
                bulaSom.play()
            }, 2500)
        }
        votoConfirmado = true
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        })
    }

    if (votoConfirmado){
        etapaAtual++
        if (etapas[etapaAtual] !== undefined){
            setTimeout(()=>{
                comecarEtapa()
            }, 3000)
        } else {
            console.log(votos)
            console.log(`Seu voto para ${etapas[0].titulo} foi ${votos[0].voto} e para ${etapas[1].titulo} foi ${votos[1].voto}`)
            document.querySelector('.tela').innerHTML = '<div class="aviso-gigante pisca">FIM</div>'
            const iniciarVoto = setTimeout(()=>{
                window.location.reload()
            }, 6500)
            setTimeout(()=>{
                reiniciar.click()
            }, 6500)
        }
    }
}
