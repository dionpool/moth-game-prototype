$(document).ready(function() {
   const $glow = $('.glow');
   const mothCount = 10;
   const moths = [];
   const mothData = [];

   let isGlowOn = true;

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
         angle: 0
      });
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

         if (isGlowOn) {
            // Calculate the direction to the cursor
            const dx = cursorX - data.x;
            const dy = cursorY - data.y;
            const angle = Math.atan2(dy, dx);

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

   // Show popup
   function showPopup() {
      $('#popup-container').removeClass('hidden').hide().fadeIn(300);
   }

   // Close popup
   function closePopup() {
      $('#popup-container').fadeOut(300);
   }

   // Close button event
   $('.close-popup, #popup-close-btn').on('click', function () {
      closePopup();
   });

   // Close when click on overlay
   $('.popup-overlay').on('click', function () {
      closePopup();
   });

   // Prevent closing when clicking on the popup itself
   $('.popup').on('click', function (e) {
      e.stopPropagation()
   });

   // Show popup on button click
   $('#info-popup').on('click', function () {
      showPopup()
   });
});
