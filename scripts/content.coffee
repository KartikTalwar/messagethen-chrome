console.log "loading"

$ ->
  console.log "loaded"

  # this class doesn't always exist
  console.log $('._1r-').html()

  $('._1r-').children().append('<label class="_1ri uiButton uiButtonConfirm" for="u_0_1e" id="js_2"><input value="Send Later" type="submit" id="u_0_1e" class="_5f0v" tabindex=""></label>')
