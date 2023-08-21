var fase = localStorage.getItem('fase');


if(fase == 4){
  console.log('É fase 4 uhul');
  var novaDiv = document.createElement("div");
  novaDiv.setAttribute("id", "countdown");
  document.body.appendChild(novaDiv);


  var divShowTime = document.createElement("div");
  divShowTime.setAttribute("id", "divShowTime");
  document.body.appendChild(divShowTime);
  
  var baseTime = 10; // Tempo base de 10 segundos
  var timeRemaining = baseTime;
  var increment = 5; // Incremento de 5 segundos
  var incrementCounter = 1; // Contador de incrementos
  var countdownInterval;
  
  function startCountdown() {
    countdownInterval = setInterval(function() {
      const countdownDisplay = document.getElementById("countdown");
      countdownDisplay.textContent = timeRemaining;
      
      lerTextoEmVozAlta(timeRemaining);
      
      if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        extendTime(); // Chama a função para estender o tempo
        showTimeUpAlert(); // Mostra o alerta após o término do contador
      }
  
      timeRemaining--;
    }, 1000); // Atualiza o contador a cada 1 segundo (1000 milissegundos)
  }
  
  function resetCountdown() {
    clearInterval(countdownInterval);
    timeRemaining = baseTime + (incrementCounter * increment); // Calcula o novo tempo
    startCountdown();
  }
  
  function extendTime() {
    incrementCounter++; // Incrementa o contador de incrementos
    timeRemaining = baseTime + (incrementCounter * increment); // Calcula o novo tempo
  }
  
  function showTimeUpAlert() {
    lerTextoEmVozAlta('Tempo esgotado!');
    const alertMessage = `Tempo esgotado! Pressione Enter para continuar.`;
  
    Swal.fire({
      title: 'Tempo esgotado!',
      html: `<span class="erro-text">${alertMessage}</span>`,
      icon: 'error',
      showConfirmButton: false,
      customClass: {
        container: 'meu-alerta',
        title: 'meu-titulo',
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.backdrop) {
      }
      
    });
  
    document.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        Swal.close();
        resetCountdown();
      }
    });
  
    lerTextoEmVozAlta(alertMessage);
  }
  
  function stopCountdown() {
    clearInterval(countdownInterval);
  }
  
  var pontuacaoCerto = localStorage.getItem('pontuacaoCerto');


  if (pontuacaoCerto === null) {
    // Se a pontuação não estiver armazenada, definir como 0
    pontuacaoCerto = 0;
  } else {
    // Caso contrário, converter o valor recuperado para um número
    pontuacaoCerto = parseInt(pontuacaoCerto);
  }

  var pontuacaoErrada = localStorage.getItem('pontuacaoErrada');
  if (pontuacaoErrada === null) {
    // Se a pontuação não estiver armazenada, definir como 0
    pontuacaoErrada = 0;
  } else {
    // Caso contrário, converter o valor recuperado para um número
    pontuacaoErrada = parseInt(pontuacaoErrada);
  }



    window.addEventListener("load", function() {
        const inicioJogoAudio = document.getElementById("inicioJogoAudio");
        inicioJogoAudio.play();
      });
    
      window.addEventListener("load", function() {
        const somDeFundoAudio = document.getElementById("somDeFundoAudio");
        somDeFundoAudio.volume = 0.4;
        somDeFundoAudio.play();
      });
    
      var pedidoSalvo = localStorage.getItem("pedido");
      if (pedidoSalvo) {
        lerpedidoEmVozAlta('Prepare ' + pedidoSalvo);
        alert("Prepare: " + pedidoSalvo);
        document.getElementById("pedido").innerHTML = pedidoSalvo;
      } else {
        document.getElementById("pedido").innerHTML = "Nenhum pedido encontrado.";
      }

      
      function lerpedidoEmVozAlta(texto) {
        // Verifica se o navegador suporta a API de Síntese de Fala
        if ('speechSynthesis' in window) {
            // Cria um objeto de fala
            var fala = new SpeechSynthesisUtterance(texto);
      
            // Inicia a síntese de fala
            speechSynthesis.speak(fala);
        } else {
            alert("Desculpe, a síntese de fala não é suportada neste navegador.");
        }
      
      }
      var numeros = pedidoSalvo.match(/\d+/g); // Extrai os números do texto do pedido
      var total = 0;
        // Extrai os sabores usando expressão regular
        var sabores = pedidoSalvo.match(/\b\d+\s+bolas\s+de\s+(.+)/g);

        // Filtra para manter apenas os sabores
        if (sabores) {
        sabores = sabores.map((sabor) => {
            return sabor.replace(/\b\d+\s+bolas\s+de\s+/g, "").trim();
        });
        }

        // Converte os sabores em uma única string separada por vírgula (ou outro separador de sua escolha)
        var saboresString = sabores ? sabores.join(", ") : "";

        console.log("Sabores:", saboresString); 

        
      if (numeros) {
        for (var i = 0; i < numeros.length; i++) {
          total += parseInt(numeros[i], 10); // Converte cada número para um inteiro e soma ao total
        }
      }
    
      const somPlayerAudio = document.getElementById("somPlayerAudio");
    
      // Obtendo o elemento do canvas e o contexto 2D
      const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");
    
      // Definindo as posições e o tamanho do jogador
      let squareX = canvas.width / 2 - 50;
      const squareY = canvas.height - 100;
      const squareWidth = 100;
      const squareHeight = 100;
      const squareSpeed = 5;
      let playerPosition = 0; // -1 para esquerda, 0 para centro, 1 para direita
    
      // Variáveis para armazenar as teclas pressionadas
      let leftPressed = false;
      let rightPressed = false;
    
      // Definindo as bolas
      let balls = [];
      const initialBallSpeed = 2;
      const ballAcceleration = 0.005;
      const maxBalls = total;
    
      // Variáveis para armazenar a pontuação
      let score = 0;
      let flavors = {};
    
      // Variáveis para controlar os sons em reprodução
      const soundDelay = 100; // Atraso mínimo entre os sons em milissegundos
      const flavorSounds = {
        abacaxi: document.getElementById("somBolaAbacaxi"),
        baunilha: document.getElementById("somBolaBaunilha"),
        ceu_azul: document.getElementById("somBolaCeuAzul"),
        chocolate: document.getElementById("somBolaChocolate"),
        chocomenta: document.getElementById("somBolaChocomenta"),
        creme: document.getElementById("somBolaCreme"),
        limao: document.getElementById("somBolaLimao"),
        morango: document.getElementById("somBolaMorango"),
        uva: document.getElementById("somBolaUva")
      };
      const flavorPegoSounds = {
        abacaxi: document.getElementById("somBolaPegaAbacaxi"),
        baunilha: document.getElementById("somBolaPegaBaunilha"),
        ceu_azul: document.getElementById("somBolaPegaCeuAzul"),
        chocolate: document.getElementById("somBolaPegaChocolate"),
        chocomenta: document.getElementById("somBolaPegaChocomenta"),
        creme: document.getElementById("somBolaPegaCreme"),
        limao: document.getElementById("somBolaPegaLimao"),
        morango: document.getElementById("somBolaPegaMorango"),
        uva: document.getElementById("somBolaPegaUva")
      };
      // Carrega a imagem do jogador
      const playerImage = new Image();
      playerImage.src = "img/player.png";
    
      // Cria o contexto de áudio
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
    
      // Cria o nó PannerNode para controlar o posicionamento espacial do áudio
      const pannerOptions = { positionX: 0, positionY: 0, positionZ: 0 };
      const pannerNode = new PannerNode(audioCtx, pannerOptions);
    
      // Carrega o elemento de áudio HTML
      const playerAudioElement = document.getElementById("somPlayerAudio");
      const playerTrack = audioCtx.createMediaElementSource(playerAudioElement);
    
      // Conecta o nó PannerNode ao destino final
      playerTrack.connect(pannerNode).connect(audioCtx.destination);
    
      // Função para ajustar o posicionamento espacial do áudio com base na posição do jogador
      function updateAudioPosition() {
        const canvasCenterX = canvas.width / 2;
        const playerCenterX = squareX + squareWidth / 2;
    
        // Calcula a posição X do áudio com base na posição relativa do jogador
        const positionX = (playerCenterX - canvasCenterX) / canvasCenterX;
        pannerNode.positionX.value = positionX;
    
        // Calcula a posição Y do áudio com base na posição vertical do jogador
        const positionY = (canvas.height - squareY) / canvas.height;
        pannerNode.positionY.value = positionY;
    
        // Calcula a posição Z do áudio com base na velocidade do jogador
        const velocityZ = (rightPressed ? 1 : 0) - (leftPressed ? 1 : 0);
        pannerNode.positionZ.value = velocityZ;
      }
    
      balls.forEach((ball) => {
        const distanceX = ball.x - squareX;
        const distanceY = squareY - ball.y;
        const maxDistanceX = canvas.width / 2;
        const maxDistanceY = canvas.height / 2;
        const attenuationX = 1 - Math.abs(distanceX) / maxDistanceX;
        const attenuationY = 1 - Math.abs(distanceY) / maxDistanceY;
        const attenuation = Math.max(attenuationX, attenuationY);
        const volume = attenuation * 0.5; // Ajuste o valor para controlar o volume máximo
    
        const somBolaPegaAudio = flavorSounds[ball.flavor];
        somBolaPegaAudio.volume = volume;
      });
    
      canvas.addEventListener("mousemove", (event) => {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        squareX = mouseX - squareWidth / 2;
      
        // Make sure the player stays within the canvas boundaries
        if (squareX < 0) {
          squareX = 0;
        } else if (squareX + squareWidth > canvas.width) {
          squareX = canvas.width - squareWidth;
        }
      });
    
      canvas.addEventListener("mousedown", () => {
        stickNewBalls = true;
      });
      
      // Adicione um novo ouvinte de eventos para o evento mouseup para indicar que o botão do mouse foi solto
      canvas.addEventListener("mouseup", () => {
        stickNewBalls = false;
      });
      
      // Adicionando os ouvintes de eventos para capturar as teclas pressionadas
      document.addEventListener("keydown", keyDownHandler);
      document.addEventListener("keyup", keyUpHandler);


      window.addEventListener("keydown", function(event) {
        // Check if Ctrl key is pressed along with Arrow Down key
        if (event.ctrlKey && event.key === "k") {
          event.preventDefault(); // Prevent default browser behavior
          const somDeFundoAudio = document.getElementById("somDeFundoAudio");
          somDeFundoAudio.volume -= 0.1; // Decrease volume by 0.1 (10%)
          if (somDeFundoAudio.volume < 0) {
            somDeFundoAudio.volume = 0; // Ensure volume is not negative
          }
        }
    
        // Check if Ctrl key is pressed along with Arrow Up key
        if (event.ctrlKey && event.key === "l") {
          event.preventDefault(); // Prevent default browser behavior
          const somDeFundoAudio = document.getElementById("somDeFundoAudio");
          somDeFundoAudio.volume += 0.1; // Increase volume by 0.1 (10%)
          if (somDeFundoAudio.volume > 1) {
            somDeFundoAudio.volume = 1; // Ensure volume does not exceed 1
          }
        }
      });

      window.addEventListener("keydown", function(event) {
        // Check if Ctrl key is pressed along with the comma key
        if (event.ctrlKey && event.key === ".") {
          event.preventDefault(); // Prevent default browser behavior
          Object.values(flavorSounds).forEach((sound) => {
            sound.volume += 0.1; // Increase volume by 0.1 (10%)
            if (sound.volume > 1) {
              sound.volume = 1; // Ensure volume does not exceed 1
            }
          });
        }
      
        // Check if Ctrl key is pressed along with the period key
        if (event.ctrlKey && event.key === ",") {
          event.preventDefault(); // Prevent default browser behavior
          Object.values(flavorSounds).forEach((sound) => {
            sound.volume -= 0.1; // Decrease volume by 0.1 (10%)
            if (sound.volume < 0) {
              sound.volume = 0; // Ensure volume is not negative
            }
          });
        }
      });
    
      // Função para capturar o pressionamento das teclas de seta
      function keyDownHandler(event) {
        if (event.key === "ArrowLeft") {
          leftPressed = true;
          rightPressed = false;
          playerPosition = -1; // Define a posição do jogador como esquerda
          somPlayerAudio.play();
        } else if (event.key === "ArrowRight") {
          rightPressed = true;
          leftPressed = false;
          playerPosition = 1; // Define a posição do jogador como direita
          somPlayerAudio.play();
        } else if (event.key === " ") { // Tecla de espaço para grudar as bolas
          stickNewBalls = true;
        }
      }
    
      // Função para capturar a liberação das teclas de seta
      function keyUpHandler(event) {
        if (event.key === "ArrowLeft") {
          leftPressed = false;
        } else if (event.key === "ArrowRight") {
          rightPressed = false;
        } else if (event.key === " ") { // Tecla de espaço para grudar as bolas
          stickNewBalls = false;
        }
      }
    
      let isTouchingWall = false;
    
      function updateSquare() {
        if (leftPressed) {
          squareX -= squareSpeed;
        } else if (rightPressed) {
          squareX += squareSpeed;
        }
    
        if (squareX < 0) {
          squareX = 0;
          if (!isTouchingWall) {
            isTouchingWall = true;
            playWallSound("left"); // Reproduz o som da parede no lado esquerdo
          }
        } else if (squareX + squareWidth > canvas.width) {
          squareX = canvas.width - squareWidth;
          if (!isTouchingWall) {
            isTouchingWall = true;
            playWallSound("right"); // Reproduz o som da parede no lado direito
          }
        } else {
          isTouchingWall = false; // O jogador não está tocando a parede
        }
      }
    
      function playWallSound(side) {
        const somParedeAudio = document.getElementById("somParedeAudio");
        somParedeAudio.currentTime = 0; // Reinicia a reprodução do som
        somParedeAudio.play();
    
        // Ajusta o posicionamento espacial do áudio com base no lado
        if (side === "left") {
          pannerNode.positionX.value = -1; // Posição X totalmente à esquerda
        } else if (side === "right") {
          pannerNode.positionX.value = 1; // Posição X totalmente à direita
        }
    
        somParedeAudio.addEventListener("ended", function() {
          pannerNode.positionX.value = 0; // Reinicia a posição X do áudio para o centro
        });
      }
    
      // Função para atualizar a posição das bolas
      function updateBalls() {
        const novasBolas = []; // Cria um array temporário para armazenar as novas bolas
      
        balls.forEach((ball) => {
          if (ball.stuck) {
            ball.x += squareX - ball.prevSquareX;
            ball.prevSquareX = squareX;
          } else {
            ball.y += ball.speed;
          }
      
          if (
            ball.y + ball.height >= squareY &&
            ball.x + ball.width >= squareX &&
            ball.x <= squareX + squareWidth
          ) {
            if (!ball.stuck && score < 100 && stickNewBalls) {
              ball.stuck = true;
              ball.prevSquareX = squareX;
      
              const currentTime = Date.now();
              if (!ball.soundPlayed || currentTime - ball.lastSoundTime > soundDelay) {
                const somBolaAudio = flavorSounds[ball.flavor];
                const somBolaPegaAudio = flavorPegoSounds[ball.flavor];
                somBolaAudio.loop = true;
                somBolaAudio.play();
                somBolaPegaAudio.play();
                ball.soundPlayed = true;
                ball.lastSoundTime = currentTime;
              }
      
              score++;
              const saborBola = ball.flavor;
      
              if (flavors.hasOwnProperty(saborBola)) {
                flavors[saborBola]++;
              } else {
                flavors[saborBola] = 1;
              }
            }
          }
      
          if (ball.y + ball.height > canvas.height) {
            const somBolaPerdidaAudio = document.getElementById("somBolaPerdida");
            somBolaPerdidaAudio.play();
            removeBall(ball);
            const somBolaPegaAudio = flavorSounds[ball.flavor];
            somBolaPegaAudio.pause();
            somBolaPegaAudio.currentTime = 0;
          }
      
          if (ball.soundPlayed && !stickNewBalls) {
            const somBolaPegaAudio = flavorSounds[ball.flavor];
            somBolaPegaAudio.loop = false;
            ball.soundPlayed = false;
          }
        });
      
        while (balls.length > maxBalls) {
          removeBall(balls[0]);
        }
      
        if (balls.length < maxBalls && Math.random() < 0.05) {
          const novaBola = {
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 50,
            height: 50,
            speed: initialBallSpeed,
            flavor: getRandomFlavor(),
            stuck: false,
            prevSquareX: squareX, // Define a posição anterior da bola como a posição atual do jogador
            soundPlayed: false,
            lastSoundTime: 0,
          };
      
          // Verifica se o sabor da nova bola está na saboresString antes de adicioná-la a novasBolas
          if (saboresString.includes(novaBola.flavor)) {
            novasBolas.push(novaBola);
            const somBolaPegaAudio = flavorSounds[novaBola.flavor];
            somBolaPegaAudio.loop = true;
            somBolaPegaAudio.play();
          }
        }
      
        balls = balls.concat(novasBolas); // Adiciona as novas bolas ao array balls
      }
      
      function verificarTodasBolasColetadas() {
        if (score === maxBalls && !todasBolasColetadas) {
          todasBolasColetadas = true;
          stopCountdown() ;
          console.log("Pegou todas as bolas!");
      
          // Criar objetos para armazenar as quantidades de cada sabor
          const pedidoQuantidades = {};
          const coletadasQuantidades = {};
      
          // Obtém o pedido da div com id "pedido"
          const pedidoDiv = document.getElementById("pedido");
          const pedido = pedidoDiv.textContent;
          console.log("Pedido:", pedido);
      
          // Parsear o pedido e contar as quantidades de cada sabor
          const regexSabores = /(\d+)\s+bolas\s+de\s+([^\d,]+(?:,\s*[^\d,]+)*)/gi;
      
          let match;
          while ((match = regexSabores.exec(pedido)) !== null) {
            const quantidade = parseInt(match[1]);
            let sabor = capitalizeFirstLetter(match[2].trim().toLowerCase().replace(/,\s*|:\s*$/g, ''));
      
            lastFlavor = sabor;
            if (pedidoQuantidades.hasOwnProperty(sabor)) {
              pedidoQuantidades[sabor] += quantidade;
            } else {
              pedidoQuantidades[sabor] = quantidade;
            }
          }
      
          console.log("Quantidades do pedido:", pedidoQuantidades);
      
          // Adicionar os sabores das bolas coletadas ao objeto de bolas coletadas
          balls.forEach((ball) => {
            if (ball.stuck) {
              const sabor = capitalizeFirstLetter(ball.flavor.replace(/,\s*|:\s*$/g, ''));
              if (coletadasQuantidades.hasOwnProperty(sabor)) {
                coletadasQuantidades[sabor]++;
              } else {
                coletadasQuantidades[sabor] = 1;
              }
            }
          });
      
          console.log("Quantidades coletadas:", coletadasQuantidades);
      
          // Combinar as quantidades do pedido e as quantidades coletadas
          let pedidoCorreto = true;
          for (const sabor in pedidoQuantidades) {
            if (pedidoQuantidades.hasOwnProperty(sabor)) {
              const quantidadePedido = pedidoQuantidades[sabor];
              const saborSemAspas = sabor.replace(/ /g, ''); // Remover espaços para comparar corretamente
              const quantidadeColetada = coletadasQuantidades[saborSemAspas] || 0;
              console.log(`${sabor}: ${quantidadeColetada}, pedido: ${quantidadePedido}`);
              
              // Verifica se a quantidade coletada é diferente da quantidade pedida
              if (quantidadeColetada !== quantidadePedido) {
                pedidoCorreto = false;
                break;
              }
            }
          }
          function avancarEtapa() {
            etapaFase4++; // Atualizar o valor da etapa
            localStorage.setItem('etapa4', etapaFase4); // Armazenar o novo valor na LocalStorage
            etapaElement.textContent = 'Atendendo ao pedido: ' + etapaFase4; // Atualizar o texto exibido na página
          }
          // Exibir o alerta de acordo com o resultado da verificação
          if (pedidoCorreto) {
            if(etapaFase4 >= 1 && etapaFase4 <= 3){
              pontuacaoCerto +=50;
              localStorage.setItem('pontuacaoCerto', pontuacaoCerto);
              console.log("Pontuação Certa: " + pontuacaoCerto);
              avancarEtapa();
              mostrarAlertaCorreto();
              gerapedido();
              resetCountdown();
            }else{
              //alert('Pontuação: ');
              mostrarRelatorio();
            }
          } else {
            mostrarAlertaErrado();
            pontuacaoErrada +=20;
            localStorage.setItem('pontuacaoErrada', pontuacaoErrada);
            console.log("Pontuação Errada: " + pontuacaoErrada);
          }
        }
      }
      
      let lastFlavor = null; // Variável auxiliar para guardar o último sabor encontrado no pedido
      
      function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      
      function mostrarAlertaCorreto() {
        lerTextoEmVozAlta('Pedido atendido!');
        const alertMessage = `Pressione Enter para atender novo pedido.`;
    
        Swal.fire({
            title: 'Pedido atendido!',
            text: alertMessage,
            icon: 'success',
            showConfirmButton: false, // Removendo o botão "OK"
            customClass: {
                container: 'meu-alerta',
                title: 'meu-titulo',
                text: 'meu-texto',
            },
        }).then((result) => {
            // Verifica se o usuário pressionou a tecla "Enter"
            if (result.dismiss === Swal.DismissReason.backdrop && event.key === 'Enter') {
                // Redireciona para a outra página
                window.location.href = 'preparacao.html';
            }
        });
    
        // Adicionar um ouvinte de eventos para capturar o pressionamento de teclas
        document.addEventListener('keyup', function (event) {
            // Verifica se a tecla pressionada é a tecla "Enter"
            if (event.key === 'Enter') {
                // Fecha o alerta
                Swal.close();
                window.location.href = 'preparacao.html';
            }
        });
        lerTextoEmVozAlta(alertMessage);
    }


    function mostrarAlertaErrado() {
      lerTextoEmVozAlta('Pedido Errado!');
      const alertMessage = `Pressione Enter para atender novo pedido.`;
  
      Swal.fire({
          title: 'Pedido Errado!',
          html: `<span class="erro-text">${alertMessage}</span>`, // Use the custom class for the text
          icon: 'error', // Use 'error' for the Font Awesome 'times-circle' icon
          showConfirmButton: false, // Removendo o botão "OK"
          customClass: {
              container: 'meu-alerta',
              title: 'meu-titulo',
          },
      }).then((result) => {
          // Verifica se o usuário pressionou a tecla "Enter"
          if (result.dismiss === Swal.DismissReason.backdrop && event.key === 'Enter') {
              // Redireciona para a outra página
              window.location.href = 'preparacao.html';
          }
      });
  
      // Adicionar um ouvinte de eventos para capturar o pressionamento de teclas
      document.addEventListener('keyup', function (event) {
          // Verifica se a tecla pressionada é a tecla "Enter"
          if (event.key === 'Enter') {
              // Fecha o alerta
              Swal.close();
              window.location.href = 'preparacao.html';
          }
      });
  
      lerTextoEmVozAlta(alertMessage);
  }

  function mostrarRelatorio() {
    AtendimentoCerto = pontuacaoCerto / 50;
    AtendimentoErrado = pontuacaoErrada / 20;
    pontuacaoTotal = pontuacaoCerto - pontuacaoErrada;
    lerTextoEmVozAlta('Pedido atendido!');
    const alertMessage = 'Você montou '+ AtendimentoCerto + " sorvetes certos, e " + AtendimentoErrado + " sorvetes errados. Sua pontuação é: " + pontuacaoTotal;

    Swal.fire({
        title: 'Pedido atendido!',
        text: alertMessage,
        icon: 'success',
        showConfirmButton: false, // Removendo o botão "OK"
        customClass: {
            container: 'meu-alerta',
            title: 'meu-titulo',
            text: 'meu-texto',
        },
    }).then((result) => {
        // Verifica se o usuário pressionou a tecla "Enter"
        if (result.dismiss === Swal.DismissReason.backdrop && event.key === 'Enter') {
            // Redireciona para a outra página
            window.location.href = 'preparacao.html';
        }
    });

    // Adicionar um ouvinte de eventos para capturar o pressionamento de teclas
    document.addEventListener('keyup', function (event) {
        // Verifica se a tecla pressionada é a tecla "Enter"
        if (event.key === 'Enter') {
            // Fecha o alerta
            Swal.close();
            window.location.href = 'preparacao.html';
        }
    });
    lerTextoEmVozAlta(alertMessage);
}


function gerapedido() {
    var sabores = [
      "abacaxi",
      "baunilha",
      "ceu_azul",
      "chocolate",
      "chocomenta",
      "creme",
      "limao",
      "morango",
      "uva"
    ];
  
    var pedido = "";
    var numSabores = 3; // Modificar para 3
    var saboresEscolhidos = [];
  
    for (var i = 0; i < numSabores; i++) {
      var sabor;
      do {
        sabor = sabores[Math.floor(Math.random() * sabores.length)];
      } while (saboresEscolhidos.includes(sabor));
  
      saboresEscolhidos.push(sabor);
  
      var quantidade = Math.floor(Math.random() * 3) + 2;
  
      pedido += quantidade + " bolas de " + sabor;
  
      if (i < numSabores - 1) {
        pedido += ", ";
      }
    }
  
    localStorage.setItem("pedido", pedido);
  }
  
  
  
      
  var etapaFase4 = localStorage.getItem('etapa4');

  if (etapaFase4 === null) {
    // Se o nível não estiver armazenado, criar a etapa 1 e armazenar na LocalStorage
    localStorage.setItem('etapa3', 3);
    etapaFase4 = 1; // Definir etapa como 1
  }

   // Exibir etapa na página
   var etapaElement = document.createElement('p');
   etapaElement.textContent = 'Atendendo ao pedido: ' + etapaFase4;
   document.body.appendChild(etapaElement);



    
      function removeBall(ball) {
        const ballIndex = balls.indexOf(ball);
        balls.splice(ballIndex, 1);
      }
    
      function getRandomFlavor() {
        const flavors = [
          "abacaxi",
          "baunilha",
          "ceu_azul",
          "chocolate",
          "chocomenta",
          "creme",
          "limao",
          "morango",
          "uva"
        ];
        return flavors[Math.floor(Math.random() * flavors.length)];
      }
    
      function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    
      function reset() {
        squareX = canvas.width / 2 - 50;
        balls = [];
        score = 0;
        flavors = {};
      }
    
      function drawPlayer() {
        ctx.drawImage(playerImage, squareX, squareY, squareWidth, squareHeight);
      }
    
      function drawBalls() {
        balls.forEach((ball) => {
          if (saboresString.includes(ball.flavor)) {
          const image = new Image();
          image.src = `img/${ball.flavor}.png`;
          ctx.drawImage(image, ball.x, ball.y, ball.width * 2, ball.height * 2);
    
          // Desenha o nome do sabor abaixo da bola
          ctx.fillStyle = "black";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(capitalizeFirstLetter(ball.flavor), ball.x + ball.width, ball.y + ball.height + 15);
        }
      });
      }
      divShowTime
      function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
    
        const countdownDiv = document.getElementById("countdown");
        countdownDiv.style.position = "absolute"; 
        countdownDiv.style.display = "none"; // Ajuste a posição vertical conforme necessário

        const UdivShowTime = document.getElementById("divShowTime");
        UdivShowTime.style.position = "absolute"; 
        UdivShowTime.style.top = "10px"; // Ajuste a posição vertical conforme necessário
    
        const contador = parseInt(countdownDiv.textContent); // Usando o valor do div countdown
        const contadorText = "Você tem " + contador + " segundos para preparar o pedido";
        UdivShowTime.innerText = contadorText;
    
        const scoreText = "Bolas Pegas:";
        const scoreTextWidth = ctx.measureText(scoreText).width;
        ctx.fillText(scoreText, canvas.width - scoreTextWidth - 10, 20);
    
        let yOffset = 40;
        for (const flavor in flavors) {
            if (flavors.hasOwnProperty(flavor)) {
                const flavorText = flavor + ": " + flavors[flavor];
                const flavorTextWidth = ctx.measureText(flavorText).width;
                ctx.fillText(flavorText, canvas.width - flavorTextWidth - 10, yOffset);
                yOffset += 20;
            }
        }
    }
    
    
    let todasBolasColetadas = false;
    


      




      function gameLoop() {
        clearCanvas();
        drawPlayer();
        drawBalls();
        drawScore();
        updateSquare();
        updateBalls();
        updateAudioPosition();
        
        if (!todasBolasColetadas) {
          verificarTodasBolasColetadas();
        }
        
        requestAnimationFrame(gameLoop);
      }
      
      function lerTextoEmVozAlta(texto) {
        // Verifica se o navegador suporta a API de Síntese de Fala
        if ('speechSynthesis' in window) {
            // Cria um objeto de fala
            var fala = new SpeechSynthesisUtterance(texto);
  
            // Inicia a síntese de fala
            speechSynthesis.speak(fala);
        } else {
            alert("Desculpe, a síntese de fala não é suportada neste navegador.");
        }
    }
      let stickNewBalls = false; // Variável para controlar a colagem das bolas ao jogador
      gameLoop();
      startCountdown();
}
