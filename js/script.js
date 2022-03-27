
let BGColor = document.querySelector("#BG-Color")

getColour()
function getColour(){
    let BG = localStorage.getItem("Background-Color")

    if (BG === null)
    {
        //$("body").css("background-color", "red")
        
    } else
    {
        $("#Background-Color").attr("value", BG)
        $("body").css("background-color", BG)
        $(".grid-item .card").css("background-color", BG + "d1")
        //$("#settingsmenu").css("background-color", BG + "f3")
        $(":root").css("--background", BG)
        
    }
}

function setColour(){
    localStorage.setItem("Background-Color", BGColor.value)
    getColour()
}
BGColor.addEventListener('blur', setColour)


//--------------------------------------------------
let FTColor = document.querySelector("#FT-Color")

getFTColour()
function getFTColour(){
    let FT = localStorage.getItem("Font-Color")

    if (FT === null)
    {
        //$("body").css("background-color", "red")
        
    } else
    {
        $("#FT-Color").attr("value", FT)
        $("body, #name").css("color", FT)
        $("#Category-Option").css("color", FT)
        $("a").css("color", FT + " !important")
        $("input").css("color", FT + " !important")
        $(".item-dueDate").css("color", FT + " !important")
        $(":root").css("--font", FT)
        
    }
}

function setFTColour(){
    localStorage.setItem("Font-Color", FTColor.value)
    getFTColour()
}
FTColor.addEventListener('blur', setFTColour)

//--------------------------------------------------
let ATColor = document.querySelector("#AT-Color")

getATColour()
function getATColour(){
    let AT = localStorage.getItem("Accent-Color")

    if (AT === null)
    {
        //$("body").css("background-color", "red")
        
    } else
    {
        $("#AT-Color").attr("value", AT)
        $("#introduction span").css("color", AT)
        $("#Category-Option").css("border-color", AT)
        $("#todo .header").css("border-color", AT)
        $(":root").css("--accent", AT)
        $("html #sidebar .options .option:hover:after").css("background-color", AT + " !important")
    }
}

function setATColour(){
    localStorage.setItem("Accent-Color", ATColor.value)
    getATColour()
}
ATColor.addEventListener('blur', setATColour)








$( ".loading" ).each(function( index ) {
    if( $(this).is(':empty') || $(this).text() == "" ){
        //debugger
        $(this).removeClass( "loading" )
      } else {
          
      }
  });

