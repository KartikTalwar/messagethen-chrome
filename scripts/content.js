var DEFAULT_MINUTES = 1;

// 2014-01-19T02:21:46.761Z
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

Date.prototype.toTimeInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset() + DEFAULT_MINUTES);
  return local.toJSON().slice(11,16);
});

$(document).ready(function() {
  window.onmessage = function(e) {
    console.log(e.data);
    store('accessToken', e.data.accessToken);
    openSendlater();
  }

  var $textbox = $('[placeholder="Write a reply..."]');
  var $container = $textbox.parent().parent().parent().parent().parent();
  var $emoticons = $container.find('.emoticonsPanel').parent();

  var sendlater = '<label class="_1ri uiButton uiButtonConfirm"><input value="Send Later" type="button" class="sendlater _5f0v" tabindex=""></label>';
  $emoticons.prepend(sendlater);

  // open calendar view
  function openSendlater() {
    var calendar = "<ul class='calendar'>" +
                     "<li><input id='date' type='date'></li>" +
                     "<li><input id='time' type='time'></li>" +
                     "<li><strong id='when'></strong></li>" +
                   "</ul>";

    $emoticons.prepend(calendar);

    // default date to today
    $('[type=date]').val(new Date().toDateInputValue());
    $('[type=time]').val(new Date().toTimeInputValue());

    var updateTime = function() {
      var date = $('#date').val();
      var time = $('#time').val();
      
      var day = moment(date + " " + time);
      $('#when').text(day.calendar());
    };
    updateTime();
    $('.calendar input').on('change', updateTime);

    var messagethen = '<label class="_1ri uiButton uiButtonConfirm"><input id="messagethen" value="Message Then" type="button" class="_5f0v" tabindex=""></label>';
    $emoticons.find('._1ri').replaceWith(messagethen);

    $('#messagethen').on('click', function(e) {
      $('#messagethen').val('Sending...');

      var id = window.location.toString().match(/facebook\.com\/messages\/(.*)/)[1];
      var url = "https://graph.facebook.com/" + id + "?fields=name;
      // get fb id of recipient
      $.getJSON(url, function(data) {
        var name = data.name;
        var message = $textbox.val();
        var accessToken = store("accessToken");
        var when = "" + moment($('#date').val() + " " + $('#time').val()).unix();

        var data = {
          name: name
          message: message,
          token: accessToken,
          when: when
        };

        $.post('http://messagethen.com/post', data, function(r) {
          $textbox.val('');
          $emoticons.find('.calendar').remove();

          $('#messagethen').val('Scheduled!');
          setTimeout(function() {
            $emoticons.find('._1ri').replaceWith(sendlater);
            $('.sendlater').on('click', sl);
          }, 1700);
        });
      });
    });
  };

  // open sendlater calendar or login to FB
  function sl(e) {
    // check if we have the token
    if (store("accessToken")) {
      openSendlater();
    } else {
      window.open("https://www.facebook.com/dialog/oauth?scope=email,xmpp_login,user_friends&client_id=232553663582896&redirect_uri=http://messagethen.com/auth/", '', 'width=900,height=600');
    }
  };

  $('.sendlater').on('click', sl);

  var sendlatertab = '<div class="sendlatertab uiToggle emoticonsPanel">' +
                        '<a class="_5r8g" tabindex="0" rel="toggle" role="button">' +
                            '<i class="emoteTogglerImg img sp_c29spt sx_abf388"></i></a></div>';

  var $target = $('#ChatTabsPagelet .fbNubGroup.clearfix .fbNubGroup.clearfix');
  var $tabs = $target.children();
  $tabs.each(function(i, tab) {
    var $icons = $(tab).find('._552n');
    $icons.prepend(sendlatertab);
  });
  var observer = new WebKitMutationObserver(function(mutations) {
    // only need to add a button when a tab is created
    // ignore the case that a tab was destroyed
    if ($target.children().length > $tabs.length) {
      var $icons = $target.children(':first').find('._552n');
      $icons.prepend(sendlatertab);
    }
    $tabs = $target.children(); // reset tabs
  });

  observer.observe($target[0], {childList: true, attributes: true});

  // attach event handler
  $target.delegate('.sendlatertab', 'click', function() {
    console.log("clicked this bitch");
  });
});
