module.exports = [
  // ============================================================
  // Series 1: Detective Lin (10 episodes)
  // ============================================================
  {
    id: 1, series: "detective", seriesName: "Detective Lin", episode: 1,
    title: "The Missing Report",
    content: "Detective Lin worked for a large technology company in Taipei. He was not a police detective. He was the head of the company's internal security team. One Monday morning, his phone rang. It was Ms. Chen from the finance department. She sounded very worried. \"Someone took the quarterly sales report from my desk,\" she said. \"I left it there on Friday evening, and now it is gone.\" Detective Lin walked to the finance department on the eighth floor. He looked at Ms. Chen's desk carefully. There were no signs that someone had forced open the drawers. Everything else was neat and organized. \"Who else has a key to this office?\" he asked. Ms. Chen thought for a moment. \"Only Mr. Wang, the department manager, and the cleaning staff,\" she replied. Lin checked the security camera footage from the weekend. He saw something interesting. On Saturday afternoon, someone entered the office using a key card. The person wore a hat and kept their head down to avoid the camera. \"This is not a simple case,\" Lin thought. He decided to check the key card records next. The missing report contained sensitive financial data about the company's biggest clients. If this information reached a competitor, it could cause serious damage. Detective Lin knew he had to find the report quickly.",
    vocabulary: ["detective", "quarterly", "security", "sensitive", "competitor"],
    vocabMeanings: { "detective": "偵探；調查員", "quarterly": "季度的", "security": "安全；保安", "sensitive": "敏感的", "competitor": "競爭對手" },
    questions: [
      { question: "What was missing from Ms. Chen's desk?", options: ["A laptop", "A quarterly sales report", "A key card", "A phone"], answer: 1 },
      { question: "Where did Detective Lin work?", options: ["A police station", "A hospital", "A technology company", "A bank"], answer: 2 }
    ],
    difficulty: 2, sort_order: 1
  },
  {
    id: 2, series: "detective", seriesName: "Detective Lin", episode: 2,
    title: "The Key Card Mystery",
    content: "Detective Lin went to the IT department to check the key card records. Every time an employee used their card to enter a room, the system recorded it. The IT manager, Mr. Huang, pulled up the records on his computer. \"Here it is,\" Mr. Huang said. \"On Saturday at 2:15 PM, someone used key card number 3847 to enter the finance office.\" Lin checked the employee database. Key card 3847 belonged to Kevin Lee, a junior accountant who had only joined the company three months ago. Lin found Kevin at his desk on the sixth floor. Kevin was a young man with glasses. He looked nervous when Lin introduced himself. \"Were you in the office on Saturday?\" Lin asked. Kevin shook his head quickly. \"No, I was at home all weekend. I can show you my social media posts.\" Lin asked to see Kevin's key card. Kevin searched his wallet and his desk drawer, but he could not find it. \"I think I lost it last week,\" Kevin admitted. \"I was going to report it, but I forgot.\" This was an important clue. Someone had stolen Kevin's key card and used it to enter the finance office. But who? Lin asked Kevin to make a list of every place he had been in the past week. He also asked the IT department to check if anyone had accessed the company's computer network over the weekend.",
    vocabulary: ["employee", "database", "accountant", "admit", "access"],
    vocabMeanings: { "employee": "員工", "database": "資料庫", "accountant": "會計師", "admit": "承認", "access": "存取；進入" },
    questions: [
      { question: "Whose key card was used to enter the finance office?", options: ["Mr. Huang's", "Ms. Chen's", "Kevin Lee's", "Mr. Wang's"], answer: 2 },
      { question: "What happened to Kevin's key card?", options: ["He broke it", "He lost it", "He gave it to a friend", "He left it at home"], answer: 1 }
    ],
    difficulty: 2, sort_order: 2
  },
  {
    id: 3, series: "detective", seriesName: "Detective Lin", episode: 3,
    title: "Suspicious Emails",
    content: "While investigating the missing key card, Lin asked the IT department to check the company email system. Mr. Huang found something unusual. Over the past month, someone had been sending emails from the finance department to an outside email address. The emails were sent late at night, usually after 11 PM. They contained attachments with financial data, including client lists and pricing information. \"Can you tell me which computer sent these emails?\" Lin asked. Mr. Huang typed quickly on his keyboard. \"They all came from the same computer, the one at desk F-12 in the finance department.\" Lin checked the office layout. Desk F-12 belonged to Amy Wu, a senior financial analyst. She had worked at the company for five years and had an excellent reputation. Lin was surprised. He decided not to confront Amy directly. Instead, he asked Mr. Huang to monitor her computer activity quietly. That evening, Lin stayed late at the office. At 11:30 PM, he saw the light turn on in the finance department. He walked quietly to the door and looked through the glass window. Someone was sitting at Amy's desk, but it was not Amy. The person was wearing a dark jacket and typing quickly. Lin took a photo with his phone. He wanted to see what the person would do next before making a move.",
    vocabulary: ["investigate", "attachment", "financial", "confront", "monitor"],
    vocabMeanings: { "investigate": "調查", "attachment": "附件", "financial": "財務的", "confront": "對質", "monitor": "監控" },
    questions: [
      { question: "When were the suspicious emails usually sent?", options: ["Early morning", "During lunch", "Late at night", "On weekends"], answer: 2 },
      { question: "Who was sitting at Amy's desk late at night?", options: ["Amy Wu", "Kevin Lee", "Someone unknown", "Mr. Huang"], answer: 2 }
    ],
    difficulty: 2, sort_order: 3
  },
  {
    id: 4, series: "detective", seriesName: "Detective Lin", episode: 4,
    title: "The Night Visitor",
    content: "Lin watched through the glass as the person at Amy's desk finished typing. The person stood up and put a USB drive into their pocket. Then they walked toward the door. Lin stepped back and hid behind a large plant in the hallway. When the person came out, Lin got a clear look at their face under the hallway lights. It was David Tsai, a system administrator from the IT department. David was someone who had access to many parts of the building because of his job maintaining the computer systems. Lin followed David at a distance. David went to the parking garage, got into his car, and drove away. The next morning, Lin did some research on David Tsai. He had been with the company for two years. His performance reviews were average. But Lin noticed something interesting in David's personnel file. Before joining this company, David had worked at Nexus Technologies, which was their biggest competitor. Lin called a contact at Nexus Technologies. \"David Tsai? Yes, he worked here for three years,\" the contact said. \"He left suddenly. There were some rumors about him sharing information, but we could never prove anything.\" Lin now had a strong suspect. David had the technical skills to steal Kevin's key card data, access Amy's computer, and send the emails. But Lin needed solid evidence before he could act.",
    vocabulary: ["administrator", "maintain", "personnel", "suspect", "evidence"],
    vocabMeanings: { "administrator": "管理員", "maintain": "維護", "personnel": "人事的", "suspect": "嫌疑人", "evidence": "證據" },
    questions: [
      { question: "Who was the person at Amy's desk?", options: ["Kevin Lee", "Mr. Wang", "David Tsai", "Mr. Huang"], answer: 2 },
      { question: "Where did David Tsai work before?", options: ["A bank", "Nexus Technologies", "A law firm", "A hospital"], answer: 1 }
    ],
    difficulty: 2, sort_order: 4
  },
  {
    id: 5, series: "detective", seriesName: "Detective Lin", episode: 5,
    title: "Setting the Trap",
    content: "Detective Lin had a plan. He asked Ms. Chen to create a fake document. It looked like a real proposal for a new product, but all the details were made up. Lin placed this document in a special folder on the finance department's shared drive. Mr. Huang helped him set up a tracking system. If anyone copied or emailed the fake document, they would know immediately. Lin also asked the building security team to install a small hidden camera near Amy's desk. \"We need to catch him in the act,\" Lin told his team. Three days passed with nothing happening. Lin began to worry. Maybe David had noticed something was different. Maybe he had stopped his activities. But on Thursday night, the alert came. Someone had opened the fake document at 11:47 PM. A few minutes later, the document was attached to an email going to an outside address. Lin rushed to the office. This time, he brought two security guards with him. They took the elevator to the eighth floor and walked quickly but quietly to the finance department. Through the glass door, they could see David sitting at the computer. Lin opened the door. \"David, please step away from the computer,\" he said firmly. David's face turned white. He tried to pull the USB drive from the computer, but the security guards were faster.",
    vocabulary: ["proposal", "install", "alert", "attach", "firmly"],
    vocabMeanings: { "proposal": "提案", "install": "安裝", "alert": "警報", "attach": "附加；夾帶", "firmly": "堅定地" },
    questions: [
      { question: "What did Lin use to catch David?", options: ["A real product plan", "A fake document", "A phone call", "A meeting"], answer: 1 },
      { question: "How many security guards did Lin bring?", options: ["One", "Two", "Three", "Four"], answer: 1 }
    ],
    difficulty: 2, sort_order: 5
  },
  {
    id: 6, series: "detective", seriesName: "Detective Lin", episode: 6,
    title: "The Interrogation",
    content: "Lin brought David to the security office on the third floor. David sat in a chair, looking down at the table. He did not say anything for several minutes. \"We have security camera footage of you entering the finance department multiple times at night,\" Lin said. \"We also have records showing that emails with company secrets were sent from Amy Wu's computer to an outside address. And tonight, we caught you sitting at her desk.\" David remained silent. Lin continued, \"We traced the outside email address. It belongs to a shell company registered in Hong Kong. But we believe the real recipient is Nexus Technologies, your former employer.\" David finally looked up. \"I want a lawyer,\" he said quietly. \"You can call a lawyer,\" Lin replied. \"But I want you to know something. The document you copied tonight was fake. We created it to catch you. So whatever deal you had with Nexus, they will soon know that your information is unreliable.\" David's expression changed. He seemed to realize that his situation was very bad. After a long pause, he started talking. \"They offered me a lot of money,\" David admitted. \"Two million dollars if I could get the client database and the new product development plans. I needed the money because of personal debts.\"",
    vocabulary: ["interrogation", "footage", "trace", "registered", "unreliable"],
    vocabMeanings: { "interrogation": "審問", "footage": "影片片段", "trace": "追蹤", "registered": "註冊的", "unreliable": "不可靠的" },
    questions: [
      { question: "How much money was David offered?", options: ["One million dollars", "Two million dollars", "Five hundred thousand dollars", "Three million dollars"], answer: 1 },
      { question: "Why did David steal company information?", options: ["For fun", "To help a friend", "Because of personal debts", "He was bored"], answer: 2 }
    ],
    difficulty: 2, sort_order: 6
  },
  {
    id: 7, series: "detective", seriesName: "Detective Lin", episode: 7,
    title: "The Deeper Connection",
    content: "David's confession revealed more than Lin expected. David explained that he was not working alone. Someone inside the company had first approached him and suggested the plan. This person knew that David had connections at Nexus Technologies and that he was having financial problems. \"Who approached you?\" Lin asked. David hesitated. \"I only know them by a code name. They called themselves 'Phoenix.' We communicated through encrypted messages on a phone app. Phoenix told me which documents to steal and when to send them.\" Lin asked David to show him the messages on his phone. Most of the messages had been automatically deleted, but a few remained. Lin noticed something in one message. Phoenix had mentioned a meeting in the company cafeteria on a specific date and time. Lin checked the cafeteria security cameras for that date. He saw David sitting alone at a table. A few minutes later, someone sat down across from him. The camera angle was not perfect, but Lin could see it was a woman wearing a company ID badge. She passed something under the table to David. It looked like a small envelope. Lin enhanced the image as much as possible. He could not see the woman's face clearly, but he noticed she was wearing a distinctive silver bracelet. Now he had a new clue to follow.",
    vocabulary: ["confession", "approach", "encrypted", "enhance", "distinctive"],
    vocabMeanings: { "confession": "自白；坦白", "approach": "接近；接洽", "encrypted": "加密的", "enhance": "增強；提升", "distinctive": "獨特的；有特色的" },
    questions: [
      { question: "What was the code name of David's contact?", options: ["Dragon", "Tiger", "Phoenix", "Eagle"], answer: 2 },
      { question: "What clue did Lin find in the cafeteria video?", options: ["A silver bracelet", "A red hat", "A black bag", "A gold ring"], answer: 0 }
    ],
    difficulty: 2, sort_order: 7
  },
  {
    id: 8, series: "detective", seriesName: "Detective Lin", episode: 8,
    title: "The Silver Bracelet",
    content: "The next day, Lin walked through every department in the company. He looked carefully at the wrists of female employees, trying to spot the distinctive silver bracelet from the security footage. It was a wide bracelet with a wave pattern. After visiting four floors, Lin finally saw it. The bracelet was on the wrist of Jennifer Kuo, the executive assistant to the CEO. Jennifer had access to almost every department and knew about confidential projects before most managers did. Her position made her the perfect inside contact. Lin did not approach Jennifer yet. He went back to his office and pulled up her personnel file. She had worked at the company for seven years and had received excellent reviews every year. Her salary was good, but not exceptional. Lin dug deeper. He found that Jennifer had recently purchased an expensive apartment in the Xinyi district. The price was far beyond what her salary could afford. Lin also discovered that Jennifer's brother worked at Nexus Technologies in their business development department. The connection was becoming clear. Jennifer had the inside knowledge, David had the technical skills, and Jennifer's brother was likely the link to Nexus. Lin reported his findings to the company's legal team. They agreed that they had enough evidence to act, but they wanted to be careful.",
    vocabulary: ["executive", "confidential", "exceptional", "purchase", "afford"],
    vocabMeanings: { "executive": "行政的；高階主管", "confidential": "機密的", "exceptional": "傑出的；例外的", "purchase": "購買", "afford": "負擔得起" },
    questions: [
      { question: "Who was wearing the silver bracelet?", options: ["Amy Wu", "Ms. Chen", "Jennifer Kuo", "A cleaning staff member"], answer: 2 },
      { question: "What was Jennifer's position?", options: ["Financial analyst", "IT manager", "Executive assistant to the CEO", "Department manager"], answer: 2 }
    ],
    difficulty: 2, sort_order: 8
  },
  {
    id: 9, series: "detective", seriesName: "Detective Lin", episode: 9,
    title: "The Confrontation",
    content: "The company's legal team, together with Detective Lin, decided to confront Jennifer Kuo. They invited her to a meeting room on the tenth floor. The company's head lawyer, Mr. Chang, was also present. Jennifer walked in with a confident smile. \"What is this about?\" she asked. Lin showed her the security camera photo from the cafeteria. \"Can you explain why you were passing an envelope to David Tsai?\" Jennifer's smile faded slightly, but she stayed calm. \"David is my colleague. We were just having lunch. I was returning a document he had lent me.\" Lin placed more evidence on the table, the email records, David's confession, and the financial records showing her expensive apartment purchase. \"David has already told us everything,\" Lin said. \"He told us about Phoenix.\" Jennifer's face changed completely. She gripped the edge of the table, and her silver bracelet caught the light. For a moment, the room was completely silent. Then Jennifer spoke. \"You do not understand the full picture,\" she said. \"This goes higher than you think. There are people at Nexus who have been planning this for years. I was just following orders.\" Lin leaned forward. \"Whose orders?\" Jennifer looked at Mr. Chang, then back at Lin. \"I will tell you everything, but I want protection. They are dangerous people.\"",
    vocabulary: ["confrontation", "colleague", "confession", "grip", "protection"],
    vocabMeanings: { "confrontation": "對質", "colleague": "同事", "confession": "自白", "grip": "緊握", "protection": "保護" },
    questions: [
      { question: "How did Jennifer react when she saw the evidence?", options: ["She laughed", "She ran away", "Her face changed and she gripped the table", "She started crying"], answer: 2 },
      { question: "What did Jennifer ask for?", options: ["More money", "A promotion", "Protection", "A new job"], answer: 2 }
    ],
    difficulty: 2, sort_order: 9
  },
  {
    id: 10, series: "detective", seriesName: "Detective Lin", episode: 10,
    title: "Case Closed",
    content: "Jennifer's full confession took three hours. She revealed that Nexus Technologies had been running a corporate espionage operation for over two years. Her brother had recruited her, promising a share of the profits. She gave Lin the names of three other employees at Nexus who were involved in receiving and using the stolen information. The company's legal team worked with the police to build a formal case. David Tsai and Jennifer Kuo were both terminated and faced criminal charges. The police also arrested Jennifer's brother and two managers at Nexus Technologies. In the weeks that followed, Lin helped the company strengthen its security systems. He recommended new policies including better key card management, regular audits of email activity, and stricter access controls for sensitive documents. The CEO personally thanked Lin at a company meeting. \"Because of Detective Lin's careful and thorough work, we protected our clients and our business,\" the CEO said. Ms. Chen got her quarterly report back. It had been found on David's personal laptop, along with dozens of other stolen documents. Kevin Lee got a new key card, and Amy Wu was cleared of any suspicion. As Lin returned to his office, his phone rang again. \"Mr. Lin, this is the marketing department. Something strange is happening with our website.\" Lin smiled and picked up his notebook. Another case was beginning.",
    vocabulary: ["espionage", "terminate", "criminal", "audit", "thorough"],
    vocabMeanings: { "espionage": "間諜活動", "terminate": "終止；解雇", "criminal": "刑事的；犯罪的", "audit": "稽核；審計", "thorough": "徹底的" },
    questions: [
      { question: "What happened to David and Jennifer?", options: ["They were promoted", "They were terminated and faced criminal charges", "They were transferred", "Nothing happened"], answer: 1 },
      { question: "What did Lin receive at the end?", options: ["A vacation", "A new case", "A raise", "A warning"], answer: 1 }
    ],
    difficulty: 2, sort_order: 10
  },

  // ============================================================
  // Series 2: Sarah's Business Trip (10 episodes)
  // ============================================================
  {
    id: 11, series: "business", seriesName: "Sarah's Business Trip", episode: 1,
    title: "Preparing for Tokyo",
    content: "Sarah Chen had worked at a trading company in Taipei for two years. She was a junior sales representative, and this was going to be her first international business trip. Her manager, Mr. Liu, called her into his office on Monday morning. \"Sarah, I need you to go to Tokyo next week,\" he said. \"Our client, Yamada Corporation, wants to discuss a new contract. I was supposed to go, but I have a scheduling conflict.\" Sarah felt both excited and nervous. She had never traveled alone for business before. \"Do not worry,\" Mr. Liu said. \"I will give you all the materials you need. Just be professional and listen carefully to what they want.\" That afternoon, Sarah started preparing. She reviewed the current contract with Yamada Corporation and studied their company profile. She also made a list of things to pack, including business cards, her laptop, and appropriate business attire. Her colleague, Tony, had been to Tokyo many times. \"Remember to bow when you greet people,\" Tony advised. \"And always use both hands when giving or receiving business cards. It is very important in Japanese business culture.\" Sarah spent the evening practicing her presentation. She wanted to make a good impression. She also downloaded a translation app on her phone, just in case. Her flight was on Sunday evening.",
    vocabulary: ["representative", "contract", "scheduling", "appropriate", "impression"],
    vocabMeanings: { "representative": "業務代表", "contract": "合約", "scheduling": "排程；行程安排", "appropriate": "適當的", "impression": "印象" },
    questions: [
      { question: "Why couldn't Mr. Liu go to Tokyo?", options: ["He was sick", "He had a scheduling conflict", "He was on vacation", "He quit his job"], answer: 1 },
      { question: "What advice did Tony give Sarah about business cards?", options: ["Put them in your pocket quickly", "Use both hands when giving or receiving them", "Do not bring any", "Write notes on them"], answer: 1 }
    ],
    difficulty: 2, sort_order: 11
  },
  {
    id: 12, series: "business", seriesName: "Sarah's Business Trip", episode: 2,
    title: "At the Airport",
    content: "On Sunday evening, Sarah arrived at Taoyuan International Airport two hours before her flight. She had packed a small suitcase and a laptop bag. At the check-in counter, the airline staff asked for her passport and ticket. \"Would you like a window seat or an aisle seat?\" the staff member asked. \"An aisle seat, please,\" Sarah replied. She thought it would be easier to move around during the three-hour flight. After checking in, Sarah went through security and immigration. The security officer asked her to remove her laptop from her bag and place it in a separate tray. Everything went smoothly. While waiting at the gate, Sarah checked her email. Mr. Liu had sent her the final version of the presentation slides and a list of key discussion points. He also reminded her that the company driver would pick her up at Narita Airport. Sarah bought a cup of coffee and a sandwich at a nearby shop. She noticed many business travelers around her, typing on their laptops or talking on their phones. \"This is my world now,\" she thought with a smile. When boarding began, Sarah lined up with the other passengers. She found her seat, put her bag in the overhead compartment, and fastened her seatbelt. The plane took off into the evening sky. Sarah looked out the window at the lights of Taipei below. Her adventure was beginning.",
    vocabulary: ["check-in", "aisle", "immigration", "boarding", "compartment"],
    vocabMeanings: { "check-in": "報到；登機手續", "aisle": "走道", "immigration": "出入境", "boarding": "登機", "compartment": "置物箱；隔間" },
    questions: [
      { question: "What kind of seat did Sarah choose?", options: ["Window seat", "Aisle seat", "Middle seat", "First class seat"], answer: 1 },
      { question: "Who was going to pick Sarah up at Narita Airport?", options: ["Mr. Liu", "A taxi driver", "The company driver", "A colleague"], answer: 2 }
    ],
    difficulty: 2, sort_order: 12
  },
  {
    id: 13, series: "business", seriesName: "Sarah's Business Trip", episode: 3,
    title: "Checking into the Hotel",
    content: "Sarah arrived at Narita Airport at around 10 PM local time. After going through immigration and customs, she found the company driver waiting for her. He was holding a sign with her name on it. The drive to the hotel in central Tokyo took about an hour. Sarah watched the city lights through the car window. Everything looked so modern and organized. The hotel was a comfortable business hotel near Tokyo Station. Sarah walked to the front desk. \"Good evening. I have a reservation under the name Sarah Chen,\" she said. The receptionist typed on the computer and smiled. \"Yes, Ms. Chen. We have a single room for you for four nights. May I see your passport and a credit card, please?\" Sarah handed over her documents. The receptionist gave her a key card and explained that breakfast was included and served on the second floor from 7 to 9 AM. Her room was on the twelfth floor. The room was small but very clean. There was a comfortable bed, a desk with a lamp, and a small refrigerator. The bathroom had a deep bathtub, which Sarah had heard was common in Japanese hotels. She unpacked her suitcase and hung up her business suit for the next day. Before going to bed, Sarah reviewed the meeting agenda one more time. The meeting with Yamada Corporation was scheduled for 2 PM tomorrow. She set two alarms on her phone. She did not want to be late for her first client meeting.",
    vocabulary: ["customs", "reservation", "receptionist", "agenda", "schedule"],
    vocabMeanings: { "customs": "海關", "reservation": "預約", "receptionist": "接待人員", "agenda": "議程", "schedule": "安排；排定" },
    questions: [
      { question: "Where was Sarah's hotel located?", options: ["Near the airport", "Near Tokyo Station", "In Osaka", "Near Tokyo Tower"], answer: 1 },
      { question: "What time was the meeting with Yamada Corporation?", options: ["10 AM", "12 PM", "2 PM", "4 PM"], answer: 2 }
    ],
    difficulty: 2, sort_order: 13
  },
  {
    id: 14, series: "business", seriesName: "Sarah's Business Trip", episode: 4,
    title: "The Client Meeting",
    content: "Sarah arrived at Yamada Corporation's office fifteen minutes early. The building was a tall glass tower in the Marunouchi business district. She reported to the reception desk on the ground floor, and a young assistant named Yuki came to meet her. Yuki led Sarah to a meeting room on the fifteenth floor. The room had a long table, a projector screen, and a beautiful view of the city. Three people from Yamada Corporation were already seated. Mr. Yamada, the department director, stood up and bowed. Sarah remembered Tony's advice and bowed back. She presented her business card with both hands, and Mr. Yamada did the same. \"Thank you for coming all the way from Taipei,\" Mr. Yamada said in English. \"We appreciate your company's partnership.\" Sarah smiled and thanked him. She set up her laptop and began the presentation. She explained her company's new product line and the special pricing they could offer. Mr. Yamada and his team listened carefully and took notes. They asked several questions about delivery times, minimum order quantities, and after-sales service. Sarah answered most questions confidently. For one question about a technical specification, she said honestly, \"I will need to check with our engineering team and get back to you by tomorrow.\" Mr. Yamada nodded approvingly. The meeting lasted about ninety minutes. At the end, both sides agreed to continue discussions the next day.",
    vocabulary: ["projector", "partnership", "pricing", "quantity", "specification"],
    vocabMeanings: { "projector": "投影機", "partnership": "合作關係", "pricing": "定價", "quantity": "數量", "specification": "規格", },
    questions: [
      { question: "How did Sarah handle a question she could not answer?", options: ["She made up an answer", "She said she would check and respond tomorrow", "She ignored the question", "She changed the topic"], answer: 1 },
      { question: "How long did the meeting last?", options: ["Thirty minutes", "One hour", "Ninety minutes", "Two hours"], answer: 2 }
    ],
    difficulty: 2, sort_order: 14
  },
  {
    id: 15, series: "business", seriesName: "Sarah's Business Trip", episode: 5,
    title: "Cultural Differences",
    content: "After the meeting, Yuki, the assistant, offered to show Sarah around the neighborhood. As they walked, Sarah noticed many things that were different from Taipei. People stood on the left side of the escalator instead of the right. The streets were incredibly clean, with almost no trash anywhere. \"In Japan, we do not have many public trash cans,\" Yuki explained. \"People carry their trash with them until they get home or find a convenience store.\" They stopped at a small ramen shop for dinner. Sarah noticed that people around her were slurping their noodles loudly. In Taiwan, this would be considered rude, but Yuki told her it was actually polite in Japan. \"It means you enjoy the food,\" Yuki said with a laugh. Sarah tried to slurp her ramen too, which made both of them laugh. During dinner, they talked about the differences between working in Japan and Taiwan. Yuki mentioned that meetings in Japan often take longer because decisions are made by group consensus. \"That is why Mr. Yamada did not give you a final answer today,\" Yuki explained. \"He needs to discuss everything with his team first.\" Sarah understood. She had been worried that the meeting did not go well because there was no clear decision. Now she felt much better. She thanked Yuki for the helpful advice. Understanding cultural differences was just as important as knowing the product details.",
    vocabulary: ["escalator", "convenience", "consider", "consensus", "decision"],
    vocabMeanings: { "escalator": "手扶梯", "convenience": "便利", "consider": "認為；考慮", "consensus": "共識", "decision": "決定" },
    questions: [
      { question: "Why do people slurp noodles in Japan?", options: ["Because they are in a hurry", "Because it shows they enjoy the food", "Because the noodles are too hot", "Because it is a rule"], answer: 1 },
      { question: "Why did Mr. Yamada not give a final answer?", options: ["He did not like the proposal", "He forgot", "He needed to discuss with his team first", "The meeting was too short"], answer: 2 }
    ],
    difficulty: 2, sort_order: 15
  },
  {
    id: 16, series: "business", seriesName: "Sarah's Business Trip", episode: 6,
    title: "The Presentation",
    content: "On the second day, Sarah returned to Yamada Corporation for a more detailed presentation. This time, seven people were in the room, including two senior executives she had not met before. Mr. Yamada introduced them as the vice president and the procurement manager. Sarah felt her heart beat faster, but she took a deep breath and began. She had spent the morning updating her slides based on yesterday's questions. She had also received the technical specifications from her engineering team and was ready to address every concern. The presentation covered three main topics: product quality, competitive pricing, and reliable delivery schedules. Sarah showed comparison charts and customer testimonials from other Asian markets. She spoke slowly and clearly, making sure everyone could follow her English. When she finished, the vice president asked a difficult question. \"Your competitor offered us a lower price. Why should we choose your company?\" Sarah was prepared for this. \"Our price includes a two-year warranty and free technical support. If you calculate the total cost, including maintenance, our offer is actually more cost-effective.\" She showed a slide comparing total ownership costs. The room was quiet for a moment, then the vice president nodded. \"That is a fair point,\" he said. After the presentation, Mr. Yamada told Sarah privately that the vice president was impressed. \"I think we are moving in a good direction,\" he said. Sarah felt relieved and proud.",
    vocabulary: ["executive", "procurement", "testimonial", "warranty", "cost-effective"],
    vocabMeanings: { "executive": "高階主管", "procurement": "採購", "testimonial": "客戶見證；推薦", "warranty": "保固", "cost-effective": "符合成本效益的" },
    questions: [
      { question: "What difficult question did the vice president ask?", options: ["About delivery time", "Why their price was higher than a competitor", "About product color", "About Sarah's experience"], answer: 1 },
      { question: "What was included in Sarah's company's price?", options: ["Free products", "A two-year warranty and free technical support", "A company car", "Free flights"], answer: 1 }
    ],
    difficulty: 2, sort_order: 16
  },
  {
    id: 17, series: "business", seriesName: "Sarah's Business Trip", episode: 7,
    title: "The Business Dinner",
    content: "That evening, Mr. Yamada invited Sarah to a traditional Japanese restaurant for dinner. It was a formal business dinner, which is an important part of Japanese business culture. The restaurant was in a quiet street in Ginza. They removed their shoes at the entrance and sat on tatami mats at a low table in a private room. Mr. Yamada had ordered a kaiseki course, which included many small, beautifully arranged dishes. \"In Japan, business dinners are a chance to build trust,\" Mr. Yamada explained. \"We talk less about business and more about getting to know each other.\" Sarah told Mr. Yamada about her family and her hobbies. He shared stories about his trips to Taiwan and how much he enjoyed the night markets. They discovered they both liked hiking. \"You should visit Yangmingshan next time you come to Taipei,\" Sarah suggested. Mr. Yamada poured tea for Sarah, and she learned that in Japan, you should never pour your own drink. You pour for others, and they pour for you. The food was delicious. Sarah especially liked the grilled fish and the tofu soup. At the end of the meal, Sarah offered to pay, but Mr. Yamada insisted that the host company always pays. \"Next time we visit Taipei, it will be your turn,\" he said with a warm smile. Sarah felt that the dinner had strengthened their business relationship.",
    vocabulary: ["formal", "arrange", "trust", "pour", "strengthen"],
    vocabMeanings: { "formal": "正式的", "arrange": "安排；擺設", "trust": "信任", "pour": "倒（飲料）", "strengthen": "加強" },
    questions: [
      { question: "What is the purpose of business dinners in Japan?", options: ["To sign contracts", "To build trust", "To save time", "To discuss prices"], answer: 1 },
      { question: "Who paid for the dinner?", options: ["Sarah", "They split the bill", "Mr. Yamada's company", "Sarah's company"], answer: 2 }
    ],
    difficulty: 2, sort_order: 17
  },
  {
    id: 18, series: "business", seriesName: "Sarah's Business Trip", episode: 8,
    title: "A Day Off in Tokyo",
    content: "Wednesday was a free day before the final meeting on Thursday. Sarah decided to explore Tokyo. She started at the famous Meiji Shrine in Harajuku. The shrine was surrounded by a peaceful forest, and Sarah was amazed that such a quiet place existed in the middle of a busy city. She walked along the gravel path and watched people pray at the main hall. After the shrine, Sarah walked to the trendy Omotesando Avenue. The street was lined with luxury brand shops and interesting architecture. She bought a small gift for her mother at a Japanese craft store. For lunch, she found a tiny sushi restaurant with only eight seats. The chef prepared each piece of sushi right in front of her. It was the freshest fish she had ever tasted. In the afternoon, Sarah took the train to Asakusa to see the Senso-ji temple. The area was full of tourists taking photos and buying souvenirs. She tried some traditional Japanese snacks, including taiyaki, a fish-shaped cake filled with sweet red bean paste. Sarah also visited the Tokyo Skytree, the tallest tower in Japan. From the observation deck, she could see the entire city stretching to the horizon. She took many photos to show her colleagues back in Taipei. It was a wonderful day. Sarah felt refreshed and ready for tomorrow's important final meeting.",
    vocabulary: ["shrine", "architecture", "souvenir", "observation", "refreshed"],
    vocabMeanings: { "shrine": "神社", "architecture": "建築", "souvenir": "紀念品", "observation": "觀景；觀察", "refreshed": "恢復精神的" },
    questions: [
      { question: "What did Sarah buy at the craft store?", options: ["A book", "A gift for her mother", "A phone case", "Nothing"], answer: 1 },
      { question: "What is taiyaki?", options: ["A type of sushi", "A fish-shaped cake with red bean paste", "A drink", "A soup"], answer: 1 }
    ],
    difficulty: 2, sort_order: 18
  },
  {
    id: 19, series: "business", seriesName: "Sarah's Business Trip", episode: 9,
    title: "An Unexpected Challenge",
    content: "On Thursday morning, Sarah woke up to a message from Mr. Liu. There was a problem. The factory in Taichung had reported a delay in production. The new delivery date would be two weeks later than what Sarah had promised Yamada Corporation. Sarah felt her stomach drop. This was terrible timing. The final meeting was in four hours. She immediately called Mr. Liu. \"Can we speed up production somehow?\" she asked. \"I am trying,\" Mr. Liu replied. \"But I cannot make promises. You need to be honest with Mr. Yamada and offer a solution.\" Sarah spent the next two hours working on a plan. She prepared two options for Yamada Corporation. Option one was to accept the two-week delay with a five percent discount on the first order. Option two was to split the delivery into two shipments. The first half would arrive on time, and the second half would come two weeks later. At the meeting, Sarah took a deep breath and explained the situation directly. \"I want to be transparent with you,\" she said. \"We have a production delay, and here are two solutions we can offer.\" Mr. Yamada looked serious. He discussed with his team in Japanese for several minutes. Finally, he turned to Sarah. \"We appreciate your honesty. We will take option two, the split delivery. Can you confirm this in writing by tomorrow?\" Sarah nodded with relief. \"Absolutely. You will have the written confirmation by tomorrow morning.\"",
    vocabulary: ["delay", "transparent", "discount", "shipment", "confirmation"],
    vocabMeanings: { "delay": "延遲", "transparent": "透明的；坦誠的", "discount": "折扣", "shipment": "出貨", "confirmation": "確認" },
    questions: [
      { question: "What problem did Sarah face?", options: ["She lost her passport", "A production delay", "The meeting was canceled", "Her flight was delayed"], answer: 1 },
      { question: "Which option did Yamada Corporation choose?", options: ["The discount", "The split delivery", "They canceled the order", "They asked for a lower price"], answer: 1 }
    ],
    difficulty: 2, sort_order: 19
  },
  {
    id: 20, series: "business", seriesName: "Sarah's Business Trip", episode: 10,
    title: "Coming Home",
    content: "On Friday morning, Sarah checked out of the hotel and took the train to Narita Airport. In her bag, she carried a signed letter of intent from Yamada Corporation. It was not a final contract yet, but it was a strong commitment to move forward with the partnership. Mr. Liu had told her on the phone that this was an excellent result for a first visit. At the airport, Sarah bought some Japanese snacks for her colleagues and a beautiful ceramic cup for Tony, who had given her so much useful advice. On the plane, Sarah looked out the window as Tokyo disappeared below the clouds. She thought about everything she had learned during the trip. She had learned that honesty builds trust, even when delivering bad news. She had learned that understanding cultural differences helps build stronger relationships. And she had learned that being well-prepared gives you confidence, even in difficult situations. When Sarah landed in Taipei, she felt like a different person. She was no longer a nervous junior employee afraid of her first business trip. She was a confident professional who could handle international clients. On Monday morning, Mr. Liu called her into his office again. \"Great work in Tokyo, Sarah,\" he said. \"Yamada Corporation sent me a very positive email about you. By the way, our client in Singapore wants to meet next month. Are you interested?\" Sarah smiled. \"I would love to go.\"",
    vocabulary: ["commitment", "partnership", "ceramic", "confidence", "professional"],
    vocabMeanings: { "commitment": "承諾", "partnership": "合作關係", "ceramic": "陶瓷的", "confidence": "自信", "professional": "專業人士" },
    questions: [
      { question: "What did Sarah bring back from Tokyo?", options: ["A signed contract", "A signed letter of intent", "A gift from Mr. Yamada", "Nothing"], answer: 1 },
      { question: "Where is Sarah's next business trip?", options: ["Tokyo again", "New York", "Singapore", "London"], answer: 2 }
    ],
    difficulty: 2, sort_order: 20
  },

  // ============================================================
  // Series 3: The Coffee Shop (10 episodes)
  // ============================================================
  {
    id: 21, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 1,
    title: "A New Beginning",
    content: "On a quiet corner of Zhongshan North Road in Taipei, there was a small coffee shop called \"Bean & Leaf.\" The owner, Uncle Chen, had opened it twenty years ago after retiring from a career in banking. The shop had wooden tables, soft jazz music, and the wonderful smell of freshly roasted coffee beans. Uncle Chen knew every regular customer by name. He remembered their favorite drinks and always asked about their families. This morning, a young woman named Mei walked in. She was carrying a box of pastries. \"Uncle Chen, I want to ask you something,\" she said nervously. \"I lost my office job last month. I have always dreamed of becoming a baker. Would you let me sell my pastries in your shop?\" Uncle Chen tasted one of her pineapple cakes. His eyes widened. \"This is delicious,\" he said. \"Even better than the famous bakery down the street.\" He thought for a moment. \"I will give you the display case near the window. We can split the profits fifty-fifty. If your pastries sell well for three months, we can discuss a more permanent arrangement.\" Mei's face lit up with joy. \"Thank you so much, Uncle Chen! You will not regret this.\" She ran out to call her mother with the good news. Uncle Chen smiled and returned to making coffee. He always enjoyed helping young people chase their dreams.",
    vocabulary: ["retire", "pastry", "display", "profit", "permanent"],
    vocabMeanings: { "retire": "退休", "pastry": "糕點", "display": "展示", "profit": "利潤", "permanent": "永久的" },
    questions: [
      { question: "What did Mei want to do at the coffee shop?", options: ["Work as a waitress", "Sell her pastries", "Buy coffee beans", "Have a meeting"], answer: 1 },
      { question: "What was Uncle Chen's previous career?", options: ["Teaching", "Banking", "Cooking", "Engineering"], answer: 1 }
    ],
    difficulty: 2, sort_order: 21
  },
  {
    id: 22, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 2,
    title: "The Study Group",
    content: "Every Saturday afternoon, a group of four university students came to Bean & Leaf to study together. They always sat at the big table near the bookshelf. There was Jason, who was studying business management. Lisa was majoring in English literature. Kevin studied computer science, and Wendy was in the nursing program. Today, they were all stressed about their upcoming midterm exams. \"I cannot remember anything about marketing theories,\" Jason complained, dropping his head onto his textbook. Lisa looked up from her novel. \"Try making flashcards. That is how I memorize vocabulary.\" Kevin was typing on his laptop, building a study app. \"I made a quiz program for our class. Do you want to try it?\" Wendy brought everyone cups of Uncle Chen's special blend coffee. \"We need fuel for studying,\" she said. Mei, who was arranging pastries in the display case, overheard their conversation. She brought over a plate of free samples. \"Brain food,\" she said with a wink. The students thanked her and continued studying. Three hours later, they finally closed their books. \"Same time next week?\" Jason asked. Everyone nodded. As they left, Uncle Chen gave them a small discount on their bill. \"Students who study hard deserve a little reward,\" he said. The study group had been coming to Bean & Leaf for two years now. It felt like their second home.",
    vocabulary: ["major", "upcoming", "memorize", "blend", "deserve"],
    vocabMeanings: { "major": "主修", "upcoming": "即將來臨的", "memorize": "記住；背誦", "blend": "混合；綜合", "deserve": "值得" },
    questions: [
      { question: "How many students were in the study group?", options: ["Three", "Four", "Five", "Six"], answer: 1 },
      { question: "What did Kevin make to help with studying?", options: ["Flashcards", "A quiz program", "A website", "A video"], answer: 1 }
    ],
    difficulty: 2, sort_order: 22
  },
  {
    id: 23, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 3,
    title: "The Job Interview",
    content: "A man in a neat suit walked into Bean & Leaf on a Tuesday morning. He looked anxious and kept checking his watch. He ordered a black coffee and sat near the window, reviewing papers in a folder. Uncle Chen noticed the man's hands were shaking slightly. \"First job interview?\" Uncle Chen asked gently when he brought the coffee. The man looked surprised. \"How did you know?\" \"I have seen many nervous people in this shop over the years,\" Uncle Chen said. \"What position are you interviewing for?\" \"Marketing manager at a tech company,\" the man replied. \"My name is James. I have been unemployed for six months since my previous company closed. I really need this job.\" Uncle Chen sat down across from him. \"Let me tell you something. When I was young, I failed my first three job interviews. I was so nervous that I could not even speak clearly. But then someone told me a secret. The interviewer is also a human being. They are not there to judge you. They just want to find someone who can help their company.\" James smiled for the first time. \"That actually makes me feel better.\" Mei came over with a warm croissant. \"On the house,\" she said. \"For good luck.\" James thanked them both and left the shop looking much more confident. Two days later, James came back to Bean & Leaf with a big smile. \"I got the job!\" he announced. Uncle Chen clapped his hands. \"I knew you would.\"",
    vocabulary: ["anxious", "review", "unemployed", "interviewer", "confident"],
    vocabMeanings: { "anxious": "焦慮的", "review": "複習；檢閱", "unemployed": "失業的", "interviewer": "面試官", "confident": "有自信的" },
    questions: [
      { question: "How long had James been unemployed?", options: ["Two months", "Four months", "Six months", "One year"], answer: 2 },
      { question: "What happened after the interview?", options: ["James did not get the job", "James got the job", "The interview was canceled", "James decided not to go"], answer: 1 }
    ],
    difficulty: 2, sort_order: 23
  },
  {
    id: 24, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 4,
    title: "The Lost Wallet",
    content: "One rainy afternoon, a teenage girl rushed into Bean & Leaf. She was wet from the rain and looked like she was about to cry. \"Excuse me, did anyone find a pink wallet?\" she asked desperately. Uncle Chen shook his head. \"I am sorry, I have not seen one. When did you last have it?\" \"I was here this morning with my grandmother. I think I left it on the table by the door,\" the girl said. Her name was Sophie, and she explained that the wallet contained her student ID, some cash, and most importantly, a small photo of her late grandfather. Uncle Chen immediately checked the lost and found box behind the counter, but the wallet was not there. He asked Mei and the part-time staff, but nobody had seen it. \"Do not give up hope,\" Uncle Chen said. He wrote a note and taped it to the front door asking anyone who found a pink wallet to return it. Then he posted the same message on the coffee shop's social media page. The next morning, an elderly woman came into the shop holding a pink wallet. \"I found this on the sidewalk outside yesterday,\" she said. \"I saw your post on the internet.\" Uncle Chen called Sophie immediately. When she arrived and opened the wallet, the photo of her grandfather was still inside. She hugged the wallet tightly and thanked the elderly woman many times. \"This photo is irreplaceable,\" Sophie said with tears of happiness. Uncle Chen gave the elderly woman free coffee for a month as a thank-you gift.",
    vocabulary: ["desperately", "contain", "immediately", "elderly", "irreplaceable"],
    vocabMeanings: { "desperately": "拼命地；急切地", "contain": "包含", "immediately": "立即", "elderly": "年長的", "irreplaceable": "無可取代的" },
    questions: [
      { question: "What was most important in Sophie's wallet?", options: ["Money", "Her student ID", "A photo of her grandfather", "A credit card"], answer: 2 },
      { question: "How was the wallet found?", options: ["Uncle Chen found it", "Sophie found it herself", "An elderly woman found it and saw the social media post", "The police found it"], answer: 2 }
    ],
    difficulty: 2, sort_order: 24
  },
  {
    id: 25, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 5,
    title: "The Music Night",
    content: "Mei had an idea. \"Uncle Chen, what if we have a live music night every Friday?\" she suggested. \"It could attract more customers and make the shop more lively.\" Uncle Chen was not sure at first. \"This is a quiet coffee shop, not a bar,\" he said. But Mei was persistent. She had met a young musician named Alex who played acoustic guitar and sang soft folk songs. \"Just let us try it once,\" Mei said. Uncle Chen agreed to one trial night. On Friday evening, Alex set up his guitar in the corner of the shop. He started with a gentle song about rain and memories. The regular customers looked up from their books and laptops, curious. By the second song, people were smiling. By the third song, some were softly singing along. The atmosphere was magical. New customers walking past the shop heard the music and came inside. By 9 PM, every seat was taken. Mei's pastries sold out completely for the first time. Uncle Chen stood behind the counter, watching the scene with a warm feeling in his heart. He had not seen the shop this full in years. At the end of the night, several customers asked when the next music night would be. Uncle Chen looked at Mei. \"I think we have a new tradition,\" he said. From that week on, Friday Music Night became Bean & Leaf's most popular event. Alex became a regular performer, and sometimes other musicians joined him too.",
    vocabulary: ["attract", "persistent", "acoustic", "atmosphere", "tradition"],
    vocabMeanings: { "attract": "吸引", "persistent": "堅持不懈的", "acoustic": "原聲的；不插電的", "atmosphere": "氛圍", "tradition": "傳統" },
    questions: [
      { question: "What instrument did Alex play?", options: ["Piano", "Violin", "Acoustic guitar", "Drums"], answer: 2 },
      { question: "What happened on the first music night?", options: ["Nobody came", "Every seat was taken", "Uncle Chen was angry", "Alex forgot his guitar"], answer: 1 }
    ],
    difficulty: 2, sort_order: 25
  },
  {
    id: 26, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 6,
    title: "The Blind Date",
    content: "Lisa from the study group asked Uncle Chen for a favor. \"My cousin is going on a blind date here on Saturday. Can you help make it special?\" Uncle Chen was happy to help. Lisa's cousin, Rachel, was a shy kindergarten teacher. Her date was Tom, an accountant who loved cooking. Uncle Chen reserved the nicest table by the window and put a small vase of flowers on it. He also asked Mei to prepare her best pastries for the occasion. On Saturday afternoon, Rachel arrived first. She was wearing a blue dress and looked nervous. She kept adjusting her hair. Tom arrived five minutes later, carrying a small box. \"Hi, I am Tom. I made some cookies for you,\" he said, handing her the box. \"I heard you work with children, so I made them in animal shapes.\" Rachel opened the box and laughed. There were cookies shaped like cats, dogs, and rabbits. \"These are adorable! My students would love them,\" she said. The ice was broken. They talked easily after that, discovering they both grew up in Tainan and both loved hiking. Uncle Chen brought them his special cappuccinos with heart-shaped latte art. Mei watched from behind the counter and whispered to Uncle Chen, \"I think this one is going to work out.\" They stayed for almost three hours, talking and laughing. When they left, Tom held the door open for Rachel, and she was smiling brightly. The next week, they came back together again.",
    vocabulary: ["favor", "reserve", "occasion", "adorable", "discover"],
    vocabMeanings: { "favor": "幫忙；恩惠", "reserve": "預留；保留", "occasion": "場合", "adorable": "可愛的", "discover": "發現" },
    questions: [
      { question: "What did Tom bring for Rachel?", options: ["Flowers", "A book", "Animal-shaped cookies", "A card"], answer: 2 },
      { question: "What did Rachel and Tom have in common?", options: ["They both grew up in Tainan", "They both worked in schools", "They both played guitar", "They both studied accounting"], answer: 0 }
    ],
    difficulty: 2, sort_order: 26
  },
  {
    id: 27, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 7,
    title: "The Rainy Day Rescue",
    content: "A typhoon warning was announced for Taipei on a Wednesday. Most shops on the street closed early, but Uncle Chen kept Bean & Leaf open. \"People might need shelter,\" he said. By noon, the rain was pouring down heavily and the wind was howling. A mother with two young children ran into the shop, completely soaked. \"Please, can we stay here until the rain stops?\" she asked. \"Of course,\" Uncle Chen said. He gave them towels and made hot chocolate for the children. Soon, more people came in to escape the storm. An elderly couple who had been walking to the hospital. A delivery driver whose motorcycle had broken down. A tourist from Canada who was lost and confused. Mei made sandwiches for everyone using the bread from her bakery supplies. Uncle Chen did not charge anyone. \"Today, we are not a business. We are a community center,\" he said. The children drew pictures on napkins while their mother dried their clothes near the heater. The tourist, whose name was Mark, played card games with the elderly couple. The delivery driver helped Uncle Chen move furniture away from a window that was leaking. For five hours, these strangers became like a small family. When the storm finally passed, everyone thanked Uncle Chen and Mei. The mother tried to pay, but Uncle Chen refused. \"Just come back on a sunny day,\" he said. Mark, the Canadian tourist, left a glowing review online that night, calling Bean & Leaf the warmest place in Taipei.",
    vocabulary: ["typhoon", "shelter", "soaked", "community", "furniture"],
    vocabMeanings: { "typhoon": "颱風", "shelter": "避難所；庇護", "soaked": "濕透的", "community": "社區", "furniture": "家具" },
    questions: [
      { question: "Why did Uncle Chen keep the shop open during the typhoon?", options: ["To make money", "Because people might need shelter", "He forgot to close", "He wanted to watch the storm"], answer: 1 },
      { question: "What did Mark, the tourist, do after the storm?", options: ["He left without saying anything", "He left a glowing review online", "He complained about the coffee", "He never came back"], answer: 1 }
    ],
    difficulty: 2, sort_order: 27
  },
  {
    id: 28, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 8,
    title: "The Art Exhibition",
    content: "Wendy from the study group had a hidden talent. She painted watercolor pictures in her free time. One day, she shyly showed some of her paintings to Uncle Chen. They were beautiful scenes of Taipei, including the coffee shop itself, the nearby park, and the temple down the street. \"These are wonderful,\" Uncle Chen said. \"Would you like to display them on our walls?\" Wendy was thrilled but also scared. \"What if people do not like them?\" she worried. \"You will never know unless you try,\" Uncle Chen replied. They organized a small exhibition on a Saturday. Mei baked special art-themed cookies. Alex volunteered to play background music. The study group helped hang the paintings and set up small lights to illuminate each one. Wendy had twelve paintings in total, and she wrote a short description for each one. When the first customers saw the paintings, the reactions were very positive. \"This looks exactly like the view from my apartment,\" one woman said about a painting of Taipei 101 at sunset. By the end of the day, three people had asked if they could buy paintings. Wendy was shocked. She had never imagined anyone would want to pay for her art. She sold two paintings and donated the money to a children's hospital. \"This is the best day of my life,\" Wendy told Uncle Chen. The paintings stayed on the walls for a month, and Bean & Leaf became known as a place that supported local artists.",
    vocabulary: ["watercolor", "exhibition", "illuminate", "reaction", "donate"],
    vocabMeanings: { "watercolor": "水彩", "exhibition": "展覽", "illuminate": "照亮", "reaction": "反應", "donate": "捐贈" },
    questions: [
      { question: "How many paintings did Wendy display?", options: ["Eight", "Ten", "Twelve", "Fifteen"], answer: 2 },
      { question: "What did Wendy do with the money from selling paintings?", options: ["She kept it", "She donated it to a children's hospital", "She gave it to Uncle Chen", "She bought more paint"], answer: 1 }
    ],
    difficulty: 2, sort_order: 28
  },
  {
    id: 29, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 9,
    title: "The Competition",
    content: "One morning, Uncle Chen noticed a new sign across the street. A large chain coffee shop called \"CoffeeWorld\" was opening next month. The sign promised low prices, free WiFi, and a modern atmosphere. Uncle Chen felt worried for the first time in years. How could his small shop compete with a big company? Mei noticed his concern. \"Uncle Chen, we have something they do not have. We have real relationships with our customers.\" But the worry did not go away easily. When CoffeeWorld opened, some of Bean & Leaf's customers started going there. The new shop was bright, spacious, and had comfortable sofas. Their coffee was cheaper too. Business at Bean & Leaf dropped by about thirty percent in the first two weeks. The study group held an emergency meeting. \"We cannot let Bean & Leaf close,\" Jason said. They created a social media campaign telling the story of Bean & Leaf. They posted photos and shared memories. Lisa wrote a blog post titled \"Why Your Neighborhood Coffee Shop Matters.\" The post went viral and was shared over ten thousand times. Customers, old and new, started coming back. Many people brought friends. James, who got his job after visiting the shop, brought his entire office team. Mark, the Canadian tourist, shared the story with his followers online. Within a month, Bean & Leaf was busier than ever. Uncle Chen learned that his greatest strength was not coffee. It was the community he had built over twenty years.",
    vocabulary: ["chain", "compete", "spacious", "campaign", "viral"],
    vocabMeanings: { "chain": "連鎖（店）", "compete": "競爭", "spacious": "寬敞的", "campaign": "活動；宣傳", "viral": "病毒式傳播的" },
    questions: [
      { question: "What opened across the street from Bean & Leaf?", options: ["A restaurant", "A bookstore", "A chain coffee shop", "A clothing store"], answer: 2 },
      { question: "How did the community help Bean & Leaf?", options: ["They gave Uncle Chen money", "They created a social media campaign", "They protested outside CoffeeWorld", "They wrote letters to the mayor"], answer: 1 }
    ],
    difficulty: 2, sort_order: 29
  },
  {
    id: 30, series: "coffeeshop", seriesName: "The Coffee Shop", episode: 10,
    title: "The Anniversary Party",
    content: "December fifteenth was Bean & Leaf's twentieth anniversary. Uncle Chen had not planned anything special, but Mei and the regulars had a surprise for him. When Uncle Chen arrived at the shop that morning, the door was decorated with balloons and a banner that read \"Happy 20th Anniversary, Bean & Leaf!\" Inside, dozens of people were waiting. Mei had organized everything. There were familiar faces everywhere. The study group was there, now all graduated and working. Jason was a marketing manager, Lisa was a teacher, Kevin was a software engineer, and Wendy was a nurse. Her paintings still hung on the walls. James came with his wife and baby. Sophie brought her grandmother. Rachel and Tom, who had their first date at Bean & Leaf, announced that they were getting married next spring. Alex played a special song he had written called \"The Coffee Shop on the Corner.\" Even Mark, the Canadian tourist, had sent a video message saying Bean & Leaf was his favorite memory of Taiwan. Uncle Chen stood behind his counter, looking at all these people whose lives had been touched by his little shop. His eyes filled with tears. \"Twenty years ago, I just wanted to make good coffee,\" he said. \"I never expected to gain such a wonderful family.\" Everyone raised their cups. \"To Bean & Leaf,\" they said together. \"And to Uncle Chen.\" Mei brought out a cake she had baked in the shape of a coffee cup. Uncle Chen blew out the candles and made a wish. He wished for twenty more years of good coffee and good company.",
    vocabulary: ["anniversary", "decorate", "announce", "previous", "gain"],
    vocabMeanings: { "anniversary": "週年紀念", "decorate": "裝飾", "announce": "宣布", "previous": "先前的", "gain": "獲得" },
    questions: [
      { question: "What news did Rachel and Tom share?", options: ["They were moving away", "They were getting married", "They were opening a shop", "They were having a baby"], answer: 1 },
      { question: "What shape was the anniversary cake?", options: ["A heart", "A star", "A coffee cup", "A number 20"], answer: 2 }
    ],
    difficulty: 2, sort_order: 30
  }
];
