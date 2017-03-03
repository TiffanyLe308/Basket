$(document).ready(function() {
  $("#hide").click(function(){
      $(".commentMenu").hide(300);
  });
  $("#show").click(function(){
      $(".commentMenu").show(300);
  });


  $("#button").click(function() {
      var toAdd = $("textarea[name=commentForm]").val();
      $(".commentList").append('<div class="item">' + toAdd + '</div>');
  });
});
