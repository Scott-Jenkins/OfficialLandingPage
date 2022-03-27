//------------------------------------To Do List--------------------

$("#todo .header").click(function (e) { 

    $(".fa-plus").css({"transform": "rotate(90deg)", "transition": "0.1s"});

    $("#todo .newItem").html("   ");

    var newItem = $("#todo .newItem")
    //var listArea = $("#todo .list-area")
    var itemRow = `<div class="item-row">
                        <input type="text" class="item-name" placeholder="Name">
                        <input type="date" name="" id="" class="item-dueDate">
                        <label for="">Important</label>
                        <input type="checkbox" name="" id="" class="item-important">
                        <label for="">Done</label>
                        <input type="checkbox" name="" id="" class="item-done">
                    </div>`

    $(newItem).append(itemRow);

    $(".item-done").click(function (e) { 
        
        var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];

        if(document.querySelector(".item-important").checked){
            var setImportant = true
        } else {
            debugger
            var setImportant = false
        }


        var newItem = 
        {
        'name': $(".item-name").val(),
        'dueDate': $(".item-dueDate").val(),
        'important': setImportant
        };

        oldItems.push(newItem);

        localStorage.setItem('itemsArray', JSON.stringify(oldItems));

        $("#todo .newItem").html("   ");
        loadItems()
    });
});

$(".fa-times-circle").click(function (e) { 
    window.localStorage.removeItem('itemsArray');
    Swal.fire('To do list has been cleared')
    loadItems()
});


$("#todo .item-row").click(function(){
    $(this).toggleClass("line-through");
});


$("#todo .fa-times").click(function () { 
    deleteToDo()
});
function deleteToDo(){
    debugger
    var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
    var currentItem = $(this).parent()
    var currentRow = $(currentItem).parent()

    var currentTitle = $("p:first-child", currentRow).text()

    $.each(oldItems, function (indexInArray, valueOfElement) { 

        if (oldItems[indexInArray].name == currentTitle){
            debugger;
            oldItems.splice(indexInArray, 1);
            localStorage.setItem('itemsArray', JSON.stringify(oldItems));
        }

        
    });
    loadItems()
};

loadItems()
function loadItems(){
    var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];

    var listArea = $(".list-area")
    $(listArea).html("   ")

    $.each(oldItems, function (indexInArray) { 


        if (oldItems[indexInArray].important == true){
            var markAsImportant = '<i class="fas fa-exclamation-circle"></i>'
        } else {
            var markAsImportant = ''
        }


        var itemRow = `<div class="item-row">
                            <p>` + oldItems[indexInArray].name + `</p>
                            <p>` + oldItems[indexInArray].dueDate + `</p>
                            <p>` + markAsImportant + `</p>
                            <p><i class="fas fa-times"></i></p>
                        </div>`

        if (oldItems[indexInArray].important == true){
            $(listArea).prepend(itemRow);
        } else {
            $(listArea).append(itemRow);
        }

        
    });

    localStorage.setItem('itemsArray', JSON.stringify(oldItems));
}
