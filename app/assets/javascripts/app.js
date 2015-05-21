$(function(){
  console.log("================================");
  console.log("Interested in teaching Rails?");
  console.log("We are looking for talents on RoR, Jquery");
  console.log("================================");
  // Form ajax start
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
  // Accordion

  $(document).on("click", ".accordion-navigation", function(e){
    $item = $(e.target).parent();
    $plusMinus = $item.find(".plusminus");
    if($item.hasClass("active")){
      $plusMinus.text("-");
    }else{
      $plusMinus.text("+");
    }
  });

  // equal heigh div;
  $(".eq-height").matchHeight({
    byRow: true,
    property: 'height'
  });

  // text rotator on index
  $(".rotate").textrotator({
    animation: "flipCube", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
    separator: "|", // If you don't want commas to be the separator, you can define a new separator (|, &, * etc.) by yourself using this field.
    speed: 5000 // How many milliseconds until the next word show.
  });



});






