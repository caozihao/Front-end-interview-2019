$("#encode-btn").on("click", function () {
  var value = htmlEncode($("#value").val());
  console.log('value ->', value);
  $("#show-panel").html(value);
  var htmlContent = $("#test").html();
  var textContent = $("#test").text();
  console.log('htmlContent ->', htmlContent);
  console.log('textContent ->', textContent);
})

$("#decode-btn").on("click", function () {
  var value = htmlDecode($("#value").val());
  console.log('value ->', value);
  $("#show-panel").html(value)
})

function htmlEncode(value) {
  return $("<div/>").text(value).html();
}

function htmlDecode(value) {
  return $("<div/>").html(value).text();
}