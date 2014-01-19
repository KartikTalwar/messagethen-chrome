$(function() {
  var $textbox = $('[placeholder="Write a reply..."]');
  var $container = $textbox.parent().parent().parent().parent().parent();
  var $emoticons = $container.find('.emoticonsPanel').parent();

  var sendlater = '<label class="_1ri uiButton uiButtonConfirm"><input value="Send Later" type="button" class="sendlater _5f0v" tabindex=""></label>';
  $emoticons.prepend(sendlater);


  var sl = function(e) {

    var openSendlater = function() {
      var picker = "<input placeholder='Message when?' type='text' id='when'>";
      $emoticons.prepend(picker);
      
      $('#when').intimidatetime({
        format: 'u',
        previewFormat: 'yyyy-MM-dd HH:mm:ss'
      })
      $('#when')[0].click();  // hack

      var n = window.location.toString().lastIndexOf('/');
      var url = "https://graph.facebook.com/" + window.location.toString().substring(n + 1);
      
      var messagethen = '<label class="_1ri uiButton uiButtonConfirm"><input id="messagethen" value="Message Then" type="button" class="_5f0v" tabindex=""></label>';
      $emoticons.find('._1ri').replaceWith(messagethen);

      $('#messagethen').on('click', function(e) {
        // get fb id of recipient
        $.getJSON(url, function(data) {
          var name = data.name;
          var message = $textbox.val();
          var accessToken = localStorage.getItem("accessToken");
          var when = $('#when').val(); // in epochs

          var data = {"name": name, "message": message, "token": accessToken, "when": when};

          $.post('http://messagethen.com/post', data, function(r) {
            $textbox.val('');
            $emoticons.find('._1ri').replaceWith(sendlater);
            $emoticons.find('#when').remove();
            $('.sendlater').on('click', sl);
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
