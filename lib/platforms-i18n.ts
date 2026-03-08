import {
  defaultLocale,
  isSupportedLocale,
  type AppLocale,
} from "@/i18n/request";
import {
  CATEGORY_METADATA,
  POPULAR_PLATFORMS,
  type PlatformMetadata,
} from "./platforms-data";

interface LocalizedCategoryMeta {
  name: string;
  description: string;
  keywords: string[];
  icon: string;
}

const categoryTranslations: Record<AppLocale, Record<string, Omit<LocalizedCategoryMeta, "icon">>> = {
  en: {
    social: { name: "Social Media", description: "Popular social networking platforms where users connect, share content, and communicate with friends, communities, and audiences worldwide.", keywords: ["social media platforms", "social media username", "social account search", "social media profile lookup"] },
    coding: { name: "Developer & Coding", description: "Platforms for developers, programmers, and tech communities to publish code, collaborate, and build a professional presence.", keywords: ["developer platforms", "coding profile search", "developer username", "programmer communities"] },
    gaming: { name: "Gaming", description: "Gaming networks, streaming services, and player communities where users compete, share, and build gaming identities.", keywords: ["gaming platforms", "gaming username", "gamer profile search", "gaming communities"] },
    business: { name: "Business & Professional", description: "Professional networking and business platforms for careers, recruiting, reputation building, and industry connections.", keywords: ["professional networking", "business profile search", "professional username", "career platforms"] },
    entertainment: { name: "Entertainment", description: "Entertainment, creator, and streaming platforms for publishing media, building audiences, and sharing creative work.", keywords: ["entertainment platforms", "creator platforms", "streaming profile search", "content creator username"] },
    news: { name: "News & Media", description: "News, media, and content aggregation platforms used to publish, discuss, and follow current events and commentary.", keywords: ["news platforms", "media profiles", "news username", "media account search"] },
    forum: { name: "Forums & Communities", description: "Discussion boards and community spaces for questions, answers, niche interests, and long-form conversations.", keywords: ["forums", "community profile search", "discussion board username", "online communities"] },
    dating: { name: "Dating & Relationships", description: "Dating and relationship platforms where people create profiles, connect, and manage personal visibility online.", keywords: ["dating platforms", "dating profile search", "dating username", "relationship apps"] },
    shopping: { name: "Shopping & E-commerce", description: "E-commerce sites and marketplaces for buying, selling, reviews, storefronts, and customer identity across commerce platforms.", keywords: ["shopping platforms", "marketplace profile search", "seller username", "e-commerce account"] },
    other: { name: "Other Platforms", description: "A wider set of niche platforms, services, and tools that do not cleanly fit a single major category.", keywords: ["other platforms", "web services", "username lookup", "platform search"] },
  },
  zh: {
    social: { name: "社交媒体", description: "用户用于连接、分享内容并与朋友、社区和受众互动的主流社交平台。", keywords: ["社交媒体平台", "社交用户名", "社交账号搜索", "社交资料查询"] },
    coding: { name: "开发与编程", description: "开发者、程序员和技术社区发布代码、协作开发并建立专业形象的平台。", keywords: ["开发者平台", "编程资料搜索", "开发者用户名", "程序员社区"] },
    gaming: { name: "游戏", description: "玩家进行互动、竞技、直播和建立游戏身份的游戏平台与社区。", keywords: ["游戏平台", "游戏用户名", "玩家资料搜索", "游戏社区"] },
    business: { name: "商业与职业", description: "用于职业发展、招聘、人脉建立和行业连接的专业平台。", keywords: ["职业社交", "商业资料搜索", "职业用户名", "职业平台"] },
    entertainment: { name: "娱乐", description: "创作者、流媒体和娱乐内容发布平台，用于建立受众并分享作品。", keywords: ["娱乐平台", "创作者平台", "流媒体资料搜索", "创作者用户名"] },
    news: { name: "新闻与媒体", description: "用于发布、讨论和追踪时事内容的新闻与媒体平台。", keywords: ["新闻平台", "媒体资料", "新闻用户名", "媒体账号搜索"] },
    forum: { name: "论坛与社区", description: "围绕问答、兴趣话题和深度讨论而形成的论坛与社区空间。", keywords: ["论坛平台", "社区资料搜索", "讨论区用户名", "在线社区"] },
    dating: { name: "交友与关系", description: "用于建立个人资料、匹配和管理线上可见度的交友平台。", keywords: ["交友平台", "交友资料搜索", "交友用户名", "关系应用"] },
    shopping: { name: "购物与电商", description: "用于买卖、评论、店铺经营和消费者身份管理的电商平台。", keywords: ["购物平台", "电商资料搜索", "卖家用户名", "电商账号"] },
    other: { name: "其他平台", description: "不完全属于某一主类别的更多细分平台、服务与工具。", keywords: ["其他平台", "网络服务", "用户名查询", "平台搜索"] },
  },
  es: {
    social: { name: "Redes sociales", description: "Plataformas sociales populares donde los usuarios se conectan, comparten contenido y se comunican con amigos, comunidades y audiencias.", keywords: ["plataformas de redes sociales", "usuario social", "búsqueda de cuenta social", "perfil social"] },
    coding: { name: "Desarrollo y programación", description: "Plataformas para desarrolladores, programadores y comunidades técnicas donde compartir código, colaborar y construir presencia profesional.", keywords: ["plataformas para desarrolladores", "búsqueda de perfil técnico", "usuario de programación", "comunidades de programadores"] },
    gaming: { name: "Juegos", description: "Redes de juego, servicios de streaming y comunidades de jugadores para competir, compartir y construir una identidad de jugador.", keywords: ["plataformas de juegos", "usuario de jugador", "búsqueda de perfil de jugador", "comunidades de juegos"] },
    business: { name: "Negocios y profesional", description: "Plataformas profesionales para carrera, reclutamiento, reputación y conexiones del sector.", keywords: ["networking profesional", "perfil profesional", "usuario profesional", "plataformas de carrera"] },
    entertainment: { name: "Entretenimiento", description: "Plataformas de entretenimiento, creación y streaming para publicar medios, construir audiencia y compartir trabajo creativo.", keywords: ["plataformas de entretenimiento", "plataformas de creadores", "perfil de streaming", "usuario creador"] },
    news: { name: "Noticias y medios", description: "Plataformas de noticias y medios usadas para publicar, debatir y seguir la actualidad.", keywords: ["plataformas de noticias", "perfiles de medios", "usuario de noticias", "búsqueda de cuenta de medios"] },
    forum: { name: "Foros y comunidades", description: "Foros y espacios de comunidad para preguntas, respuestas, intereses de nicho y conversaciones largas.", keywords: ["foros", "búsqueda de comunidad", "usuario de foro", "comunidades en línea"] },
    dating: { name: "Citas y relaciones", description: "Plataformas de citas y relaciones donde las personas crean perfiles, conectan y gestionan su visibilidad en línea.", keywords: ["plataformas de citas", "perfil de citas", "usuario de citas", "apps de relaciones"] },
    shopping: { name: "Compras y comercio electrónico", description: "Sitios de comercio electrónico y marketplaces para comprar, vender, publicar tiendas y gestionar identidad comercial.", keywords: ["plataformas de compras", "perfil de marketplace", "usuario vendedor", "cuenta de comercio electrónico"] },
    other: { name: "Otras plataformas", description: "Un conjunto más amplio de plataformas, servicios y herramientas de nicho que no encajan en una sola gran categoría.", keywords: ["otras plataformas", "servicios web", "búsqueda de usuario", "búsqueda de plataforma"] },
  },
  ja: {
    social: { name: "ソーシャルメディア", description: "ユーザーがつながり、投稿し、友人やコミュニティ、フォロワーと交流する代表的なソーシャルプラットフォームです。", keywords: ["ソーシャルメディア", "SNSユーザー名", "SNSアカウント検索", "SNSプロフィール"] },
    coding: { name: "開発・コーディング", description: "開発者や技術コミュニティがコード共有、共同開発、実績発信を行うためのプラットフォームです。", keywords: ["開発者プラットフォーム", "技術プロフィール検索", "開発者ユーザー名", "プログラマーコミュニティ"] },
    gaming: { name: "ゲーム", description: "プレイヤーが競争、配信、交流を行い、ゲーム上のアイデンティティを築くためのプラットフォームです。", keywords: ["ゲームプラットフォーム", "ゲーマー名検索", "ゲームプロフィール検索", "ゲームコミュニティ"] },
    business: { name: "ビジネス・プロフェッショナル", description: "キャリア形成、採用、評判づくり、業界ネットワークのためのプロフェッショナル向けプラットフォームです。", keywords: ["ビジネスネットワーク", "職業プロフィール検索", "プロユーザー名", "キャリアプラットフォーム"] },
    entertainment: { name: "エンターテインメント", description: "動画、配信、クリエイティブ作品を発信し、オーディエンスを築くためのエンタメ系プラットフォームです。", keywords: ["エンタメプラットフォーム", "クリエイタープラットフォーム", "配信プロフィール", "クリエイター名"] },
    news: { name: "ニュース・メディア", description: "ニュースや解説を配信し、時事情報を追うためのメディアプラットフォームです。", keywords: ["ニュースプラットフォーム", "メディアプロフィール", "ニュースアカウント", "メディア検索"] },
    forum: { name: "フォーラム・コミュニティ", description: "質問回答、専門話題、長文ディスカッションのためのフォーラムやコミュニティです。", keywords: ["フォーラム", "コミュニティ検索", "掲示板ユーザー名", "オンラインコミュニティ"] },
    dating: { name: "出会い・関係", description: "プロフィール作成、出会い、可視性管理を行うための出会い系プラットフォームです。", keywords: ["出会い系プラットフォーム", "出会いプロフィール", "出会いユーザー名", "関係アプリ"] },
    shopping: { name: "ショッピング・EC", description: "売買、レビュー、出店、顧客との接点づくりに使われるEC・マーケットプレイスです。", keywords: ["ショッピングプラットフォーム", "マーケットプレイスプロフィール", "販売者ユーザー名", "ECアカウント"] },
    other: { name: "その他のプラットフォーム", description: "単一の主要カテゴリに収まらないニッチなサービス、ツール、プラットフォーム群です。", keywords: ["その他のプラットフォーム", "ウェブサービス", "ユーザー名検索", "プラットフォーム検索"] },
  },
  fr: {
    social: { name: "Réseaux sociaux", description: "Plateformes sociales populaires où les utilisateurs se connectent, partagent du contenu et échangent avec des amis, des communautés et des audiences.", keywords: ["réseaux sociaux", "nom d’utilisateur social", "recherche de compte social", "profil social"] },
    coding: { name: "Développement et code", description: "Plateformes pour développeurs et communautés techniques afin de publier du code, collaborer et construire une présence professionnelle.", keywords: ["plateformes développeur", "recherche de profil technique", "nom d’utilisateur développeur", "communautés de programmeurs"] },
    gaming: { name: "Jeux", description: "Plateformes de jeu, de streaming et communautés de joueurs pour concourir, partager et construire une identité de joueur.", keywords: ["plateformes de jeux", "nom d’utilisateur de joueur", "profil joueur", "communautés de jeux"] },
    business: { name: "Professionnel et entreprise", description: "Plateformes professionnelles pour la carrière, le recrutement, la réputation et les connexions sectorielles.", keywords: ["réseau professionnel", "profil d’entreprise", "nom d’utilisateur professionnel", "plateformes carrière"] },
    entertainment: { name: "Divertissement", description: "Plateformes de divertissement, de streaming et de création pour publier du contenu et développer une audience.", keywords: ["plateformes divertissement", "plateformes créateur", "profil streaming", "nom d’utilisateur créateur"] },
    news: { name: "Actualités et médias", description: "Plateformes d’actualités et de médias pour publier, débattre et suivre l’actualité.", keywords: ["plateformes actualités", "profils médias", "nom d’utilisateur médias", "recherche compte média"] },
    forum: { name: "Forums et communautés", description: "Forums et espaces communautaires pour questions, réponses, centres d’intérêt de niche et échanges approfondis.", keywords: ["forums", "recherche communauté", "nom d’utilisateur forum", "communautés en ligne"] },
    dating: { name: "Rencontres et relations", description: "Plateformes de rencontre permettant de créer un profil, de se connecter et de gérer sa visibilité en ligne.", keywords: ["plateformes de rencontre", "profil de rencontre", "nom d’utilisateur rencontre", "applications relationnelles"] },
    shopping: { name: "Achats et commerce en ligne", description: "Sites de commerce en ligne et places de marché pour acheter, vendre, gérer une boutique et une identité commerçante.", keywords: ["plateformes d’achat", "profil de place de marché", "nom d’utilisateur vendeur", "compte de commerce en ligne"] },
    other: { name: "Autres plateformes", description: "Un ensemble plus large de plateformes, services et outils spécialisés qui ne relèvent pas d’une seule catégorie majeure.", keywords: ["autres plateformes", "services web", "recherche de nom d’utilisateur", "recherche de plateforme"] },
  },
  ko: {
    social: { name: "소셜 미디어", description: "사용자가 연결되고 콘텐츠를 공유하며 친구, 커뮤니티, 팔로워와 소통하는 대표적인 소셜 플랫폼입니다.", keywords: ["소셜 미디어 플랫폼", "소셜 사용자 이름", "소셜 계정 검색", "소셜 프로필"] },
    coding: { name: "개발 및 코딩", description: "개발자와 기술 커뮤니티가 코드를 공유하고 협업하며 전문성을 드러내는 플랫폼입니다.", keywords: ["개발자 플랫폼", "기술 프로필 검색", "개발자 사용자 이름", "프로그래머 커뮤니티"] },
    gaming: { name: "게임", description: "플레이어가 경쟁하고 스트리밍하며 게임 정체성을 만드는 게임 플랫폼과 커뮤니티입니다.", keywords: ["게임 플랫폼", "게이머 이름", "게임 프로필 검색", "게임 커뮤니티"] },
    business: { name: "비즈니스 및 전문", description: "경력, 채용, 평판 관리, 업계 네트워킹을 위한 전문 플랫폼입니다.", keywords: ["전문 네트워킹", "비즈니스 프로필 검색", "전문 사용자 이름", "커리어 플랫폼"] },
    entertainment: { name: "엔터테인먼트", description: "미디어를 게시하고 팬층을 키우며 창작물을 공유하는 엔터테인먼트 및 크리에이터 플랫폼입니다.", keywords: ["엔터테인먼트 플랫폼", "크리에이터 플랫폼", "스트리밍 프로필", "크리에이터 사용자 이름"] },
    news: { name: "뉴스 및 미디어", description: "뉴스와 해설을 게시하고 시사 이슈를 추적하는 미디어 플랫폼입니다.", keywords: ["뉴스 플랫폼", "미디어 프로필", "뉴스 사용자 이름", "미디어 계정 검색"] },
    forum: { name: "포럼 및 커뮤니티", description: "질문, 답변, 취미 분야, 장문 토론을 위한 포럼과 커뮤니티 공간입니다.", keywords: ["포럼", "커뮤니티 검색", "게시판 사용자 이름", "온라인 커뮤니티"] },
    dating: { name: "데이트 및 관계", description: "프로필을 만들고 연결을 맺으며 온라인 가시성을 관리하는 데이트 플랫폼입니다.", keywords: ["데이트 플랫폼", "데이트 프로필", "데이트 사용자 이름", "관계 앱"] },
    shopping: { name: "쇼핑 및 전자상거래", description: "구매, 판매, 리뷰, 스토어 운영과 상거래 정체성 관리에 쓰이는 전자상거래 플랫폼입니다.", keywords: ["쇼핑 플랫폼", "마켓플레이스 프로필", "판매자 사용자 이름", "전자상거래 계정"] },
    other: { name: "기타 플랫폼", description: "하나의 주요 카테고리로 분류하기 어려운 다양한 틈새 플랫폼과 서비스, 도구들입니다.", keywords: ["기타 플랫폼", "웹 서비스", "사용자 이름 검색", "플랫폼 검색"] },
  },
  de: {
    social: { name: "Soziale Medien", description: "Beliebte soziale Plattformen, auf denen Nutzer sich vernetzen, Inhalte teilen und mit Freunden, Communities und Zielgruppen kommunizieren.", keywords: ["soziale Medien Plattformen", "sozialer Benutzername", "soziale Kontensuche", "soziales Profil"] },
    coding: { name: "Entwicklung und Programmierung", description: "Plattformen für Entwickler und Technik-Communities, um Code zu veröffentlichen, zusammenzuarbeiten und Sichtbarkeit aufzubauen.", keywords: ["Entwicklerplattformen", "technische Profilsuche", "Entwickler-Benutzername", "Programmier-Community"] },
    gaming: { name: "Spiele", description: "Spielplattformen, Streaming-Dienste und Spieler-Communities für Wettbewerb, Austausch und digitale Spielidentität.", keywords: ["Spielplattformen", "Spieler-Benutzername", "Spielerprofil", "Spielgemeinschaft"] },
    business: { name: "Beruf und Unternehmen", description: "Professionelle Plattformen für Karriere, Recruiting, Reputation und Branchennetzwerke.", keywords: ["professionelles Netzwerk", "Unternehmensprofil", "professioneller Benutzername", "Karriereplattformen"] },
    entertainment: { name: "Unterhaltung", description: "Unterhaltungs-, Creator- und Streaming-Plattformen zum Veröffentlichen von Medien und Aufbau einer Zielgruppe.", keywords: ["Unterhaltungsplattformen", "Creator-Plattformen", "Streaming-Profil", "Creator-Benutzername"] },
    news: { name: "Nachrichten und Medien", description: "Nachrichten- und Medienplattformen zum Publizieren, Diskutieren und Verfolgen aktueller Entwicklungen.", keywords: ["Nachrichtenplattformen", "Medienprofile", "Medien-Benutzername", "Medienkontensuche"] },
    forum: { name: "Foren & Communities", description: "Foren und Community-Räume für Fragen, Antworten, Nischenthemen und längere Diskussionen.", keywords: ["Foren", "Community-Suche", "Foren-Benutzername", "Online-Communities"] },
    dating: { name: "Partnersuche und Beziehungen", description: "Dating-Plattformen, auf denen Menschen Profile anlegen, Kontakte knüpfen und ihre Sichtbarkeit verwalten.", keywords: ["Dating-Plattformen", "Dating-Profil", "Dating-Benutzername", "Beziehungs-Apps"] },
    shopping: { name: "Einkaufen und Online-Handel", description: "Online-Handelsseiten und Marktplätze für Kauf, Verkauf, Shop-Betrieb und Handelsidentität.", keywords: ["Einkaufsplattformen", "Marktplatzprofil", "Verkäufer-Benutzername", "Online-Handelskonto"] },
    other: { name: "Weitere Plattformen", description: "Eine breitere Auswahl an Nischenplattformen, Diensten und Tools, die nicht sauber in eine Hauptkategorie passen.", keywords: ["weitere Plattformen", "Webdienste", "Benutzernamensuche", "Plattformsuche"] },
  },
  pt: {
    social: { name: "Redes sociais", description: "Plataformas sociais populares onde usuários se conectam, compartilham conteúdo e se comunicam com amigos, comunidades e audiências.", keywords: ["plataformas de redes sociais", "nome de usuário social", "busca de conta social", "perfil social"] },
    coding: { name: "Desenvolvimento e programação", description: "Plataformas para desenvolvedores e comunidades técnicas publicarem código, colaborarem e construírem presença profissional.", keywords: ["plataformas para desenvolvedores", "busca de perfil técnico", "usuário de programação", "comunidades de programadores"] },
    gaming: { name: "Jogos", description: "Plataformas de jogos, streaming e comunidades de jogadores para competir, compartilhar e construir uma identidade de jogador.", keywords: ["plataformas de jogos", "nome de usuário de jogador", "perfil de jogador", "comunidades de jogos"] },
    business: { name: "Negócios e carreira", description: "Plataformas profissionais para carreira, recrutamento, reputação e conexões do setor.", keywords: ["rede profissional", "perfil profissional", "nome de usuário profissional", "plataformas de carreira"] },
    entertainment: { name: "Entretenimento", description: "Plataformas de entretenimento, criação e streaming para publicar mídia, construir audiência e compartilhar trabalho criativo.", keywords: ["plataformas de entretenimento", "plataformas de criadores", "perfil de streaming", "nome de usuário criador"] },
    news: { name: "Notícias e mídia", description: "Plataformas de notícias e mídia usadas para publicar, discutir e acompanhar acontecimentos atuais.", keywords: ["plataformas de notícias", "perfis de mídia", "usuário de notícias", "busca de conta de mídia"] },
    forum: { name: "Fóruns e comunidades", description: "Fóruns e espaços de comunidade para perguntas, respostas, temas de nicho e conversas longas.", keywords: ["fóruns", "busca de comunidade", "usuário de fórum", "comunidades online"] },
    dating: { name: "Relacionamentos e encontros", description: "Plataformas de relacionamento onde pessoas criam perfis, se conectam e gerenciam sua visibilidade online.", keywords: ["plataformas de namoro", "perfil de namoro", "nome de usuário de namoro", "apps de relacionamento"] },
    shopping: { name: "Compras e comércio eletrônico", description: "Sites de comércio eletrônico e marketplaces para comprar, vender, manter lojas e identidade comercial.", keywords: ["plataformas de compras", "perfil de marketplace", "nome de usuário vendedor", "conta de comércio eletrônico"] },
    other: { name: "Outras plataformas", description: "Um conjunto mais amplo de plataformas, serviços e ferramentas de nicho que não cabem em uma única grande categoria.", keywords: ["outras plataformas", "serviços web", "busca de usuário", "busca de plataforma"] },
  },
  ru: {
    social: { name: "Социальные сети", description: "Популярные социальные платформы, где пользователи общаются, делятся контентом и взаимодействуют с друзьями, сообществами и аудиторией.", keywords: ["социальные платформы", "социальное имя пользователя", "поиск социального аккаунта", "социальный профиль"] },
    coding: { name: "Разработка и кодинг", description: "Платформы для разработчиков и технических сообществ, где можно публиковать код, сотрудничать и строить профессиональное присутствие.", keywords: ["платформы для разработчиков", "поиск техпрофиля", "имя пользователя разработчика", "сообщества программистов"] },
    gaming: { name: "Игры", description: "Игровые платформы, стриминговые сервисы и сообщества игроков для соревнований, общения и цифровой игровой идентичности.", keywords: ["игровые платформы", "игровое имя пользователя", "поиск профиля игрока", "игровые сообщества"] },
    business: { name: "Бизнес и профессиональная среда", description: "Профессиональные платформы для карьеры, рекрутинга, репутации и отраслевых связей.", keywords: ["профессиональные сети", "бизнес-профиль", "профессиональное имя пользователя", "карьерные платформы"] },
    entertainment: { name: "Развлечения", description: "Платформы для развлечений, стриминга и творчества, где публикуют медиа и строят аудиторию.", keywords: ["развлекательные платформы", "платформы для авторов", "стриминговый профиль", "имя пользователя автора"] },
    news: { name: "Новости и медиа", description: "Новостные и медийные платформы для публикации, обсуждения и отслеживания текущих событий.", keywords: ["новостные платформы", "медиа-профили", "имя пользователя медиа", "поиск медиа-аккаунта"] },
    forum: { name: "Форумы и сообщества", description: "Форумы и сообщества для вопросов, ответов, нишевых тем и длинных обсуждений.", keywords: ["форумы", "поиск сообщества", "имя пользователя форума", "онлайн-сообщества"] },
    dating: { name: "Знакомства и отношения", description: "Платформы знакомств, где люди создают профили, знакомятся и управляют своей видимостью онлайн.", keywords: ["платформы знакомств", "профиль знакомств", "имя пользователя знакомств", "приложения для отношений"] },
    shopping: { name: "Покупки и e-commerce", description: "Сайты электронной коммерции и маркетплейсы для покупок, продаж, ведения магазина и цифровой торговой идентичности.", keywords: ["платформы покупок", "профиль маркетплейса", "имя пользователя продавца", "аккаунт e-commerce"] },
    other: { name: "Другие платформы", description: "Более широкий набор нишевых платформ, сервисов и инструментов, которые не относятся к одной основной категории.", keywords: ["другие платформы", "веб-сервисы", "поиск имени пользователя", "поиск платформы"] },
  },
};

function normalizeLocale(locale?: string): AppLocale {
  if (locale && isSupportedLocale(locale)) {
    return locale;
  }

  return defaultLocale;
}

export function getLocalizedCategoryMetadata(category: string, locale?: string) {
  const safeLocale = normalizeLocale(locale);
  const base = CATEGORY_METADATA[category];
  const translated = categoryTranslations[safeLocale][category] || categoryTranslations.en[category];

  return {
    ...base,
    ...translated,
  } satisfies LocalizedCategoryMeta;
}

function getPlatformKeywordPrefix(locale: AppLocale) {
  switch (locale) {
    case "zh":
      return ["用户名搜索", "账号查询", "资料搜索"];
    case "es":
      return ["búsqueda de usuario", "búsqueda de cuenta", "perfil"];
    case "ja":
      return ["ユーザー名検索", "アカウント検索", "プロフィール検索"];
    case "fr":
      return ["recherche de nom d’utilisateur", "recherche de compte", "profil"];
    case "ko":
      return ["사용자 이름 검색", "계정 검색", "프로필 검색"];
    case "de":
      return ["Benutzernamensuche", "Kontensuche", "Profilsuche"];
    case "pt":
      return ["busca de nome de usuário", "busca de conta", "perfil"];
    case "ru":
      return ["поиск имени пользователя", "поиск аккаунта", "профиль"];
    default:
      return ["username search", "account lookup", "profile"];
  }
}

function getPlatformDescription(platform: PlatformMetadata, locale: AppLocale) {
  const category = getLocalizedCategoryMetadata(platform.category, locale).name;

  switch (locale) {
    case "zh":
      return `${platform.name} 是一个属于“${category}”分类的平台。此页面可帮助你了解该平台上的用户名可用性、资料可见性以及统一用户名管理。`;
    case "es":
      return `${platform.name} es una plataforma de la categoría ${category}. Esta página te ayuda a comprobar la disponibilidad del nombre de usuario, la visibilidad del perfil y la consistencia de identidad en esa plataforma.`;
    case "ja":
      return `${platform.name} は「${category}」カテゴリに属するプラットフォームです。このページでは、そのプラットフォーム上でのユーザー名の利用可否やプロフィールの可視性を確認できます。`;
    case "fr":
      return `${platform.name} est une plateforme de la catégorie ${category}. Cette page vous aide à vérifier la disponibilité d’un nom d’utilisateur, la visibilité du profil et la cohérence d’identité sur cette plateforme.`;
    case "ko":
      return `${platform.name}은(는) ${category} 카테고리에 속한 플랫폼입니다. 이 페이지에서는 해당 플랫폼에서의 사용자 이름 사용 가능 여부와 프로필 가시성을 확인할 수 있습니다.`;
    case "de":
      return `${platform.name} ist eine Plattform aus der Kategorie ${category}. Diese Seite hilft dir dabei, Benutzernamen-Verfügbarkeit, Profilsichtbarkeit und Identitätskonsistenz auf dieser Plattform zu prüfen.`;
    case "pt":
      return `${platform.name} é uma plataforma da categoria ${category}. Esta página ajuda você a verificar disponibilidade de nome de usuário, visibilidade de perfil e consistência de identidade nessa plataforma.`;
    case "ru":
      return `${platform.name} — платформа из категории «${category}». Эта страница помогает проверить доступность имени пользователя, видимость профиля и согласованность цифровой идентичности на этой платформе.`;
    default:
      return platform.description;
  }
}

export function getLocalizedPlatform(platform: PlatformMetadata, locale?: string): PlatformMetadata {
  const safeLocale = normalizeLocale(locale);
  if (safeLocale === "en") {
    return platform;
  }

  const translatedKeywords = getPlatformKeywordPrefix(safeLocale).map(
    (prefix) => `${platform.name} ${prefix}`,
  );

  return {
    ...platform,
    description: getPlatformDescription(platform, safeLocale),
    keywords: translatedKeywords,
  };
}

export function getLocalizedPlatformBySlug(slug: string, locale?: string) {
  const platform = POPULAR_PLATFORMS.find((item) => item.slug === slug);
  return platform ? getLocalizedPlatform(platform, locale) : undefined;
}

export function getLocalizedPlatformsByCategory(category: string, locale?: string) {
  return POPULAR_PLATFORMS.filter((item) => item.category === category).map((item) =>
    getLocalizedPlatform(item, locale),
  );
}
