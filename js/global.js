$(window).load(function () {
  $("#addSenderInfo").click(function () {
    var facebookUID = $("#senderId").val().replace(/^(.*?)(facebook\.|$)/i, "").replace(/^(.*?)(\/|$)/, "").replace(/profile\.php\?id\=/i, "").match(/^(.*?)(?=\/|\&|$)/)[0];
    $.getJSON("http://graph.facebook.com/" + facebookUID,
      function (data) {
        $.each(data, function (key, val) {
          if (key == "id") {
            var src = "http://graph.facebook.com/" + val + "/picture?type=square";
            $("#senderImg").val(src);
            $("#profilePic").prop("src", src);
          } else if (key == "name") {
            $("#senderName").val(val);
            $("#senderNameSpan").html(val);
            $("#senderNameSpan2").html(val);
          }
        });
        $("#senderMsg").focus();
      });
  });
  $("#blurCheck").click(function (e) {
    if ($(this).is(":checked")) {
      $("#senderNameSpan").addClass("blur");
      $("#conversation img").each(function () {
        $(this).addClass("blur");
      });
    } else {
        $("#senderNameSpan").removeClass("blur");
        $("#conversation img").each(function () {
          $(this).removeClass("blur");
        });
    }
  });
  $("#senderName").keyup(function () {
    $("#senderNameSpan").html(encodeHTML(this.value));
    $("#senderNameSpan2").html(encodeHTML(this.value));
  });
  $("#senderMsg").keyup(function (e) {
    if (e.which == 13 && $("#sendOnReturn").is(":checked")) {
      sendSenderMsg();
    } else if (!($(this).val().length) && $("#typing-msg").length) {
      $("#conversation .bubble:last").remove();
    }
  });
  $("#senderMsg").keydown(function () {
    if ($("#typing-msg").length) return 0;
    var blurClass = ($("#blurCheck").is(":checked")) ? "class='blur'" : "";
    var img = ($("#senderImg").val().length > 1) ? encodeHTML($("#senderImg").val()) : "img/pic.jpg";
    var msg = $("<div class='bubble'><img height='32' width='32' src='" + img + "'" + blurClass + "/><div class='left'><div id='typing-msg' class='senderTyping'></div><div></div>");
    msg.insertBefore($("#conversationSpacer"));
    scrollToBottom();
  });
  $("#msgBox").keyup(function (e) {
    if (e.which == 13) {
      if (!($(this).val().length > 1)) {
        $(this).val("");
        return 0;
      }
      var msg = $("<div class='bubble'><div class='right'><div class='me noborders'>" + encodeHTML(this.value) + "</div></div></div>");
      $(this).val("");
      if ($("#typing-msg").length) {
        msg.insertBefore($("#conversation .bubble:last"));
      } else {
        msg.insertBefore($("#conversationSpacer"));
      }
      scrollToBottom();
    }
  });
  function sendSenderMsg() {
    if (!($("#senderMsg").val().length)) return 0;
    var blurClass = ($("#blurCheck").is(":checked")) ? "class='blur'" : "";
    var msg = $("<div class='sender noborders'>" + encodeHTML($("#senderMsg").val()) + "</div>");
    msg.insertBefore($("#typing-msg"));
    $("#typing-msg").remove();
    $("#senderMsg").val("");
    scrollToBottom();
    $("#msgBox").focus();
  }
  $("#addSenderMsg").click(function () {
    sendSenderMsg();
  });
  $("#addDateStamp").click(function () {
    var msg = $("<div class='date'><span>" + encodeHTML($("#dateStamp").val()) + "</span></div>");
    msg.insertBefore($("#conversationSpacer"));
    scrollToBottom();
  });
  $("input[name='statusRadio']").change(function () {
    switch ($(this).val()) {
      case '0':
        $("#status").removeClass("mobile");
        $("#status").removeClass("online");
        break;
      case '1':
        $("#status").removeClass("mobile");
        $("#status").addClass("online");
        break;
      case '2':
        $("#status").removeClass("online");
        $("#status").addClass("mobile");
        break;
      default:
        break;
    };
  });
  function scrollToBottom() {
    var container = $("#conversation"), scrollTo = $("#conversationSpacer");
    container.animate({scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()});
  }
  var map = {
    "&": "&amp;",
    "'": "&#39;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;"
  };
  function encodeHTML(el) {
    return el.replace(/[&"'\<\>]/g, function(c){return map[c];});
  }
  $("#chatWindow").draggable();
  $("#popularUsers li > a").click(function () {
    $("#senderId").val($(this).prop("title"));
    $("#addSenderInfo").click();
  });
});