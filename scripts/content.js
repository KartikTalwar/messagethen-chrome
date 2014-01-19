var DEFAULT_MINUTES = 1;

// 2014-01-19T02:21:46.761Z
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  console.log(local.toJSON());
  return local.toJSON().slice(0,10);
});

Date.prototype.toTimeInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset() + DEFAULT_MINUTES);
  return local.toJSON().slice(11,16);
});

$(function() {
  var $textbox = $('[placeholder="Write a reply..."]');
  var $container = $textbox.parent().parent().parent().parent().parent();
  var $emoticons = $container.find('.emoticonsPanel').parent();

  var sendlater = '<label class="_1ri uiButton uiButtonConfirm"><input value="Send Later" type="button" class="sendlater _5f0v" tabindex=""></label>';
  $emoticons.prepend(sendlater);

  // open sendlater calendar or login to FB
  var sl = function(e) {

    // open calendar view
    var openSendlater = function() {
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
        $('#messagethen').addClass('green');
        $('#messagethen').val('Sending...');

        var n = window.location.toString().lastIndexOf('/');
        var url = "https://graph.facebook.com/" + window.location.toString().substring(n + 1);
        // get fb id of recipient
        $.getJSON(url, function(data) {
          var name = data.name;
          var message = $textbox.val();
          var accessToken = localStorage.getItem("accessToken");
          var when = "" + moment($('#date').val() + " " + $('#time').val()).unix();
          console.log(when);

          var data = {"name": name, "message": message, "token": accessToken, "when": when};

          $.post('http://messagethen.com/post', data, function(r) {
            $textbox.val('');
            $emoticons.find('.calendar').remove();

            $('#messagethen').val('Scheduled!');
            setTimeout(function() {
              $emoticons.find('._1ri').replaceWith(sendlater);
              $('.sendlater').on('click', sl);
            }, 1800);

          });
        });
      });
    };

    // check if we have the token
    if (!localStorage.getItem("accessToken")) {
      window.open("https://www.facebook.com/dialog/oauth?scope=email,xmpp_login,user_friends&client_id=232553663582896&redirect_uri=http://messagethen.com/auth/", '', 'width=900,height=600');
      function receiveMessage(e) {
        localStorage.setItem('accessToken', e.data.accessToken);
        openSendlater();
      }
      window.addEventListener("message", receiveMessage, false);
    } else {
      openSendlater();
    }
  };

  $('.sendlater').on('click', sl);
});
