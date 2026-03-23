// Dialogue-based sentence generator with Chinese translations
// Each template is a short 2-3 line conversation using today's vocabulary

const { classifyNoun } = require('../data/noun-categories');

// Word dialogue templates - categorized by part of speech
const verbDialogues = [
  {
    lines: [
      { speaker: 'A', text: 'What are you going to do this weekend?', zh: '你這個週末要做什麼？' },
      { speaker: 'B', text: "I'm planning to {word} with my friends.", zh: '我打算跟朋友一起{word}。' },
      { speaker: 'A', text: 'Sounds fun! Can I join?', zh: '聽起來很好玩！我可以一起嗎？' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Could you help me {word} this?", zh: '你可以幫我{word}這個嗎？' },
      { speaker: 'B', text: "Sure, let me take a look.", zh: '當然，讓我看看。' },
      { speaker: 'A', text: "Thanks, I really appreciate it.", zh: '謝謝，真的很感激。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Did you {word} the report yesterday?", zh: '你昨天有{word}報告嗎？' },
      { speaker: 'B', text: "Not yet. I'll {word} it today for sure.", zh: '還沒。我今天一定會{word}。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I forgot to {word} before I left.", zh: '我離開前忘了{word}。' },
      { speaker: 'B', text: "Don't worry, I already did it for you.", zh: '別擔心，我已經幫你做了。' },
      { speaker: 'A', text: "You're a lifesaver!", zh: '你是我的救星！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "My boss asked me to {word} the whole thing by Friday.", zh: '我老闆要我在週五前{word}完所有東西。' },
      { speaker: 'B', text: "That's a tight deadline. Need any help?", zh: '時間很緊耶。需要幫忙嗎？' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you {word} a little faster? We're running late.", zh: '你可以{word}快一點嗎？我們快遲到了。' },
      { speaker: 'B', text: "I'm trying! Give me two more minutes.", zh: '我在努力了！再給我兩分鐘。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I don't know how to {word} this machine.", zh: '我不知道怎麼{word}這台機器。' },
      { speaker: 'B', text: "Just press the green button. It's easy.", zh: '按綠色按鈕就好。很簡單。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "She told me to {word} right away.", zh: '她叫我馬上{word}。' },
      { speaker: 'B', text: "Then you'd better hurry up!", zh: '那你最好趕快！' },
    ]
  },
];

// Noun dialogue templates - categorized by semantic subcategory
const personDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Have you met the new {word}?", zh: '你有見過新來的{word}嗎？' },
      { speaker: 'B', text: "Not yet. I heard they're really nice.", zh: '還沒耶。聽說人很好。' },
      { speaker: 'A', text: "Let me introduce you later.", zh: '等等我介紹你們認識。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} called while you were out.", zh: '{word}在你不在的時候打來了。' },
      { speaker: 'B', text: "Oh, I should call back. Thanks for letting me know.", zh: '噢，我應該回電。謝謝你告訴我。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "My {word} is coming to visit next week.", zh: '我的{word}下週要來。' },
      { speaker: 'B', text: "That's exciting! We should plan something fun.", zh: '太好了！我們來安排一些好玩的。' },
      { speaker: 'A', text: "Good idea. Any suggestions?", zh: '好主意。你有建議嗎？' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I need to see the {word} today.", zh: '我今天需要見{word}。' },
      { speaker: 'B', text: "I think they're available after lunch.", zh: '我想午餐後有空。' },
    ]
  },
];

const bodyDialogues = [
  {
    lines: [
      { speaker: 'A', text: "My {word} has been hurting lately.", zh: '我的{word}最近一直痛。' },
      { speaker: 'B', text: "You should see a doctor about that.", zh: '你應該去看醫生。' },
      { speaker: 'A', text: "Yeah, I'll make an appointment.", zh: '好，我來預約。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Be careful with your {word}!", zh: '小心你的{word}！' },
      { speaker: 'B', text: "Don't worry, I'll be fine.", zh: '別擔心，我會沒事的。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The doctor said my {word} looks normal.", zh: '醫生說我的{word}看起來正常。' },
      { speaker: 'B', text: "That's a relief! I'm glad to hear it.", zh: '太好了！真是鬆了一口氣。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I bumped my {word} on the table.", zh: '我的{word}撞到桌子了。' },
      { speaker: 'B', text: "Ouch! Put some ice on it.", zh: '好痛！冰敷一下吧。' },
      { speaker: 'A', text: "Good idea. Thanks.", zh: '好主意。謝啦。' },
    ]
  },
];

// Food dialogue templates — must work for ingredients, meals, dishes, and drinks
const foodDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Would you like some {word}?", zh: '你要來一點{word}嗎？' },
      { speaker: 'B', text: "Yes, please! I'm starving.", zh: '好啊！我快餓死了。' },
      { speaker: 'A', text: "Help yourself. There's plenty.", zh: '自己來。還有很多。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Have you ever tried {word}?", zh: '你有吃過{word}嗎？' },
      { speaker: 'B', text: "Yes, I love it! It's one of my favorites.", zh: '有啊，我超愛的！是我的最愛之一。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "What do you think about {word}?", zh: '你覺得{word}怎麼樣？' },
      { speaker: 'B', text: "I like it a lot! It's one of my favorites.", zh: '我很喜歡！是我的最愛之一。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I'm craving {word} right now.", zh: '我現在好想吃{word}。' },
      { speaker: 'B', text: "Me too! Let's go get some.", zh: '我也是！我們去買吧。' },
      { speaker: 'A', text: "There's a good place nearby.", zh: '附近有一間不錯的。' },
    ]
  },
];

const animalDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Did you see that {word} outside?", zh: '你有看到外面那隻{word}嗎？' },
      { speaker: 'B', text: "Yes! It was so cute.", zh: '有啊！好可愛。' },
      { speaker: 'A', text: "I wanted to take a picture, but it ran away.", zh: '我想拍照，但牠跑掉了。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "My neighbor has a {word}.", zh: '我鄰居有一隻{word}。' },
      { speaker: 'B', text: "Really? I've always wanted one too!", zh: '真的嗎？我也一直想養一隻！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Look! There's a {word} over there!", zh: '看！那邊有一隻{word}！' },
      { speaker: 'B', text: "Where? Oh, I see it! How cool!", zh: '哪裡？噢，我看到了！好酷！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I learned something interesting about {word}s today.", zh: '我今天學到一個關於{word}的有趣知識。' },
      { speaker: 'B', text: "Oh really? Tell me about it!", zh: '真的嗎？跟我說說！' },
    ]
  },
];

// Nature dialogue templates — must work for weather, disasters, geography, and ecology
const natureDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Did you learn about {word} in school?", zh: '你在學校有學過{word}嗎？' },
      { speaker: 'B', text: "Yes, it was really interesting. Nature is amazing.", zh: '有，真的很有趣。大自然很神奇。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I saw a documentary about {word} last night.", zh: '我昨晚看了一部關於{word}的紀錄片。' },
      { speaker: 'B', text: "Really? Was it good?", zh: '真的嗎？好看嗎？' },
      { speaker: 'A', text: "Yes! I learned a lot. You should watch it.", zh: '很好看！我學了很多。你也應該看。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Have you ever seen a {word} in real life?", zh: '你有在現實生活中見過{word}嗎？' },
      { speaker: 'B', text: "No, only in photos. It must be impressive.", zh: '沒有，只看過照片。一定很壯觀。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The news said there might be a {word} this week.", zh: '新聞說這週可能會有{word}。' },
      { speaker: 'B', text: "We should be prepared just in case.", zh: '我們以防萬一先準備好。' },
      { speaker: 'A', text: "Good idea. Better safe than sorry.", zh: '好主意。小心為上。' },
    ]
  },
];

const placeDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Have you been to that {word} nearby?", zh: '你有去過附近那個{word}嗎？' },
      { speaker: 'B', text: "Yes, it's really nice. You should go.", zh: '有啊，很不錯。你應該去看看。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Let's meet at the {word} at three.", zh: '我們三點在{word}碰面吧。' },
      { speaker: 'B', text: "Sounds good. See you there!", zh: '好啊。到時候見！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} is so crowded today.", zh: '{word}今天好多人。' },
      { speaker: 'B', text: "Yeah, maybe we should come back later.", zh: '對啊，也許晚一點再來。' },
      { speaker: 'A', text: "Good idea. Let's grab lunch first.", zh: '好主意。先去吃飯吧。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Excuse me, how do I get to the {word}?", zh: '不好意思，請問{word}怎麼走？' },
      { speaker: 'B', text: "Go straight and turn right. It's about five minutes.", zh: '直走然後右轉。大約五分鐘。' },
      { speaker: 'A', text: "Thank you so much!", zh: '非常感謝！' },
    ]
  },
];

const objectDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Have you seen my {word}?", zh: '你有看到我的{word}嗎？' },
      { speaker: 'B', text: "I think it's on the kitchen table.", zh: '我覺得在廚房桌上。' },
      { speaker: 'A', text: "Oh, there it is. Thanks!", zh: '噢，在那裡。謝啦！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "How much is this {word}?", zh: '這個{word}多少錢？' },
      { speaker: 'B', text: "It's on sale — only ten dollars.", zh: '正在特價——只要十塊。' },
      { speaker: 'A', text: "Great, I'll take it!", zh: '太好了，我買了！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "What's your favorite {word}?", zh: '你最喜歡的{word}是什麼？' },
      { speaker: 'B', text: "Hmm, that's a tough question. I like all of them.", zh: '嗯，好難選。我每個都喜歡。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Excuse me, where can I find the {word}?", zh: '不好意思，請問{word}在哪裡？' },
      { speaker: 'B', text: "Go straight and turn left. You can't miss it.", zh: '直走然後左轉，你不會錯過的。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} is broken again!", zh: '{word}又壞了！' },
      { speaker: 'B', text: "We should probably get a new one.", zh: '我們或許該買個新的了。' },
      { speaker: 'A', text: "Yeah, this one is too old.", zh: '對啊，這個太舊了。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I brought a {word} for the party.", zh: '我帶了一個{word}來派對。' },
      { speaker: 'B', text: "Nice! Everyone's going to love it.", zh: '讚！大家一定會喜歡。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "This {word} looks different from the one we ordered.", zh: '這個{word}跟我們訂的不一樣。' },
      { speaker: 'B', text: "Let me check the receipt... You're right, they made a mistake.", zh: '我看一下收據⋯你說得對，他們搞錯了。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Do we need another {word}?", zh: '我們還需要再一個{word}嗎？' },
      { speaker: 'B', text: "No, we have enough. Don't waste money.", zh: '不用了，夠了。別浪費錢。' },
    ]
  },
];

const workDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Have you finished the {word} yet?", zh: '你完成{word}了嗎？' },
      { speaker: 'B', text: "Almost. I need a few more hours.", zh: '快了。我還需要幾個小時。' },
      { speaker: 'A', text: "No rush. Just make sure it's done by Friday.", zh: '不急。週五前完成就好。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "There's a problem with the {word}.", zh: '{word}有問題。' },
      { speaker: 'B', text: "Really? Let me take a look.", zh: '真的嗎？我來看看。' },
      { speaker: 'A', text: "Thanks. I'll send you the details.", zh: '謝謝。我把細節寄給你。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} needs to be updated before the meeting.", zh: '開會之前{word}需要更新。' },
      { speaker: 'B', text: "I'll handle it right away.", zh: '我馬上處理。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you explain this {word} to me?", zh: '你可以跟我解釋一下這個{word}嗎？' },
      { speaker: 'B', text: "Sure. Let me walk you through it.", zh: '當然。我來跟你說明。' },
      { speaker: 'A', text: "Great, that really helps.", zh: '太好了，這真的很有幫助。' },
    ]
  },
];

const abstractDialogues = [
  {
    lines: [
      { speaker: 'A', text: 'Do you understand the concept of "{word}"?', zh: '你了解「{word}」這個概念嗎？' },
      { speaker: 'B', text: "Sort of. Can you give me an example?", zh: '大概。你可以舉個例子嗎？' },
      { speaker: 'A', text: "Sure, let me think of a good one.", zh: '好，讓我想一個好的例子。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} is really important for this project.", zh: '{word}對這個專案來說很重要。' },
      { speaker: 'B', text: "I agree. We should pay more attention to it.", zh: '我同意。我們應該多注意。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I've been thinking about {word} a lot lately.", zh: '我最近一直在想{word}的事。' },
      { speaker: 'B', text: "Really? What made you think about that?", zh: '真的嗎？為什麼會想到這個？' },
      { speaker: 'A', text: "I read an article about it. Very interesting.", zh: '我看了一篇相關文章。很有趣。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "How would you define {word}?", zh: '你會怎麼定義{word}？' },
      { speaker: 'B', text: "That's a tough question. Let me think...", zh: '好難的問題。讓我想想⋯' },
    ]
  },
];

// Transport dialogue templates (vehicles, travel items, roads)
const transportDialogues = [
  {
    lines: [
      { speaker: 'A', text: "How do you get to work? By {word}?", zh: '你怎麼去上班？搭{word}嗎？' },
      { speaker: 'B', text: "Yes, I take the {word} every day. It's very convenient.", zh: '對，我每天搭{word}。很方便。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} is running late today.", zh: '{word}今天誤點了。' },
      { speaker: 'B', text: "Again? We should leave earlier next time.", zh: '又來？下次我們早點出門好了。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Have you ever been on a {word}?", zh: '你有搭過{word}嗎？' },
      { speaker: 'B', text: "No, but I've always wanted to try it!", zh: '沒有，但我一直很想試試！' },
      { speaker: 'A', text: "Let's plan a trip together then.", zh: '那我們一起計畫一趟旅行吧。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Don't forget to check the {word} before we leave.", zh: '出發前別忘了檢查{word}。' },
      { speaker: 'B', text: "Good reminder. Safety first!", zh: '好提醒。安全第一！' },
    ]
  },
];

// Activity dialogue templates (sports, hobbies, entertainment)
// NOTE: templates must work for all activity words (sports, music, shows, crafts)
const activityDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Have you tried {word} before?", zh: '你有試過{word}嗎？' },
      { speaker: 'B', text: "Yes! It was so fun. You should try it too.", zh: '有啊！超好玩的。你也應該試試。' },
      { speaker: 'A', text: "Maybe this weekend. Can you teach me?", zh: '也許這週末。你可以教我嗎？' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I just started getting into {word}.", zh: '我最近開始接觸{word}。' },
      { speaker: 'B', text: "Really? How do you like it so far?", zh: '真的嗎？目前覺得怎麼樣？' },
      { speaker: 'A', text: "It's harder than I thought, but really rewarding.", zh: '比我想像的難，但很有成就感。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Are you into {word}?", zh: '你有在玩{word}嗎？' },
      { speaker: 'B', text: "Sounds great! I've always been curious about it.", zh: '聽起來不錯！我一直很好奇。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I enjoy {word}. It helps me relax after a long day.", zh: '我很喜歡{word}。忙了一天後很紓壓。' },
      { speaker: 'B', text: "I need a hobby like that too. I'm so stressed lately.", zh: '我也需要這種嗜好。最近壓力好大。' },
    ]
  },
];

// Household dialogue templates (home items, tools, kitchenware)
const householdDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Where did you put the {word}?", zh: '你把{word}放哪裡了？' },
      { speaker: 'B', text: "I think it's in the drawer. Let me check.", zh: '我覺得在抽屜裡。我看看。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "We need to buy a new {word}. This one is falling apart.", zh: '我們需要買個新的{word}。這個快壞了。' },
      { speaker: 'B', text: "You're right. Let's go shopping this weekend.", zh: '你說得對。這週末去買吧。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you pass me the {word}?", zh: '你可以把{word}遞給我嗎？' },
      { speaker: 'B', text: "Sure, here you go.", zh: '好，給你。' },
      { speaker: 'A', text: "Thanks! This will make things much easier.", zh: '謝啦！這樣方便多了。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Do you know how to use this {word}?", zh: '你知道怎麼用這個{word}嗎？' },
      { speaker: 'B', text: "Let me read the instructions first.", zh: '讓我先看一下說明書。' },
    ]
  },
];

// Tech dialogue templates (devices, programming, digital)
const techDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Do you know what a {word} is?", zh: '你知道什麼是{word}嗎？' },
      { speaker: 'B', text: "Yes, it's very common in the tech industry.", zh: '知道，在科技業很常見。' },
      { speaker: 'A', text: "Can you explain it in simple terms?", zh: '你可以用簡單的方式解釋嗎？' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I've been learning about {word} recently.", zh: '我最近在學{word}。' },
      { speaker: 'B', text: "That's really useful! Where did you learn it?", zh: '那真的很實用！你在哪學的？' },
      { speaker: 'A', text: "Mostly from online tutorials and YouTube.", zh: '主要是線上教學和 YouTube。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "There's a problem with the {word}.", zh: '{word}有問題。' },
      { speaker: 'B', text: "Have you tried restarting it?", zh: '你有試過重新啟動嗎？' },
      { speaker: 'A', text: "Not yet. Let me try that first.", zh: '還沒。我先試試看。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "This new {word} is amazing. It saves so much time.", zh: '這個新的{word}超讚。省了好多時間。' },
      { speaker: 'B', text: "I should check it out. Send me the link!", zh: '我應該看看。傳連結給我！' },
    ]
  },
];

// Time dialogue templates (periods, calendar, events)
const timeDialogues = [
  {
    lines: [
      { speaker: 'A', text: "I love the {word}. Everything feels so peaceful.", zh: '我喜歡{word}。一切都很平靜。' },
      { speaker: 'B', text: "Me too. It's the best part of the day.", zh: '我也是。那是一天中最棒的時候。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "It's already {word}! Time flies.", zh: '已經{word}了！時間過得好快。' },
      { speaker: 'B', text: "I know! It feels like the year just started.", zh: '對啊！感覺才剛過新年。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "What are your plans for the {word}?", zh: '你{word}有什麼計畫？' },
      { speaker: 'B', text: "Not sure yet. Maybe just stay home and relax.", zh: '還不確定。也許就待在家放鬆。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you believe it's been a whole {word}?", zh: '你能相信已經過了一整個{word}嗎？' },
      { speaker: 'B', text: "Time really flies when you're busy.", zh: '忙起來時間真的過得很快。' },
    ]
  },
];

// Academic dialogue templates — must work for courses, concepts, tools, and science terms
const academicDialogues = [
  {
    lines: [
      { speaker: 'A', text: "We learned about {word} in class today.", zh: '我們今天上課學了{word}。' },
      { speaker: 'B', text: "Oh, that sounds interesting. What did you learn?", zh: '聽起來很有趣。你學了什麼？' },
      { speaker: 'A', text: "It was a lot of new information. I need to review it.", zh: '有很多新資訊。我需要複習。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Do you know anything about {word}?", zh: '你知道{word}的事嗎？' },
      { speaker: 'B', text: "A little. I studied it in college.", zh: '知道一點。我大學有學過。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The professor explained {word} really clearly.", zh: '教授把{word}講得很清楚。' },
      { speaker: 'B', text: "Lucky you! I still don't fully understand it.", zh: '你真幸運！我還是不太懂。' },
      { speaker: 'A', text: "I can lend you my notes if you want.", zh: '你要的話我可以借你筆記。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I need to look up {word} for my assignment.", zh: '我需要查{word}來寫作業。' },
      { speaker: 'B', text: "Try the library or Google Scholar.", zh: '試試圖書館或 Google 學術搜尋。' },
    ]
  },
];

// Legal / government dialogue templates
const legalDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Have you heard about the {word} in the news?", zh: '你有聽說新聞上的{word}嗎？' },
      { speaker: 'B', text: "Yes, it's a big deal. Everyone's talking about it.", zh: '有，很大條的事。大家都在講。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I need to learn more about {word}.", zh: '我需要多了解一下{word}。' },
      { speaker: 'B', text: "There are some good articles online about it.", zh: '網路上有一些不錯的文章。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} was announced on the news today.", zh: '今天新聞上公布了{word}。' },
      { speaker: 'B', text: "I saw that! It could affect a lot of people.", zh: '我看到了！可能會影響很多人。' },
      { speaker: 'A', text: "We should pay attention to what happens next.", zh: '我們應該留意接下來的發展。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Do you understand how {word} works?", zh: '你了解{word}是怎麼運作的嗎？' },
      { speaker: 'B', text: "Honestly, it's pretty complicated. Let's look it up.", zh: '老實說蠻複雜的。我們查一下。' },
    ]
  },
];

// Shopping dialogue templates — must work for goods, accessories, and shopping concepts
const shoppingDialogues = [
  {
    lines: [
      { speaker: 'A', text: "Excuse me, where can I find the {word}?", zh: '不好意思，請問{word}在哪裡？' },
      { speaker: 'B', text: "It should be on the second floor, aisle three.", zh: '應該在二樓第三走道。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I need to get a new {word}. Want to come shopping?", zh: '我需要買個新的{word}。要一起逛嗎？' },
      { speaker: 'B', text: "Sure! I could use some shopping therapy too.", zh: '好啊！我也需要購物療法。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "What do you think of this {word}?", zh: '你覺得這個{word}怎麼樣？' },
      { speaker: 'B', text: "It looks nice. Is it within your budget?", zh: '看起來不錯。在你預算內嗎？' },
      { speaker: 'A', text: "Let me check the price first.", zh: '我先看一下價格。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I saw a great {word} online. Should I buy it?", zh: '我在網路上看到一個很棒的{word}。該買嗎？' },
      { speaker: 'B', text: "Read the reviews first. Don't impulse buy!", zh: '先看評價。不要衝動購物！' },
    ]
  },
];

// Measurement dialogue templates (numbers, units, math)
const measurementDialogues = [
  {
    lines: [
      { speaker: 'A', text: "What's the {word} of this room?", zh: '這個房間的{word}是多少？' },
      { speaker: 'B', text: "I'm not sure. Let me measure it.", zh: '我不確定。讓我量一下。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you help me calculate the {word}?", zh: '你可以幫我算一下{word}嗎？' },
      { speaker: 'B', text: "Sure, give me the numbers.", zh: '好，把數字給我。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The {word} is higher than we expected.", zh: '{word}比我們預期的高。' },
      { speaker: 'B', text: "We need to adjust our plan then.", zh: '那我們需要調整一下計畫。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Do you remember the {word} from the report?", zh: '你記得報告中的{word}嗎？' },
      { speaker: 'B', text: "Let me pull up the file and check.", zh: '我把檔案叫出來看看。' },
    ]
  },
];

// Map noun subcategories to their dialogue templates
const nounDialoguesByCategory = {
  person: personDialogues,
  body: bodyDialogues,
  food: foodDialogues,
  animal: animalDialogues,
  nature: natureDialogues,
  place: placeDialogues,
  object: objectDialogues,
  work: workDialogues,
  abstract: abstractDialogues,
  transport: transportDialogues,
  activity: activityDialogues,
  household: householdDialogues,
  tech: techDialogues,
  time: timeDialogues,
  academic: academicDialogues,
  legal: legalDialogues,
  shopping: shoppingDialogues,
  measurement: measurementDialogues,
};

const adjDialogues = [
  {
    lines: [
      { speaker: 'A', text: "How was the movie?", zh: '電影怎麼樣？' },
      { speaker: 'B', text: "It was really {word}! You should watch it.", zh: '真的很{word}！你應該去看。' },
      { speaker: 'A', text: "I'll check it out this weekend.", zh: '我這週末去看看。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "This coffee is too {word} for me.", zh: '這咖啡對我來說太{word}了。' },
      { speaker: 'B', text: "Want me to add some sugar?", zh: '要我加點糖嗎？' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "You look {word} today. Everything okay?", zh: '你今天看起來很{word}。還好嗎？' },
      { speaker: 'B', text: "Yeah, I just didn't sleep well last night.", zh: '還好，只是昨晚沒睡好。' },
      { speaker: 'A', text: "Get some rest. Take care of yourself.", zh: '好好休息。要照顧自己。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "The weather is so {word} today!", zh: '今天天氣好{word}！' },
      { speaker: 'B', text: "I know! Perfect day for a walk.", zh: '對啊！很適合出去走走。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Is the test going to be {word}?", zh: '考試會很{word}嗎？' },
      { speaker: 'B', text: "Don't worry. If you studied, you'll be fine.", zh: '別擔心。有讀書的話就沒問題。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "That restaurant was {word}. Let's go again!", zh: '那間餐廳很{word}。我們再去吧！' },
      { speaker: 'B', text: "Agreed. The food was amazing.", zh: '同意。食物超好吃的。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I feel {word} about the presentation tomorrow.", zh: '我對明天的報告感覺很{word}。' },
      { speaker: 'B', text: "You'll do great. Just be yourself.", zh: '你會很棒的。做自己就好。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "This road is really {word}. Drive carefully.", zh: '這條路真的很{word}。小心開車。' },
      { speaker: 'B', text: "Got it. I'll slow down.", zh: '知道了。我會開慢一點。' },
    ]
  },
];

// General dialogues for words that don't fit specific POS categories
const generalDialogues = [
  {
    lines: [
      { speaker: 'A', text: 'Do you know what "{word}" means?', zh: '你知道「{word}」是什麼意思嗎？' },
      { speaker: 'B', text: "Yes! I learned it recently. Let me explain...", zh: '知道！我最近學的。讓我解釋⋯' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'I keep forgetting the word "{word}".', zh: '我一直忘記「{word}」這個字。' },
      { speaker: 'B', text: "Write it down three times. That always helps me.", zh: '寫三遍。我都這樣記的。' },
    ]
  },
];

// Natural phrase dialogue templates — use {example} in real conversation context
const phraseNaturalDialogues = [
  {
    lines: [
      { speaker: 'A', text: '{example}', zh: '{example_zh}' },
      { speaker: 'B', text: 'That makes sense. What happened next?', zh: '有道理。後來怎麼了？' },
      { speaker: 'A', text: "I'll tell you later. Let's grab lunch first.", zh: '晚點再說吧。先去吃午餐。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'How was your day?', zh: '你今天過得怎樣？' },
      { speaker: 'B', text: '{example}', zh: '{example_zh}' },
      { speaker: 'A', text: "Oh, I see! Well, tomorrow will be better.", zh: '原來如此！明天會更好的。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'Did you hear about the project update?', zh: '你聽說專案的更新了嗎？' },
      { speaker: 'B', text: 'Yeah. {example}', zh: '聽說了。{example_zh}' },
      { speaker: 'A', text: "Exactly. We need to prepare for that.", zh: '沒錯。我們得準備一下。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I'm not sure what to do about the meeting.", zh: '我不確定會議要怎麼處理。' },
      { speaker: 'B', text: '{example}', zh: '{example_zh}' },
      { speaker: 'A', text: "Good point. I'll do that.", zh: '好主意。我會照做。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: '{example}', zh: '{example_zh}' },
      { speaker: 'B', text: "I agree. Let's keep that in mind.", zh: '同意。我們記住就好。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'Can you explain what happened?', zh: '你可以解釋一下發生什麼事嗎？' },
      { speaker: 'B', text: 'Sure. {example}', zh: '好的。{example_zh}' },
      { speaker: 'A', text: 'Thanks, that clears things up.', zh: '謝謝，這下清楚了。' },
    ]
  },
];

// Casual/gossip-style phrase dialogue templates — for daily life / chat phrases
const phraseCasualDialogues = [
  {
    lines: [
      { speaker: 'A', text: 'OMG, you have to hear this. {example}', zh: '天啊，你一定要聽這個。{example_zh}' },
      { speaker: 'B', text: 'No way! Tell me everything!', zh: '不會吧！全部告訴我！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "So, what's the latest gossip?", zh: '所以，最新的八卦是什麼？' },
      { speaker: 'B', text: 'Well... {example}', zh: '嗯⋯{example_zh}' },
      { speaker: 'A', text: "Seriously?! That's wild!", zh: '認真？！太扯了！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "You won't believe what happened yesterday.", zh: '你不會相信昨天發生了什麼。' },
      { speaker: 'B', text: "What? Spill it!", zh: '什麼？快說！' },
      { speaker: 'A', text: '{example}', zh: '{example_zh}' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: '{example}', zh: '{example_zh}' },
      { speaker: 'B', text: "Haha, that's so relatable!", zh: '哈哈，太有共鳴了！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Okay, real talk. {example}", zh: '好，認真講。{example_zh}' },
      { speaker: 'B', text: "I mean, yeah, that totally makes sense.", zh: '對啊，完全有道理。' },
      { speaker: 'A', text: "Right?! I thought I was the only one who noticed.", zh: '對吧？！我以為只有我注意到。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I need to vent. {example}", zh: '我需要吐苦水。{example_zh}' },
      { speaker: 'B', text: "I feel you. That sounds super frustrating.", zh: '我懂。那聽起來超煩的。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Guess what I just found out?", zh: '你猜我剛發現什麼？' },
      { speaker: 'B', text: "What?! Don't keep me waiting!", zh: '什麼？！別賣關子！' },
      { speaker: 'A', text: '{example}', zh: '{example_zh}' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: '{example}', zh: '{example_zh}' },
      { speaker: 'B', text: "LOL, classic. That sounds about right.", zh: '哈哈，經典。意料之中。' },
      { speaker: 'A', text: "I know, right? Some things never change.", zh: '就是啊，有些事永遠不會變。' },
    ]
  },
];

// Learning-style phrase dialogue templates
const phraseDialogues = [
  {
    lines: [
      { speaker: 'A', text: 'What does "{phrase}" mean?', zh: '「{phrase}」是什麼意思？' },
      { speaker: 'B', text: 'It means "{meaning}". People use it a lot.', zh: '意思是「{meaning}」。大家很常用。' },
      { speaker: 'A', text: "Oh, I've heard it before but never understood it!", zh: '噢，我以前聽過但一直不懂！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'I was talking to my coworker and she said "{phrase}".', zh: '我跟同事聊天，她說了「{phrase}」。' },
      { speaker: 'B', text: "That's quite common in daily conversation.", zh: '那個在日常對話中蠻常見的。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'How do I say "{meaning}" in English?', zh: '「{meaning}」用英文怎麼說？' },
      { speaker: 'B', text: 'You can say "{phrase}". It sounds natural.', zh: '你可以說「{phrase}」。聽起來很自然。' },
      { speaker: 'A', text: "Got it. {phrase}. I'll remember that.", zh: '了解。{phrase}。我會記住的。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'My teacher always says "{phrase}".', zh: '我的老師總是說「{phrase}」。' },
      { speaker: 'B', text: "Ha! That's a useful one. You should use it too.", zh: '哈！那個很實用。你也應該用。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'Wait, is it "{phrase}" or something else?', zh: '等等，是「{phrase}」還是別的？' },
      { speaker: 'B', text: 'Yes, "{phrase}" is correct. You got it right!', zh: '對，「{phrase}」是對的。你答對了！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'I tried to say "{phrase}" in the meeting today.', zh: '我今天開會時試著說「{phrase}」。' },
      { speaker: 'B', text: 'Nice! How did it go?', zh: '讚！結果怎樣？' },
      { speaker: 'A', text: "Everyone understood me. I felt so proud!", zh: '大家都聽懂了。我超有成就感！' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'Can you use "{phrase}" in a sentence?', zh: '你可以用「{phrase}」造句嗎？' },
      { speaker: 'B', text: 'Sure! For example: "{example}"', zh: '當然！例如：「{example}」' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: 'In American English, people often say "{phrase}".', zh: '在美式英語中，大家常說「{phrase}」。' },
      { speaker: 'B', text: 'Really? What about British English?', zh: '真的嗎？英式英語呢？' },
      { speaker: 'A', text: "They use it too, actually.", zh: '其實也一樣會用。' },
    ]
  },
];

function generateDialogues(words, phrases, count = 10) {
  const dialogues = [];

  const verbs = words.filter(w => w.part_of_speech === 'v');
  const nouns = words.filter(w => w.part_of_speech === 'n');
  const adjs = words.filter(w => w.part_of_speech === 'adj');
  const others = words.filter(w => !['v', 'n', 'adj'].includes(w.part_of_speech));

  // Helper: pick a template deterministically based on word id (so same word always gets same dialogue)
  const pickTemplate = (templates, id) => templates[id % templates.length];

  // Generate word-based dialogues
  const allWordItems = [...verbs, ...nouns, ...adjs, ...others];
  const wordCount = Math.min(count - Math.min(phrases.length, 3), allWordItems.length);

  for (let i = 0; i < wordCount; i++) {
    const w = allWordItems[i];
    let tmpl;
    if (w.part_of_speech === 'v') tmpl = pickTemplate(verbDialogues, w.id || i);
    else if (w.part_of_speech === 'n') {
      const category = classifyNoun(w.word, w.meaning);
      const templates = nounDialoguesByCategory[category] || objectDialogues;
      tmpl = pickTemplate(templates, w.id || i);
    }
    else if (w.part_of_speech === 'adj') tmpl = pickTemplate(adjDialogues, w.id || i);
    else tmpl = pickTemplate(generalDialogues, w.id || i);

    const wordText = w.word || w.phrase;
    const meaning = w.meaning || '';
    const lines = tmpl.lines.map(line => ({
      speaker: line.speaker,
      text: line.text.replace(/\{word\}/g, wordText),
      zh: line.zh.replace(/\{word\}/g, meaning || wordText)
    }));

    dialogues.push({
      lines,
      highlightWords: [wordText],
      type: 'word',
      itemType: 'word',
      itemId: w.id
    });
  }

  // Generate phrase-based dialogues (casual / natural / learning-style)
  // Casual phrases (gossip, slang, chat) use casual templates
  // Other phrases: 70% natural, 30% learning-style
  const casualKeywords = /gossip|slang|八卦|吐槽|抱怨|嗆|酸|吐苦水|炫耀|搭訕|已讀不回|爆料|翻白眼|翻臉|嘴砲|廢話|幹話|挖苦|諷刺|嫉妒|吃醋|崩潰|翻車|嗑|瓜|茶|drama|shade|flex|vibe|slay|cap|ghost|sip|vent|roast|crush|friendzone|cringe|simp|stan/i;
  const phraseCount = count - dialogues.length;
  for (let i = 0; i < phraseCount && i < phrases.length; i++) {
    const p = phrases[i];
    const isCasual = casualKeywords.test(p.meaning || '') || casualKeywords.test(p.phrase || '');
    let tmpl;
    if (isCasual) {
      tmpl = pickTemplate(phraseCasualDialogues, p.id || i);
    } else {
      const useNatural = (p.id || i) % 10 < 7;
      tmpl = useNatural
        ? pickTemplate(phraseNaturalDialogues, p.id || i)
        : pickTemplate(phraseDialogues, p.id || i);
    }

    const exampleText = p.example || p.phrase;
    const exampleZh = p.meaning || '';

    const lines = tmpl.lines.map(line => ({
      speaker: line.speaker,
      text: line.text
        .replace(/\{phrase\}/g, p.phrase)
        .replace(/\{meaning\}/g, p.meaning || '')
        .replace(/\{example\}/g, exampleText)
        .replace(/\{example_zh\}/g, exampleZh),
      zh: line.zh
        .replace(/\{phrase\}/g, p.phrase)
        .replace(/\{meaning\}/g, p.meaning || '')
        .replace(/\{example\}/g, exampleText)
        .replace(/\{example_zh\}/g, exampleZh)
    }));

    dialogues.push({
      lines,
      highlightWords: [p.phrase],
      type: 'phrase',
      itemType: 'phrase',
      itemId: p.id
    });
  }

  return dialogues.slice(0, count);
}

module.exports = { generateDialogues };
