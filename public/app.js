$(document).ready(function(){
  $(".articles").on("click", function(e){
    e.preventDefault();
    $(".allArticles").empty();
  $.getJSON("/scrape", function(data){
  })
  $.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++){
      console.log(data[i].title);
    }
  })

  
  })
})