/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LessonId, TopicId } from '../types.ts';

export interface LessonStep {
  title: { uzLatn: string; uzCyrl: string; ru: string };
  content: { uzLatn: string; uzCyrl: string; ru: string };
  visualType: 'balance' | 'equation' | 'numberline' | 'story';
  visualData: {
    left: number;
    right: number;
    unknown?: number;
    symbol?: string;
  };
}

export interface LessonDefinition {
  id: LessonId;
  planetNumber: number;
  number: number;
  topicId: TopicId;
  title: { uzLatn: string; uzCyrl: string; ru: string };
  description: { uzLatn: string; uzCyrl: string; ru: string };
  story: { uzLatn: string; uzCyrl: string; ru: string };
  steps: LessonStep[];
  practiceCount: number;
}

export const LESSONS: LessonDefinition[] = [
  {
    id: 'l1_equality',
    planetNumber: 1,
    number: 1,
    topicId: 'concept_equality',
    title: {
      uzLatn: '1-Dars: Tenglik va Tengsizlik (=, ≠)',
      uzCyrl: '1-Дарс: Тенглик ва Тенгсизлик (=, ≠)',
      ru: 'Урок 1: Равенство и неравенство (=, ≠)',
    },
    description: {
      uzLatn: 'Ikki ifodani solishtirish va tenglik ma’nosini tushunish',
      uzCyrl: 'Икки ифодани солиштириш ва тенглик маъносини тушуниш',
      ru: 'Сравнение выражений и смысл знака равенства',
    },
    story: {
      uzLatn: 'Tengo koinotda sayohat qilar ekan, ikkita qutidagi yulduzlar sonini tenglashtirish kerak bo‘ldi!',
      uzCyrl: 'Тенго коинотда саёҳат қилар экан, иккита қутидаги юлдузлар сонини тенглаштириш керак бўлди!',
      ru: 'Тенго путешествовал по космосу, и ему понадобилось уравнять число звёзд в двух контейнерах!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Tenglik belgisi nima?',
          uzCyrl: 'Тенглик белгиси нима?',
          ru: 'Что такое знак равенства?',
        },
        content: {
          uzLatn: '“=” belgisi chap tomon va o‘ng tomondagi qiymatlar bir xil ekanligini bildiradi. Masalan: 3 + 2 = 5.',
          uzCyrl: '“=” белгиси чап томон ва ўнг томондаги қийматлар бир хил эканлигини билдиради. Масалан: 3 + 2 = 5.',
          ru: 'Знак «=» показывает, что слева и справа одинаковое количество. Например: 3 + 2 = 5.',
        },
        visualType: 'equation',
        visualData: { left: 5, right: 5 },
      },
      {
        title: {
          uzLatn: 'Muvozanatni his qilamiz',
          uzCyrl: 'Мувозанатни ҳис қиламиз',
          ru: 'Чувствуем равновесие',
        },
        content: {
          uzLatn: 'Agar bir tomonda 4 + 1 bo‘lsa, ikkinchi tomonda ham 5 bo‘lishi shart! Shunda tenglik bajariladi.',
          uzCyrl: 'Агар бир томонда 4 + 1 бўлса, иккинчи томонда ҳам 5 бўлиши шарт! Шунда тенглик бажарилади.',
          ru: 'Если с одной стороны 4 + 1, то с другой тоже обязательно 5! Тогда равенство верно.',
        },
        visualType: 'balance',
        visualData: { left: 5, right: 5 },
      },
    ],
    practiceCount: 5,
  },
  {
    id: 'l2_scale',
    planetNumber: 1,
    number: 2,
    topicId: 'concept_scale',
    title: {
      uzLatn: '2-Dars: Sehrli Tarozi',
      uzCyrl: '2-Дарс: Сеҳрли Тарози',
      ru: 'Урок 2: Волшебные весы',
    },
    description: {
      uzLatn: 'Tarozining ikki pallasini muvozanatga keltirish',
      uzCyrl: 'Тарозининг икки палласини мувозанатга келтириш',
      ru: 'Уравновешивание двух чаш весов',
    },
    story: {
      uzLatn: 'Tengoning raketasi muvozanat buzilgani uchun qimirlamayapti. Keling, pallalarni tenglashtiramiz!',
      uzCyrl: 'Тенгонинг ракетаси мувозанат бузилгани учун қимирламаяпти. Келинг, паллаларни тенглаштирамиз!',
      ru: 'Ракета Тенго не может взлететь из-за перевеса. Давай уравновесим чаши весов!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Tarozi qanday ishlaydi?',
          uzCyrl: 'Тарози қандай ишлайди?',
          ru: 'Как работают чашечные весы?',
        },
        content: {
          uzLatn: 'Og‘irroq tomon pastga tushadi, yengil tomon tepaga ko‘tariladi. Ikkala tomon teng bo‘lsa — tarozi tekis turadi!',
          uzCyrl: 'Оғирроқ томон пастга тушади, енгил томон тепага кўтарилади. Иккала томон тенг бўлса — тарози текис туради!',
          ru: 'Тяжёлая чаша опускается вниз, лёгкая поднимается вверх. Когда вес одинаков — весы в равновесии!',
        },
        visualType: 'balance',
        visualData: { left: 6, right: 6 },
      },
    ],
    practiceCount: 5,
  },
  {
    id: 'l3_secret_box',
    planetNumber: 2,
    number: 3,
    topicId: 'concept_unknown',
    title: {
      uzLatn: '3-Dars: Sirli Quti 📦',
      uzCyrl: '3-Дарс: Сирли Қути 📦',
      ru: 'Урок 3: Секретная коробка 📦',
    },
    description: {
      uzLatn: 'Quti ichida yashiringan noma’lum sonni topish',
      uzCyrl: 'Қути ичида яширинган номаълум сонни топиш',
      ru: 'Нахождение спрятанного числа внутри коробки',
    },
    story: {
      uzLatn: 'Tengo sirli quti topib oldi! Uning ichida nechta yulduz borligini birgalikda topamiz.',
      uzCyrl: 'Тенго сирли қути топиб олди! Унинг ичида нечта юлдуз борлигини биргаликда топамиз.',
      ru: 'Тенго нашёл таинственную коробку! Давай выясним, сколько звёзд спрятано внутри.',
    },
    steps: [
      {
        title: {
          uzLatn: 'Quti ichidagi sir',
          uzCyrl: 'Қути ичидаги сир',
          ru: 'Тайна внутри коробки',
        },
        content: {
          uzLatn: 'Agar 📦 + 2 = 6 bo‘lsa, quti ichida nechta yulduz bor? 6 dan 2 ni olsak, 4 qoladi!',
          uzCyrl: 'Агар 📦 + 2 = 6 бўлса, қути ичида нечта юлдуз бор? 6 дан 2 ни олсак, 4 қолади!',
          ru: 'Если 📦 + 2 = 6, сколько звёздочек в коробке? Из 6 убираем 2 — остаётся 4!',
        },
        visualType: 'balance',
        visualData: { left: 6, right: 6, unknown: 4, symbol: '📦' },
      },
    ],
    practiceCount: 5,
  },
  {
    id: 'l4_letter_x',
    planetNumber: 2,
    number: 4,
    topicId: 'concept_x',
    title: {
      uzLatn: '4-Dars: Quti "x" Harfiga Aylanadi',
      uzCyrl: '4-Дарс: Қути "х" Ҳарфига Айланади',
      ru: 'Урок 4: Коробка превращается в букву «x»',
    },
    description: {
      uzLatn: 'Matematikada noma’lum sonni "x" deb belgilash',
      uzCyrl: 'Математикада номаълум сонни "х" деб белгилаш',
      ru: 'Обозначение неизвестного числа буквой «x»',
    },
    story: {
      uzLatn: 'Katta matematiklar quti chizish o‘rniga "x" harfini yozishadi. x — bu xuddi o‘sha sirli quti!',
      uzCyrl: 'Катта математиклар қути чизиш ўрнига "х" ҳарфини ёзишади. х — бу худди ўша сирли қути!',
      ru: 'Математики вместо рисования коробок пишут букву «x». x — это та самая секретная коробка!',
    },
    steps: [
      {
        title: {
          uzLatn: 'x bilan tanishuv',
          uzCyrl: 'х билан танишув',
          ru: 'Знакомство с «x»',
        },
        content: {
          uzLatn: 'Endi biz x + 3 = 7 deb yozamiz. Bu "Qandaydir songa 3 ni qo‘shsak 7 bo‘ladi" degani!',
          uzCyrl: 'Энди биз х + 3 = 7 деб ёзамиз. Бу "Қандайдир сонга 3 ни қўшсак 7 бўлади" дегани!',
          ru: 'Теперь мы пишем x + 3 = 7. Это значит: «К какому числу прибавили 3, чтобы получить 7?»',
        },
        visualType: 'equation',
        visualData: { left: 7, right: 7, unknown: 4, symbol: 'x' },
      },
    ],
    practiceCount: 5,
  },
  {
    id: 'l5_add_x_first',
    planetNumber: 3,
    number: 5,
    topicId: 'add_x_first',
    title: {
      uzLatn: '5-Dars: x + a = b Tenglamalari',
      uzCyrl: '5-Дарс: х + а = b Тенгламалари',
      ru: 'Урок 5: Уравнения вида x + a = b',
    },
    description: {
      uzLatn: 'Qo‘shishning teskari amali — ayirish orqali noma’lum x ni topish',
      uzCyrl: 'Қўшишнинг тескари амали — айириш орқали номаълум х ни топиш',
      ru: 'Нахождение неизвестного слагаемого с помощью вычитания',
    },
    story: {
      uzLatn: 'x ga qo‘shilgan sonni olib tashlash uchun biz teskari amal — ayirishni ishlatamiz!',
      uzCyrl: 'х га қўшилган сонни олиб ташлаш учун биз тескари амал — айиришни ишлатамиз!',
      ru: 'Чтобы убрать прибавленное число, мы используем обратное действие — вычитание!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Teskari amal qoidasi',
          uzCyrl: 'Тескари амал қоидаси',
          ru: 'Правило обратного действия',
        },
        content: {
          uzLatn: 'x + 4 = 9 bo‘lsa, x = 9 - 4 bo‘ladi. x = 5! Qoidani eslab qol: qo‘shuvchi o‘rniga ayirish!',
          uzCyrl: 'х + 4 = 9 бўлса, х = 9 - 4 бўлади. х = 5! Қоидани эслаб қол: қўшувчи ўрнига айириш!',
          ru: 'Если x + 4 = 9, то x = 9 - 4. Значит, x = 5! Чтобы найти слагаемое, нужно из суммы вычесть известное слагаемое.',
        },
        visualType: 'balance',
        visualData: { left: 9, right: 9, unknown: 5, symbol: 'x' },
      },
    ],
    practiceCount: 6,
  },
  {
    id: 'l6_add_x_second',
    planetNumber: 3,
    number: 6,
    topicId: 'add_x_second',
    title: {
      uzLatn: '6-Dars: a + x = b Tenglamalari',
      uzCyrl: '6-Дарс: а + х = b Тенгламалари',
      ru: 'Урок 6: Уравнения вида a + x = b',
    },
    description: {
      uzLatn: 'Qo‘shiluvchilar o‘rni almashganda yig‘indi o‘zgarmaydi',
      uzCyrl: 'Қўшилувчилар ўрни алмашганда йиғинди ўзгармайди',
      ru: 'Переместительное свойство сложения и нахождение второго слагаемого',
    },
    story: {
      uzLatn: 'Agar x ikkinchi o‘rinda tursa-chi? Xavotir olma, qoida xuddi shunday ishlaydi!',
      uzCyrl: 'Агар х иккинчи ўринда турса-чи? Хавотир олма, қоида худди шундай ишлайди!',
      ru: 'А что, если x стоит на втором месте? Не переживай, правило точно такое же!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Ikkinchi qo‘shiluvchini topish',
          uzCyrl: 'Иккинчи қўшилувчини топиш',
          ru: 'Нахождение второго слагаемого',
        },
        content: {
          uzLatn: '3 + x = 8 tenglamasida: x = 8 - 3 = 5 bo‘ladi.',
          uzCyrl: '3 + х = 8 тенгламасида: х = 8 - 3 = 5 бўлади.',
          ru: 'В уравнении 3 + x = 8: x = 8 - 3 = 5.',
        },
        visualType: 'equation',
        visualData: { left: 8, right: 8, unknown: 5, symbol: 'x' },
      },
    ],
    practiceCount: 6,
  },
  {
    id: 'l7_sub_x_first',
    planetNumber: 4,
    number: 7,
    topicId: 'sub_x_first',
    title: {
      uzLatn: '7-Dars: x - a = b (Kamayuvchi)',
      uzCyrl: '7-Дарс: х - а = b (Камаювчи)',
      ru: 'Урок 7: Уравнения вида x - a = b (Уменьшаемое)',
    },
    description: {
      uzLatn: 'Kamayuvchini topish uchun ayirmaga ayriluvchini qo‘shish kerak',
      uzCyrl: 'Камаювчини топиш учун айирмага айрилувчини қўшиш керак',
      ru: 'Чтобы найти уменьшаемое, к разности прибавляем вычитаемое',
    },
    story: {
      uzLatn: 'Bir nechtadan 3 tasi kamaydi va 5 ta qoldi. Dastlab ko‘proq edi! Demak, qo‘shamiz!',
      uzCyrl: 'Бир нечтадан 3 таси камайди ва 5 та қолди. Дастлаб кўпроқ эди! Демак, қўшамиз!',
      ru: 'Было число, отняли 3 и осталось 5. Вначале было больше! Значит, складываем!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Kamayuvchini topamiz',
          uzCyrl: 'Камаювчини топамиз',
          ru: 'Находим уменьшаемое',
        },
        content: {
          uzLatn: 'x - 2 = 6 bo‘lsa, x = 6 + 2 = 8 bo‘ladi. Chunki 8 dan 2 ni ayirsak 6 qoladi!',
          uzCyrl: 'х - 2 = 6 бўлса, х = 6 + 2 = 8 бўлади. Чунки 8 дан 2 ни айирсак 6 қолади!',
          ru: 'Если x - 2 = 6, то x = 6 + 2 = 8. Ведь 8 - 2 действительно равно 6!',
        },
        visualType: 'equation',
        visualData: { left: 6, right: 6, unknown: 8, symbol: 'x' },
      },
    ],
    practiceCount: 6,
  },
  {
    id: 'l8_sub_x_second',
    planetNumber: 4,
    number: 8,
    topicId: 'sub_x_second',
    title: {
      uzLatn: '8-Dars: a - x = b (Ayriluvchi)',
      uzCyrl: '8-Дарс: а - х = b (Айрилувчи)',
      ru: 'Урок 8: Уравнения вида a - x = b (Вычитаемое)',
    },
    description: {
      uzLatn: 'Ayriluvchini topish uchun kamayuvchidan ayirmani ayirish kerak',
      uzCyrl: 'Айрилувчини топиш учун камаювчидан айирмани айириш керак',
      ru: 'Чтобы найти вычитаемое, из уменьшаемого вычитаем разность',
    },
    story: {
      uzLatn: 'Bu sayyoraning eng ayyor jumboqlaridan biri! Lekin biz buni osonlikcha yengamiz.',
      uzCyrl: 'Бу сайёранинг энг айёр жумбоқларидан бири! Лекин биз буни осонликча енгамиз.',
      ru: 'Это одна из самых хитрых задач на планете! Но вместе мы легко с ней справимся.',
    },
    steps: [
      {
        title: {
          uzLatn: 'Ayriluvchi qoidasi',
          uzCyrl: 'Айрилувчи қоидаси',
          ru: 'Правило вычитаемого',
        },
        content: {
          uzLatn: '9 - x = 4 bo‘lsa, x = 9 - 4 = 5 bo‘ladi. Chunki 9 dan 5 ni ayirsak 4 qoladi!',
          uzCyrl: '9 - х = 4 бўлса, х = 9 - 4 = 5 бўлади. Чунки 9 дан 5 ни айирсак 4 қолади!',
          ru: 'Если 9 - x = 4, то x = 9 - 4 = 5. Проверка: 9 - 5 = 4!',
        },
        visualType: 'equation',
        visualData: { left: 4, right: 4, unknown: 5, symbol: 'x' },
      },
    ],
    practiceCount: 6,
  },
  {
    id: 'l9_check',
    planetNumber: 5,
    number: 9,
    topicId: 'check_solution',
    title: {
      uzLatn: '9-Dars: Javobni Tekshirish Odati',
      uzCyrl: '9-Дарс: Жавобни Текшириш Одати',
      ru: 'Урок 9: Привычка проверять решение',
    },
    description: {
      uzLatn: 'Topilgan x qiymatini tenglamaga qo‘yib tekshirish',
      uzCyrl: 'Топилган х қийматини тенгламага қўйиб текшириш',
      ru: 'Подстановка корня уравнения и проверка верности равенства',
    },
    story: {
      uzLatn: 'Haqiqiy kosmik muhandislar har doim o‘z hisob-kitoblarini ikki marta tekshiradilar!',
      uzCyrl: 'Ҳақиқий космик муҳандислар ҳар доим ўз ҳисоб-китобларини икки марта текширадилар!',
      ru: 'Настоящие космические инженеры всегда проверяют свои расчёты перед запуском!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Tekshirish qanday bajariladi?',
          uzCyrl: 'Текшириш қандай бажарилади?',
          ru: 'Как правильно делать проверку?',
        },
        content: {
          uzLatn: 'x + 3 = 7 da x = 4 deb topding. Endi x o‘rniga 4 ni qo‘y: 4 + 3 = 7. Tenglik bajarildi! ✓',
          uzCyrl: 'х + 3 = 7 да х = 4 деб топдинг. Энди х ўрнига 4 ни қўй: 4 + 3 = 7. Тенглик бажарилди! ✓',
          ru: 'В x + 3 = 7 ты нашёл x = 4. Подставь 4 вместо x: 4 + 3 = 7. Равенство верно! ✓',
        },
        visualType: 'equation',
        visualData: { left: 7, right: 7, unknown: 4, symbol: 'x' },
      },
    ],
    practiceCount: 5,
  },
  {
    id: 'l10_word_to_eq',
    planetNumber: 5,
    number: 10,
    topicId: 'word_problems',
    title: {
      uzLatn: '10-Dars: So‘zli Masaladan Tenglamaga',
      uzCyrl: '10-Дарс: Сўзли Масаладан Тенгламага',
      ru: 'Урок 10: От текстовой задачи к уравнению',
    },
    description: {
      uzLatn: 'Hayotiy voqea va hikoyalarni tenglama ko‘rinishida ifodalash',
      uzCyrl: 'Ҳаётий воқеа ва ҳикояларни тенглама кўринишида ифодалаш',
      ru: 'Составление уравнений по жизненным сюжетам',
    },
    story: {
      uzLatn: 'Har bir so‘zli masala — bu yechilishi kerak bo‘lgan qiziqarli detektiv voqea!',
      uzCyrl: 'Ҳар бир сўзли масала — бу ечилиши керак бўлган қизиқарли детектив воқеа!',
      ru: 'Каждая задача — это маленькая детективная история, которую мы раскроем!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Hikoyani tenglamaga aylantiramiz',
          uzCyrl: 'Ҳикояни тенгламага айлантирамиз',
          ru: 'Превращаем историю в уравнение',
        },
        content: {
          uzLatn: '“Savatda bir nechta olma bor edi, yana 3 ta solishdi va 8 ta bo‘ldi.” → x + 3 = 8!',
          uzCyrl: '“Саватда бир нечта олма бор эди, яна 3 та солишди ва 8 та бўлди.” → х + 3 = 8!',
          ru: '«В корзине были яблоки, добавили ещё 3 и стало 8» → x + 3 = 8!',
        },
        visualType: 'story',
        visualData: { left: 8, right: 8, unknown: 5, symbol: 'x' },
      },
    ],
    practiceCount: 5,
  },
  {
    id: 'l11_eq_to_story',
    planetNumber: 5,
    number: 11,
    topicId: 'equation_to_story',
    title: {
      uzLatn: '11-Dars: Tenglamaga Mos Rasm Tanlash',
      uzCyrl: '11-Дарс: Тенгламага Мос Расм Танлаш',
      ru: 'Урок 11: Подбор картинки к уравнению',
    },
    description: {
      uzLatn: 'Tenglama va uning vizual ma’nosi o‘rtasidagi bog‘liqlik',
      uzCyrl: 'Тенглама ва унинг визуал маъноси ўртасидаги боғлиқлик',
      ru: 'Связь между уравнением и его графической моделью',
    },
    story: {
      uzLatn: 'Tengo rasmli albom tayyorladi. Qaysi rasm qaysi tenglamani ifodalaydi?',
      uzCyrl: 'Тенго расмли альбом тайёрлади. Қайси расм қайси тенгламани ифодалайди?',
      ru: 'Тенго подготовил фотоальбом. Какая картинка соответствует какому уравнению?',
    },
    steps: [
      {
        title: {
          uzLatn: 'Rasm va tenglama',
          uzCyrl: 'Расм ва тенглама',
          ru: 'Картинка и уравнение',
        },
        content: {
          uzLatn: 'Tarozi chapida 📦 va 4 ta shar, o‘ngida 10 ta shar bo‘lsa, bu: x + 4 = 10!',
          uzCyrl: 'Тарози чапида 📦 ва 4 та шар, ўнгида 10 та шар бўлса, бу: х + 4 = 10!',
          ru: 'На левой чаше 📦 и 4 шарика, на правой 10: это x + 4 = 10!',
        },
        visualType: 'balance',
        visualData: { left: 10, right: 10, unknown: 6, symbol: 'x' },
      },
    ],
    practiceCount: 5,
  },
  {
    id: 'l12_super_mixed',
    planetNumber: 6,
    number: 12,
    topicId: 'mixed_super',
    title: {
      uzLatn: '12-Dars: Super Tengo (Aralash Mashqlar)',
      uzCyrl: '12-Дарс: Супер Тенго (Аралаш Машқлар)',
      ru: 'Урок 12: Супер-Тенго (Смешанные задания)',
    },
    description: {
      uzLatn: 'Barcha o‘rganilgan tenglama turlarini aralash holda yechish',
      uzCyrl: 'Барча ўрганилган тенглама турларини аралаш ҳолда ечиш',
      ru: 'Решение всех видов изученных уравнений вперемешку',
    },
    story: {
      uzLatn: 'Sen deyarli barcha sayyoralarni zabt etding! Endi haqiqiy Tenglama Ustasisan!',
      uzCyrl: 'Сен деярли барча сайёраларни забт этдинг! Энди ҳақиқий Тенглама Устасисан!',
      ru: 'Ты покорил почти все планеты! Теперь ты настоящий Мастер Уравнений!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Aralash sinov',
          uzCyrl: 'Аралаш синов',
          ru: 'Финальное испытание',
        },
        content: {
          uzLatn: 'Qo‘shish va ayirish aralash keladi. Diqqat bilan amal belgisiga qara!',
          uzCyrl: 'Қўшиш ва айириш аралаш келади. Диққат билан амал белгисига қара!',
          ru: 'Сложение и вычитание чередуются. Всегда внимательно смотри на знак!',
        },
        visualType: 'equation',
        visualData: { left: 15, right: 15, unknown: 8, symbol: 'x' },
      },
    ],
    practiceCount: 8,
  },
  {
    id: 'l13_chain_bonus',
    planetNumber: 6,
    number: 13,
    topicId: 'chain_equations',
    title: {
      uzLatn: '13-Dars: Ketma-ket Amalli Tenglamalar',
      uzCyrl: '13-Дарс: Кетма-кет Амалли Тенгламалар',
      ru: 'Урок 13: Уравнения с последовательными действиями',
    },
    description: {
      uzLatn: 'x + a + c = b tenglamalarini bosqichma-bosqich soddalashtirib yechish',
      uzCyrl: 'х + а + с = b тенгламаларини босқичма-босқич соддалаштириб ечиш',
      ru: 'Пошаговое упрощение и решение уравнений вида x + a + c = b',
    },
    story: {
      uzLatn: 'Bonus daraja! Ikki sonni avval birlashtirib olamiz, keyin x ni topamiz!',
      uzCyrl: 'Бонус даража! Икки сонни аввал бирлаштириб оламиз, кейин х ни топамиз!',
      ru: 'Бонусный уровень! Сначала складываем известные числа, а затем находим x!',
    },
    steps: [
      {
        title: {
          uzLatn: 'Avval qo‘sh, keyin ayir',
          uzCyrl: 'Аввал қўш, кейин айир',
          ru: 'Сначала сложи, затем вычти',
        },
        content: {
          uzLatn: 'x + 2 + 3 = 10 tenglamasida avval 2 + 3 = 5 qilamiz. x + 5 = 10 → x = 5!',
          uzCyrl: 'х + 2 + 3 = 10 тенгламасида аввал 2 + 3 = 5 қиламиз. х + 5 = 10 → х = 5!',
          ru: 'В x + 2 + 3 = 10 сначала вычисляем 2 + 3 = 5. Получаем x + 5 = 10, откуда x = 5!',
        },
        visualType: 'equation',
        visualData: { left: 10, right: 10, unknown: 5, symbol: 'x' },
      },
    ],
    practiceCount: 6,
  },
];
