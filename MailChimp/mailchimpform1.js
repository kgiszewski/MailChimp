//single quote remover
function encode(string){
    return  string.replace(/'/g, "%27");
}

$(function(){
    
    var $button=$(".button");
    
    var $loading=$("<img src='/css/images/ajax-loader.gif' style='float: left; padding-right: 5px;'/><span>Subscribing...</span>");
    $button.parent().append($loading);
    $loading.hide();
    
    $button.click(function(){
    
        //ajax loader
        $button.hide();
        $loading.show();
    
        var $name=$("#MERGE4");
        var $email=$("#MERGE0");
        var $company=$("#MERGE3");
        var $area=$("#MERGE5-area");
        var $prefix=$("#MERGE5-detail1");
        var $number=$("#MERGE5-detail2");
        var $companyType=$("#MERGE6");
        var $country=$("#MERGE7");
        var $emailType=$("#EMAILTYPE_HTML");
        
        var type=($emailType.is(":checked"))?"html":"text";
           
        var group="2013 End User Campaign";
        var list=1;
        
        var groups=[];
        $("#mergeRow-100-7853 input[type=checkbox]:checked").siblings('label').each(function(){
            groups.push($(this).text());
        });
           
        $.ajax({
            type: "POST",
            async: false,
            url: "/scripts/mailchimp/MailChimpService.asmx/ListSubscribe",
            //data: '{"email": "mickey@mouse.net", "email_type":"html", "listIndex": 1, "groupings":"{\'groupings\':[{\'key\': \'2013 End User Campaign\', \'value\':\'Golf Irrigation\'}]}", "merge_vars":"{\'merge_vars\':[{\'key\': \'MMERGE4\', \'value\':\'Mickey Mouse\'},{\'key\': \'MMERGE3\', \'value\':\'Franklin\'},{\'key\': \'MMERGE5\', \'value\':\'260-123-4560\'},{\'key\': \'MMERGE6\', \'value\':\'Dealer\'},{\'key\': \'MMERGE7\', \'value\':\'United States of America\'},{\'key\': \'MMERGE1\', \'value\':\'NW\'}]}"}',
            data: '{"email": \''+encode($email.val())+'\', "email_type":"'+type+'", "listIndex": '+list+', "groupings":"{\'groupings\':[{\'key\': \''+group+'\', \'value\':\''+encode(groups.join(','))+'\'}]}", "merge_vars":"{\'merge_vars\':[{\'key\': \'MMERGE4\', \'value\':\''+encode($name.val())+'\'},{\'key\': \'MMERGE3\', \'value\':\''+encode($company.val())+'\'},{\'key\': \'MMERGE5\', \'value\':\''+encode($area.val())+'-'+encode($prefix.val())+'-'+encode($number.val())+'\'},{\'key\': \'MMERGE6\', \'value\':\''+encode($companyType.val())+'\'},{\'key\': \'MMERGE7\', \'value\':\''+encode($country.val())+'\'},{\'key\': \'MMERGE1\', \'value\':\''+location.pathname+'\'}]}"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (returnValue){
              var response=returnValue.d;
              //console.log(response);
              
              switch(response.status){
                case 'SUCCESS':
                    $("#templateBody").html('Thank you for registering, you will receive a confirmation email shortly.');
                    break;
                    
                case 'ERROR':
                    $loading.hide();
                    $button.show();
                    alert(response.message);
                    break;
              }
            }
        });
    });
});

//below came from the mailchimp form
$(document).ready(function(){
    try {
        $(':input:visible:first').focus();
        $('#archive-list li:even').addClass("odd");
        $('.field-group, .field-group input, .field-group select').bind('click',function(event){
            if (event.type == 'click') {
                if ($(this).hasClass('field-group')){
                    var fg = $(this);
                    if($(this).children('.datefield').length == 1){
                        // Do not select 1st input so date picker will work.
                    } else {
                        $(this).find('input, select').slice(0,1).focus();
                    }
                } else {
                    var fg = $(this).parents('.field-group');
                    $(this).focus();
                }
                fg.not('.focused-field').addClass('focused-field').children('.field-help').slideDown('fast');
                $('.focused-field').not(fg).removeClass('focused-field').children('.field-help').slideUp('fast');
            }
            event.stopPropagation();
        });
        $('label').bind('click',function(event){
            if (event.type == 'click') {
                var fg = $(this).next();

                if(fg.children('.datefield').length == 1){
                    // Do not select 1st input so date picker will work.
                } else {
                    fg.find('input, select').slice(0,1).focus();
                }
                fg.not('.focused-field').addClass('focused-field').children('.field-help').slideDown('fast');
                $('.focused-field').not(fg).removeClass('focused-field').children('.field-help').slideUp('fast');
            }
            event.stopPropagation();
        });
        // Allow select inputs to be width:auto up to 500px (because max-width doesn't work in IE7)
        $("select").each(function(){
            $(this).css("width", "auto");
            if($(this).width() > 500){
                $(this).css("width", "500px");
            }
        });

    } catch(e){ console.log(e); }
});

//$(document).ready(function(){
    // try {
    //var domains =['hotmail.co.uk','yahoo.co.uk','yahoo.com.tw','yahoo.com.au','yahoo.com.mx','gmail.com','hotmail.com','yahoo.com','aol.com','comcast.net','msn.com','seznam.cz','sbcglobal.net','live.com','bellsouth.net','hotmail.fr','verizon.net','mail.ru','btinternet.com','cox.net','yahoo.com.br','bigpond.com','att.net','yahoo.fr','mac.com','ymail.com','googlemail.com','earthlink.net','xtra.co.nz','me.com','yahoo.gr','walla.com','yahoo.es','charter.net','shaw.ca','live.nl','yahoo.ca','orange.fr','optonline.net','gmx.de','wanadoo.fr','optusnet.com.au','rogers.com','web.de','ntlworld.com','juno.com','yahoo.com.sg','rocketmail.com','yandex.ru','yahoo.co.in','centrum.cz','live.co.uk','sympatico.ca','libero.it','walla.co.il','bigpond.net.au','yahoo.com.hk','ig.com.br','live.com.au','free.fr','sky.com','uol.com.br','abv.bg','live.fr','terra.com.br','hotmail.it','tiscali.co.uk','rediffmail.com','aim.com','blueyonder.co.uk','telus.net','bol.com.br','hotmail.es','email.cz','windowslive.com','talktalk.net','home.nl','t-online.de','yahoo.de','telenet.be','163.com','embarqmail.com','windstream.net','roadrunner.com','bluewin.ch','skynet.be','laposte.net','yahoo.it','qq.com','live.dk','planet.nl','hetnet.nl','gmx.net','mindspring.com','rambler.ru','iinet.net.au','eircom.net','yahoo.com.ar','wp.pl','mail.com'];
    // var tdomains = [];
    // $('#MERGE0').on('blur', function() {
      // $(this).mailcheck({
        // domains: domains,
        // topLevelDomains: tdomains,
        // suggested: function(element, suggestion) {
            // var msg = 'Hmm, did you mean '+suggestion.full+'?';
            // if ( $('#MERGE0_mailcheck').length > 0 ){
                // $('#MERGE0_mailcheck').html(msg);
            // } else {
                // element.after('<div id="MERGE0_mailcheck" class="errorText">'+msg+'</div>');
            // }
        // },
        // empty: function(element) {
            // if ( $('#MERGE0_mailcheck').length > 0 ){
                // $('#MERGE0_mailcheck').remove();
            // }
          // return;
        // }
      // });
    // });
    // } catch(e){ console.log(e); }
// });