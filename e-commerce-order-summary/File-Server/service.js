// Deferred kullanarak API isteği yapmak için fonksiyon
function fetchWithRetry(url, options = {}, attempts = 5, delayMs = 100) {
  var deferred = $.Deferred();

  function attemptFetch(remainingAttempts) {
      $.ajax(url, options)
          .done(data => deferred.resolve(data))
          .fail((jqXHR, textStatus) => {
              try {
                  if (remainingAttempts <= 1) {
                      // Exception handling: Hata loglama ve bildirim
                      console.error(`Request failed after ${attempts} attempts. Status: ${jqXHR.status}, Message: ${textStatus}`);
                      deferred.reject(new Error(`Final error after ${attempts} attempts: ${textStatus}`));
                  } else {
                      // Exception handling: Kısa bir süre bekleyip tekrar deneme
                      console.warn(`Request failed. Retrying... Remaining attempts: ${remainingAttempts - 1}`);
                      setTimeout(() => attemptFetch(remainingAttempts - 1), delayMs);
                  }
              } catch (error) {
                  // Eğer başka bir hata olursa bunu da yakala
                  console.error('An unexpected error occurred:', error);
                  deferred.reject(error);
              }
          });
  }

  attemptFetch(attempts);
  return deferred.promise();
}

// API çağrılarını yönetmek için fonksiyon
const createApiRequest = function (endpoint, params = '', attempts = 5, delayMs = 100) {
  const apiUrl = 'http://localhost:3000';
  const uniqueIdentifier = '3b5c6d1e-8a6a-44c8-9baf-7a2b4c1e9c59';
  const url = `${apiUrl}/${endpoint}${params}`;
  const options = {
      headers: { 'Authorization': `Bearer ${uniqueIdentifier}` },
      dataType: 'json'
  };

  return fetchWithRetry(url, options, attempts, delayMs);
}

// Sipariş, vergi ve gönderim detaylarını almak için servis fonksiyonları
var OrderSummary = function() {
  function retrieveOrderDetails() {
      return createApiRequest('order', '', 5, 100);
  }

  function retrieveTaxDetails() {
      return createApiRequest('tax', '', 5, 100);
  }

  function retrieveShippingDetails(weight) {
      return createApiRequest(`shipping?weight=${weight}`, '', 5, 100);
  }

  return {
      retrieveOrderDetails,
      retrieveShippingDetails,
      retrieveTaxDetails
  };
}

// Yardımcı fonksiyonlar
function helpers() {
  function displayItems(items) {
      return items.map(item => `
          <div>${item.name} - $${item.price.toFixed(2)} x ${item.qty}</div>
      `).join('');
  }

  function displayItemsTotal(amount) {
      return `Items Total: $${amount.toFixed(2)}`;
  }

  function displayShippingInfo(shipping) {
      return `
          <strong>Carrier:</strong> ${shipping.carrier}<br>
          <strong>Address:</strong> ${shipping.address}<br>
          <strong>Cost:</strong> $${shipping.cost.toFixed(2)}
      `;
  }

  function displayTaxDetails(tax) {
      return `Tax Rate: ${(tax.rate * 100).toFixed(2)}%`;
  }

  function displayGrandTotal(itemsTotal, shippingCost, taxAmount) {
      const grandTotal = itemsTotal + shippingCost + taxAmount;
      return `Total: $${grandTotal.toFixed(2)}`;
  }

  return {
      displayGrandTotal,
      displayItems,
      displayItemsTotal,
      displayShippingInfo,
      displayTaxDetails
  };
}

// Export işlemleri
export { OrderSummary, helpers };
