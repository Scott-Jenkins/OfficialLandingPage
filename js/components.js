canEdit("false")
loadSavedLayout()

function loadSavedLayout(inEdit){
    if (localStorage.getItem("layout") != null){
        $("main").html(localStorage.getItem("layout"))
        $("main").fadeIn(1000);
        

        if (inEdit == "edit"){
            canEdit("true")
        } else {
            canEdit("false")
        }
    } else {
         $("main").fadeIn(1000);

         if (inEdit == "edit"){
            canEdit("true")
        } else {
            canEdit("false")
        }
    }
}

$(function () {
    $(".fa-pen").click(function (e) { 
        if ($("#componentTray").length <= 0){
            canEdit("true")
            
            $( "main" ).load(window.location.href + " .load" )
            setTimeout(function() {loadSavedLayout("edit")}, 100);
            setTimeout(function() {startEdit()}, 100);
             
            
        } else {
            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  Swal.fire('Saved!', '', 'success')
                  savePageLayout()
                  $(".fa-save").fadeOut();
                  $(".fa-ban").fadeOut();
                  location.reload()
                } else if (result.isDenied) {
                  Swal.fire('Changes are not saved', '', 'info')
                  location.reload()
                  $(".fa-save").fadeOut();
                  $(".fa-ban").fadeOut();
                }
              })
        }
        
    });

    $(".fa-save").click(function (e) { 
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Saved!', '', 'success')
              $(".fa-save").fadeOut();
              $(".fa-ban").fadeOut();
              savePageLayout()
              $( "main" ).load(window.location.href + " .load" )
                canEdit("false")
                setTimeout(function() {loadSavedLayout()}, 100);
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
              $(".fa-save").fadeOut();
              $(".fa-ban").fadeOut();
              $( "main" ).load(window.location.href + " .load" )
                canEdit("false")
                setTimeout(function() {loadSavedLayout()}, 100);
            }
          })
        
    });

    $(".fa-ban").click(function (e) { 
        $(".fa-save").fadeOut();
        $(".fa-ban").fadeOut();
        $( "main" ).load(window.location.href + " .load" )
        canEdit("false")
        setTimeout(function() {loadSavedLayout()}, 100);
    });
});
var components = ['reddit','Name-and-Clock', 'weather', 'google-search', 'bookmarks', 'news', 'todo-list', 'Bank-Holiday', 'Dev-Quote', 'Analogue-Clock', 'spotify']
//var components = $('main div[class^="col-"] > *')

function savePageLayout() {
    $("#componentTray").remove()
    $('main div[class^="col-"]').removeClass("edit");
    $('main div[class^="col-"] > *').removeClass("child");

    $.each(components, function (indexInArray, valueOfElement) { 
        $(valueOfElement).text("");
    });

    var page = $("main").html()
    localStorage.setItem("layout", page)    
}

function startEdit(){
    createTray()
    function createTray(){
        $('<div/>',{
            class: 'edit'
        }).appendTo(
        $('<div/>',{
            id: 'componentTray',
            class: 'row'
        }).appendTo($("main .load")));
    }
        
        $(".fa-save").fadeIn();
        $(".fa-ban").fadeIn();

        $('main div[class^="col-"]').toggleClass("edit");
        $('main div[class^="col-"] > *').toggleClass("child");

        (function() {
            dragula([document.querySelector('.row')], {
              moves: function(el, container, handle) {
                $(el).children().removeClass("hidden");
                return !handle.classList.contains('child');
              }
            });
          
            dragula([].slice.apply(document.querySelectorAll('.edit')), {
              direction: 'horizontal',
            });
        })();


          
        $.each(components, function (indexInArray, valueOfElement) { 
             $(valueOfElement).text(valueOfElement.replaceAll("-", " "))

             if ($(valueOfElement).hasClass("hidden") || $(valueOfElement).length <= 0){
                $(valueOfElement + " .hide-opt").prop( "checked", true );
                addToTray(valueOfElement)
                return true;
            }

             $('<i/>',{
                class: 'fas fa-arrows-alt'
            }).appendTo(valueOfElement);
            $('<input/>',{
                type: 'checkbox',
                text: 'Hidden',
                class: 'hide-opt'
            }).appendTo(valueOfElement);
            $('<p/>',{
                text: 'Remove',
                class: 'hide-opt-label'
            }).appendTo(valueOfElement);

            //align buttons
            /*
            var alignOptions = $('<span/>',{
                class: 'align-options',
            }).appendTo(valueOfElement);

        
            $('<a/>',{
                title: 'Align Left',
                class: 'fas fa-align-left',
                align: 'text-left'
            }).appendTo(alignOptions);

            $('<a/>',{
                title: 'Align Center',
                class: 'fas fa-align-center',
                align: 'text-center'
            }).appendTo(alignOptions);

            $('<a/>',{
                title: 'Align Right',
                class: 'fas fa-align-right',
                align: 'text-right'
            }).appendTo(alignOptions);
            
            $(valueOfElement + " .align-options a").each(function (index, element) {
                var classToAdd = $(this).attr('align');
                $(this).click(function (e) { 
                    debugger
                    e.preventDefault();
                    $(valueOfElement).removeClass("text-right text-left text-center");
                    $(valueOfElement).addClass(classToAdd);
                });
                
            });
            */




            

            $(valueOfElement + " .hide-opt").change(function() {
                // if(this.checked) {
                //     $(valueOfElement).addClass("hidden");
                // } else {
                //     $(valueOfElement).removeClass("hidden");
                // }
                $(valueOfElement).remove();
                addToTray(valueOfElement);
            });
        });
}

function addToTray(el){
    $(el).removeClass("hidden")
    
    $('<'+ el +'/>', {
        text: el.replaceAll("-", " "),
        class: 'child'
    }).appendTo($("#componentTray .edit"))
}

//settings menu and sidebar
new Vue({
    el:'sidebar',
    data:{
        display: false,
        items: null,
        sidebar: 
            {
                'home':{
                    class : 'fas fa-home',
                    link: '/'
                },
                'news':{
                    class : 'far fa-newspaper',
                    link: 'https://www.google.co.uk/'
                },
                'edit':{
                    class: 'fas fa-pen',
                }
            }
        
    },
    mounted () {
        console.log(this.sidebar)
    },
    methods:{
        profilePic(){
            return 'https://eu.ui-avatars.com/api/?rounded=true&name=' + localStorage.getItem("name")
        },
        toggleMenu(){
            $("#sidebar").toggleClass("active");
        }

    },
    template:`
    <div id="sidebar">
        <div class="options">
            <a class="option" v-for="options in sidebar" :src="options.link">
                <i :class="options.class"></i>
            </a>
        </div>
        <div class="settings">
            
            <i class="fas fa-cog" onclick="openSettings()"></i>
            <i class="fas fa-ban"></i>
            <i class="fas fa-pen"></i>
            <i class="far fa-save"></i>
            <img :src="profilePic()" class="profile">


            <span @click="toggleMenu" class="hidden expand"><i class="fas fa-angle-double-down"></i><p class="label">Expand</p></span>
        </div>
    </div>`,
    
    
})

new Vue({
    el:'settingsmenu',
    props:{
        display: Boolean
    },
    data:{
        svgpath: `<svg width="183" height="114" viewBox="0 0 183 114" fill="var(--accent)" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_f_0_1)">
        <circle cx="80.5" cy="58.5" r="20.5" fill="var(--accent)"></circle>
        </g>
        <g filter="url(#filter1_f_0_1)">
        <circle cx="158.5" cy="79.5" r="20.5" fill="var(--accent)"></circle>
        </g>
        <g filter="url(#filter2_f_0_1)">
        <circle cx="14.5" cy="38.5" r="10.5" fill="var(--accent)"></circle>
        </g>
        <g filter="url(#filter3_f_0_1)">
        <circle cx="32" cy="87" r="18" fill="var(--accent)"></circle>
        </g>
        <g filter="url(#filter4_f_0_1)">
        <circle cx="41.5" cy="16.5" r="12.5" fill="var(--accent)"></circle>
        </g>
        <g filter="url(#filter5_f_0_1)">
        <circle cx="122.5" cy="29.5" r="15.5" fill="var(--accent)"></circle>
        </g>
        <g filter="url(#filter6_f_0_1)">
        <circle cx="150.5" cy="45.5" r="7.5" fill="var(--accent)"></circle>
        </g>
        <g filter="url(#filter7_f_0_1)">
        <circle cx="101" cy="94" r="16" fill="var(--accent)"></circle>
        </g>
        <defs>
        <filter id="filter0_f_0_1" x="56" y="34" width="49" height="49" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        <filter id="filter1_f_0_1" x="134" y="55" width="49" height="49" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        <filter id="filter2_f_0_1" x="0" y="24" width="29" height="29" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        <filter id="filter3_f_0_1" x="10" y="65" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        <filter id="filter4_f_0_1" x="25" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        <filter id="filter5_f_0_1" x="103" y="10" width="39" height="39" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        <filter id="filter6_f_0_1" x="139" y="34" width="23" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        <filter id="filter7_f_0_1" x="81" y="74" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_0_1"></feGaussianBlur>
        </filter>
        </defs>
        </svg>`,
        themeType: localStorage.getItem("theme")
    },
    mounted () {
        this.checkTheme()

        $(":root").css("--border-radius", localStorage.getItem("Border-Radius") + "px")
    },
    methods:{

        checkTheme(){
            if (this.themeType === null){
                localStorage.setItem("theme", "bubble");
            }
            switch(this.themeType) {
                case 'bubble':
                $("#ambient").fadeIn('slow');
                $("#bubble").attr("checked", "true")

                $("#none").removeAttr("checked");
                $("#image").removeAttr("checked");
                $("#Waves").removeAttr("checked");
                $("#bgImage").hide();
                $("#defaultCanvas0").hide();
                
                break;
                case 'Waves':
                $("#Waves").attr("checked", "true")
                setTimeout(function(){
                    $("#defaultCanvas0").fadeIn('slow');
                    
                }, 1800);

                $(":root").css("--background", "black")
                $(":root").css("--font", "white")
                $(":root").css("--accent", "#00B819")
                $("#none").removeAttr("checked");
                $("#image").removeAttr("checked");
                $("#bubble").removeAttr("checked");
                $("#bgImage").hide();
                $("#ambient").hide();
                    
                break;
                case 'image':
                $("#ambient").hide();
                $("#image").attr("checked", "true")
                $("#bgImage").fadeIn('slow');
                var image = atob(localStorage.getItem("bg-image"))
                $("#bgImage").attr("src", image)

                $("#bubble").removeAttr("checked");
                $("#none").removeAttr("checked");
                $("#Waves").removeAttr("checked");
                $("#defaultCanvas0").hide();
                break; 

                case 'none':
                
                $("#none").attr("checked", "true")

                $("#bgImage").hide();
                $("#defaultCanvas0").hide();
                $("#ambient").hide();

                $("#bubble").removeAttr("checked");
                $("#image").removeAttr("checked");
                $("#Waves").removeAttr("checked");
                break;
                default:
            }
        },

        setTheme(){
            var theme = $("#theme-group input:checked").val()
            localStorage.setItem("theme",  theme)
            this.themeType = theme
            this.checkTheme()
        },

        uploadImage(event){
            var image = btoa(URL.createObjectURL(event.target.files[0]).replace(/\.[^/.]+$/, ""));
            //this.getBase64Image(image)
            localStorage.setItem("bg-image", image)
            image = atob(image)
            $("#bgImage").attr("src", image)
        },

        setBorderRadius(){
            var br = $("#border-radius").val()
            localStorage.setItem("Border-Radius",  br)
            $(":root").css("--border-radius", br + "px")
        }

    },
    template:`
    <div id="settingsmenu">
        <h2>Info</h2>
        <div id="info-settings">
            <div class="setting">
                <label>Name:</label>
                <p>{{localStorage.getItem("name")}}</p>
            </div>   
            <div class="setting">
                <label>Location:</label>
                <p>{{localStorage.getItem("location")}}</p>
            </div>          
        </div>
        <hr>
        <h2>Theme</h2>
        <fieldset id="theme-group">
        <div id="theme">
        
            <div class="item">
                <span v-html="svgpath"></span>
                <p>Bubble</p>
                <input type="radio" name="theme-group" id="bubble" value="bubble" @click="this.setTheme">
            </div>
            <div class="item">
                <span><i class="fas fa-barcode"></i></span>
                <p>Matrix</p>
                <input type="radio" name="theme-group" id="Waves" value="Waves" @click="this.setTheme">
            </div>
            <div class="item">
                <span><i class="far fa-image"></i></span>
                <p>Background Image</p>
                
                <input type="file" name="" id="imageUpload" @change="this.uploadImage">
                <input type="radio" name="theme-group" id="image" value="image" @click="this.setTheme">
                
            </div>
            <div class="item">
                <span><i class="fas fa-times"></i></span>
                <p>None</p>
                <input type="radio" name="theme-group" id="none" value="none" @click="this.setTheme">
            </div>
        
        </div>
        </fieldset>
        <hr>
        <div id="color-settings">
            <div class="setting">
                <label for="BG-Color">Background Color:</label>
                <p>{{localStorage.getItem("Background-Color")}}</p>
                <input type="color" name="" id="BG-Color">
            </div>
            <div class="setting">
                <label for="FT-Color">Font Color:</label>
                <p>{{localStorage.getItem("Font-Color")}}</p>
                <input type="color" name="" id="FT-Color">
            </div>              
            <div class="setting">
                <label for="AT-Color">Accent Color:</label>
                <p>{{localStorage.getItem("Accent-Color")}}</p>
                <input type="color" name="" id="AT-Color">
            </div>              
        </div>
        <div class="setting-group">
            <div class="setting">
                <label>Border Radius:</label>
                <input id="border-radius" class="form-control" type="number" min="0" @change="setBorderRadius" :value="localStorage.getItem('Border-Radius')">
            </div>    
        </div>
        
        <hr>
        
    </div>`,
})
function openSettings() {
    $("#settingsmenu").toggleClass("active");
}


function canEdit(answer){
    if (answer == "false"){
    

    
    
    
        if ($("bookmarks").hasClass("hidden") == false){
            new Vue({
                el:'bookmarks',
                data:{
                    display: true,
                    bookmarks: JSON.parse(localStorage.getItem('bookmarks'))
                    
                },
                mounted () {
                    this.ArrayToJson()
                    if (this.bookmarks === null){
                        this.bookmarks = []
                    }
        
                    
                },
                methods:{
                    openPopup(){
                        Swal.fire({
                            title: "Add a Bookmark",
                            text: "Please enter the URL:",
                            input: 'text',
                            showCancelButton: true        
                        }).then((result) => {
                            if (result.value) {
                                var olditems = JSON.parse(localStorage.getItem('bookmarks')) || []
        
                                var newBm = 
                                {
                                'url': result.value
                                };
        
                                olditems.push(newBm)
                                this.bookmarks = olditems
                                this.ArrayToStorage()
                            }
                        });
                    },
                    ArrayToJson(){
                        JSON.parse(this.bookmarks)
                    },
                    ArrayToStorage(){
                        localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks) )
                    },
                    fetchFavicon(url){
                        return 'http://icon.horse/icon/' +  url.replaceAll("https://", "");
                    },
                    shortenUrl(url){
                        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('.')[0]
                    },
                    extendUrl(url){
                        if (url.includes("https://" || "http://") === false){
                            url = "https://" + url
                        }
                        return url
                    },
                    deleteBookmark(BMurl){
        
                        var self = this
        
                        var olditems = JSON.parse(localStorage.getItem('bookmarks')) || []
                        console.log(BMurl)
                        $.each(olditems, function (indexInArray, valueOfElement) { 
                            if (BMurl === valueOfElement.url){
                                olditems.splice(indexInArray, 1)
                                console.log('delete this ' + BMurl)
                                self.bookmarks = olditems
                                self.ArrayToStorage()
                            }
                        });
                    }
        
                },
                template:`
                <div id="bookmarks">
                    
                    <div class="bookmarks">
                        
                        <div class="bookmark" v-for="items in bookmarks">
                            <i @click="deleteBookmark(items.url)" class="far fa-trash-alt" data-toggle="tooltip" data-placement="right" title="Delete Bookmark"></i>
                            <a :href="extendUrl(items.url)" target="_blank">
                                <img :src="fetchFavicon(items.url)">
                                {{shortenUrl(items.url) }}
                            </a>
                        </div>
                        <div class="add-bookmark" @click="this.openPopup">
                            <i class="fas fa-plus" aria-hidden="true"></i>
                            Add Bookmark
                        </div>
                    </div>
                    
                </div>`,
                
                
            })
        }
        
        if ($("todo-list").hasClass("hidden") == false){
            new Vue({
                el:'todo-list',
                data:{
                    display: true,
                    todos: JSON.parse(localStorage.getItem('itemsArray'))
                    
                },
                mounted() {
                    this.ArrayToJson()
                    if (this.todos === null){
                        this.todos = []
                    }
                
                },
                methods:{
                    openPopup(){
                        var self = this
        
                        new swal({
                            title: 'Add Todo',
                            html:
                            `<input type="text" id="swal-input1" class="swal2-input" placeholder="Name">
                                <input type="date" id="swal-input2" name="" id="" class="swal2-input">
                                <span>
                                <label for="swal-input3" >Important</label>
                                <input type="checkbox" id="swal-input3" name="" id="" class="swal2-input">
                                </span>
                                `,
                            preConfirm: function () {
                            return new Promise(function (resolve) {
                                resolve([
                                $('#swal-input1').val(),
                                $('#swal-input2').val()
                                ])
                            })
                            },
                            onOpen: function () {
                            $('#swal-input1').focus()
                            }
                        }).then(function (result) {
        
                            var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
        
                            if(document.querySelector("#swal-input3").checked){
                                var setImportant = true
                            } else {
                                var setImportant = false
                            }
        
                            var newItem = 
                            {
                            'name': result.value[0],
                            'dueDate': result.value[1],
                            'important': setImportant
                            };
        
                            oldItems.push(newItem);
                            self.todos = oldItems
                            localStorage.setItem('itemsArray', JSON.stringify(oldItems));
                        })
                    },
                    ArrayToJson(){
                        JSON.parse(this.todos)
                    },
                    ArrayToStorage(){
                        localStorage.setItem("itemsArray", JSON.stringify(this.todos) )
                    },
                    deleteItem(item){
        
                        var self = this
        
                        var olditems = JSON.parse(localStorage.getItem('itemsArray')) || []
                        console.log(item)
                        $.each(olditems, function (indexInArray, valueOfElement) { 
                            if (item === valueOfElement.name){
                                olditems.splice(indexInArray, 1)
                                console.log('delete this ' + item)
                                self.todos = olditems
                                self.ArrayToStorage()
                            }
                        });
        
                        Swal.fire({
                            toast: true,
                            text: 'Todo Deleted',
                            position: 'bottom-end',
                        })
                    },
                    isImportant(item){
                        if (item){
                            return '<i class="fas fa-exclamation"></i>'
                        } else {
                            return ''
                        }
                    },
                    compareDates(date){
                        if (moment(moment().format('L')).isAfter(date)){
                            return true
                        }
                        
                    },
                    fullscreen(){
                        $("#todos").toggleClass("active");
                    }
                },
                template:`
                <div id="todos">
                    <p class="todo-title">To-Do List</p>
                    <div class="todos">
                        
                        <div class="todo" v-for="items in todos">
                            <i @click="deleteItem(items.name)" class="far fa-trash-alt" data-toggle="tooltip" data-placement="right" title="Delete Item"></i>
                            <a>
                            <span>
                                <p class="name">{{items.name}}</p>
                                <p>{{items.dueDate}}</p>
                            </span>
                                <p v-html="isImportant(items.important)" class="important" title="Important"></p>
                                <i v-if="compareDates(items.dueDate)" class="overdue fas fa-exclamation-triangle" title="Overdue"></i>
                            </a>
                        </div>
                        <i @click="fullscreen" class="fas fa-expand-alt"></i>
                        <div class="add-item" >
                            <span @click="openPopup">
                                Add Item
                                <i class="fas fa-plus"></i>
                            <span>
                        </div>
                    </div>
                    
                </div>`,
                
                
            })
        }

        if ($("weather").hasClass("hidden") == false){
            new Vue({
                el: 'weather',
                data:{
                    display: true,
                    longitude: null,
                    latitude: null,
                    data: null
        
                },
                mounted () {
                    this.getLocation()
                },
                methods:{
                    getLocation() {
                        if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(this.showPosition);
                        }
                    },
                    showPosition(position) {
                        this.latitude = position.coords.latitude
                        this.longitude = position.coords.longitude
                    
                        var self = this
                        console.log("https://api.openweathermap.org/data/2.5/weather?APPID=ea8837df503db1cc47357bc3289f366e&lat="+ this.latitude +"&lon="+ this.longitude +"&units=metric")
                        $.ajax({
                            url: "https://api.openweathermap.org/data/2.5/weather?APPID=ea8837df503db1cc47357bc3289f366e&lat="+ this.latitude +"&lon="+ this.longitude +"&units=metric",
                            context: document.body
                        }).done(function(content) {
        
                            self.data = content
                            localStorage.setItem("location", content.name)
                    
                        });
                    },
                    returnImg(img){
                        return "http://openweathermap.org/img/wn/" + img + ".png"
                    },
                    truncNum(num){
                        return Math.trunc(num) + "°C";
                    }
                },
                template:`
                <div id="weather">
                    <p class="title">{{data.name}}</p>

                    <span class="temp">
                        {{truncNum(data.main.temp)}}
                        <img :src="returnImg(data.weather[0].icon)">
                    </span>
                    <p class="description">{{data.weather[0].description}}</p>
                    
                    <span class="hi-low">
                        <p>Lows of {{truncNum(data.main.temp_min)}}</p>
                        <p>Highs of {{truncNum(data.main.temp_max)}}</p>
                        <p class="humidity">Humidity: {{data.main.humidity}}%</p>
                    </span>
                    
                </div>`,
                
            })
        }

        if ($("news").hasClass("hidden") == false){
            new Vue({
                el:'news',
                data:{
                    display: true,
                    items: null,
                    NewsFirst: null,
                    NewsLast : null,
        
                    url: 'https://gnews.io/api/v4/top-headlines?token=c739938a812e83d058bf79d67283f77c&lang=en',

                    
                },
                mounted () {
                    console.clear();
                    this.getItems();
        

                },
                methods:{
                    getItems(){
                        var self = this
                        $.ajax(this.url).done(function (response) {
                            console.log(response);
                            var items = response.articles;
        
                            var firstTwo = [];
                            var lastItems = [];
        
                            $.each(items, function (indexInArray, valueOfElement) { 
        
                                if (indexInArray >= 2){
                                    lastItems.push(this);
                                } else {
                                    firstTwo.push(this);
                                }
                            });
        
                            self.NewsFirst = firstTwo
                            self.lastItems = lastItems
                        });
                    },
                    showMore(){
                        $(".extend").slideToggle();
                    },
                    validateImg(img){
                        if (img == null || img == undefined || img == ""){
                            return '/img/not-found.jpg'
                        } else {
                            return img
                        }
                    }
                },
                template:`<div>
                <p class="todo-title">News</p>
                <div id="news">
                        <div class="grid-item" v-for="item in NewsFirst">
                            <a :href="item.url" target="_blank">
                                <div class="card">
                                    <img :src="validateImg(item.image)" alt="">
                                    <div class="bottom">
                                        <p class="title">
                                            {{item.title}}
                                        </p>
                                        <div class="source">
                                            {{item.source.name}}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        
                        <div class="grid-item extend" v-for="item in lastItems">
                            <a :href="item.url" target="_blank">
                                <div class="card">
                                    <img :src="validateImg(item.image)" alt="">
                                    <div class="bottom">
                                        <p class="title">
                                            {{item.title}}
                                        </p>
                                        <div class="source">
                                            {{item.source.name}}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
        
                        <a class="btn show-more" @click="showMore">Show More</a>
                </div>
                <div>`,
                
                
            })
        }

        if ($("google-search").hasClass("hidden") == false){
            new Vue({
                el:'google-search',
                data:{
                    query: null,
                    url: 'https://www.google.com/search?q='
                },
                mounted(){
                    $("#google-search").keydown(function (e) { 
                        if  (e.keyCode === 13){
                            $(".fa-search").click()
                        }
                    })
                },
                methods:{
                    search(){
                        window.location.href = this.url + this.query;
                    }
                },
                template: `
                <div id="google-area">
                    <div class="bar">
                    <input type="text" name="" id="google-search" placeholder="Google Search" v-bind="query">
                    <i class="fas fa-search" @click="search"></i>
                    </div>  
                </div>
                `

                
            })
        }

        if ($("Name-and-Clock").hasClass("hidden") == false){
            new Vue({
                el:'Name-and-Clock',
                data:{
                    time_of_day: "",
                    d: "",
                    n: "",
                    h: "",
                    m: "",
                    name: "" 
                },
                mounted(){
                    this.setTime()
                    setInterval(this.setTime, 5000)
                    
                    this.name = localStorage.getItem("name")
                    if (this.name === null || this.name == "[Enter Name]")
                    {
                        this.name = "[Enter Name]"
                    }

                    $("#name").blur(function (e) { 
                        localStorage.setItem("name", $("#name").val())
                    });
                },
                methods:{
                    setTime(){
                        this.d = new Date();
                        this.n = this.d.getTime();
                        this.h = this.d.getHours();
                        this.m = this.d.getMinutes();

                        if (this.h >= 0) {
                            this.time_of_day = "morning"
                        }
                    
                        if (this.h > 12) {
                            this.time_of_day = "afternoon"
                        }
                    
                        if (this.h > 17) {
                            this.time_of_day = "evening"
                        }
                    
                        if (this.h > 12) {
                            this.h = this.h - 12;
                        }
                    },
                    setName(){
                        localStorage.setItem("name", this.name.value)
                    }
                },
                template: `
                <div id="name-and-clock">
                    <input type="text" id="name" v-model="name">
                    <p id="introduction">it's currently <span>{{this.m}}</span> minutes past <span>{{this.h}}</span> in the <span>{{this.time_of_day}}</span></p>
                </div>
                `

                
            })
        }

        if ($("Bank-Holiday").hasClass("hidden") == false){
            new Vue({
                el:'Bank-Holiday',
                data:{
                    data: null,
                    nextDay: null
                    
                },
                mounted(){
                    this.getDays()

                },
                methods:{
                    getDays(){
                        var self = this

                        $.ajax({
                            url: "https://www.gov.uk/bank-holidays.json",
                            data: "data",
                            success: function (response) {
                                console.log(response)
                                self.data = response["england-and-wales"].events
                                self.getFirstDay(self.data)
                            }
                        });

                        
                    },
                    getFirstDay(days){
                        var self = this
                        $.each(days, function (indexInArray, valueOfElement) { 
                            //debugger
                            if (moment(moment().format('L')).isAfter(valueOfElement.date) == false){
                                self.nextDay = valueOfElement
                                return false
                            }
                        });
                    }

                },
                template: `
                <div id="Bank-Holiday">
                    <p class="name">
                    The Next Bank Holiday Is {{nextDay.title}}
                    </p>
                    <p class="date">
                    {{moment(nextDay.date, 'YYYY.MM.DD').format('DD/MM/YYYY')}}
                    </p>
                </div>
                `

                
            })
        }

        if ($("Dev-Quote").hasClass("hidden") == false){
            new Vue({
                el:'Dev-Quote',
                data:{
                    quote: null,
                    
                },
                mounted(){
                    this.getQuote()

                },
                methods:{
                    getQuote(){
                        var self = this

                        $.ajax({
                            url: "https://programming-quotes-api.herokuapp.com/quotes/random",
                            data: "data",
                            success: function (response) {
                                self.quote = (response)
                            }
                        });

                        
                    },


                },
                template: `
                <div id="Dev-Quote">
                    <p class="quote">
                    "{{quote.en}}"
                    </p>
                    <p class="author">
                    - {{quote.author}}
                    </p>
                </div>
                `

                
            })
        }

        if ($("Analogue-Clock").hasClass("hidden") == false){
            new Vue({
                el:'Analogue-Clock',
                mounted(){
                    const secondHand = document.querySelector('.second-hand');
                    const minsHand = document.querySelector('.min-hand');
                    const hourHand = document.querySelector('.hour-hand');
                    
                    function setDate() {
                      const now = new Date();
                    
                      const seconds = now.getSeconds();
                      const secondsDegrees = ((seconds / 60) * 360) + 90;
                      secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
                    
                      const mins = now.getMinutes();
                      const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
                      minsHand.style.transform = `rotate(${minsDegrees}deg)`;
                    
                      const hour = now.getHours();
                      const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
                      hourHand.style.transform = `rotate(${hourDegrees}deg)`;
                    }
                    
                    setInterval(setDate, 1000);
                    
                    setDate();
                },

                template: `
                <div id="clock">
                <div class="outer-clock-face">
                <div class="marking marking-one"></div>
                <div class="marking marking-two"></div>
                <div class="marking marking-three"></div>
                <div class="marking marking-four"></div>
                <div class="inner-clock-face">
                  <div class="hand hour-hand"></div>
                  <div class="hand min-hand"></div>
                  <div class="hand second-hand"></div>
                </div>
              </div>
                </div>
                `
            })
        }

        if ($("reddit").hasClass("hidden") == false){
            new Vue({
                el:'reddit',
                data:{
                    posts: null,
                    url: '/reddit/',
                    urlAppendage: 'hot',
                    postType: ['Hot', 'Best', 'New', 'Top', 'Controversial', 'Rising'],
                    loggedIn: true
                },
                mounted(){
                    this.getItems()
                },
                methods:{
                    getItems(){
                        
                        var self = this;

                        $.ajax({
                            url: self.url + self.urlAppendage,
                            data: "data",
                            success: function (data) {
                                self.posts = data.fulfillmentValue
                                console.log(self.posts)
                            }
                        });

                        
                    },
                    changeUrl(){
                        this.urlAppendage = $("#postFilter").val()
                        this.getItems()
                    },
                    upvote(id){
                        var self = this

                        $.ajax({
                            url: '/reddit/upvote/' + id,
                            data: "data",
                            success: function (data) {
                                
                            }
                        });
                    }
                },

                template: `
                <div id="reddit">
                <div v-if="!loggedIn" class="loggedOut">
                    <i class="fab fa-reddit"></i>
                    <a class="btn" href="https://www.reddit.com/api/v1/authorize?client_id=OsSLTmWkWIKHXG06nApv2g&response_type=code&state=RANDOM_STRING&redirect_uri=http://localhost:5000/&duration=permanent&scope=account adsconversions creddits edit flair history identity livemanage modconfig modcontributors modflair modlog modmail modothers modposts modself modtraffic modwiki mysubreddits privatemessages read report save structuredstyles submit subscribe vote wikiedit wikiread">
                        Log In
                    </a>
                </div>
                <div v-else>
                    <div class="header">
                        <i class="fab fa-reddit"></i>

                        <select id="postFilter" @change="changeUrl()">
                            <option v-for="type in postType" :value="type" >{{type}}</option>
                        </select>
                    </div>
                    <hr>
                    <div class="body">
                        <div class="post" v-for="post in posts">
                            <div class="side">
                                <i class="fas fa-sort-up" @click="upvote(post.id)"></i>
                                {{post.score}}
                                <i class="fas fa-sort-down"></i>
                            </div>
                            <div class="inner">
                                <div class="head">
                                    <a class="subreddit" :href="'https://www.reddit.com/' + post.subreddit_name_prefixed">
                                        {{post.subreddit_name_prefixed}}
                                    </a>
                                </div>
                                <div class="title">
                                    {{post.title}}
                                </div>
                                
                                <div class="img" >
                                    <a v-if="post.is_video == false" :data-lightbox="post.id" :href="post.url_overridden_by_dest">
                                        <img :src="post.url_overridden_by_dest">
                                    </a>
                                    
                                    <video v-else controls>
                                        <source :src="post.media.reddit_video.fallback_url" type="video/mp4">
                                    </video>
                                    <hr>
                                </div>
                            </div>
                            <hr>
                        </div>
                    </div>
                    <div class="footer">
                    </div>
                </div>
                </div>
                `
            })
        }
        
        if ($("Spotify").hasClass("hidden") == false){
            new Vue({
                el:'Spotify',
                data:{
                    loggedIn: false,
                    user: '',
                    profile: '',
                    playlists: null,
                    showTray: false,
                    topArtists: null,
                    recentlyPlayed: null,
                    songTray: null,
                    access: null,
                    devices: null,
                    playState: false,
                    shuffle: false,
                    repeat: 'on',
                    currentSong: '',
                    currentArtist: '',
                    currentAlbum : '',
                    currentUri: '',
                    currentDevice: '',
                    
                },
                mounted(){
                    this.isLoggedIn() 
                },
                methods:{
                    toggleWindow(){
                        $("#Spotify").toggleClass("active");
                    },
                    isLoggedIn(){
                        var self = this;

                        $.ajax({
                            url: "/me",
                            data: "data",
                            success: function (response) {
                                
                                if (response.spotify_access_token != null && response.spotify_access_token.length > 1 && response.body.display_name != null){
                                    self.loggedIn = true;
                                    self.access = response.spotify_access_token;
                                    window.spotToken = response.spotify_access_token;
                                    self.user = response.body.display_name;
                                    self.profile = response.body.images[0].url;
                                    self.startUp();

                                } else {
                                    self.loggedIn = false;
                                }
                            }
                        });

                        
                    },
                    startUp(){
                        this.getPlaylists()
                        this.playbackState()
                        
                        this.getTopArtists()
                        this.getDevice()
                        this.getRecentlyPlayed()
                        
                        
                        $('#Spotify .playlists').slick({
                            dots: true,
                            infinite: true,
                            speed: 300,
                            slidesToShow: 1,
                            centerMode: true,
                            variableWidth: true
                          });
                    },
                    getPlaylists(){
                        var self = this;

                        $.ajax({
                            url: "/playlists",
                            success: function (response) {
                                if (response.items != null){
                                    self.playlists = response.items;
                                }
                            }
                        });
                    },
                    openPlaylist(id){
                        var self = this;
                        //$("#Spotify .playlist .song-tray").hide()
                        $("#Spotify .main .song-tray").addClass("active")

                        $.ajax({
                            url: "/playlist/" + id,
                            success: function (response) {
                                if (response.items != null){
                                    self.songTray = response.items;
                                    self.showTray = true;
                                }
                            }
                        });
                    },
                    closePlaylist(){
                        $("#Spotify .main .song-tray").removeClass("active")
                    },
                    playbackState(){
                        var self = this;

                        $.ajax({
                            url: "/playback",
                            success: function (response) {

                                if(self.currentUri != response.item.uri && response.is_playing == true){
                                    Swal.fire({
                                        imageUrl: response.item.album.images[0].url,
                                        imageHeight: 64,
                                        title: response.item.name,
                                        text: response.item.artists[0].name,
                                        toast: true,
                                        position: 'top-end',
                                        showConfirmButton: false,
                                        timer: 2000,
                                        timerProgressBar: true,
                                        customClass: {
                                            container: 'spotify'
                                          }
                                      })
                                }

                                self.playState = response.is_playing
                                self.currentSong = response.item.name
                                self.currentUri = response.item.uri
                                self.currentArtist = response.item.artists[0].name
                                self.currentAlbum = response.item.album.images[0].url
                                self.currentDevice = response.device.name
                                self.shuffle = response.shuffle_state
                                self.repeat = response.repeat_state
                            }
                        }); 

                        setTimeout(function() {self.playbackState()}, 3000)
                    },
                    getTopArtists(){
                        var self = this;

                        $.ajax({
                            url: "/topArtist",
                            success: function (response) {
                                self.topArtists = response.items
                            }
                        });
                    },
                    setDevice(id){
                        var self = this

                        if (id == null)
                            id = window.SpotDevice

                        fetch('https://api.spotify.com/v1/me/player', {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + window.spotToken
                            },
                            body: JSON.stringify({"device_ids":[id]})
                        });

                        setTimeout(function() {self.playbackState()}, 500);
                    },
                    getDevice(){
                        var self = this;

                        $.ajax({
                            url: "/devices",
                            data: "data",
                            success: function (response) {
                                
                                self.devices = response.devices;
                                self.devices.push({
                                    id: window.SpotDevice,
                                    name: 'Web Playback'
                                })
                            }
                        });

                        
                    },
                    Pause(){
                        var self = this;
                        
                        $.ajax({
                            url: "/pause/" + window.SpotDevice,
                            type: 'get',
                            success: function (response) {
                                
                                setTimeout(function() {self.playbackState()}, 200);
                            }
                        });
                    },
                    Play(song, playbackType){
                        var self = this
                        var context = ''

                        
                            
                            
                            if (playbackType == 'song'){
                                $.when(fetch('https://api.spotify.com/v1/me/player/play', {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + window.spotToken
                                },
                                body: JSON.stringify({"uris":[song],"offset":{"position":0},"position_ms":0})
                                })).done(function () {
                                    self.currentUri = song
                                    setTimeout(function() {self.playbackState()}, 200);
                                });
                            } else if (playbackType == 'resume') {
                                $.when(fetch('https://api.spotify.com/v1/me/player/play', {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + window.spotToken
                                },
                                json: JSON.stringify({"context_uri":song,"offset":{"position":0},"position_ms":0})
                                })).done(function () {
                                    setTimeout(function() {self.playbackState()}, 200);
                                });
                            } else if (playbackType == 'artist'){
                                $.when(fetch('https://api.spotify.com/v1/me/player/play', {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + window.spotToken
                                },
                                body: JSON.stringify({"context_uri":song})
                                })).done(function () {
                                    setTimeout(function() {self.playbackState()}, 200);
                                });
                            }
    
                            //context = JSON.stringify({"context_uri":song,"offset":{"position":0},"position_ms":0})
                            

                        
                        

                        
                        
                    },
                    Next(){
                        var self = this;

                        fetch('https://api.spotify.com/v1/me/player/next', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + window.spotToken
                            }
                        });
                                setTimeout(function() {self.playbackState()}, 500);
                    },
                    Prev(){
                        var self = this;

                        fetch('https://api.spotify.com/v1/me/player/previous', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + window.spotToken
                            }
                        });
                                setTimeout(function() {self.playbackState()}, 500);
                    },
                    shuffle(){
                        var self = this;

                        fetch('https://api.spotify.com/v1/me/player/shuffle', {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + window.spotToken
                            },
                            json: !self.shuffle
                        });
                                setTimeout(function() {self.playbackState()}, 500);
                    },
                    repeat(){
                        var self = this;

                        fetch('https://api.spotify.com/v1/me/player/repeat', {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + window.spotToken
                            }
                        });
                                setTimeout(function() {self.playbackState()}, 500);
                    },
                    getRecentlyPlayed(){
                        var self = this;

                        $.ajax({
                            url: "/recentlyPlayed",
                            success: function (response) {
                                self.recentlyPlayed = response.items
                            }
                        });
                    },
                },
                
                
                template: `
                <div id="Spotify">
                    <div v-if="loggedIn == false" class="login">
                        <i class="fab fa-spotify"></i>
                        <br>
                        <p>Spotify Premium Is Required</p>
                        <br>
                        <a href="/login" class="btn btn-primary">Log in with Spotify</a>
                    </div>
                    
                    <div v-else >
                        <div class="header">
                            <i class="fab fa-spotify"></i>
                            <span>
                                {{user}}
                                <img :src="profile"/>
                            </span>
                        </div>
                        
                        
                        <div class="main">
                            <br>

                            <h3>Recently Played</h3>
                            <div class="recents">
                                <div class="recent" v-for="item in recentlyPlayed.slice(0, 2)" v-if="item.context != null" @click="Play(item.track.album.uri, 'artist')">
                                    <img :src="item.track.album.images[0].url" />
                                    <div class="info">
                                        <p class="title">{{item.track.album.name}}</p>
                                        <p>{{item.track.artists[0].name}}</p>
                                    </div>
                                </div>
                            </div>
                            <br>

                            <h3>My Playlists</h3>
                            <div class="playlists">
                                <div class="playlist" v-for="item in playlists" >
                                    <div class="image">
                                        <img :src="item.images[0].url" />
                                        <i @click="Play(item.uri, 'artist')" class="fas fa-play-circle"></i>
                                    </div>
                                    <div class="info" @click="openPlaylist(item.id)">
                                        {{item.name}}
                                    </div>
                                    
                                </div>
                            </div>
                            <br>

                            <h3>My Top Artists</h3>
                            <div class="artists">
                                <div class="artist" v-for="item in topArtists">
                                    <div class="image">
                                        <img :src="item.images[0].url" />
                                        <i @click="Play(item.uri, 'artist')" class="fas fa-play-circle"></i>
                                    </div>
                                    <div class="info">
                                        {{item.name}}
                                    </div>
                                </div>
                            </div>

                            <div class="song-tray hidden" >
                                <i @click="closePlaylist" class="fas fa-chevron-left"></i>
                                <div class="songs">
                                    <div v-for="song in songTray" class="song">
                                        <div class="image">
                                            <img :src="song.track.album.images[0].url" />
                                            <i class="fas fa-play-circle" @click="Play(song.track.uri, 'song')"></i>
                                        </div>
                                        <div class="info">
                                            <div class="title">
                                                {{song.track.name}}
                                            </div>
                                            <div class="artist">
                                                {{song.track.artists[0].name}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="player" >
                            <div class="song-area">
                                
                                <div class="image">
                                    <img :src="currentAlbum" />
                                    <i @click="toggleWindow" class="fas fa-chevron-up"></i>
                                </div>
                                <div class="info">
                                    <div class="title">
                                        {{currentSong}}
                                    </div>
                                    <div class="artist">
                                        {{currentArtist}}
                                    </div>
                                </div>
                                
                            </div>
                            <div class="tray">
                                <i class="fas fa-random" @click="shuffle" v-bind:class="{ active: shuffle }"></i>
                                <i class="fas fa-step-backward" @click="Prev"></i>
                                <div class="togglePlay" >
                                    <i v-if="!playState"  class="fas fa-play-circle" @click="Play(currentUri, 'resume')"></i>
                                    <i v-else class="fas fa-pause-circle" @click="Pause"></i>
                                </div>
                                <i class="fas fa-step-forward" @click="Next"></i>
                                <i class="fas fa-redo-alt" @click="repeat()" v-bind:class="{ active: repeat = 'on' }"></i>
                            </div>
                            
                        </div>

                        <div class="currently-playing" @click="$('#Spotify .other-devices').toggleClass('active')">
                            <i class="fas fa-headphones-alt"></i>
                            <p class="device">Listening On: {{currentDevice}}</p>

                            <div class="other-devices" @blur="$('#Spotify .other-devices').toggleClass('active')">
                                <p v-for="item in devices" class="device" @click="setDevice(item.id)">{{item.name}}</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                `

                
            })
        }
    }

}
