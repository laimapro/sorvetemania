var fase = localStorage.getItem('fase');

if(fase == 2){
    console.log('é fase 2 , uhul');
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
        document.getElementById("pedido").innerHTML = pedidoSalvo;
      } else {
        document.getElementById("pedido").innerHTML = "Nenhum pedido encontrado.";
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
        if (event.ctrlKey && event.key === "ArrowDown") {
          event.preventDefault(); // Prevent default browser behavior
          const somDeFundoAudio = document.getElementById("somDeFundoAudio");
          somDeFundoAudio.volume -= 0.1; // Decrease volume by 0.1 (10%)
          if (somDeFundoAudio.volume < 0) {
            somDeFundoAudio.volume = 0; // Ensure volume is not negative
          }
        }
    
        // Check if Ctrl key is pressed along with Arrow Up key
        if (event.ctrlKey && event.key === "ArrowUp") {
          event.preventDefault(); // Prevent default browser behavior
          const somDeFundoAudio = document.getElementById("somDeFundoAudio");
          somDeFundoAudio.volume += 0.1; // Increase volume by 0.1 (10%)
          if (somDeFundoAudio.volume > 1) {
            somDeFundoAudio.volume = 1; // Ensure volume does not exceed 1
          }
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
        balls.forEach((ball) => {
          if (ball.stuck) {
            ball.x += squareX - ball.prevSquareX;
            ball.prevSquareX = squareX;
          } else {
            ball.y += ball.speed;
          }
    
          if (ball.y + ball.height >= squareY &&
            ball.x + ball.width >= squareX &&
            ball.x <= squareX + squareWidth) {
            if (!ball.stuck && score < 100 && stickNewBalls) {
              ball.stuck = true;
              ball.prevSquareX = squareX;
    
              const currentTime = Date.now();
              if (!ball.soundPlayed || currentTime - ball.lastSoundTime > soundDelay) {
                const somBolaAudio = flavorSounds[ball.flavor];
                const somBolaPegaAudio = flavorPegoSounds[ball.flavor];
                somBolaAudio.loop = true; // Habilita o loop do som
                somBolaAudio.play();
                somBolaPegaAudio.play();
                ball.soundPlayed = true;
                ball.lastSoundTime = currentTime;
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
          const newBall = {
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 50,
            height: 50,
            speed: initialBallSpeed,
            flavor: getRandomFlavor(),
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
        const scoreText = "Pontuação: " + score;
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
    
      function gameLoop() {
        clearCanvas();
        drawPlayer();
        drawBalls();
        drawScore();
        updateSquare();
        updateBalls();
        updateAudioPosition(); // Atualiza o posicionamento espacial do áudio com base na posição do jogador
        requestAnimationFrame(gameLoop);
      }
    
      let stickNewBalls = false; // Variável para controlar a colagem das bolas ao jogador
      gameLoop();
}
