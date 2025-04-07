const api_key = "2eafac336ce41e412e31252dc7425470";
const api_url = `https://api.currencylayer.com/list?access_key=${api_key}`;

$.get(api_url, (data) => {
  if (data.success) {
    const options = Object.entries(data.currencies)
      .map(
        ([code, name]) => `<option value="${code}">${code} - ${name}</option>`
      )
      .join("");
    $("#fromCurrency").html(options).val("USD");
    $("#toCurrency").html(options).val("INR");
  }
});

$("#convertBtn, #amount").on("click keypress", (e) => {
  if (e.type === "keypress" && e.key !== "Enter") return;

  const amount = $("#amount").val();
  const from = $("#fromCurrency").val();
  const to = $("#toCurrency").val();

  $("#loading").removeClass("d-none");
  $("#result, #error").addClass("d-none");
  $("#convertBtn").prop("disabled", true);

  $.get(
    `https://api.currencylayer.com/convert?access_key=${api_key}&from=${from}&to=${to}&amount=${amount}`
  )
    .done((data) => {
      if (data.success) {
        const result = `${parseFloat(
          amount
        ).toLocaleString()} ${from} = ${data.result.toLocaleString()} ${to}`;
        $(".conversion-result").text(result);
        $("#updateTime").text(new Date().toLocaleString());
        $("#result").removeClass("d-none");
      } else {
        throw new Error(data.error.info);
      }
    })
    .fail((err) => {
      $("#error").text(err.message).removeClass("d-none");
    })
    .always(() => {
      $("#loading").addClass("d-none");
      $("#convertBtn").prop("disabled", false);
    });
});
