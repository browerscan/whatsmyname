import { defaultLocale, isSupportedLocale, type AppLocale } from "@/i18n/request";

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqCopy {
  title: string;
  entries: FaqEntry[];
}

// Home page FAQ. The visible section, the FAQPage JSON-LD and the Markdown
// home page all render this, so the three cannot drift apart.
const HOME_FAQ: Record<AppLocale, FaqCopy> = {
  en: {
    title: "Frequently asked questions",
    entries: [
      {
        question: "What is What is my Name?",
        answer:
          "What is my Name (whatismyname.org) is a free username search. Enter a handle once and it checks where that username exists across 1,400+ websites and apps, shows Google web results for it, and offers an optional AI analysis. It is an independent service, not affiliated with the platforms it checks.",
      },
      {
        question: "How do I check where a username is used?",
        answer:
          "Type the username into the search box without the @ sign or a profile URL, then start the search. Results appear site by site as each one answers. Filter them by category or status, and open the original profile to confirm a match.",
      },
      {
        question: "How long does a search take?",
        answer:
          "The first results arrive within seconds. Every site is checked separately, so a full pass over all 1,400+ sites usually takes a few minutes. You can review results while the search is still running.",
      },
      {
        question: "Is it free, and do I need an account?",
        answer: "It is free and needs no account or sign-up. The site is supported by advertising.",
      },
      {
        question: "Can I search by real name, email address or phone number?",
        answer:
          "No. The search checks usernames only: 3 to 30 letters, numbers, underscores or hyphens, starting and ending with a letter or number. Google web results for the same handle appear next to the platform checks.",
      },
      {
        question: "Does a found profile prove who owns it?",
        answer:
          "No. A found result is a lead to a public profile, not proof of ownership, and a matching username alone does not identify a person. A not-found result does not guarantee that the name is free to register either. Open the original platform and compare public details before drawing conclusions.",
      },
      {
        question: "What happens to the usernames I search?",
        answer:
          "A username you search is sent to the providers needed to answer it: the platform-check provider and Google search. Results may be cached briefly in your own browser. There are no user accounts, so searches are not saved to a profile. AI analysis is optional; the context you submit to it is processed by an external AI provider. The privacy policy has the details.",
      },
    ],
  },
  zh: {
    title: "常见问题",
    entries: [
      {
        question: "What is my Name 是什么？",
        answer:
          "What is my Name（whatismyname.org）是一个免费的用户名搜索工具。输入一次用户名，即可查看它在 1,400+ 个网站和应用中是否存在，同时显示该用户名的 Google 网页结果，并可选用 AI 分析。本站是独立服务，与所检查的平台没有关联。",
      },
      {
        question: "如何查看一个用户名在哪些网站上被使用？",
        answer:
          "在搜索框中输入用户名（不要带 @ 符号或主页链接），然后开始搜索。每个网站返回后，结果会逐一显示。你可以按分类或状态筛选结果，并打开原始主页确认是否匹配。",
      },
      {
        question: "一次搜索需要多长时间？",
        answer:
          "最初的结果几秒内就会出现。每个网站都要单独检查，因此完整检查全部 1,400+ 个网站通常需要几分钟。搜索进行中也可以查看已有结果。",
      },
      {
        question: "是否免费？需要注册账号吗？",
        answer: "完全免费，无需账号或注册。本站由广告支持。",
      },
      {
        question: "可以按真实姓名、邮箱地址或手机号搜索吗？",
        answer:
          "不可以。本站只检查用户名：3 到 30 个字母、数字、下划线或连字符，且须以字母或数字开头和结尾。同一用户名的 Google 网页结果会显示在平台检查结果旁边。",
      },
      {
        question: "找到的主页能证明账号归谁所有吗？",
        answer:
          "不能。找到的结果只是指向公开主页的线索，并不能证明所有权；仅凭相同的用户名也无法确定某个人的身份。未找到的结果同样不能保证该用户名可以注册。下结论之前，请打开原始平台并比对公开信息。",
      },
      {
        question: "我搜索的用户名会被如何处理？",
        answer:
          "你搜索的用户名会发送给回答查询所需的服务商：平台检查服务商和 Google 搜索。结果可能会在你自己的浏览器中短暂缓存。本站没有用户账号，因此搜索不会保存到任何个人资料中。AI 分析是可选功能，你提交给它的内容会由外部 AI 服务商处理。详情请参阅隐私政策。",
      },
    ],
  },
  es: {
    title: "Preguntas frecuentes",
    entries: [
      {
        question: "¿Qué es What is my Name?",
        answer:
          "What is my Name (whatismyname.org) es un buscador gratuito de nombres de usuario. Escribe un nombre una sola vez y comprueba en cuáles de más de 1.400 sitios web y aplicaciones existe; además muestra resultados web de Google para ese nombre y ofrece un análisis opcional con IA. Es un servicio independiente, sin relación con las plataformas que comprueba.",
      },
      {
        question: "¿Cómo compruebo dónde se usa un nombre de usuario?",
        answer:
          "Escribe el nombre de usuario en el cuadro de búsqueda sin la @ ni la URL de un perfil e inicia la búsqueda. Los resultados aparecen sitio por sitio a medida que cada uno responde. Fíltralos por categoría o estado y abre el perfil original para confirmar una coincidencia.",
      },
      {
        question: "¿Cuánto tarda una búsqueda?",
        answer:
          "Los primeros resultados llegan en segundos. Cada sitio se comprueba por separado, así que revisar los más de 1.400 sitios suele llevar unos minutos. Puedes revisar los resultados mientras la búsqueda sigue en curso.",
      },
      {
        question: "¿Es gratis? ¿Necesito una cuenta?",
        answer: "Es gratis y no requiere cuenta ni registro. El sitio se financia con publicidad.",
      },
      {
        question: "¿Puedo buscar por nombre real, correo electrónico o número de teléfono?",
        answer:
          "No. La búsqueda solo comprueba nombres de usuario: de 3 a 30 letras, números, guiones bajos o guiones, que empiecen y terminen con una letra o un número. Los resultados web de Google para el mismo nombre aparecen junto a las comprobaciones de plataformas.",
      },
      {
        question: "¿Un perfil encontrado demuestra quién es su dueño?",
        answer:
          "No. Un resultado encontrado es una pista hacia un perfil público, no una prueba de propiedad, y un nombre de usuario coincidente por sí solo no identifica a una persona. Un resultado no encontrado tampoco garantiza que el nombre esté libre para registrarse. Abre la plataforma original y compara los datos públicos antes de sacar conclusiones.",
      },
      {
        question: "¿Qué pasa con los nombres de usuario que busco?",
        answer:
          "El nombre que buscas se envía a los proveedores necesarios para responder: el proveedor de comprobación de plataformas y la búsqueda de Google. Los resultados pueden guardarse brevemente en caché en tu propio navegador. No hay cuentas de usuario, así que las búsquedas no se guardan en ningún perfil. El análisis con IA es opcional; el contexto que le envíes lo procesa un proveedor externo de IA. La política de privacidad tiene los detalles.",
      },
    ],
  },
  ja: {
    title: "よくある質問",
    entries: [
      {
        question: "What is my Name とは何ですか？",
        answer:
          "What is my Name（whatismyname.org）は無料のユーザー名検索サービスです。ユーザー名を一度入力するだけで、1,400+ のウェブサイトやアプリのどこにそのユーザー名が存在するかを確認し、そのユーザー名の Google ウェブ検索結果も表示します。AI 分析も任意で利用できます。独立したサービスであり、確認対象のプラットフォームとは提携していません。",
      },
      {
        question: "ユーザー名がどこで使われているかを調べるには？",
        answer:
          "@ 記号やプロフィール URL を付けずにユーザー名を検索ボックスに入力し、検索を開始します。各サイトの応答に合わせて結果が順に表示されます。カテゴリやステータスで絞り込み、元のプロフィールを開いて一致を確認してください。",
      },
      {
        question: "検索にはどのくらい時間がかかりますか？",
        answer:
          "最初の結果は数秒で表示されます。サイトごとに個別に確認するため、1,400+ のサイトすべてを確認するには通常数分かかります。検索の実行中も結果を確認できます。",
      },
      {
        question: "無料ですか？アカウントは必要ですか？",
        answer: "無料で、アカウント登録は不要です。このサイトは広告収入で運営されています。",
      },
      {
        question: "本名、メールアドレス、電話番号で検索できますか？",
        answer:
          "できません。検索できるのはユーザー名のみで、3〜30 文字の英字、数字、アンダースコア、ハイフンからなり、先頭と末尾は英字または数字である必要があります。同じユーザー名の Google ウェブ検索結果がプラットフォームの確認結果と並んで表示されます。",
      },
      {
        question: "見つかったプロフィールは所有者の証明になりますか？",
        answer:
          "なりません。見つかった結果は公開プロフィールへの手がかりであって、所有者の証明ではありません。ユーザー名が一致するだけでは個人を特定できません。また、見つからなかった結果も、そのユーザー名が登録可能であることを保証するものではありません。結論を出す前に、元のプラットフォームを開いて公開情報を比較してください。",
      },
      {
        question: "検索したユーザー名はどう扱われますか？",
        answer:
          "検索したユーザー名は、回答に必要な提供元（プラットフォーム確認の提供元と Google 検索）に送信されます。結果はお使いのブラウザに短時間キャッシュされることがあります。ユーザーアカウントがないため、検索がプロフィールに保存されることはありません。AI 分析は任意で、送信した内容は外部の AI 提供元によって処理されます。詳しくはプライバシーポリシーをご覧ください。",
      },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    entries: [
      {
        question: "Qu’est-ce que What is my Name ?",
        answer:
          "What is my Name (whatismyname.org) est un outil gratuit de recherche de noms d’utilisateur. Saisissez un pseudo une seule fois : il vérifie sur lesquels de plus de 1 400 sites et applications ce nom d’utilisateur existe, affiche les résultats web de Google pour ce pseudo et propose une analyse IA facultative. C’est un service indépendant, sans lien avec les plateformes qu’il vérifie.",
      },
      {
        question: "Comment vérifier où un nom d’utilisateur est utilisé ?",
        answer:
          "Saisissez le nom d’utilisateur dans le champ de recherche, sans le signe @ ni l’URL d’un profil, puis lancez la recherche. Les résultats s’affichent site par site, à mesure que chacun répond. Filtrez-les par catégorie ou par statut, puis ouvrez le profil d’origine pour confirmer une correspondance.",
      },
      {
        question: "Combien de temps dure une recherche ?",
        answer:
          "Les premiers résultats arrivent en quelques secondes. Chaque site est vérifié séparément : un passage complet sur plus de 1 400 sites prend donc généralement quelques minutes. Vous pouvez consulter les résultats pendant que la recherche se poursuit.",
      },
      {
        question: "Est-ce gratuit ? Faut-il un compte ?",
        answer: "C’est gratuit, sans compte ni inscription. Le site est financé par la publicité.",
      },
      {
        question: "Puis-je rechercher un nom réel, une adresse e-mail ou un numéro de téléphone ?",
        answer:
          "Non. La recherche ne vérifie que des noms d’utilisateur : de 3 à 30 lettres, chiffres, traits de soulignement ou tirets, commençant et finissant par une lettre ou un chiffre. Les résultats web de Google pour le même pseudo s’affichent à côté des vérifications de plateformes.",
      },
      {
        question: "Un profil trouvé prouve-t-il qui en est le propriétaire ?",
        answer:
          "Non. Un résultat trouvé est une piste vers un profil public, pas une preuve de propriété, et un nom d’utilisateur identique ne suffit pas à identifier une personne. Un résultat non trouvé ne garantit pas non plus que le nom soit libre à l’inscription. Ouvrez la plateforme d’origine et comparez les informations publiques avant de tirer des conclusions.",
      },
      {
        question: "Que deviennent les noms d’utilisateur que je recherche ?",
        answer:
          "Le nom recherché est envoyé aux fournisseurs nécessaires pour répondre : le fournisseur de vérification des plateformes et la recherche Google. Les résultats peuvent être brièvement mis en cache dans votre propre navigateur. Il n’y a pas de comptes utilisateur : les recherches ne sont donc enregistrées dans aucun profil. L’analyse IA est facultative ; le contexte que vous lui soumettez est traité par un fournisseur d’IA externe. La politique de confidentialité donne tous les détails.",
      },
    ],
  },
  ko: {
    title: "자주 묻는 질문",
    entries: [
      {
        question: "What is my Name은 무엇인가요?",
        answer:
          "What is my Name(whatismyname.org)은 무료 사용자명 검색 서비스입니다. 사용자명을 한 번 입력하면 1,400+ 웹사이트와 앱 중 어디에 그 사용자명이 존재하는지 확인하고, 해당 사용자명의 Google 웹 검색 결과도 보여 주며, 선택적으로 AI 분석을 제공합니다. 확인 대상 플랫폼과 제휴하지 않은 독립 서비스입니다.",
      },
      {
        question: "사용자명이 어디에서 사용되는지 어떻게 확인하나요?",
        answer:
          "@ 기호나 프로필 URL 없이 사용자명을 검색창에 입력하고 검색을 시작하세요. 각 사이트가 응답하는 대로 결과가 하나씩 표시됩니다. 카테고리나 상태로 결과를 필터링하고, 원래 프로필을 열어 일치 여부를 확인하세요.",
      },
      {
        question: "검색에는 시간이 얼마나 걸리나요?",
        answer:
          "첫 결과는 몇 초 안에 나타납니다. 사이트마다 따로 확인하므로 1,400+ 사이트 전체를 확인하려면 보통 몇 분이 걸립니다. 검색이 진행되는 동안에도 결과를 확인할 수 있습니다.",
      },
      {
        question: "무료인가요? 계정이 필요한가요?",
        answer: "무료이며 계정이나 회원가입이 필요 없습니다. 이 사이트는 광고로 운영됩니다.",
      },
      {
        question: "실명, 이메일 주소, 전화번호로 검색할 수 있나요?",
        answer:
          "아니요. 사용자명만 검색할 수 있습니다. 사용자명은 영문자, 숫자, 밑줄, 하이픈으로 이루어진 3~30자이며 영문자나 숫자로 시작하고 끝나야 합니다. 같은 사용자명의 Google 웹 검색 결과가 플랫폼 확인 결과 옆에 표시됩니다.",
      },
      {
        question: "찾은 프로필이 소유자를 증명하나요?",
        answer:
          "아니요. 찾은 결과는 공개 프로필로 가는 단서일 뿐 소유권의 증거가 아니며, 사용자명이 같다는 것만으로는 사람을 특정할 수 없습니다. 찾지 못한 결과 역시 그 이름을 등록할 수 있다는 보장이 아닙니다. 결론을 내리기 전에 원래 플랫폼을 열어 공개 정보를 비교하세요.",
      },
      {
        question: "검색한 사용자명은 어떻게 처리되나요?",
        answer:
          "검색한 사용자명은 답을 얻는 데 필요한 제공업체, 즉 플랫폼 확인 제공업체와 Google 검색으로 전송됩니다. 결과는 사용자의 브라우저에 잠시 캐시될 수 있습니다. 사용자 계정이 없으므로 검색이 프로필에 저장되지 않습니다. AI 분석은 선택 사항이며, 제출한 내용은 외부 AI 제공업체가 처리합니다. 자세한 내용은 개인정보 보호정책을 참고하세요.",
      },
    ],
  },
  de: {
    title: "Häufige Fragen",
    entries: [
      {
        question: "Was ist What is my Name?",
        answer:
          "What is my Name (whatismyname.org) ist eine kostenlose Benutzernamen-Suche. Du gibst einen Namen einmal ein und siehst, auf welchen von über 1.400 Websites und Apps dieser Benutzername existiert. Dazu kommen Google-Webergebnisse zum Namen und eine optionale KI-Analyse. Der Dienst ist unabhängig und steht in keiner Verbindung zu den geprüften Plattformen.",
      },
      {
        question: "Wie prüfe ich, wo ein Benutzername verwendet wird?",
        answer:
          "Gib den Benutzernamen ohne @-Zeichen und ohne Profil-URL in das Suchfeld ein und starte die Suche. Die Ergebnisse erscheinen Website für Website, sobald jede antwortet. Filtere sie nach Kategorie oder Status und öffne das Originalprofil, um einen Treffer zu bestätigen.",
      },
      {
        question: "Wie lange dauert eine Suche?",
        answer:
          "Die ersten Ergebnisse kommen innerhalb von Sekunden. Jede Website wird einzeln geprüft, daher dauert ein vollständiger Durchlauf über alle mehr als 1.400 Websites meist einige Minuten. Du kannst die Ergebnisse schon ansehen, während die Suche noch läuft.",
      },
      {
        question: "Ist der Dienst kostenlos, und brauche ich ein Konto?",
        answer: "Er ist kostenlos und braucht weder Konto noch Anmeldung. Die Website finanziert sich über Werbung.",
      },
      {
        question: "Kann ich nach echtem Namen, E-Mail-Adresse oder Telefonnummer suchen?",
        answer:
          "Nein. Die Suche prüft nur Benutzernamen: 3 bis 30 Buchstaben, Ziffern, Unterstriche oder Bindestriche, die mit einem Buchstaben oder einer Ziffer beginnen und enden. Google-Webergebnisse zum selben Namen erscheinen neben den Plattform-Prüfungen.",
      },
      {
        question: "Beweist ein gefundenes Profil, wem es gehört?",
        answer:
          "Nein. Ein Treffer ist ein Hinweis auf ein öffentliches Profil, kein Nachweis der Inhaberschaft, und ein übereinstimmender Benutzername allein identifiziert keine Person. Ein Nicht-gefunden-Ergebnis garantiert auch nicht, dass der Name frei zur Registrierung ist. Öffne die Originalplattform und vergleiche öffentliche Angaben, bevor du Schlüsse ziehst.",
      },
      {
        question: "Was passiert mit den Benutzernamen, die ich suche?",
        answer:
          "Ein gesuchter Benutzername wird an die Anbieter gesendet, die für die Antwort nötig sind: den Anbieter der Plattform-Prüfung und die Google-Suche. Ergebnisse können kurz in deinem eigenen Browser zwischengespeichert werden. Es gibt keine Benutzerkonten, daher werden Suchen in keinem Profil gespeichert. Die KI-Analyse ist optional; der Kontext, den du dafür übermittelst, wird von einem externen KI-Anbieter verarbeitet. Details stehen in der Datenschutzrichtlinie.",
      },
    ],
  },
  pt: {
    title: "Perguntas frequentes",
    entries: [
      {
        question: "O que é o What is my Name?",
        answer:
          "O What is my Name (whatismyname.org) é uma busca gratuita de nomes de usuário. Digite um nome uma vez e veja em quais de mais de 1.400 sites e aplicativos esse nome de usuário existe, com resultados da web do Google para ele e uma análise opcional com IA. É um serviço independente, sem vínculo com as plataformas que verifica.",
      },
      {
        question: "Como verifico onde um nome de usuário é usado?",
        answer:
          "Digite o nome de usuário na caixa de busca, sem o @ e sem a URL de um perfil, e inicie a busca. Os resultados aparecem site a site, conforme cada um responde. Filtre-os por categoria ou status e abra o perfil original para confirmar uma correspondência.",
      },
      {
        question: "Quanto tempo leva uma busca?",
        answer:
          "Os primeiros resultados chegam em segundos. Cada site é verificado separadamente, então uma verificação completa dos mais de 1.400 sites costuma levar alguns minutos. Você pode ver os resultados enquanto a busca ainda está em andamento.",
      },
      {
        question: "É gratuito? Preciso de uma conta?",
        answer: "É gratuito e não exige conta nem cadastro. O site é mantido por publicidade.",
      },
      {
        question: "Posso buscar por nome real, e-mail ou número de telefone?",
        answer:
          "Não. A busca verifica apenas nomes de usuário: de 3 a 30 letras, números, sublinhados ou hifens, começando e terminando com uma letra ou um número. Os resultados da web do Google para o mesmo nome aparecem ao lado das verificações de plataformas.",
      },
      {
        question: "Um perfil encontrado prova quem é o dono?",
        answer:
          "Não. Um resultado encontrado é uma pista para um perfil público, não uma prova de propriedade, e um nome de usuário igual, sozinho, não identifica uma pessoa. Um resultado não encontrado também não garante que o nome esteja livre para cadastro. Abra a plataforma original e compare os dados públicos antes de tirar conclusões.",
      },
      {
        question: "O que acontece com os nomes de usuário que eu busco?",
        answer:
          "O nome buscado é enviado aos provedores necessários para responder: o provedor de verificação de plataformas e a busca do Google. Os resultados podem ficar em cache por pouco tempo no seu próprio navegador. Não há contas de usuário, então as buscas não são salvas em nenhum perfil. A análise com IA é opcional; o contexto que você envia a ela é processado por um provedor externo de IA. A política de privacidade traz os detalhes.",
      },
    ],
  },
  ru: {
    title: "Частые вопросы",
    entries: [
      {
        question: "Что такое What is my Name?",
        answer:
          "What is my Name (whatismyname.org) — бесплатный поиск по имени пользователя. Введите имя один раз, и сервис проверит, на каких из более чем 1 400 сайтов и приложений оно существует, покажет результаты веб-поиска Google по этому имени и по желанию добавит анализ с помощью ИИ. Это независимый сервис, не связанный с проверяемыми платформами.",
      },
      {
        question: "Как проверить, где используется имя пользователя?",
        answer:
          "Введите имя пользователя в поле поиска без символа @ и без ссылки на профиль и запустите поиск. Результаты появляются по мере ответа каждого сайта. Отфильтруйте их по категории или статусу и откройте исходный профиль, чтобы подтвердить совпадение.",
      },
      {
        question: "Сколько длится поиск?",
        answer:
          "Первые результаты приходят за несколько секунд. Каждый сайт проверяется отдельно, поэтому полная проверка более чем 1 400 сайтов обычно занимает несколько минут. Смотреть результаты можно, пока поиск ещё идёт.",
      },
      {
        question: "Это бесплатно? Нужна ли учётная запись?",
        answer: "Сервис бесплатный, учётная запись и регистрация не нужны. Сайт существует за счёт рекламы.",
      },
      {
        question: "Можно ли искать по настоящему имени, адресу электронной почты или номеру телефона?",
        answer:
          "Нет. Поиск проверяет только имена пользователей: от 3 до 30 латинских букв, цифр, знаков подчёркивания или дефисов; имя должно начинаться и заканчиваться буквой или цифрой. Результаты веб-поиска Google по тому же имени показываются рядом с проверками платформ.",
      },
      {
        question: "Доказывает ли найденный профиль, кому он принадлежит?",
        answer:
          "Нет. Найденный результат — это зацепка, ведущая к публичному профилю, а не доказательство владения; одно совпадение имени пользователя не позволяет установить личность. Результат «не найдено» тоже не гарантирует, что имя свободно для регистрации. Прежде чем делать выводы, откройте исходную платформу и сравните общедоступные данные.",
      },
      {
        question: "Что происходит с именами пользователей, которые я ищу?",
        answer:
          "Имя, которое вы ищете, отправляется поставщикам, необходимым для ответа: поставщику проверки платформ и поиску Google. Результаты могут ненадолго кешироваться в вашем собственном браузере. Учётных записей пользователей нет, поэтому поиски не сохраняются ни в каком профиле. Анализ с помощью ИИ необязателен; контекст, который вы ему передаёте, обрабатывает внешний поставщик ИИ. Подробности — в политике конфиденциальности.",
      },
    ],
  },
};

export function getHomeFaq(locale: string): FaqCopy {
  return HOME_FAQ[isSupportedLocale(locale) ? locale : defaultLocale];
}
