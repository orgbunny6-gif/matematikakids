/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AchievementItem {
  id: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  maxProgress: number;
  title: { uzLatn: string; uzCyrl: string; ru: string };
  desc: { uzLatn: string; uzCyrl: string; ru: string };
}

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_step',
    icon: '🚀',
    tier: 'bronze',
    maxProgress: 1,
    title: { uzLatn: 'Birinchi Qadam', uzCyrl: 'Биринчи Қадам', ru: 'Первый шаг' },
    desc: {
      uzLatn: 'Birinchi darsni muvaffaqiyatli yakunladingiz!',
      uzCyrl: 'Биринчи дарсни муваффақиятли якунладингиз!',
      ru: 'Успешно завершён первый урок!',
    },
  },
  {
    id: 'scale_master',
    icon: '⚖️',
    tier: 'silver',
    maxProgress: 5,
    title: { uzLatn: 'Tarozi Ustasi', uzCyrl: 'Тарози Устаси', ru: 'Мастер весов' },
    desc: {
      uzLatn: '5 marta tarozini to‘g‘ri muvozanatga keltirdingiz.',
      uzCyrl: '5 марта тарозини тўғри мувозанатга келтирдингиз.',
      ru: 'Уравновешены весы 5 раз без ошибок.',
    },
  },
  {
    id: 'box_opener',
    icon: '📦',
    tier: 'bronze',
    maxProgress: 10,
    title: { uzLatn: 'Quti Ochuvchi', uzCyrl: 'Қути Очувчи', ru: 'Открыватель коробок' },
    desc: {
      uzLatn: '10 ta sirli qutidagi sonni topdingiz.',
      uzCyrl: '10 та сирли қутидаги сонни топдингиз.',
      ru: 'Найдено неизвестное число в 10 коробках.',
    },
  },
  {
    id: 'streak_3',
    icon: '🔥',
    tier: 'bronze',
    maxProgress: 3,
    title: { uzLatn: '3 Kunlik Olov', uzCyrl: '3 Кунлик Олов', ru: 'Огонёк 3 дня' },
    desc: {
      uzLatn: '3 kun ketma-ket platformada mashq qildingiz.',
      uzCyrl: '3 кун кетма-кет платформада машқ қилдингиз.',
      ru: 'Занятия 3 дня подряд.',
    },
  },
  {
    id: 'streak_7',
    icon: '⚡',
    tier: 'silver',
    maxProgress: 7,
    title: { uzLatn: 'Hafta Qahramoni', uzCyrl: 'Ҳафта Қаҳрамони', ru: 'Герой недели' },
    desc: {
      uzLatn: 'To‘liq 7 kunlik mashg‘ulot seriyasi!',
      uzCyrl: 'Тўлиқ 7 кунлик машғулот серияси!',
      ru: 'Серия занятий длиною в целую неделю!',
    },
  },
  {
    id: 'perfect_10',
    icon: '🎯',
    tier: 'gold',
    maxProgress: 10,
    title: { uzLatn: 'Ketma-ket 10 Ta To‘g‘ri', uzCyrl: 'Кетма-кет 10 Та Тўғри', ru: '10 верных подряд' },
    desc: {
      uzLatn: 'Bitta ham xatosiz 10 ta savolga javob berdingiz.',
      uzCyrl: 'Битта ҳам хатосиз 10 та саволга жавоб бердингиз.',
      ru: '10 правильных ответов подряд без единой ошибки.',
    },
  },
  {
    id: 'perfect_test',
    icon: '💯',
    tier: 'gold',
    maxProgress: 1,
    title: { uzLatn: '100% Natija', uzCyrl: '100% Натижа', ru: 'Идеальный тест' },
    desc: {
      uzLatn: 'Testni 100% to‘g‘ri bajardingiz!',
      uzCyrl: 'Тестни 100% тўғри бажардингиз!',
      ru: 'Тест сдан на максимальные 100 баллов!',
    },
  },
  {
    id: 'game_champion',
    icon: '🏆',
    tier: 'silver',
    maxProgress: 3,
    title: { uzLatn: 'O‘yin Chempioni', uzCyrl: 'Ўйин Чемпиони', ru: 'Чемпион игр' },
    desc: {
      uzLatn: '3 xil o‘yinda g‘olib chiqdingiz.',
      uzCyrl: '3 хил ўйинда ғолиб чиқдингиз.',
      ru: 'Победа в 3 разных развивающих играх.',
    },
  },
  {
    id: 'mistake_learner',
    icon: '💡',
    tier: 'bronze',
    maxProgress: 5,
    title: { uzLatn: 'Xatodan O‘rganuvchi', uzCyrl: 'Хатодан Ўрганувчи', ru: 'Учусь на ошибках' },
    desc: {
      uzLatn: '5 ta xato qilingan savolni qayta to‘g‘ri yechdingiz.',
      uzCyrl: '5 та хато қилинган саволни қайта тўғри ечдингиз.',
      ru: 'Исправлено 5 ошибок в тетради ошибок.',
    },
  },
  {
    id: 'homework_star',
    icon: '📝',
    tier: 'bronze',
    maxProgress: 1,
    title: { uzLatn: 'Vazifa Qahramoni', uzCyrl: 'Вазифа Қаҳрамони', ru: 'Герой домашки' },
    desc: {
      uzLatn: 'Birinchi uyga vazifani muvaffaqiyatli topshirdingiz.',
      uzCyrl: 'Биринчи уйга вазифани муваффақиятли топширдингиз.',
      ru: 'Выполнено первое домашнее задание.',
    },
  },
  {
    id: 'checker_habit',
    icon: '🔍',
    tier: 'silver',
    maxProgress: 10,
    title: { uzLatn: 'Kichik Inspektor', uzCyrl: 'Кичик Инспектор', ru: 'Юный ревизор' },
    desc: {
      uzLatn: '10 marta javobni tenglamaga qo‘yib tekshirdingiz.',
      uzCyrl: '10 марта жавобни тенгламага қўйиб текширдингиз.',
      ru: 'Выполнена проверка 10 уравнений.',
    },
  },
  {
    id: 'daily_adventurer',
    icon: '☀️',
    tier: 'bronze',
    maxProgress: 3,
    title: { uzLatn: 'Kunlik Sayyoh', uzCyrl: 'Кунлик Сайёҳ', ru: 'Ежедневный путник' },
    desc: {
      uzLatn: '3 kunlik topshiriqni bajardingiz.',
      uzCyrl: '3 кунлик топшириқни бажардингиз.',
      ru: 'Выполнено 3 ежедневных испытания.',
    },
  },
  {
    id: 'xp_500',
    icon: '⭐',
    tier: 'silver',
    maxProgress: 500,
    title: { uzLatn: '500 XP Jamg‘armasi', uzCyrl: '500 XP Жамғармаси', ru: 'Копилка 500 XP' },
    desc: {
      uzLatn: 'Jami 500 tajriba balli to‘pladingiz.',
      uzCyrl: 'Жами 500 тажриба балли тўпладингиз.',
      ru: 'Заработано 500 баллов опыта.',
    },
  },
  {
    id: 'xp_1000',
    icon: '🌟',
    tier: 'gold',
    maxProgress: 1000,
    title: { uzLatn: '1000 XP Magistri', uzCyrl: '1000 XP Магистри', ru: 'Магистр 1000 XP' },
    desc: {
      uzLatn: '1000 tajriba balli — haqiqiy matematika ustasi!',
      uzCyrl: '1000 тажриба балли — ҳақиқий математика устаси!',
      ru: '1000 баллов опыта — мастер математики!',
    },
  },
  {
    id: 'planet_conqueror',
    icon: '🪐',
    tier: 'gold',
    maxProgress: 3,
    title: { uzLatn: 'Sayyora Fotihi', uzCyrl: 'Сайёра Фотиҳи', ru: 'Покоритель планет' },
    desc: {
      uzLatn: '3 ta sayyoraning barcha darslarini yakunladingiz.',
      uzCyrl: '3 та сайёранинг барча дарсларини якунладингиз.',
      ru: 'Пройдены все уроки на 3 планетах.',
    },
  },
  {
    id: 'speedy_solver',
    icon: '⏱️',
    tier: 'bronze',
    maxProgress: 5,
    title: { uzLatn: 'Chaqqon Tengo', uzCyrl: 'Чаққон Тенго', ru: 'Быстрый ум' },
    desc: {
      uzLatn: '5 ta savolga 5 soniyadan kam vaqtda to‘g‘ri javob berdingiz.',
      uzCyrl: '5 та саволга 5 сониядан кам вақтда тўғри жавоб бердингиз.',
      ru: '5 быстрых правильных ответов подряд.',
    },
  },
  {
    id: 'polyglot',
    icon: '🌐',
    tier: 'bronze',
    maxProgress: 2,
    title: { uzLatn: 'Til Bilimdoni', uzCyrl: 'Тил Билимдони', ru: 'Полиглот' },
    desc: {
      uzLatn: 'Platformada ikkita tildan foydalanib ko‘rdingiz.',
      uzCyrl: 'Платформада иккита тилдан фойдаланиб кўрдингиз.',
      ru: 'Использование двух разных языков.',
    },
  },
  {
    id: 'balloon_popper',
    icon: '🎈',
    tier: 'bronze',
    maxProgress: 20,
    title: { uzLatn: 'Shar Qahramoni', uzCyrl: 'Шар Қаҳрамони', ru: 'Ловец шариков' },
    desc: {
      uzLatn: 'O‘yinda 20 ta to‘g‘ri javobli sharni yordingiz.',
      uzCyrl: 'Ўйинда 20 та тўғри жавобли шарни ёрдингиз.',
      ru: 'Лопнуто 20 шариков с верными ответами.',
    },
  },
  {
    id: 'rocket_pilot',
    icon: '🛸',
    tier: 'silver',
    maxProgress: 3,
    title: { uzLatn: 'Kosmik Kapitan', uzCyrl: 'Космик Капитан', ru: 'Космический капитан' },
    desc: {
      uzLatn: 'Raketa o‘yinida 3 marta orbitaga chiqdingiz.',
      uzCyrl: 'Ракета ўйинида 3 марта орбитага чиқдингиз.',
      ru: '3 успешных запуска ракеты на орбиту.',
    },
  },
  {
    id: 'word_detective',
    icon: '📖',
    tier: 'silver',
    maxProgress: 5,
    title: { uzLatn: 'So‘z Detektivi', uzCyrl: 'Сўз Детективи', ru: 'Сюжетный детектив' },
    desc: {
      uzLatn: '5 ta so‘zli masalani to‘g‘ri tenglamaga aylantirdingiz.',
      uzCyrl: '5 та сўзли масалани тўғри тенгламага айлантирдингиз.',
      ru: '5 текстовых задач превращены в верные уравнения.',
    },
  },
  {
    id: 'sandbox_scientist',
    icon: '🧪',
    tier: 'bronze',
    maxProgress: 1,
    title: { uzLatn: 'Yosh Olim', uzCyrl: 'Ёш Олим', ru: 'Юный учёный' },
    desc: {
      uzLatn: 'Tenglama laboratoriyasida erkin tajriba o‘tkazdingiz.',
      uzCyrl: 'Тенглама лабораториясида эркин тажриба ўтказдингиз.',
      ru: 'Проведён эксперимент в лаборатории уравнений.',
    },
  },
  {
    id: 'night_owl',
    icon: '🦉',
    tier: 'bronze',
    maxProgress: 1,
    title: { uzLatn: 'Qorong‘i Mavzu', uzCyrl: 'Қоронғи Мавзу', ru: 'Ночная тема' },
    desc: {
      uzLatn: 'Ko‘zlarni asrash uchun qorong‘i mavzuni sinab ko‘rdingiz.',
      uzCyrl: 'Кўзларни асраш учун қоронғи мавзуни синаб кўрдингиз.',
      ru: 'Опробована тёмная тема оформления.',
    },
  },
  {
    id: 'voice_helper',
    icon: '🔊',
    tier: 'bronze',
    maxProgress: 3,
    title: { uzLatn: 'Tinglovchi', uzCyrl: 'Тингловчи', ru: 'Слушатель' },
    desc: {
      uzLatn: '3 marta ovozli o‘qish funksiyasidan foydalandingiz.',
      uzCyrl: '3 марта овозли ўқиш функциясидан фойдаландингиз.',
      ru: 'Использована озвучка заданий 3 раза.',
    },
  },
  {
    id: 'chain_champion',
    icon: '⛓️',
    tier: 'gold',
    maxProgress: 5,
    title: { uzLatn: 'Ketma-ketlik Ustasi', uzCyrl: 'Кетма-кетлик Устаси', ru: 'Мастер цепочек' },
    desc: {
      uzLatn: '5 ta ketma-ket amalli tenglamani yechdingiz.',
      uzCyrl: '5 та кетма-кет амалли тенгламани ечдингиз.',
      ru: 'Решено 5 уравнений с последовательными действиями.',
    },
  },
  {
    id: 'super_hero',
    icon: '👑',
    tier: 'gold',
    maxProgress: 1,
    title: { uzLatn: 'Tenglama Qiroli', uzCyrl: 'Тенглама Қироли', ru: 'Король уравнений' },
    desc: {
      uzLatn: 'Super Imtihonni a’lo bahoga topshirdingiz!',
      uzCyrl: 'Супер Имтиҳонни аъло баҳога топширдингиз!',
      ru: 'Супер-экзамен сдан на высший балл!',
    },
  },
];
