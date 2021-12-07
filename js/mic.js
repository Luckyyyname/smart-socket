let micIcon = document.getElementById("micIcon");
let micBox = document.getElementById("micBox");
let returnChart = document.getElementById("returnChart");

returnChart.onclick = function(){
    micBox.style.display = "none";
}


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

let resultPara = document.querySelector('.result');
let diagnosticPara = document.querySelector('.output');
let micBtn = document.getElementById("record-btn");
let micBtnPara = micBtn.getElementsByTagName("p")[0];

micIcon.onclick = function(){
  micBox.style.display = "block";
  diagnosticPara.textContent = "...语音识别结果";
  diagnosticPara.style.background = "#ffffff";
  resultPara.textContent = "";
  resultPara.style.background = "#ffffff";
}

function testSpeech() {
  micBtn.disabled = true;
  micBtn.classList.add("ripple");
  micBtnPara.textContent = '录音中';

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'cmn-Hans-CN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {

    micBtn.classList.remove("ripple");
    var speechResult = event.results[0][0].transcript;
    diagnosticPara.textContent = 'Speech received: ' + speechResult;
      
    let isclose = /\u5173/.test(speechResult);
    let isopen = /\u5f00/.test(speechResult);
    if(isclose){
      if(nowCurrent === 0){
        resultPara.textContent = '插座已经是关闭状态，请重试！';
        resultPara.style.color = 'red';
      }else{
        //ajax发送关闭请求
        $.ajax({
            'url':"http://localhost:8080/chart/change",
            'type':'GET',
            'dataType':'json',
            'success':function(res){
                console.log("开关控制请求成功发送!")
            },
            'error':function(){
              resultPara.textContent = '服务器请求超时，请重试！';
              resultPara.style.color = 'red';
            }
        });

        resultPara.textContent = "插座已关闭！";
        resultPara.style.color = '#2aaa65';
      }
    }else if(isopen){
      if(nowCurrent !== 0){
        resultPara.textContent = '插座已经是开启状态，请重试！';
        resultPara.style.color = 'red';
      }else{
        //ajax发送开启请求
        $.ajax({
            'url':"http://localhost:8080/chart/change",
            'type':'GET',
            'dataType':'json',
            'success':function(res){
                console.log("开关控制请求成功发送!")
            },
            'error':function(){
                resultPara.textContent = '服务器请求超时，请重试！';
                resultPara.style.color = 'red';
            }
        });

        resultPara.textContent = "插座已开启！";
        resultPara.style.color = '#2aaa65';
      }
    }else {
      resultPara.textContent = '未识别到控制插座词汇，请重试！';
      resultPara.style.color = 'red';
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }


  recognition.onspeechend = function() {
    recognition.stop();
    micBtn.disabled = false;
    micBtnPara.textContent = '点击录音';
  }

  recognition.onerror = function(event) {
    micBtn.disabled = false;
    micBtnPara.textContent = '点击录音';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

micBtn.addEventListener('click', testSpeech);
