/*jslint browser:true, nomen:true, devel:true */
(function (win, doc) {
    'use strict';

    var body       = doc.querySelector('body'),
        canvas      = doc.createElement('canvas'),
        c           = canvas.getContext('2d'),
        radians     = Math.PI / 180,
        redrawRain = doc.querySelector('#redraw'),
        redrawSpiral = doc.querySelector('#redrawSpiral');

    body.appendChild(canvas);
    canvas.width = win.innerWidth - 10;
    canvas.height = win.innerHeight - 10;

    /* tool */
    function rrange(min, max, noFloor) {
        var result = Math.random() * (max - min) + min;
        return noFloor ? result : Math.floor(result);
    }

    function Particle(x, y, size, color) {
        this.x        = x;
        this.y        = y;
        this.size    = size;
        this.color  = color || rrange(1, 359);
    }

    Particle.prototype = {
        draw: function () {
            c.save();
            c.fillStyle = "hsl(" + this.color + ", 100%, 50%)";
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
            c.fill();
            c.restore();
        }
    };

    /* first routine */
    function spiral() {
        var particle,
            particles = [],
            maxParticles = parseInt(doc.querySelector('#spiralCount').value, 10) || 6000,
            angle = 0,
            size = parseInt(doc.querySelector('#spiralSize').value, 10) || 5,
            x = 0,
            y = 0,
            xyModifier = parseFloat(doc.querySelector('#spiralPositionMod').value, 10) || 1.1,
            color = 180;

        canvas.width = canvas.width;
        canvas.height = canvas.height;

        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);

        while (--maxParticles > 0) {
            angle += 2;
            y += xyModifier;
            x += xyModifier;
            color = color >= 360 ? 180 : color + 1;

            if (!(x >= canvas.width || y >= canvas.height || size <= 0)) {
                c.save();
                c.rotate(angle * radians);

                particle = new Particle(x, y, size, color);
                particles.push(particle);
                particle.draw();

                c.restore();
            }
        }

        c.restore();
    }

    /* recursion play */
    function fractal() {
        var gens = 0,
            max = 5,
            size = 4,
            startColor = rrange(260, 360);

        canvas.width = canvas.width;
        canvas.height = canvas.height;

        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);
        new Particle(0, 0, size, startColor).draw();

        (function _init(angle, color, distance, scale) {
            gens++;
            angle = angle || rrange(1, 90);

            c.save();
            c.rotate(angle * radians);
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(distance, 0);

            c.strokeStyle = 'hsl(' + color + ', 100%, 50%)';
            c.stroke();

            c.translate(distance, 0);
            console.log(scale);
            c.scale(scale, scale);

            if (gens < max) {
                new Particle(0, 0, size, color).draw();

                color = color >= 360 ? 1 : color + 20 * gens;

                _init(rrange(1, 270), color, rrange(200, 300),
                    rrange(0.75, 1, true));

                _init(rrange(1, 270), color, rrange(200, 300),
                    rrange(0.75, 1, true));
            }

            if (gens === max) {
                new Particle(0, 0, size, color).draw();
            }
            c.restore();
            gens--;
        }(0, startColor, 0, 1));

        c.restore();
    }

    function rain() {
        var dash,
            dashes = [],
            max = parseInt(doc.querySelector('#dropCount').value, 10),
            startColor = parseInt(doc.querySelector('#startColor').value, 10) || 180,
            endColor = parseInt(doc.querySelector('#endColor').value, 10) || 200,
            startLeap = parseInt(doc.querySelector('#startLeap').value, 10) || 0.5,
            endLeap = parseInt(doc.querySelector('#endLeap').value, 10) || 3;

        canvas.width = canvas.width;
        canvas.height = canvas.height;

        if (win.interval) {
            clearInterval(win.interval);
        }

        win.interval = setInterval(function () {
            var i = 0;

            c.save();
            c.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
            c.fillRect(0, 0, canvas.width, canvas.height);
            c.restore();

            if (dashes.length <= max) {
                dash = new Particle(rrange(1, canvas.width, true),
                    rrange(1, canvas.height, true),
                    rrange(startLeap, endLeap, true),
                    rrange(startColor, endColor));

                dashes.push(dash);
            }

            for (i; i < dashes.length; i++) {
                dash = dashes[i];
                dash.y = dash.y >= canvas.height ?
                        rrange(1, canvas.height / 2) :
                        dash.y + rrange(1, 6);

                dash.draw();
            }
        }, 1000 / 30);
    }

    //spiral();
    //fractal();
    //rain();

    window.spiral = spiral;
    window.fractal = fractal;
    window.rain = rain;

    window.help = function () {
        console.log([
            'Welcome to particle playground!',
            'There are 3 functions for you to use:',
            '   spiral();',
            '   fractal();',
            '   rain();',
            'No arguments (comming soon)',
            '',
            'You can see this prompt by calling help();'
        ].join('\n'));
    };
    window.help();

    redrawRain.addEventListener('click', function (ev) {
        ev.preventDefault();
        rain();
    }, false);

    redrawSpiral.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (win.interval) {
            clearInterval(win.interval);
        }
        spiral();
    }, false);


}(window, document));
