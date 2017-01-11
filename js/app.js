var limitDulces = 9;
var $dulcePrevDrop = null;
var $dulceNextDrop = null;
//______Función que inserta los dulces en el wraperList_________//
function dulceInsert(wraperDulces){
  var $wraper = $(wraperDulces);
  var wraperOffset = $wraper.offset();
  var wraperSize = {height : $wraper.height(), width: $wraper.width()}
  var numRandom = Math.floor(Math.random() * 4) + 1;
  var $dulce = $("<li><img class='dulce' src='./image/" + numRandom + ".png' name='dulce" + numRandom + "' alt='dulce'/></li>");
  var $dulceFirst = $wraper.children("li").first();
  var dulceTop =  ($dulceFirst.length > 0) ? $dulceFirst.position().top : wraperSize.height;
  if($wraper.children("li").length == limitDulces){
    return;
  }
  $wraper.prepend($dulce
                    .css({top: -dulceTop, position: "relative"})
                    .show()
                    .animate({top: 0}
                      , 500
                      , function(event, ui){
                        Game_PushUpDown(wraperDulces, this);
                      })
  );
}

//______función que para la ejecución de inserción de un dulce_________//
function stopInsert(loopDulcesInsertId){
  var wrapers = $(".wraper-dulces").map(function(){
    return ($(this).children("li").length < limitDulces) ? this : null;
  });
  if(wrapers.length > 0 ){
    return;
  }
  clearInterval(loopDulcesInsertId);
}

//_______Función que inicia el Juego________//
function Game_Ready(){
  var wraper;
  $(".wraper-dulces").each(function(i, wraper){
    var numDulces = $(wraper).children("li").size();
    if(numDulces < limitDulces){
      var loopDulcesInsertId = setInterval(function(){
          dulceInsert(wraper);
          stopInsert(loopDulcesInsertId);
        }, 200, loopDulcesInsertId);
    }
  });
}

//_______Función que termina el Juego________//
function Game_Over(){
  var puntaje = $("#score-text").text();
  //Animación
  $(".panel-tablero").hide('explode').empty();
  $(".panel-score").animate({width:"100%", margin:"0 auto"}, 4000).find(".time, .buttons").empty();
}

//______Función que empuja al grupo de 3  más dulces en línea del mismo nombre_________//
function Game_PushUpDown(wraper, dulce){
  var $wraper = $(wraper);
  var $dulces = $wraper.children("li");
  if( $dulces.length > 1){
    $dulces = (dulce!= undefined)?$(dulce):$dulces;
    $.each($dulces, function(i){
      var $dulce = $(this);
      var $dulcePrev = $dulce.prev();
      var $dulceNext = $dulce.next();
      var findUp = ($dulcePrev.children("img").attr("name") == $dulce.children("img").attr("name"));
      var findDown = ($dulceNext.children("img").attr("name") == $dulce.children("img").attr("name"));
      var dulcesDestroy = [];
      //busca coincidencias hacia arriba (Up)
      while(findUp){
        if(dulcesDestroy.length == 0){
          dulcesDestroy.push($dulce);
        }
        dulcesDestroy.push($dulcePrev);
        $dulcePrev = $dulcePrev.prev();
        findUp = ($dulcePrev.children("img").attr("name") == $dulce.children("img").attr("name"));
      }
      //busca coincidencias hacia abajo (Up)
      while(findDown){
        if(dulcesDestroy.length==0){
          dulcesDestroy.push($dulce);
          i++;
        }
        if(dulcesDestroy.length>=1){
          dulcesDestroy.push($dulceNext);
        }
        $dulceNext = $dulceNext.next();
        findDown = ($dulceNext.children("img").attr("name") == $dulce.children("img").attr("name"));
      }

      if(dulcesDestroy.length >= 3){
        $.each(dulcesDestroy, function(){
          $(this).data("destroy", "true");
        });
      }
      Game_PushLeftRight(wraper, dulce);
    });
  }
}

//______Función que empuja al grupo de 3  más dulces en línea del mismo nombre_________//
function Game_PushLeftRight(wraper, dulce){
  var $wraper = $(wraper);
  var $dulces = $wraper.children("li");
  var dulcesLength = $dulces.length;
  if( $dulces.length > 1){
    $dulces = (dulce!= undefined)?$(dulce):$dulces;
    $.each($dulces, function(){
      var $dulce = $(this);
      var dulceName = $dulce.children("img").attr("name");
      var indexDulceInvert = dulcesLength - $dulce.index();
      var childrenPrev = $wraper.parent().prev().children(".wraper-dulces").children("li");
      var indexPrev = childrenPrev.length - indexDulceInvert;
      var $dulcePrev = $(childrenPrev.get(indexPrev));
      var childrenNext = $wraper.parent().next().children(".wraper-dulces").children("li");
      var indexNext = childrenNext.length - indexDulceInvert;
      var $dulceNext = $(childrenNext.get(indexNext));
      var findLeft = ($dulcePrev!= undefined && ($dulcePrev.children("img").attr("name") == dulceName));
      var findRight = ($dulceNext!=undefined && ($dulceNext.children("img").attr("name") == dulceName));
      var dulcesDestroy = [];
      //busca coincidencias hacia la izquierda (Up)
      while(findLeft){
        if(dulcesDestroy.length == 0){
          dulcesDestroy.push($dulce);
        }
        dulcesDestroy.push($dulcePrev);
        childrenPrev = $dulcePrev.parent().parent().prev();
        childrenPrev = (childrenPrev!= undefined)?childrenPrev.children(".wraper-dulces").children("li"):[];
        if(childrenPrev.length > 0){
          indexPrev = childrenPrev.length - indexDulceInvert;
          $dulcePrev = $(childrenPrev.get(indexPrev));
          findLeft = ($dulcePrev.children("img").attr("name") == dulceName);
          continue;
        }
        findLeft = false;
      }
      //busca coincidencias hacia abajo (Up)
      while(findRight){
        if(dulcesDestroy.length==0){
          dulcesDestroy.push($dulce);
        }
        if(dulcesDestroy.length>=1){
          dulcesDestroy.push($dulceNext);
        }
        childrenNext = $dulceNext.parent().parent().next();
        childrenNext = (childrenNext!= undefined)?childrenNext.children(".wraper-dulces").children("li"):[];
        if(childrenNext.length > 0){
          indexNext = childrenNext.length - indexDulceInvert;
          $dulceNext = $(childrenNext.get(indexNext));
          findRight = ($dulceNext.children("img").attr("name") == dulceName);
          continue;
        }
        findRight = false;
      }

      if(dulcesDestroy.length >= 3){
        $.each(dulcesDestroy, function(){
          $(this).data("destroy", "true");
        });
        Game_DulcesDestroy();
      }
    });
    Game_DulcesDestroy();
  }
}
//______Función que actualiza el contador de movimientos_________//
function Game_DropCount(){
  var movimientos = Number($("#movimientos-text").text());
  $("#movimientos-text").text((movimientos+1));
}

function Game_DulcesDestroy(){
  var index = 0;
  var $dulces = $("li:data(destroy)");
  var win = ($dulces.length >= 3);

  if(win){
    $.each($dulces, function(i,dulce){
      var $dulce = $(dulce);
      var puntaje = Number($("#score-text").text());
      $("#score-text").text(puntaje+1);
      $dulce.hide("drop", { direction: "down" }, "slow", function(){
        index++;
        $dulce.replaceWith("");
        if($dulces.length == (index)){
          setTimeout(Game_Ready, 200);
        }
      });
    });
  }
}

//______Game_Init()_________//
$(document).ready(function(){
  //Función para cambiar color de texto del titulo principal
  setInterval(function(){
    $('.main-titulo').toggleClass('color-whit');
  }, 500);

  //Captura evento drop
  $("div[class^='col-']").droppable({
    accept: "li"
    ,drop: function(event, ui){
      var $dulce = $(ui.helper);
      var $dulcePrev = $dulce.prev();
      var $dulceNext = $dulce.next();
      var $wraper = $dulce.parent();
      Game_DropCount();
      $dulcePrevDrop = $dulcePrev;
      $dulceNextDrop = $dulceNext;
    }
  });

  $(".wraper-dulces").sortable({
    connectWith: ".wraper-dulces"
    ,stop: function(event, ui){
      var $dulce = $(ui.item);
      var dulceName = $dulce.attr("name");
      var $dulcePrev = $dulce.prev();
      var $dulceNext = $dulce.next();
      $wraper = $dulce.parent();
      var wraperClass = $wraper.parent().attr("class");
      var wraperPrevClass = $dulcePrevDrop.parent().parent().attr("class");
      //if(wraperPrevClass!=undefined && wraperPrevClass != wraperClass){
        setTimeout(function(){
          Game_PushUpDown($wraper, $dulce);
        },200);

        setTimeout(function(){
          Game_PushUpDown($dulcePrevDrop.parent(), $dulcePrevDrop);
        },200);

        setTimeout(function(){
          Game_PushUpDown($dulceNextDrop.parent(), $dulceNextDrop);
        },200);
      //}
    }
  }).disableSelection();

  //Botón para dar inicio al Juego
  $(".btn-reinicio").click(function(){
    //Inicia el juego
    setTimeout(Game_Ready, 500);

    //Inicia el temporizador
    $( '#timer' ).timer(function(){
      Game_Over();
    });

    //Se reemplaza el evento clic para refrescar la página
    $(this).text("Reiniciar").click(function(){
      location.reload();
    });

  });
});
