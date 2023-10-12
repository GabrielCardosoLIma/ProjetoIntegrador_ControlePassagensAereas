var btnAero = document.querySelector('#btnAeronaves');
var containerAero = document.querySelector('.aeronaves');
var btnMapa = document.querySelector('#btnMapa');
var containerMapa = document.querySelector('.mapa');
var btnVoos = document.querySelector('#btnVoos');
var containerVoos = document.querySelector('.voos');


btnAero.addEventListener('click', function() {
    containerMapa.style.display = 'none';
    containerVoos.style.display = 'none';
    if (window.getComputedStyle(containerAero).display === 'none') {
        containerAero.style.display = 'block';
    } else {
        containerAero.style.display = 'none';
    }
});

btnMapa.addEventListener('click', function() {
    containerVoos.style.display = 'none';
    containerAero.style.display = 'none';
    if (window.getComputedStyle(containerMapa).display === 'none') {
        containerMapa.style.display = 'block';
    } else {
        containerMapa.style.display = 'none';
    }
});

btnVoos.addEventListener('click', function() {
    containerMapa.style.display = 'none';
    containerAero.style.display = 'none';
    if (window.getComputedStyle(containerVoos).display === 'none') {
        containerVoos.style.display = 'block';
    } else {
        containerVoos.style.display = 'none';
    }
});

