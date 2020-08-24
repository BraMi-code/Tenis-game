var canvas = document.getElementById('canvas');
var tabla = canvas.getContext('2d');

// Reket sablon
function reket(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.score = 0;
    this.modifikatorBrz = 0;
    this.odbijanjeLopte = function(lopta) {
        var reketLijeviZid = this.x;
        var reketDesniZid = this.x + this.width;
        var reketGoreZid = this.y;
        var reketDoleZid = this.y + this.height;
        if (lopta.x > reketLijeviZid && lopta.x < reketDesniZid && lopta.y > reketGoreZid && lopta.y < reketDoleZid) {
            console.log("reket lijevi " + reketLijeviZid);
            console.log("reket desni " + reketDesniZid);
            console.log("reket gore " + reketGoreZid);
            console.log("reket dole  " + reketDoleZid);
            return true;
        }
        return false;
    };
    this.pokretReket = function(keyCode) {
        var sledecaLok = this.y;
        if (keyCode == 40) {
            sledecaLok += 5;
            this.modifikatorBrz = 1.5;
        } else if(keyCode == 38) {
            sledecaLok -= 5;
            this.modifikatorBrz = 1.5;
        } else {
            this.modifikatorBrz = 0;
        }
        sledecaLok = sledecaLok < 0 ? 0 : sledecaLok;
        sledecaLok = sledecaLok + this.height > 480 ? 480 - this.height : sledecaLok;
        this.y = sledecaLok;
    };
}

// Novi objekti
var igrac = new reket(5, 200, 25, 100);
var komp = new reket(610, 200, 25, 100);
var mreza = { x: canvas.width/2, y: 0, width: 5, height: 10};
var lopta = { x: 320, y: 240, radius: 10, xBrzina: 2, yBrzina: 0,
    // Dodajemo naknadno za odbacivanje lopte
            povratakX: function() {
                this.xBrzina *= -1;
                },
            povratakY: function() {
                this.yBrzina *= -1;
                },
            reset: function() {
                this.x = 320;
                this.y = 240;
                this.xBrzina = 2;
                this.yBrzina = 0;
                },
            skocnost: function() {
                return lopta.yBrzina != 0;
                },
            modifikovanaXbrz: function(modifikacija) {
                modifikacija = this.xBrzina < 0 ? modifikacija * -1 : modifikacija;
                var sledVrijednost = this.xBrzina + modifikacija;
                sledVrijednost = Math.abs(sledVrijednost) > 9 ? 9 : sledVrijednost;
                this.xBrzina = sledVrijednost;
                console.log(this.xBrzina);
                },
            modifikovanaYbrz: function(modifikacija) {
                modifikacija = this.yBrzina < 0 ? modifikacija * -1 : modifikacija;
                this.yBrzina += modifikacija;
                }
            };

function tik() {
    tokIgre();
    nacrtajIgru();
    window.setTimeout("tik()", 1000/60);
}
function tokIgre() {
    document.getElementById("skorKomp").innerText = komp.score;
    document.getElementById("skorIgrac").innerText = igrac.score;
    lopta.x += lopta.xBrzina;
    lopta.y += lopta.yBrzina;
    if (lopta.x < 0) {
        komp.score++;
        console.log("komp.score je " + komp.score);
        lopta.reset();
    } else if (lopta.x > 640) {
        igrac.score++;
        console.log("igrac.score je " + igrac.score);
        lopta.reset();
    }
    if (lopta.y <= 0 || lopta.y >= 480) {
        lopta.povratakY();
    }
    var sudarIgrac = igrac.odbijanjeLopte(lopta);
    var sudarKomp = komp.odbijanjeLopte(lopta);
        if (sudarIgrac || sudarKomp) {
            lopta.povratakX();
            lopta.modifikovanaXbrz(0.25);
            var ubrzanjeLopte = sudarIgrac ? igrac.modifikatorBrz : komp.modifikatorBrz;
            lopta.modifikovanaYbrz(ubrzanjeLopte);
    }
    for (var keyCode in drziDugme) {
        igrac.pokretReket(keyCode);
    }
    var sredinaKompReketa = komp.y + (komp.height / 2);
    if (sredinaKompReketa < lopta.y) {
        komp.pokretReket(40);
    }
    if(sredinaKompReketa > lopta.y) {
        komp.pokretReket(38);
    }
}
function nacrtajIgru() {
    tabla.fillStyle = "green";
    tabla.fillRect(0, 0, 640, 480);
    nacrtajLiniju();
    nacrtajReket(igrac);
    nacrtajReket(komp);
    nacrtajLoptu(lopta);
}
function nacrtajReket(reket) {
    tabla.fillStyle = "yellow";
    //tabla.shadowBlur = 20;
    //tabla.shadowColor = "white";
    tabla.fillRect(reket.x, reket.y, reket.width, reket.height);
}
function nacrtajLoptu(lopta) {
    tabla.beginPath();
    tabla.arc(lopta.x, lopta.y, lopta.radius, 0, 2 * Math.PI, false);
    tabla.fillStyle = "orange";
    tabla.fill();
}
function nacrtajLiniju() {
    for (var i = 0; i <= canvas.height; i += 15) {
        tabla.fillStyle = "white";
        tabla.fillRect(mreza.x - 5, mreza.y + i, mreza.width, mreza.height);
    }
}

var drziDugme = {};
window.addEventListener("keydown", function(keyInfo) { drziDugme[event.keyCode] = true; }, false);
window.addEventListener("keyup", function(keyInfo) {delete drziDugme[event.keyCode];}, false);
tik();
