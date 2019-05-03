

/*  teacher expand and collapse */
var  e = $(".instructor-card");
 e.on("click", ".instructor-name, .avatar, .expand-card", function(e){
        console.log('hello');
     var t;
        t = $(this).closest(".instructor-card"),
         t.toggleClass("expanded"),
         t.find(".instructor-description").toggle("fast"),
         t.find("i").toggleClass("icon-chevron-down icon-chevron-up"),
         t.find(".avatar").toggle("fast");
     e.preventDefault();
});

setTimeout(function(){$('#notifications').fadeOut();}, 5000);
$('.exp-content').click(function () {
    var slideEle = $(this).parent().find('~ .sld-content').first();
    if (slideEle.hasClass('sld-active')) {
        slideEle.removeClass('sld-active');
    } else {
        slideEle.addClass('sld-active');
    }
});


$('form').find('input[type=text], input[type=password], input[type=number], input[type=email], input[type=url], textarea, select').each(function(){
    $(this).addClass('floatlabel');
});

$('input.floatlabel').floatlabel({
    labelStartTop: 30,
});


/*

$('.datetimepicker').datetimepicker({
    format: 'yyyy-MM-dd hh:mm',
    pickDate: true,
    pickTime: true,
    pick12HourFormat: false,   
    pickSeconds: false,
    language: 'en'
});

$('.pick-dt').datetimepicker({
    format: 'yyyy-MM-dd hh:mm',
    pickDate: true,
    pickTime: true,
    pick12HourFormat: false,   
    pickSeconds: false,
    language: 'en'
});


$('.pick-date').datetimepicker({
     format: 'yyyy-MM-dd',
    pickTime: false,
    
    pick12HourFormat: false,   
    pickSeconds: false,
    language: 'en'
});




$('.pick-time').datetimepicker({
    format: 'hh:mm',
    pickDate: false,
    pickTime: true,
    pick12HourFormat: false,   
    pickSeconds: false,
    language: 'en'
});

*/

var trgVal  = $('#itype');
var examList = $('#selcExam');
var courseList = $('#crs-bt');
if (trgVal.val() === 'n') {
    // show exam and course list box
    examList.hide();
    courseList.hide();
}

trgVal.on('change',  function () {

    var dropval = $(this).val();
    if (dropval == 'n') {
        // show exam and course list box
        examList.hide();
        courseList.hide();
    }
    if (dropval == 'exam') {
        examList.show();
        courseList.hide();
    }
    if (dropval == 'enrol') {
        // show course list
        examList.hide();
        courseList.show();
    }
    if (dropval == 'examenrol') {
        // show exam and course list box
        examList.show();
        courseList.show();
    }

    console.log(dropVal);

});


var promoDiv = $('.promo-header');
$(window).on('load resize', function() {
    promoDiv.css({'height':(($(window).height())-128)+'px'});
});


// load pages via ajax
$(document).on("click", "a.ajx-load", function(e){
    var page = $(this).attr('href') + ' ' +'#ajx-page';
    $('.ajx-body').load(page, "#ajx-page");
    e.preventDefault();
});

// add more images function
$(document).on("click", "#addbtn", function(e){
    e.preventDefault();
    var clone = $(".imgCont").eq(0).clone(true).appendTo("#imgwrap").show();
    //clone.reset();
});

$(document).on("click", ".rmimg", function(e){
    e.preventDefault();
    $(this).closest('div.row').remove();
});

$(document).ready(function() {
    $("#addbtn").click(function(e){
        e.preventDefault();
        $(".qualiconthd").eq(0).clone().appendTo("#qualiwrap").show();
        // $(".qualiconthd").clone().show().appendTo("#qualiwrap").stop();
    });

    $(".rmimg").click(function(e){
        e.preventDefault();
        console.log('buton is clicked');
        $(this).closest('.qualiconthd.row').remove();
    });
});



/*scroll to conenet*/

$("a.scroll-to-content").click(function (e) {
    $('html, body').animate({
        scrollTop: $('#scroll-target').offset().top
    }, 1000);
    e.preventDefault();
 });

jQuery(document).ready(function($) {
    $("li.dropdown a").click(function(e){
        $(this).next('ul.dropdown-menu').css("display", "block");
        e.stopPropagation();
    });
});

var prtnTr =$('.re-act')
prtnTr.click(function(){

    var activeTr = $(this).parents().find('~ .resend-tr').first();

    activeTr.slideToggle();

});