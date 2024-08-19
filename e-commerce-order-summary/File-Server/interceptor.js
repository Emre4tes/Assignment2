(function($) {
  // Tüm AJAX isteklerini yakalayacak bir interceptor ekliyoruz
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          // İsteğe yetkilendirme header'ı ekleme
          const token = localStorage.getItem('jwtToken');
          if (token) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }

          // İsteği loglama
          console.log(`Sending request to ${settings.url} with method ${settings.type}`);
      },
      complete: function(xhr, status) {
          // Yanıtı loglama
          console.log(`Request to ${xhr.responseURL} completed with status ${status}`);
      },
      error: function(xhr, status, error) {
          // Hata durumunu ele alma
          if (xhr.status === 401) {
              alert('Session expired. Please log in again.');
              window.location.href = '/login';
          } else {
              console.error(`Error in request: ${status}, ${error}`);
          }
      }
  });
})(jQuery);
