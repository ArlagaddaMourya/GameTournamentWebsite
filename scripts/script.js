const lessons = {
  wordProcessing: {
    title: "Using Word Processing Tools",
    intro: "Learn how to create, format, and manage documents using tools like Word or Google Docs.",
    steps: [
      "Welcome! Let's explore how to use word processors like Microsoft Word or Google Docs.",
      "First, open your word processor and create a new document.",
      "Use the toolbar to apply bold, italics, or underline for emphasis.",
      "Insert elements like images, tables, and headers using the 'Insert' menu.",
      "Use alignment tools to center or justify text for cleaner formatting.",
      "Explore styles and templates for a more professional layout.",
      "Save documents regularly. In Google Docs, it's saved automatically.",
      "You can share the document with others by clicking 'Share' and setting permissions.",
      "You've now covered intermediate word processing features! 📝✅"
    ]
  },
  spreadsheets: {
    title: "Using Spreadsheets Effectively",
    intro: "Learn how to organize data and perform calculations using Excel or Google Sheets.",
    steps: [
      "Let’s dive into spreadsheets like Microsoft Excel or Google Sheets.",
      "Each cell can contain text, numbers, or formulas (like =SUM).",
      "Use rows for records and columns for fields to organize your data.",
      "Apply filters and sorting to make data easier to read.",
      "Try formulas like =AVERAGE(), =IF(), or =COUNTIF() to analyze data.",
      "Use charts to visualize trends — bar, pie, or line charts work well.",
      "Freeze rows or columns to keep headers visible while scrolling.",
      "Use conditional formatting to highlight key values automatically.",
      "Awesome job! You now understand intermediate spreadsheet skills. 📊✅"
    ]
  },
  email: {
    title: "Mastering Email Communication",
    intro: "Learn how to send, organize, and manage professional emails.",
    steps: [
      "Let’s learn how to use email effectively — whether Gmail, Outlook, or others.",
      "Compose a message with a clear subject and concise body.",
      "Use CC to copy others and BCC for private recipients.",
      "Attach files using the paperclip icon and check size limits.",
      "Organize messages into folders or labels to stay clutter-free.",
      "Use filters to automatically sort or tag incoming emails.",
      "Be cautious with links and attachments to avoid phishing.",
      "Set up a signature for a professional closing on every message.",
      "Now you're an intermediate email user. 📧💡"
    ]
  }
};

  
  let currentLesson = null;
  let currentStep = 0;
  
  const lessonTitle = document.getElementById("lesson-title");
  const lessonIntro = document.getElementById("lesson-intro");
  const chatWindow = document.getElementById("chat-window");
  const nextBtn = document.getElementById("next-step");
  
  function loadLesson(type) {
    currentLesson = lessons[type];
    currentStep = 0;
    lessonTitle.textContent = currentLesson.title;
    lessonIntro.textContent = currentLesson.intro;
    chatWindow.innerHTML = '';
    nextBtn.disabled = false;
    showStep();
  }
  
  function showStep() {
    if (currentStep < currentLesson.steps.length) {
      const msg = document.createElement("div");
      msg.className = "chat-bubble bot";
      msg.textContent = currentLesson.steps[currentStep];
      chatWindow.appendChild(msg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
  
      // 🗣️ Speak the message
      speakText(currentLesson.steps[currentStep]);
  
      currentStep++;
    } else {
      nextBtn.disabled = true;
    }
  }
  
  nextBtn.addEventListener("click", showStep);
  
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
    }
  }
  