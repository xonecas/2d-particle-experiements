/*jslint browser:true, plusplus:true, devel:true */
/*global $:false */
(function (win, doc) {
    'use strict';

    var body = doc.querySelector('body'),
        canvas = doc.createElement('canvas'),
        c = canvas.getContext('2d'),
        radians = Math.PI / 180;

    body.appendChild(canvas);
    canvas.width = win.innerWidth - 20;
    canvas.height = win.innerHeight - 20 - 40;

    /* tool */
    function rrange(min, max, noFloor) {
        var result = Math.random() * (max - min) + min;
        return noFloor ? result : Math.floor(result);
    }

    function stop() {
        if (win.interval) {
            clearInterval(win.interval);
        }

        return "Stopped";
    }

    function clean() {
        canvas.width = canvas.width;
        canvas.height = canvas.height;
    }

    function Particle(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
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

    function tiles() {
        var w = canvas.width,
            h = canvas.height,
            r = 20,
            rows = Math.floor(w / r),
            cols = Math.floor(h / r),
            color = 0,
            n,
            m;

        for (n = 0; n < cols; ++n) {
            for (m = 0; m < rows; ++m) {

                c.strokeStyle = "hsl(" +
                    (color === 360 ? color = 0 : color += 0.2) +
                    ", 100%, 50%)";

                c.beginPath();

                c.arc(r + n * (r * 2),
                        r + m * (r * 2),
                        Math.floor(r / 4) * 3,
                        0,
                        Math.PI * 2, true);
                c.stroke();

            }
        }

    }

    function grid() {
        var w = canvas.width,
            h = canvas.height,
            mod = 100,
            size = Math.floor(w / mod),
            i;

        canvas.width = size * mod + 2;
        canvas.style.width = size * mod + 2;

        c.save();
        c.moveTo(0, 0);
        i = mod;
        while (i) {
            c.moveTo(size * i, 0);
            c.lineTo(size * i, h);
            --i;
        }

        c.moveTo(0, 0);
        i = Math.floor(h / size);
        while (i) {
            c.moveTo(0, size * i);
            c.lineTo(w, size * i);
            --i;
        }

        c.stroke();
        c.restore();
    }

    function spiral() {
        var particle,
            particles = [],
            maxParticles = 6000,
            angle = 0,
            size = 5,
            x = 0,
            y = 0,
            xyModifier = 1.1,
            color = 180;

        clean();

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

        return "Look at the pretty dots!";
    }

    /* recursion play */
    function fractal() {
        var gens = 0,
            max = 5,
            size = 4,
            startColor = rrange(260, 360);

        clean();

        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);
        new Particle(0, 0, size, startColor).draw();

        (function init(angle, color, distance, scale) {
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
            c.scale(scale, scale);

            if (gens < max) {
                new Particle(0, 0, size, color).draw();

                color = color >= 360 ? 1 : color + 20 * gens;

                init(rrange(1, 270), color, rrange(200, 300),
                    rrange(0.75, 1, true));

                init(rrange(1, 270), color, rrange(200, 300),
                    rrange(0.75, 1, true));
            }

            if (gens === max) {
                new Particle(0, 0, size, color).draw();
            }
            c.restore();
            gens--;
        }(0, startColor, 0, 1));

        c.restore();

        return "Wicked man...";
    }

    function rain() {
        var dash,
            dashes = [],
            max = 4000,
            startColor = 180,
            endColor = 200,
            startLeap = 0.5,
            endLeap = 3;

        clean();

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

        return "It's raining...";
    }

    function circle(x, y, soft) {
        var particle,
            max = 12,
            angleMod = 360 / max,
            radius = 90;

        x = x || canvas.width / 2;
        y = y || canvas.height / 2;


        if (soft) {
            c.save();
            c.fillStyle = 'rgba(0, 0, 0, 0.3)';
            c.fillRect(0, 0, canvas.width, canvas.height);
            c.restore();
        } else {
            clean();
        }

        c.save();
        c.translate(x, y);

        while (max) {

            particle = new Particle(radius, radius, 8, angleMod * max);
            particle.draw();

            c.rotate(angleMod * radians);

            max -= 1;
        }

        c.restore();

        return "It's magic";
    }

    function trackingCircle() {
        var x = 0,
            y = 0,
            angle = 1;

        canvas.addEventListener('mousemove', function (e) {
            x = e.clientX;
            y = e.clientY;
        }, false);

        win.interval = setInterval(function () {
            circle(x, y, true);
        }, 1000 / 60);

        return "tracking...";

    }

    win.spiral = spiral;
    win.fractal = fractal;
    win.rain = rain;
    win.stop = stop;
    win.clean = clean;
    win.circle = circle;
    win.tracking = trackingCircle;

    win.help = function () {
        console.log([
            'Welcome to particle playground!',
            '',
            '(Warning: you might lock up your browser)',
            '',
            'There are 3 functions for you to use:',
            '   spiral();',
            '   fractal();',
            '   rain(); and stop(); (stop calls off the rain)',
            '   circle();',
            '   tracking();',
            'No arguments (comming soon)',
            '',
            'You can see this prompt by calling help();'
        ].join('\n'));
    };

    $('.fn').click(function (e) {
        var fn = $(e.target).data('fn');
        win[fn]();
    });

    $(function () {
        win.help();
        //grid();
        tiles();
    });

}(window, document));
