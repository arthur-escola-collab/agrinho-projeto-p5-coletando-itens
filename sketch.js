// Agrinho 2025 - Festejando a Conexão Campo-Cidade
// Jogo com cesta e itens caindo, visual melhorado e lista na tela inicial

let player;         // Objeto jogador (a cesta)
let itens = [];     // Array para armazenar os itens que caem
let pontos = 0;     // Pontuação do jogador
let vidas = 3;      // Número de vidas do jogador
let tempo = 0;      // Tempo decorrido para aumentar dificuldade
let velocidadeBase = 2;  // Velocidade inicial dos itens
let vento = 0.5;    // Deslocamento lateral dos itens (simula vento)
let estado = "inicio";   // Estado do jogo: "inicio", "jogo", "fim", "vitoria"
let maxPontos = 300;     // Pontuação necessária para vencer

function setup() {
  createCanvas(600, 400);
  player = new Player();    // Cria o jogador (a cesta)
  gerarItens(12);           // Gera 12 itens iniciais para cair
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  // Desenha o fundo, diferente na tela inicial
  if(estado !== "inicio") {
    desenhaFundo();  // Fundo dividido: campo e cidade
  } else {
    background(220, 245, 255); // Fundo claro para tela inicial
  }

  // Exibe pontuação e vidas no topo da tela
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Pontos: " + pontos, 20, 20);
  textAlign(RIGHT, CENTER);
  text("Vidas: " + vidas, width - 20, 20);

  // Controle dos estados do jogo
  if (estado === "inicio") {
    telaInicial();
    return; // Para o draw para não executar código de jogo
  }

  if (estado === "fim") {
    telaFim();
    return;
  }

  if (estado === "vitoria") {
    telaVitoria();
    return;
  }

  // Jogo em andamento: atualiza tempo e velocidade dos itens
  tempo += deltaTime / 1000;
  let velocidadeAtual = velocidadeBase + tempo * 0.12;

  player.update();  // Atualiza posição do jogador conforme teclas
  player.show();    // Desenha a cesta na tela

  // Atualiza e desenha cada item que cai
  for (let i = itens.length - 1; i >= 0; i--) {
    itens[i].update(velocidadeAtual, vento);
    itens[i].show();

    // Verifica se item chegou ao fundo (altura do jogador)
    if (itens[i].y > height - 40) {
      // Verifica se o jogador pegou o item
      if (player.cestaPega(itens[i])) {
        if (itens[i].bom) {
          pontos += 10;               // Ganha pontos
          if (pontos % 100 === 0) {   // A cada 100 pontos ganha uma vida extra (máximo 5)
            vidas = min(vidas + 1, 5);
          }
          if (pontos >= maxPontos) {  // Se atingir pontos para vencer
            estado = "vitoria";
          }
        } else {
          vidas--;                    // Perde vida se pegou item ruim
          pontos = max(0, pontos - 10); // Perde pontos (não vai abaixo de zero)
          if (vidas <= 0) {           // Se perder todas as vidas, fim de jogo
            estado = "fim";
          }
        }
      }
      itens[i].reset();              // Reseta item para cair novamente do topo
    }
  }
}

// Controle das teclas (ENTER para iniciar ou reiniciar o jogo)
function keyPressed() {
  if (estado === "inicio" && keyCode === 13) {  // ENTER na tela inicial
    estado = "jogo";
    pontos = 0;
    vidas = 3;
    tempo = 0;
    gerarItens(12);
  } else if ((estado === "fim" || estado === "vitoria") && keyCode === 13) { // ENTER fim/vitória
    estado = "inicio";  // Volta para tela inicial
  }
}

// Função que desenha o fundo dividido: meio campo, meio cidade
function desenhaFundo() {
  // Lado esquerdo: campo verde com faixas simulando plantação
  noStroke();
  fill(60, 130, 70);
  rect(width / 4, height / 2, width / 2, height);

  stroke(40, 90, 50);
  strokeWeight(3);
  for (let i = 0; i < 10; i++) {
    line(0, i * 40 + 10, width / 2, i * 40 + 10);
  }
  noStroke();

  // Lado direito: cidade com prédios estilizados
  fill(100, 130, 180);
  rect((3 * width) / 4, height / 2, width / 2, height);

  fill(70, 90, 140);
  for (let i = 0; i < 6; i++) {
    rect(width / 2 + i * 90 + 30, height - 150 - (i % 3) * 30, 60, 150 + (i % 3) * 30, 8);
  }
}

// Tela inicial do jogo, com título, instruções e lista de itens bons para coletar
function telaInicial() {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(26);
  text("Agrinho 2025", width / 2, 60);
  textSize(18);
  text("Festejando a Conexão Campo-Cidade", width / 2, 90);

  textSize(16);
  text("Use as setas ← → para mover a cesta", width / 2, 130);
  text("Capture os itens bons e evite os ruins", width / 2, 155);
  text("Pressione ENTER para começar", width / 2, 185);

  // Lista com os itens bons, desenhados para fácil identificação
  let lista = [
    { nome: "Cenoura", tipo: "cenoura" },
    { nome: "Queijo", tipo: "queijo" },
    { nome: "Morango", tipo: "morango" },
    { nome: "Caixa Orgânica", tipo: "feira" },
    { nome: "Celular", tipo: "celular" },
  ];

  textSize(18);
  text("Itens para coletar:", width / 2, 230);

  // Desenha os ícones e nomes da lista
  for (let i = 0; i < lista.length; i++) {
    let x = width / 2 - 140 + i * 70;
    let y = 280;

    push();
    translate(x, y);
    desenhaItemSimples(lista[i].tipo, true);
    pop();

    fill(0);
    noStroke();
    textSize(12);
    text(lista[i].nome, x, y + 30);
  }
}

// Tela fim de jogo (quando perde todas as vidas)
function telaFim() {
  background(200, 80, 80);  // Fundo vermelho
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Fim de Jogo!", width / 2, height / 2 - 30);
  textSize(20);
  text("Você perdeu todas as vidas.", width / 2, height / 2);
  text("Pontos finais: " + pontos, width / 2, height / 2 + 30);
  text("Pressione ENTER para tentar novamente", width / 2, height / 2 + 70);
}

// Tela vitória (quando alcança pontuação máxima)
function telaVitoria() {
  background(80, 200, 120);  // Fundo verde
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Parabéns! Você venceu!", width / 2, height / 2 - 30);
  textSize(20);
  text("Você alcançou " + pontos + " pontos!", width / 2, height / 2);
  text("Pressione ENTER para jogar de novo", width / 2, height / 2 + 70);
}

// Função que gera uma quantidade de itens para cair do topo da tela
function gerarItens(qtde) {
  itens = [];
  for (let i = 0; i < qtde; i++) {
    itens.push(new Item(random(width), random(-400, 0)));
  }
}

// Classe que representa o jogador (a cesta)
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 30;
    this.largura = 80;
    this.altura = 30;
    this.vel = 7;  // Velocidade de movimento lateral
  }

  update() {
    // Move para esquerda ou direita conforme tecla pressionada
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.vel;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.vel;
    }
    // Mantém dentro dos limites da tela
    this.x = constrain(this.x, this.largura / 2, width - this.largura / 2);
  }

  show() {
    // Desenha a cesta como retângulo laranja com texto
    fill(200, 100, 0);
    rectMode(CENTER);
    rect(this.x, this.y, this.largura, this.altura, 10);
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("Cesta", this.x, this.y);
  }

  // Verifica se o item está dentro da cesta para ser pego
  cestaPega(item) {
    return abs(this.x - item.x) < this.largura / 2 && abs(this.y - item.y) < this.altura / 2;
  }
}

// Classe que representa os itens que caem
class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.reset();
  }

  reset() {
    // Posiciona item no topo, em posição aleatória
    this.x = random(width);
    this.y = random(-400, 0);

    this.bom = random() < 0.7;  // 70% chance de ser item bom

    // Define o tipo do item, bom ou ruim
    if (this.bom) {
      let bons = ["cenoura", "queijo", "morango", "feira", "celular"];
      this.tipo = random(bons);
    } else {
      let ruins = ["lixo", "tempestade", "buraco"];
      this.tipo = random(ruins);
    }
  }

  update(velocidade, vento) {
    // Atualiza posição vertical (queda) e horizontal (vento)
    this.y += velocidade;
    this.x += vento * (this.bom ? 0.3 : 0.7);

    // Faz o item reaparecer do outro lado se sair da tela lateralmente
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
  }

  show() {
    // Desenha o item na tela na sua posição atual
    push();
    translate(this.x, this.y);
    desenhaItemSimples(this.tipo, this.bom);
    pop();
  }
}

// Função que desenha ícones simples para os itens, bons e ruins
function desenhaItemSimples(tipo, bom) {
  noStroke();
  if (bom) {
    // Ícones coloridos e identificáveis para itens bons
    switch (tipo) {
      case "cenoura":
        fill(255, 140, 0);
        ellipse(0, 0, 22, 34);
        fill(34, 139, 34);
        triangle(-7, -18, 0, -30, 7, -18);
        break;
      case "queijo":
        fill(255, 255, 180);
        rect(0, 0, 30, 22, 6);
        fill(230, 230, 140);
        ellipse(-8, 0, 10, 10);
        ellipse(8, 5, 8, 8);
        break;
      case "morango":
        fill(255, 50, 80);
        ellipse(0, 0, 28, 28);
        fill(0, 150, 0);
        triangle(-10, -14, 0, -28, 10, -14);
        break;
      case "feira":
        fill(170, 110, 60);
        rect(0, 0, 30, 30, 6);
        fill(0);
        textSize(12);
        textAlign(CENTER, CENTER);
        text("Org", 0, 3);
        break;
      case "celular":
        fill(0);
        rect(0, 0, 18, 28, 6);
        fill(70, 160, 255);
        rect(0, 8, 15, 15, 4);
        break;
    }
  } else {
    // Ícones para itens ruins, tons mais neutros para rápida identificação negativa
    switch (tipo) {
      case "lixo":
        fill(120);
        rect(0, 0, 25, 25, 5);
        fill(60);
        stroke(40);
        strokeWeight(2);
        line(-8, -8, 8, 8);
        line(-8, 8, 8, -8);
        noStroke();
        break;
      case "tempestade":
        fill(60, 60, 60, 200);
        ellipse(0, 0, 35, 25);
        stroke(255, 255, 0);
        strokeWeight(3);
        line(-6, 6, 0, 0);
        line(0, 0, 6, 6);
        noStroke();
        break;
      case "buraco":
        fill(30);
        ellipse(0, 0, 30, 30);
        fill(90);
        ellipse(0, 0, 18, 18);
        break;
    }
  }
}
