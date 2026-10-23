/* Сөйле — «Составить предложение / Сөйлем құрау».
   Ребёнок выбирает начало фразы и картинку, приложение собирает грамматически
   правильное предложение отдельно для казахского и для русского (свой порядок
   слов и окончания) и озвучивает его. Работает без интернета. */
(function () {
  "use strict";
  var LEX = {"cards": {"water": ["food", "Су", "Вода", "icons/pecs/water.jpeg"], "bread": ["food", "Нан", "Хлеб", "icons/pecs/bread.jpeg"], "apple": ["food", "Алма", "Яблоко", "icons/pecs/apple.jpeg"], "milk": ["food", "Сүт", "Молоко", "icons/pecs/milk.jpeg"], "eat": ["action", "Же", "Ешь", "icons/pecs/eat.jpeg"], "drink": ["action", "Іш", "Пей", "icons/pecs/drink.jpeg"], "play": ["action", "Ойна", "Играй", "icons/pecs/play.jpeg"], "sleep": ["action", "Ұйықта", "Спи", "icons/pecs/sleep.jpeg"], "me": ["people", "Мен", "Я", ""], "mom": ["people", "Мама", "Мама", "icons/pecs/mom.jpeg"], "dad": ["people", "Папа", "Папа", "icons/pecs/dad.jpeg"], "friend": ["people", "Дос", "Друг", "icons/pecs/friend.jpeg"], "happy": ["emotion", "Қуаныш", "Радость", "icons/pecs/happy.jpeg"], "angry": ["emotion", "Ашулы", "Злость", "icons/pecs/angry.jpeg"], "tired": ["emotion", "Шаршау", "Устал", "icons/pecs/tired.jpeg"], "scared": ["emotion", "Қорқу", "Страх", "icons/pecs/scared.jpeg"], "house": ["place", "Үй", "Дом", "icons/pecs/house.jpeg"], "school": ["place", "Мектеп", "Школа", ""], "playground": ["place", "Ойын алаңы", "Площадка", ""], "shop": ["place", "Дүкен", "Магазин", ""], "bathroom": ["place", "Дәретхана", "Туалет", "icons/pecs/bathroom.jpeg"], "street": ["place", "Көше", "Улица", ""], "car": ["place", "Көлік", "Машина", "icons/pecs/car.jpeg"], "yes": ["core", "Иә", "Да", "icons/pecs/yes.jpeg"], "no": ["core", "Жоқ", "Нет", "icons/pecs/no.jpeg"], "want": ["core", "Керек", "Хочу", "icons/pecs/want.jpeg"], "more": ["core", "Тағы", "Ещё", "icons/pecs/more.jpeg"], "stop": ["core", "Тоқта", "Стоп", "icons/pecs/stop.jpeg"], "help": ["core", "Көмек", "Помощь", "icons/pecs/help.jpeg"], "please": ["core", "Өтінемін", "Пожалуйста", "icons/pecs/please.jpeg"], "thanks": ["core", "Рахмет", "Спасибо", "icons/pecs/thanks.jpeg"], "banana": ["food", "Банан", "Банан", "icons/pecs/banana.jpeg"], "candy": ["food", "Кәмпит", "Конфета", "icons/pecs/candy.jpeg"], "soup": ["food", "Сорпа", "Суп", "icons/pecs/soup.jpeg"], "tea": ["food", "Шай", "Чай", ""], "go": ["action", "Жүр", "Иди", ""], "give": ["action", "Бер", "Дай", "icons/pecs/give.jpeg"], "open": ["action", "Аш", "Открой", "icons/pecs/open.jpeg"], "look": ["action", "Қара", "Смотри", "icons/pecs/look.jpeg"], "washhands": ["action", "Қолыңды жу", "Помой руки", ""], "sister": ["people", "Қарындас", "Сестра", "icons/pecs/sister.jpeg"], "brother": ["people", "Аға", "Брат", "icons/pecs/brother.jpeg"], "grandma": ["people", "Апа", "Бабушка", "icons/pecs/grandma.jpeg"], "grandpa": ["people", "Ата", "Дедушка", "icons/pecs/grandpa.jpeg"], "teacher": ["people", "Мұғалім", "Воспитатель", ""], "hurt": ["emotion", "Ауырады", "Больно", "icons/pecs/hurt.jpeg"], "like": ["emotion", "Ұнайды", "Нравится", "icons/pecs/like.jpeg"], "sad": ["emotion", "Мұңды", "Грустно", "icons/pecs/sad.jpeg"], "children": ["people", "Балалар", "Дети", "icons/pecs/children.jpeg"], "girl": ["people", "Қыз", "Девочка", "icons/pecs/girl.jpeg"], "doctor": ["people", "Дәрігер", "Врач", "icons/pecs/doctor.jpeg"], "boy": ["people", "Ұл бала", "Мальчик", "icons/pecs/boy.jpeg"], "child": ["people", "Бала", "Ребенок", "icons/pecs/child.jpeg"], "baby": ["people", "Сәби", "Малыш", "icons/pecs/baby.jpeg"], "close": ["action", "Жап", "Закрой", "icons/pecs/close.jpeg"], "walk": ["action", "Серуенде", "Гуляй", "icons/pecs/walk.jpeg"], "waitfor": ["action", "Күте тұр", "Жди", "icons/pecs/waitfor.jpeg"], "show": ["action", "Көрсет", "Покажи", "icons/pecs/show.jpeg"], "take": ["action", "Ал", "Возьми", "icons/pecs/take.jpeg"], "listen": ["action", "Тыңда", "Слушай", "icons/pecs/listen.jpeg"], "giveback": ["action", "Қайтар", "Отдай", "icons/pecs/giveback.jpeg"], "goaway": ["action", "Кет", "Уйди", "icons/pecs/goaway.jpeg"], "stand": ["action", "Тұр", "Стой", "icons/pecs/stand.jpeg"], "comehere": ["action", "Осында кел", "Иди сюда", "icons/pecs/comehere.jpeg"], "sit": ["action", "Отыр", "Сиди", "icons/pecs/sit.jpeg"], "bathe": ["action", "Жуын", "Купайся", "icons/pecs/bathe.jpeg"], "rest": ["action", "Демал", "Отдыхай", "icons/pecs/rest.jpeg"], "pour": ["action", "Құй", "Налей", "icons/pecs/pour.jpeg"], "kiss": ["action", "Сүй", "Поцелуй", "icons/pecs/kiss.jpeg"], "tickle": ["action", "Қытықта", "Пощекочи", "icons/pecs/tickle.jpeg"], "putclothes": ["action", "Ки", "Надень", "icons/pecs/putclothes.jpeg"], "takeoffclothes": ["action", "Шеш", "Сними", "icons/pecs/takeoffclothes.jpeg"], "dislike": ["emotion", "Ұнамайды", "Мне не нравится", "icons/pecs/dislike.jpeg"], "wanttocry": ["emotion", "Жылағым келеді", "Хочу плакать", "icons/pecs/wanttocry.jpeg"], "wanthug": ["emotion", "Құшақтағым келеді", "Хочу обнять", "icons/pecs/wanthug.jpeg"], "worry": ["emotion", "Уайым", "Беспокойство", "icons/pecs/worry.jpeg"], "embarrassed": ["emotion", "Ұялу", "Смущение", "icons/pecs/embarrassed.jpeg"], "bored": ["emotion", "Зерігу", "Скука", "icons/pecs/bored.jpeg"], "offended": ["emotion", "Өкпе", "Обида", "icons/pecs/offended.jpeg"], "surprised": ["emotion", "Таңғалу", "Удивление", "icons/pecs/surprised.jpeg"], "calm": ["emotion", "Тыныштық", "Спокойствие", "icons/pecs/calm.jpeg"], "guilty": ["emotion", "Кінәлі", "Вина", "icons/pecs/guilty.jpeg"], "proud": ["emotion", "Мақтаныш", "Гордость", "icons/pecs/proud.jpeg"], "pity": ["emotion", "Аяу", "Жалость", "icons/pecs/pity.jpeg"], "envy": ["emotion", "Қызғаныш", "Зависть", "icons/pecs/envy.jpeg"], "funmood": ["emotion", "Көңілді", "Веселье", "icons/pecs/funmood.jpeg"], "longing": ["emotion", "Сағыныш", "Тоска", "icons/pecs/longing.jpeg"], "love": ["emotion", "Махаббат", "Любовь", "icons/pecs/love.jpeg"], "hope": ["emotion", "Үміт", "Надежда", "icons/pecs/hope.jpeg"], "loud": ["state", "Қатты дауыс", "Громко", "icons/pecs/loud.jpeg"], "myself": ["core", "Мен өзім", "Я сам", "icons/pecs/myself.jpeg"], "notallowed": ["core", "Болмайды", "Нельзя", "icons/pecs/notallowed.jpeg"], "dontwant": ["core", "Қаламаймын", "Не хочу", "icons/pecs/dontwant.jpeg"], "hi": ["core", "Сәлем", "Привет", "icons/pecs/hi.jpeg"], "may": ["core", "Болады", "Можно", "icons/pecs/may.jpeg"], "bye": ["core", "Сау бол", "Пока", "icons/pecs/bye.jpeg"], "yourturn": ["core", "Кезегің", "Твоя очередь", "icons/pecs/yourturn.jpeg"], "myname": ["core", "Атың", "Имя", "icons/pecs/myname.jpeg"], "juice": ["food", "Шырын", "Сок", "icons/pecs/juice.jpeg"], "yogurt": ["food", "Йогурт", "Йогурт", "icons/pecs/yogurt.jpeg"], "orangejuice": ["food", "Апельсин шырыны", "Апельсиновый сок", "icons/pecs/orangejuice.jpeg"], "soda": ["food", "Газдалған су", "Газировка", "icons/pecs/soda.jpeg"], "applejuice": ["food", "Алма шырыны", "Яблочный сок", "icons/pecs/applejuice.jpeg"], "cookie": ["food", "Печенье", "Печенье", "icons/pecs/cookie.jpeg"], "porridge": ["food", "Ботқа", "Каша", "icons/pecs/porridge.jpeg"], "chocolate": ["food", "Шоколад", "Шоколад", "icons/pecs/chocolate.jpeg"], "pizza": ["food", "Пицца", "Пицца", "icons/pecs/pizza.jpeg"], "egg": ["food", "Жұмыртқа", "Яйцо", "icons/pecs/egg.jpeg"], "toycar": ["toys", "Көлікше", "Машинка", "icons/pecs/toycar.jpeg"], "ball": ["toys", "Доп", "Мяч", "icons/pecs/ball.jpeg"], "doll": ["toys", "Қуыршақ", "Кукла", "icons/pecs/doll.jpeg"], "blocks": ["toys", "Текшелер", "Кубики", "icons/pecs/blocks.jpeg"], "tabletdevice": ["toys", "Планшет", "Планшет", "icons/pecs/tabletdevice.jpeg"], "teddybear": ["toys", "Аюшық", "Мишка", "icons/pecs/teddybear.jpeg"], "toyshovel": ["toys", "Күрекше", "Лопатка", "icons/pecs/toyshovel.jpeg"], "music": ["toys", "Музыка", "Музыка", "icons/pecs/music.jpeg"], "hot": ["state", "Ыстық", "Жарко", "icons/pecs/hot.jpeg"], "cold": ["state", "Суық", "Холодно", "icons/pecs/cold.jpeg"], "dirty": ["state", "Лас", "Грязно", "icons/pecs/dirty.jpeg"], "wet": ["state", "Дымқыл", "Мокро", "icons/pecs/wet.jpeg"], "clean": ["state", "Таза", "Чисто", "icons/pecs/clean.jpeg"], "ready": ["state", "Дайын", "Готово", "icons/pecs/ready.jpeg"], "num0": ["number", "Нөл", "0", "icons/pecs/num0.jpeg"], "num1": ["number", "Бір", "1", "icons/pecs/num1.jpeg"], "num2": ["number", "Екі", "2", "icons/pecs/num2.jpeg"], "num3": ["number", "Үш", "3", "icons/pecs/num3.jpeg"], "num4": ["number", "Төрт", "4", "icons/pecs/num4.jpeg"], "num5": ["number", "Бес", "5", "icons/pecs/num5.jpeg"], "num6": ["number", "Алты", "6", "icons/pecs/num6.jpeg"], "num7": ["number", "Жеті", "7", "icons/pecs/num7.jpeg"], "num8": ["number", "Сегіз", "8", "icons/pecs/num8.jpeg"], "num9": ["number", "Тоғыз", "9", "icons/pecs/num9.jpeg"], "cat": ["animal", "Мысық", "Кошка", "icons/pecs/cat.jpeg"], "dog": ["animal", "Ит", "Собака", "icons/pecs/dog.jpeg"], "rooster": ["animal", "Әтеш", "Петух", "icons/pecs/rooster.jpeg"], "sheep": ["animal", "Қой", "Овца", "icons/pecs/sheep.jpeg"], "horse": ["animal", "Жылқы", "Лошадь", "icons/pecs/horse.jpeg"], "pig": ["animal", "Шошқа", "Свинья", "icons/pecs/pig.jpeg"], "duck": ["animal", "Үйрек", "Утка", "icons/pecs/duck.jpeg"], "tiger": ["animal", "Жолбарыс", "Тигр", "icons/pecs/tiger.jpeg"], "lion": ["animal", "Арыстан", "Лев", "icons/pecs/lion.jpeg"], "bear": ["animal", "Аю", "Медведь", "icons/pecs/bear.jpeg"], "fox": ["animal", "Түлкі", "Лиса", "icons/pecs/fox.jpeg"], "whale": ["animal", "Кит", "Кит", "icons/pecs/whale.jpeg"], "shark": ["animal", "Акула", "Акула", "icons/pecs/shark.jpeg"], "octopus": ["animal", "Сегізаяқ", "Осьминог", "icons/pecs/octopus.jpeg"], "wolf": ["animal", "Қасқыр", "Волк", "icons/pecs/wolf.jpeg"], "deer": ["animal", "Бұғы", "Олень", "icons/pecs/deer.jpeg"], "cheetah": ["animal", "Гепард", "Гепард", "icons/pecs/cheetah.jpeg"], "starfish": ["animal", "Теңіз жұлдызы", "Морская звезда", "icons/pecs/starfish.jpeg"], "elephant": ["animal", "Піл", "Слон", "icons/pecs/elephant.jpeg"], "dolphin": ["animal", "Дельфин", "Дельфин", "icons/pecs/dolphin.jpeg"], "crab": ["animal", "Шаян", "Краб", "icons/pecs/crab.jpeg"], "seaturtle": ["animal", "Теңіз тасбақасы", "Морская черепаха", "icons/pecs/seaturtle.jpeg"], "bus": ["transport", "Автобус", "Автобус", "icons/pecs/bus.jpeg"], "bike": ["transport", "Велосипед", "Велосипед", "icons/pecs/bike.jpeg"], "plane": ["transport", "Ұшақ", "Самолет", "icons/pecs/plane.jpeg"], "train": ["transport", "Пойыз", "Поезд", "icons/pecs/train.jpeg"], "firetruck": ["transport", "Өрт сөндіруші машина", "Пожарная машина", "icons/pecs/firetruck.jpeg"], "policecar": ["transport", "Полиция машинасы", "Полицейская машина", "icons/pecs/policecar.jpeg"], "ambulance": ["transport", "Жедел жәрдем", "Скорая помощь", "icons/pecs/ambulance.jpeg"], "emergencytruck": ["transport", "Апаттық машина", "Аварийная машина", "icons/pecs/emergencytruck.jpeg"], "yacht": ["transport", "Яхта", "Яхта", "icons/pecs/yacht.jpeg"], "sailboat": ["transport", "Желкенді қайық", "Парусник", "icons/pecs/sailboat.jpeg"], "barge": ["transport", "Баржа", "Баржа", "icons/pecs/barge.jpeg"], "taxi": ["transport", "Такси", "Такси", "icons/pecs/taxi.jpeg"], "truck": ["transport", "Жүк көлігі", "Грузовик", "icons/pecs/truck.jpeg"], "wheel": ["transport", "Дөңгелек", "Колесо", "icons/pecs/wheel.jpeg"], "boots": ["clothes", "Бәтіңке", "Ботинки", "icons/pecs/boots.jpeg"], "pants": ["clothes", "Шалбар", "Брюки", "icons/pecs/pants.jpeg"], "jacket": ["clothes", "Күртеше", "Куртка", "icons/pecs/jacket.jpeg"], "socks": ["clothes", "Шұлық", "Носки", "icons/pecs/socks.jpeg"], "dress": ["clothes", "Көйлек", "Платье", "icons/pecs/dress.jpeg"], "shoes": ["clothes", "Туфли", "Туфли", "icons/pecs/shoes.jpeg"], "tshirt": ["clothes", "Футболка", "Футболка", "icons/pecs/tshirt.jpeg"], "hat": ["clothes", "Бөрік", "Шапка", "icons/pecs/hat.jpeg"], "backpack": ["clothes", "Рюкзак", "Рюкзак", "icons/pecs/backpack.jpeg"], "facemask": ["clothes", "Маска", "Маска", "icons/pecs/facemask.jpeg"], "hood": ["clothes", "Капюшон", "Капюшон", "icons/pecs/hood.jpeg"], "jeans": ["clothes", "Джинсы", "Джинсы", "icons/pecs/jeans.jpeg"], "cap": ["clothes", "Кепка", "Кепка", "icons/pecs/cap.jpeg"], "cardigan": ["clothes", "Кофта", "Кофта", "icons/pecs/cardigan.jpeg"], "sneakers": ["clothes", "Кроссовка", "Кроссовки", "icons/pecs/sneakers.jpeg"], "tanktop": ["clothes", "Майка", "Майка", "icons/pecs/tanktop.jpeg"], "clothesdirty": ["clothes", "Лас киім", "Одежда грязная", "icons/pecs/clothesdirty.jpeg"], "clotheswet": ["clothes", "Дымқыл киім", "Одежда мокрая", "icons/pecs/clotheswet.jpeg"], "clothesdry": ["clothes", "Құрғақ киім", "Одежда сухая", "icons/pecs/clothesdry.jpeg"], "clothesclean": ["clothes", "Таза киім", "Одежда чистая", "icons/pecs/clothesclean.jpeg"], "gloves": ["clothes", "Қолғап", "Перчатки", "icons/pecs/gloves.jpeg"], "underwear": ["clothes", "Ішкиім", "Трусы", "icons/pecs/underwear.jpeg"], "hoodie": ["clothes", "Толстовка", "Толстовка", "icons/pecs/hoodie.jpeg"], "tracksuit": ["clothes", "Спорт костюмі", "Спортивный костюм", "icons/pecs/tracksuit.jpeg"], "shirt": ["clothes", "Жейде", "Рубашка", "icons/pecs/shirt.jpeg"], "headache": ["health", "Бас ауырады", "Боль в голове", "icons/pecs/headache.jpeg"], "sorethroat": ["health", "Тамағы ауырады", "Боль в горле", "icons/pecs/sorethroat.jpeg"], "stomachache": ["health", "Іші ауырады", "Боль в животе", "icons/pecs/stomachache.jpeg"], "cough": ["health", "Жөтел", "Кашель", "icons/pecs/cough.jpeg"], "earache": ["health", "Құлағы ауырады", "Боль в ухе", "icons/pecs/earache.jpeg"], "runnynose": ["health", "Тұмау", "Насморк", "icons/pecs/runnynose.jpeg"], "injection": ["health", "Ине", "Укол", "icons/pecs/injection.jpeg"], "fever": ["health", "Температура", "Температура", "icons/pecs/fever.jpeg"], "diarrhea": ["health", "Іш өту", "Понос", "icons/pecs/diarrhea.jpeg"], "dentist": ["health", "Тіс дәрігері", "Стоматолог", "icons/pecs/dentist.jpeg"], "vomit": ["health", "Құсу", "Рвота", "icons/pecs/vomit.jpeg"], "room": ["place", "Бөлме", "Комната", "icons/pecs/room.jpeg"], "soap": ["home", "Сабын", "Мыло", "icons/pecs/soap.jpeg"], "towel": ["home", "Сүлгі", "Полотенце", "icons/pecs/towel.jpeg"], "door": ["home", "Есік", "Дверь", "icons/pecs/door.jpeg"], "bed": ["home", "Төсек", "Кровать", "icons/pecs/bed.jpeg"], "table": ["home", "Үстел", "Стол", "icons/pecs/table.jpeg"], "pillow": ["home", "Жастық", "Подушка", "icons/pecs/pillow.jpeg"], "window": ["home", "Терезе", "Окно", "icons/pecs/window.jpeg"], "blanket": ["home", "Көрпе", "Одеяло", "icons/pecs/blanket.jpeg"], "spoon": ["home", "Қасық", "Ложка", "icons/pecs/spoon.jpeg"], "chair": ["home", "Орындық", "Стул", "icons/pecs/chair.jpeg"], "plate": ["home", "Тәрелке", "Тарелка", "icons/pecs/plate.jpeg"], "cup": ["home", "Кесе", "Чашка", "icons/pecs/cup.jpeg"], "bottle": ["home", "Бөтелке", "Бутылка", "icons/pecs/bottle.jpeg"], "bucket": ["home", "Шелек", "Ведерко", "icons/pecs/bucket.jpeg"], "mirror": ["home", "Айна", "Зеркало", "icons/pecs/mirror.jpeg"], "sofa": ["home", "Диван", "Диван", "icons/pecs/sofa.jpeg"], "fork": ["home", "Шанышқы", "Вилка", "icons/pecs/fork.jpeg"], "key": ["home", "Кілт", "Ключ", "icons/pecs/key.jpeg"], "box": ["home", "Қорап", "Коробка", "icons/pecs/box.jpeg"], "knife": ["home", "Пышақ", "Нож", "icons/pecs/knife.jpeg"], "bag": ["home", "Пакет", "Пакет", "icons/pecs/bag.jpeg"], "floor": ["home", "Еден", "Пол", "icons/pecs/floor.jpeg"], "socket": ["home", "Розетка", "Розетка", "icons/pecs/socket.jpeg"], "wall": ["home", "Қабырға", "Стена", "icons/pecs/wall.jpeg"], "cupboard": ["home", "Шкаф", "Шкаф", "icons/pecs/cupboard.jpeg"], "handbag": ["home", "Сөмке", "Сумка", "icons/pecs/handbag.jpeg"], "tv": ["home", "Теледидар", "Телевизор", "icons/pecs/tv.jpeg"], "clock": ["home", "Сағат", "Часы", "icons/pecs/clock.jpeg"], "toothbrush": ["home", "Тіс щеткасы", "Зубная щетка", "icons/pecs/toothbrush.jpeg"], "bell": ["home", "Қоңырау", "Звонок", "icons/pecs/bell.jpeg"], "computer": ["home", "Компьютер", "Компьютер", "icons/pecs/computer.jpeg"], "wardrobe": ["home", "Гардероб", "Гардероб", "icons/pecs/wardrobe.jpeg"], "star": ["shape", "Жұлдыз", "Звезда", "icons/pecs/star.jpeg"], "heart": ["shape", "Жүрек", "Сердце", "icons/pecs/heart.jpeg"], "square": ["shape", "Шаршы", "Квадрат", "icons/pecs/square.jpeg"], "circle": ["shape", "Шеңбер", "Круг", "icons/pecs/circle.jpeg"], "triangle": ["shape", "Үшбұрыш", "Треугольник", "icons/pecs/triangle.jpeg"], "cube": ["shape", "Куб", "Куб", "icons/pecs/cube.jpeg"], "rectangle": ["shape", "Тіктөртбұрыш", "Прямоугольник", "icons/pecs/rectangle.jpeg"], "colorwhite": ["color", "Ақ түс", "Белый", "icons/pecs/colorwhite.jpeg"], "colorblack": ["color", "Қара түс", "Черный", "icons/pecs/colorblack.jpeg"], "colorbrown": ["color", "Қоңыр түс", "Коричневый", "icons/pecs/colorbrown.jpeg"], "colorpurple": ["color", "Күлгін түс", "Фиолетовый", "icons/pecs/colorpurple.jpeg"], "colororange": ["color", "Қызғылт сары түс", "Оранжевый", "icons/pecs/colororange.jpeg"], "coloryellow": ["color", "Сары түс", "Желтый", "icons/pecs/coloryellow.jpeg"], "colorgreen": ["color", "Жасыл түс", "Зеленый", "icons/pecs/colorgreen.jpeg"], "colorpink": ["color", "Қызғылт түс", "Розовый", "icons/pecs/colorpink.jpeg"], "colorlightblue": ["color", "Көгілдір түс", "Голубой", "icons/pecs/colorlightblue.jpeg"], "colorred": ["color", "Қызыл түс", "Красный", "icons/pecs/colorred.jpeg"], "colorblue": ["color", "Көк түс", "Синий", "icons/pecs/colorblue.jpeg"], "colorbeige": ["color", "Бежевый түс", "Бежевый", "icons/pecs/colorbeige.jpeg"], "colorturquoise": ["color", "Бирюза түс", "Бирюзовый", "icons/pecs/colorturquoise.jpeg"], "colorsilver": ["color", "Күміс түс", "Серебряный", "icons/pecs/colorsilver.jpeg"], "colorgold": ["color", "Алтын түс", "Золотой", "icons/pecs/colorgold.jpeg"], "colorgray": ["color", "Сұр түс", "Серый", "icons/pecs/colorgray.jpeg"]}, "verbs": {"eat": ["Жеймін", "Жегім", "есть", "ем"], "drink": ["Ішемін", "Ішкім", "пить", "пью"], "play": ["Ойнаймын", "Ойнағым", "играть", "играю"], "sleep": ["Ұйықтаймын", "Ұйықтағым", "спать", "сплю"], "go": ["Барамын", "Барғым", "пойти", "иду"], "give": ["Беремін", "Бергім", "дать", "даю"], "open": ["Ашамын", "Ашқым", "открыть", "открываю"], "look": ["Қараймын", "Қарағым", "смотреть", "смотрю"], "washhands": ["Қолымды жуамын", "Қолымды жуғым", "помыть руки", "мою руки"], "close": ["Жабамын", "Жапқым", "закрыть", "закрываю"], "walk": ["Серуендеймін", "Серуендегім", "гулять", "гуляю"], "waitfor": ["Күтемін", "Күткім", "подождать", "жду"], "show": ["Көрсетемін", "Көрсеткім", "показать", "показываю"], "take": ["Аламын", "Алғым", "взять", "беру"], "listen": ["Тыңдаймын", "Тыңдағым", "слушать", "слушаю"], "giveback": ["Қайтарамын", "Қайтарғым", "отдать", "отдаю"], "goaway": ["Кетемін", "Кеткім", "уйти", "ухожу"], "stand": ["Тұрамын", "Тұрғым", "стоять", "стою"], "comehere": ["Келемін", "Келгім", "прийти", "иду"], "sit": ["Отырамын", "Отырғым", "сидеть", "сижу"], "bathe": ["Жуынамын", "Жуынғым", "купаться", "купаюсь"], "rest": ["Демаламын", "Демалғым", "отдыхать", "отдыхаю"], "pour": ["Құямын", "Құйғым", "налить", "наливаю"], "kiss": ["Сүйемін", "Сүйгім", "поцеловать", "целую"], "tickle": ["Қытықтаймын", "Қытықтағым", "пощекотать", "щекочу"], "putclothes": ["Киемін", "Кигім", "надеть", "надеваю"], "takeoffclothes": ["Шешемін", "Шешкім", "снять", "снимаю"]}, "places": {"house": ["Үйге", "домой"], "school": ["Мектепке", "в школу"], "playground": ["Ойын алаңына", "на площадку"], "shop": ["Дүкенге", "в магазин"], "bathroom": ["Дәретханаға", "в туалет"], "street": ["Көшеге", "на улицу"], "car": ["Көлікке", "в машину"], "room": ["Бөлмеге", "в комнату"]}, "ruAcc": {"water": "воду", "candy": "конфету", "porridge": "кашу", "pizza": "пиццу", "soda": "газировку", "me": "меня", "mom": "маму", "dad": "папу", "friend": "друга", "sister": "сестру", "brother": "брата", "grandma": "бабушку", "grandpa": "дедушку", "teacher": "воспитателя", "children": "детей", "girl": "девочку", "doctor": "врача", "boy": "мальчика", "child": "ребёнка", "baby": "малыша", "toycar": "машинку", "doll": "куклу", "teddybear": "мишку", "toyshovel": "лопатку", "music": "музыку", "spoon": "ложку", "cup": "чашку", "plate": "тарелку", "bottle": "бутылку", "fork": "вилку", "box": "коробку", "handbag": "сумку", "socket": "розетку", "wall": "стену", "toothbrush": "зубную щётку", "pillow": "подушку", "jacket": "куртку", "hat": "шапку", "facemask": "маску", "cap": "кепку", "cardigan": "кофту", "tanktop": "майку", "tshirt": "футболку", "hoodie": "толстовку", "shirt": "рубашку", "firetruck": "пожарную машину", "policecar": "полицейскую машину", "ambulance": "скорую помощь", "emergencytruck": "аварийную машину", "yacht": "яхту", "barge": "баржу", "cat": "кошку", "dog": "собаку", "rooster": "петуха", "sheep": "овцу", "pig": "свинью", "duck": "утку", "tiger": "тигра", "lion": "льва", "bear": "медведя", "fox": "лису", "whale": "кита", "shark": "акулу", "octopus": "осьминога", "wolf": "волка", "deer": "оленя", "cheetah": "гепарда", "starfish": "морскую звезду", "elephant": "слона", "dolphin": "дельфина", "crab": "краба", "seaturtle": "морскую черепаху", "star": "звезду"}, "ruPlural": ["blocks", "boots", "children", "clock", "gloves", "jeans", "pants", "shoes", "sneakers", "socks", "underwear"]};
  var C = LEX.cards, V = LEX.verbs, P = LEX.places, ACC = LEX.ruAcc, PL = {};
  LEX.ruPlural.forEach(function (id) { PL[id] = 1; });

  // ---------- шаблоны ----------
  var OBJ_CATS = ["food", "toys", "home", "clothes", "transport", "animal"];
  var VERB_OBJ = { eat: ["bread", "apple", "banana", "candy", "soup", "yogurt", "cookie", "porridge", "chocolate", "pizza", "egg"],
    drink: ["water", "milk", "tea", "juice", "orangejuice", "soda", "applejuice"],
    putclothes: ["boots", "pants", "jacket", "socks", "dress", "shoes", "tshirt", "hat", "cap", "cardigan", "sneakers", "gloves", "hoodie", "shirt", "jeans"],
    takeoffclothes: ["boots", "pants", "jacket", "socks", "dress", "shoes", "tshirt", "hat", "cap", "cardigan", "sneakers", "gloves", "hoodie", "shirt", "jeans"] };
  var T = [
    { id: "want", kk: "Қалаймын", ru: "Хочу", card: "want", pick: ["obj", "place", "verb"] },
    { id: "dontwant", kk: "Қаламаймын", ru: "Не хочу", card: "dontwant", pick: ["obj", "place", "verb"] },
    { id: "give", kk: "Беріңізші", ru: "Дай", card: "give", pick: ["obj"] },
    { id: "go", kk: "Барайық", ru: "Пойдём", card: "go", pick: ["place"] },
    { id: "ido", kk: "Мен…", ru: "Я…", card: "me", pick: ["verb"] },
    { id: "like", kk: "Ұнайды", ru: "Нравится", card: "like", pick: ["obj"] },
    { id: "dislike", kk: "Ұнамайды", ru: "Не нравится", card: "dislike", pick: ["obj"] },
  ];
  var CAT_NAMES = { food: ["Тағам", "Еда"], toys: ["Ойыншықтар", "Игрушки"], home: ["Үй заттары", "Вещи"], clothes: ["Киім", "Одежда"],
    transport: ["Көлік", "Транспорт"], animal: ["Жануарлар", "Животные"], place: ["Орындар", "Места"], verb: ["Әрекет", "Действия"] };

  function lc(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function kkN(id) { return lc(C[id][1]); }
  function ruN(id) { return lc(C[id][2]); }
  function ruAcc(id) { return ACC[id] || ruN(id); }
  function W(text, key, card) { return { t: text, k: key, c: card || null }; }  // слово фразы: текст, ключ записи, картинка

  // Собирает фразу для обоих языков: { kk:[слова], ru:[слова] }
  function build(tpl, x, obj) {
    var kk = [], ru = [], v, p;
    if (x.type === "place") p = P[x.id];
    if (x.type === "verb") v = V[x.id];
    switch (tpl) {
      case "want":
      case "dontwant":
        var neg = tpl === "dontwant";
        if (x.type === "obj") {
          kk = [W("Маған", "kk/fn_magan"), W(kkN(x.id), "kk/" + x.id, x.id), W("керек", "kk/want")];
          if (neg) kk.push(W("емес", "kk/fn_emes"));
          ru = neg ? [W("Я", "ru/me"), W("не", "ru/fn_ne"), W("хочу", "ru/want")] : [W("Я хочу", "ru/fn_ya_hochu")];
          ru.push(W(ruAcc(x.id), ACC[x.id] ? "ru/" + x.id + "__acc" : "ru/" + x.id, x.id));
        } else if (x.type === "place") {
          kk = [W(p[0], "kk/" + x.id + "__dat", x.id), W(lc(V.go[1]), "kk/go__want"), W(neg ? "келмейді" : "келеді", neg ? "kk/fn_kelmeidi" : "kk/fn_keledi")];
          ru = (neg ? [W("Я", "ru/me"), W("не", "ru/fn_ne"), W("хочу", "ru/want")] : [W("Я хочу", "ru/fn_ya_hochu")]).concat([W(p[1], "ru/" + x.id + "__to", x.id)]);
        } else {
          kk = (obj ? [W(kkN(obj), "kk/" + obj, obj)] : []).concat([W(obj ? lc(v[1]) : v[1], "kk/" + x.id + "__want", x.id), W(neg ? "келмейді" : "келеді", neg ? "kk/fn_kelmeidi" : "kk/fn_keledi")]);
          ru = (neg ? [W("Я", "ru/me"), W("не", "ru/fn_ne"), W("хочу", "ru/want")] : [W("Я хочу", "ru/fn_ya_hochu")]).concat([W(v[2], "ru/" + x.id + "__inf", x.id)]);
          if (obj) ru.push(W(ruAcc(obj), ACC[obj] ? "ru/" + obj + "__acc" : "ru/" + obj, obj));
        }
        break;
      case "give":
        kk = [W("Маған", "kk/fn_magan"), W(kkN(x.id), "kk/" + x.id, x.id), W("беріңізші", "kk/fn_berinizshi")];
        ru = [W("Дай", "ru/give"), W("мне", "ru/fn_mne"), W(ruAcc(x.id) + ",", ACC[x.id] ? "ru/" + x.id + "__acc" : "ru/" + x.id, x.id), W("пожалуйста", "ru/please")];
        break;
      case "go":
        kk = [W(p[0], "kk/" + x.id + "__dat", x.id), W("барайық", "kk/fn_baraiyk")];
        ru = [W("Пойдём", "ru/fn_poidem"), W(p[1], "ru/" + x.id + "__to", x.id)];
        break;
      case "ido":
        kk = [W("Мен", "kk/me")].concat(obj ? [W(kkN(obj), "kk/" + obj, obj)] : []).concat([W(lc(v[0]), "kk/" + x.id + "__1sg", x.id)]);
        ru = [W("Я", "ru/me"), W(v[3], "ru/" + x.id + "__1sg", x.id)];
        if (obj) ru.push(W(ruAcc(obj), ACC[obj] ? "ru/" + obj + "__acc" : "ru/" + obj, obj));
        break;
      case "like":
      case "dislike":
        var no = tpl === "dislike", pl = !!PL[x.id];
        kk = [W("Маған", "kk/fn_magan"), W(kkN(x.id), "kk/" + x.id, x.id), W(no ? "ұнамайды" : "ұнайды", no ? "kk/dislike" : "kk/like")];
        ru = [W("Мне", "ru/fn_mne")].concat(no ? [W("не", "ru/fn_ne")] : []).concat([W(pl ? "нравятся" : "нравится", pl ? "ru/fn_nravyatsya" : "ru/like"), W(ruN(x.id), "ru/" + x.id, x.id)]);
        break;
    }
    function fin(arr) { if (arr.length) arr[0] = W(cap(arr[0].t), arr[0].k, arr[0].c); return arr; }
    return { kk: fin(kk), ru: fin(ru) };
  }
  function text(words, lang) { var s = words.map(function (w) { return w.t; }).join(" "); return s + (lang === "kk" ? "." : "."); }

  // ---------- озвучка ----------
  function recFor(key) {
    var forms = window.SOILE_FORMS || {};
    if (forms[key]) return forms[key];
    var m = /^(kk|ru)\/([a-z0-9]+)$/.exec(key);   // базовое слово — есть старая запись карточки
    if (m) { var bank = m[1] === "kk" ? window.SOILE_VOICE_KK : window.SOILE_VOICE_RU; if (bank && bank[m[2]]) return bank[m[2]]; }
    return null;
  }
  function pickVoice(lang) {
    if (!("speechSynthesis" in window)) return null;
    var vs = window.speechSynthesis.getVoices() || [];
    return vs.filter(function (v) { return (v.lang || "").toLowerCase().indexOf(lang) === 0; })[0] || null;
  }
  var playing = null;
  function stop() { try { if (playing) playing.pause(); } catch (e) { /* */ } playing = null; try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* */ } }
  function say(words, lang, onWord) {
    stop();
    var srcs = words.map(function (w) { return recFor(w.k); });
    var allRec = srcs.every(Boolean);
    var formsLoaded = !!window.SOILE_FORMS;
    var voice = pickVoice(lang);
    if (!allRec && voice) {   // нет полной записи — синтез речи целой фразой (правильная интонация)
      try {
        var u = new SpeechSynthesisUtterance(text(words, lang)); u.voice = voice; u.lang = voice.lang; u.rate = 0.9;
        window.speechSynthesis.speak(u); if (onWord) onWord(-1);
        return;
      } catch (e) { /* fall through */ }
    }
    var i = 0;
    (function next() {
      if (i >= words.length) { if (onWord) onWord(-1); return; }
      var k = i++, src = srcs[k];
      if (onWord) onWord(k);
      if (!src) { setTimeout(next, formsLoaded ? 120 : 350); return; }
      try { var a = new Audio(src); playing = a; a.onended = next; a.onerror = next; a.play().catch(next); } catch (e) { next(); }
    })();
  }

  // ---------- интерфейс ----------
  var css = "#sb-open{display:flex;align-items:center;gap:12px;width:calc(100% - 24px);margin:10px 12px 4px;padding:14px 16px;border:0;border-radius:18px;cursor:pointer;" +
    "background:linear-gradient(135deg,#7C5CFF,#4F8BFF);color:#fff;font:800 17px var(--font-ui,system-ui);text-align:left;box-shadow:0 8px 20px -10px #4F6BFF}" +
    "#sb-open .ic{width:44px;height:44px;border-radius:13px;background:rgba(255,255,255,.2);display:grid;place-items:center;font-size:24px;flex:none}" +
    "#sb-open small{display:block;font-weight:700;font-size:12.5px;opacity:.85;margin-top:2px}" +
    "#sb{position:fixed;inset:0;z-index:60;background:var(--bg,#FFF7F3);overflow:auto;display:flex;flex-direction:column}" +
    "#sb[hidden]{display:none}" +
    ".sb-top{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--surface,#fff);border-bottom:1px solid var(--line,#eee)}" +
    ".sb-top h2{flex:1;margin:0;font:900 18px var(--font-ui,system-ui);color:var(--ink,#222)}" +
    ".sb-x{width:42px;height:42px;border-radius:12px;border:0;background:var(--surface-2,#f3f3f3);font-size:20px;cursor:pointer;color:var(--ink,#222)}" +
    ".sb-lang{display:flex;background:var(--surface-2,#f3f3f3);border-radius:12px;padding:3px}.sb-lang button{border:0;background:transparent;border-radius:9px;padding:8px 11px;font:900 13px var(--font-ui,system-ui);color:var(--ink-dim,#777);cursor:pointer}.sb-lang button.on{background:var(--surface,#fff);color:var(--ink,#222)}" +
    ".sb-body{padding:14px;max-width:900px;width:100%;margin:0 auto;box-sizing:border-box;flex:1}" +
    ".sb-step{font:900 13px var(--font-ui,system-ui);text-transform:uppercase;letter-spacing:.06em;color:var(--ink-dim,#777);margin:6px 2px 10px}" +
    ".sb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:10px;grid-auto-rows:max-content}" +
    ".sb-t{border:2px solid transparent;border-radius:18px;background:var(--surface,#fff);padding:0;cursor:pointer;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 2px 6px -3px rgba(0,0,0,.15);color:var(--ink,#222);font-family:var(--font-ui,system-ui)}" +
    ".sb-t img,.sb-t .ph{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:var(--surface-2,#f3f3f3)}.sb-t .ph{display:grid;place-items:center;font-size:34px}" +
    ".sb-t b{font-weight:900;font-size:15px;padding:7px 6px 1px}.sb-t span{font-size:11.5px;color:var(--ink-dim,#888);padding:0 6px 8px;font-weight:700}" +
    ".sb-t.big{flex-direction:row;align-items:center;gap:10px;padding:8px;text-align:left}.sb-t.big img,.sb-t.big .ph{width:58px;height:58px;border-radius:12px;flex:none}.sb-t.big b{padding:0;font-size:17px}.sb-t.big span{padding:0}" +
    ".sb-tpl{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}" +
    ".sb-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:10px;margin-bottom:4px}.sb-tabs button{flex:none;border:0;border-radius:999px;padding:9px 14px;background:var(--surface-2,#f3f3f3);font:800 14px var(--font-ui,system-ui);color:var(--ink,#222);cursor:pointer}.sb-tabs button.on{background:var(--ink,#222);color:var(--surface,#fff)}" +
    ".sb-strip{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;padding:10px;border-radius:16px;background:var(--surface,#fff);border:1px dashed var(--line,#ddd);min-height:48px}" +
    ".sb-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:12px;background:var(--surface-2,#f3f3f3);font:800 15px var(--font-ui,system-ui);color:var(--ink,#222)}.sb-chip img{width:28px;height:28px;border-radius:8px;object-fit:cover}" +
    ".sb-res{background:var(--surface,#fff);border-radius:22px;padding:18px;box-shadow:0 6px 20px -12px rgba(0,0,0,.3);text-align:center}" +
    ".sb-pics{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}.sb-pics img,.sb-pics .ph{width:92px;height:92px;border-radius:16px;object-fit:cover;background:var(--surface-2,#f3f3f3);display:grid;place-items:center;font-size:34px}" +
    ".sb-main{font:900 28px/1.3 var(--font-ui,system-ui);color:var(--ink,#222)}.sb-main .w{border-radius:8px;padding:0 3px;transition:background .15s}.sb-main .w.on{background:#FFE58A}" +
    ".sb-alt{font:700 15px var(--font-ui,system-ui);color:var(--ink-dim,#777);margin-top:8px}" +
    ".sb-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px}" +
    ".sb-btn{border:0;border-radius:16px;padding:14px 18px;font:900 16px var(--font-ui,system-ui);cursor:pointer;background:var(--surface-2,#f3f3f3);color:var(--ink,#222)}.sb-btn.play{background:var(--accent,#EF4C82);color:var(--accent-ink,#fff);font-size:18px;padding:16px 26px}" +
    ".sb-skip{margin-top:12px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var S = { lang: "kk", step: "tpl", tpl: null, x: null, obj: null, tab: null, open: false };
  function appLang() { var b = document.getElementById("lang-ru"); return b && b.getAttribute("aria-pressed") === "true" ? "ru" : "kk"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function L(kk, ru) { return S.lang === "kk" ? kk : ru; }
  function pic(id, cls) { var c = C[id]; return c && c[3] ? '<img class="' + (cls || "") + '" src="' + esc(c[3]) + '" alt="" loading="lazy">' : '<span class="ph ' + (cls || "") + '">💬</span>'; }
  function tile(id, act, val, sub) {
    var c = C[id]; if (!c) return "";
    return '<button type="button" class="sb-t" data-sb="' + act + '" data-v="' + esc(val || id) + '">' + pic(id) + "<b>" + esc(L(c[1], c[2])) + "</b><span>" + esc(sub != null ? sub : L(c[2], c[1])) + "</span></button>";
  }
  function speakWord(id) { var c = C[id]; if (!c) return; var src = recFor((S.lang) + "/" + id); if (src) { stop(); try { playing = new Audio(src); playing.play().catch(function () {}); } catch (e) { /* */ } } }

  function choicesFor(kind) {
    if (kind === "place") return Object.keys(P);
    if (kind === "verb") return Object.keys(V);
    return Object.keys(C).filter(function (id) { return C[id][0] === kind; });
  }
  function tabsFor(tpl) {
    var t = T.filter(function (x) { return x.id === tpl; })[0], tabs = [];
    t.pick.forEach(function (k) { if (k === "obj") tabs = tabs.concat(OBJ_CATS); else tabs.push(k); });
    return tabs;
  }

  function render() {
    var root = document.getElementById("sb"); if (!root) return;
    var body = "";
    var tpl = T.filter(function (x) { return x.id === S.tpl; })[0];
    if (S.step === "tpl") {
      body = '<div class="sb-step">' + L("1. Немен бастаймыз?", "1. С чего начнём?") + '</div><div class="sb-grid sb-tpl">' +
        T.map(function (t) { return '<button type="button" class="sb-t big" data-sb="tpl" data-v="' + t.id + '">' + pic(t.card) + "<div><b>" + esc(L(t.kk, t.ru)) + "</b><br><span>" + esc(L(t.ru, t.kk)) + "</span></div></button>"; }).join("") + "</div>";
    } else {
      var strip = '<div class="sb-strip"><span class="sb-chip">' + pic(tpl.card) + esc(L(tpl.kk, tpl.ru)) + "</span>" +
        (S.x ? '<span class="sb-chip">' + pic(S.x.id) + esc(L(C[S.x.id][1], C[S.x.id][2])) + "</span>" : "") +
        (S.obj ? '<span class="sb-chip">' + pic(S.obj) + esc(L(C[S.obj][1], C[S.obj][2])) + "</span>" : "") + "</div>";
      if (S.step === "pick") {
        var tabs = tabsFor(S.tpl); if (tabs.indexOf(S.tab) < 0) S.tab = tabs[0];
        body = strip + '<div class="sb-step">' + L("2. Таңдаңыз", "2. Выберите") + "</div>" +
          (tabs.length > 1 ? '<div class="sb-tabs">' + tabs.map(function (k) { return '<button type="button" data-sb="tab" data-v="' + k + '" class="' + (S.tab === k ? "on" : "") + '">' + esc(L(CAT_NAMES[k][0], CAT_NAMES[k][1])) + "</button>"; }).join("") + "</div>" : "") +
          '<div class="sb-grid">' + choicesFor(S.tab).map(function (id) {
            var kind = S.tab === "place" ? "place" : S.tab === "verb" ? "verb" : "obj";
            return tile(id, "x", kind + ":" + id);
          }).join("") + "</div>";
      } else if (S.step === "obj") {
        body = strip + '<div class="sb-step">' + L("3. Нені? (міндетті емес)", "3. Что именно? (можно пропустить)") + '</div><div class="sb-grid">' +
          VERB_OBJ[S.x.id].map(function (id) { return tile(id, "obj", id); }).join("") + '</div><div class="sb-actions sb-skip"><button type="button" class="sb-btn" data-sb="skip">' + L("Өткізу →", "Пропустить →") + "</button></div>";
      } else {
        var ph = build(S.tpl, S.x, S.obj), main = ph[S.lang], alt = ph[S.lang === "kk" ? "ru" : "kk"];
        var ids = []; [S.x && S.x.id, S.obj].forEach(function (id) { if (id && ids.indexOf(id) < 0) ids.push(id); });
        body = '<div class="sb-res"><div class="sb-pics">' + pic(tpl.card) + ids.map(function (id) { return pic(id); }).join("") + "</div>" +
          '<div class="sb-main">' + main.map(function (w, i) { return '<span class="w" data-i="' + i + '">' + esc(w.t) + (i === main.length - 1 ? "." : "") + "</span>"; }).join(" ") + "</div>" +
          '<div class="sb-alt">' + esc(text(alt, S.lang === "kk" ? "ru" : "kk")) + "</div>" +
          '<div class="sb-actions"><button type="button" class="sb-btn play" data-sb="play">▶ ' + L("Айту", "Сказать") + '</button></div>' +
          '<div class="sb-actions"><button type="button" class="sb-btn" data-sb="back">← ' + L("Басқасын таңдау", "Выбрать другое") + '</button><button type="button" class="sb-btn" data-sb="restart">↺ ' + L("Жаңа сөйлем", "Новая фраза") + "</button></div></div>";
      }
    }
    root.querySelector(".sb-body").innerHTML = body;
    root.querySelectorAll(".sb-lang button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-l") === S.lang); });
    root.querySelector(".sb-top h2").textContent = L("Сөйлем құрау", "Составить фразу");
  }
  function playResult() {
    var ph = build(S.tpl, S.x, S.obj), words = ph[S.lang];
    say(words, S.lang, function (i) {
      document.querySelectorAll("#sb .sb-main .w").forEach(function (el) { el.classList.toggle("on", +el.getAttribute("data-i") === i); });
    });
  }
  function openSB() {
    if (S.open) return; S.open = true; S.lang = appLang(); S.step = "tpl"; S.tpl = S.x = S.obj = null;
    document.getElementById("sb").hidden = false; document.body.style.overflow = "hidden"; render();
    try { history.pushState({ soileSB: 1 }, ""); } catch (e) { /* */ }
  }
  function closeSB(fromPop) {
    if (!S.open) return; S.open = false; stop();
    document.getElementById("sb").hidden = true; document.body.style.overflow = "";
    if (fromPop !== true) { try { if (history.state && history.state.soileSB) history.back(); } catch (e) { /* */ } }
  }
  window.addEventListener("popstate", function () { if (S.open) closeSB(true); });

  function mount() {
    var view = document.getElementById("view-child"); if (!view || document.getElementById("sb-open")) return;
    var btn = document.createElement("button");
    btn.type = "button"; btn.id = "sb-open";
    view.insertBefore(btn, view.firstChild);
    function label() { var kk = appLang() === "kk"; btn.innerHTML = '<span class="ic">🧩</span><span>' + (kk ? "Сөйлем құрау" : "Составить фразу") + "<small>" + (kk ? "Дұрыс сөйлем: «Маған су керек»" : "Правильно: «Я хочу пить»") + "</small></span>"; }
    label();
    ["lang-kk", "lang-ru"].forEach(function (id) { var b = document.getElementById(id); if (b) b.addEventListener("click", function () { setTimeout(label, 0); }); });
    var ov = document.createElement("div"); ov.id = "sb"; ov.hidden = true;
    ov.innerHTML = '<div class="sb-top"><button type="button" class="sb-x" data-sb="close" aria-label="Закрыть">✕</button><h2></h2><div class="sb-lang"><button type="button" data-sb="lang" data-l="kk">ҚАЗ</button><button type="button" data-sb="lang" data-l="ru">РУС</button></div></div><div class="sb-body"></div>';
    document.body.appendChild(ov);
    btn.addEventListener("click", openSB);
    ov.addEventListener("click", function (e) {
      var b = e.target.closest("[data-sb]"); if (!b) return;
      var a = b.getAttribute("data-sb"), v = b.getAttribute("data-v");
      if (a === "close") return closeSB();
      if (a === "lang") { S.lang = b.getAttribute("data-l"); render(); if (S.step === "res") playResult(); return; }
      if (a === "tpl") { S.tpl = v; S.x = S.obj = null; S.tab = null; S.step = "pick"; speakWord(T.filter(function (t) { return t.id === v; })[0].card); }
      else if (a === "tab") { S.tab = v; }
      else if (a === "x") { var p = v.split(":"); S.x = { type: p[0], id: p[1] }; S.obj = null;
        S.step = p[0] === "verb" && VERB_OBJ[p[1]] && S.tpl !== "go" ? "obj" : "res"; }
      else if (a === "obj") { S.obj = v; S.step = "res"; }
      else if (a === "skip") { S.step = "res"; }
      else if (a === "play") { return playResult(); }
      else if (a === "back") { S.step = S.obj ? "obj" : "pick"; S.obj = null; }
      else if (a === "restart") { S.step = "tpl"; S.tpl = S.x = S.obj = null; }
      render(); window.scrollTo(0, 0); ov.scrollTop = 0;
      if (S.step === "res") playResult();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
  window.SoilePhrase = { build: build, text: text };
})();
