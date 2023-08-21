var fase = localStorage.getItem('fase');

if(fase == 1){
  let pontosPerdidos = 0
  let pontuacao = 0;

  let pontuacaoFinal;
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
    var sabor = sabores[Math.floor(Math.random() * sabores.length)];
    var quantidade = Math.floor(Math.random() * 3 ) + 2;
  
    var pedido = quantidade + " bolas de " + sabor; // Initialize pedido variable
  
    // Save the pedido in localStorage
    localStorage.setItem("pedido", pedido);
  }
    //window.alert('é 1');
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
        //document.getElementById("pedido").innerHTML = pedidoSalvo;
       lerpedidoEmVozAlta('Prepare ' + pedidoSalvo);
        alert("Prepare: " + pedidoSalvo);
       
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



      var total = 0;
    
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
    
      function calculateDistance(x1, y1, x2, y2) {
        const xDistance = x2 - x1;
        const yDistance = y2 - y1;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
      }
      
      // Função para atualizar o volume do som com base na posição da bola em relação ao jogador
      function updateSoundVolume(ball) {
        const canvasHeight = canvas.height;
        const ballCenterY = ball.y + ball.height / 2;
      
        // Calculate the normalized vertical position of the center of the ball relative to the canvas (0 to 1)
        const normalizedY = ballCenterY / canvasHeight;
      
        // Define the volume as a linear function of the normalized vertical position
        // Starts with low volume at the top and increases towards the bottom
        const volume = 0.1 + 0.9 * normalizedY;
      
        // Set the volume of the ball's audio
        const somBolaAudio = flavorSounds[ball.flavor];
        somBolaAudio.volume = volume;
      }
      
      
      
      
      
      // Função para ajustar o posicionamento espacial do áudio com base na posição do jogador
      function updateAudioPosition() {
        const ballsAbovePlayer = balls.filter((ball) => ball.y < squareY);
        let nearestBallAbovePlayer = ballsAbovePlayer.reduce((nearestBall, ball) => {
          return (Math.abs(ball.x - squareX) < Math.abs(nearestBall.x - squareX)) ? ball : nearestBall;
        }, { x: Infinity, y: 0 });
      
        // Se existir uma bola acima do jogador, atualiza a posição do som com base na posição y da bola
        if (nearestBallAbovePlayer.x !== Infinity) {
          const canvasHeight = canvas.height;
          const positionY = nearestBallAbovePlayer.y / canvasHeight;
          const maxVolume = 0.5; // Volume máximo (pode ser ajustado conforme necessário)
          const volume = maxVolume - positionY * maxVolume; // Volume diminui à medida que a posição vertical aumenta
          pannerNode.positionY.value = positionY;
          pannerNode.positionZ.value = volume; // Usamos a posição Z para controlar o volume
        }
      
        // Calcula a posição Y do áudio com base na posição vertical do jogador
        const positionY = (canvas.height - squareY) / canvas.height;
        pannerNode.positionY.value = positionY;
      
          // Calculate the X position of the audio based on the left and right key presses
          const positionX = (rightPressed ? 1 : 0) - (leftPressed ? 1 : 0);
          pannerNode.positionX.value = positionX;


        // Calcula a posição Z do áudio com base na velocidade do jogador
        const velocityZ = (rightPressed ? 1 : 0) - (leftPressed ? 1 : 0);
        pannerNode.positionZ.value = velocityZ;
      
        balls.forEach((ball) => {
          if (ball.stuck) {
            updateSoundVolume(ball);
          }
        });
      }
      
    
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
        // Check if Ctrl key is pressed along with k key
        if (event.ctrlKey && event.key === "k") {
          event.preventDefault(); // Prevent default browser behavior
          const somDeFundoAudio = document.getElementById("somDeFundoAudio");
          somDeFundoAudio.volume -= 0.1; // Decrease volume by 0.1 (10%)
          if (somDeFundoAudio.volume < 0) {
            somDeFundoAudio.volume = 0; // Ensure volume is not negative
          }
        }
    
        // Check if Ctrl key is pressed along with l key
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
  // Check if ctrl key is pressed along with Arrow left key
  if (event.ctrlKey && event.key === "ArrowLeft") {
    event.preventDefault(); // Prevent default browser behavior
    Object.values(flavorSounds).forEach((sound) => {
      sound.volume -= 0.1; // Decrease volume by 0.1 (10%)
      if (sound.volume < 0) {
        sound.volume = 0; // Ensure volume is not negative
      }
    });
  }

  // Check if ctrl key is pressed along with Arrow right key
  if (event.ctrlKey && event.key === "ArrowRight") {
    event.preventDefault(); // Prevent default browser behavior
    Object.values(flavorSounds).forEach((sound) => {
      sound.volume += 0.1; // Increase volume by 0.1 (10%)
      if (sound.volume > 1) {
        sound.volume = 1; // Ensure volume does not exceed 1
      }
    });
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
      function updatePontuacao() {
       const bolasColetadas = balls.filter((ball) => ball.stuck);
       pontuacao = 0; // Zera a pontuação antes de recalcular com as bolas coletadas
     
       // Incrementa a pontuação em 3 para cada bola coletada
       bolasColetadas.forEach((ball) => {
         pontuacao += 30;
       });
     }
      // Função para atualizar a posição das bolas
      function updateBalls() {
        balls.forEach((ball) => {
          if (ball.stuck) {
            ball.x += squareX - ball.prevSquareX;
            ball.prevSquareX = squareX;
          } else {
            ball.y += ball.speed;
            if (!ball.stuck) {
              const ballCenterX = ball.x + ball.width / 2;
              const normalizedX = (ballCenterX / canvas.width) * 2 - 1;
          
              // Set the panning based on the normalized horizontal position
              const panner = ballPanners[ball.flavor];
              panner.positionX.value = normalizedX;
          }

          
        }
          if (ball.y + ball.height >= squareY &&
            ball.x + ball.width >= squareX &&
            ball.x <= squareX + squareWidth) {
            if (!ball.stuck && score < 100 && stickNewBalls) {
              ball.stuck = true;
              ball.prevSquareX = squareX;
      
              updatePontuacao();
      
              const currentTime = Date.now();
              if (!ball.soundPlayed || currentTime - ball.lastSoundTime > soundDelay) {
                const somBolaAudio = flavorSounds[ball.flavor];
                const somBolaPegaAudio = flavorPegoSounds[ball.flavor];
                somBolaAudio.loop = true; // Enable the sound loop
                somBolaAudio.play();
                somBolaPegaAudio.play();
                ball.soundPlayed = true;
                ball.lastSoundTime = currentTime;
      
                // Update panning functionality
                const panner = ballPanners[ball.flavor];
                const canvasCenterX = canvas.width / 2;
                const ballCenterX = ball.x + ball.width / 2;
      
                // Calculate the X position of the audio based on the relative position of the ball
                const positionX = (ballCenterX - canvasCenterX) / canvasCenterX;
                panner.positionX.value = positionX;
              }
      
              score++;
              const ballFlavor = ball.flavor;
      
              if (flavors.hasOwnProperty(ballFlavor)) {
                flavors[ballFlavor]++;
              } else {
                flavors[ballFlavor] = 1;
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

            
            if (pontuacao > 0) {
              pontuacao-=10;
              lerpedidoEmVozAlta('perdeu 10 ponto');
              pontosPerdidos += 10
            }
          }
    
          if (ball.soundPlayed && !stickNewBalls) {
            const somBolaPegaAudio = flavorSounds[ball.flavor];
            somBolaPegaAudio.loop = false; // Desabilita o loop do som
            ball.soundPlayed = false;
          }
        });
    
        while (balls.length > maxBalls) {
          removeBall(balls[0]);
        }
        

          
        if (balls.length < maxBalls && Math.random() < 0.05) {
            const randomFlavor = getRandomFlavor();
            if (sabores.includes(randomFlavor)) {
              const ballPanner = new PannerNode(audioCtx, pannerOptions);
              const newBall = {
                x: Math.random() * (canvas.width - 50),
                y: 0,
                width: 50,
                height: 50,
                speed: initialBallSpeed,
                flavor: randomFlavor,
                stuck: false,
                prevSquareX: 0,
                soundPlayed: false,
                lastSoundTime: 0
              };
              balls.push(newBall);
              const somBolaPegaAudio = flavorSounds[newBall.flavor];
              somBolaPegaAudio.loop = true; // Habilita o loop do som
              somBolaPegaAudio.play();
            }
          }
        
        balls.forEach((ball) => {
          ball.speed += ballAcceleration;
        });
      }
    
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
          const image = new Image();
          image.src = `img/${ball.flavor}.png`;
          ctx.drawImage(image, ball.x, ball.y, ball.width * 2, ball.height * 2);
    
          // Desenha o nome do sabor abaixo da bola
          ctx.fillStyle = "black";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(capitalizeFirstLetter(ball.flavor), ball.x + ball.width, ball.y + ball.height + 15);

        });
      }
    
      function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
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
    
      let jogoFinalizado = false;
      var etapaArmazenado = localStorage.getItem('etapa');

      if (etapaArmazenado === null) {
        // Se o nível não estiver armazenado, criar a etapa 1 e armazenar na LocalStorage
        localStorage.setItem('etapa', 1);
        etapaArmazenado = 1; // Definir etapa como 1
      }

       // Exibir etapa na página
       var etapaElement = document.createElement('p');
       etapaElement.textContent = 'Atendendo ao pedido: ' + etapaArmazenado;
       document.body.appendChild(etapaElement);


      function gameLoop() {
        clearCanvas();
        drawPlayer();
        drawBalls();
        drawScore();
        updateSquare();
        updateBalls();
        updateAudioPosition();
        requestAnimationFrame(gameLoop); // Atualiza o posicionamento espacial do áudio com base na posição do jogador



        if (!jogoFinalizado && score >= maxBalls) {
          console.log("Jogador pegou todas as bolas!");
          console.log("Bola máxima:", maxBalls);
        
          const bolasColetadas = balls.filter((ball) => ball.stuck);
          console.log("Bolas coletadas:", bolasColetadas.map((ball) => ball.flavor));
          const saboresColetados = bolasColetadas.map((ball) => ball.flavor);
        
          const todosSaboresColetados = sabores.every((sabor) => saboresColetados.includes(sabor));
        
          if (todosSaboresColetados) {
            console.log("Parabéns! O jogador coletou todos os sabores solicitados!");
            pontuacaoFinal = pontuacao - pontosPerdidos;
            console.log("Pontuação final:", pontuacaoFinal);
            if(etapaArmazenado >= 1 && etapaArmazenado <= 4){
              function avancarEtapa() {
                etapaArmazenado++; // Atualizar o valor da etapa
                localStorage.setItem('etapa', etapaArmazenado); // Armazenar o novo valor na LocalStorage
                etapaElement.textContent = 'Atendendo ao pedido: ' + etapaArmazenado; // Atualizar o texto exibido na página
              }
              avancarEtapa();
              gerapedido();
              mostrarAlerta();
             
            
          




            }else{
              localStorage.setItem('fase', 2);
              gerapedido2();
              window.location.href = 'preparacao.html';
            }
            // Faça aqui as ações adicionais que deseja realizar quando o jogador coletar todos os sabores solicitados.
          } else {
            console.log("O jogador não coletou todos os sabores solicitados.");
            // Faça aqui as ações adicionais que deseja realizar quando o jogador não coletar todos os sabores solicitados.
          }
        
          const novapartida = document.getElementById("somNovaPartida");
          novapartida.play();
          somDeFundoAudio.pause();
        
          jogoFinalizado = true;
        }
        
      }
    
      let stickNewBalls = false; // Variável para controlar a colagem das bolas ao jogador
      
      function gerapedido2() {
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
        var numSabores = 2;
        var saboresEscolhidos = []; // Array para armazenar os sabores já escolhidos
      
        for (var i = 0; i < numSabores; i++) {
          var sabor;
          do {
            sabor = sabores[Math.floor(Math.random() * sabores.length)];
          } while (saboresEscolhidos.includes(sabor)); // Verificar se o sabor já foi escolhido
      
          saboresEscolhidos.push(sabor);
      
          var quantidade = Math.floor(Math.random() * 3) + 2;
      
          pedido += quantidade + " bolas de " + sabor;
      
          if (i < numSabores - 1) {
            pedido += ", "; // Usando ", " para separar os dois sabores
          }
        }
      
        // Salvar o pedido no localStorage
        localStorage.setItem("pedido", pedido);
      }
      
      function mostrarAlerta() {
        lerTextoEmVozAlta('Pedido atendido!');
        const alertMessage = `${maxBalls} bolas de ${saboresString}.\nVocê fez: ${pontuacaoFinal} pontos.\n\n\n\nPressione Enter para atender novo pedido.`;
    
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
      
    const ballPanners = {
      abacaxi: new PannerNode(audioCtx, pannerOptions),
      baunilha: new PannerNode(audioCtx, pannerOptions),
      ceu_azul: new PannerNode(audioCtx, pannerOptions),
      chocolate: new PannerNode(audioCtx, pannerOptions),
      chocomenta: new PannerNode(audioCtx, pannerOptions),
      creme: new PannerNode(audioCtx, pannerOptions),
      limao: new PannerNode(audioCtx, pannerOptions),
      morango: new PannerNode(audioCtx, pannerOptions),
      uva: new PannerNode(audioCtx, pannerOptions)
    };
    
    
    Object.keys(flavorSounds).forEach((flavor) => {
      const source = audioCtx.createMediaElementSource(flavorSounds[flavor]);
      source.connect(ballPanners[flavor]).connect(audioCtx.destination);
    });
    
    

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
      gameLoop();

} 