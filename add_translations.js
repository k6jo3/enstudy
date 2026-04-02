const fs = require('fs');

const translations = {
  "We enjoyed a cocktail at the rooftop bar before dinner.": "我們在晚餐前在屋頂酒吧享受雞尾酒。",
  "The barista made a beautiful latte with a flower pattern on top.": "咖啡師用花卉圖案在上面製作了美麗的拿鐵。",
  "The waiter brought the menu and took our drink orders right away.": "服務生帶來菜單並立即接受我們的飲料訂單。",
  "The waitress recommended the daily special which was grilled salmon.": "女服務生推薦了今日特餐，這是烤鮭魚。",
  "The hostess showed us to a quiet table by the window.": "女主人帶我們到窗邊的一個安靜的桌子。",
  "We ordered takeout because we were too tired to eat at the restaurant.": "我們點了外帶因為我們太累了，不想在餐廳用餐。",
  "Would you like this order for dine-in or takeout today?": "你今天想要內用還是外帶這個訂單？",
  "The restaurant updates its menu every season with fresh local ingredients.": "這家餐廳每季都用新鮮的當地食材更新菜單。",
  "We left a generous tip because the service was excellent.": "因為服務很好，我們留了豐厚的小費。",
  "We go to that cafe for brunch every Sunday with our friends.": "我們每個星期天都和朋友去那家咖啡館吃早午餐。",
  "The portions at this restaurant are large enough for two people.": "這家餐廳的份量足夠兩個人吃。",
  "Ketchup and mustard are the most common condiments for hot dogs.": "番茄醬和芥末是熱狗最常見的調味品。",
  "Chopsticks are the standard eating utensils in most Asian countries.": "筷子是大多數亞洲國家的標準餐具。",
  "The hotel offers a same-day laundry service for its guests.": "飯店為客人提供當日洗衣服務。",
  "Fresh towels are provided in the bathroom every morning by housekeeping.": "客房服務每天早上在浴室提供乾淨毛巾。",
  "I asked for an extra pillow to make my bed more comfortable.": "我要求額外的枕頭以使我的床更舒適。",
  "The nights are cold here so you may need an extra blanket.": "這裡的夜晚很冷，你可能需要額外的毯子。",
  "The mattress in our room was firm and very comfortable.": "我們房間的床墊很堅固而舒適。",
  "Each room comes with a soft bathrobe and a pair of slippers.": "每個房間都配有軟浴袍和一雙拖鞋。",
  "We enjoyed our morning coffee on the balcony overlooking the ocean.": "我們在俯瞰大海的陽台上享受早晨的咖啡。",
  "The rooftop terrace is a perfect spot for watching the sunset.": "屋頂露台是看日落的完美地點。",
  "The hotel staff brought a cot to the room for our young child.": "飯店工作人員為我們的小孩帶來了行軍床。",
  "The bed linen is changed every day to ensure guest comfort.": "床單每天更換以確保客人舒適。",
  "We booked adjoining rooms so our family could stay close together.": "我們預訂了相鄰的房間，以便家人可以住在一起。",
  "The all-inclusive package covers meals, drinks, and entertainment.": "全包套餐包括餐飲、飲料和娛樂。",
  "The flight was overbooked so they offered vouchers to volunteers.": "班機超額預訂，所以他們向志願者提供了代金券。",
  "The old hotel was completely refurbished and reopened last month.": "這家老飯店已完全翻新，上月重新開放。",
  "They plan to renovate the dining hall and add more seating.": "他們計劃翻修餐廳並增加更多座位。",
  "A continental breakfast with bread, jam, and coffee is served daily.": "每天都會提供歐式早餐，包括麵包、果醬和咖啡。",
  "The room has a small microwave so you can heat up leftovers.": "房間有小型微波爐，你可以加熱剩菜。",
  "The monument in the city square honors the soldiers who served.": "城市廣場中的紀念碑向服役的士兵致敬。",
  "The cathedral took over two hundred years to build and is truly stunning.": "這座大教堂花費了兩百多年才建成，真的令人驚嘆。",
  "The art gallery features paintings by both local and international artists.": "美術館展出本地和國際藝術家的繪畫。",
  "The museum has a special exhibit on ancient Egyptian culture this month.": "博物館本月有關於古埃及文化的特別展覽。",
  "The tower is the most famous landmark in the entire country.": "這座塔是整個國家最著名的地標。",
  "The old town is listed as a UNESCO World Heritage Site.": "老城被列為聯合國教科文組織世界遺產。",
  "We explored the ancient ruins of a Roman fortress on the hilltop.": "我們探索了山頂上古羅馬堡壘的遺跡。",
  "The Buddhist temple on the mountain attracts thousands of visitors yearly.": "山上的佛教寺廟每年吸引數千名遊客。",
  "The royal palace is surrounded by beautiful gardens and a large fountain.": "王宮被美麗的花園和一個大噴泉所包圍。",
  "Tourists throw coins into the fountain and make a wish.": "遊客向噴泉投擲硬幣並許願。",
  "The bronze statue in the park honors a famous historical figure.": "公園中的青銅雕像紀念一位著名的歷史人物。",
  "Going on a safari in Africa was a dream come true for us.": "去非洲野生動物園對我們來說是夢想成真。",
  "Snorkeling in the crystal clear water revealed colorful fish and coral.": "在清澈的水中浮潛發現了五彩繽紛的魚和珊瑚。",
  "The zipline over the jungle canopy was the most thrilling part of the trip.": "叢林頂部的高空滑索是旅程中最令人興奮的部分。",
  "We tried paragliding off the cliff and the views were absolutely incredible.": "我們從懸崖上滑翔傘，景色絕對令人難以置信。",
  "Kayaking through the mangrove forest was a peaceful and relaxing experience.": "在紅樹林森林中划獨木舟是一個寧靜放鬆的體驗。",
  "The national museum has an impressive collection of historical artifacts.": "國家博物館有令人印象深刻的歷史文物收集。",
  "The children loved watching the dolphins perform at the aquarium.": "孩子們喜歡在水族館觀看海豚表演。",
  "We visited the observatory on the hilltop to gaze at the stars.": "我們訪問了山頂上的天文台以凝視星星。",
  "The planetarium show about the solar system fascinated the whole family.": "關於太陽系的天文館表演吸引了整個家族。",
  "The ancient amphitheater once held performances for thousands of spectators.": "古代圓形劇場曾為數千名觀眾舉辦表演。",
  "The old fortress on the hill provided protection against enemy attacks.": "山上的古堡防禦敵人的攻擊。",
  "The citadel at the center of town dates back to the medieval era.": "鎮中心的城堡可追溯到中世紀。",
  "The lighthouse on the rocky cliff guides ships safely into the harbor.": "岩石懸崖上的燈塔將船隻安全引入港口。",
  "The Great Pyramid of Giza is one of the Seven Wonders.": "吉薩大金字塔是七大奇蹟之一。",
  "The five-story pagoda is the oldest wooden structure in the region.": "五層寶塔是該地區最古老的木製結構。",
  "The monks at the monastery welcome visitors who wish to meditate.": "修道院的僧侶歡迎希望冥想的遊客。",
  "Visitors pray and leave offerings at the shrine near the river.": "遊客在河邊的神社祈禱並留下祭品。",
  "The couple held their wedding ceremony in a small seaside chapel.": "這對夫婦在一個小海邊小教堂舉辦了婚禮。",
  "The historic cemetery contains graves dating back over three hundred years.": "歷史悠久的墓地有超過三百年前的墳墓。",
  "The botanical garden features plants from every continent in the world.": "植物園展示了世界各大陸的植物。",
  "We drove along the scenic coastal road enjoying the ocean views.": "我們沿著風景優美的沿海公路行駛，享受海景。",
  "The observation deck offers a panoramic view of the surrounding mountains.": "觀景台提供周圍山脈的全景。",
  "The picturesque village is a popular location for photographers and painters.": "風景如畫的村莊是攝影師和畫家的熱門地點。",
  "The view from the mountain summit was absolutely breathtaking.": "山頂的景色令人嘆為觀止。",
  "Hiking through the national park is my favorite weekend activity.": "通過國家公園登山是我最喜歡的週末活動。",
  "Trekking in the Himalayas requires good physical fitness and preparation.": "在喜馬拉雅山登山需要良好的身體素質和準備。",
  "We went camping by the lake and roasted marshmallows over the fire.": "我們在湖邊露營並在火上烤棉花糖。",
  "The beach is famous for surfing because the waves are perfect all year.": "這個海灘因為全年波浪完美而聞名衝浪。",
  "We got our scuba diving certification before our trip to the reef.": "在前往珊瑚礁旅行之前，我們獲得了水肺潛水認證。",
  "She tried bungee jumping from the bridge and screamed the whole way down.": "她試圖從橋上高空彈跳，一路尖叫。",
  "The nature reserve is home to an amazing variety of wildlife.": "自然保護區是多種野生動物的家園。",
  "Bring your binoculars so you can watch the birds from a distance.": "帶上你的雙筒望遠鏡以便你可以遠距離觀看鳥類。",
  "The viewpoint at the top of the hill has benches and a telescope.": "山頂的觀景點有長椅和望遠鏡。",
  "We stopped at the scenic overlook to take photos of the valley.": "我們在風景優美的觀景台停下來拍攝山谷的照片。",
  "The trailhead has a sign with a map showing the different hiking routes.": "步道入口有一個標誌，上面有顯示不同登山路線的地圖。",
  "The waterfall drops fifty meters into a pool of clear blue water.": "瀑布落下五十米進入清藍色水池。",
  "The active volcano last erupted over one hundred years ago.": "活火山上次噴發已超過一百年前。",
  "The glacier has been slowly retreating due to rising global temperatures.": "由於全球溫度上升，冰川一直在緩慢退縮。",
  "The Grand Canyon is one of the most visited natural wonders worldwide.": "大峽谷是世界上最受歡迎的自然奇蹟之一。",
  "The coral reef is home to hundreds of species of tropical fish.": "珊瑚礁是數百種熱帶魚的家園。",
  "We explored the underground cavern with a guide and flashlights.": "我們用導遊和手電筒探索了地下洞穴。",
  "The archipelago consists of over seven thousand islands in the Pacific.": "群島由太平洋上的七千多個島嶼組成。",
  "The peninsula is surrounded by water on three sides and has many beaches.": "半島被水環繞三側並有許多沙灘。",
  "The turquoise lagoon is perfect for swimming and snorkeling.": "綠松石潟湖適合游泳和浮潛。",
  "The desert oasis was a welcome sight for the exhausted travelers.": "沙漠綠洲對筋疲力盡的旅客是受歡迎的景象。",
  "We had a picnic in the meadow surrounded by wildflowers and butterflies.": "我們在被野花和蝴蝶包圍的草地上野餐。",
  "The expedition to the South Pole lasted three months in harsh conditions.": "南極探險在惡劣條件下持續三個月。",
  "The wetlands serve as an important habitat for migratory birds.": "濕地是候鳥的重要棲息地。",
  "The wildlife sanctuary protects endangered animals from poachers and hunters.": "野生動物保護區保護瀕危動物免受偷獵者和獵人。",
  "She found a lovely dress at a small boutique on the side street.": "她在邊街的一個小精品店找到了一件可愛的連衣裙。",
  "The outlet store sells last season's clothing at discounted prices.": "暢貨店以折扣價出售上一季的衣服。",
  "The new mall has over two hundred shops and a large food court.": "新購物中心有兩百多家商店和一個大食品廣場。",
  "The cashier scanned all the items and told us the total.": "收銀員掃描了所有物品並告訴我們總額。",
  "She filled her shopping cart with groceries for the whole week.": "她用一週的雜貨填滿了購物車。",
  "We paid with a credit card instead of cash for our purchases.": "我們用信用卡而不是現金支付我們的購買費用。",
  "I always check the receipt to make sure there are no mistakes in the bill.": "我總是檢查收據以確保帳單中沒有錯誤。",
  "The store has a loyalty program that gives discounts to frequent shoppers.": "這家商店有一個忠誠度計劃，為經常購物的顧客提供折扣。",
  "Please bring your membership card to get the special discount on sale items.": "請帶上你的會員卡以獲得促銷商品的特別折扣。",
  "We compared prices between stores before deciding where to buy our furniture.": "在決定在哪裡購買家具之前，我們比較了商店之間的價格。",
  "The exchange policy allows customers to return items within thirty days.": "退貨政策允許客戶在三十天內退貨。",
  "I took the garment to the fitting room to try it on before purchasing.": "我把衣服拿到試衣間試穿，然後再購買。",
  "The store clerk helped me find the right size and style for my needs.": "商店店員幫我找到了適合我需要的尺寸和風格。",
  "We got a great deal on the winter coat because it was on sale.": "我們以優惠的價格購買了冬季大衣，因為它在促銷中。",
  "The online store offers free shipping on orders over one hundred dollars.": "在線商店提供超過一百美元訂單的免費送貨。",
  "I prefer shopping at stores with good customer service and friendly staff.": "我喜歡在具有良好客戶服務和友善工作人員的商店購物。",
  "The boutique specializes in high-quality artisan products made locally.": "這家精品店專門銷售當地製造的高質量工匠產品。",
  "We need to buy office supplies for the new department we are opening.": "我們需要為我們開設的新部門購買辦公用品。",
  "The pharmacy sells medications, vitamins, and various health products.": "藥房銷售藥物、維生素和各種健康產品。",
  "The grocery store is running a promotion on fresh produce this week.": "這家雜貨店本週正在進行新鮮農產品促銷。",
  "I made a list of items I need to purchase before going to the store.": "在去商店之前，我列出了我需要購買的項目清單。",
  "The store manager offered to help us find a gift for our friend's birthday.": "商店經理主動幫助我們為朋友的生日找禮物。",
  "Electronics stores often have special promotions during holiday shopping seasons.": "在假期購物季節，電子產品店通常有特別促銷。",
  "The jewelry store displayed beautiful items in the window to attract customers.": "珠寶店在窗戶上展示了漂亮的物品以吸引顧客。",
  "We shopped at the farmers market for fresh vegetables and local honey.": "我們在農民市場購物尋找新鮮蔬菜和當地蜂蜜。",
  "The clothing store has a large selection of dresses for special occasions.": "這家服裝店有大量特殊場合穿著的連衣裙選擇。",
  "I enjoy browsing through bookstores to find interesting novels and reference materials.": "我喜歡瀏覽書店尋找有趣的小說和參考資料。",
  "The toy store has games and puzzles suitable for children of all ages.": "玩具店有適合各個年齡兒童的遊戲和拼圖。",
  "We visited the home decor store to buy items for renovating our house.": "我們訪問了家居裝飾店購買翻修房屋的物品。",
  "The shoe store had a sale where all items were marked down by fifty percent.": "鞋店進行了促銷，所有商品都打五折。",
  "I prefer to shop early in the morning when the store is less crowded.": "我喜歡在早上商店人較少的時候購物。",
  "The beauty counter offers free makeup consultations for customers.": "美容櫃台為顧客提供免費化妝咨詢。",
  "We purchased a gift set from the luxury brand store for our anniversary.": "我們從奢侈品牌店為我們的周年紀念日購買了禮品套裝。",
  "The convenience store is open twenty-four hours for emergency shopping needs.": "便利店全天候開放以滿足緊急購物需求。",
  "Department stores offer a wide variety of products under one roof.": "百貨公司在一個屋頂下提供多種產品。",
  "I always check the expiration dates on food items before adding to my cart.": "在將食品添加到購物車之前，我總是檢查過期日期。",
  "The music store carries instruments and equipment for professional musicians.": "音樂店為專業音樂家提供樂器和設備。",
  "We shopped at the children's store for school uniforms and supplies.": "我們在兒童店購買校服和用品。",
  "The gift shop has unique souvenirs and mementos from around the world.": "禮品店有來自世界各地的獨特紀念品和紀念物。",
  "I use a price comparison app to find the best deals before shopping online.": "我使用價格比較應用程序在在線購物前找到最優惠的交易。",
  "The antique store specializes in rare and vintage items for collectors.": "古董店專門銷售收藏家的稀有和復古物品。",
  "We went to the sports store to buy equipment for our new fitness routine.": "我們去體育用品店購買新健身日常所需的設備。",
  "The craft store has all the supplies needed for various art and hobby projects.": "工藝品店有各種藝術和愛好項目所需的所有用品。",
  "I asked the store owner about the origin and quality of the merchandise.": "我詢問商店老闆有關商品的來源和質量。",
  "The pet store sells food, toys, and accessories for dogs, cats, and other animals.": "寵物店銷售狗、貓和其他動物的食物、玩具和配件。",
  "We discovered a hidden gem of a shop in the old part of town during our walk.": "我們在散步時在城鎮的老部分發現了一家隱藏的寶石般的商店。",
  "The bakery shop sells fresh bread and pastries baked daily in-house.": "麵包店銷售每日在店內烘烤的新鮮麵包和糕點。",
  "I made a special order at the tailor shop for a custom-made suit.": "我在裁縫店預訂了一套定制西服。",
  "The stationery store is well-stocked with pens, paper, and writing supplies.": "文具店備有筆、紙張和書寫用品。",
  "We shopped for wine at the liquor store to pair with our dinner.": "我們在酒店購買葡萄酒來搭配我們的晚餐。",
  "The cosmetics counter offers a wide range of brands and makeup products.": "化妝品櫃台提供多種品牌和化妝產品。",
  "I enjoy the personalized service at specialty shops compared to large chain stores.": "與大型連鎖店相比，我享受專業店的個性化服務。",
  "The fabric store has an extensive selection of materials for sewing projects.": "布料店有大量縫紉項目的材料選擇。",
  "We visited the computer store to upgrade our equipment and software.": "我們訪問了計算機商店以升級我們的設備和軟件。",
  "The flower shop creates beautiful arrangements for weddings and special events.": "花店為婚禮和特殊活動創建美麗的花藝。",
  "I prefer purchasing from small local businesses to support the community.": "我更喜歡從小型本地企業購買以支持社區。",
  "The furniture showroom displays the latest designs and styles for home decoration.": "家具展廳展示了最新的家居裝飾設計和風格。"
};

const filePath = 'D:/workspace-jason/enStuido/server/data/words11.js';

// Read the entire file
const content = fs.readFileSync(filePath, 'utf8');

// Split into lines
const lines = content.split('\n');

// Process each line
const updatedLines = lines.map(line => {
  if (line.includes('example: "') && !line.includes('exampleZh:')) {
    const exampleMatch = line.match(/example: "([^"]+)"/);
    if (exampleMatch) {
      const example = exampleMatch[1];
      const translation = translations[example];

      if (translation) {
        // Replace the closing brace with exampleZh added
        return line.replace(/\s*\}\s*$/, `, exampleZh: "${translation}" }`);
      }
    }
  }
  return line;
});

// Write the updated content back
fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');

console.log('File updated successfully!');
console.log(`Processed ${Object.keys(translations).length} translations`);
