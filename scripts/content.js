$(function() {
  console.log($('._1r-').html());

  $('._1r-').children().append('<label class="_1ri uiButton uiButtonConfirm"><input id="sendlater" value="Send Later" type="button" class="_5f0v" tabindex=""></label>');

  $('#sendlater').on('click', function(e) {
    if (!localStorage.getItem("accessToken")) {
      window.open("https://www.facebook.com/dialog/oauth?scope=email,xmpp_login,user_friends&client_id=232553663582896&redirect_uri=http://messagethen.com/auth/", '', 'width=900,height=600');

      function receiveMessage(e) {
        console.log(e.data);
        localStorage.setItem('accessToken', e.data.accessToken);

        var $textbox = $('[placeholder="Write a reply..."]');
        var message = $textbox.val();
        // var recipient = $textbox.
        console.log(message);
      }

      window.addEventListener("message", receiveMessage, false);

    } else {
      // open the time selector
      console.log("open the things");
    }
  });
});
