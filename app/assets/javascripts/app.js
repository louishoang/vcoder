$(function(){
  $(document).on("submit", ".form-ajax", function(e){
    e.preventDefault();
    $this = $(e.target);
    $url = $this.data("url");
    var $method = $this.attr("method") || "POST";
    $params = $( this ).serialize();

    $.ajax({
      type: $method,
      url: $url,
      data: $params,
      dataType: "json",
      beforeSend: function(){
        $this.find(":input").prop('disabled', true);
      },
      complete: function() {
        $this.find(":input").prop('disabled', false);
      },
      success: function(response) {
        toastr.success(response.data);
        $this.trigger("reset");
      },
      error: function(response, status, error) {
        toastr.error(error.message, 'Error!');
      }
    });
  });
});
