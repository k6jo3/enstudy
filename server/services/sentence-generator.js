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
      { speaker: 'A', text: "This {word} tastes amazing! What's the recipe?", zh: '這個{word}超好吃的！怎麼做的？' },
      { speaker: 'B', text: "My mom taught me. I'll share it with you.", zh: '我媽教我的。我分享給你。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "We're out of {word}. Can you buy some?", zh: '{word}用完了。你可以去買嗎？' },
      { speaker: 'B', text: "Sure, I'll stop by the store on my way home.", zh: '好，我回家路上順便買。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I had {word} for breakfast this morning.", zh: '我今天早餐吃了{word}。' },
      { speaker: 'B', text: "Sounds delicious! I just had toast.", zh: '聽起來好好吃！我只吃了吐司。' },
      { speaker: 'A', text: "You should try it sometime.", zh: '你改天也試試。' },
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

const natureDialogues = [
  {
    lines: [
      { speaker: 'A', text: "The {word} is really strong today.", zh: '今天的{word}好強。' },
      { speaker: 'B', text: "I know! Be careful when you go outside.", zh: '對啊！出門小心。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Look at the {word}! It's so beautiful.", zh: '你看那個{word}！好美。' },
      { speaker: 'B', text: "Wow, let me take a picture.", zh: '哇，讓我拍張照。' },
      { speaker: 'A', text: "Hurry! It might disappear soon.", zh: '快！可能很快就不見了。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I love the {word} in the morning.", zh: '我喜歡早上的{word}。' },
      { speaker: 'B', text: "Me too. It feels so peaceful.", zh: '我也是。感覺很平靜。' },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Did you hear the {word} last night?", zh: '你昨晚有聽到{word}嗎？' },
      { speaker: 'B', text: "Yes! It woke me up at midnight.", zh: '有！半夜被吵醒了。' },
      { speaker: 'A', text: "Same here. I couldn't fall back asleep.", zh: '我也是。睡不回去了。' },
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

// Phrase dialogue templates
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

  // Generate phrase-based dialogues
  const phraseCount = count - dialogues.length;
  for (let i = 0; i < phraseCount && i < phrases.length; i++) {
    const p = phrases[i];
    const tmpl = pickTemplate(phraseDialogues, p.id || i);

    const lines = tmpl.lines.map(line => ({
      speaker: line.speaker,
      text: line.text
        .replace(/\{phrase\}/g, p.phrase)
        .replace(/\{meaning\}/g, p.meaning || '')
        .replace(/\{example\}/g, p.example || p.phrase),
      zh: line.zh
        .replace(/\{phrase\}/g, p.phrase)
        .replace(/\{meaning\}/g, p.meaning || '')
        .replace(/\{example\}/g, p.example || p.phrase)
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
