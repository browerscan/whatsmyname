import { defaultLocale, isSupportedLocale, type AppLocale } from "@/i18n/request";

function resolveLocale(locale: string): AppLocale {
  return isSupportedLocale(locale) ? locale : defaultLocale;
}

const toolsCopy: Record<
  AppLocale,
  {
    intro: string;
    checker: string;
    generator: string;
    ideas: string;
  }
> = {
  en: {
    intro:
      "Our free username tools help you find, verify, and create the right username for any platform. Whether you are building a personal brand, launching a business, or simply want one consistent handle across your favorite sites, these tools make the process much easier.",
    checker:
      "Our most popular tool checks whether your preferred username is available across 1,400+ platforms in seconds. Enter a username once to see where it is taken, where it is available, and where you can claim it immediately.",
    generator:
      "Coming soon: our username generator will suggest unique ideas based on your name, interests, and keywords. It is ideal when your first choice is already taken on the platforms that matter most.",
    ideas:
      "Coming soon: browse curated username ideas by style, category, and platform. Use these inspiration lists to discover memorable usernames that still fit your identity or brand.",
  },
  zh: {
    intro:
      "我们的免费用户名工具可以帮助你在任何平台上查找、验证并创建合适的用户名。无论你是在打造个人品牌、启动新业务，还是只是想在常用网站上保持统一昵称，这些工具都能让流程更轻松。",
    checker:
      "我们最受欢迎的工具可以在几秒内检查你心仪的用户名是否可在 1400+ 平台使用。输入一次用户名，就能看到哪些平台已被占用、哪些仍可注册，以及可以立即前往认领的位置。",
    generator:
      "即将推出：用户名生成器会根据你的姓名、兴趣和关键词提供有创意的候选方案。当你的首选用户名在重要平台上都已被占用时，它尤其有帮助。",
    ideas:
      "即将推出：按风格、类别和平台浏览精选用户名灵感。你可以通过这些灵感列表找到既好记又符合个人身份或品牌定位的用户名。",
  },
  es: {
    intro:
      "Nuestras herramientas gratuitas de nombres de usuario te ayudan a encontrar, verificar y crear el nombre adecuado para cualquier plataforma. Ya sea que estés construyendo una marca personal, lanzando un negocio o simplemente buscando un identificador coherente en tus sitios favoritos, estas herramientas simplifican todo el proceso.",
    checker:
      "Nuestra herramienta más popular comprueba en segundos si tu nombre de usuario preferido está disponible en más de 1.400 plataformas. Introduce un nombre una sola vez y verás dónde está ocupado, dónde sigue libre y dónde puedes reclamarlo de inmediato.",
    generator:
      "Próximamente: nuestro generador de nombres de usuario te sugerirá ideas únicas basadas en tu nombre, tus intereses y tus palabras clave. Es ideal cuando tu primera opción ya está ocupada en las plataformas más importantes para ti.",
    ideas:
      "Próximamente: explora ideas de nombres de usuario organizadas por estilo, categoría y plataforma. Estas listas te ayudarán a encontrar nombres memorables que encajen con tu identidad o marca.",
  },
  ja: {
    intro:
      "無料のユーザー名ツールを使えば、あらゆるプラットフォーム向けに最適なユーザー名を見つけ、確認し、作成できます。個人ブランドの構築、新しいビジネスの立ち上げ、あるいは複数サイトで同じハンドル名を使いたい場合でも、作業をずっと簡単に進められます。",
    checker:
      "最も人気のあるツールでは、希望するユーザー名が 1,400 以上のプラットフォームで使えるかを数秒で確認できます。1 回入力するだけで、使用済みの場所、利用可能な場所、すぐ取得できる場所が分かります。",
    generator:
      "近日公開：ユーザー名ジェネレーターは、名前・興味・キーワードをもとに個性的な候補を提案します。第一候補が主要プラットフォームですでに使われている場合に特に便利です。",
    ideas:
      "近日公開：スタイル・カテゴリ・プラットフォーム別に整理されたユーザー名アイデアを閲覧できます。自分やブランドに合う、覚えやすい候補を探すのに役立ちます。",
  },
  fr: {
    intro:
      "Nos outils gratuits de nom d’utilisateur vous aident à trouver, vérifier et créer le bon identifiant pour n’importe quelle plateforme. Que vous développiez une marque personnelle, lanciez une activité ou cherchiez simplement un pseudo cohérent sur vos sites préférés, ils rendent tout le processus beaucoup plus simple.",
    checker:
      "Notre outil le plus populaire vérifie en quelques secondes si le nom d’utilisateur souhaité est disponible sur plus de 1 400 plateformes. Saisissez-le une seule fois pour voir où il est pris, où il reste disponible et où vous pouvez le réserver immédiatement.",
    generator:
      "Bientôt disponible : notre générateur de noms d’utilisateur proposera des idées originales à partir de votre nom, de vos centres d’intérêt et de vos mots-clés. C’est particulièrement utile lorsque votre premier choix est déjà pris partout.",
    ideas:
      "Bientôt disponible : parcourez des idées de noms d’utilisateur classées par style, catégorie et plateforme. Ces listes d’inspiration vous aideront à trouver un nom mémorable adapté à votre identité ou à votre marque.",
  },
  ko: {
    intro:
      "무료 사용자 이름 도구를 사용하면 어떤 플랫폼에서든 적합한 사용자 이름을 찾고, 확인하고, 만들 수 있습니다. 개인 브랜드를 구축하든, 새 비즈니스를 시작하든, 즐겨 쓰는 사이트에서 일관된 핸들을 원하든 이 도구들이 과정을 훨씬 쉽게 만들어 줍니다.",
    checker:
      "가장 인기 있는 도구는 원하는 사용자 이름이 1,400개 이상의 플랫폼에서 사용 가능한지 몇 초 안에 확인해 줍니다. 한 번만 입력하면 어디서 이미 사용 중인지, 어디서 아직 가능한지, 어디서 바로 선점할 수 있는지 확인할 수 있습니다.",
    generator:
      "곧 제공 예정: 사용자 이름 생성기는 이름, 관심사, 키워드를 바탕으로 독창적인 후보를 추천합니다. 특히 가장 원하는 이름이 주요 플랫폼에서 이미 사용 중일 때 유용합니다.",
    ideas:
      "곧 제공 예정: 스타일, 카테고리, 플랫폼별로 정리된 사용자 이름 아이디어를 살펴볼 수 있습니다. 기억하기 쉽고 자신의 정체성이나 브랜드에 맞는 이름을 찾는 데 도움이 됩니다.",
  },
  de: {
    intro:
      "Unsere kostenlosen Username-Tools helfen dir dabei, den passenden Benutzernamen für jede Plattform zu finden, zu prüfen und zu entwickeln. Egal ob du eine persönliche Marke aufbaust, ein neues Unternehmen startest oder einfach denselben Handle auf deinen Lieblingsseiten nutzen möchtest – diese Tools machen den Prozess deutlich einfacher.",
    checker:
      "Unser beliebtestes Tool prüft in wenigen Sekunden, ob dein gewünschter Benutzername auf mehr als 1.400 Plattformen verfügbar ist. Gib ihn einmal ein und sieh sofort, wo er vergeben ist, wo er frei ist und wo du ihn direkt sichern kannst.",
    generator:
      "Demnächst verfügbar: Unser Username-Generator schlägt dir kreative Ideen auf Basis deines Namens, deiner Interessen und deiner Keywords vor. Das ist besonders nützlich, wenn deine erste Wahl auf wichtigen Plattformen bereits vergeben ist.",
    ideas:
      "Demnächst verfügbar: Durchstöbere kuratierte Username-Ideen nach Stil, Kategorie und Plattform. So findest du leichter einen einprägsamen Namen, der zu deiner Identität oder Marke passt.",
  },
  pt: {
    intro:
      "Nossas ferramentas gratuitas de nome de usuário ajudam você a encontrar, verificar e criar o nome ideal para qualquer plataforma. Seja para construir uma marca pessoal, lançar um negócio ou apenas manter o mesmo identificador nos seus sites favoritos, elas tornam todo o processo muito mais simples.",
    checker:
      "Nossa ferramenta mais popular verifica em segundos se o nome de usuário desejado está disponível em mais de 1.400 plataformas. Digite uma vez e veja onde ele já está em uso, onde ainda está livre e onde você pode registrá-lo imediatamente.",
    generator:
      "Em breve: nosso gerador de nomes de usuário vai sugerir ideias criativas com base no seu nome, nos seus interesses e nas suas palavras-chave. É ideal quando a sua primeira opção já foi ocupada nas plataformas mais importantes.",
    ideas:
      "Em breve: explore ideias de nomes de usuário organizadas por estilo, categoria e plataforma. Essas listas de inspiração ajudam você a encontrar um nome memorável e alinhado à sua identidade ou marca.",
  },
  ru: {
    intro:
      "Наши бесплатные инструменты для проверки имени пользователя помогают подобрать, проверить и придумать подходящий ник для любой платформы. Они полезны и для личного бренда, и для нового бизнеса, и для тех, кто просто хочет использовать один и тот же ник на любимых сайтах.",
    checker:
      "Самый популярный инструмент за секунды показывает, доступно ли нужное имя пользователя более чем на 1400 платформах. Введите ник один раз и сразу увидите, где он занят, где свободен и где его можно зарегистрировать прямо сейчас.",
    generator:
      "Скоро: генератор имён пользователя будет предлагать креативные варианты на основе вашего имени, интересов и ключевых слов. Это особенно полезно, если ваш первый вариант уже занят на важных для вас платформах.",
    ideas:
      "Скоро: вы сможете просматривать подборки идей для имён пользователя по стилю, категории и платформе. Такие списки помогают найти запоминающийся ник, который подходит вашему образу или бренду.",
  },
};

const categoriesIndexCopy: Record<
  AppLocale,
  {
    intro: string;
    details: string;
    reasons: string[];
  }
> = {
  en: {
    intro:
      "Our category browser helps you explore username availability by platform type. Whether you care about social media, gaming, developer communities, or business networks, everything is grouped into clear sections so you can search more strategically.",
    details:
      "Choose a category above to review the most relevant platforms in that space. For each platform, you can inspect profile details, understand how username lookup works, and jump directly to account creation pages. With coverage across more than 1,400 platforms, it is easier to protect your username where it matters most.",
    reasons: [
      "Focus on platforms that match your industry, hobby, or audience.",
      "Discover new services inside the categories you care about most.",
      "Secure your preferred username across the important platforms in one niche.",
      "Compare availability on similar platforms without repeating the same search manually.",
    ],
  },
  zh: {
    intro:
      "我们的分类浏览器可以帮助你按平台类型查看用户名可用性。无论你关注的是社交媒体、游戏平台、开发者社区还是商务网络，这里都按清晰分类整理，方便你更有策略地搜索。",
    details:
      "选择上方任意分类，即可查看该领域中最相关的平台。你可以了解每个平台的资料页面、用户名查询方式，并直接跳转到注册页面。覆盖 1400+ 平台后，保护重要用户名会变得更轻松。",
    reasons: [
      "优先关注与你行业、兴趣或受众最相关的平台。",
      "发现你最在意分类中的新平台和新服务。",
      "一次性在同一细分领域的重要平台上保护你的首选用户名。",
      "无需反复手动搜索，就能对比相似平台的可用情况。",
    ],
  },
  es: {
    intro:
      "Nuestro explorador por categorías te ayuda a revisar la disponibilidad de nombres de usuario según el tipo de plataforma. Ya sea que te interesen las redes sociales, el gaming, las comunidades de desarrollo o las redes profesionales, todo está organizado para que busques con más estrategia.",
    details:
      "Elige una categoría para ver las plataformas más relevantes de ese espacio. En cada una podrás consultar detalles del perfil, entender cómo funciona la búsqueda de nombres y acceder directamente a la creación de cuenta. Con cobertura de más de 1.400 plataformas, proteger tu nombre resulta mucho más sencillo.",
    reasons: [
      "Concéntrate en plataformas alineadas con tu sector, afición o audiencia.",
      "Descubre nuevos servicios dentro de las categorías que más te importan.",
      "Asegura tu nombre de usuario en las plataformas clave de un mismo nicho.",
      "Compara disponibilidad entre plataformas similares sin repetir búsquedas manuales.",
    ],
  },
  ja: {
    intro:
      "カテゴリブラウザーでは、プラットフォームの種類ごとにユーザー名の利用状況を確認できます。SNS、ゲーム、開発者コミュニティ、ビジネスネットワークなど、目的別に整理されているため、より戦略的に検索できます。",
    details:
      "上のカテゴリを選ぶと、その分野で重要なプラットフォームを一覧で確認できます。各プラットフォームではプロフィール情報やユーザー名確認の仕組みを把握でき、アカウント作成ページへも直接移動できます。1,400 以上のプラットフォームを対象にしているため、大切なユーザー名を守りやすくなります。",
    reasons: [
      "業界・趣味・オーディエンスに合ったプラットフォームへ集中できる。",
      "気になるカテゴリ内で新しいサービスを発見できる。",
      "同じ分野の重要なプラットフォームで希望のユーザー名をまとめて確保しやすい。",
      "似たプラットフォーム同士の利用状況を手作業なしで比較できる。",
    ],
  },
  fr: {
    intro:
      "Notre navigateur par catégories vous aide à vérifier la disponibilité d’un nom d’utilisateur selon le type de plateforme. Réseaux sociaux, gaming, communautés de développeurs ou réseaux professionnels : tout est regroupé de façon claire pour permettre une recherche plus stratégique.",
    details:
      "Choisissez une catégorie pour afficher les plateformes les plus pertinentes dans ce domaine. Vous pouvez consulter les détails de chaque plateforme, comprendre le fonctionnement de la recherche de pseudo et accéder directement aux pages de création de compte. Avec plus de 1 400 plateformes couvertes, il devient beaucoup plus simple de protéger votre nom d’utilisateur là où c’est important.",
    reasons: [
      "Concentrez-vous sur les plateformes liées à votre secteur, votre passion ou votre audience.",
      "Découvrez de nouveaux services dans les catégories qui comptent le plus pour vous.",
      "Réservez votre identifiant sur les plateformes clés d’un même univers.",
      "Comparez la disponibilité sur des plateformes similaires sans relancer les mêmes recherches à la main.",
    ],
  },
  ko: {
    intro:
      "카테고리 브라우저를 사용하면 플랫폼 유형별로 사용자 이름 사용 가능 여부를 확인할 수 있습니다. 소셜 미디어, 게임, 개발자 커뮤니티, 비즈니스 네트워크 등 관심 있는 영역별로 정리되어 있어 더 전략적으로 검색할 수 있습니다.",
    details:
      "위에서 카테고리를 선택하면 해당 분야에서 중요한 플랫폼들을 한눈에 볼 수 있습니다. 각 플랫폼의 프로필 정보와 사용자 이름 조회 방식을 확인하고, 계정 생성 페이지로 바로 이동할 수도 있습니다. 1,400개 이상의 플랫폼을 지원하므로 중요한 사용자 이름을 더 쉽게 보호할 수 있습니다.",
    reasons: [
      "업종, 취미, 대상 고객과 맞는 플랫폼에 집중할 수 있습니다.",
      "중요하게 생각하는 카테고리 안에서 새로운 서비스를 발견할 수 있습니다.",
      "같은 분야의 핵심 플랫폼에서 원하는 사용자 이름을 한 번에 확보하기 쉽습니다.",
      "비슷한 플랫폼의 사용 가능 여부를 반복 검색 없이 비교할 수 있습니다.",
    ],
  },
  de: {
    intro:
      "Mit unserem Kategorie-Browser kannst du die Verfügbarkeit von Benutzernamen nach Plattformtyp durchsuchen. Ob soziale Netzwerke, Gaming, Entwickler-Communities oder Business-Plattformen – alles ist klar gruppiert, damit du gezielter suchen kannst.",
    details:
      "Wähle oben eine Kategorie aus, um die wichtigsten Plattformen in diesem Bereich zu sehen. Für jede Plattform kannst du Profilinfos prüfen, verstehen, wie die Username-Suche funktioniert, und direkt zur Kontoerstellung springen. Mit Abdeckung für mehr als 1.400 Plattformen wird es deutlich einfacher, deinen Namen dort zu schützen, wo er zählt.",
    reasons: [
      "Konzentriere dich auf Plattformen, die zu Branche, Hobby oder Zielgruppe passen.",
      "Entdecke neue Dienste innerhalb der Kategorien, die dir wichtig sind.",
      "Sichere deinen bevorzugten Namen auf den zentralen Plattformen einer Nische.",
      "Vergleiche ähnliche Plattformen, ohne dieselbe Suche immer wieder manuell auszuführen.",
    ],
  },
  pt: {
    intro:
      "Nosso navegador por categorias ajuda você a verificar a disponibilidade de nomes de usuário por tipo de plataforma. Redes sociais, games, comunidades de desenvolvedores ou redes profissionais: tudo fica organizado de forma clara para você pesquisar com mais estratégia.",
    details:
      "Escolha uma categoria acima para ver as plataformas mais relevantes daquele espaço. Em cada plataforma, você pode analisar detalhes do perfil, entender como funciona a busca de nome de usuário e acessar diretamente a página de criação de conta. Com cobertura de mais de 1.400 plataformas, fica muito mais fácil proteger seu nome onde isso importa.",
    reasons: [
      "Foque nas plataformas que combinam com seu setor, hobby ou público.",
      "Descubra novos serviços dentro das categorias mais importantes para você.",
      "Garanta seu nome de usuário nas plataformas-chave de um mesmo nicho.",
      "Compare a disponibilidade em plataformas semelhantes sem repetir buscas manualmente.",
    ],
  },
  ru: {
    intro:
      "Наш каталог по категориям помогает проверять доступность имени пользователя по типам платформ. Социальные сети, игры, сообщества разработчиков и деловые сервисы собраны по понятным разделам, чтобы вы могли искать более осознанно.",
    details:
      "Выберите категорию выше, чтобы увидеть самые важные платформы в нужной области. Для каждой платформы можно посмотреть описание, понять логику проверки имени и сразу перейти к созданию аккаунта. Благодаря охвату более 1400 платформ защищать важный ник становится значительно проще.",
    reasons: [
      "Сосредоточьтесь на платформах, связанных с вашей сферой, интересом или аудиторией.",
      "Находите новые сервисы внутри наиболее важных для вас категорий.",
      "Закрепляйте желаемый ник на ключевых платформах одной ниши сразу.",
      "Сравнивайте доступность на похожих платформах без повторяющихся ручных поисков.",
    ],
  },
};

export function getToolsPageCopy(locale: string) {
  return toolsCopy[resolveLocale(locale)];
}

export function getCategoriesIndexCopy(locale: string) {
  return categoriesIndexCopy[resolveLocale(locale)];
}

export function getCategoryDetailCopy(
  locale: string,
  categoryName: string,
  categoryDescription: string,
  platformCount: number,
) {
  const normalizedLocale = resolveLocale(locale);

  const builders: Record<AppLocale, { paragraph1: string; paragraph2: string }> = {
    en: {
      paragraph1: `${categoryDescription} Checking username availability across multiple ${categoryName} platforms helps you keep a consistent online identity, protect your brand, and reserve the handle you want before someone else does.`,
      paragraph2: `This page highlights ${platformCount} popular ${categoryName} platforms, while our broader search covers more than 1,400 services worldwide. Enter a username once to see where it is available, where it is already taken, and where you can claim it next.`,
    },
    zh: {
      paragraph1: `${categoryDescription} 在多个${categoryName}平台上检查用户名可用性，有助于你保持统一的线上身份、保护品牌，并在别人抢先之前保留你想要的用户名。`,
      paragraph2: `本页重点展示 ${platformCount} 个热门${categoryName}平台，而我们的完整搜索可覆盖全球 1400+ 服务。只需输入一次用户名，即可看到哪些平台可注册、哪些已被占用，以及下一步可以去哪里认领。`,
    },
    es: {
      paragraph1: `${categoryDescription} Revisar la disponibilidad de nombres de usuario en múltiples plataformas de ${categoryName} te ayuda a mantener una identidad digital coherente, proteger tu marca y reservar el identificador que deseas antes de que otra persona lo haga.`,
      paragraph2: `Esta página destaca ${platformCount} plataformas populares de ${categoryName}, mientras que nuestra búsqueda completa cubre más de 1.400 servicios en todo el mundo. Introduce un nombre una vez y verás dónde está disponible, dónde ya está ocupado y dónde puedes reclamarlo después.`,
    },
    ja: {
      paragraph1: `${categoryDescription} 複数の${categoryName}プラットフォームでユーザー名の利用可否を確認することで、統一したオンラインアイデンティティを保ち、ブランドを守り、欲しいハンドル名を他者より先に確保しやすくなります。`,
      paragraph2: `このページでは人気の${categoryName}プラットフォームを ${platformCount} 件紹介していますが、全体検索では世界中の 1,400 以上のサービスを対象にできます。ユーザー名を 1 回入力するだけで、利用可能な場所、使用済みの場所、次に取得できる場所が分かります。`,
    },
    fr: {
      paragraph1: `${categoryDescription} Vérifier la disponibilité d’un nom d’utilisateur sur plusieurs plateformes de ${categoryName} vous aide à conserver une identité numérique cohérente, à protéger votre marque et à réserver l’identifiant souhaité avant qu’une autre personne ne le fasse.`,
      paragraph2: `Cette page met en avant ${platformCount} plateformes populaires de ${categoryName}, tandis que notre recherche complète couvre plus de 1 400 services dans le monde. Saisissez un nom une seule fois pour voir où il est disponible, où il est déjà pris et où vous pouvez ensuite le réserver.`,
    },
    ko: {
      paragraph1: `${categoryDescription} 여러 ${categoryName} 플랫폼에서 사용자 이름 사용 가능 여부를 확인하면 일관된 온라인 정체성을 유지하고, 브랜드를 보호하며, 원하는 핸들을 다른 사람이 먼저 가져가기 전에 확보하는 데 도움이 됩니다.`,
      paragraph2: `이 페이지는 인기 있는 ${categoryName} 플랫폼 ${platformCount}개를 보여 주며, 전체 검색은 전 세계 1,400개 이상의 서비스를 지원합니다. 사용자 이름을 한 번 입력하면 어디서 사용 가능한지, 어디서 이미 사용 중인지, 다음으로 어디서 확보할 수 있는지 확인할 수 있습니다.`,
    },
    de: {
      paragraph1: `${categoryDescription} Wenn du die Verfügbarkeit eines Benutzernamens auf mehreren ${categoryName}-Plattformen prüfst, kannst du eine konsistente Online-Identität aufbauen, deine Marke schützen und dir deinen Wunsch-Handle sichern, bevor es jemand anderes tut.`,
      paragraph2: `Diese Seite zeigt ${platformCount} beliebte ${categoryName}-Plattformen. Unsere umfassende Suche deckt darüber hinaus mehr als 1.400 Dienste weltweit ab. Gib einen Namen einmal ein und sieh sofort, wo er verfügbar ist, wo er bereits vergeben ist und wo du ihn als Nächstes sichern kannst.`,
    },
    pt: {
      paragraph1: `${categoryDescription} Verificar a disponibilidade do nome de usuário em várias plataformas de ${categoryName} ajuda você a manter uma identidade digital consistente, proteger sua marca e reservar o identificador desejado antes que outra pessoa o faça.`,
      paragraph2: `Esta página destaca ${platformCount} plataformas populares de ${categoryName}, enquanto a nossa busca completa cobre mais de 1.400 serviços no mundo todo. Digite um nome uma vez e veja onde ele está disponível, onde já foi ocupado e onde você pode registrá-lo em seguida.`,
    },
    ru: {
      paragraph1: `${categoryDescription} Проверка доступности имени пользователя на нескольких платформах категории ${categoryName} помогает поддерживать единый цифровой образ, защищать бренд и успевать занять нужный ник раньше других.`,
      paragraph2: `На этой странице показаны ${platformCount} популярных платформ категории ${categoryName}, а полный поиск охватывает более 1400 сервисов по всему миру. Введите имя один раз и сразу увидите, где оно свободно, где уже занято и где его можно зарегистрировать дальше.`,
    },
  };

  return builders[normalizedLocale];
}

export function getPlatformDetailCopy(
  locale: string,
  platformName: string,
  founded?: string,
) {
  const normalizedLocale = resolveLocale(locale);

  const builders: Record<
    AppLocale,
    {
      title: string;
      foundedLabel?: string;
      aboutParagraph: string;
    }
  > = {
    en: {
      title: `${platformName} Username Search`,
      foundedLabel: founded ? `Since ${founded}` : undefined,
      aboutParagraph:
        "Checking username availability across multiple platforms is essential for maintaining a consistent online presence, protecting your brand, and strengthening personal identity. Whether you are a creator, business owner, or everyday user, securing your preferred handle helps people find and recognize you more easily.",
    },
    zh: {
      title: `${platformName} 用户名搜索`,
      foundedLabel: founded ? `创立于 ${founded}` : undefined,
      aboutParagraph:
        "在多个平台上检查用户名可用性，对于保持统一的线上形象、保护品牌以及强化个人身份都非常重要。无论你是创作者、企业经营者，还是普通用户，尽早保留你偏好的用户名都能让别人更容易找到并识别你。",
    },
    es: {
      title: `Búsqueda de nombre de usuario en ${platformName}`,
      foundedLabel: founded ? `Desde ${founded}` : undefined,
      aboutParagraph:
        "Comprobar la disponibilidad de tu nombre de usuario en varias plataformas es esencial para mantener una presencia online coherente, proteger tu marca y reforzar tu identidad digital. Tanto si eres creador, empresario o usuario habitual, asegurar tu identificador preferido facilita que otras personas te encuentren y te reconozcan.",
    },
    ja: {
      title: `${platformName} のユーザー名検索`,
      foundedLabel: founded ? `${founded} 年創業` : undefined,
      aboutParagraph:
        "複数のプラットフォームでユーザー名の利用可否を確認することは、統一したオンライン上の存在感を保ち、ブランドを守り、個人としての認知を高めるうえで重要です。クリエイター、事業者、一般ユーザーのいずれであっても、希望するハンドル名を確保することで見つけてもらいやすくなります。",
    },
    fr: {
      title: `Recherche de nom d’utilisateur sur ${platformName}`,
      foundedLabel: founded ? `Depuis ${founded}` : undefined,
      aboutParagraph:
        "Vérifier la disponibilité d’un nom d’utilisateur sur plusieurs plateformes est essentiel pour garder une présence en ligne cohérente, protéger votre marque et renforcer votre identité numérique. Que vous soyez créateur, professionnel ou simple utilisateur, sécuriser votre identifiant préféré permet d’être trouvé et reconnu plus facilement.",
    },
    ko: {
      title: `${platformName} 사용자 이름 검색`,
      foundedLabel: founded ? `${founded}년부터` : undefined,
      aboutParagraph:
        "여러 플랫폼에서 사용자 이름 사용 가능 여부를 확인하는 일은 일관된 온라인 존재감을 유지하고, 브랜드를 보호하며, 개인 정체성을 강화하는 데 중요합니다. 크리에이터, 사업자, 일반 사용자 누구에게나 원하는 핸들을 확보하는 일은 다른 사람들이 더 쉽게 당신을 찾고 기억하게 만듭니다.",
    },
    de: {
      title: `${platformName} Benutzername-Suche`,
      foundedLabel: founded ? `Seit ${founded}` : undefined,
      aboutParagraph:
        "Die Verfügbarkeit deines Benutzernamens auf mehreren Plattformen zu prüfen, ist wichtig für eine konsistente Online-Präsenz, den Schutz deiner Marke und eine stärkere digitale Identität. Ob Creator, Unternehmen oder privater Nutzer – ein gesicherter Wunsch-Handle macht es anderen leichter, dich zu finden und wiederzuerkennen.",
    },
    pt: {
      title: `Busca de nome de usuário no ${platformName}`,
      foundedLabel: founded ? `Desde ${founded}` : undefined,
      aboutParagraph:
        "Verificar a disponibilidade do seu nome de usuário em várias plataformas é essencial para manter uma presença online consistente, proteger sua marca e fortalecer sua identidade digital. Seja você criador, empresário ou usuário comum, garantir o identificador desejado facilita que outras pessoas encontrem e reconheçam você.",
    },
    ru: {
      title: `Поиск имени пользователя на ${platformName}`,
      foundedLabel: founded ? `С ${founded} года` : undefined,
      aboutParagraph:
        "Проверка доступности имени пользователя на разных платформах важна для единого онлайн-образа, защиты бренда и укрепления цифровой идентичности. Независимо от того, вы создатель контента, владелец бизнеса или обычный пользователь, закреплённый ник помогает другим людям быстрее находить и узнавать вас.",
    },
  };

  return builders[normalizedLocale];
}

const toolsCatalog: Record<
  AppLocale,
  Array<{
    slug: string;
    name: string;
    description: string;
    keywords: string[];
    comingSoon: boolean;
    href?: string;
  }>
> = {
  en: [
    {
      slug: "username-generator",
      name: "Username Generator",
      description:
        "Generate creative username ideas based on your name, interests, or keywords and quickly explore better alternatives.",
      keywords: ["username generator", "username ideas", "create username"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "Username Availability Checker",
      description:
        "Check whether your preferred username is available across 1,400+ platforms and see where you can claim it next.",
      keywords: ["username availability", "check username", "username checker"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "Username Ideas & Inspiration",
      description:
        "Browse curated ideas by style, category, and platform to discover memorable username directions.",
      keywords: ["username ideas", "creative usernames", "username inspiration"],
      comingSoon: true,
    },
  ],
  zh: [
    {
      slug: "username-generator",
      name: "用户名生成器",
      description: "根据你的姓名、兴趣或关键词生成更有创意的用户名方案，并快速找到更好的备选。",
      keywords: ["用户名生成器", "用户名灵感", "创建用户名"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "用户名可用性检查器",
      description: "检查你心仪的用户名是否可在 1400+ 平台使用，并查看下一步可以去哪里认领。",
      keywords: ["用户名可用性", "检查用户名", "用户名查询"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "用户名灵感库",
      description: "按风格、分类和平台浏览精选用户名灵感，找到更容易记住的命名方向。",
      keywords: ["用户名创意", "创意用户名", "用户名灵感"],
      comingSoon: true,
    },
  ],
  es: [
    {
      slug: "username-generator",
      name: "Generador de nombres de usuario",
      description: "Genera ideas creativas a partir de tu nombre, intereses o palabras clave y encuentra alternativas mejores con rapidez.",
      keywords: ["generador de usuario", "ideas de usuario", "crear usuario"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "Verificador de disponibilidad de nombre de usuario",
      description: "Comprueba si tu nombre preferido está libre en más de 1.400 plataformas y ve dónde puedes reclamarlo después.",
      keywords: ["disponibilidad de usuario", "comprobar usuario", "verificador de usuario"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "Ideas e inspiración de nombres de usuario",
      description: "Explora ideas seleccionadas por estilo, categoría y plataforma para descubrir nombres más memorables.",
      keywords: ["ideas de usuario", "usuarios creativos", "inspiración de usuario"],
      comingSoon: true,
    },
  ],
  ja: [
    {
      slug: "username-generator",
      name: "ユーザー名ジェネレーター",
      description: "名前・興味・キーワードをもとに創造的な候補を作成し、より良い代替案をすばやく見つけます。",
      keywords: ["ユーザー名ジェネレーター", "ユーザー名アイデア", "ユーザー名作成"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "ユーザー名空き状況チェッカー",
      description: "希望するユーザー名が 1,400 以上のプラットフォームで使えるかを確認し、次に取得できる場所を把握できます。",
      keywords: ["ユーザー名空き状況", "ユーザー名確認", "ユーザー名検索"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "ユーザー名アイデア集",
      description: "スタイル・カテゴリ・プラットフォーム別の厳選アイデアから、覚えやすい名前の方向性を探せます。",
      keywords: ["ユーザー名アイデア", "創造的なユーザー名", "ユーザー名のヒント"],
      comingSoon: true,
    },
  ],
  fr: [
    {
      slug: "username-generator",
      name: "Générateur de noms d’utilisateur",
      description: "Créez des idées originales à partir de votre nom, de vos centres d’intérêt ou de mots-clés et trouvez vite de meilleures variantes.",
      keywords: ["générateur de pseudo", "idées de pseudo", "créer un pseudo"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "Vérificateur de disponibilité de pseudo",
      description: "Vérifiez si votre nom préféré est libre sur plus de 1 400 plateformes et voyez où vous pouvez l’enregistrer ensuite.",
      keywords: ["disponibilité pseudo", "vérifier pseudo", "outil pseudo"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "Idées et inspiration de pseudos",
      description: "Parcourez des idées sélectionnées par style, catégorie et plateforme pour trouver des noms plus mémorables.",
      keywords: ["idées de pseudo", "pseudo créatif", "inspiration pseudo"],
      comingSoon: true,
    },
  ],
  ko: [
    {
      slug: "username-generator",
      name: "사용자 이름 생성기",
      description: "이름, 관심사, 키워드를 바탕으로 창의적인 후보를 만들고 더 나은 대안을 빠르게 찾을 수 있습니다.",
      keywords: ["사용자 이름 생성기", "사용자 이름 아이디어", "사용자 이름 만들기"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "사용자 이름 사용 가능 여부 확인기",
      description: "원하는 사용자 이름이 1,400개 이상의 플랫폼에서 가능한지 확인하고 어디서 먼저 확보할지 볼 수 있습니다.",
      keywords: ["사용 가능 여부", "사용자 이름 확인", "사용자 이름 검색"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "사용자 이름 아이디어 모음",
      description: "스타일, 카테고리, 플랫폼별로 정리된 아이디어를 통해 더 기억하기 쉬운 이름 방향을 찾으세요.",
      keywords: ["사용자 이름 아이디어", "창의적 사용자 이름", "이름 영감"],
      comingSoon: true,
    },
  ],
  de: [
    {
      slug: "username-generator",
      name: "Benutzernamen-Generator",
      description: "Erzeuge kreative Ideen auf Basis deines Namens, deiner Interessen oder Keywords und finde schnell bessere Alternativen.",
      keywords: ["Username-Generator", "Username-Ideen", "Benutzernamen erstellen"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "Benutzernamen-Verfügbarkeitscheck",
      description: "Prüfe, ob dein gewünschter Name auf mehr als 1.400 Plattformen frei ist, und sieh, wo du ihn als Nächstes sichern kannst.",
      keywords: ["Username-Verfügbarkeit", "Username prüfen", "Username-Checker"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "Username-Ideen & Inspiration",
      description: "Durchstöbere kuratierte Ideen nach Stil, Kategorie und Plattform, um einprägsamere Namensrichtungen zu entdecken.",
      keywords: ["Username-Ideen", "kreative Usernames", "Username-Inspiration"],
      comingSoon: true,
    },
  ],
  pt: [
    {
      slug: "username-generator",
      name: "Gerador de nomes de usuário",
      description: "Gere ideias criativas com base no seu nome, interesses ou palavras-chave e encontre alternativas melhores rapidamente.",
      keywords: ["gerador de nome", "ideias de usuário", "criar usuário"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "Verificador de disponibilidade de nome de usuário",
      description: "Veja se o nome desejado está livre em mais de 1.400 plataformas e descubra onde você pode registrá-lo em seguida.",
      keywords: ["disponibilidade de usuário", "checar usuário", "verificador de usuário"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "Ideias e inspiração de nomes de usuário",
      description: "Explore ideias selecionadas por estilo, categoria e plataforma para descobrir nomes mais memoráveis.",
      keywords: ["ideias de usuário", "nomes criativos", "inspiração de usuário"],
      comingSoon: true,
    },
  ],
  ru: [
    {
      slug: "username-generator",
      name: "Генератор имён пользователя",
      description: "Создавайте креативные варианты на основе имени, интересов и ключевых слов и быстрее находите удачные альтернативы.",
      keywords: ["генератор ника", "идеи ника", "создать имя пользователя"],
      comingSoon: true,
    },
    {
      slug: "username-availability-checker",
      name: "Проверка доступности имени пользователя",
      description: "Проверьте, доступен ли нужный ник на более чем 1400 платформах, и посмотрите, где его можно занять дальше.",
      keywords: ["доступность ника", "проверить ник", "поиск ника"],
      comingSoon: false,
      href: "/",
    },
    {
      slug: "username-ideas",
      name: "Идеи и вдохновение для имён пользователя",
      description: "Просматривайте подборки по стилю, категории и платформе, чтобы находить более запоминающиеся варианты имени.",
      keywords: ["идеи ника", "креативные ники", "вдохновение для ника"],
      comingSoon: true,
    },
  ],
};

export function getToolsCatalog(locale: string) {
  return toolsCatalog[resolveLocale(locale)];
}

export function getCategoryHeaderCopy(
  locale: string,
  categoryName: string,
  platformCount: number,
) {
  const normalizedLocale = resolveLocale(locale);

  const labels: Record<AppLocale, { title: string; summary: string }> = {
    en: {
      title: `${categoryName} Platforms`,
      summary: `Showing ${platformCount} popular ${categoryName} platforms`,
    },
    zh: {
      title: `${categoryName}平台`,
      summary: `展示 ${platformCount} 个热门${categoryName}平台`,
    },
    es: {
      title: `Plataformas de ${categoryName}`,
      summary: `Mostrando ${platformCount} plataformas populares de ${categoryName}`,
    },
    ja: {
      title: `${categoryName}プラットフォーム`,
      summary: `人気の${categoryName}プラットフォームを ${platformCount} 件表示`,
    },
    fr: {
      title: `Plateformes ${categoryName}`,
      summary: `${platformCount} plateformes ${categoryName} populaires affichées`,
    },
    ko: {
      title: `${categoryName} 플랫폼`,
      summary: `인기 있는 ${categoryName} 플랫폼 ${platformCount}개 표시`,
    },
    de: {
      title: `${categoryName}-Plattformen`,
      summary: `${platformCount} beliebte ${categoryName}-Plattformen werden angezeigt`,
    },
    pt: {
      title: `Plataformas de ${categoryName}`,
      summary: `Mostrando ${platformCount} plataformas populares de ${categoryName}`,
    },
    ru: {
      title: `Платформы категории ${categoryName}`,
      summary: `Показано ${platformCount} популярных платформ категории ${categoryName}`,
    },
  };

  return labels[normalizedLocale];
}
