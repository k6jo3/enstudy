module.exports = [
  // ==================== GRADE 1 ====================
  {
    id: 1, grade: 1, order: 1,
    title: 'My Pet Dog',
    topic: 'Animals',
    content: 'I have a dog. His name is Buddy. Buddy is brown and white. He has a big nose and a long tail.\n\nI walk Buddy every morning. He likes to run in the park. He plays with other dogs. Buddy is very happy when we go outside.\n\nAfter the walk, I give Buddy food and water. He eats a lot! Then he sleeps on his bed. I love my dog Buddy.',
    content_zh: '我有一隻狗。他的名字叫巴迪。巴迪是棕色和白色的。他有一個大鼻子和一條長尾巴。\n\n我每天早上遛巴迪。他喜歡在公園裡跑。他和其他狗一起玩。巴迪出去的時候很開心。\n\n散步之後，我給巴迪食物和水。他吃很多！然後他在他的床上睡覺。我愛我的狗巴迪。',
    vocabulary: [
      { word: 'pet', pos: 'n.', meaning: '寵物', example: 'She has a pet cat at home.', example_zh: '她家裡有一隻寵物貓。' },
      { word: 'brown', pos: 'adj.', meaning: '棕色的', example: 'The bear is brown.', example_zh: '那隻熊是棕色的。' },
      { word: 'tail', pos: 'n.', meaning: '尾巴', example: 'The cat has a long tail.', example_zh: '那隻貓有一條長尾巴。' },
      { word: 'walk', pos: 'v.', meaning: '散步；遛', example: 'We walk to school every day.', example_zh: '我們每天走路去上學。' },
      { word: 'outside', pos: 'adv.', meaning: '外面', example: 'The children play outside.', example_zh: '孩子們在外面玩。' }
    ],
    phrases: [
      { phrase: 'a lot', meaning: '很多', example: 'He reads a lot of books.', example_zh: '他讀很多書。' },
      { phrase: 'every morning', meaning: '每天早上', example: 'I eat breakfast every morning.', example_zh: '我每天早上吃早餐。' },
      { phrase: 'plays with', meaning: '和…一起玩', example: 'She plays with her friends after school.', example_zh: '她放學後和朋友一起玩。' }
    ],
    grammar: [
      { point: 'Simple Present Tense（簡單現在式）', explanation: '用來描述日常習慣和事實。主詞是 I/you/we/they 時，動詞用原形。', examples: [{ en: 'I walk my dog every morning.', zh: '我每天早上遛我的狗。' }, { en: 'They play in the park.', zh: '他們在公園裡玩。' }] },
      { point: 'Subject + have/has（擁有）', explanation: '表示擁有。I/you/we/they 用 have，he/she/it 用 has。', examples: [{ en: 'He has a big nose.', zh: '他有一個大鼻子。' }, { en: 'I have a dog.', zh: '我有一隻狗。' }] }
    ],
    questions: [
      { question: 'What is the dog\'s name?', options: ['Max', 'Buddy', 'Charlie', 'Rex'], answer: 1 },
      { question: 'What does Buddy like to do in the park?', options: ['Sleep', 'Eat', 'Run', 'Swim'], answer: 2 },
      { question: 'What does Buddy do after the walk?', options: ['Plays more', 'Takes a bath', 'Eats and sleeps', 'Goes to school'], answer: 2 }
    ]
  },
  {
    id: 2, grade: 1, order: 2,
    title: 'The School Bus',
    topic: 'School',
    content: 'Every day, I ride the school bus. The bus is big and yellow. The bus driver is Mr. Tom. He is very nice.\n\nMany kids ride the bus with me. My friend Amy sits next to me. We talk and laugh on the bus. It is fun!\n\nThe bus stops at my school. I say goodbye to Mr. Tom. Then I go to my classroom. I like riding the school bus.',
    content_zh: '每天，我搭校車。校車又大又黃。公車司機是湯姆先生。他非常好。\n\n很多小孩和我一起搭公車。我的朋友艾米坐在我旁邊。我們在公車上聊天和大笑。很有趣！\n\n公車在我的學校停下來。我和湯姆先生說再見。然後我去我的教室。我喜歡搭校車。',
    vocabulary: [
      { word: 'ride', pos: 'v.', meaning: '搭乘', example: 'I ride my bike to the park.', example_zh: '我騎腳踏車去公園。' },
      { word: 'yellow', pos: 'adj.', meaning: '黃色的', example: 'The sun is yellow.', example_zh: '太陽是黃色的。' },
      { word: 'driver', pos: 'n.', meaning: '司機', example: 'The taxi driver is friendly.', example_zh: '計程車司機很友善。' },
      { word: 'laugh', pos: 'v.', meaning: '笑', example: 'The funny movie makes us laugh.', example_zh: '那部有趣的電影讓我們笑。' },
      { word: 'classroom', pos: 'n.', meaning: '教室', example: 'Our classroom has many desks.', example_zh: '我們的教室有很多書桌。' }
    ],
    phrases: [
      { phrase: 'next to', meaning: '在…旁邊', example: 'The cat sits next to the window.', example_zh: '貓坐在窗戶旁邊。' },
      { phrase: 'say goodbye', meaning: '說再見', example: 'I say goodbye to my mom before school.', example_zh: '上學前我和媽媽說再見。' },
      { phrase: 'every day', meaning: '每天', example: 'She drinks milk every day.', example_zh: '她每天喝牛奶。' }
    ],
    grammar: [
      { point: 'Simple Present Tense - he/she/it（第三人稱單數）', explanation: '主詞是 he/she/it 時，動詞要加 -s 或 -es。', examples: [{ en: 'He stops the bus at my school.', zh: '他在我的學校停下公車。' }, { en: 'She sits next to me.', zh: '她坐在我旁邊。' }] },
      { point: 'Adjective + Noun（形容詞 + 名詞）', explanation: '形容詞放在名詞前面來描述名詞。', examples: [{ en: 'The bus is big and yellow.', zh: '公車又大又黃。' }, { en: 'He is a nice driver.', zh: '他是一位好司機。' }] }
    ],
    questions: [
      { question: 'What color is the school bus?', options: ['Red', 'Blue', 'Yellow', 'Green'], answer: 2 },
      { question: 'Who sits next to the narrator on the bus?', options: ['Mr. Tom', 'Amy', 'Mom', 'A teacher'], answer: 1 },
      { question: 'Who is the bus driver?', options: ['Mr. Smith', 'Mr. Tom', 'Mrs. Lee', 'Amy'], answer: 1 }
    ]
  },
  {
    id: 3, grade: 1, order: 3,
    title: 'A Rainy Day',
    topic: 'Weather',
    content: 'Today it is raining. I cannot go outside to play. The sky is gray and the wind is cold.\n\nI stay inside with my mom. We make cookies together. The cookies smell so good! I put chocolate chips on top.\n\nAfter we eat the cookies, I draw pictures. I draw a rainbow and a sun. I hope tomorrow will be sunny. Rainy days can be fun too!',
    content_zh: '今天下雨了。我不能出去玩。天空是灰色的，風很冷。\n\n我和媽媽待在家裡。我們一起做餅乾。餅乾聞起來好香！我在上面放巧克力碎片。\n\n吃完餅乾後，我畫畫。我畫了一道彩虹和一個太陽。我希望明天會是晴天。雨天也可以很好玩！',
    vocabulary: [
      { word: 'raining', pos: 'v.', meaning: '下雨', example: 'It is raining outside right now.', example_zh: '外面現在正在下雨。' },
      { word: 'sky', pos: 'n.', meaning: '天空', example: 'The sky is blue today.', example_zh: '今天天空是藍色的。' },
      { word: 'cookie', pos: 'n.', meaning: '餅乾', example: 'Mom bakes cookies for us.', example_zh: '媽媽為我們烤餅乾。' },
      { word: 'draw', pos: 'v.', meaning: '畫', example: 'I like to draw animals.', example_zh: '我喜歡畫動物。' },
      { word: 'rainbow', pos: 'n.', meaning: '彩虹', example: 'There is a rainbow after the rain.', example_zh: '雨後有一道彩虹。' }
    ],
    phrases: [
      { phrase: 'stay inside', meaning: '待在室內', example: 'We stay inside when it snows.', example_zh: '下雪時我們待在室內。' },
      { phrase: 'together', meaning: '一起', example: 'Let\'s play together!', example_zh: '我們一起玩吧！' },
      { phrase: 'on top', meaning: '在上面', example: 'Put the cherry on top of the cake.', example_zh: '把櫻桃放在蛋糕上面。' }
    ],
    grammar: [
      { point: 'Present Continuous（現在進行式）', explanation: '表示正在發生的動作。用 am/is/are + V-ing。', examples: [{ en: 'It is raining today.', zh: '今天正在下雨。' }, { en: 'I am drawing a picture.', zh: '我正在畫一幅畫。' }] },
      { point: 'can / cannot（能 / 不能）', explanation: 'can 表示能力或許可，cannot (can\'t) 表示不能。', examples: [{ en: 'I cannot go outside to play.', zh: '我不能出去玩。' }, { en: 'She can swim very well.', zh: '她游泳游得很好。' }] }
    ],
    questions: [
      { question: 'Why can\'t the child go outside?', options: ['It is snowing', 'It is raining', 'It is too hot', 'Mom said no'], answer: 1 },
      { question: 'What do they make together?', options: ['A cake', 'Pizza', 'Cookies', 'Soup'], answer: 2 },
      { question: 'What does the child draw?', options: ['A dog', 'A rainbow and a sun', 'A house', 'A tree'], answer: 1 }
    ]
  },
  {
    id: 4, grade: 1, order: 4,
    title: 'My Family',
    topic: 'Family',
    content: 'My family has five people. There is my dad, my mom, my big sister, my baby brother, and me.\n\nMy dad goes to work in the morning. He is tall and strong. My mom is a teacher. She helps me with my homework. My sister is ten years old. She reads big books.\n\nMy baby brother is very small. He cries a lot, but he also smiles at me. I love my family very much.',
    content_zh: '我的家庭有五個人。有我爸爸、我媽媽、我姊姊、我弟弟和我。\n\n我爸爸早上去上班。他又高又壯。我媽媽是老師。她幫我做功課。我姊姊十歲。她讀很厚的書。\n\n我弟弟很小。他常常哭，但他也對我笑。我非常愛我的家人。',
    vocabulary: [
      { word: 'family', pos: 'n.', meaning: '家庭', example: 'Her family lives in Taipei.', example_zh: '她的家人住在台北。' },
      { word: 'strong', pos: 'adj.', meaning: '強壯的', example: 'The man is very strong.', example_zh: '那個男人很強壯。' },
      { word: 'teacher', pos: 'n.', meaning: '老師', example: 'Our teacher is very kind.', example_zh: '我們的老師很善良。' },
      { word: 'homework', pos: 'n.', meaning: '功課', example: 'I do my homework after dinner.', example_zh: '我晚餐後做功課。' },
      { word: 'smile', pos: 'v.', meaning: '微笑', example: 'The baby smiles when she sees her mom.', example_zh: '寶寶看到媽媽時會微笑。' }
    ],
    phrases: [
      { phrase: 'go to work', meaning: '去上班', example: 'Dad goes to work at eight o\'clock.', example_zh: '爸爸八點去上班。' },
      { phrase: 'help with', meaning: '幫忙做…', example: 'Can you help with the dishes?', example_zh: '你能幫忙洗碗嗎？' },
      { phrase: 'very much', meaning: '非常', example: 'I like ice cream very much.', example_zh: '我非常喜歡冰淇淋。' }
    ],
    grammar: [
      { point: 'There is / There are（有）', explanation: 'There is 用於單數名詞，There are 用於複數名詞。表示某處存在某物。', examples: [{ en: 'There is a cat on the table.', zh: '桌上有一隻貓。' }, { en: 'There are five people in my family.', zh: '我的家庭有五個人。' }] },
      { point: 'Possessive Adjectives（所有格形容詞）', explanation: 'my, your, his, her, its, our, their 表示「…的」。', examples: [{ en: 'My dad goes to work.', zh: '我的爸爸去上班。' }, { en: 'Her sister reads big books.', zh: '她的姊姊讀很厚的書。' }] }
    ],
    questions: [
      { question: 'How many people are in the family?', options: ['Three', 'Four', 'Five', 'Six'], answer: 2 },
      { question: 'What does the mom do?', options: ['Doctor', 'Teacher', 'Driver', 'Cook'], answer: 1 },
      { question: 'What does the baby brother do?', options: ['Reads books', 'Goes to school', 'Cries and smiles', 'Plays outside'], answer: 2 }
    ]
  },

  // ==================== GRADE 2 ====================
  {
    id: 5, grade: 2, order: 1,
    title: 'The Lost Kitten',
    topic: 'Animals',
    content: 'One day, I found a small kitten near my house. It was gray and very thin. The kitten was meowing loudly because it was scared and hungry.\n\nI picked up the kitten carefully. I brought it home and gave it some warm milk. The kitten drank the milk quickly. Then it fell asleep in my arms.\n\nThe next day, we put up signs around the neighborhood. A little girl named Lily came to our door. She was so happy to see her kitten again! She thanked me many times. I felt proud that I helped the kitten find its way home.',
    content_zh: '有一天，我在家附近發現了一隻小貓。牠是灰色的，而且非常瘦。小貓大聲地叫，因為牠害怕又餓。\n\n我小心地抱起小貓。我把牠帶回家，給牠一些溫牛奶。小貓很快地喝了牛奶。然後牠在我的懷裡睡著了。\n\n隔天，我們在附近貼了告示。一個叫莉莉的小女孩來到我們家門口。她看到她的小貓好開心！她謝了我很多次。我感到很驕傲，因為我幫小貓找到回家的路。',
    vocabulary: [
      { word: 'kitten', pos: 'n.', meaning: '小貓', example: 'The kitten played with a ball of yarn.', example_zh: '小貓和一團毛線球玩。' },
      { word: 'scared', pos: 'adj.', meaning: '害怕的', example: 'The dog is scared of thunder.', example_zh: '那隻狗怕打雷。' },
      { word: 'carefully', pos: 'adv.', meaning: '小心地', example: 'She carried the glass carefully.', example_zh: '她小心地端著玻璃杯。' },
      { word: 'neighborhood', pos: 'n.', meaning: '社區；附近', example: 'There is a park in our neighborhood.', example_zh: '我們社區有一個公園。' },
      { word: 'proud', pos: 'adj.', meaning: '驕傲的', example: 'Mom was proud of my good grades.', example_zh: '媽媽為我的好成績感到驕傲。' }
    ],
    phrases: [
      { phrase: 'picked up', meaning: '撿起；抱起', example: 'He picked up the ball from the ground.', example_zh: '他從地上撿起球。' },
      { phrase: 'fell asleep', meaning: '睡著了', example: 'The baby fell asleep during the car ride.', example_zh: '寶寶在車上睡著了。' },
      { phrase: 'put up', meaning: '張貼', example: 'They put up posters for the school play.', example_zh: '他們為學校話劇貼了海報。' }
    ],
    grammar: [
      { point: 'Simple Past Tense（簡單過去式）', explanation: '描述過去發生的事。規則動詞加 -ed，不規則動詞需要記憶（如 found, brought, drank, fell）。', examples: [{ en: 'I found a kitten near my house.', zh: '我在家附近發現了一隻小貓。' }, { en: 'She thanked me many times.', zh: '她謝了我很多次。' }] },
      { point: 'because（因為）', explanation: '用來連接原因和結果。', examples: [{ en: 'The kitten was meowing because it was hungry.', zh: '小貓在叫，因為牠餓了。' }, { en: 'I stayed home because it rained.', zh: '我待在家，因為下雨了。' }] }
    ],
    questions: [
      { question: 'Where did the narrator find the kitten?', options: ['At school', 'Near the house', 'In the park', 'At the store'], answer: 1 },
      { question: 'What did the narrator give the kitten?', options: ['Fish', 'Water', 'Warm milk', 'Bread'], answer: 2 },
      { question: 'Who was the kitten\'s owner?', options: ['Mr. Tom', 'Amy', 'Lily', 'The narrator'], answer: 2 }
    ]
  },
  {
    id: 6, grade: 2, order: 2,
    title: 'Making a New Friend',
    topic: 'Friendship',
    content: 'A new boy came to our class today. His name was James. He looked nervous because he did not know anyone.\n\nAt lunch, I saw James sitting alone. I walked over and said, "Hi! Do you want to sit with us?" James smiled and said, "Yes, thank you!"\n\nWe talked about our favorite games and movies. James liked the same superhero as me! After school, we played together on the playground. James was not nervous anymore.\n\nNow James is one of my best friends. I am glad I talked to him on his first day.',
    content_zh: '今天有一個新的男孩來到我們班。他的名字叫詹姆斯。他看起來很緊張，因為他不認識任何人。\n\n午餐時，我看到詹姆斯一個人坐著。我走過去說：「嗨！你想和我們一起坐嗎？」詹姆斯笑著說：「好，謝謝你！」\n\n我們聊了最喜歡的遊戲和電影。詹姆斯和我喜歡同一個超級英雄！放學後，我們一起在操場上玩。詹姆斯不再緊張了。\n\n現在詹姆斯是我最好的朋友之一。我很高興我在他的第一天和他說話了。',
    vocabulary: [
      { word: 'nervous', pos: 'adj.', meaning: '緊張的', example: 'She felt nervous before the test.', example_zh: '她考試前感到緊張。' },
      { word: 'alone', pos: 'adv.', meaning: '獨自地', example: 'The old man lives alone.', example_zh: '那位老人獨自生活。' },
      { word: 'favorite', pos: 'adj.', meaning: '最喜歡的', example: 'My favorite color is blue.', example_zh: '我最喜歡的顏色是藍色。' },
      { word: 'superhero', pos: 'n.', meaning: '超級英雄', example: 'The superhero saved the city.', example_zh: '超級英雄拯救了城市。' },
      { word: 'glad', pos: 'adj.', meaning: '高興的', example: 'I am glad you came to my party.', example_zh: '我很高興你來我的派對。' }
    ],
    phrases: [
      { phrase: 'walked over', meaning: '走過去', example: 'She walked over to help the boy.', example_zh: '她走過去幫那個男孩。' },
      { phrase: 'talked about', meaning: '談論', example: 'We talked about our weekend plans.', example_zh: '我們談論了我們的週末計畫。' },
      { phrase: 'not anymore', meaning: '不再', example: 'He does not cry anymore.', example_zh: '他不再哭了。' }
    ],
    grammar: [
      { point: 'Past Tense - Irregular Verbs（不規則過去式）', explanation: '有些動詞的過去式不是加 -ed，需要特別記：come→came, say→said, sit→sat, see→saw。', examples: [{ en: 'A new boy came to our class.', zh: '一個新男孩來到我們班。' }, { en: 'I saw him sitting alone.', zh: '我看到他一個人坐著。' }] },
      { point: 'Direct Speech（直接引語）', explanation: '用引號 "" 表示某人說的話。', examples: [{ en: '"Do you want to sit with us?" I asked.', zh: '「你想和我們一起坐嗎？」我問。' }, { en: '"Yes, thank you!" he said.', zh: '「好，謝謝你！」他說。' }] }
    ],
    questions: [
      { question: 'Why was James nervous?', options: ['He was sick', 'He did not know anyone', 'He lost his book', 'He was late'], answer: 1 },
      { question: 'Where was James sitting at lunch?', options: ['With the teacher', 'With many friends', 'Alone', 'Outside'], answer: 2 },
      { question: 'What did James and the narrator have in common?', options: ['Same teacher', 'Same pet', 'Same superhero', 'Same birthday'], answer: 2 }
    ]
  },
  {
    id: 7, grade: 2, order: 3,
    title: 'Our Treehouse',
    topic: 'Adventure',
    content: 'Last summer, my dad helped me build a treehouse. We used wood, nails, and a hammer. It took us three days to finish it.\n\nThe treehouse is in the big oak tree in our backyard. It has a small window and a rope ladder. I painted it blue and green.\n\nMy friends come over to play in the treehouse. We pretend it is a pirate ship on the ocean. Sometimes we bring snacks and eat them up there.\n\nThe treehouse is my favorite place. I can see the whole neighborhood from the window. I feel like I am on top of the world!',
    content_zh: '去年夏天，我爸爸幫我建了一個樹屋。我們用了木頭、釘子和錘子。我們花了三天才完成。\n\n樹屋在我們後院的大橡樹上。它有一個小窗戶和一個繩梯。我把它漆成藍色和綠色。\n\n我的朋友們來樹屋裡玩。我們假裝它是海洋上的海盜船。有時候我們帶零食在上面吃。\n\n樹屋是我最喜歡的地方。我可以從窗戶看到整個社區。我感覺自己在世界之巔！',
    vocabulary: [
      { word: 'build', pos: 'v.', meaning: '建造', example: 'They are building a new house.', example_zh: '他們正在建一棟新房子。' },
      { word: 'hammer', pos: 'n.', meaning: '錘子', example: 'He hit the nail with a hammer.', example_zh: '他用錘子釘釘子。' },
      { word: 'ladder', pos: 'n.', meaning: '梯子', example: 'Use the ladder to climb up.', example_zh: '用梯子爬上去。' },
      { word: 'painted', pos: 'v.', meaning: '漆（過去式）', example: 'She painted a beautiful picture.', example_zh: '她畫了一幅美麗的畫。' },
      { word: 'pretend', pos: 'v.', meaning: '假裝', example: 'The kids pretend to be astronauts.', example_zh: '孩子們假裝自己是太空人。' }
    ],
    phrases: [
      { phrase: 'come over', meaning: '過來（串門子）', example: 'Can you come over to my house?', example_zh: '你能來我家嗎？' },
      { phrase: 'on top of', meaning: '在…頂端', example: 'The bird sat on top of the tree.', example_zh: '鳥坐在樹頂上。' },
      { phrase: 'took us', meaning: '花了我們（時間）', example: 'It took us an hour to get there.', example_zh: '我們花了一個小時才到那裡。' }
    ],
    grammar: [
      { point: 'Past Tense with Time Words（過去式搭配時間詞）', explanation: '用 last (summer, week, year), yesterday, ago 等時間詞搭配過去式。', examples: [{ en: 'Last summer, we built a treehouse.', zh: '去年夏天，我們建了一個樹屋。' }, { en: 'I went to the zoo yesterday.', zh: '我昨天去了動物園。' }] },
      { point: 'It takes + time（花費時間）', explanation: '表示做某事花了多少時間。', examples: [{ en: 'It took us three days to finish.', zh: '我們花了三天才完成。' }, { en: 'It takes ten minutes to walk to school.', zh: '走到學校要十分鐘。' }] }
    ],
    questions: [
      { question: 'Who helped build the treehouse?', options: ['Mom', 'Uncle', 'Dad', 'Friends'], answer: 2 },
      { question: 'What do the kids pretend the treehouse is?', options: ['A castle', 'A pirate ship', 'A spaceship', 'A school'], answer: 1 },
      { question: 'How long did it take to build?', options: ['One day', 'Two days', 'Three days', 'A week'], answer: 2 }
    ]
  },
  {
    id: 8, grade: 2, order: 4,
    title: 'Helping in the Garden',
    topic: 'Nature',
    content: 'My grandma has a beautiful garden. She grows tomatoes, carrots, and sunflowers. I help her in the garden every weekend.\n\nFirst, we pull out the weeds. Weeds take water and food from the good plants. Then we water the flowers and vegetables with a big green hose.\n\nGrandma taught me how to plant seeds. I dug a small hole, put the seed in, and covered it with soil. She said, "Be patient. The seed needs time to grow."\n\nTwo weeks later, I saw a tiny green sprout coming out of the soil. I was so excited! Growing things is like magic.',
    content_zh: '我奶奶有一個美麗的花園。她種了番茄、胡蘿蔔和向日葵。我每個週末都幫她在花園裡工作。\n\n首先，我們拔雜草。雜草會從好的植物那裡搶水和養分。然後我們用一條大的綠色水管給花和蔬菜澆水。\n\n奶奶教我怎麼種種子。我挖了一個小洞，把種子放進去，然後用土蓋起來。她說：「要有耐心。種子需要時間長大。」\n\n兩個星期後，我看到一棵小小的綠芽從土裡冒出來。我好興奮！種東西就像魔法一樣。',
    vocabulary: [
      { word: 'garden', pos: 'n.', meaning: '花園', example: 'There are roses in the garden.', example_zh: '花園裡有玫瑰花。' },
      { word: 'weed', pos: 'n.', meaning: '雜草', example: 'Pull out the weeds from the yard.', example_zh: '把院子裡的雜草拔掉。' },
      { word: 'seed', pos: 'n.', meaning: '種子', example: 'Plant the seeds in the spring.', example_zh: '在春天種下種子。' },
      { word: 'soil', pos: 'n.', meaning: '土壤', example: 'The soil here is very rich.', example_zh: '這裡的土壤很肥沃。' },
      { word: 'patient', pos: 'adj.', meaning: '有耐心的', example: 'A good teacher is patient with students.', example_zh: '好老師對學生有耐心。' }
    ],
    phrases: [
      { phrase: 'pull out', meaning: '拔出', example: 'The dentist pulled out the bad tooth.', example_zh: '牙醫拔掉了壞牙。' },
      { phrase: 'coming out', meaning: '冒出來', example: 'Flowers are coming out in spring.', example_zh: '花朵在春天冒出來。' },
      { phrase: 'taught me how to', meaning: '教我怎麼', example: 'Dad taught me how to ride a bike.', example_zh: '爸爸教我怎麼騎腳踏車。' }
    ],
    grammar: [
      { point: 'Sequence Words（順序詞）', explanation: '用 First, Then, Next, Finally 來表示事情的順序。', examples: [{ en: 'First, we pull out the weeds. Then we water the flowers.', zh: '首先，我們拔雜草。然後我們澆花。' }, { en: 'First, I wash my hands. Then I eat lunch.', zh: '首先，我洗手。然後我吃午餐。' }] },
      { point: 'Past Tense - teach/taught（教）', explanation: 'teach 的過去式是 taught，是不規則變化。', examples: [{ en: 'Grandma taught me how to plant seeds.', zh: '奶奶教我怎麼種種子。' }, { en: 'The teacher taught us a new song.', zh: '老師教了我們一首新歌。' }] }
    ],
    questions: [
      { question: 'What does Grandma grow in her garden?', options: ['Apples and oranges', 'Tomatoes, carrots, and sunflowers', 'Roses and lilies', 'Rice and corn'], answer: 1 },
      { question: 'Why do they pull out weeds?', options: ['Weeds are ugly', 'Weeds take water from good plants', 'Grandma told them to', 'Weeds are poisonous'], answer: 1 },
      { question: 'What came out of the soil after two weeks?', options: ['A flower', 'A weed', 'A green sprout', 'A tomato'], answer: 2 }
    ]
  },

  // ==================== GRADE 3 ====================
  {
    id: 9, grade: 3, order: 1,
    title: 'The Camping Trip',
    topic: 'Outdoor',
    content: 'Last weekend, my family went on a camping trip in the mountains. We drove for two hours to reach the campground. The air smelled fresh, and tall pine trees surrounded us everywhere.\n\nDad and I set up the tent while Mom prepared sandwiches for lunch. My little brother collected sticks for the campfire. It was hard work, but we all helped each other.\n\nAt night, we sat around the campfire and roasted marshmallows. Dad told us stories about the stars. I learned that the Big Dipper points to the North Star. The sky was so clear that I could see thousands of stars. I had never seen so many before!\n\nThe next morning, I woke up to the sound of birds singing. We went hiking along a trail near a stream. I even saw a deer drinking water! This camping trip was the best adventure of my life.',
    content_zh: '上個週末，我們家去山上露營。我們開了兩個小時的車才到營地。空氣聞起來很清新，高大的松樹到處圍繞著我們。\n\n爸爸和我搭帳篷，媽媽準備三明治當午餐。我弟弟撿了樹枝來生營火。這是辛苦的工作，但我們都互相幫忙。\n\n晚上，我們圍著營火坐著烤棉花糖。爸爸給我們講了關於星星的故事。我學到北斗七星指向北極星。天空非常清澈，我可以看到成千上萬的星星。我以前從來沒有看過這麼多星星！\n\n隔天早上，我被鳥兒唱歌的聲音叫醒。我們沿著小溪旁的步道去健行。我甚至看到一隻鹿在喝水！這次露營是我人生中最棒的冒險。',
    vocabulary: [
      { word: 'campground', pos: 'n.', meaning: '營地', example: 'The campground has a lake nearby.', example_zh: '營地附近有一個湖。' },
      { word: 'surrounded', pos: 'v.', meaning: '圍繞', example: 'The castle was surrounded by a wall.', example_zh: '城堡被一堵牆圍繞著。' },
      { word: 'campfire', pos: 'n.', meaning: '營火', example: 'We sang songs around the campfire.', example_zh: '我們圍著營火唱歌。' },
      { word: 'roasted', pos: 'v.', meaning: '烤（過去式）', example: 'She roasted chicken for dinner.', example_zh: '她烤了雞肉當晚餐。' },
      { word: 'trail', pos: 'n.', meaning: '步道', example: 'The hiking trail goes up the mountain.', example_zh: '健行步道往山上走。' },
      { word: 'stream', pos: 'n.', meaning: '小溪', example: 'Fish swim in the clear stream.', example_zh: '魚在清澈的小溪裡游泳。' }
    ],
    phrases: [
      { phrase: 'set up', meaning: '搭建；設置', example: 'Let\'s set up the chairs for the show.', example_zh: '我們為表演擺好椅子吧。' },
      { phrase: 'sat around', meaning: '圍坐著', example: 'The family sat around the dinner table.', example_zh: '家人圍坐在餐桌旁。' },
      { phrase: 'woke up to', meaning: '被…叫醒', example: 'I woke up to the alarm clock.', example_zh: '我被鬧鐘叫醒。' }
    ],
    grammar: [
      { point: 'Past Tense Narrative（過去式敘事）', explanation: '用過去式來敘述一連串已發生的事件。', examples: [{ en: 'We drove for two hours. Dad told us stories. I saw a deer.', zh: '我們開了兩個小時的車。爸爸給我們講故事。我看到了一隻鹿。' }] },
      { point: 'while（當…的時候）', explanation: '用 while 連接同時發生的兩件事。', examples: [{ en: 'Dad set up the tent while Mom prepared lunch.', zh: '爸爸搭帳篷的時候，媽媽準備午餐。' }, { en: 'I read a book while my sister watched TV.', zh: '我看書的時候，我姊姊在看電視。' }] }
    ],
    questions: [
      { question: 'How long did it take to drive to the campground?', options: ['One hour', 'Two hours', 'Three hours', 'Four hours'], answer: 1 },
      { question: 'What did they roast over the campfire?', options: ['Hot dogs', 'Corn', 'Marshmallows', 'Fish'], answer: 2 },
      { question: 'What animal did the narrator see near the stream?', options: ['A bear', 'A rabbit', 'A deer', 'A fox'], answer: 2 }
    ]
  },
  {
    id: 10, grade: 3, order: 2,
    title: 'Under the Sea',
    topic: 'Marine Life',
    content: 'The ocean is one of the most amazing places on Earth. It covers more than seventy percent of our planet. Many wonderful creatures live under the sea.\n\nCoral reefs are like underwater cities. Colorful fish swim between the coral. Clownfish hide in sea anemones for protection. Sea turtles glide slowly through the warm water, and dolphins jump playfully above the waves.\n\nDeep in the ocean, it is very dark. Strange animals live there, like the anglerfish. It has a light on its head to attract other fish. Giant squid can grow as long as a school bus!\n\nSadly, the ocean faces many problems. Pollution and plastic waste hurt sea animals. We should all try to keep our oceans clean. Every small action can make a big difference.',
    content_zh: '海洋是地球上最令人驚嘆的地方之一。它覆蓋了我們星球百分之七十以上的面積。許多奇妙的生物住在海裡。\n\n珊瑚礁就像水下城市。色彩繽紛的魚在珊瑚之間游泳。小丑魚躲在海葵裡獲得保護。海龜慢慢地滑過溫暖的水域，海豚在波浪上方嬉戲地跳躍。\n\n在海洋深處，非常黑暗。那裡住著奇怪的動物，像是鮟鱇魚。牠頭上有一盞燈來吸引其他魚。巨型魷魚可以長得和校車一樣長！\n\n可悲的是，海洋面臨許多問題。污染和塑膠垃圾傷害了海洋動物。我們都應該努力保持海洋乾淨。每一個小小的行動都能帶來很大的改變。',
    vocabulary: [
      { word: 'creature', pos: 'n.', meaning: '生物', example: 'The forest is home to many creatures.', example_zh: '森林是許多生物的家。' },
      { word: 'coral', pos: 'n.', meaning: '珊瑚', example: 'Coral grows slowly in warm water.', example_zh: '珊瑚在溫暖的水中慢慢生長。' },
      { word: 'protection', pos: 'n.', meaning: '保護', example: 'Helmets give protection to your head.', example_zh: '頭盔保護你的頭部。' },
      { word: 'attract', pos: 'v.', meaning: '吸引', example: 'Bright lights attract insects at night.', example_zh: '明亮的燈光在夜晚吸引昆蟲。' },
      { word: 'pollution', pos: 'n.', meaning: '污染', example: 'Air pollution is bad for our health.', example_zh: '空氣污染對我們的健康有害。' },
      { word: 'planet', pos: 'n.', meaning: '星球', example: 'Earth is the third planet from the sun.', example_zh: '地球是離太陽第三近的星球。' }
    ],
    phrases: [
      { phrase: 'more than', meaning: '超過', example: 'More than fifty students signed up.', example_zh: '超過五十個學生報名了。' },
      { phrase: 'as long as', meaning: '和…一樣長', example: 'The snake is as long as my arm.', example_zh: '那條蛇和我的手臂一樣長。' },
      { phrase: 'make a difference', meaning: '帶來改變', example: 'Your help can make a difference.', example_zh: '你的幫助可以帶來改變。' }
    ],
    grammar: [
      { point: 'Comparisons with like（用 like 做比喻）', explanation: '用 like 來比較兩個事物的相似之處。', examples: [{ en: 'Coral reefs are like underwater cities.', zh: '珊瑚礁就像水下城市。' }, { en: 'She sings like a bird.', zh: '她唱歌像小鳥一樣。' }] },
      { point: 'should（應該）', explanation: '用 should 來表示建議或責任。', examples: [{ en: 'We should keep our oceans clean.', zh: '我們應該保持海洋乾淨。' }, { en: 'You should eat more vegetables.', zh: '你應該多吃蔬菜。' }] }
    ],
    questions: [
      { question: 'How much of Earth does the ocean cover?', options: ['Fifty percent', 'Sixty percent', 'More than seventy percent', 'Ninety percent'], answer: 2 },
      { question: 'Where do clownfish hide?', options: ['Under rocks', 'In sea anemones', 'In caves', 'In sand'], answer: 1 },
      { question: 'What problem does the ocean face?', options: ['Too many fish', 'Not enough water', 'Pollution and plastic waste', 'Too much sunlight'], answer: 2 }
    ]
  },
  {
    id: 11, grade: 3, order: 3,
    title: 'The Science Fair',
    topic: 'Science',
    content: 'Our school had a science fair last Friday. Every student had to create a project and present it to the judges. I was excited but also a little worried.\n\nI decided to make a volcano for my project. I used clay to shape the mountain and mixed baking soda with vinegar to make it erupt. When I tested it at home, the lava bubbled up and spilled everywhere! My mom was not happy about the mess.\n\nAt the science fair, many students had interesting projects. My friend Sophia made a solar system model. Another classmate grew plants with different types of water to see which one grew the tallest.\n\nWhen it was my turn, I explained how the chemical reaction works. The judges watched the eruption and clapped their hands. I won second place! I learned that science can be fun when you do experiments yourself.',
    content_zh: '上週五我們學校舉辦了科學展覽。每個學生都必須做一個專題報告給評審看。我很興奮，但也有點擔心。\n\n我決定做一座火山當作我的專題。我用黏土塑造山的形狀，然後混合小蘇打和醋讓它噴發。我在家測試的時候，岩漿冒出來，到處溢出來！我媽媽對那個混亂不太開心。\n\n在科學展覽上，很多學生有有趣的專題。我的朋友蘇菲亞做了一個太陽系模型。另一個同學用不同的水種植物，看哪一棵長得最高。\n\n輪到我的時候，我解釋了化學反應是怎麼運作的。評審看了噴發後鼓掌。我得了第二名！我學到了當你自己做實驗時，科學可以很好玩。',
    vocabulary: [
      { word: 'project', pos: 'n.', meaning: '專題；計畫', example: 'We worked on a group project together.', example_zh: '我們一起做了一個小組專題。' },
      { word: 'judges', pos: 'n.', meaning: '評審', example: 'The judges chose the best painting.', example_zh: '評審選了最好的畫。' },
      { word: 'erupt', pos: 'v.', meaning: '噴發', example: 'The volcano could erupt at any time.', example_zh: '那座火山隨時可能噴發。' },
      { word: 'chemical', pos: 'adj.', meaning: '化學的', example: 'A chemical reaction produces heat.', example_zh: '化學反應會產生熱量。' },
      { word: 'experiment', pos: 'n.', meaning: '實驗', example: 'We did an experiment in the lab.', example_zh: '我們在實驗室做了一個實驗。' },
      { word: 'model', pos: 'n.', meaning: '模型', example: 'He built a model airplane.', example_zh: '他做了一架模型飛機。' }
    ],
    phrases: [
      { phrase: 'decided to', meaning: '決定要', example: 'She decided to study harder this year.', example_zh: '她決定今年更努力讀書。' },
      { phrase: 'it was my turn', meaning: '輪到我了', example: 'I waited until it was my turn to speak.', example_zh: '我等到輪到我說話。' },
      { phrase: 'clapped their hands', meaning: '鼓掌', example: 'The audience clapped their hands loudly.', example_zh: '觀眾大聲鼓掌。' }
    ],
    grammar: [
      { point: 'had to（必須）', explanation: 'had to 是 have to 的過去式，表示過去必須做某事。', examples: [{ en: 'Every student had to create a project.', zh: '每個學生都必須做一個專題。' }, { en: 'I had to finish my homework before dinner.', zh: '我必須在晚餐前完成功課。' }] },
      { point: 'Superlatives（最高級）', explanation: '用 the + -est 或 the most + 形容詞來表示最高級。', examples: [{ en: 'Which plant grew the tallest?', zh: '哪棵植物長得最高？' }, { en: 'She is the smartest student in our class.', zh: '她是我們班最聰明的學生。' }] }
    ],
    questions: [
      { question: 'What did the narrator make for the science fair?', options: ['A robot', 'A volcano', 'A solar system', 'A plant experiment'], answer: 1 },
      { question: 'What materials caused the eruption?', options: ['Water and soap', 'Baking soda and vinegar', 'Oil and water', 'Salt and sugar'], answer: 1 },
      { question: 'What place did the narrator win?', options: ['First place', 'Second place', 'Third place', 'No prize'], answer: 1 }
    ]
  },
  {
    id: 12, grade: 3, order: 4,
    title: 'A Letter to Grandma',
    topic: 'Communication',
    content: 'Dear Grandma,\n\nI am writing this letter to tell you about my life. I miss you a lot since you moved to Taichung. Mom says we will visit you during the summer holiday.\n\nSchool is going well. I got an A on my math test last week! My teacher, Mrs. Chen, said she was proud of me. I have been practicing multiplication tables every night. It is hard, but I am getting better.\n\nI also joined the school basketball team. We practice every Tuesday and Thursday after school. Our first game is next month. I hope you can come and watch me play!\n\nDad is teaching me how to cook simple meals. Yesterday, I made scrambled eggs all by myself. They were a little salty, but Dad said they were delicious.\n\nPlease write back soon. I love you, Grandma!\n\nLove,\nMei-Lin',
    content_zh: '親愛的奶奶，\n\n我寫這封信要告訴您我的生活。自從您搬到台中之後，我很想您。媽媽說我們暑假會去看您。\n\n學校一切都很好。上週我的數學考試得了 A！我的老師陳老師說她為我感到驕傲。我每天晚上都在練習乘法表。雖然很難，但我越來越好了。\n\n我也加入了學校的籃球隊。我們每週二和週四放學後練習。我們的第一場比賽在下個月。我希望你能來看我比賽！\n\n爸爸在教我怎麼做簡單的料理。昨天，我自己做了炒蛋。有點鹹，但爸爸說很好吃。\n\n請快點回信。我愛您，奶奶！\n\n愛您的，\n美琳',
    vocabulary: [
      { word: 'letter', pos: 'n.', meaning: '信', example: 'I received a letter from my pen pal.', example_zh: '我收到了筆友的一封信。' },
      { word: 'multiplication', pos: 'n.', meaning: '乘法', example: 'Multiplication is part of math class.', example_zh: '乘法是數學課的一部分。' },
      { word: 'practicing', pos: 'v.', meaning: '練習', example: 'She is practicing the piano every day.', example_zh: '她每天都在練鋼琴。' },
      { word: 'joined', pos: 'v.', meaning: '加入（過去式）', example: 'He joined the soccer club last month.', example_zh: '他上個月加入了足球社。' },
      { word: 'delicious', pos: 'adj.', meaning: '美味的', example: 'The cake tastes delicious.', example_zh: '蛋糕嘗起來很美味。' },
      { word: 'simple', pos: 'adj.', meaning: '簡單的', example: 'It is a simple question.', example_zh: '這是一個簡單的問題。' }
    ],
    phrases: [
      { phrase: 'a lot', meaning: '很多', example: 'Thank you a lot for your help.', example_zh: '非常感謝你的幫助。' },
      { phrase: 'by myself', meaning: '我自己', example: 'I can tie my shoes by myself.', example_zh: '我可以自己綁鞋帶。' },
      { phrase: 'getting better', meaning: '越來越好', example: 'Her English is getting better every day.', example_zh: '她的英語每天都越來越好。' }
    ],
    grammar: [
      { point: 'Present Perfect Continuous（現在完成進行式）', explanation: '用 have/has been + V-ing 來表示從過去開始持續到現在的動作。', examples: [{ en: 'I have been practicing multiplication tables.', zh: '我一直在練習乘法表。' }, { en: 'She has been learning English for three years.', zh: '她已經學了三年英文了。' }] },
      { point: 'hope + can（希望能…）', explanation: '用 hope 表示對未來的期望。', examples: [{ en: 'I hope you can come and watch me play.', zh: '我希望你能來看我比賽。' }, { en: 'We hope it will be sunny tomorrow.', zh: '我們希望明天是晴天。' }] }
    ],
    questions: [
      { question: 'Where does Grandma live now?', options: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan'], answer: 2 },
      { question: 'What sport did Mei-Lin join?', options: ['Soccer', 'Swimming', 'Basketball', 'Baseball'], answer: 2 },
      { question: 'What did Mei-Lin cook by herself?', options: ['Rice', 'Noodles', 'Scrambled eggs', 'Soup'], answer: 2 }
    ]
  }
];
