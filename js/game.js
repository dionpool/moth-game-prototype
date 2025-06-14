$(document).ready(function() {
   const $glow = $('.glow');
   const mothCount = 10;
   const moths = [];
   const mothData = [];

   let isGlowOn = true;
   let killCount = 0

   function spawnMoth() {
      // Set the moth
      const $moth = $('<img>', {
         src: 'images/moth.svg',
         class: 'moth'
      });

      // Generate random start position
      const posX = Math.random() * $(window).width();
      const posY = Math.random() * $(window).height();

      $moth.css({
         left: posX + 'px',
         top: posY + 'px'
      });

      $('body').append($moth);
      moths.push($moth);

      // Store the position of the moths
      mothData.push({
         x: posX,
         y: posY,
         speed: 0.5 + Math.random() * 1.5,
         angle: 0,
         exploded: false
      });
   }

   function updateKillCounter() {
      killCount++;
      $('#kill-counter').text('Kills: ' + killCount);
   }

   // Create explosion effect
   function createExplosion(x, y) {
      updateKillCounter();

      const $explosion = $('<div>', {
         class: 'explosion',
         css: {
            position: 'absolute',
            left: x + 'px',
            top: y + 'px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 220, 100, 0.8)',
            boxShadow: '0 0 20px 10px rgba(255, 150, 50, 0.5)',
            transform: 'scale(0)',
            zIndex: 999
         }
      });

      $('body').append($explosion);

      // Animate explosion
      $explosion.animate({
         opacity: 0.8,
         transform: 'scale(1)'
      }, 150, function() {
         $explosion.animate({
            opacity: 0,
            transform: 'scale(1.5)'
         }, 300, function() {
            $explosion.remove();
         });
      });

      // Add particles for more effect
      for (let i = 0; i < 8; i++) {
         const angle = Math.random() * Math.PI * 2;
         const distance = 20 + Math.random() * 30;
         const particleX = x + Math.cos(angle) * distance;
         const particleY = y + Math.sin(angle) * distance;

         const $particle = $('<div>', {
            class: 'particle',
            css: {
               position: 'absolute',
               left: x + 'px',
               top: y + 'px',
               width: '6px',
               height: '6px',
               borderRadius: '50%',
               backgroundColor: `hsl(${30 + Math.random() * 30}, 100%, 70%)`,
               zIndex: 998
            }
         });

         $('body').append($particle);

         $particle.animate({
            left: particleX + 'px',
            top: particleY + 'px',
            opacity: 0
         }, 500 + Math.random() * 500, function() {
            $particle.remove();
         });
      }
   }

   // Respawn a moth after explosion
   function respawnMoth(index) {
      // Replace the exploded moth
      const $moth = moths[index];
      $moth.remove();

      // Create new moth
      const $newMoth = $('<img>', {
         src: 'images/moth.svg',
         class: 'moth'
      });

      // Random position off screen
      const side = Math.floor(Math.random() * 4);
      let posX, posY;

      switch(side) {
         case 0: // top
            posX = Math.random() * $(window).width();
            posY = -50;
            break;
         case 1: // right
            posX = $(window).width() + 50;
            posY = Math.random() * $(window).height();
            break;
         case 2: // bottom
            posX = Math.random() * $(window).width();
            posY = $(window).height() + 50;
            break;
         case 3: // left
            posX = -50;
            posY = Math.random() * $(window).height();
            break;
      }

      $newMoth.css({
         left: posX + 'px',
         top: posY + 'px',
         opacity: isGlowOn ? '1' : '0.5'
      });

      $('body').append($newMoth);
      moths[index] = $newMoth;

      // Update data
      mothData[index] = {
         x: posX,
         y: posY,
         speed: 0.5 + Math.random() * 1.5,
         angle: 0,
         exploded: false
      };
   }

   // Spawn the moths
   for (let i = 0; i < mothCount; i++) {
      spawnMoth();
   }

   // Moth animation for smooth movement
   function animateMoths() {
      const cursorX = parseInt($glow.css('left')) || $(window).width() / 2;
      const cursorY = parseInt($glow.css('top')) || $(window).height() / 2;

      $.each(moths, function(index, $moth) {
         const data = mothData[index];

         if (isGlowOn && !data.exploded) {
            // Calculate the direction to the cursor
            const dx = cursorX - data.x;
            const dy = cursorY - data.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            // Check if moth is close enough to explode
            if (distance < 20) {
               // Mark as exploded so it doesn't trigger multiple times
               data.exploded = true;

               // Create explosion effect
               createExplosion(data.x, data.y);

               // Respawn the moth after a delay
               setTimeout(function() {
                  respawnMoth(index);
               }, 1000);

               return;
            }

            // Update position with a speed factor
            data.x += Math.cos(angle) * data.speed;
            data.y += Math.sin(angle) * data.speed;

            // Apply new position and rotation
            $moth.css({
               left: data.x + 'px',
               top: data.y + 'px',
               transform: 'rotate(' + (angle * (180 / Math.PI)) + 'deg)'
            });
         }
      });

      requestAnimationFrame(animateMoths);
   }

   // Toggle glow on click
   $(document).on('click', function() {
      isGlowOn = !isGlowOn;

      if (isGlowOn) {
         $glow.css('opacity', '1');

         $.each(moths, function(index, $moth) {
            $moth.css('opacity', '1');
         });
      } else {
         $glow.css('opacity', '0');

         $.each(moths, function(index, $moth) {
            $moth.css('opacity', '0.5');
         });
      }
   });

   // Update glow position on mouse move
   $(document).on('mousemove', function(e) {
      $glow.css({
         left: e.clientX + 'px',
         top: e.clientY + 'px'
      });
   });

   // Start the moth animation
   animateMoths();
});
