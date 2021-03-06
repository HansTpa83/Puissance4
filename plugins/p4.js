$.fn.puissance4 = function(){
    class Formulaire {
        constructor(){
            $("head").append('<link rel="stylesheet" href="plugins/css/style.css">');
            this.info_start()
            this.info_players()
        }

        info_start(){
            $("body").append('<form method=\"post\" id="form_p4">'+
            '<div class="elem\">'+
                '<div>'+
                    '<div>'+
                        '<label for="rows">Rows</label>'+
                    '</div>'+
                    '<div>'+
                        '<input type="number" name="rows" id="rows" min="6" value="6">'+
                    '</div>'+
                '</div>'+
                '<div>'+
                    '<div>'+
                        '<label for="cols">Cols</label>'+
                    '</div>'+
                    '<div>'+
                        '<input type="number" name="cols" id="cols" min="7" value="7">'+
                    '</div>'+
                '</div>'+
            '</div>'+

            '<div class="elem">'+
                '<div>'+
                    '<div>'+
                        '<label for="player1">Player1 name</label>'+
                    '</div>'+
                    '<div>'+
                        '<input type="text" name="player1_name" id="player1_name" placeholder="Player 01" required>'+
                    '</div>'+
                '</div>'+
                '<div>'+
                    '<label for="player1_color">Player1 color</label>'+
                '</div>'+
                '<select name="player1_color" id="player1_color">'+
                    '<option value="red">red</option>'+
                '</select>'+
            '</div>'+

            '<div class="elem">'+
                '<div>'+
                    '<div>'+
                        '<label for="player2">Player2 name</label>'+
                    '</div>'+
                    '<div>'+
                        '<input type="text" name="player2_name" id="player2_name" placeholder="Player 02" required>'+
                    '</div>'+
                '</div>'+
                '<div>'+
                    '<label for="player2_color">Player2 color</label>'+
                '</div>'+
                '<select name="player2_color" id="player2_color">'+
                    '<option value="yellow">yellow</option>'+
                '</select>'+
            '</div>'+
            '<div id="button">'+
                '<button>Submit</button>'+
            '</div>')
        }

        info_players(){
            $("body").append("<div id=\"info\">"+
                                '<div>'+
                                    '<h4>Current player</h4>'+
                                    '<div id="current_player"></div>'+
                                '</div>'+
                                '<div>'+
                                    '<h4>Red</h4>'+
                                    '<div id="red"></div>'+
                                '</div>'+
                                '<div>'+
                                    '<h4>Yellow</h4>'+
                                    '<div id="yellow"></div>'+
                                '</div>'+
                                '<div>'+
                                    '<h4>Score</h4>'+
                                    '<div id="score"></div>'+
                                '</div>'+
                                '<div>'+
                                    '<button id="undo">Undo</button>'+
                                '</div>'+
                                '<div>'+
                                    '<button id="reset">RESET</button>'+
                                '</div>'+
                             '</div>')
        }
    }

    class P4 {
        constructor(balise, rows, cols, player1, player2){
            this.balise = balise;
            this.cols = cols;
            this.rows = rows;
            this.player1 = player1;
            this.player2 = player2;

            this.draw();
            this.selection(this.player1, this.player2);
            $("#score").append(this.player1["name"] +" "+ 0 +" : "+ 0 +" "+this.player2["name"])
        }

        draw(){
            $("body").append("<div id=\"game\"></div>");
            for (let i = 1; i <= this.rows; i++){
                let rows = $("<div>");
                for (let idx = 1; idx <= this.cols; idx++){
                    rows.append("<div class=\"row empty\" data-col=\""+idx+"\" data-line=\""+i+"\"></div>");
                }
                $(this.balise).append(rows);
            }
        }

        selection(player1, player2){
            var i = 0;
            var pos;
            let color = "";
            let click = 0

            if (i == 0){
                $("#current_player").text(player1["name"]);
            }

            $("#red").text(player1["name"])
            $("#yellow").text(player2["name"])

            function last_case(event){
                let num_col = $(event).attr("data-col");
                let row_line = $(".row.empty[data-col="+num_col+"]");
                let free_case = $(".row.empty[data-col=\""+num_col+"\"][data-line=\""+row_line.length+"\"]");
                return free_case;
            }

            $("#game").on("mouseenter", ".row.empty", function(e){
                $(last_case(e.target)).addClass("selec");
            })
            $("#game").on("mouseleave", ".row.empty", function(e){
                $(last_case(e.target)).removeClass("selec");
            })

            let score = {red: 0, yellow: 0 }
            $("#game").on("click", ".row.empty", (e) => {

                i++;
                pos = last_case(e.target);

                if (i%2==1){
                    $("#current_player").text(player2["name"]);
                    color = player1["color"];
                    $(pos).hide()
                    $(pos).addClass(color);
                    $(pos).fadeIn(3000);
                    this.win_check(pos, player1, score)
                }else {
                    $("#current_player").text(player1["name"]);
                    color = player2["color"];
                    $(pos).hide()
                    $(pos).addClass(color);
                    $(pos).fadeIn(100);
                    this.win_check(pos, player2, score)
                }

                $(pos).removeClass("empty");
                $(pos).removeClass("selec");

                    
                click = 0;
            })

            $("#undo").on("click", function(){
                click++;
                if(click == 1){
                    i--;
                    if (i%2==1){
                        $("#current_player").text(player2["name"]);
                    }else {
                        $("#current_player").text(player1["name"]);
                    }
                    $(pos).removeClass(color);
                    $(pos).addClass("empty");
                }
            })
            $("#reset").on("click", function(){
                click++;
                if(click == 1){
                    i--;
                    if (i%2==1){
                        $("#current_player").text(player2["name"]);
                    }else {
                        $("#current_player").text(player1["name"]);
                    }
                    $(".row").removeClass("red");
                    $(".row").removeClass("yellow");
                    $(".row").addClass("empty");
                    $("#game").css("pointer-events", "auto")
                }
            })
        }

        win_check(pos, player, scoreBoard){
            console.log(scoreBoard)
            let player1 = this.player1["name"];
            let player2 = this.player2["name"];
            let col = this.cols
            let row = this.rows
            let nbr_row = parseInt($(pos).attr("data-line"))
            let nbr_col = parseInt($(pos).attr("data-col"))
            let color = player["color"]

            function check_hori(){
                let total = 0
                for(let i = 1; i<= col; i++){
                    if($('[data-col='+i+'][data-line='+nbr_row+']').hasClass(color)){
                        total++
                        if(total >= 4){
                            console.log("hori")
                            return true;
                        }
                    } else{
                        total = 0;
                    }
                }
                return false;
            }

            function check_vert(){
                let total = 0
                for(let i = row; i>= 1; i--){
                    if($('[data-col='+nbr_col+'][data-line='+i+']').hasClass(color)){
                        total++
                        if(total == 4){
                            console.log("vert")

                            return true;
                        }
                    } else{
                        total = 0;
                    }

                }
                return false;
            }

            function check_diago_droite(){
                let total = 0
                let offset_y = 3
                let offset_x = -3
                for(let i = 1; i <= col; i++){
                    let check_case = $('[data-col='+(nbr_col+offset_x)+'][data-line='+(nbr_row+offset_y)+']')
                    if ($(check_case).hasClass(color)){
                        total++
                        if (total == 4){
                            console.log("diago_droite")
                            return true
                        }
                    }
                    offset_y--
                    offset_x++
                }
                return false;
            }

            function check_diago_gauche(){
                let total = 0
                let offset_y = -3
                let offset_x = -3
                for(let i = 1; i <= col; i++){
                    let check_case = $('[data-col='+(nbr_col+offset_x)+'][data-line='+(nbr_row+offset_y)+']')
                    if ($(check_case).hasClass(color)){
                        total++
                        if (total == 4){
                            console.log("diago_gauche")
                            return true
                        }
                    }
                    offset_y++
                    offset_x++
                }
                return false;
            }


            if(check_hori() || check_vert() || check_diago_droite() || check_diago_gauche()){
                alert(player["name"]+" win")
                scoreBoard[color]++
                $("#score").text(this.player1["name"] +" "+ scoreBoard["red"] +" : "+ scoreBoard["yellow"] +" "+this.player2["name"])

                let retry = confirm("rematch  ?")
                if(retry == true){
                    $("#game").css("pointer-events", "none")
                } else {
                    window.location = window.location
                }
            }
        }
    }

    new Formulaire();

    $("#form_p4").on("submit", function(e){
        e.preventDefault()
        let data = new FormData(this);
        let player1_info = {name : data.get("player1_name"), color : data.get("player1_color")}
        let player2_info = {name : data.get("player2_name"), color : data.get("player2_color")}

        $(this).hide();
        $("#game").show();
        $("#info").show();


        new P4("#game", data.get("rows"), data.get("cols"), player1_info, player2_info)
    })
}

$("body").puissance4();
