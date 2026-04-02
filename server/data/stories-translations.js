// Story translations (Traditional Chinese) and grammar notes
// Keyed by story ID
module.exports = {
  // ============================================================
  // Series 1: Detective Lin (Episodes 1-10)
  // ============================================================
  1: {
    contentZh: "林偵探在台北一家大型科技公司工作。他不是警察偵探。他是公司內部安全團隊的負責人。某個星期一早上，他的電話響了。是財務部的陳小姐打來的。她聽起來非常擔心。「有人從我桌上拿走了季度銷售報告，」她說。「我星期五晚上把它放在那裡，現在不見了。」林偵探走到八樓的財務部。他仔細檢查了陳小姐的桌子。沒有任何人強行打開抽屜的跡象。其他東西都整齊有序。「還有誰有這間辦公室的鑰匙？」他問。陳小姐想了一下。「只有王經理和清潔人員，」她回答。林檢查了週末的監視器畫面。他看到了一些有趣的東西。星期六下午，有人用門禁卡進入了辦公室。那個人戴著帽子，低著頭避開攝影機。「這不是一個簡單的案子，」林心想。他決定接下來檢查門禁卡紀錄。失蹤的報告包含了公司最大客戶的敏感財務資料。如果這些資訊落入競爭對手手中，可能會造成嚴重損害。林偵探知道他必須盡快找到那份報告。",
    grammarNotes: {
      vocabulary: [
        { word: "detective", pos: "noun", meaning: "偵探；調查員", usage: "指負責調查案件或事件的人", example: "Detective Lin worked for a large technology company.", exampleZh: "林偵探在一家大型科技公司工作。" },
        { word: "quarterly", pos: "adjective", meaning: "季度的", usage: "指每三個月一次的", example: "Someone took the quarterly sales report.", exampleZh: "有人拿走了季度銷售報告。" },
        { word: "security", pos: "noun", meaning: "安全；保安", usage: "指保護人員或財產的措施或部門", example: "He was the head of the security team.", exampleZh: "他是安全團隊的負責人。" },
        { word: "sensitive", pos: "adjective", meaning: "敏感的", usage: "指需要謹慎處理、不宜公開的", example: "The report contained sensitive financial data.", exampleZh: "報告包含敏感的財務資料。" },
        { word: "competitor", pos: "noun", meaning: "競爭對手", usage: "指在商業上與你競爭的公司或個人", example: "If this information reached a competitor, it could cause serious damage.", exampleZh: "如果這些資訊落入競爭對手手中，可能會造成嚴重損害。" }
      ],
      phrases: [
        { phrase: "forced open", meaning: "強行打開", example: "There were no signs that someone had forced open the drawers.", exampleZh: "沒有任何人強行打開抽屜的跡象。" },
        { phrase: "kept their head down", meaning: "低著頭", example: "The person kept their head down to avoid the camera.", exampleZh: "那個人低著頭避開攝影機。" }
      ],
      grammar: [
        { point: "過去簡單式（Past Simple）", explanation: "用來描述過去已經完成的動作，規則動詞加 -ed，不規則動詞需要背誦。", example: "Detective Lin walked to the finance department.", exampleZh: "林偵探走到了財務部。" },
        { point: "被動語態（Passive Voice）", explanation: "用「be + 過去分詞」表示主詞是動作的承受者。", example: "The report was taken from my desk.", exampleZh: "報告從我桌上被拿走了。" }
      ]
    }
  },
  2: {
    contentZh: "林偵探去了資訊部檢查門禁卡紀錄。每次員工用卡進入房間，系統都會記錄下來。資訊部經理黃先生在電腦上調出了紀錄。「在這裡，」黃先生說。「星期六下午兩點十五分，有人用門禁卡編號3847進入了財務辦公室。」林查了員工資料庫。門禁卡3847屬於李凱文，一個三個月前才加入公司的初級會計師。林在六樓的辦公桌旁找到了凱文。凱文是個戴眼鏡的年輕人。當林自我介紹時，他看起來很緊張。「你星期六有在辦公室嗎？」林問。凱文快速搖了搖頭。「沒有，我整個週末都在家。我可以給你看我的社群媒體貼文。」林要求看凱文的門禁卡。凱文翻遍了他的皮夾和抽屜，但找不到。「我想我上週弄丟了，」凱文承認。「我本來要去報失，但我忘了。」這是一個重要的線索。有人偷了凱文的門禁卡，用它進入財務辦公室。但是是誰？林要求凱文列出過去一週他去過的每個地方。他還請資訊部檢查週末期間是否有人存取了公司的電腦網路。",
    grammarNotes: {
      vocabulary: [
        { word: "employee", pos: "noun", meaning: "員工", usage: "指在公司或組織工作的人", example: "Every time an employee used their card, the system recorded it.", exampleZh: "每次員工使用門禁卡，系統都會記錄。" },
        { word: "database", pos: "noun", meaning: "資料庫", usage: "指電腦中有組織地儲存大量資料的系統", example: "Lin checked the employee database.", exampleZh: "林查了員工資料庫。" },
        { word: "accountant", pos: "noun", meaning: "會計師", usage: "指負責管理財務帳目的專業人員", example: "Kevin was a junior accountant.", exampleZh: "凱文是一個初級會計師。" },
        { word: "admit", pos: "verb", meaning: "承認", usage: "指接受或承認某件不好的事", example: "\"I think I lost it last week,\" Kevin admitted.", exampleZh: "「我想我上週弄丟了，」凱文承認。" },
        { word: "access", pos: "verb/noun", meaning: "存取；進入", usage: "指使用或進入某個系統或地方的能力", example: "He asked if anyone had accessed the computer network.", exampleZh: "他問是否有人存取了電腦網路。" }
      ],
      phrases: [
        { phrase: "pulled up", meaning: "調出（資料）", example: "Mr. Huang pulled up the records on his computer.", exampleZh: "黃先生在電腦上調出了紀錄。" },
        { phrase: "shook his head", meaning: "搖頭", example: "Kevin shook his head quickly.", exampleZh: "凱文快速搖了搖頭。" }
      ],
      grammar: [
        { point: "過去完成式（Past Perfect）", explanation: "用「had + 過去分詞」表示在過去某個時間點之前已經完成的動作。", example: "Kevin had only joined the company three months ago.", exampleZh: "凱文才在三個月前加入公司。" },
        { point: "間接問句（Indirect Questions）", explanation: "在 ask 後面接的問句不用倒裝，語序和陳述句相同。", example: "Lin asked to see Kevin's key card.", exampleZh: "林要求查看凱文的門禁卡。" }
      ]
    }
  },
  3: {
    contentZh: "在調查遺失門禁卡的同時，林請資訊部檢查了公司的電子郵件系統。黃先生發現了一些不尋常的事。在過去一個月裡，有人從財務部發送郵件到一個外部電子郵件地址。這些郵件都在深夜發送，通常在晚上十一點之後。它們包含了帶有財務資料的附件，包括客戶名單和定價資訊。「你能告訴我是哪台電腦發送的這些郵件嗎？」林問。黃先生在鍵盤上快速打字。「它們全部來自同一台電腦，就是財務部F-12號桌上的那台。」林查看了辦公室的座位圖。F-12號桌屬於吳艾美，一位資深財務分析師。她在公司工作了五年，擁有優秀的名聲。林很驚訝。他決定不直接找艾美對質。相反地，他請黃先生悄悄監控她的電腦活動。那天晚上，林留在辦公室加班。晚上十一點半，他看到財務部的燈亮了。他安靜地走到門口，透過玻璃窗往裡看。有人坐在艾美的桌子前，但不是艾美。那個人穿著深色外套，正快速打字。林用手機拍了一張照片。他想在採取行動之前，先看看那個人接下來會做什麼。",
    grammarNotes: {
      vocabulary: [
        { word: "investigate", pos: "verb", meaning: "調查", usage: "指對某件事進行深入的檢查和研究", example: "While investigating the missing key card, Lin asked the IT department to check.", exampleZh: "在調查遺失門禁卡的同時，林請資訊部進行檢查。" },
        { word: "attachment", pos: "noun", meaning: "附件", usage: "指電子郵件中附加的檔案", example: "The emails contained attachments with financial data.", exampleZh: "郵件包含了帶有財務資料的附件。" },
        { word: "financial", pos: "adjective", meaning: "財務的", usage: "指與金錢或財務管理相關的", example: "She was a senior financial analyst.", exampleZh: "她是一位資深財務分析師。" },
        { word: "confront", pos: "verb", meaning: "對質", usage: "指直接面對某人，通常是質問或挑戰", example: "He decided not to confront Amy directly.", exampleZh: "他決定不直接找艾美對質。" },
        { word: "monitor", pos: "verb", meaning: "監控", usage: "指持續觀察或追蹤某事物", example: "He asked Mr. Huang to monitor her computer activity.", exampleZh: "他請黃先生監控她的電腦活動。" }
      ],
      phrases: [
        { phrase: "turned on", meaning: "打開（電燈等）", example: "He saw the light turn on in the finance department.", exampleZh: "他看到財務部的燈亮了。" },
        { phrase: "making a move", meaning: "採取行動", example: "He wanted to see what the person would do before making a move.", exampleZh: "他想在採取行動之前先觀察。" }
      ],
      grammar: [
        { point: "過去進行式（Past Continuous）", explanation: "用「was/were + 動詞ing」表示過去某個時間正在進行的動作。", example: "Someone was sitting at Amy's desk and typing quickly.", exampleZh: "有人坐在艾美的桌子前正快速打字。" },
        { point: "關係子句（Relative Clauses）", explanation: "用 who, which, that 等關係代名詞來修飾前面的名詞。", example: "Amy Wu, who had worked at the company for five years, had an excellent reputation.", exampleZh: "吳艾美在公司工作了五年，擁有優秀的名聲。" }
      ]
    }
  },
  4: {
    contentZh: "林透過玻璃看著那個人在艾美桌前打完字。那個人站起來，把一個USB隨身碟放進口袋。然後他走向門口。林退後一步，躲在走廊上一棵大盆栽後面。當那個人出來時，林在走廊的燈光下清楚看到了他的臉。是蔡大衛，資訊部的系統管理員。大衛因為工作需要維護電腦系統，所以有權進入大樓的許多區域。林保持距離跟蹤大衛。大衛走到停車場，上了車，開走了。第二天早上，林對蔡大衛做了一些調查。他在公司工作了兩年。他的績效評估是普通的。但林在大衛的人事檔案中注意到一件有趣的事。加入這家公司之前，大衛曾在Nexus科技公司工作，而那正是他們最大的競爭對手。林打電話給Nexus科技的一位聯絡人。「蔡大衛？是的，他在這裡工作了三年，」聯絡人說。「他突然離職了。有一些關於他洩漏資訊的傳聞，但我們一直無法證實。」林現在有了一個強烈的嫌疑人。大衛有技術能力竊取凱文的門禁卡資料、存取艾美的電腦和發送郵件。但林需要確鑿的證據才能採取行動。",
    grammarNotes: {
      vocabulary: [
        { word: "administrator", pos: "noun", meaning: "管理員", usage: "指負責管理系統或組織的人", example: "David Tsai was a system administrator from the IT department.", exampleZh: "蔡大衛是資訊部的系統管理員。" },
        { word: "maintain", pos: "verb", meaning: "維護", usage: "指保持某物在良好的工作狀態", example: "His job was maintaining the computer systems.", exampleZh: "他的工作是維護電腦系統。" },
        { word: "personnel", pos: "adjective/noun", meaning: "人事的；人員", usage: "指與員工或人力資源相關的", example: "Lin noticed something in David's personnel file.", exampleZh: "林在大衛的人事檔案中注意到一些事。" },
        { word: "suspect", pos: "noun", meaning: "嫌疑人", usage: "指被懷疑犯罪的人", example: "Lin now had a strong suspect.", exampleZh: "林現在有了一個強烈的嫌疑人。" },
        { word: "evidence", pos: "noun", meaning: "證據", usage: "指能證明某事為真的資料或事實", example: "Lin needed solid evidence before he could act.", exampleZh: "林需要確鑿的證據才能採取行動。" }
      ],
      phrases: [
        { phrase: "stepped back", meaning: "退後一步", example: "Lin stepped back and hid behind a large plant.", exampleZh: "林退後一步，躲在一棵大盆栽後面。" },
        { phrase: "at a distance", meaning: "保持距離", example: "Lin followed David at a distance.", exampleZh: "林保持距離跟蹤大衛。" }
      ],
      grammar: [
        { point: "過去完成式（Past Perfect）", explanation: "用「had + 過去分詞」表示在另一個過去動作之前已完成的動作。", example: "Before joining this company, David had worked at Nexus Technologies.", exampleZh: "在加入這家公司之前，大衛曾在Nexus科技工作。" },
        { point: "不定詞的用法（Infinitives）", explanation: "to + 原形動詞可以表示目的或意圖。", example: "The person kept their head down to avoid the camera.", exampleZh: "那個人低著頭以避開攝影機。" }
      ]
    }
  },
  5: {
    contentZh: "林偵探有一個計畫。他請陳小姐製作了一份假文件。它看起來像是一份新產品的真實提案，但所有細節都是編造的。林把這份文件放在財務部共用硬碟的一個特殊資料夾裡。黃先生幫他設置了一個追蹤系統。如果有人複製或寄出這份假文件，他們會立刻知道。林還請大樓保全團隊在艾美桌子附近安裝了一個小型隱藏攝影機。「我們需要當場抓住他，」林告訴他的團隊。三天過去了，什麼事都沒發生。林開始擔心。也許大衛注意到了什麼不同。也許他已經停止了活動。但在星期四晚上，警報來了。有人在晚上十一點四十七分打開了假文件。幾分鐘後，這份文件被附加在一封寄往外部地址的郵件中。林趕到辦公室。這次，他帶了兩名保全人員。他們搭電梯到八樓，快步但安靜地走到財務部。透過玻璃門，他們可以看到大衛坐在電腦前。林打開門。「大衛，請離開電腦，」他堅定地說。大衛的臉變得慘白。他試圖從電腦拔出USB隨身碟，但保全人員動作更快。",
    grammarNotes: {
      vocabulary: [
        { word: "proposal", pos: "noun", meaning: "提案", usage: "指正式提出的計畫或建議", example: "It looked like a real proposal for a new product.", exampleZh: "它看起來像是一份新產品的真實提案。" },
        { word: "install", pos: "verb", meaning: "安裝", usage: "指設置或放置設備使其可以使用", example: "He asked the security team to install a hidden camera.", exampleZh: "他請保全團隊安裝了一個隱藏攝影機。" },
        { word: "alert", pos: "noun", meaning: "警報", usage: "指通知某人注意危險或重要事件的信號", example: "On Thursday night, the alert came.", exampleZh: "星期四晚上，警報來了。" },
        { word: "attach", pos: "verb", meaning: "附加；夾帶", usage: "指將檔案附加到郵件中", example: "The document was attached to an email.", exampleZh: "文件被附加在一封郵件中。" },
        { word: "firmly", pos: "adverb", meaning: "堅定地", usage: "指用堅定、不容質疑的態度", example: "\"David, please step away from the computer,\" he said firmly.", exampleZh: "「大衛，請離開電腦，」他堅定地說。" }
      ],
      phrases: [
        { phrase: "set up", meaning: "設置；架設", example: "Mr. Huang helped him set up a tracking system.", exampleZh: "黃先生幫他設置了追蹤系統。" },
        { phrase: "caught in the act", meaning: "當場抓住", example: "We need to catch him in the act.", exampleZh: "我們需要當場抓住他。" }
      ],
      grammar: [
        { point: "被動語態（Passive Voice）", explanation: "用「be + 過去分詞」表示主詞是動作的承受者，強調動作而非執行者。", example: "The document was attached to an email going to an outside address.", exampleZh: "文件被附加在一封寄往外部地址的郵件中。" },
        { point: "條件句（Conditional Sentences）", explanation: "用 if 引導的子句表示條件，主句表示結果。", example: "If anyone copied the fake document, they would know immediately.", exampleZh: "如果有人複製了假文件，他們會立刻知道。" }
      ]
    }
  },
  6: {
    contentZh: "林把大衛帶到三樓的安全辦公室。大衛坐在椅子上，低頭看著桌子。他好幾分鐘都沒有說話。「我們有監視器畫面顯示你多次在夜間進入財務部，」林說。「我們也有紀錄顯示公司機密從吳艾美的電腦被寄到外部電子郵件地址。今晚，我們抓到你坐在她的桌前。」大衛保持沉默。林繼續說，「我們追蹤了那個外部郵件地址。它屬於一家在香港註冊的空殼公司。但我們相信真正的收件人是Nexus科技，你的前僱主。」大衛終於抬起頭。「我要找律師，」他安靜地說。「你可以找律師，」林回答。「但我要讓你知道一件事。你今晚複製的文件是假的。我們製作它就是為了抓你。所以不管你跟Nexus有什麼交易，他們很快就會知道你的資訊是不可靠的。」大衛的表情改變了。他似乎意識到自己的處境非常糟糕。沉默了很久之後，他開始說話。「他們給了我很多錢，」大衛承認。「如果我能拿到客戶資料庫和新產品開發計畫，就給我兩百萬美元。我因為個人債務需要這筆錢。」",
    grammarNotes: {
      vocabulary: [
        { word: "interrogation", pos: "noun", meaning: "審問", usage: "指對嫌疑人進行正式的詢問", example: "Lin brought David to the security office for interrogation.", exampleZh: "林把大衛帶到安全辦公室進行審問。" },
        { word: "footage", pos: "noun", meaning: "影片片段", usage: "指監視器或攝影機錄下的影像", example: "We have security camera footage of you.", exampleZh: "我們有你的監視器畫面。" },
        { word: "trace", pos: "verb", meaning: "追蹤", usage: "指追查某物的來源或去向", example: "We traced the outside email address.", exampleZh: "我們追蹤了那個外部郵件地址。" },
        { word: "registered", pos: "adjective", meaning: "註冊的", usage: "指已正式登記的", example: "It belongs to a shell company registered in Hong Kong.", exampleZh: "它屬於一家在香港註冊的空殼公司。" },
        { word: "unreliable", pos: "adjective", meaning: "不可靠的", usage: "指不能信賴的、不穩定的", example: "They will know that your information is unreliable.", exampleZh: "他們會知道你的資訊是不可靠的。" }
      ],
      phrases: [
        { phrase: "remained silent", meaning: "保持沉默", example: "David remained silent.", exampleZh: "大衛保持沉默。" },
        { phrase: "started talking", meaning: "開始說話", example: "After a long pause, he started talking.", exampleZh: "沉默了很久之後，他開始說話。" }
      ],
      grammar: [
        { point: "直接引語與間接引語", explanation: "直接引語用引號引述原話，間接引語則轉述他人的話，需要改變人稱和時態。", example: "\"I want a lawyer,\" he said quietly.", exampleZh: "「我要找律師，」他安靜地說。" },
        { point: "條件句（If clauses）", explanation: "用 if 表示假設條件，可以是真實或假設的情境。", example: "If I could get the client database, they would give me two million dollars.", exampleZh: "如果我能拿到客戶資料庫，他們就會給我兩百萬美元。" }
      ]
    }
  },
  7: {
    contentZh: "大衛的自白揭露了比林預期更多的事情。大衛解釋說他不是獨自行動。公司內部有人先接觸了他，並建議了這個計畫。這個人知道大衛跟Nexus科技有關係，而且他正面臨財務困難。「是誰接觸你的？」林問。大衛猶豫了一下。「我只知道他們的代號。他們自稱『鳳凰』。我們透過手機應用程式的加密訊息溝通。鳳凰告訴我該偷哪些文件，以及什麼時候發送。」林請大衛給他看手機上的訊息。大部分訊息已經被自動刪除了，但還有幾則留著。林注意到其中一則訊息提到在特定日期和時間在公司餐廳碰面。林查看了那天餐廳的監視器。他看到大衛獨自坐在一張桌子旁。幾分鐘後，有人坐到他對面。攝影機角度不太完美，但林可以看出那是一個戴著公司識別證的女性。她在桌子底下遞了什麼東西給大衛。看起來像是一個小信封。林盡可能放大了影像。他無法清楚看到那個女人的臉，但他注意到她戴著一條獨特的銀手鐲。現在他有了一個新的線索要追查。",
    grammarNotes: {
      vocabulary: [
        { word: "confession", pos: "noun", meaning: "自白；坦白", usage: "指承認自己犯了錯或罪的聲明", example: "David's confession revealed more than Lin expected.", exampleZh: "大衛的自白揭露了比林預期更多的事。" },
        { word: "approach", pos: "verb", meaning: "接近；接洽", usage: "指走近某人或主動聯繫某人", example: "Someone inside the company had first approached him.", exampleZh: "公司內部有人先接觸了他。" },
        { word: "encrypted", pos: "adjective", meaning: "加密的", usage: "指用密碼保護的，需要特殊金鑰才能讀取", example: "They communicated through encrypted messages.", exampleZh: "他們透過加密訊息溝通。" },
        { word: "enhance", pos: "verb", meaning: "增強；提升", usage: "指改善或加強某物的品質", example: "Lin enhanced the image as much as possible.", exampleZh: "林盡可能放大增強了影像。" },
        { word: "distinctive", pos: "adjective", meaning: "獨特的；有特色的", usage: "指容易辨認的、與眾不同的", example: "She was wearing a distinctive silver bracelet.", exampleZh: "她戴著一條獨特的銀手鐲。" }
      ],
      phrases: [
        { phrase: "working alone", meaning: "獨自行動", example: "He was not working alone.", exampleZh: "他不是獨自行動。" },
        { phrase: "passed something under the table", meaning: "在桌子底下遞東西", example: "She passed something under the table to David.", exampleZh: "她在桌子底下遞了什麼東西給大衛。" }
      ],
      grammar: [
        { point: "過去完成被動式", explanation: "用「had been + 過去分詞」表示在過去某時間之前已被做的事。", example: "Most of the messages had been automatically deleted.", exampleZh: "大部分訊息已經被自動刪除了。" },
        { point: "關係代名詞 who/which/that", explanation: "用來連接兩個句子，修飾前面的名詞，提供更多資訊。", example: "Someone who had connections at Nexus Technologies.", exampleZh: "一個跟Nexus科技有關係的人。" }
      ]
    }
  },
  8: {
    contentZh: "隔天，林走遍了公司的每個部門。他仔細觀察女性員工的手腕，試圖找到監視器畫面中那條獨特的銀手鐲。那是一條寬版的波浪花紋手鐲。在走訪了四個樓層後，林終於看到了。手鐲在郭珍妮的手腕上，她是執行長的行政助理。珍妮幾乎可以進入每個部門，而且在大多數經理之前就知道機密專案的內容。她的職位使她成為完美的內部聯絡人。林沒有立刻接觸珍妮。他回到辦公室，調出了她的人事檔案。她在公司工作了七年，每年都獲得優秀的評價。她的薪水不錯，但不算特別高。林深入調查。他發現珍妮最近在信義區購買了一間昂貴的公寓。價格遠遠超出她的薪水所能負擔的。林還發現珍妮的哥哥在Nexus科技的業務開發部門工作。關聯性越來越清楚了。珍妮擁有內部情報，大衛有技術能力，而珍妮的哥哥可能就是與Nexus的連結。林向公司的法務團隊報告了他的發現。他們同意有足夠的證據採取行動，但他們希望謹慎行事。",
    grammarNotes: {
      vocabulary: [
        { word: "executive", pos: "adjective/noun", meaning: "行政的；高階主管", usage: "指公司高層管理階級或與高層相關的", example: "Jennifer was the executive assistant to the CEO.", exampleZh: "珍妮是執行長的行政助理。" },
        { word: "confidential", pos: "adjective", meaning: "機密的", usage: "指不公開的、需要保密的資訊", example: "She knew about confidential projects before most managers.", exampleZh: "她在大多數經理之前就知道機密專案。" },
        { word: "exceptional", pos: "adjective", meaning: "傑出的；例外的", usage: "指特別好的或超出一般水準的", example: "Her salary was good, but not exceptional.", exampleZh: "她的薪水不錯，但不算特別高。" },
        { word: "purchase", pos: "verb", meaning: "購買", usage: "比 buy 更正式的用法", example: "Jennifer had recently purchased an expensive apartment.", exampleZh: "珍妮最近購買了一間昂貴的公寓。" },
        { word: "afford", pos: "verb", meaning: "負擔得起", usage: "指有足夠的金錢來支付", example: "The price was far beyond what her salary could afford.", exampleZh: "價格遠超出她的薪水所能負擔的。" }
      ],
      phrases: [
        { phrase: "dug deeper", meaning: "深入調查", example: "Lin dug deeper.", exampleZh: "林深入調查。" },
        { phrase: "became clear", meaning: "變得清楚", example: "The connection was becoming clear.", exampleZh: "關聯性越來越清楚了。" }
      ],
      grammar: [
        { point: "比較級與最高級", explanation: "形容詞加 -er/-est 或用 more/most 來比較事物的程度。", example: "The price was far beyond what her salary could afford.", exampleZh: "價格遠超出她薪水所能負擔的。" },
        { point: "使役動詞 make", explanation: "make + 受詞 + 原形動詞，表示「使某人做某事」。", example: "Her position made her the perfect inside contact.", exampleZh: "她的職位使她成為完美的內部聯絡人。" }
      ]
    }
  },
  9: {
    contentZh: "公司的法務團隊與林偵探一起決定找郭珍妮對質。他們邀請她到十樓的會議室。公司的首席律師張先生也在場。珍妮面帶自信的微笑走了進來。「這是關於什麼事？」她問。林給她看了餐廳的監視器照片。「你能解釋為什麼你在桌子底下遞信封給蔡大衛嗎？」珍妮的微笑稍微消退了，但她保持冷靜。「大衛是我的同事。我們只是在吃午餐。我在還他借我的一份文件。」林在桌上放了更多證據——郵件紀錄、大衛的自白，以及顯示她購買昂貴公寓的財務紀錄。「大衛已經把一切都告訴我們了，」林說。「他告訴我們關於鳳凰的事。」珍妮的臉色完全變了。她緊握桌子邊緣，她的銀手鐲在燈光下閃爍。有那麼一刻，房間裡完全安靜。然後珍妮開口了。「你們不了解全貌，」她說。「這比你想的層級更高。Nexus有人已經策劃了好幾年。我只是在聽命行事。」林向前傾身。「誰的命令？」珍妮看了看張先生，然後轉回看林。「我會告訴你們所有的事，但我要保護。他們是危險的人。」",
    grammarNotes: {
      vocabulary: [
        { word: "confrontation", pos: "noun", meaning: "對質", usage: "指直接面對面的衝突或質問", example: "The company decided to confront Jennifer Kuo.", exampleZh: "公司決定找郭珍妮對質。" },
        { word: "colleague", pos: "noun", meaning: "同事", usage: "指在同一個工作場所的工作夥伴", example: "David is my colleague.", exampleZh: "大衛是我的同事。" },
        { word: "confession", pos: "noun", meaning: "自白", usage: "指承認犯錯或犯罪的聲明", example: "Lin placed David's confession on the table.", exampleZh: "林把大衛的自白放在桌上。" },
        { word: "grip", pos: "verb", meaning: "緊握", usage: "指用力抓住某物", example: "She gripped the edge of the table.", exampleZh: "她緊握桌子邊緣。" },
        { word: "protection", pos: "noun", meaning: "保護", usage: "指使某人免受危險的措施", example: "I want protection.", exampleZh: "我要保護。" }
      ],
      phrases: [
        { phrase: "faded slightly", meaning: "稍微消退", example: "Jennifer's smile faded slightly.", exampleZh: "珍妮的微笑稍微消退了。" },
        { phrase: "following orders", meaning: "聽命行事", example: "I was just following orders.", exampleZh: "我只是在聽命行事。" }
      ],
      grammar: [
        { point: "比較級 higher than", explanation: "用 than 連接兩個比較的對象，形容詞用比較級形式。", example: "This goes higher than you think.", exampleZh: "這比你想的層級更高。" },
        { point: "現在完成式（Present Perfect）", explanation: "用「have/has + 過去分詞」表示過去的動作對現在有影響。", example: "David has already told us everything.", exampleZh: "大衛已經把一切都告訴我們了。" }
      ]
    }
  },
  10: {
    contentZh: "珍妮的完整自白花了三個小時。她揭露Nexus科技已經進行了超過兩年的企業間諜行動。她哥哥招募了她，承諾分享利潤。她給了林三名參與接收和使用竊取資訊的Nexus員工名單。公司的法務團隊與警方合作建立了正式案件。蔡大衛和郭珍妮都被解雇並面臨刑事指控。警方還逮捕了珍妮的哥哥和Nexus科技的兩名經理。在接下來的幾週裡，林幫助公司加強了安全系統。他建議了新政策，包括更好的門禁卡管理、定期稽核電子郵件活動，以及更嚴格的敏感文件存取控制。執行長在公司會議上親自感謝了林。「因為林偵探細心且徹底的工作，我們保護了我們的客戶和業務，」執行長說。陳小姐拿回了她的季度報告。它在大衛的個人筆電上被找到，還有幾十份其他被竊的文件。李凱文拿到了新的門禁卡，吳艾美也洗清了嫌疑。當林回到辦公室時，他的電話又響了。「林先生，我是行銷部的。我們的網站發生了一些奇怪的事。」林微笑著拿起筆記本。另一個案件要開始了。",
    grammarNotes: {
      vocabulary: [
        { word: "espionage", pos: "noun", meaning: "間諜活動", usage: "指秘密取得他國或他公司機密資訊的行為", example: "Nexus had been running a corporate espionage operation.", exampleZh: "Nexus一直在進行企業間諜行動。" },
        { word: "terminate", pos: "verb", meaning: "終止；解雇", usage: "指正式結束僱用關係", example: "David and Jennifer were both terminated.", exampleZh: "大衛和珍妮都被解雇了。" },
        { word: "criminal", pos: "adjective", meaning: "刑事的；犯罪的", usage: "指與犯罪或法律制裁相關的", example: "They faced criminal charges.", exampleZh: "他們面臨刑事指控。" },
        { word: "audit", pos: "noun/verb", meaning: "稽核；審計", usage: "指對帳目或系統進行正式的檢查", example: "He recommended regular audits of email activity.", exampleZh: "他建議定期稽核電子郵件活動。" },
        { word: "thorough", pos: "adjective", meaning: "徹底的", usage: "指非常仔細且完整的", example: "Because of Detective Lin's thorough work, we protected our clients.", exampleZh: "因為林偵探徹底的工作，我們保護了客戶。" }
      ],
      phrases: [
        { phrase: "cleared of suspicion", meaning: "洗清嫌疑", example: "Amy Wu was cleared of any suspicion.", exampleZh: "吳艾美洗清了嫌疑。" },
        { phrase: "worked with", meaning: "與...合作", example: "The legal team worked with the police.", exampleZh: "法務團隊與警方合作。" }
      ],
      grammar: [
        { point: "過去完成進行式", explanation: "用「had been + 動詞ing」表示在過去某點之前持續進行的動作。", example: "Nexus had been running an espionage operation for over two years.", exampleZh: "Nexus已經進行間諜行動超過兩年了。" },
        { point: "動名詞作受詞", explanation: "某些動詞後面接動名詞（-ing形式）作為受詞。", example: "He recommended better key card management.", exampleZh: "他建議更好的門禁卡管理。" }
      ]
    }
  },

  // ============================================================
  // Series 2: Sarah's Business Trip (Episodes 11-20)
  // ============================================================
  11: {
    contentZh: "陳莎拉在台北的一家貿易公司工作了兩年。她是初級業務代表，而這將是她第一次出國出差。她的經理劉先生在星期一早上把她叫進辦公室。「莎拉，我需要你下週去東京，」他說。「我們的客戶山田株式會社想討論一份新合約。本來應該是我去，但我有行程衝突。」莎拉既興奮又緊張。她從來沒有獨自出差過。「不用擔心，」劉先生說。「我會給你所有需要的資料。只要保持專業，仔細聽他們的需求就好。」那天下午，莎拉開始準備。她審閱了與山田株式會社目前的合約，並研究了他們的公司簡介。她還列了一張要打包的清單，包括名片、筆電和適當的商務服裝。她的同事東尼去過東京很多次。「記得見面時要鞠躬，」東尼建議。「而且遞名片和收名片時一定要用雙手。這在日本的商務文化中非常重要。」莎拉花了整個晚上練習她的簡報。她想留下好印象。她也在手機上下載了翻譯應用程式，以防萬一。她的班機是星期天晚上。",
    grammarNotes: {
      vocabulary: [
        { word: "representative", pos: "noun", meaning: "業務代表", usage: "指代表公司進行銷售或商務活動的人", example: "She was a junior sales representative.", exampleZh: "她是初級業務代表。" },
        { word: "contract", pos: "noun", meaning: "合約", usage: "指具有法律約束力的正式協議", example: "They wanted to discuss a new contract.", exampleZh: "他們想討論一份新合約。" },
        { word: "scheduling", pos: "noun", meaning: "排程；行程安排", usage: "指安排時間或活動的過程", example: "I have a scheduling conflict.", exampleZh: "我有行程衝突。" },
        { word: "appropriate", pos: "adjective", meaning: "適當的", usage: "指合乎場合或情境的", example: "She packed appropriate business attire.", exampleZh: "她打包了適當的商務服裝。" },
        { word: "impression", pos: "noun", meaning: "印象", usage: "指對某人或某事的第一感覺或看法", example: "She wanted to make a good impression.", exampleZh: "她想留下好印象。" }
      ],
      phrases: [
        { phrase: "called her into", meaning: "把她叫進（辦公室等）", example: "Mr. Liu called her into his office.", exampleZh: "劉先生把她叫進辦公室。" },
        { phrase: "just in case", meaning: "以防萬一", example: "She downloaded a translation app, just in case.", exampleZh: "她下載了翻譯應用程式，以防萬一。" }
      ],
      grammar: [
        { point: "be going to 未來式", explanation: "用「be going to + 原形動詞」表示計畫好的未來事件。", example: "This was going to be her first international business trip.", exampleZh: "這將是她第一次出國出差。" },
        { point: "動名詞 vs 不定詞", explanation: "某些動詞後面接動名詞（-ing），某些接不定詞（to + V）。", example: "She spent the evening practicing her presentation.", exampleZh: "她花了整個晚上練習簡報。" }
      ]
    }
  },
  12: {
    contentZh: "星期天晚上，莎拉在班機起飛前兩小時抵達桃園國際機場。她帶了一個小行李箱和一個筆電包。在報到櫃台，航空公司人員要求看她的護照和機票。「您想要靠窗還是靠走道的座位？」工作人員問。「請給我靠走道的座位，」莎拉回答。她覺得在三小時的飛行中這樣比較方便走動。報到後，莎拉通過了安檢和出入境關卡。安檢人員要求她把筆電從包裡拿出來，放在一個單獨的托盤上。一切都很順利。在登機門等候時，莎拉檢查了電子郵件。劉先生寄了簡報投影片的最終版本和一份重要討論要點清單。他也提醒她公司的司機會在成田機場接她。莎拉在附近的商店買了一杯咖啡和一個三明治。她注意到周圍有很多商務旅客，有的在筆電上打字，有的在講電話。「這就是我的世界了，」她帶著微笑想。開始登機時，莎拉和其他乘客一起排隊。她找到座位，把包放進頭頂的置物箱，繫好安全帶。飛機起飛，飛入夜空。莎拉望著窗外台北的燈光。她的冒險即將開始。",
    grammarNotes: {
      vocabulary: [
        { word: "check-in", pos: "noun", meaning: "報到；登機手續", usage: "指在機場或飯店辦理入住或登機的程序", example: "At the check-in counter, the staff asked for her passport.", exampleZh: "在報到櫃台，工作人員要求看她的護照。" },
        { word: "aisle", pos: "noun", meaning: "走道", usage: "指座位之間或貨架之間的通道", example: "An aisle seat, please.", exampleZh: "請給我靠走道的座位。" },
        { word: "immigration", pos: "noun", meaning: "出入境", usage: "指進出國境的檢查程序", example: "Sarah went through security and immigration.", exampleZh: "莎拉通過了安檢和出入境關卡。" },
        { word: "boarding", pos: "noun", meaning: "登機", usage: "指上飛機的過程", example: "When boarding began, Sarah lined up.", exampleZh: "開始登機時，莎拉排隊了。" },
        { word: "compartment", pos: "noun", meaning: "置物箱；隔間", usage: "指飛機座位上方的行李存放空間", example: "She put her bag in the overhead compartment.", exampleZh: "她把包放進頭頂的置物箱。" }
      ],
      phrases: [
        { phrase: "went through", meaning: "通過（檢查）", example: "Sarah went through security and immigration.", exampleZh: "莎拉通過了安檢和出入境。" },
        { phrase: "lined up", meaning: "排隊", example: "Sarah lined up with the other passengers.", exampleZh: "莎拉和其他乘客一起排隊。" }
      ],
      grammar: [
        { point: "比較級用法", explanation: "用形容詞比較級 + than 來比較兩個事物。", example: "She thought it would be easier to move around.", exampleZh: "她覺得這樣比較方便走動。" },
        { point: "過去進行式", explanation: "用 was/were + V-ing 描述過去某時正在進行的動作。", example: "Many travelers were typing on their laptops or talking on their phones.", exampleZh: "很多旅客在筆電上打字或講電話。" }
      ]
    }
  },
  13: {
    contentZh: "莎拉大約在當地時間晚上十點抵達成田機場。通過出入境和海關後，她找到了公司的司機在等她。他舉著一塊寫有她名字的牌子。開車到東京市中心的飯店大約花了一個小時。莎拉透過車窗看著城市的燈光。一切看起來都很現代化且井然有序。飯店是東京車站附近一家舒適的商務旅館。莎拉走到前台。「晚安。我有一個預約，名字是陳莎拉，」她說。接待人員在電腦上輸入後微笑。「是的，陳小姐。我們為您準備了單人房，住四晚。可以看一下您的護照和信用卡嗎？」莎拉遞上了她的證件。接待人員給了她一張房卡，並說明早餐包含在內，在二樓供應，時間是早上七點到九點。她的房間在十二樓。房間不大但非常乾淨。有一張舒適的床、一張附檯燈的書桌和一個小冰箱。浴室有一個深浴缸，莎拉聽說這在日本飯店很常見。她打開行李箱，把明天要穿的商務套裝掛好。上床之前，莎拉又看了一次會議議程。與山田株式會社的會議安排在明天下午兩點。她在手機上設了兩個鬧鐘。她不想第一次拜訪客戶就遲到。",
    grammarNotes: {
      vocabulary: [
        { word: "customs", pos: "noun", meaning: "海關", usage: "指國境上檢查進出口物品的機構", example: "After going through immigration and customs, she found the driver.", exampleZh: "通過出入境和海關後，她找到了司機。" },
        { word: "reservation", pos: "noun", meaning: "預約", usage: "指事先預訂的房間或座位", example: "I have a reservation under the name Sarah Chen.", exampleZh: "我有一個預約，名字是陳莎拉。" },
        { word: "receptionist", pos: "noun", meaning: "接待人員", usage: "指在飯店或辦公室負責接待的人", example: "The receptionist gave her a key card.", exampleZh: "接待人員給了她一張房卡。" },
        { word: "agenda", pos: "noun", meaning: "議程", usage: "指會議中要討論的事項清單", example: "Sarah reviewed the meeting agenda one more time.", exampleZh: "莎拉又看了一次會議議程。" },
        { word: "schedule", pos: "verb", meaning: "安排；排定", usage: "指為某事安排特定的時間", example: "The meeting was scheduled for 2 PM tomorrow.", exampleZh: "會議安排在明天下午兩點。" }
      ],
      phrases: [
        { phrase: "checked in", meaning: "辦理入住", example: "Sarah checked into the hotel.", exampleZh: "莎拉辦理了飯店入住。" },
        { phrase: "hung up", meaning: "掛好（衣服）", example: "She hung up her business suit for the next day.", exampleZh: "她把明天的商務套裝掛好。" }
      ],
      grammar: [
        { point: "被動語態", explanation: "用 be + 過去分詞表示主詞接受動作。", example: "Breakfast was included and served on the second floor.", exampleZh: "早餐包含在內，在二樓供應。" },
        { point: "過去完成式", explanation: "用 had + 過去分詞表示在過去某事之前已完成的動作。", example: "Sarah had heard that deep bathtubs were common in Japanese hotels.", exampleZh: "莎拉聽說深浴缸在日本飯店很常見。" }
      ]
    }
  },
  14: {
    contentZh: "莎拉提前十五分鐘抵達山田株式會社的辦公室。大樓是丸之內商業區的一棟高大玻璃塔。她在一樓的接待處登記，一位名叫由紀的年輕助理來接她。由紀帶莎拉到十五樓的會議室。會議室有一張長桌、一個投影幕，以及美麗的城市景觀。山田株式會社的三位人員已經就座。部門主管山田先生站起來鞠躬。莎拉想起東尼的建議，也鞠躬回禮。她用雙手遞上名片，山田先生也是。「感謝您遠從台北過來，」山田先生用英文說。「我們感謝貴公司的合作關係。」莎拉微笑著感謝他。她架好筆電，開始簡報。她介紹了公司的新產品線以及可以提供的特別定價。山田先生和他的團隊仔細聆聽並做筆記。他們問了幾個關於交貨時間、最低訂購數量和售後服務的問題。莎拉自信地回答了大部分問題。對於一個關於技術規格的問題，她誠實地說，「我需要跟我們的工程團隊確認，明天給您回覆。」山田先生讚許地點點頭。會議持續了大約九十分鐘。最後，雙方同意明天繼續討論。",
    grammarNotes: {
      vocabulary: [
        { word: "projector", pos: "noun", meaning: "投影機", usage: "指用來將影像投射到螢幕上的設備", example: "The room had a long table and a projector screen.", exampleZh: "會議室有一張長桌和投影幕。" },
        { word: "partnership", pos: "noun", meaning: "合作關係", usage: "指兩方之間的商業合作", example: "We appreciate your company's partnership.", exampleZh: "我們感謝貴公司的合作關係。" },
        { word: "pricing", pos: "noun", meaning: "定價", usage: "指產品或服務的價格設定", example: "She explained the special pricing they could offer.", exampleZh: "她介紹了可以提供的特別定價。" },
        { word: "quantity", pos: "noun", meaning: "數量", usage: "指某物的多少或數目", example: "They asked about minimum order quantities.", exampleZh: "他們問了最低訂購數量。" },
        { word: "specification", pos: "noun", meaning: "規格", usage: "指產品的詳細技術要求", example: "For a question about a technical specification, she said she would check.", exampleZh: "對於技術規格的問題，她說會確認。" }
      ],
      phrases: [
        { phrase: "set up", meaning: "架設；準備", example: "She set up her laptop and began the presentation.", exampleZh: "她架好筆電，開始簡報。" },
        { phrase: "get back to", meaning: "回覆", example: "I will get back to you by tomorrow.", exampleZh: "我明天會回覆您。" }
      ],
      grammar: [
        { point: "未來式 will", explanation: "用 will + 原形動詞表示即時的決定或承諾。", example: "I will need to check with our engineering team.", exampleZh: "我需要跟工程團隊確認。" },
        { point: "動名詞作介系詞受詞", explanation: "介系詞後面接動名詞（V-ing）形式。", example: "They asked questions about delivery times.", exampleZh: "他們問了關於交貨時間的問題。" }
      ]
    }
  },
  15: {
    contentZh: "會議結束後，助理由紀提議帶莎拉逛逛附近。在走路的時候，莎拉注意到很多跟台北不同的事。人們站在手扶梯的左邊而不是右邊。街道非常乾淨，幾乎到處都沒有垃圾。「在日本，我們沒有很多公共垃圾桶，」由紀解釋。「人們會帶著垃圾直到回家或找到便利商店。」她們在一家小拉麵店停下來吃晚餐。莎拉注意到周圍的人在大聲吸麵。在台灣，這會被認為是不禮貌的，但由紀告訴她在日本這其實是有禮貌的。「這表示你喜歡這道菜，」由紀笑著說。莎拉也試著吸她的拉麵，這讓她們兩個都笑了。晚餐時，她們聊了在日本和台灣工作的差異。由紀提到日本的會議通常時間較長，因為決策是透過團體共識做出的。「這就是為什麼山田先生今天沒有給你最終答覆，」由紀解釋。「他需要先跟他的團隊討論。」莎拉理解了。她本來擔心會議進展不順利，因為沒有明確的決定。現在她放心多了。她感謝由紀提供的有用建議。了解文化差異跟了解產品細節一樣重要。",
    grammarNotes: {
      vocabulary: [
        { word: "escalator", pos: "noun", meaning: "手扶梯", usage: "指自動移動的電動樓梯", example: "People stood on the left side of the escalator.", exampleZh: "人們站在手扶梯的左邊。" },
        { word: "convenience", pos: "noun", meaning: "便利", usage: "指方便的狀態或便利商店", example: "People carry their trash until they find a convenience store.", exampleZh: "人們帶著垃圾直到找到便利商店。" },
        { word: "consider", pos: "verb", meaning: "認為；考慮", usage: "指看待或認為某事的方式", example: "In Taiwan, this would be considered rude.", exampleZh: "在台灣，這會被認為是不禮貌的。" },
        { word: "consensus", pos: "noun", meaning: "共識", usage: "指團體中所有人都同意的意見", example: "Decisions are made by group consensus.", exampleZh: "決策是透過團體共識做出的。" },
        { word: "decision", pos: "noun", meaning: "決定", usage: "指做出的選擇或判斷", example: "There was no clear decision.", exampleZh: "沒有明確的決定。" }
      ],
      phrases: [
        { phrase: "instead of", meaning: "而不是", example: "People stood on the left instead of the right.", exampleZh: "人們站在左邊而不是右邊。" },
        { phrase: "just as important as", meaning: "跟...一樣重要", example: "Understanding cultural differences was just as important as knowing the product.", exampleZh: "了解文化差異跟了解產品一樣重要。" }
      ],
      grammar: [
        { point: "被動語態 would be considered", explanation: "would be + 過去分詞表示假設情況下的被動。", example: "In Taiwan, this would be considered rude.", exampleZh: "在台灣，這會被認為是不禮貌的。" },
        { point: "原因子句 because/that is why", explanation: "用 because 說明原因，that is why 說明結果。", example: "That is why Mr. Yamada did not give you a final answer today.", exampleZh: "這就是為什麼山田先生今天沒有給你最終答覆。" }
      ]
    }
  },
  16: {
    contentZh: "第二天，莎拉回到山田株式會社進行更詳細的簡報。這次，會議室裡有七個人，包括兩位她之前沒見過的高階主管。山田先生介紹他們是副總裁和採購經理。莎拉感覺心跳加速，但她深呼吸後開始了。她花了一個早上根據昨天的問題更新了投影片。她也從工程團隊收到了技術規格，準備好回答每一個問題。簡報涵蓋了三個主題：產品品質、有競爭力的定價和可靠的交貨時程。莎拉展示了比較圖表和其他亞洲市場的客戶見證。她說得慢而清楚，確保每個人都能跟上她的英文。當她講完後，副總裁問了一個困難的問題。「你們的競爭對手給我們更低的價格。為什麼我們應該選擇你們公司？」莎拉對此有所準備。「我們的價格包含兩年保固和免費技術支援。如果您計算總成本，包括維護費用，我們的報價實際上更具成本效益。」她展示了一張比較總擁有成本的投影片。房間裡安靜了一會兒，然後副總裁點了點頭。「這是一個合理的觀點，」他說。簡報結束後，山田先生私下告訴莎拉，副總裁印象深刻。「我認為我們正朝著好的方向前進，」他說。莎拉感到如釋重負，也很自豪。",
    grammarNotes: {
      vocabulary: [
        { word: "executive", pos: "noun", meaning: "高階主管", usage: "指公司中級別較高的管理人員", example: "Two senior executives she had not met before were present.", exampleZh: "兩位她之前沒見過的高階主管也在場。" },
        { word: "procurement", pos: "noun", meaning: "採購", usage: "指為公司購買商品或服務的部門或過程", example: "The procurement manager was also present.", exampleZh: "採購經理也在場。" },
        { word: "testimonial", pos: "noun", meaning: "客戶見證；推薦", usage: "指客戶對產品或服務的正面評價", example: "Sarah showed customer testimonials from other markets.", exampleZh: "莎拉展示了其他市場的客戶見證。" },
        { word: "warranty", pos: "noun", meaning: "保固", usage: "指製造商承諾在一定期間內免費維修的保證", example: "Our price includes a two-year warranty.", exampleZh: "我們的價格包含兩年保固。" },
        { word: "cost-effective", pos: "adjective", meaning: "符合成本效益的", usage: "指花費少但效果好的", example: "Our offer is actually more cost-effective.", exampleZh: "我們的報價實際上更具成本效益。" }
      ],
      phrases: [
        { phrase: "took a deep breath", meaning: "深呼吸", example: "She took a deep breath and began.", exampleZh: "她深呼吸後開始了。" },
        { phrase: "was prepared for", meaning: "對...有準備", example: "Sarah was prepared for this.", exampleZh: "莎拉對此有所準備。" }
      ],
      grammar: [
        { point: "比較級 more cost-effective", explanation: "多音節形容詞用 more + 形容詞構成比較級。", example: "Our offer is actually more cost-effective.", exampleZh: "我們的報價實際上更具成本效益。" },
        { point: "if 條件句（第一類）", explanation: "If + 現在式, 主句用 will/can/may 表示可能的結果。", example: "If you calculate the total cost, our offer is more cost-effective.", exampleZh: "如果您計算總成本，我們的報價更具成本效益。" }
      ]
    }
  },
  17: {
    contentZh: "那天晚上，山田先生邀請莎拉到一家傳統日本餐廳吃晚餐。這是一場正式的商務晚宴，是日本商務文化中重要的一部分。餐廳位於銀座一條安靜的街道上。他們在入口脫了鞋，坐在一個包廂裡的塌塌米上的矮桌旁。山田先生點了懷石料理，包含了許多精心擺盤的小菜。「在日本，商務晚宴是建立信任的機會，」山田先生解釋。「我們比較少談生意，更多是互相了解。」莎拉告訴山田先生關於她的家人和嗜好。他分享了去台灣旅行的故事，以及他多麼喜歡夜市。他們發現兩人都喜歡爬山。「下次你來台北應該去陽明山，」莎拉建議。山田先生為莎拉倒茶，她了解到在日本你不應該自己倒酒。你為別人倒，別人也會為你倒。食物非常美味。莎拉特別喜歡烤魚和豆腐湯。餐後，莎拉提出要付帳，但山田先生堅持招待方的公司一定要付。「下次我們去台北時，就輪到你了，」他帶著溫暖的微笑說。莎拉覺得這頓晚餐加強了他們的商業關係。",
    grammarNotes: {
      vocabulary: [
        { word: "formal", pos: "adjective", meaning: "正式的", usage: "指符合官方規範或禮節的", example: "It was a formal business dinner.", exampleZh: "這是一場正式的商務晚宴。" },
        { word: "arrange", pos: "verb", meaning: "安排；擺設", usage: "指有計畫地放置或組織", example: "The dishes were beautifully arranged.", exampleZh: "菜餚精心擺盤。" },
        { word: "trust", pos: "noun", meaning: "信任", usage: "指相信某人可靠或誠實", example: "Business dinners are a chance to build trust.", exampleZh: "商務晚宴是建立信任的機會。" },
        { word: "pour", pos: "verb", meaning: "倒（飲料）", usage: "指將液體從容器中倒出", example: "Mr. Yamada poured tea for Sarah.", exampleZh: "山田先生為莎拉倒茶。" },
        { word: "strengthen", pos: "verb", meaning: "加強", usage: "指使某事變得更強或更穩固", example: "The dinner had strengthened their business relationship.", exampleZh: "晚餐加強了他們的商業關係。" }
      ],
      phrases: [
        { phrase: "getting to know", meaning: "互相了解", example: "We talk more about getting to know each other.", exampleZh: "我們更多是互相了解。" },
        { phrase: "insisted that", meaning: "堅持", example: "Mr. Yamada insisted that the host company always pays.", exampleZh: "山田先生堅持招待方一定要付帳。" }
      ],
      grammar: [
        { point: "should/shouldn't 建議", explanation: "should 表示建議或應該做的事，shouldn't 表示不應該。", example: "You should never pour your own drink.", exampleZh: "你不應該自己倒酒。" },
        { point: "過去完成式表結果", explanation: "had + 過去分詞描述導致某結果的先前動作。", example: "The dinner had strengthened their relationship.", exampleZh: "晚餐加強了他們的關係。" }
      ]
    }
  },
  18: {
    contentZh: "星期三是最後一天會議前的自由日。莎拉決定去探索東京。她從原宿著名的明治神宮開始。神社被一片寧靜的森林環繞，莎拉很驚訝這樣安靜的地方竟然存在於繁忙城市的中心。她沿著碎石路走，看著人們在正殿祈禱。參觀神社之後，莎拉走到時尚的表參道。這條街兩旁都是精品店和有趣的建築。她在一家日本工藝品店為媽媽買了一個小禮物。午餐時，她找到了一家只有八個座位的小壽司店。師傅就在她面前現做每一貫壽司。那是她吃過最新鮮的魚。下午，莎拉搭電車到淺草去看淺草寺。那裡擠滿了拍照和買紀念品的遊客。她試了一些傳統日式點心，包括鯛魚燒——一種魚形蛋糕，裡面填著甜紅豆餡。莎拉也參觀了東京晴空塔，日本最高的塔。從觀景台可以看到整座城市延伸到地平線。她拍了很多照片要給台北的同事看。這是美好的一天。莎拉感覺精神煥發，準備好迎接明天重要的最後會議。",
    grammarNotes: {
      vocabulary: [
        { word: "shrine", pos: "noun", meaning: "神社", usage: "指供奉神明的宗教場所", example: "She started at the famous Meiji Shrine.", exampleZh: "她從著名的明治神宮開始。" },
        { word: "architecture", pos: "noun", meaning: "建築", usage: "指建築物的設計風格", example: "The street had interesting architecture.", exampleZh: "街道有有趣的建築。" },
        { word: "souvenir", pos: "noun", meaning: "紀念品", usage: "指旅行時買來紀念的物品", example: "The area was full of tourists buying souvenirs.", exampleZh: "那裡擠滿了買紀念品的遊客。" },
        { word: "observation", pos: "noun", meaning: "觀景；觀察", usage: "指觀看或觀察的行為或場所", example: "From the observation deck, she could see the entire city.", exampleZh: "從觀景台可以看到整座城市。" },
        { word: "refreshed", pos: "adjective", meaning: "恢復精神的", usage: "指休息後感覺精力充沛", example: "Sarah felt refreshed and ready for tomorrow.", exampleZh: "莎拉感覺精神煥發，準備好面對明天。" }
      ],
      phrases: [
        { phrase: "was surrounded by", meaning: "被...環繞", example: "The shrine was surrounded by a peaceful forest.", exampleZh: "神社被寧靜的森林環繞。" },
        { phrase: "full of", meaning: "充滿", example: "The area was full of tourists.", exampleZh: "那裡擠滿了遊客。" }
      ],
      grammar: [
        { point: "最高級 the + 形容詞est", explanation: "用 the + 最高級形容詞表示同類中最...的。", example: "It was the freshest fish she had ever tasted.", exampleZh: "那是她吃過最新鮮的魚。" },
        { point: "關係子句 which", explanation: "用 which 修飾前面提到的事物。", example: "She tried taiyaki, a fish-shaped cake filled with red bean paste.", exampleZh: "她試了鯛魚燒，一種填著紅豆餡的魚形蛋糕。" }
      ]
    }
  },
  19: {
    contentZh: "星期四早上，莎拉醒來看到劉先生的訊息。出了問題。台中的工廠報告生產延誤了。新的交貨日期比莎拉承諾山田株式會社的晚了兩週。莎拉覺得心直往下沉。時機太糟了。最後的會議就在四小時後。她立刻打電話給劉先生。「有辦法加速生產嗎？」她問。「我在想辦法，」劉先生回答。「但我不能保證。你需要對山田先生誠實，並提供解決方案。」莎拉花了接下來兩個小時制定計畫。她為山田株式會社準備了兩個方案。方案一是接受兩週的延遲，首批訂單給予百分之五的折扣。方案二是將交貨分成兩批。前半部分會準時到達，後半部分兩週後到。在會議上，莎拉深呼吸後直接說明了情況。「我想對你們坦誠，」她說。「我們遇到了生產延遲，這裡有兩個我們可以提供的解決方案。」山田先生表情嚴肅。他用日文和團隊討論了好幾分鐘。最後，他轉向莎拉。「我們感謝你的誠實。我們選擇方案二，分批交貨。你可以在明天之前用書面確認嗎？」莎拉鬆了一口氣點頭。「當然可以。明天早上之前您會收到書面確認。」",
    grammarNotes: {
      vocabulary: [
        { word: "delay", pos: "noun/verb", meaning: "延遲", usage: "指比預期更晚發生", example: "The factory reported a delay in production.", exampleZh: "工廠報告生產延誤了。" },
        { word: "transparent", pos: "adjective", meaning: "透明的；坦誠的", usage: "指開放且誠實的溝通方式", example: "I want to be transparent with you.", exampleZh: "我想對你們坦誠。" },
        { word: "discount", pos: "noun", meaning: "折扣", usage: "指降低價格的優惠", example: "Option one was a five percent discount.", exampleZh: "方案一是百分之五的折扣。" },
        { word: "shipment", pos: "noun", meaning: "出貨", usage: "指運送的貨物或運送過程", example: "Option two was to split the delivery into two shipments.", exampleZh: "方案二是將交貨分成兩批。" },
        { word: "confirmation", pos: "noun", meaning: "確認", usage: "指正式的書面或口頭確認", example: "You will have the written confirmation by tomorrow morning.", exampleZh: "明天早上之前您會收到書面確認。" }
      ],
      phrases: [
        { phrase: "speed up", meaning: "加速", example: "Can we speed up production somehow?", exampleZh: "有辦法加速生產嗎？" },
        { phrase: "get back to", meaning: "回覆", example: "Can you confirm this in writing by tomorrow?", exampleZh: "你可以在明天之前用書面確認嗎？" }
      ],
      grammar: [
        { point: "情態動詞 can/could", explanation: "can 表示能力或可能性，could 用於過去或更禮貌的語氣。", example: "Can we speed up production somehow?", exampleZh: "有辦法加速生產嗎？" },
        { point: "比較級 later than", explanation: "用 than 連接比較對象。", example: "The new delivery date would be two weeks later than promised.", exampleZh: "新的交貨日期比承諾的晚了兩週。" }
      ]
    }
  },
  20: {
    contentZh: "星期五早上，莎拉退房後搭電車前往成田機場。她的包裡帶著一封山田株式會社簽署的意向書。雖然還不是正式合約，但這是繼續推進合作關係的強烈承諾。劉先生在電話中告訴她，這對第一次拜訪來說是出色的成果。在機場，莎拉為同事買了一些日本零食，還為東尼買了一個漂亮的陶瓷杯，因為他給了她很多實用的建議。在飛機上，莎拉望著窗外，東京消失在雲層之下。她想起了這趟旅程中學到的一切。她學到了誠實能建立信任，即使是在傳達壞消息的時候。她學到了了解文化差異有助於建立更強的關係。她也學到了充分準備能給你自信，即使在困難的情況下。當莎拉在台北降落時，她覺得自己像變了一個人。她不再是那個害怕第一次出差的緊張菜鳥。她是一個能處理國際客戶的自信專業人士。星期一早上，劉先生又把她叫進辦公室。「莎拉，東京做得太好了，」他說。「山田株式會社寄了一封非常正面的郵件給我。對了，我們在新加坡的客戶下個月想要見面。你有興趣嗎？」莎拉微笑著。「我很樂意去。」",
    grammarNotes: {
      vocabulary: [
        { word: "commitment", pos: "noun", meaning: "承諾", usage: "指對某事的正式保證或投入", example: "It was a strong commitment to move forward.", exampleZh: "這是繼續推進的強烈承諾。" },
        { word: "partnership", pos: "noun", meaning: "合作關係", usage: "指雙方之間的商業合作", example: "A strong commitment to move forward with the partnership.", exampleZh: "繼續推進合作關係的強烈承諾。" },
        { word: "ceramic", pos: "adjective", meaning: "陶瓷的", usage: "指用黏土燒製的材料或製品", example: "She bought a beautiful ceramic cup for Tony.", exampleZh: "她為東尼買了一個漂亮的陶瓷杯。" },
        { word: "confidence", pos: "noun", meaning: "自信", usage: "指對自己能力的信心", example: "Being well-prepared gives you confidence.", exampleZh: "充分準備能給你自信。" },
        { word: "professional", pos: "noun", meaning: "專業人士", usage: "指在某個領域有專業技能的人", example: "She was a confident professional.", exampleZh: "她是一個自信的專業人士。" }
      ],
      phrases: [
        { phrase: "checked out", meaning: "退房", example: "Sarah checked out of the hotel.", exampleZh: "莎拉退了房。" },
        { phrase: "move forward", meaning: "繼續推進", example: "A strong commitment to move forward with the partnership.", exampleZh: "繼續推進合作關係的強烈承諾。" }
      ],
      grammar: [
        { point: "過去式vs過去完成式", explanation: "過去式描述過去的事件，過去完成式描述更早完成的動作。", example: "She had learned that honesty builds trust.", exampleZh: "她學到了誠實能建立信任。" },
        { point: "no longer 否定", explanation: "no longer 表示某事不再如此。", example: "She was no longer a nervous junior employee.", exampleZh: "她不再是那個緊張的菜鳥。" }
      ]
    }
  },

  // ============================================================
  // Series 3: The Coffee Shop (Episodes 21-30)
  // ============================================================
  21: {
    contentZh: "在台北中山北路一個安靜的街角，有一家叫「豆與葉」的小咖啡店。老闆陳伯伯在從銀行業退休後，二十年前開了這家店。店裡有木桌、柔和的爵士樂，還有新鮮烘焙咖啡豆的美妙香氣。陳伯伯認識每一位常客，記得他們最愛的飲料，總是問候他們的家人。這天早上，一個叫小美的年輕女生走進來。她拿著一盒糕點。「陳伯伯，我想問你一件事，」她緊張地說。「我上個月丟了辦公室的工作。我一直夢想成為烘焙師。你可以讓我在你的店裡賣糕點嗎？」陳伯伯嚐了一塊她的鳳梨酥。他的眼睛睜大了。「這太好吃了，」他說。「甚至比街尾那家有名的烘焙坊還好。」他想了一下。「我把窗邊的展示櫃給你用。我們五五分帳。如果你的糕點賣得好，三個月後我們可以討論更長期的安排。」小美的臉上洋溢著喜悅。「太謝謝你了，陳伯伯！你不會後悔的。」她跑出去打電話告訴媽媽這個好消息。陳伯伯微笑著回去泡咖啡。他總是喜歡幫助年輕人追逐夢想。",
    grammarNotes: {
      vocabulary: [
        { word: "retire", pos: "verb", meaning: "退休", usage: "指停止工作，通常因為年齡到了", example: "Uncle Chen had opened it after retiring from banking.", exampleZh: "陳伯伯從銀行業退休後開了這家店。" },
        { word: "pastry", pos: "noun", meaning: "糕點", usage: "指用麵粉和奶油製作的甜點或點心", example: "She was carrying a box of pastries.", exampleZh: "她拿著一盒糕點。" },
        { word: "display", pos: "noun/verb", meaning: "展示", usage: "指將物品擺出來讓人觀看", example: "I will give you the display case near the window.", exampleZh: "我把窗邊的展示櫃給你用。" },
        { word: "profit", pos: "noun", meaning: "利潤", usage: "指收入減去成本後的獲利", example: "We can split the profits fifty-fifty.", exampleZh: "我們五五分帳。" },
        { word: "permanent", pos: "adjective", meaning: "永久的", usage: "指持續很長時間或永遠的", example: "We can discuss a more permanent arrangement.", exampleZh: "我們可以討論更長期的安排。" }
      ],
      phrases: [
        { phrase: "lit up with joy", meaning: "洋溢著喜悅", example: "Mei's face lit up with joy.", exampleZh: "小美的臉上洋溢著喜悅。" },
        { phrase: "chase their dreams", meaning: "追逐夢想", example: "He enjoyed helping young people chase their dreams.", exampleZh: "他喜歡幫助年輕人追逐夢想。" }
      ],
      grammar: [
        { point: "過去完成式", explanation: "had + 過去分詞描述在過去某時之前已完成的動作。", example: "Uncle Chen had opened it twenty years ago.", exampleZh: "陳伯伯二十年前就開了這家店。" },
        { point: "比較級 even better than", explanation: "even + 比較級強調比較的程度。", example: "Even better than the famous bakery down the street.", exampleZh: "甚至比街尾那家有名的烘焙坊還好。" }
      ]
    }
  },
  22: {
    contentZh: "每個星期六下午，四個大學生會來豆與葉一起讀書。他們總是坐在書架旁邊的大桌子。有讀企業管理的傑森，主修英國文學的麗莎，讀資訊工程的凱文，還有護理系的溫蒂。今天，他們都為即將到來的期中考感到壓力很大。「我什麼行銷理論都記不住，」傑森抱怨著，把頭掉在課本上。麗莎從她的小說中抬起頭。「試試做閃卡。我就是這樣背單字的。」凱文在筆電上打字，正在開發一個學習應用程式。「我為我們班做了一個測驗程式。你們要試試嗎？」溫蒂幫每個人端來陳伯伯的特調咖啡。「我們需要讀書的燃料，」她說。正在展示櫃前整理糕點的小美聽到了他們的對話。她端來一盤免費試吃品。「大腦食物，」她眨眨眼說。學生們感謝她後繼續讀書。三個小時後，他們終於闔上課本。「下週同一時間？」傑森問。大家都點了點頭。他們離開時，陳伯伯在帳單上給了他們一點折扣。「認真讀書的學生值得一點小獎勵，」他說。讀書會已經來豆與葉兩年了。這裡就像他們的第二個家。",
    grammarNotes: {
      vocabulary: [
        { word: "major", pos: "verb", meaning: "主修", usage: "指在大學專攻某個學科", example: "Lisa was majoring in English literature.", exampleZh: "麗莎主修英國文學。" },
        { word: "upcoming", pos: "adjective", meaning: "即將來臨的", usage: "指即將發生的事件", example: "They were stressed about their upcoming midterm exams.", exampleZh: "他們為即將到來的期中考感到壓力很大。" },
        { word: "memorize", pos: "verb", meaning: "記住；背誦", usage: "指把資訊記在腦海中", example: "That is how I memorize vocabulary.", exampleZh: "我就是這樣背單字的。" },
        { word: "blend", pos: "noun", meaning: "混合；綜合", usage: "指將不同的東西混合在一起", example: "Wendy brought Uncle Chen's special blend coffee.", exampleZh: "溫蒂端來陳伯伯的特調咖啡。" },
        { word: "deserve", pos: "verb", meaning: "值得", usage: "指某人應得某物", example: "Students who study hard deserve a little reward.", exampleZh: "認真讀書的學生值得一點獎勵。" }
      ],
      phrases: [
        { phrase: "stressed about", meaning: "對...感到壓力", example: "They were all stressed about their upcoming exams.", exampleZh: "他們都為即將到來的考試感到壓力。" },
        { phrase: "closed their books", meaning: "闔上課本", example: "They finally closed their books.", exampleZh: "他們終於闔上課本。" }
      ],
      grammar: [
        { point: "頻率副詞 always/every", explanation: "always 和 every 用來描述重複發生的動作。", example: "They always sat at the big table near the bookshelf.", exampleZh: "他們總是坐在書架旁的大桌子。" },
        { point: "關係子句 who", explanation: "who 用來修飾前面提到的人。", example: "Students who study hard deserve a reward.", exampleZh: "認真讀書的學生值得獎勵。" }
      ]
    }
  },
  23: {
    contentZh: "一個穿著整齊西裝的男人在星期二早上走進豆與葉。他看起來很焦慮，一直在看手錶。他點了一杯黑咖啡，坐在窗邊，翻閱資料夾裡的文件。陳伯伯注意到那個男人的手微微發抖。「第一次面試？」陳伯伯在端咖啡過來時溫和地問。男人看起來很驚訝。「你怎麼知道？」「這些年來我在這家店裡看過很多緊張的人，」陳伯伯說。「你要面試什麼職位？」「科技公司的行銷經理，」男人回答。「我叫詹姆斯。我已經失業六個月了，之前的公司倒閉了。我真的很需要這份工作。」陳伯伯坐到他對面。「讓我告訴你一件事。我年輕的時候，前三次面試都失敗了。我緊張到連話都說不清楚。但後來有人告訴我一個祕密。面試官也是人。他們不是來評判你的。他們只是想找一個能幫助公司的人。」詹姆斯第一次露出了微笑。「這確實讓我感覺好多了。」小美拿來一個溫熱的可頌。「免費的，」她說。「祝你好運。」詹姆斯感謝了他們兩位，離開時看起來自信多了。兩天後，詹姆斯回到豆與葉，帶著燦爛的笑容。「我得到那份工作了！」他宣布。陳伯伯拍了拍手。「我就知道你可以的。」",
    grammarNotes: {
      vocabulary: [
        { word: "anxious", pos: "adjective", meaning: "焦慮的", usage: "指對某事感到擔心或不安", example: "He looked anxious and kept checking his watch.", exampleZh: "他看起來很焦慮，一直在看手錶。" },
        { word: "review", pos: "verb", meaning: "複習；檢閱", usage: "指重新查看或學習", example: "He was reviewing papers in a folder.", exampleZh: "他在翻閱資料夾裡的文件。" },
        { word: "unemployed", pos: "adjective", meaning: "失業的", usage: "指沒有工作的狀態", example: "I have been unemployed for six months.", exampleZh: "我已經失業六個月了。" },
        { word: "interviewer", pos: "noun", meaning: "面試官", usage: "指進行面試的人", example: "The interviewer is also a human being.", exampleZh: "面試官也是人。" },
        { word: "confident", pos: "adjective", meaning: "有自信的", usage: "指對自己的能力有信心", example: "He left the shop looking much more confident.", exampleZh: "他離開時看起來自信多了。" }
      ],
      phrases: [
        { phrase: "on the house", meaning: "免費招待", example: "\"On the house,\" she said. \"For good luck.\"", exampleZh: "「免費的，」她說。「祝你好運。」" },
        { phrase: "clapped his hands", meaning: "拍手", example: "Uncle Chen clapped his hands.", exampleZh: "陳伯伯拍了拍手。" }
      ],
      grammar: [
        { point: "現在完成式 have been", explanation: "have been + 形容詞/名詞表示從過去持續到現在的狀態。", example: "I have been unemployed for six months.", exampleZh: "我已經失業六個月了。" },
        { point: "so...that 結果子句", explanation: "so + 形容詞 + that 表示程度導致的結果。", example: "I was so nervous that I could not even speak clearly.", exampleZh: "我緊張到連話都說不清楚。" }
      ]
    }
  },
  24: {
    contentZh: "一個下雨的午後，一個十幾歲的女孩衝進豆與葉。她被雨淋濕了，看起來快要哭了。「不好意思，有人撿到一個粉紅色的皮夾嗎？」她急切地問。陳伯伯搖了搖頭。「抱歉，我沒有看到。你最後一次拿著它是什麼時候？」「今天早上我跟奶奶來的時候。我想我把它忘在門口旁邊的桌子上了，」女孩說。她叫蘇菲，她解釋說皮夾裡有學生證、一些現金，最重要的是一張已故祖父的小照片。陳伯伯立刻檢查了櫃台後面的失物招領箱，但皮夾不在那裡。他問了小美和兼職員工，但沒人看到。「不要放棄希望，」陳伯伯說。他寫了一張字條貼在大門上，請撿到粉紅色皮夾的人歸還。然後他在咖啡店的社群媒體頁面上發了同樣的訊息。第二天早上，一位老太太拿著一個粉紅色皮夾走進店裡。「我昨天在外面的人行道上撿到的，」她說。「我看到你們在網路上發的文。」陳伯伯立刻打電話給蘇菲。當她到達並打開皮夾時，祖父的照片還在裡面。她緊緊抱著皮夾，向那位老太太道了很多次謝。「這張照片是無可取代的，」蘇菲含著幸福的眼淚說。陳伯伯送了那位老太太一個月的免費咖啡作為感謝。",
    grammarNotes: {
      vocabulary: [
        { word: "desperately", pos: "adverb", meaning: "拼命地；急切地", usage: "指非常急迫或迫切地", example: "\"Did anyone find a pink wallet?\" she asked desperately.", exampleZh: "「有人撿到粉紅色皮夾嗎？」她急切地問。" },
        { word: "contain", pos: "verb", meaning: "包含", usage: "指裡面有某些東西", example: "The wallet contained her student ID and some cash.", exampleZh: "皮夾裡有學生證和一些現金。" },
        { word: "immediately", pos: "adverb", meaning: "立即", usage: "指馬上、毫不遲疑地", example: "Uncle Chen immediately checked the lost and found box.", exampleZh: "陳伯伯立刻檢查了失物招領箱。" },
        { word: "elderly", pos: "adjective", meaning: "年長的", usage: "指年紀大的，比 old 更禮貌的說法", example: "An elderly woman came into the shop.", exampleZh: "一位老太太走進店裡。" },
        { word: "irreplaceable", pos: "adjective", meaning: "無可取代的", usage: "指獨一無二、無法替換的", example: "This photo is irreplaceable.", exampleZh: "這張照片是無可取代的。" }
      ],
      phrases: [
        { phrase: "rushed into", meaning: "衝進", example: "A teenage girl rushed into Bean & Leaf.", exampleZh: "一個少女衝進豆與葉。" },
        { phrase: "give up hope", meaning: "放棄希望", example: "Do not give up hope.", exampleZh: "不要放棄希望。" }
      ],
      grammar: [
        { point: "過去簡單式 vs 過去進行式", explanation: "過去簡單式描述完成的動作，過去進行式描述當時正在進行的動作。", example: "A teenage girl rushed in. She was wet from the rain.", exampleZh: "一個少女衝了進來。她被雨淋濕了。" },
        { point: "動名詞作主詞", explanation: "動名詞（V-ing）可以作為句子的主詞。", example: "Finding the wallet made Sophie very happy.", exampleZh: "找到皮夾讓蘇菲非常開心。" }
      ]
    }
  },
  25: {
    contentZh: "小美有一個想法。「陳伯伯，如果我們每個星期五晚上舉辦現場音樂之夜怎麼樣？」她建議。「可以吸引更多客人，讓店裡更有活力。」陳伯伯一開始不太確定。「這是一家安靜的咖啡店，不是酒吧，」他說。但小美很堅持。她認識一個叫艾力克斯的年輕音樂人，他彈木吉他，唱柔和的民謠歌曲。「就讓我們試一次，」小美說。陳伯伯同意試辦一晚。星期五晚上，艾力克斯在店裡的角落架好吉他。他從一首關於雨和回憶的輕柔歌曲開始。常客們從書和筆電前抬起頭，好奇地看。到了第二首歌，大家都在微笑。到了第三首歌，有些人開始輕聲跟唱。氣氛很夢幻。路過店門口的新客人聽到音樂就走了進來。到晚上九點，每個座位都坐滿了。小美的糕點第一次全部賣光了。陳伯伯站在櫃台後面，帶著溫暖的心情看著這一切。他好幾年沒看到店裡這麼滿了。晚上結束時，好幾位客人問下次音樂之夜是什麼時候。陳伯伯看了看小美。「我想我們有了一個新傳統，」他說。從那週起，星期五音樂之夜成了豆與葉最受歡迎的活動。艾力克斯成了固定表演者，有時候其他音樂人也會加入。",
    grammarNotes: {
      vocabulary: [
        { word: "attract", pos: "verb", meaning: "吸引", usage: "指引起別人的注意或興趣", example: "It could attract more customers.", exampleZh: "可以吸引更多客人。" },
        { word: "persistent", pos: "adjective", meaning: "堅持不懈的", usage: "指不放棄地持續做某事", example: "But Mei was persistent.", exampleZh: "但小美很堅持。" },
        { word: "acoustic", pos: "adjective", meaning: "原聲的；不插電的", usage: "指不使用電子放大的樂器", example: "Alex played acoustic guitar.", exampleZh: "艾力克斯彈木吉他。" },
        { word: "atmosphere", pos: "noun", meaning: "氛圍", usage: "指某個地方的感覺或氣氛", example: "The atmosphere was magical.", exampleZh: "氣氛很夢幻。" },
        { word: "tradition", pos: "noun", meaning: "傳統", usage: "指長期傳承下來的做法或習俗", example: "I think we have a new tradition.", exampleZh: "我想我們有了一個新傳統。" }
      ],
      phrases: [
        { phrase: "sold out", meaning: "賣光", example: "Mei's pastries sold out completely.", exampleZh: "小美的糕點全部賣光了。" },
        { phrase: "singing along", meaning: "跟著唱", example: "Some were softly singing along.", exampleZh: "有些人開始輕聲跟唱。" }
      ],
      grammar: [
        { point: "What if 假設問句", explanation: "what if 用來提出一個假設性的建議或問題。", example: "What if we have a live music night every Friday?", exampleZh: "如果我們每個星期五舉辦音樂之夜怎麼樣？" },
        { point: "by + 時間表示截止", explanation: "by 表示在某個時間之前。", example: "By 9 PM, every seat was taken.", exampleZh: "到晚上九點，每個座位都坐滿了。" }
      ]
    }
  },
  26: {
    contentZh: "讀書會的麗莎請陳伯伯幫一個忙。「我表姐星期六要在這裡相親。你可以幫忙讓氣氛好一點嗎？」陳伯伯很樂意幫忙。麗莎的表姐瑞秋是一個害羞的幼稚園老師。她的約會對象是湯姆，一個熱愛烹飪的會計師。陳伯伯預留了窗邊最好的桌子，放了一個小花瓶。他也請小美準備她最好的糕點。星期六下午，瑞秋先到了。她穿著一件藍色洋裝，看起來很緊張。她一直在整理頭髮。湯姆五分鐘後到了，帶著一個小盒子。「嗨，我是湯姆。我做了一些餅乾給你，」他說著把盒子遞給她。「我聽說你跟小朋友一起工作，所以我做成了動物形狀。」瑞秋打開盒子笑了。裡面有貓、狗和兔子形狀的餅乾。「這些太可愛了！我的學生一定會喜歡，」她說。氣氛融洽了。之後他們輕鬆地聊著，發現兩人都在台南長大，都喜歡爬山。陳伯伯端來他的特製卡布奇諾，上面有心形的拉花。小美從櫃台後面看著，小聲對陳伯伯說，「我覺得這對會成功。」他們待了將近三個小時，一直聊天大笑。離開時，湯姆幫瑞秋拉著門，她笑得很燦爛。下週，他們又一起回來了。",
    grammarNotes: {
      vocabulary: [
        { word: "favor", pos: "noun", meaning: "幫忙；恩惠", usage: "指請求別人幫助的事", example: "Lisa asked Uncle Chen for a favor.", exampleZh: "麗莎請陳伯伯幫一個忙。" },
        { word: "reserve", pos: "verb", meaning: "預留；保留", usage: "指事先保留某物給特定用途", example: "Uncle Chen reserved the nicest table.", exampleZh: "陳伯伯預留了最好的桌子。" },
        { word: "occasion", pos: "noun", meaning: "場合", usage: "指特殊的事件或時機", example: "He asked Mei to prepare her best pastries for the occasion.", exampleZh: "他請小美為這個場合準備她最好的糕點。" },
        { word: "adorable", pos: "adjective", meaning: "可愛的", usage: "指非常可愛讓人喜歡的", example: "These are adorable!", exampleZh: "這些太可愛了！" },
        { word: "discover", pos: "verb", meaning: "發現", usage: "指第一次得知或找到某事", example: "They discovered they both grew up in Tainan.", exampleZh: "他們發現兩人都在台南長大。" }
      ],
      phrases: [
        { phrase: "broke the ice", meaning: "打破僵局", example: "The ice was broken.", exampleZh: "氣氛融洽了。" },
        { phrase: "work out", meaning: "成功；順利", example: "I think this one is going to work out.", exampleZh: "我覺得這對會成功。" }
      ],
      grammar: [
        { point: "現在進行式表未來", explanation: "be going to / be + V-ing 可以表示已計畫好的未來事件。", example: "My cousin is going on a blind date here.", exampleZh: "我表姐要在這裡相親。" },
        { point: "動名詞作介系詞受詞", explanation: "介系詞 about/for/of 後面接動名詞。", example: "They talked about growing up in Tainan.", exampleZh: "他們聊了在台南長大的事。" }
      ]
    }
  },
  27: {
    contentZh: "一個星期三，台北發布了颱風警報。街上大多數店家提早關門了，但陳伯伯讓豆與葉繼續營業。「可能有人需要避難，」他說。到中午，雨下得很大，風也呼嘯著。一位媽媽帶著兩個小孩跑進店裡，全身濕透。「拜託，我們可以待到雨停嗎？」她問。「當然可以，」陳伯伯說。他給了他們毛巾，為小朋友泡了熱可可。很快，更多人進來躲避暴風雨。一對正走去醫院的老夫婦。一個機車壞了的外送員。一個迷路又困惑的加拿大觀光客。小美用她烘焙坊的麵包材料為大家做了三明治。陳伯伯沒有向任何人收費。「今天，我們不是商家。我們是社區中心，」他說。小朋友在餐巾紙上畫畫，他們的媽媽在暖爐旁邊晾衣服。那個叫馬克的觀光客跟老夫婦玩撲克牌。外送員幫陳伯伯把家具搬離一扇漏水的窗戶。五個小時裡，這些陌生人變得像一個小家庭。暴風雨終於過去時，每個人都感謝陳伯伯和小美。那位媽媽想要付錢，但陳伯伯拒絕了。「等晴天的時候再來就好，」他說。馬克，那個加拿大觀光客，當晚在網路上留了一篇熱情的評論，稱豆與葉是台北最溫暖的地方。",
    grammarNotes: {
      vocabulary: [
        { word: "typhoon", pos: "noun", meaning: "颱風", usage: "指熱帶地區形成的強烈風暴", example: "A typhoon warning was announced for Taipei.", exampleZh: "台北發布了颱風警報。" },
        { word: "shelter", pos: "noun", meaning: "避難所；庇護", usage: "指提供安全保護的場所", example: "People might need shelter.", exampleZh: "可能有人需要避難。" },
        { word: "soaked", pos: "adjective", meaning: "濕透的", usage: "指完全被水浸濕的", example: "She was completely soaked.", exampleZh: "她全身濕透。" },
        { word: "community", pos: "noun", meaning: "社區", usage: "指住在同一地區或有共同關係的人群", example: "Today, we are a community center.", exampleZh: "今天我們是社區中心。" },
        { word: "furniture", pos: "noun", meaning: "家具", usage: "指桌椅、櫃子等室內用品（不可數名詞）", example: "The driver helped move furniture away from the window.", exampleZh: "外送員幫忙把家具搬離窗戶。" }
      ],
      phrases: [
        { phrase: "closed early", meaning: "提早關門", example: "Most shops closed early.", exampleZh: "大多數店家提早關門了。" },
        { phrase: "left a glowing review", meaning: "留了一篇好評", example: "Mark left a glowing review online.", exampleZh: "馬克在網路上留了一篇好評。" }
      ],
      grammar: [
        { point: "過去進行式表背景", explanation: "was/were + V-ing 描述故事的背景情境。", example: "The rain was pouring down heavily and the wind was howling.", exampleZh: "雨下得很大，風也呼嘯著。" },
        { point: "until 用法", explanation: "until 表示直到某個時間點為止。", example: "Can we stay here until the rain stops?", exampleZh: "我們可以待到雨停嗎？" }
      ]
    }
  },
  28: {
    contentZh: "讀書會的溫蒂有一項隱藏的才能。她空閒時會畫水彩畫。有一天，她害羞地給陳伯伯看了一些她的畫。那些是台北的美麗景色，包括咖啡店本身、附近的公園和街尾的廟宇。「這些太棒了，」陳伯伯說。「你想把它們掛在我們的牆上展示嗎？」溫蒂既興奮又害怕。「如果大家不喜歡怎麼辦？」她擔心。「你不試就永遠不會知道，」陳伯伯回答。他們在一個星期六舉辦了一個小型展覽。小美烤了藝術主題的特製餅乾。艾力克斯自願演奏背景音樂。讀書會幫忙掛畫和架設小燈照亮每一幅作品。溫蒂總共有十二幅畫，她為每一幅寫了簡短的介紹。當第一批客人看到畫作時，反應非常正面。「這跟從我公寓看出去的景色一模一樣，」一個女人指著一幅台北101日落的畫說。到了一天結束時，三個人問是否可以買畫。溫蒂很震驚。她從來沒有想過有人會願意為她的畫付錢。她賣了兩幅畫，把錢捐給了兒童醫院。「這是我人生中最棒的一天，」溫蒂告訴陳伯伯。畫作在牆上掛了一個月，豆與葉因此被認為是一個支持在地藝術家的地方。",
    grammarNotes: {
      vocabulary: [
        { word: "watercolor", pos: "noun", meaning: "水彩", usage: "指用水稀釋的顏料或這種顏料畫的畫", example: "She painted watercolor pictures in her free time.", exampleZh: "她空閒時會畫水彩畫。" },
        { word: "exhibition", pos: "noun", meaning: "展覽", usage: "指公開展示藝術品或物品的活動", example: "They organized a small exhibition on a Saturday.", exampleZh: "他們在星期六舉辦了一個小型展覽。" },
        { word: "illuminate", pos: "verb", meaning: "照亮", usage: "指用光線照亮某物", example: "They set up small lights to illuminate each painting.", exampleZh: "他們架設小燈照亮每一幅畫。" },
        { word: "reaction", pos: "noun", meaning: "反應", usage: "指對某事的回應或感受", example: "The reactions were very positive.", exampleZh: "反應非常正面。" },
        { word: "donate", pos: "verb", meaning: "捐贈", usage: "指免費地給予金錢或物品", example: "She donated the money to a children's hospital.", exampleZh: "她把錢捐給了兒童醫院。" }
      ],
      phrases: [
        { phrase: "hidden talent", meaning: "隱藏的才能", example: "Wendy had a hidden talent.", exampleZh: "溫蒂有一項隱藏的才能。" },
        { phrase: "became known as", meaning: "以...聞名", example: "Bean & Leaf became known as a place that supported local artists.", exampleZh: "豆與葉因此被認為是支持在地藝術家的地方。" }
      ],
      grammar: [
        { point: "What if 假設問句", explanation: "what if 用來表達對未來可能結果的擔憂。", example: "What if people do not like them?", exampleZh: "如果大家不喜歡怎麼辦？" },
        { point: "unless 條件句", explanation: "unless 表示「除非」，等於 if not。", example: "You will never know unless you try.", exampleZh: "你不試就永遠不會知道。" }
      ]
    }
  },
  29: {
    contentZh: "一天早上，陳伯伯注意到對面掛了一個新招牌。一家叫「CoffeeWorld」的大型連鎖咖啡店下個月要開張。招牌上承諾低價、免費WiFi和現代化的氛圍。陳伯伯好幾年來第一次感到擔心。他的小店怎麼跟大公司競爭？小美注意到了他的擔憂。「陳伯伯，我們有他們沒有的東西。我們跟客人有真正的關係。」但擔心不容易消除。CoffeeWorld開張後，豆與葉的一些客人開始去那裡了。新店明亮、寬敞，有舒適的沙發。他們的咖啡也比較便宜。豆與葉的生意在前兩週下降了大約百分之三十。讀書會召開了緊急會議。「我們不能讓豆與葉關門，」傑森說。他們發起了一場社群媒體活動，講述豆與葉的故事。他們發佈照片，分享回憶。麗莎寫了一篇標題為「為什麼你的社區咖啡店很重要」的部落格文章。文章爆紅了，被分享了超過一萬次。老客人和新客人開始回來了。很多人帶了朋友一起來。詹姆斯，那個在這家店之後找到工作的人，帶了他整個辦公室的團隊來。馬克，加拿大觀光客，在網上跟他的粉絲分享了這個故事。一個月之內，豆與葉比以往任何時候都更忙碌。陳伯伯明白了，他最大的優勢不是咖啡。而是他在二十年中建立的社區。",
    grammarNotes: {
      vocabulary: [
        { word: "chain", pos: "noun", meaning: "連鎖（店）", usage: "指在多個地點經營同一品牌的商店系統", example: "A large chain coffee shop was opening next month.", exampleZh: "一家大型連鎖咖啡店下個月要開張。" },
        { word: "compete", pos: "verb", meaning: "競爭", usage: "指與對手爭奪市場或客戶", example: "How could his small shop compete with a big company?", exampleZh: "他的小店怎麼跟大公司競爭？" },
        { word: "spacious", pos: "adjective", meaning: "寬敞的", usage: "指有很大空間的", example: "The new shop was bright, spacious, and comfortable.", exampleZh: "新店明亮、寬敞且舒適。" },
        { word: "campaign", pos: "noun", meaning: "活動；宣傳", usage: "指有組織的行銷或社會活動", example: "They created a social media campaign.", exampleZh: "他們發起了社群媒體活動。" },
        { word: "viral", pos: "adjective", meaning: "病毒式傳播的", usage: "指在網路上快速且廣泛地傳播", example: "The post went viral.", exampleZh: "文章爆紅了。" }
      ],
      phrases: [
        { phrase: "went viral", meaning: "爆紅；病毒式傳播", example: "The post went viral and was shared over ten thousand times.", exampleZh: "文章爆紅了，被分享超過一萬次。" },
        { phrase: "dropped by", meaning: "下降了", example: "Business dropped by about thirty percent.", exampleZh: "生意下降了大約百分之三十。" }
      ],
      grammar: [
        { point: "How could 疑問句", explanation: "how could 表示對困難情況的質疑。", example: "How could his small shop compete with a big company?", exampleZh: "他的小店怎麼跟大公司競爭？" },
        { point: "比較級 busier than ever", explanation: "比較級 + than ever 表示比以前任何時候都更...", example: "Bean & Leaf was busier than ever.", exampleZh: "豆與葉比以往任何時候都更忙碌。" }
      ]
    }
  },
  30: {
    contentZh: "十二月十五日是豆與葉的二十週年。陳伯伯沒有計畫任何特別的事，但小美和常客們為他準備了一個驚喜。那天早上陳伯伯到店裡時，門上裝飾著氣球和一條橫幅寫著「豆與葉二十週年快樂！」裡面有幾十個人在等著。小美策劃了一切。到處都是熟悉的面孔。讀書會的人都來了，現在都畢業在工作了。傑森是行銷經理，麗莎是老師，凱文是軟體工程師，溫蒂是護理師。她的畫還掛在牆上。詹姆斯帶著太太和寶寶來了。蘇菲帶了奶奶一起來。瑞秋和湯姆，那對在豆與葉第一次約會的情侶，宣布他們明年春天要結婚了。艾力克斯演奏了一首他寫的特別歌曲，叫做「街角的咖啡店」。甚至加拿大觀光客馬克也寄了一段影片訊息，說豆與葉是他對台灣最美好的回憶。陳伯伯站在櫃台後面，看著所有這些生命因為他的小店而有所改變的人。他的眼眶泛淚。「二十年前，我只是想泡好咖啡，」他說。「我從沒想到會得到這樣一個美好的大家庭。」大家舉起杯子。「敬豆與葉，」他們一起說。「也敬陳伯伯。」小美端出一個她烤的咖啡杯形蛋糕。陳伯伯吹滅了蠟燭，許了一個願。他希望再有二十年的好咖啡和好夥伴。"
,
    grammarNotes: {
      vocabulary: [
        { word: "anniversary", pos: "noun", meaning: "週年紀念", usage: "指某個重要日子的年度紀念", example: "December fifteenth was Bean & Leaf's twentieth anniversary.", exampleZh: "十二月十五日是豆與葉的二十週年。" },
        { word: "decorate", pos: "verb", meaning: "裝飾", usage: "指用物品美化某個空間", example: "The door was decorated with balloons and a banner.", exampleZh: "門上裝飾著氣球和橫幅。" },
        { word: "announce", pos: "verb", meaning: "宣布", usage: "指公開地說出某個消息", example: "Rachel and Tom announced they were getting married.", exampleZh: "瑞秋和湯姆宣布他們要結婚了。" },
        { word: "previous", pos: "adjective", meaning: "先前的", usage: "指在現在之前的", example: "Their previous experiences at Bean & Leaf had changed their lives.", exampleZh: "他們在豆與葉先前的經歷改變了他們的人生。" },
        { word: "gain", pos: "verb", meaning: "獲得", usage: "指得到某物，通常是經過努力後", example: "I never expected to gain such a wonderful family.", exampleZh: "我從沒想到會得到這樣美好的大家庭。" }
      ],
      phrases: [
        { phrase: "filled with tears", meaning: "含著淚水", example: "His eyes filled with tears.", exampleZh: "他的眼眶泛淚。" },
        { phrase: "blew out", meaning: "吹滅", example: "Uncle Chen blew out the candles.", exampleZh: "陳伯伯吹滅了蠟燭。" }
      ],
      grammar: [
        { point: "被動語態過去式", explanation: "was/were + 過去分詞描述過去的被動動作。", example: "The door was decorated with balloons.", exampleZh: "門上裝飾著氣球。" },
        { point: "whose 的用法", explanation: "whose 表示「誰的」，用在關係子句中修飾名詞。", example: "People whose lives had been touched by his little shop.", exampleZh: "那些生命因他小店而有所改變的人。" }
      ]
    }
  }
};
