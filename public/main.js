$(()=>{
  const FADE_TIME = 150;
  const TYPING_TIMER_LENGTH = 400;
  const COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // 定数を初期化
  const $window = $(window);
  const $usernameInput = $(".usernameInput");
  const $messages = $(".messages");
  const $inputMessage = $(".inputMessage");

  const $loginPage = $(".login.page")
  const $chatPage = $(".chat.page");

  // 変数を初期化
  let username;
  let connected = false;
  let typing = false;
  let lastTypingTime;
  let $currentInput = $usernameInput.focus();

  const socket = io();

  // ログイン
  $window.keydown(event => {
    if(!(event.ctrlKey || event.metaKey || event.altKey)){
      $currentInput.focus();
    }
    if(event.which === 13){
      if(username){
        sendMessage();
        socket.emit("stop typing");
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  socket.on("login",data => {
    connected = true;
    const message = "Welcome to Socket.IO Chat -";
    log(message,{
      prepend: true
    });
    addParticipantsMessage(data);
  })

  $inputMessage.on("input",()=>{
    updateTyping();
  });

  $loginPage.click(()=>{
    $inputMessage.focus();
  })

  socket.on("new message",data=>{
    addChatMessage(data);
  })

  socket.on('user joined', (data) => {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });
  socket.on('user left', (data) => {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  socket.on('typing', (data) => {
    addChatTyping(data);
  });

  socket.on('stop typing', (data) => {
    removeChatTyping(data);
  });

  // Socket.IOが自動で発生させるイベント
  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  // Socket.IOが自動で発生させるイベント
  socket.on('reconnect', () => {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  // Socket.IOが自動で発生させるイベント
  socket.on('reconnect_error', () => {
    log('attempt to reconnect has failed');
  });


  function setUsername () {
    // <script>をエスケープ
    username = cleanInput($usernameInput.val().trim());
    if(username){
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off("click");
      $currentInput = $inputMessage.focus();
      // serverではsocket.usernameに登録される
      socket.emit("add user",username);
    }
  }

  function sendMessage () {
    let message = $inputMessage.val();
    // <script>をエスケープ
    message = cleanInput(message);
    if(message && connected){
      $inputMessage.val("");
      addChatMessage({
        username: username,
        message: message
      });
      socket.emit("new message",message);
    }
  }

  // <script>などをtext()でテキスト化しエスケープ
  function cleanInput (input) {
    return $("<div>").text(input).html();
  }

  function log (message,options){
    const $el = $("<li>").addClass("log").text(message);
    addMessageElement($el,options);
  }
  
  function addMessageElement (el,options = {fade:true,prepend:false}){
    const $el = $(el);
    if(options.fade){
      $el.hide().fadeIn(FADE_TIME);
    }
    if(options.prepend){
      $messages.prepend($el);
    }else{
      $messages.append($el);
    }
    // 増えたメッセージ分スクロールさせる
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  function addParticipantsMessage(data){
    let message = "";
    if(data.numUsers===1){
      message += "there's 1 participant";
    }else{
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  function addChatMessage (data,options = {fade:true,prepend:false}){
    const $typingMessages = getTypingMessages(data);
    // 送信した内容をフォームから削除
    if($typingMessages.length !== 0){
      options.fade = false;
      $typingMessages.remove();
    }
    const $usernameDiv = $("<span class='username' />")
      .text(data.username)
      .css("color",getUsernameColor(data.username));
    const $messageBodyDiv = $("<span class='messageBody' />")
      .text(data.message);
    const typingClass = data.typing ? "typing" : "";

    const $messageDiv = $("<li class='message' />")
      .data("username",data.username)
      .addClass(typingClass)
      .append($usernameDiv,$messageBodyDiv);

    addMessageElement($messageDiv,options);

  }

  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // 「〇〇が入力中」というメッセージがある場合にその本人かどうか
  function getTypingMessages (data) {

    // メッセージのliを追加時にdataでユーザー名を設定している
    return $(".typing.message").filter(function (i) {
      return $(this).data("username") === data.username;
    })
  }

  function updateTyping () {
    if(connected){
      if(!typing){
        typing = true;
        socket.emit("typing");
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(()=>{
        const typingTimer = (new Date()).getTime();
        const timeDiff = typingTimer -lastTypingTime;
        if(timeDiff >= TYPING_TIMER_LENGTH && typing){
          socket.emit("stop typing");
          typing = false;
        }
      },TYPING_TIMER_LENGTH);
    }
  }

  function addChatTyping (data) {
    data.typing = true;
    data.message = "が入力中…";
    addChatMessage(data);
  }

  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }
})