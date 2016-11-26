$(function() {
    graphs.init();

    jsonCall();
    var globalData;
    var currentLanguage;
    var currentNumber;
    var sentenceMeaning;
    var highestPeople;
    var lowestPeople;
    var compareLanguageFirst;
    var compareLanguageSecond;
    var index = 1;
    $('.start-button').click(function(){
        $('.step1').fadeOut();
        $('.step2').fadeIn();
        $('.all-people-cta').fadeIn();
        $('.about-link').fadeIn();
        jsonCall();
        updateSentence();
    });
    
    $('.next-button-first').click(function(){
        $('.step2').fadeOut();
        $('.step3').fadeIn();
        updateLanguage();
        updateMeaning();
        updateHighestPeopleNumber();
        updateLowestPeopleNumber();
        graphs.showOnlyOneLanguage(currentLanguage);
    });
    
    $('.next-button-last').click(function(){
        $('.step3').fadeOut();
        $('.step2').fadeIn();
        jsonCall();
        updateSentence();
        graphs.showAllLanguages();
    });
    
    $('.reset-button').click(function(){
        allPeopleButton();
        return false;
    });
    
    $(".nav a").on("click", function(){
       $(".nav").find(".active").removeClass("active");
       $(this).parent().addClass("active");
    });
    
    $(".french-cant-button").on("click", function(){
        graphs.showOnlyOneRegion('FRANCE');
        return false;
    });
    
    $(".italian-cant-button").on("click", function(){
        graphs.showOnlyOneRegion('ITALIAN');
        return false;
    });
    
    $(".german-cant-button").on("click", function(){
        graphs.showOnlyOneRegion('GERMAN');
        return false;
    });
    
    
    $('.play-button').click(function(){
        playButton();
        return false;
    });
    
    $('.about-link').click(function(){
        aboutCta();
        return false;
    });
    
    $('.about-close').click(function(){
        closeCta();
        return false;
    });
    
    $('.compare-button').click(function(){
        compareStarts();
        return false;
    });
    
    $('.compare-now').click(function(){
        compareLanguage();
        return false;
    });
    
    function jsonCall () {
        $.getJSON( "js/translate3.json", function( data ) {
          var items = [];
            globalData = data;
            //console.log(titleQuestion);

          $.each( data, function( key, val ) {
            items.push( "<li id='" + key + "'><a href=" + '"#">' + data[key].Language + "</a></li>" );
          });
          $( "<ul/>", {
            "class": "dropdown-menu",
            html: items.join( "" )
          }).appendTo( ".language-dropdown" );
            $('.language-dropdown li').on("click", function() {
                //console.log($(this).text());
                $(".language-button span").text($(this).text());
                $(".language-button span").val($(this).text());
                $('.next-button-first').removeClass('disabled');
                $('.next-button-first').addClass('active');
                //return false;
            });
            $('.compare-dropdown-first li').on("click", function() {
                compareLanguageFirst = $(this).text();
                $(".compare-button-first .compare-button-first-text").text($(this).text());
                $(".compare-button-first .compare-button-first-text").val($(this).text());
                $('.next-button-first').removeClass('disabled');
                $('.next-button-first').addClass('active');
                //return false;
            });
            $('.compare-dropdown-second li').on("click", function() {
                compareLanguageSecond = $(this).text();
                $(".compare-button-second .compare-button-second-text").text($(this).text());
                $(".compare-button-second .compare-button-second-text").val($(this).text());
                $('.next-button-first').removeClass('disabled');
                $('.next-button-first').addClass('active');
                //return false;
            });
        });
    }
    
    function updateLanguage () {
        currentLanguage = globalData[currentNumber].Language;
        $(".language-solution").text(currentLanguage);
    }
    
    function compareLanguage () {
        graphs.showComparison(compareLanguageFirst,compareLanguageSecond);
    }
    
    function updateMeaning () {
        $(".sentence-solution").text(sentenceMeaning);
    }
    
    function updateHighestPeopleNumber () {
        highestPeople = globalData[currentNumber].Total;
        $(".highest-people-number").text(highestPeople);
    }
    
    function updateLowestPeopleNumber () {
        var checkFew = true;
        while (checkFew) {
            var randomFew = Math.floor(Math.random()*globalData.length);
            if (globalData[randomFew].Quantity != globalData[currentNumber].Quantity) {
                var fewLanguage = globalData[randomFew].Language;
                lowestPeople = globalData[randomFew].Total;
                $(".lowest-people-number").text(lowestPeople);
                $(".language-few").text(fewLanguage);
                checkFew = false;
            }
            else {
                
            }
        }
    }
    
    function allPeopleButton () {
        graphs.resetSimulations();
        graphs.showAllLanguages();
        $('.all-people-cta').fadeOut();
        $('.about-introduction').fadeOut();
        $('.quiz-container').fadeOut();
        $('.play-button-cta').fadeIn();
        $('.navbar-container').fadeIn();
        $('.compare-content').fadeOut();
        $('.reset-button').addClass('active');
    }
    
    function playButton () {
        graphs.showAllLanguages();
        $('.play-button-cta').fadeOut();
        $('.all-people-cta').fadeIn();
        $('.about-introduction').fadeOut();
        $('.navbar-container').fadeOut();
        $('.compare-content').fadeOut();
        $('.reset-button').removeClass('active');
        $('.about-link').removeClass('active');
        $('.compare-button').removeClass('active');
        $('.quiz-container').fadeIn();
    }
    
    function aboutCta () {
        $('.play-button-cta').fadeOut();
        $('.all-people-cta').fadeIn();
        $('.quiz-container').fadeOut();
        $('.compare-content').fadeOut();
        $('.about-introduction').fadeIn();
        $('.navbar-container').fadeOut();
        $('.about-link').addClass('active');
        $('.compare-button').removeClass('active');
    }
    
    function closeCta () {
        $('.quiz-container').fadeIn();
        $('.about-introduction').fadeOut();
        $('.about-link').removeClass('active');
    }
    
    function compareStarts () {
        $('.play-button-cta').fadeOut();
        $('.all-people-cta').fadeIn();
        $('.compare-button').addClass('active');
        $('.quiz-container').fadeOut();
        $('.compare-content').fadeIn();
        $('.navbar-container').fadeOut();
        $('.about-introduction').fadeOut();
        $('.about-link').removeClass('active');
        jsonCall();
    }
    
    function updateSentence () {
        
        jsonCall();
        currentNumber = Math.floor(Math.random()*globalData.length);
        
        switch(index) {
                case 1:
                    var chosenSentence = globalData[currentNumber].Sentence1;
                    sentenceMeaning = globalData[12].Sentence1;
                    index ++;
                    break;
                case 2:
                    var chosenSentence = globalData[currentNumber].Sentence2;
                    sentenceMeaning = globalData[12].Sentence2;
                    index ++;
                    break;
                case 3:
                    var chosenSentence = globalData[currentNumber].Sentence3;
                    sentenceMeaning = globalData[12].Sentence3;
                    index ++;
                    break;
                case 4:
                    var chosenSentence = globalData[currentNumber].Sentence4;
                    sentenceMeaning = globalData[12].Sentence4;
                    index ++;
                    break;
                case 5:
                    var chosenSentence = globalData[currentNumber].Sentence5;
                    sentenceMeaning = globalData[12].Sentence5;
                    index ++;
                    break;
                case 6:
                    var chosenSentence = globalData[currentNumber].Sentence6;
                    sentenceMeaning = globalData[12].Sentence6;
                    index ++;
                    break;
                case 7:
                    var chosenSentence = globalData[currentNumber].Sentence7;
                    sentenceMeaning = globalData[12].Sentence7;
                    index ++;
                    break;
                case 8:
                    var chosenSentence = globalData[currentNumber].Sentence8;
                    sentenceMeaning = globalData[12].Sentence8;
                    index ++;
                    break;
                default:
                    var chosenSentence = globalData[currentNumber].Sentence1;
                    sentenceMeaning = globalData[12].Sentence1;
                    index = 1;
            }

        $(".sentence-question").text(chosenSentence);
    }
});