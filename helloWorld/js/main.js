window.graphs = (function(){
    'use strict';

    var canvas,
        context,
        width,
        height;

    var pi = Math.PI,
        tau = 2 * pi;

    var scale;
    var french = [];
    var german = [];
    var italian = [];
    var germanNodes = [];
    var italianNodes = [];
    var frenchNodes = [];
    var radius = 200;

    var frenchForce;
    var italianForce;
    var germanForce;

    var centerFrench;
    var centerItalian;
    var centerGerman;

    var forcesA, forcesB;

    var CHOISES = {
        GERMAN: 'GERMAN',
        ITALIAN: 'ITALIAN',
        FRANCE: 'FRANCE',
        ALL: 'ALL'
    };

    var languageToRender = CHOISES.ALL;
    var regionToRender = CHOISES.ALL;

    var csvData;

    function langReducer(sum, item) {
        if (sum[item.CountryLanguage]){
            sum[item.CountryLanguage].sum += parseInt(item.People);
        }
        else {
            sum[item.CountryLanguage] = {
                sum: parseInt(item.People),
                color: '#' + item.Colour,
                language: item.CountryLanguage
            };
        }

        return sum;
    }

    function toArrayMaxMapper (value) {
        return value.sum;
    }

    function nodes (amount, bigIndex, center, color, language) {
        return d3.range(amount).map(function (current, index) {
            var r = Math.random() * radius,
                a = bigIndex + index * tau,
                x = center.x + r * Math.cos(a),
                y = center.y + r * Math.sin(a);
            return {
                x: x,
                y: y,
                vx: (center.y - y) * 0.005,
                vy: (x - center.x) * 0.005,
                color: color,
                language: language
            };
        });
    }

    function scaleAndColorMapper (value) {
        return [Math.round(scale(value.sum)), value.color, value.language];
    }

    function resetForces () {
        frenchForce = d3.forceSimulation(frenchNodes)
            .drag(0.0002)
            .alphaDecay(0)
            .force("charge", d3.forceManyBody().strength(0.02))
            .force("center", d3.forceCenter(centerFrench.x, centerFrench.y))
        //.on("tick", ticked);

        italianForce = d3.forceSimulation(italianNodes)
            .drag(0.0002)
            .alphaDecay(0)
            .force("charge", d3.forceManyBody().strength(0.02))
            .force("center", d3.forceCenter(centerItalian.x, centerItalian.y))
        //.on("tick", ticked);

        germanForce = d3.forceSimulation(germanNodes)
            .drag(0.0002)
            .alphaDecay(0)
            .force("charge", d3.forceManyBody().strength(0.02))
            .force("center", d3.forceCenter(centerGerman.x, centerGerman.y))
            .on("tick", ticked);
    }

    function ticked() {
        context.clearRect(0, 0, width, height);
        context.lineWidth = 4;
        context.lineCap = "square";

        var frenchLength = frenchNodes.length;
        var italianLength = italianNodes.length;
        var germanLength = germanNodes.length;

        if(regionToRender === CHOISES.ALL || regionToRender === CHOISES.FRANCE) {
            for (var i = 0, frenchNode; i < frenchLength; ++i) {
                frenchNode = frenchNodes[i];
                if (languageToRender !== CHOISES.ALL && languageToRender !== frenchNode.language) {
                    continue;
                }
                context.beginPath();
                context.moveTo(frenchNode.x, frenchNode.y);
                context.lineTo(frenchNode.x + frenchNode.vx * 2, frenchNode.y + frenchNode.vy * 3);
                context.strokeStyle = frenchNode.color; //stroke(node.vx * node.vx + node.vy * node.vy);
                context.stroke();
            }
        }

        if(regionToRender === CHOISES.ALL || regionToRender === CHOISES.ITALIAN) {
            for (var i = 0, italianNode; i < italianLength; ++i) {
                italianNode = italianNodes[i];
                if (languageToRender !== CHOISES.ALL && languageToRender !== italianNode.language) {
                    continue;
                }
                context.beginPath();
                context.moveTo(italianNode.x, italianNode.y);
                context.lineTo(italianNode.x + italianNode.vx * 2, italianNode.y + italianNode.vy * 3);
                context.strokeStyle = italianNode.color; //stroke(node.vx * node.vx + node.vy * node.vy);
                context.stroke();
            }
        }

        if(regionToRender === CHOISES.ALL || regionToRender === CHOISES.GERMAN) {
            for (var i = 0, germanNode; i < germanLength; ++i) {
                germanNode = germanNodes[i];
                if (languageToRender !== CHOISES.ALL && languageToRender !== italianNode.germanNode) {
                    continue;
                }
                context.beginPath();
                context.moveTo(germanNode.x, germanNode.y);
                context.lineTo(germanNode.x + germanNode.vx * 2, germanNode.y + germanNode.vy * 3);
                context.strokeStyle = germanNode.color; //stroke(node.vx * node.vx + node.vy * node.vy);
                context.stroke();
            }
        }
    }


    return {
        REGIONS: CHOISES,
        init: function init() {
            canvas = document.querySelector("canvas");
            context = canvas.getContext("2d");
            width = canvas.width;
            height = canvas.height;

            centerFrench = {x: width * 0.25, y: height * 0.5};
            centerItalian = {x: width * 0.5, y: height * 0.5};
            centerGerman = {x: width * 0.75 , y: height * 0.5};

            d3.csv('Moving_data_ch3.csv', function (data) {

                csvData = data;

                french = _.chain(data)
                    .filter({ CantonLanguage: "French"})
                    .reduce(langReducer, {})
                    .value();

                german = _.chain(data)
                    .filter({ CantonLanguage: "German"})
                    .reduce(langReducer, {})
                    .value();

                italian = _.chain(data)
                    .filter({ CantonLanguage: "Italian"})
                    .reduce(langReducer, {})
                    .value();


                var temp = _.flatten([_.map(french, toArrayMaxMapper), _.map(italian, toArrayMaxMapper), _.map(german, toArrayMaxMapper)]);

                var max = _.max(temp);

                console.log('max', max);

                scale = d3.scaleLog().domain([1, max]).range([1, 25, 30]).base(100).clamp(true);

                var bonjour = _.map(french, scaleAndColorMapper);
                var ciao = _.map(italian, scaleAndColorMapper);
                var hallo = _.map(german, scaleAndColorMapper);

                frenchNodes = _.chain(bonjour)
                    .map(function toNode (value, bigIndex) {
                        return nodes(value[0], bigIndex, centerFrench, value[1], value[2]);
                    })
                    .flatten()
                    .value();

                italianNodes = _.chain(ciao)
                    .map(function toNode (value, bigIndex) {
                        return nodes(value[0], bigIndex, centerItalian, value[1], value[2]);
                    })
                    .flatten()
                    .value();

                germanNodes = _.chain(hallo)
                    .map(function toNode (value, bigIndex) {
                        return nodes(value[0], bigIndex, centerGerman, value[1], value[2]);
                    })
                    .flatten()
                    .value();

                resetForces();
            });
        },
        showOnlyOneLanguage: function showOnlyOneLanguage(lang) {
            context.clearRect(0, 0, width, height);
            languageToRender = lang;
        },
        showAllLanguages: function showAllLanguages () {
            context.clearRect(0, 0, width, height);
            languageToRender = CHOISES.ALL;
        },
        showOnlyOneRegion: function showOnlyOneRegion (region) {
            context.clearRect(0, 0, width, height);
            regionToRender = region;
        },
        showAllRegions: function showAllRegions () {
            context.clearRect(0, 0, width, height);
            regionToRender = CHOISES.ALL;
        },
        showComparison: function showComparison (langA, langB) {
            context.clearRect(0, 0, width, height);
            germanForce.stop();
            frenchForce.stop();
            italianForce.stop();

            // get nodes
            // add forces
            // add ticking function

            var centerA = [
                {x: width * 0.1, y: height * 0.5},
                {x: width * 0.2, y: height * 0.5},
                {x: width * 0.3, y: height * 0.5}
            ];

            var centerB = [
                {x: width * 0.5, y: height * 0.5},
                {x: width * 0.6, y: height * 0.5},
                {x: width * 0.7, y: height * 0.5}
            ];

            var nodesA = ['Italian', 'French', 'German'];
            var nodesB = _.clone(nodesA);

            radius = 95;

            nodesA = _.chain(nodesA)
                .map(function getData(item) {
                    return _.filter(csvData, { CantonLanguage: item, CountryLanguage: langA });
                })
                .map(function reduce(nodes) {
                    return _.reduce(nodes, langReducer, {});
                })
                .map(function map(nodes) {
                    return _.map(nodes, scaleAndColorMapper);
                })
                .map(function anotherMap (currentNodes, centerIndex) {
                    return _.map(currentNodes, function doIt (value, bigIndex) {
                        return nodes(value[0], bigIndex, centerA[centerIndex], value[1], value[2]);
                    })
                })
                .flatten()
                .value();

            nodesB = _.chain(nodesB)
                .map(function getData(item) {
                    return _.filter(csvData, { CantonLanguage: item, CountryLanguage: langB });
                })
                .map(function reduce(nodes) {
                    return _.reduce(nodes, langReducer, {});
                })
                .map(function map(nodes) {
                    return _.map(nodes, scaleAndColorMapper);
                })
                .map(function anotherMap (currentNodes, centerIndex) {
                    return _.map(currentNodes, function doIt (value, bigIndex) {
                        return nodes(value[0], bigIndex, centerB[centerIndex], value[1], value[2]);
                    })
                })
                .flatten()
                .value();

            console.log(scale.base());

            forcesA = _.map(nodesA, function createForce(nodes, index) {
                return d3.forceSimulation(nodes)
                    .drag(0.0002)
                    .alphaDecay(0)
                    .force("charge", d3.forceManyBody().strength(0.002))
                    .force("center", d3.forceCenter(centerA[index].x, centerA[index].y))
                    .on('tick', smallTick);
            });

            forcesB = _.map(nodesB, function createForce(nodes, index) {
                return d3.forceSimulation(nodes)
                    .drag(0.0002)
                    .alphaDecay(0)
                    .force("charge", d3.forceManyBody().strength(0.002))
                    .force("center", d3.forceCenter(centerB[index].x, centerB[index].y))
                    .on('tick', smallTick);
            });

            function smallTick () {
                context.clearRect(0, 0, width, height);
                context.lineWidth = 4;
                context.lineCap = "square";

                _.each(nodesA, function renderNodes (nodes) {
                    _.each(nodes, function renderRender (node) {
                        context.beginPath();
                        context.moveTo(node.x, node.y);
                        context.lineTo(node.x + node.vx * 2, node.y + node.vy * 3);
                        context.strokeStyle = node.color; //stroke(node.vx * node.vx + node.vy * node.vy);
                        context.stroke();
                    })
                });
                _.each(nodesB, function renderNotes (nodes) {
                    _.each(nodes, function renderRender (node) {
                        context.beginPath();
                        context.moveTo(node.x, node.y);
                        context.lineTo(node.x + node.vx * 2, node.y + node.vy * 3);
                        context.strokeStyle = node.color; //stroke(node.vx * node.vx + node.vy * node.vy);
                        context.stroke();
                    })
                })
            }

            _.last(forcesB).on('tick', smallTick());
        },
        resetSimulations: function resetSimulations () {
            radius = 200;
            resetForces();
        }
    }
}());