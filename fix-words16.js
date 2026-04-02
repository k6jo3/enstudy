#!/usr/bin/env node
// Add missing exampleZh translations to words16.js

const fs = require('fs');
const path = require('path');

// Additional translations for words16.js (Family, Relationships, and Social Life sections)
const additionalTranslations = {
  "She has three siblings—two brothers and one sister.": "她有三個兄弟姊妹——兩個哥哥和一個妹妹。",
  "Her stepparent has been a loving and supportive figure in her life.": "她的繼父母一直是她生活中充滿愛心和支持的人。",
  "After the parents passed away, the uncle became the children's legal guardian.": "父母去世後，叔叔成為孩子們的法定監護人。",
  "Good leaders empathize with their team members' challenges.": "好的領導者與團隊成員的困難感同身受。",
  "Words of consolation helped her through the difficult time.": "安慰的言語幫助她度過了難關。",
  "The two friends achieved reconciliation after years of not speaking.": "這兩個朋友在多年沒有交談後達成了和解。",
  "She became estranged from her family after moving overseas.": "她移居海外後與家人疏遠了。",
  "She confided her worries to her closest friend.": "她向最親密的朋友傾訴了她的擔憂。",
  "His candor during the meeting surprised everyone.": "他在會議中的坦率令所有人驚訝。",
  "The speaker's eloquence captivated the entire audience.": "演講者的口才迷住了整個觀眾。",
  "He seemed aloof at first but warmed up once you got to know him.": "他起初似乎冷漠，但一旦你認識他就會熱情起來。",
  "The amiable shopkeeper greeted every customer with a smile.": "這位親切的店主用微笑迎接每位顧客。",
  "His condescending tone annoyed everyone in the room.": "他居高臨下的語氣惹惱了房間裡的每個人。",
  "She is gregarious by nature and loves meeting new people at parties.": "她天性好交際，喜歡在派對上認識新的人。",
  "His vindictive behavior after the breakup hurt many people.": "他分手後的報復性行為傷害了許多人。",
  "Sending flowers was a thoughtful gesture that brightened her day.": "送花是一個貼心的舉動，讓她的日子更明亮。",
  "The argument was caused by a simple misunderstanding.": "這場爭論是由一個簡單的誤會引起的。",
  "The couple had a quarrel about money but made up quickly.": "這對夫婦為了錢爭吵，但很快就和好了。",
  "A serious rift developed between the two business partners.": "兩個商業夥伴之間產生了嚴重的裂痕。",
  "The siblings called a truce and stopped arguing over the remote.": "兄弟姊妹達成停戰協議，停止為遙控器爭吵。",
  "Instead of offering platitudes, she gave practical advice.": "她沒有提供陳詞濫調，而是給出了實際的建議。",
  "His speech was full of innuendo about the rival company's problems.": "他的演講充滿了對對手公司問題的暗示。",
  "His sarcasm made it hard to tell if he was being serious or joking.": "他的諷刺讓人很難判斷他是認真還是在開玩笑。",
  "The team built strong camaraderie through years of working together.": "團隊通過多年的合作建立了強烈的同志情誼。",
  "She gave her grandmother an affectionate hug.": "她給奶奶一個充滿深情的擁抱。",
  "The belligerent customer shouted at the cashier over a small mistake.": "這位好戰的顧客因為一個小錯誤對收銀員大喊大叫。",
  "Friends gathered to commiserate with him after he lost his job.": "朋友們聚集在一起與他同情他失業的遭遇。",
  "His constant lateness exasperated his manager.": "他經常遲到使他的經理感到惱怒。",
  "We sent a card to express our condolences to the family.": "我們寄了一張卡片向家人表示慰問。",
  "He gave a nonchalant shrug when asked about his exam results.": "當被問到考試成績時，他不在乎地聳了聳肩。",
  "She is reticent about sharing personal details with strangers.": "她不願意與陌生人分享個人細節。",
  "Despite the divorce, they maintained an amicable relationship.": "儘管離婚，他們仍然保持著友好的關係。",
  "The new neighbor is affable and always waves hello.": "新鄰居很友善，總是揮手打招呼。",
  "She remonstrated with the children about leaving their toys everywhere.": "她就孩子們到處留下玩具的事向他們抱怨。",
  "The friendly banter between the coworkers made the office a fun place.": "同事之間友善的玩笑使辦公室成為一個有趣的地方。",
  "She rebuffed his invitation to dinner without hesitation.": "她毫不猶豫地拒絕了他的晚餐邀請。",
  "He tried to placate his angry wife with flowers and an apology.": "他試圖用花和道歉來安撫他生氣的妻子。",
  "After a long debate, she finally relented and accepted the group's decision.": "經過長期辯論後，她最終讓步並接受了小組的決定。",
  "He often uses terms of endearment like 'sweetheart' when speaking to his wife.": "他經常在與妻子說話時使用'親愛的'等昵稱。",
  "His tactless comment about her weight ruined the evening.": "他對她體重的不聰明評論毀了整個晚上。",
  "She volunteered for chaperoning duties on the school field trip.": "她自願為學校實地考察陪同。",
  "An altercation broke out between two drivers at the intersection.": "兩個司機在十字路口發生了爭執。",
  "The host greeted every guest with genuine cordiality.": "主人以真誠的熱情迎接每位客人。",
  "He spoke in a deferential tone when addressing the judge.": "他在對法官說話時用恭敬的語氣。",
  "The convivial atmosphere at the dinner party made everyone feel welcome.": "晚宴上歡樂的氣氛讓每個人都感到受歡迎。",
  "She gave a wistful smile when looking at old childhood photos.": "看著童年的舊照片時，她懷念地微笑著。",
  "It was magnanimous of her to forgive him after such a serious mistake.": "在他犯了這麼嚴重的錯誤後，她寬宏大量地原諒了他。",
  "The petulant child threw a tantrum when told he couldn't have ice cream.": "當被告知不能吃冰淇淋時，這個脾氣暴躁的孩子大發脾氣。",
  "The genial host made sure every guest felt comfortable.": "這位親切的主人確保每位客人都感到舒適。",
  "The cantankerous old man complained about everything the neighbors did.": "這個脾氣暴躁的老人對鄰居做的一切都抱怨。",
  "It would be churlish to refuse such a generous offer.": "拒絕這樣慷慨的提議將是無禮的。",
  "He gave a rueful smile after admitting his mistake.": "承認錯誤後，他帶著悔恨的微笑。",
  "The disgruntled employees demanded better working conditions.": "不滿的員工要求更好的工作條件。",
  "She found solace in music during the difficult period.": "在困難時期，她在音樂中找到了安慰。",
  "I don't begrudge him his success—he worked hard for it.": "我不嫉妒他的成功——他為此努力工作。",
  "The congenial atmosphere of the café made it a great place to study.": "咖啡館的友善氣氛使其成為一個很好的學習地點。",
  "His obsequious behavior toward the boss annoyed his coworkers.": "他對老闆的諂媚行為惹惱了他的同事。",
};

function fixWords16() {
  try {
    const filePath = 'D:\\workspace-jason\\enStuido\\server\\data\\words16.js';
    const content = fs.readFileSync(filePath, 'utf-8');

    let updated = content;
    let count = 0;

    // Replace each missing example to add exampleZh
    for (const [example, exampleZh] of Object.entries(additionalTranslations)) {
      const escapedExample = example.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Find the word object containing this example and add exampleZh
      const regex = new RegExp(
        `(\\{[^}]*example: "${escapedExample}"[^}]*)(\s*\\}[,]?)`,
        'g'
      );

      if (regex.test(updated)) {
        updated = updated.replace(
          regex,
          `$1, exampleZh: "${exampleZh}"$2`
        );
        count++;
      }
    }

    // Write back
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✓ words16.js: Added ${count} exampleZh fields`);

  } catch (error) {
    console.error(`✗ Error:`, error.message);
  }
}

fixWords16();
