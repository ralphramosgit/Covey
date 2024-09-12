function readURL(input) {
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('.image-upload-wrap').hide();
  
        $('.file-upload-image').attr('src', e.target.result);
        $('.file-upload-content').show();
  
        $('.image-title').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload();
    }
  }
  
  function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
  }
  $('.image-upload-wrap').bind('dragover', function () {
          $('.image-upload-wrap').addClass('image-dropping');
      });
      $('.image-upload-wrap').bind('dragleave', function () {
          $('.image-upload-wrap').removeClass('image-dropping');
  });
  
  function chatBot() { 
      return {
          prompts: [
              ["hi", "hey", "hello"],
              ["what is COVID-19", "what is coronavirus", "what is covid", "what is corona"],
              ["what are the symtpoms"],
              ["what do I do if I have covid", "I have covid"],
              ["where can I get vaccinated", "vaccination spots"],
              ["What do I do if I get exposed"],
              ["How does a vaccine a work"],
              ["How many cases are there in Hawaii"],
              ["what are the covid travel guidelines"],
              ["what are the types of tests"],
              ["how long do I quaratnine for"],
              ["how do I stay safe"],
              ["how does the virus spread"],
              ["can you get covid twice"],
              ["can I still get covid even if I'm vaccinated"],
              ["what is considered close contact"],
              ["If I was wearing a mask, am I still considered close contact"],
              ["How many days does it take for symptoms appear"],
              ["What is the delta variant"],
              ["what is the omicron variant"],
              ["Where can I get tested"],
              ["is covid sexually transmitted"]
          ],
          replies: [
              ["Hello there", "Hi", "Hello", "Hi there", "Hi what are your questions about COVID-19?"],
              ["COVID-19 (coronavirus disease 2019) is a disease caused by a virus named SARS-CoV-2 and was discovered in December 2019 in Wuhan, China. It is very contagious and has quickly spread around the world."],
              ["Symptoms such as fever, chills, cough, lost of taste or smell, sore throat, and trouble breathing"],
              ["Stay home, isolate, get medical care, ask your healthcare provider for any help, take medicine such as acetminophen to feel better, rest well"],
              ["Walmart, Safeway, CVS, Queens Medical Center"],
              ["get tested, isolate, monitor symptoms"],
              ["Vaccines help develop immunity by imitating an infection"],
              ["https://health.hawaii.gov/coronavirusdisease2019/"],
              ["https://hawaiicovid19.com/travel/travel-overview/"],
              ["diagnostic and antibody "],
              ["Atleast 10 Days"],
              ["Wear Masks, Practice Cleanliness, keep distance, get vaccinated"],
              ["Through respiratory droplets from coughs or sneezes."],
              ["Yes"],
              ["Yes"],
              ["In 6 ft or less contact for atleast 15 mintues."],
              ["Yes"],
              ["2-14 days after exposure"],
              ["A more infectious COVID mutation and cause more sever illnesses"],
              ["A mutation slightly stronger than the delta"],
              ["You can test at locations such as Longs Drugs Pharmacies, Urgent Care Hawaii Ko Olina, Leeward Hawaii VA Clinic, Urgent Care  Hawaii, Waipahu Walgreens"],
              ["not enough evidence"]
          ],
          alternative: ["This Question cannot be answered yet", "I can't answer that question yet.", "I'm Unsure about that question.", "Ask another question", "Unable to Answer that question."],
          coronavirus: ["unsure about that", "check out cdc.gov"],
          botTyping: false,
          messages: [{
              from: 'bot',
              text: 'Hi I am COVEY, ask me questions about COVID-19'
          }],
          output: function(input) {
              let product;
  
              // Regex remove non word/space chars
              // Trim trailing whitespce
              // Remove digits - not sure if this is best
              // But solves problem of entering something like 'hi1'
  
              let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
              text = text
                  .replace(/ a /g, " ") // 'tell me a story' -> 'tell me story'
                  .replace(/i feel /g, "")
                  .replace(/whats/g, "what is")
                  .replace(/please /g, "")
                  .replace(/ please/g, "")
                  .replace(/r u/g, "are you");
  
              if (this.compare(this.prompts, this.replies, text)) {
                  // Search for exact match in `prompts`
                  product = this.compare(this.prompts, this.replies, text);
              } else if (text.match(/thank/gi)) {
                  product = "You're welcome!"
              } else if (text.match(/(corona|covid|virus)/gi)) {
                  // If no match, check if message contains `coronavirus`
                  product = this.coronavirus[Math.floor(Math.random() * this.coronavirus.length)];
              } else {
                  // If all else fails: random this.alternative
                  product = this.alternative[Math.floor(Math.random() * this.alternative.length)];
              }
  
              // Update DOM
              this.addChat(input, product);
          },
          compare: function(promptsArray, repliesArray, string) {
              let reply;
              let replyFound = false;
              for (let x = 0; x < promptsArray.length; x++) {
                  for (let y = 0; y < promptsArray[x].length; y++) {
                      if (promptsArray[x][y] === string) {
                          let replies = repliesArray[x];
                          reply = replies[Math.floor(Math.random() * replies.length)];
                          replyFound = true;
                          // Stop inner loop when input value matches this.prompts
                          break;
                      }
                  }
                  if (replyFound) {
                      // Stop outer loop when reply is found instead of interating through the entire array
                      break;
                  }
              }
              if (!reply) {
                  for (let x = 0; x < promptsArray.length; x++) {
                      for (let y = 0; y < promptsArray[x].length; y++) {
                          if (this.levenshtein(promptsArray[x][y], string) >= 0.75) {
                              let replies = repliesArray[x];
                              reply = replies[Math.floor(Math.random() * replies.length)];
                              replyFound = true;
                              // Stop inner loop when input value matches this.prompts
                              break;
                          }
                      }
                      if (replyFound) {
                          // Stop outer loop when reply is found instead of interating through the entire array
                          break;
                      }
                  }
              }
              return reply;
          },
          levenshtein: function(s1, s2) {
              var longer = s1;
              var shorter = s2;
              if (s1.length < s2.length) {
                  longer = s2;
                  shorter = s1;
              }
              var longerLength = longer.length;
              if (longerLength == 0) {
                  return 1.0;
              }
              return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
          },
          editDistance: function(s1, s2) {
              s1 = s1.toLowerCase();
              s2 = s2.toLowerCase();
  
              var costs = new Array();
              for (var i = 0; i <= s1.length; i++) {
                  var lastValue = i;
                  for (var j = 0; j <= s2.length; j++) {
                      if (i == 0)
                          costs[j] = j;
                      else {
                          if (j > 0) {
                              var newValue = costs[j - 1];
                              if (s1.charAt(i - 1) != s2.charAt(j - 1))
                                  newValue = Math.min(Math.min(newValue, lastValue),
                                      costs[j]) + 1;
                              costs[j - 1] = lastValue;
                              lastValue = newValue;
                          }
                      }
                  }
                  if (i > 0)
                      costs[s2.length] = lastValue;
              }
              return costs[s2.length];
          },
          addChat: function(input, product) {
  
              // Add user message
              this.messages.push({
                  from: 'user',
                  text: input
              });
  
              // Keep messages at most recent
              this.scrollChat();
  
              
              setTimeout(() => {
                  this.botTyping = true;
                  this.scrollChat();
              }, 10)
  
             //bot typing animation
              setTimeout(() => {
                  this.botTyping = false;
                  this.messages.push({
                      from: 'bot',
                      text: product
                  });
                  this.scrollChat();
              }, ((product.length / 10) * 110) + (Math.floor(Math.random() * 20) + 15))
  
          },
          scrollChat: function() {
              const messagesContainer = document.getElementById("messages");
              messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
              setTimeout(() => {
                  messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
              }, 100);
          },
          updateChat: function(target) {
              if (target.value.trim()) {
                  this.output(target.value.trim());
                  target.value = '';
              }
          }
      }
  }