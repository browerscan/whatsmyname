import { defaultLocale, isSupportedLocale, type AppLocale } from "@/i18n/request";

export interface LegalSectionItem {
  href?: string;
  label?: string;
  text: string;
}

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: LegalSectionItem[];
}

export interface LegalDocument {
  title: string;
  lastUpdatedLabel: string;
  backToHome: string;
  sections: LegalSection[];
}

function resolveLocale(locale: string): AppLocale {
  return isSupportedLocale(locale) ? locale : defaultLocale;
}

const PRIVACY_DOCS: Record<AppLocale, LegalDocument> = {
  en: {
    title: "Privacy Policy",
    lastUpdatedLabel: "Last updated: December 14, 2024",
    backToHome: "Back to Home",
    sections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "whatismyname provides username search, analysis, and discovery tools. This Privacy Policy explains what information may be processed when you use the service, why it may be processed, and the general safeguards we apply.",
        ],
      },
      {
        title: "2. Information You Provide",
        items: [
          { label: "Search queries", text: "usernames or related terms you enter for lookups across platforms." },
          { label: "AI prompts", text: "questions or instructions you submit when requesting AI-assisted analysis." },
          { label: "Contact messages", text: "information you choose to include when contacting us about privacy or support matters." },
        ],
      },
      {
        title: "3. Automatically Collected Information",
        items: [
          { label: "Usage data", text: "pages viewed, features used, referring pages, and approximate timestamps." },
          { label: "Device and browser data", text: "browser type, device type, operating system, language settings, and similar diagnostics." },
          { label: "Network data", text: "IP address and related signals used for security, abuse prevention, and performance operations." },
          { label: "Essential preferences", text: "settings needed to remember core site behavior and consent-related choices where applicable." },
        ],
      },
      {
        title: "4. How We Use Information",
        items: [
          { text: "Operate username search, discovery, and analysis features." },
          { text: "Respond to searches, AI requests, and support inquiries." },
          { text: "Protect the service through fraud prevention, rate limiting, debugging, and security monitoring." },
          { text: "Measure usage trends so we can improve reliability, coverage, and user experience." },
          { text: "Meet legal, compliance, and operational obligations where required." },
        ],
      },
      {
        title: "5. Third-Party Services",
        paragraphs: [
          "The service may rely on third-party providers such as username search data sources, Google Custom Search, AI analysis providers, and hosting or CDN infrastructure. Those providers may process information under their own terms and privacy notices.",
        ],
      },
      {
        title: "6. Data Retention",
        items: [
          { label: "Search-related cache", text: "temporary caching may be used for performance and availability and is generally short-lived." },
          { label: "AI request context", text: "conversation context may be processed transiently to provide a response and is not intended for long-term storage in this product." },
          { label: "Operational logs", text: "security and service logs may be retained for a limited period to investigate abuse, diagnose issues, and maintain stability." },
        ],
      },
      {
        title: "7. Security",
        paragraphs: [
          "We use reasonable technical and organizational measures, such as HTTPS, rate limiting, infrastructure protections, and routine maintenance practices. No internet service can guarantee absolute security, but we work to reduce unnecessary exposure and operational risk.",
        ],
      },
      {
        title: "8. Your Rights and Choices",
        items: [
          { text: "You may limit the personal information you submit by avoiding sensitive usernames, prompts, or messages." },
          { text: "You may control optional technologies or consent settings where such tools are made available." },
          { text: "Where applicable law provides rights of access, correction, deletion, portability, restriction, or objection, you may contact us to make a request." },
        ],
      },
      {
        title: "9. Children's Privacy",
        paragraphs: [
          "The service is not directed to children under 13, and we do not knowingly seek to collect personal information from children under 13 through these pages. If you believe a child has submitted personal information, please contact us so we can review the issue.",
        ],
      },
      {
        title: "10. Regional Privacy Notices",
        paragraphs: [
          "Depending on where you live, local law may provide additional privacy rights. For example, users in the EEA, UK, or similar jurisdictions may have rights related to access, correction, deletion, portability, restriction, objection, or complaints to a supervisory authority. California residents may have rights to know, correct, delete, and limit certain data uses or disclosures where applicable.",
          "Availability and scope of any right depend on the law that applies, the nature of the information involved, and our role in processing it.",
        ],
      },
      {
        title: "11. Changes to This Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time. When we do, we may revise the content on this page and update the last-updated date shown above.",
        ],
      },
      {
        title: "12. Contact",
        paragraphs: [
          "For privacy questions or requests, you may contact us using the details below.",
        ],
        items: [
          { label: "Email", text: "privacy@whatismyname.org" },
          { label: "Website", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  zh: {
    title: "隐私政策",
    lastUpdatedLabel: "最后更新：2024 年 12 月 14 日",
    backToHome: "返回首页",
    sections: [
      {
        title: "1. 简介",
        paragraphs: [
          "whatismyname 提供用户名搜索、分析与发现工具。本隐私政策说明你在使用服务时哪些信息可能会被处理、处理原因，以及我们通常采取的保护措施。",
        ],
      },
      {
        title: "2. 你主动提供的信息",
        items: [
          { label: "搜索内容", text: "你为跨平台查询而输入的用户名或相关关键词。" },
          { label: "AI 提问", text: "你在请求 AI 辅助分析时提交的问题或指令。" },
          { label: "联系信息", text: "你在就隐私或支持问题联系我们时自行提供的内容。" },
        ],
      },
      {
        title: "3. 自动收集的信息",
        items: [
          { label: "使用数据", text: "浏览页面、使用功能、来源页面以及大致时间记录。" },
          { label: "设备与浏览器数据", text: "浏览器类型、设备类型、操作系统、语言设置及类似诊断信息。" },
          { label: "网络数据", text: "用于安全、防滥用和性能运维的 IP 地址及相关信号。" },
          { label: "必要偏好设置", text: "在适用情况下，用于记住站点基础行为和同意选择的设置。" },
        ],
      },
      {
        title: "4. 我们如何使用信息",
        items: [
          { text: "运行用户名搜索、发现和分析功能。" },
          { text: "响应搜索请求、AI 请求以及支持咨询。" },
          { text: "通过防欺诈、限流、调试和安全监测保护服务。" },
          { text: "衡量使用趋势，以改进稳定性、覆盖范围和用户体验。" },
          { text: "在需要时履行法律、合规和运营义务。" },
        ],
      },
      {
        title: "5. 第三方服务",
        paragraphs: [
          "本服务可能依赖第三方提供商，例如用户名搜索数据源、Google Custom Search、AI 分析服务以及托管或 CDN 基础设施。这些提供商可能按照其自身条款和隐私说明处理信息。",
        ],
      },
      {
        title: "6. 数据保存期限",
        items: [
          { label: "搜索相关缓存", text: "为性能和可用性起见，系统可能使用临时缓存，通常保存时间较短。" },
          { label: "AI 请求上下文", text: "为生成回复，系统可能短暂处理对话上下文，但并非为本产品长期保存而设计。" },
          { label: "运行日志", text: "为调查滥用、诊断问题和保持稳定，安全与服务日志可能在有限期间内保留。" },
        ],
      },
      {
        title: "7. 安全",
        paragraphs: [
          "我们采用合理的技术和组织措施，例如 HTTPS、限流、基础设施防护和日常维护流程。任何互联网服务都无法保证绝对安全，但我们会尽力降低不必要的数据暴露和运营风险。",
        ],
      },
      {
        title: "8. 你的权利与选择",
        items: [
          { text: "你可以避免提交敏感用户名、提示词或留言，以减少个人信息暴露。" },
          { text: "在提供相关工具时，你可以管理可选技术设置或同意偏好。" },
          { text: "如果适用法律赋予访问、更正、删除、可携带、限制处理或反对处理等权利，你可以联系我们提出请求。" },
        ],
      },
      {
        title: "9. 未成年人隐私",
        paragraphs: [
          "本服务并非面向 13 岁以下儿童，我们也不会有意通过这些页面收集 13 岁以下儿童的个人信息。如果你认为有儿童提交了个人信息，请联系我们，以便我们进行核查。",
        ],
      },
      {
        title: "10. 地区性隐私说明",
        paragraphs: [
          "根据你所在地区的法律，你可能享有额外的隐私权利。例如，欧洲经济区、英国或类似司法辖区的用户，可能享有访问、更正、删除、可携带、限制处理、反对处理或向监管机构投诉的权利。加利福尼亚居民在适用情况下，也可能享有知情、更正、删除以及限制某些数据使用或披露的权利。",
          "任何权利的适用性和范围，取决于具体适用法律、所涉信息的性质以及我们在处理活动中的角色。",
        ],
      },
      {
        title: "11. 本政策的变更",
        paragraphs: [
          "我们可能会不时更新本隐私政策。更新时，我们可能会修改本页内容，并更新上方显示的最后更新时间。",
        ],
      },
      {
        title: "12. 联系方式",
        paragraphs: [
          "如有隐私相关问题或请求，你可以通过以下方式联系我们。",
        ],
        items: [
          { label: "电子邮箱", text: "privacy@whatismyname.org" },
          { label: "网站", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    lastUpdatedLabel: "Última actualización: 14 de diciembre de 2024",
    backToHome: "Volver al inicio",
    sections: [
      {
        title: "1. Introducción",
        paragraphs: [
          "whatismyname ofrece herramientas de búsqueda, análisis y descubrimiento de nombres de usuario. Esta Política de privacidad explica qué información puede procesarse cuando utilizas el servicio, por qué puede procesarse y qué medidas generales aplicamos para protegerla.",
        ],
      },
      {
        title: "2. Información que proporcionas",
        items: [
          { label: "Consultas de búsqueda", text: "nombres de usuario o términos relacionados que introduces para búsquedas entre plataformas." },
          { label: "Solicitudes a la IA", text: "preguntas o instrucciones que envías al pedir análisis asistido por IA." },
          { label: "Mensajes de contacto", text: "información que decides incluir cuando nos escribes por temas de privacidad o soporte." },
        ],
      },
      {
        title: "3. Información recopilada automáticamente",
        items: [
          { label: "Datos de uso", text: "páginas vistas, funciones utilizadas, páginas de procedencia y marcas de tiempo aproximadas." },
          { label: "Datos del dispositivo y del navegador", text: "tipo de navegador, tipo de dispositivo, sistema operativo, idioma y diagnósticos similares." },
          { label: "Datos de red", text: "dirección IP y señales relacionadas utilizadas para seguridad, prevención de abusos y operaciones de rendimiento." },
          { label: "Preferencias esenciales", text: "ajustes necesarios para recordar el funcionamiento básico del sitio y las elecciones de consentimiento cuando corresponda." },
        ],
      },
      {
        title: "4. Cómo usamos la información",
        items: [
          { text: "Operar funciones de búsqueda, descubrimiento y análisis de nombres de usuario." },
          { text: "Responder a búsquedas, solicitudes a la IA y consultas de soporte." },
          { text: "Proteger el servicio mediante prevención de fraude, limitación de uso, depuración y supervisión de seguridad." },
          { text: "Medir tendencias de uso para mejorar fiabilidad, cobertura y experiencia de usuario." },
          { text: "Cumplir obligaciones legales, operativas y de cumplimiento cuando sea necesario." },
        ],
      },
      {
        title: "5. Servicios de terceros",
        paragraphs: [
          "El servicio puede depender de terceros, como fuentes de datos para búsqueda de nombres de usuario, Google Custom Search, proveedores de análisis con IA e infraestructura de alojamiento o CDN. Esos proveedores pueden procesar información conforme a sus propios términos y avisos de privacidad.",
        ],
      },
      {
        title: "6. Conservación de datos",
        items: [
          { label: "Caché relacionada con búsquedas", text: "puede usarse almacenamiento temporal por motivos de rendimiento y disponibilidad, y normalmente dura poco tiempo." },
          { label: "Contexto de solicitudes a la IA", text: "el contexto conversacional puede procesarse de forma transitoria para generar una respuesta y no está pensado para almacenamiento prolongado en este producto." },
          { label: "Registros operativos", text: "los registros de seguridad y servicio pueden conservarse por un periodo limitado para investigar abusos, diagnosticar problemas y mantener la estabilidad." },
        ],
      },
      {
        title: "7. Seguridad",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas razonables, como HTTPS, limitación de velocidad, protecciones de infraestructura y prácticas de mantenimiento periódicas. Ningún servicio en internet puede garantizar seguridad absoluta, pero trabajamos para reducir la exposición innecesaria y el riesgo operativo.",
        ],
      },
      {
        title: "8. Tus derechos y opciones",
        items: [
          { text: "Puedes limitar la información personal que envías evitando nombres de usuario, instrucciones o mensajes sensibles." },
          { text: "Puedes gestionar tecnologías opcionales o preferencias de consentimiento cuando existan herramientas disponibles." },
          { text: "Cuando la ley aplicable reconozca derechos de acceso, rectificación, supresión, portabilidad, limitación u oposición, puedes contactarnos para ejercerlos." },
        ],
      },
      {
        title: "9. Privacidad de menores",
        paragraphs: [
          "El servicio no está dirigido a menores de 13 años y no buscamos recopilar conscientemente información personal de menores de 13 años mediante estas páginas. Si crees que un menor ha enviado información personal, contáctanos para revisarlo.",
        ],
      },
      {
        title: "10. Avisos regionales de privacidad",
        paragraphs: [
          "Según el lugar donde vivas, la ley local puede otorgarte derechos adicionales de privacidad. Por ejemplo, usuarios del EEE, Reino Unido u otras jurisdicciones similares pueden tener derechos de acceso, rectificación, supresión, portabilidad, limitación, oposición o reclamación ante una autoridad supervisora. Las personas residentes en California también pueden tener derechos a conocer, corregir, eliminar y limitar ciertos usos o divulgaciones de datos cuando corresponda.",
          "La disponibilidad y el alcance de cualquier derecho dependen de la ley aplicable, de la naturaleza de la información implicada y de nuestro papel en el tratamiento.",
        ],
      },
      {
        title: "11. Cambios en esta política",
        paragraphs: [
          "Podemos actualizar esta Política de privacidad ocasionalmente. Cuando lo hagamos, podremos revisar el contenido de esta página y la fecha de última actualización indicada arriba.",
        ],
      },
      {
        title: "12. Contacto",
        paragraphs: [
          "Si tienes preguntas o solicitudes relacionadas con privacidad, puedes escribirnos mediante los datos indicados abajo.",
        ],
        items: [
          { label: "Correo electrónico", text: "privacy@whatismyname.org" },
          { label: "Sitio web", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  ja: {
    title: "プライバシーポリシー",
    lastUpdatedLabel: "最終更新日：2024年12月14日",
    backToHome: "ホームに戻る",
    sections: [
      {
        title: "1. はじめに",
        paragraphs: [
          "whatismyname は、ユーザー名の検索、分析、発見のための機能を提供します。本プライバシーポリシーでは、サービス利用時にどのような情報が処理され得るか、その理由、および一般的な保護措置について説明します。",
        ],
      },
      {
        title: "2. お客様が提供する情報",
        items: [
          { label: "検索内容", text: "複数のプラットフォームで確認するために入力するユーザー名や関連語句。" },
          { label: "AI への依頼", text: "AI 補助分析を求める際に送信する質問や指示。" },
          { label: "連絡内容", text: "プライバシーやサポートについて当社へ連絡する際に任意で記載する情報。" },
        ],
      },
      {
        title: "3. 自動的に収集される情報",
        items: [
          { label: "利用データ", text: "閲覧ページ、利用機能、参照元ページ、おおよその日時情報。" },
          { label: "端末・ブラウザ情報", text: "ブラウザ種別、端末種別、OS、言語設定、その他類似の診断情報。" },
          { label: "ネットワーク情報", text: "セキュリティ、不正利用防止、性能運用のために用いる IP アドレスや関連シグナル。" },
          { label: "基本設定", text: "サイトの基本動作や、該当する場合の同意設定を記憶するために必要な設定情報。" },
        ],
      },
      {
        title: "4. 情報の利用目的",
        items: [
          { text: "ユーザー名検索、発見、分析機能を運用するため。" },
          { text: "検索、AI 依頼、サポートへの問い合わせに対応するため。" },
          { text: "不正対策、レート制御、デバッグ、セキュリティ監視を通じてサービスを保護するため。" },
          { text: "利用傾向を把握し、信頼性、対象範囲、利用体験を改善するため。" },
          { text: "必要に応じて法令上、運用上、コンプライアンス上の義務に対応するため。" },
        ],
      },
      {
        title: "5. 第三者サービス",
        paragraphs: [
          "当サービスは、ユーザー名検索データ提供元、Google Custom Search、AI 分析提供者、ホスティングまたは CDN 基盤などの第三者サービスに依存する場合があります。これらの提供者は、自身の利用条件やプライバシー通知に従って情報を処理することがあります。",
        ],
      },
      {
        title: "6. データ保持",
        items: [
          { label: "検索関連キャッシュ", text: "性能と可用性のため、一時的なキャッシュを利用する場合があり、通常は短期間のみ保持されます。" },
          { label: "AI 依頼の文脈", text: "回答生成のため会話文脈が一時的に処理されることがありますが、本製品での長期保存を意図するものではありません。" },
          { label: "運用ログ", text: "不正調査、障害診断、安定運用のため、セキュリティおよびサービスログを一定期間保持する場合があります。" },
        ],
      },
      {
        title: "7. セキュリティ",
        paragraphs: [
          "当社は HTTPS、レート制御、インフラ保護、定期的な保守など、合理的な技術的・組織的措置を講じます。インターネット上のサービスに絶対的な安全性はありませんが、不必要な情報露出と運用上のリスク低減に努めます。",
        ],
      },
      {
        title: "8. お客様の権利と選択肢",
        items: [
          { text: "機微なユーザー名、入力内容、メッセージを避けることで、送信する個人情報を抑えることができます。" },
          { text: "利用可能な場合、任意の技術設定や同意設定を管理できます。" },
          { text: "適用法によりアクセス、訂正、削除、データポータビリティ、処理制限、異議申立て等の権利が認められる場合、当社に請求できます。" },
        ],
      },
      {
        title: "9. 子どものプライバシー",
        paragraphs: [
          "当サービスは 13 歳未満の子どもを対象としておらず、これらのページを通じて 13 歳未満の子どもの個人情報を意図的に収集することはありません。子どもが個人情報を送信したと思われる場合は、ご連絡ください。確認のうえ対応します。",
        ],
      },
      {
        title: "10. 地域別プライバシー通知",
        paragraphs: [
          "居住地域によっては、現地法に基づき追加のプライバシー権が認められる場合があります。たとえば、EEA、英国、または類似の法域の利用者には、アクセス、訂正、削除、ポータビリティ、処理制限、異議申立て、監督機関への申立てなどの権利が認められることがあります。カリフォルニア州居住者には、適用範囲内で、知る権利、訂正、削除、特定のデータ利用または開示の制限に関する権利が認められる場合があります。",
          "各権利の有無と範囲は、適用法、対象情報の性質、および当社の処理上の立場によって異なります。",
        ],
      },
      {
        title: "11. 本ポリシーの変更",
        paragraphs: [
          "当社は本プライバシーポリシーを随時更新することがあります。更新時には、このページの内容および上記の最終更新日を変更する場合があります。",
        ],
      },
      {
        title: "12. お問い合わせ",
        paragraphs: [
          "プライバシーに関する質問や請求は、以下の連絡先までお寄せください。",
        ],
        items: [
          { label: "メール", text: "privacy@whatismyname.org" },
          { label: "ウェブサイト", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    lastUpdatedLabel: "Dernière mise à jour : 14 décembre 2024",
    backToHome: "Retour à l’accueil",
    sections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "whatismyname fournit des outils de recherche, d’analyse et de découverte de noms d’utilisateur. La présente politique de confidentialité explique quelles informations peuvent être traitées lorsque vous utilisez le service, pour quelles raisons, ainsi que les mesures générales de protection que nous appliquons.",
        ],
      },
      {
        title: "2. Informations que vous fournissez",
        items: [
          { label: "Requêtes de recherche", text: "noms d’utilisateur ou termes associés que vous saisissez pour des vérifications multi-plateformes." },
          { label: "Demandes à l’IA", text: "questions ou instructions que vous soumettez lorsque vous demandez une analyse assistée par IA." },
          { label: "Messages de contact", text: "informations que vous choisissez d’inclure lorsque vous nous contactez au sujet de la confidentialité ou de l’assistance." },
        ],
      },
      {
        title: "3. Informations collectées automatiquement",
        items: [
          { label: "Données d’usage", text: "pages consultées, fonctionnalités utilisées, pages de provenance et horodatages approximatifs." },
          { label: "Données liées à l’appareil et au navigateur", text: "type de navigateur, type d’appareil, système d’exploitation, langue et diagnostics similaires." },
          { label: "Données réseau", text: "adresse IP et signaux associés utilisés pour la sécurité, la prévention des abus et les opérations de performance." },
          { label: "Préférences essentielles", text: "réglages nécessaires pour mémoriser le fonctionnement de base du site et les choix de consentement lorsque cela s’applique." },
        ],
      },
      {
        title: "4. Utilisation des informations",
        items: [
          { text: "Exploiter les fonctionnalités de recherche, de découverte et d’analyse de noms d’utilisateur." },
          { text: "Répondre aux recherches, aux demandes à l’IA et aux sollicitations d’assistance." },
          { text: "Protéger le service au moyen de la prévention de la fraude, de la limitation de débit, du débogage et de la surveillance de sécurité." },
          { text: "Mesurer les tendances d’utilisation afin d’améliorer la fiabilité, la couverture et l’expérience utilisateur." },
          { text: "Respecter, lorsque nécessaire, les obligations légales, opérationnelles et de conformité." },
        ],
      },
      {
        title: "5. Services tiers",
        paragraphs: [
          "Le service peut dépendre de prestataires tiers tels que des sources de données de recherche de noms d’utilisateur, Google Custom Search, des fournisseurs d’analyse par IA et une infrastructure d’hébergement ou de diffusion de contenu. Ces prestataires peuvent traiter des informations selon leurs propres conditions et avis de confidentialité.",
        ],
      },
      {
        title: "6. Conservation des données",
        items: [
          { label: "Cache lié aux recherches", text: "un stockage temporaire peut être utilisé pour la performance et la disponibilité, et demeure en général de courte durée." },
          { label: "Contexte des demandes à l’IA", text: "le contexte conversationnel peut être traité de manière transitoire pour fournir une réponse et n’est pas destiné à un stockage prolongé dans ce produit." },
          { label: "Journaux opérationnels", text: "les journaux de sécurité et de service peuvent être conservés pendant une période limitée afin d’enquêter sur les abus, diagnostiquer les problèmes et maintenir la stabilité." },
        ],
      },
      {
        title: "7. Sécurité",
        paragraphs: [
          "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables, telles que HTTPS, la limitation de débit, des protections d’infrastructure et des pratiques de maintenance régulières. Aucun service en ligne ne peut garantir une sécurité absolue, mais nous nous efforçons de réduire l’exposition inutile et les risques opérationnels.",
        ],
      },
      {
        title: "8. Vos droits et vos choix",
        items: [
          { text: "Vous pouvez limiter les informations personnelles transmises en évitant les noms d’utilisateur, instructions ou messages sensibles." },
          { text: "Vous pouvez gérer les technologies facultatives ou les préférences de consentement lorsque des outils sont disponibles." },
          { text: "Lorsque le droit applicable prévoit des droits d’accès, de rectification, d’effacement, de portabilité, de limitation ou d’opposition, vous pouvez nous contacter pour en faire la demande." },
        ],
      },
      {
        title: "9. Vie privée des enfants",
        paragraphs: [
          "Le service n’est pas destiné aux enfants de moins de 13 ans et nous ne cherchons pas sciemment à collecter des informations personnelles concernant des enfants de moins de 13 ans via ces pages. Si vous pensez qu’un enfant a transmis de telles informations, contactez-nous afin que nous puissions examiner la situation.",
        ],
      },
      {
        title: "10. Informations régionales relatives à la confidentialité",
        paragraphs: [
          "Selon votre lieu de résidence, la loi locale peut vous accorder des droits supplémentaires en matière de confidentialité. Par exemple, les utilisateurs de l’EEE, du Royaume-Uni ou de juridictions similaires peuvent disposer de droits d’accès, de rectification, d’effacement, de portabilité, de limitation, d’opposition ou de réclamation auprès d’une autorité de contrôle. Les résidents de Californie peuvent également disposer, lorsque cela s’applique, de droits de savoir, corriger, supprimer et limiter certains usages ou divulgations de données.",
          "La disponibilité et l’étendue de chaque droit dépendent de la loi applicable, de la nature des informations concernées et de notre rôle dans leur traitement.",
        ],
      },
      {
        title: "11. Modifications de cette politique",
        paragraphs: [
          "Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre. Lorsque nous le faisons, nous pouvons réviser le contenu de cette page et modifier la date de dernière mise à jour affichée ci-dessus.",
        ],
      },
      {
        title: "12. Contact",
        paragraphs: [
          "Pour toute question ou demande liée à la confidentialité, vous pouvez nous contacter aux coordonnées ci-dessous.",
        ],
        items: [
          { label: "Adresse e-mail", text: "privacy@whatismyname.org" },
          { label: "Site web", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  ko: {
    title: "개인정보 처리방침",
    lastUpdatedLabel: "최종 업데이트: 2024년 12월 14일",
    backToHome: "홈으로 돌아가기",
    sections: [
      {
        title: "1. 소개",
        paragraphs: [
          "whatismyname는 사용자 이름 검색, 분석, 탐색 도구를 제공합니다. 이 개인정보 처리방침은 서비스 이용 시 어떤 정보가 처리될 수 있는지, 왜 처리되는지, 그리고 어떤 일반적인 보호 조치를 적용하는지 설명합니다.",
        ],
      },
      {
        title: "2. 사용자가 제공하는 정보",
        items: [
          { label: "검색 질의", text: "여러 플랫폼에서 조회하기 위해 입력하는 사용자 이름 또는 관련 용어." },
          { label: "AI 요청", text: "AI 보조 분석을 요청할 때 제출하는 질문이나 지시사항." },
          { label: "문의 메시지", text: "개인정보 또는 지원 관련 문의 시 사용자가 직접 포함하는 정보." },
        ],
      },
      {
        title: "3. 자동으로 수집되는 정보",
        items: [
          { label: "이용 데이터", text: "조회한 페이지, 사용한 기능, 유입 페이지, 대략적인 시간 정보." },
          { label: "기기 및 브라우저 데이터", text: "브라우저 유형, 기기 유형, 운영체제, 언어 설정 및 유사 진단 정보." },
          { label: "네트워크 데이터", text: "보안, 남용 방지, 성능 운영을 위해 사용하는 IP 주소와 관련 신호." },
          { label: "필수 설정", text: "사이트 기본 동작과 해당되는 경우 동의 선택을 기억하기 위한 설정 정보." },
        ],
      },
      {
        title: "4. 정보 사용 목적",
        items: [
          { text: "사용자 이름 검색, 탐색, 분석 기능을 운영하기 위해." },
          { text: "검색 요청, AI 요청, 지원 문의에 응답하기 위해." },
          { text: "사기 방지, 속도 제한, 디버깅, 보안 모니터링을 통해 서비스를 보호하기 위해." },
          { text: "이용 추세를 파악해 안정성, 범위, 사용자 경험을 개선하기 위해." },
          { text: "필요한 경우 법적, 운영상, 규정 준수 의무를 이행하기 위해." },
        ],
      },
      {
        title: "5. 제3자 서비스",
        paragraphs: [
          "서비스는 사용자 이름 검색 데이터 소스, Google Custom Search, AI 분석 제공업체, 호스팅 또는 콘텐츠 전송 인프라와 같은 제3자 제공업체에 의존할 수 있습니다. 이러한 제공업체는 자체 약관과 개인정보 안내에 따라 정보를 처리할 수 있습니다.",
        ],
      },
      {
        title: "6. 데이터 보관",
        items: [
          { label: "검색 관련 캐시", text: "성능과 가용성을 위해 임시 저장이 사용될 수 있으며 일반적으로 짧은 기간만 유지됩니다." },
          { label: "AI 요청 문맥", text: "응답 제공을 위해 대화 문맥이 일시적으로 처리될 수 있으나 이 제품에서 장기 저장을 목적으로 하지는 않습니다." },
          { label: "운영 로그", text: "남용 조사, 문제 진단, 안정성 유지를 위해 보안 및 서비스 로그가 제한된 기간 동안 보관될 수 있습니다." },
        ],
      },
      {
        title: "7. 보안",
        paragraphs: [
          "HTTPS, 속도 제한, 인프라 보호, 정기 유지관리와 같은 합리적인 기술적·조직적 조치를 적용합니다. 어떤 인터넷 서비스도 절대적인 보안을 보장할 수는 없지만, 불필요한 노출과 운영상 위험을 줄이기 위해 노력합니다.",
        ],
      },
      {
        title: "8. 이용자의 권리와 선택",
        items: [
          { text: "민감한 사용자 이름, 입력 내용, 메시지를 피함으로써 제출하는 개인정보를 줄일 수 있습니다." },
          { text: "관련 도구가 제공되는 경우 선택적 기술이나 동의 설정을 관리할 수 있습니다." },
          { text: "적용 법률이 접근, 정정, 삭제, 이동, 제한 또는 반대 권리를 부여하는 경우 요청을 위해 당사에 연락할 수 있습니다." },
        ],
      },
      {
        title: "9. 아동의 개인정보",
        paragraphs: [
          "서비스는 13세 미만 아동을 대상으로 하지 않으며, 이러한 페이지를 통해 13세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다. 아동이 개인정보를 제출했다고 생각되면 검토를 위해 연락해 주세요.",
        ],
      },
      {
        title: "10. 지역별 개인정보 안내",
        paragraphs: [
          "거주 지역에 따라 현지 법률이 추가적인 개인정보 권리를 부여할 수 있습니다. 예를 들어 EEA, 영국 또는 유사한 관할 지역의 이용자는 접근, 정정, 삭제, 이동, 처리 제한, 반대 또는 감독기관에 대한 불만 제기 권리를 가질 수 있습니다. 캘리포니아 거주자도 적용되는 범위에서 알 권리, 정정, 삭제, 특정 데이터 사용 또는 공개 제한 권리를 가질 수 있습니다.",
          "각 권리의 제공 여부와 범위는 적용 법률, 관련 정보의 성격, 그리고 당사의 처리 역할에 따라 달라집니다.",
        ],
      },
      {
        title: "11. 본 정책의 변경",
        paragraphs: [
          "당사는 이 개인정보 처리방침을 수시로 업데이트할 수 있습니다. 변경 시 이 페이지의 내용을 수정하고 상단의 최종 업데이트 날짜를 갱신할 수 있습니다.",
        ],
      },
      {
        title: "12. 연락처",
        paragraphs: [
          "개인정보 관련 질문이나 요청은 아래 연락처로 보내 주세요.",
        ],
        items: [
          { label: "이메일", text: "privacy@whatismyname.org" },
          { label: "웹사이트", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  de: {
    title: "Datenschutzerklärung",
    lastUpdatedLabel: "Zuletzt aktualisiert: 14. Dezember 2024",
    backToHome: "Zur Startseite",
    sections: [
      {
        title: "1. Einleitung",
        paragraphs: [
          "whatismyname stellt Werkzeuge zur Suche, Analyse und Entdeckung von Benutzernamen bereit. Diese Datenschutzerklärung erläutert, welche Informationen bei der Nutzung des Dienstes verarbeitet werden können, warum dies geschehen kann und welche allgemeinen Schutzmaßnahmen wir anwenden.",
        ],
      },
      {
        title: "2. Von dir bereitgestellte Informationen",
        items: [
          { label: "Suchanfragen", text: "Benutzernamen oder verwandte Begriffe, die du für plattformübergreifende Abfragen eingibst." },
          { label: "KI-Anfragen", text: "Fragen oder Anweisungen, die du bei einer KI-gestützten Analyse übermittelst." },
          { label: "Kontaktmitteilungen", text: "Informationen, die du freiwillig angibst, wenn du uns zu Datenschutz- oder Supportthemen kontaktierst." },
        ],
      },
      {
        title: "3. Automatisch erfasste Informationen",
        items: [
          { label: "Nutzungsdaten", text: "aufgerufene Seiten, verwendete Funktionen, verweisende Seiten und ungefähre Zeitangaben." },
          { label: "Geräte- und Browserdaten", text: "Browsertyp, Gerätetyp, Betriebssystem, Spracheinstellungen und ähnliche Diagnoseinformationen." },
          { label: "Netzwerkdaten", text: "IP-Adresse und zugehörige Signale für Sicherheit, Missbrauchsprävention und Leistungsbetrieb." },
          { label: "Wesentliche Einstellungen", text: "Angaben, die nötig sind, um das grundlegende Verhalten der Website und gegebenenfalls Einwilligungsentscheidungen zu speichern." },
        ],
      },
      {
        title: "4. Wie wir Informationen verwenden",
        items: [
          { text: "Betrieb von Funktionen zur Suche, Entdeckung und Analyse von Benutzernamen." },
          { text: "Beantwortung von Suchanfragen, KI-Anfragen und Supportanliegen." },
          { text: "Schutz des Dienstes durch Betrugsprävention, Ratenbegrenzung, Fehlersuche und Sicherheitsüberwachung." },
          { text: "Messung von Nutzungstrends, um Zuverlässigkeit, Abdeckung und Nutzererlebnis zu verbessern." },
          { text: "Erfüllung rechtlicher, betrieblicher und Compliance-bezogener Verpflichtungen, soweit erforderlich." },
        ],
      },
      {
        title: "5. Dienste Dritter",
        paragraphs: [
          "Der Dienst kann von Drittanbietern abhängen, etwa Datenquellen für die Benutzernamensuche, Google Custom Search, Anbietern für KI-Analysen sowie Hosting- oder CDN-Infrastruktur. Diese Anbieter können Informationen nach ihren eigenen Bedingungen und Datenschutzhinweisen verarbeiten.",
        ],
      },
      {
        title: "6. Speicherdauer",
        items: [
          { label: "Suchbezogener Cache", text: "zur Leistung und Verfügbarkeit kann eine vorübergehende Zwischenspeicherung eingesetzt werden, die in der Regel nur kurz besteht." },
          { label: "Kontext von KI-Anfragen", text: "Gesprächskontext kann vorübergehend verarbeitet werden, um eine Antwort zu liefern, ist jedoch nicht für eine langfristige Speicherung in diesem Produkt vorgesehen." },
          { label: "Betriebsprotokolle", text: "Sicherheits- und Servicelogs können für einen begrenzten Zeitraum gespeichert werden, um Missbrauch zu untersuchen, Probleme zu diagnostizieren und Stabilität zu erhalten." },
        ],
      },
      {
        title: "7. Sicherheit",
        paragraphs: [
          "Wir setzen angemessene technische und organisatorische Maßnahmen ein, darunter HTTPS, Ratenbegrenzung, Infrastrukturschutz und regelmäßige Wartungspraktiken. Kein Onlinedienst kann absolute Sicherheit garantieren, doch wir arbeiten daran, unnötige Offenlegung und betriebliche Risiken zu verringern.",
        ],
      },
      {
        title: "8. Deine Rechte und Wahlmöglichkeiten",
        items: [
          { text: "Du kannst die übermittelten personenbezogenen Daten begrenzen, indem du sensible Benutzernamen, Eingaben oder Nachrichten vermeidest." },
          { text: "Du kannst optionale Technologien oder Einwilligungseinstellungen verwalten, wenn entsprechende Werkzeuge bereitgestellt werden." },
          { text: "Soweit anwendbares Recht Rechte auf Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Einschränkung oder Widerspruch vorsieht, kannst du uns zur Ausübung dieser Rechte kontaktieren." },
        ],
      },
      {
        title: "9. Datenschutz von Kindern",
        paragraphs: [
          "Der Dienst richtet sich nicht an Kinder unter 13 Jahren, und wir versuchen nicht wissentlich, über diese Seiten personenbezogene Daten von Kindern unter 13 Jahren zu erfassen. Wenn du glaubst, dass ein Kind entsprechende Daten übermittelt hat, kontaktiere uns bitte, damit wir den Vorgang prüfen können.",
        ],
      },
      {
        title: "10. Regionale Datenschutzhinweise",
        paragraphs: [
          "Je nach Wohnort kann das örtliche Recht zusätzliche Datenschutzrechte vorsehen. Nutzer im EWR, im Vereinigten Königreich oder in vergleichbaren Rechtsordnungen können beispielsweise Rechte auf Auskunft, Berichtigung, Löschung, Übertragbarkeit, Einschränkung, Widerspruch oder Beschwerde bei einer Aufsichtsbehörde haben. Einwohner Kaliforniens können gegebenenfalls Rechte auf Auskunft, Berichtigung, Löschung und Begrenzung bestimmter Datenverwendungen oder Offenlegungen haben.",
          "Verfügbarkeit und Umfang eines Rechts hängen vom anwendbaren Recht, von der Art der betroffenen Informationen und von unserer Rolle bei deren Verarbeitung ab.",
        ],
      },
      {
        title: "11. Änderungen dieser Erklärung",
        paragraphs: [
          "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. In diesem Fall können wir den Inhalt dieser Seite und das oben angegebene Aktualisierungsdatum anpassen.",
        ],
      },
      {
        title: "12. Kontakt",
        paragraphs: [
          "Bei Fragen oder Anträgen zum Datenschutz kannst du uns unter den folgenden Angaben kontaktieren.",
        ],
        items: [
          { label: "E-Mail", text: "privacy@whatismyname.org" },
          { label: "Website", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  pt: {
    title: "Política de Privacidade",
    lastUpdatedLabel: "Última atualização: 14 de dezembro de 2024",
    backToHome: "Voltar para a página inicial",
    sections: [
      {
        title: "1. Introdução",
        paragraphs: [
          "whatismyname oferece ferramentas de busca, análise e descoberta de nomes de usuário. Esta Política de Privacidade explica quais informações podem ser processadas quando você utiliza o serviço, por que isso pode acontecer e quais medidas gerais de proteção aplicamos.",
        ],
      },
      {
        title: "2. Informações fornecidas por você",
        items: [
          { label: "Consultas de busca", text: "nomes de usuário ou termos relacionados inseridos para verificações em várias plataformas." },
          { label: "Solicitações à IA", text: "perguntas ou instruções enviadas ao solicitar análise assistida por IA." },
          { label: "Mensagens de contato", text: "informações que você decide incluir ao entrar em contato conosco sobre privacidade ou suporte." },
        ],
      },
      {
        title: "3. Informações coletadas automaticamente",
        items: [
          { label: "Dados de uso", text: "páginas visualizadas, recursos utilizados, páginas de referência e registros aproximados de horário." },
          { label: "Dados do dispositivo e do navegador", text: "tipo de navegador, tipo de dispositivo, sistema operacional, idioma e diagnósticos semelhantes." },
          { label: "Dados de rede", text: "endereço IP e sinais relacionados utilizados para segurança, prevenção de abusos e operações de desempenho." },
          { label: "Preferências essenciais", text: "configurações necessárias para lembrar o funcionamento básico do site e escolhas de consentimento quando aplicável." },
        ],
      },
      {
        title: "4. Como usamos as informações",
        items: [
          { text: "Operar recursos de busca, descoberta e análise de nomes de usuário." },
          { text: "Responder a buscas, solicitações à IA e pedidos de suporte." },
          { text: "Proteger o serviço por meio de prevenção a fraudes, limitação de taxa, depuração e monitoramento de segurança." },
          { text: "Medir tendências de uso para melhorar confiabilidade, cobertura e experiência do usuário." },
          { text: "Cumprir obrigações legais, operacionais e de conformidade quando necessário." },
        ],
      },
      {
        title: "5. Serviços de terceiros",
        paragraphs: [
          "O serviço pode depender de terceiros, como fontes de dados para busca de nomes de usuário, Google Custom Search, provedores de análise por IA e infraestrutura de hospedagem ou distribuição de conteúdo. Esses fornecedores podem processar informações segundo seus próprios termos e avisos de privacidade.",
        ],
      },
      {
        title: "6. Retenção de dados",
        items: [
          { label: "Cache relacionado à busca", text: "armazenamento temporário pode ser usado por motivos de desempenho e disponibilidade e normalmente dura pouco tempo." },
          { label: "Contexto das solicitações à IA", text: "o contexto conversacional pode ser processado temporariamente para gerar uma resposta e não foi concebido para armazenamento prolongado neste produto." },
          { label: "Registros operacionais", text: "logs de segurança e de serviço podem ser mantidos por período limitado para investigar abusos, diagnosticar problemas e manter a estabilidade." },
        ],
      },
      {
        title: "7. Segurança",
        paragraphs: [
          "Aplicamos medidas técnicas e organizacionais razoáveis, como HTTPS, limitação de taxa, proteções de infraestrutura e práticas regulares de manutenção. Nenhum serviço de internet pode garantir segurança absoluta, mas buscamos reduzir exposições desnecessárias e riscos operacionais.",
        ],
      },
      {
        title: "8. Seus direitos e escolhas",
        items: [
          { text: "Você pode limitar os dados pessoais enviados evitando nomes de usuário, instruções ou mensagens sensíveis." },
          { text: "Você pode gerenciar tecnologias opcionais ou preferências de consentimento quando houver ferramentas disponíveis." },
          { text: "Quando a lei aplicável conceder direitos de acesso, correção, exclusão, portabilidade, limitação ou oposição, você poderá nos contatar para exercê-los." },
        ],
      },
      {
        title: "9. Privacidade de crianças",
        paragraphs: [
          "O serviço não é direcionado a crianças menores de 13 anos, e não buscamos conscientemente coletar informações pessoais de crianças menores de 13 anos por meio destas páginas. Se você acreditar que uma criança enviou informações pessoais, entre em contato conosco para análise.",
        ],
      },
      {
        title: "10. Avisos regionais de privacidade",
        paragraphs: [
          "Dependendo de onde você mora, a lei local pode conceder direitos adicionais de privacidade. Por exemplo, usuários do EEE, do Reino Unido ou de jurisdições semelhantes podem ter direitos de acesso, correção, exclusão, portabilidade, limitação, oposição ou reclamação perante uma autoridade supervisora. Moradores da Califórnia também podem ter direitos de saber, corrigir, excluir e limitar certos usos ou divulgações de dados quando aplicável.",
          "A disponibilidade e o alcance de qualquer direito dependem da lei aplicável, da natureza das informações envolvidas e do nosso papel no tratamento.",
        ],
      },
      {
        title: "11. Alterações nesta política",
        paragraphs: [
          "Podemos atualizar esta Política de Privacidade periodicamente. Quando isso ocorrer, poderemos revisar o conteúdo desta página e a data de última atualização indicada acima.",
        ],
      },
      {
        title: "12. Contato",
        paragraphs: [
          "Se você tiver dúvidas ou solicitações relacionadas à privacidade, pode falar conosco pelos canais abaixo.",
        ],
        items: [
          { label: "E-mail", text: "privacy@whatismyname.org" },
          { label: "Site", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    lastUpdatedLabel: "Последнее обновление: 14 декабря 2024 г.",
    backToHome: "Вернуться на главную",
    sections: [
      {
        title: "1. Введение",
        paragraphs: [
          "whatismyname предоставляет инструменты для поиска, анализа и обнаружения имён пользователей. Эта политика конфиденциальности объясняет, какая информация может обрабатываться при использовании сервиса, зачем это может происходить и какие общие меры защиты мы применяем.",
        ],
      },
      {
        title: "2. Информация, которую вы предоставляете",
        items: [
          { label: "Поисковые запросы", text: "имена пользователей или связанные термины, которые вы вводите для проверки на разных платформах." },
          { label: "Запросы к ИИ", text: "вопросы или инструкции, которые вы отправляете при запросе анализа с помощью ИИ." },
          { label: "Сообщения для связи", text: "информация, которую вы сами решаете указать при обращении к нам по вопросам конфиденциальности или поддержки." },
        ],
      },
      {
        title: "3. Информация, собираемая автоматически",
        items: [
          { label: "Данные об использовании", text: "просмотренные страницы, использованные функции, страницы-источники и примерные отметки времени." },
          { label: "Данные об устройстве и браузере", text: "тип браузера, тип устройства, операционная система, язык и похожая диагностическая информация." },
          { label: "Сетевые данные", text: "IP-адрес и связанные сигналы, используемые для безопасности, предотвращения злоупотреблений и работы сервиса." },
          { label: "Основные настройки", text: "параметры, необходимые для сохранения базового поведения сайта и выбора согласия, если это применимо." },
        ],
      },
      {
        title: "4. Как мы используем информацию",
        items: [
          { text: "Обеспечиваем работу функций поиска, обнаружения и анализа имён пользователей." },
          { text: "Отвечаем на поисковые запросы, запросы к ИИ и обращения в поддержку." },
          { text: "Защищаем сервис с помощью предотвращения мошенничества, ограничения частоты запросов, отладки и мониторинга безопасности." },
          { text: "Анализируем тенденции использования, чтобы улучшать надёжность, охват и пользовательский опыт." },
          { text: "Исполняем юридические, операционные и комплаенс-обязанности, когда это требуется." },
        ],
      },
      {
        title: "5. Сторонние сервисы",
        paragraphs: [
          "Сервис может зависеть от сторонних поставщиков, включая источники данных для поиска имён пользователей, Google Custom Search, поставщиков ИИ-аналитики и инфраструктуру хостинга или доставки контента. Такие поставщики могут обрабатывать информацию в соответствии со своими собственными условиями и уведомлениями о конфиденциальности.",
        ],
      },
      {
        title: "6. Сроки хранения данных",
        items: [
          { label: "Кэш, связанный с поиском", text: "временное хранение может использоваться для производительности и доступности и обычно действует недолго." },
          { label: "Контекст запросов к ИИ", text: "контекст диалога может временно обрабатываться для формирования ответа и не предназначен для длительного хранения в данном продукте." },
          { label: "Операционные журналы", text: "журналы безопасности и сервиса могут храниться ограниченное время для расследования злоупотреблений, диагностики проблем и поддержания стабильности." },
        ],
      },
      {
        title: "7. Безопасность",
        paragraphs: [
          "Мы применяем разумные технические и организационные меры, включая HTTPS, ограничение частоты запросов, защиту инфраструктуры и регулярное обслуживание. Ни один интернет-сервис не может гарантировать абсолютную безопасность, однако мы стремимся снижать ненужное раскрытие данных и операционные риски.",
        ],
      },
      {
        title: "8. Ваши права и выбор",
        items: [
          { text: "Вы можете сократить объём передаваемых персональных данных, избегая чувствительных имён пользователей, инструкций или сообщений." },
          { text: "Вы можете управлять необязательными технологиями или настройками согласия, если соответствующие инструменты доступны." },
          { text: "Если применимое право предоставляет права на доступ, исправление, удаление, переносимость, ограничение обработки или возражение, вы можете связаться с нами для их реализации." },
        ],
      },
      {
        title: "9. Конфиденциальность детей",
        paragraphs: [
          "Сервис не предназначен для детей младше 13 лет, и мы не стремимся сознательно собирать персональную информацию детей младше 13 лет через эти страницы. Если вы считаете, что ребёнок отправил такую информацию, свяжитесь с нами, чтобы мы могли проверить ситуацию.",
        ],
      },
      {
        title: "10. Региональные уведомления о конфиденциальности",
        paragraphs: [
          "В зависимости от места проживания местное законодательство может предоставлять вам дополнительные права в области конфиденциальности. Например, пользователи из ЕЭЗ, Великобритании или сходных юрисдикций могут иметь права на доступ, исправление, удаление, переносимость, ограничение, возражение или подачу жалобы в надзорный орган. Жители Калифорнии также могут иметь права знать, исправлять, удалять и ограничивать некоторые виды использования или раскрытия данных, если это применимо.",
          "Наличие и объём любого права зависят от применимого законодательства, характера затронутой информации и нашей роли в её обработке.",
        ],
      },
      {
        title: "11. Изменения этой политики",
        paragraphs: [
          "Мы можем время от времени обновлять эту политику конфиденциальности. Когда это происходит, мы можем изменить содержание этой страницы и дату последнего обновления, указанную выше.",
        ],
      },
      {
        title: "12. Контакты",
        paragraphs: [
          "Если у вас есть вопросы или запросы, связанные с конфиденциальностью, вы можете связаться с нами по указанным ниже данным.",
        ],
        items: [
          { label: "Электронная почта", text: "privacy@whatismyname.org" },
          { label: "Сайт", text: "https://whatismyname.org" },
        ],
      },
    ],
  },
};

const TERMS_DOCS: Record<AppLocale, LegalDocument> = {
  en: {
    title: "Terms of Service",
    lastUpdatedLabel: "Last updated: December 14, 2024",
    backToHome: "Back to Home",
    sections: [
      {
        title: "1. Acceptance of Terms",
        paragraphs: [
          "By accessing or using whatismyname, you agree to these Terms of Service. If you do not agree, you should not use the service.",
        ],
      },
      {
        title: "2. Description of Service",
        paragraphs: [
          "whatismyname provides username search, related discovery tools, AI-assisted analysis, and supporting educational content. The interface and content may be available across 9 locales.",
        ],
      },
      {
        title: "3. Acceptable Use",
        items: [
          { text: "Do not use the service to harass, stalk, threaten, or harm others." },
          { text: "Do not violate applicable laws, third-party rights, or platform rules." },
          { text: "Do not upload malicious code, abusive automation, or illegal content." },
          { text: "Do not attempt to bypass protections, gain unauthorized access, or interfere with normal service operations." },
        ],
      },
      {
        title: "4. Fair Access and Rate Limits",
        paragraphs: [
          "We may apply technical controls such as rate limits, temporary blocks, or feature restrictions to preserve availability, protect infrastructure, and support fair access for users.",
        ],
      },
      {
        title: "5. Device and Browser Security",
        paragraphs: [
          "The service does not generally require a user account, but you remain responsible for the security of your own device, browser, network, and local environment when using the service.",
        ],
      },
      {
        title: "6. Intellectual Property",
        paragraphs: [
          "The service, its design, branding, software, and original content are protected by applicable intellectual property laws. Except as allowed by law, you may not copy, reproduce, republish, or create derivative works from protected material without authorization.",
        ],
      },
      {
        title: "7. Third-Party Data and Marks",
        paragraphs: [
          "Search results may contain references to third-party platforms, names, logos, or other materials. Those rights remain with their respective owners, and we do not claim ownership of third-party platform content.",
        ],
      },
      {
        title: "8. User-Submitted Content",
        paragraphs: [
          "Questions, prompts, and similar material you submit when using analysis features may be processed as needed to provide the service. You should submit only content you are allowed to share and use.",
        ],
      },
      {
        title: "9. Disclaimer of Warranties",
        paragraphs: [
          "The service is provided on an as-is and as-available basis. Search coverage, availability checks, educational materials, and AI-generated outputs may change over time, may be incomplete, and may not be error free.",
        ],
      },
      {
        title: "10. Limitation of Liability",
        paragraphs: [
          "To the maximum extent permitted by law, whatismyname will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service. Free features are offered without any guarantee of uninterrupted operation.",
        ],
      },
      {
        title: "11. Third-Party Services",
        paragraphs: [
          "The service may integrate with or depend on third-party providers such as search APIs, AI services, analytics tools, and hosting infrastructure. We are not responsible for the separate terms, privacy notices, availability, or behavior of those providers.",
        ],
      },
      {
        title: "12. Privacy and Data Protection",
        paragraphs: [
          "Your use of the service is also subject to our Privacy Policy, which explains how information may be processed in connection with the service.",
        ],
      },
      {
        title: "13. Modifications to the Service",
        paragraphs: [
          "We may modify, suspend, limit, or discontinue parts of the service at any time in order to maintain the service, adapt to provider changes, improve features, or address legal, operational, or security concerns.",
        ],
      },
      {
        title: "14. Changes to These Terms",
        paragraphs: [
          "We may update these Terms of Service from time to time. Continued use of the service after changes become effective means you accept the revised terms.",
        ],
      },
      {
        title: "15. Suspension and Termination",
        paragraphs: [
          "We may suspend or restrict access when reasonably necessary, including for suspected abuse, legal compliance, security risks, or violations of these terms.",
        ],
      },
      {
        title: "16. Governing Law and Disputes",
        paragraphs: [
          "These terms are governed by the laws of the jurisdiction in which whatismyname operates, without regard to conflict-of-law rules. Any dispute related to these terms or the service will be handled in the courts or forums that have proper jurisdiction under applicable law.",
        ],
      },
      {
        title: "17. Indemnification",
        paragraphs: [
          "To the extent permitted by law, you agree to indemnify and hold harmless whatismyname from claims, losses, liabilities, and expenses arising from your misuse of the service, your violation of these terms, or your violation of another person’s rights.",
        ],
      },
      {
        title: "18. Severability and Entire Agreement",
        paragraphs: [
          "If any provision of these terms is found unenforceable, the remaining provisions will remain in effect to the fullest extent permitted by law. These terms, together with the Privacy Policy, form the complete agreement regarding your use of the service.",
        ],
      },
      {
        title: "19. Contact Information",
        paragraphs: [
          "If you have questions about these terms, you may contact us using the details below.",
        ],
        items: [
          { label: "Email", text: "legal@whatismyname.org" },
          { label: "Website", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. Fair Use and Acknowledgment",
        paragraphs: [
          "The service is intended for lawful personal, educational, and research use. By using whatismyname, you acknowledge that you have read and understood these terms and our Privacy Policy.",
        ],
      },
    ],
  },
  zh: {
    title: "服务条款",
    lastUpdatedLabel: "最后更新：2024 年 12 月 14 日",
    backToHome: "返回首页",
    sections: [
      {
        title: "1. 接受条款",
        paragraphs: [
          "当你访问或使用 whatismyname 时，即表示你同意这些服务条款。如果你不同意，则不应使用本服务。",
        ],
      },
      {
        title: "2. 服务说明",
        paragraphs: [
          "whatismyname 提供用户名搜索、相关发现工具、AI 辅助分析以及配套教育内容。界面与内容可能覆盖 9 种语言地区版本。",
        ],
      },
      {
        title: "3. 合理使用",
        items: [
          { text: "不得使用本服务骚扰、跟踪、威胁或伤害他人。" },
          { text: "不得违反适用法律、第三方权利或平台规则。" },
          { text: "不得上传恶意代码、滥用自动化工具或非法内容。" },
          { text: "不得试图绕过保护措施、获取未授权访问权限，或干扰服务的正常运行。" },
        ],
      },
      {
        title: "4. 公平访问与限制",
        paragraphs: [
          "为保持可用性、保护基础设施并支持用户公平访问，我们可能采用限流、临时封锁或功能限制等技术控制措施。",
        ],
      },
      {
        title: "5. 设备与浏览器安全",
        paragraphs: [
          "本服务通常不要求注册账户，但你仍需对自己设备、浏览器、网络环境和本地环境的安全负责。",
        ],
      },
      {
        title: "6. 知识产权",
        paragraphs: [
          "本服务及其设计、品牌、软件和原创内容受适用知识产权法律保护。除法律允许外，未经授权，你不得复制、转载、再发布或基于受保护内容制作衍生作品。",
        ],
      },
      {
        title: "7. 第三方数据与标识",
        paragraphs: [
          "搜索结果中可能包含第三方平台的名称、标识、徽标或其他材料。相关权利归各自所有者所有，我们不主张对第三方平台内容拥有所有权。",
        ],
      },
      {
        title: "8. 用户提交内容",
        paragraphs: [
          "你在使用分析功能时提交的问题、提示词和类似内容，可能会在提供服务所需范围内被处理。你应仅提交你有权分享和使用的内容。",
        ],
      },
      {
        title: "9. 免责声明",
        paragraphs: [
          "本服务按“现状”和“可用”基础提供。搜索覆盖、可用性检查、教育内容和 AI 生成结果可能随时间变化，也可能并不完整或不存在错误。",
        ],
      },
      {
        title: "10. 责任限制",
        paragraphs: [
          "在法律允许的最大范围内，whatismyname 不对因使用本服务而产生的间接、附带、特殊、后果性或惩罚性损害承担责任。免费功能不保证持续不中断运行。",
        ],
      },
      {
        title: "11. 第三方服务",
        paragraphs: [
          "本服务可能接入或依赖第三方提供商，例如搜索 API、AI 服务、分析工具和托管基础设施。对于这些提供商各自的条款、隐私说明、可用性或行为，我们不承担责任。",
        ],
      },
      {
        title: "12. 隐私与数据保护",
        paragraphs: [
          "你对本服务的使用也受我们的隐私政策约束。该政策说明与本服务相关的信息可能如何被处理。",
        ],
      },
      {
        title: "13. 服务变更",
        paragraphs: [
          "为维护服务、适应提供商变化、改进功能或应对法律、运营与安全问题，我们可能随时修改、暂停、限制或终止部分服务。",
        ],
      },
      {
        title: "14. 条款更新",
        paragraphs: [
          "我们可能会不时更新这些服务条款。变更生效后你继续使用本服务，即表示你接受修订后的条款。",
        ],
      },
      {
        title: "15. 暂停与终止",
        paragraphs: [
          "在合理必要的情况下，包括怀疑存在滥用、法律合规需要、安全风险或违反本条款时，我们可能暂停或限制访问。",
        ],
      },
      {
        title: "16. 适用法律与争议",
        paragraphs: [
          "本条款受 whatismyname 运营所在地法律管辖，但不适用冲突法规则。与本条款或本服务有关的争议，应由依据适用法律具有适当管辖权的法院或机构处理。",
        ],
      },
      {
        title: "17. 赔偿",
        paragraphs: [
          "在法律允许的范围内，如因你滥用本服务、违反本条款或侵犯他人权利而引起索赔、损失、责任或费用，你同意对 whatismyname 进行补偿并使其免责。",
        ],
      },
      {
        title: "18. 可分割性与完整协议",
        paragraphs: [
          "如果本条款中的任何条款被认定为不可执行，其余条款仍将在法律允许的最大范围内继续有效。本条款连同隐私政策共同构成你使用本服务的完整协议。",
        ],
      },
      {
        title: "19. 联系信息",
        paragraphs: [
          "如果你对这些条款有疑问，可以通过以下方式联系我们。",
        ],
        items: [
          { label: "电子邮箱", text: "legal@whatismyname.org" },
          { label: "网站", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. 合理使用与确认",
        paragraphs: [
          "本服务旨在用于合法的个人、教育和研究用途。使用 whatismyname 即表示你确认自己已阅读并理解这些条款以及我们的隐私政策。",
        ],
      },
    ],
  },
  es: {
    title: "Términos del servicio",
    lastUpdatedLabel: "Última actualización: 14 de diciembre de 2024",
    backToHome: "Volver al inicio",
    sections: [
      {
        title: "1. Aceptación de los términos",
        paragraphs: [
          "Al acceder o utilizar whatismyname, aceptas estos Términos del servicio. Si no estás de acuerdo, no debes utilizar el servicio.",
        ],
      },
      {
        title: "2. Descripción del servicio",
        paragraphs: [
          "whatismyname ofrece búsqueda de nombres de usuario, herramientas relacionadas de descubrimiento, análisis asistido por IA y contenido educativo de apoyo. La interfaz y el contenido pueden estar disponibles en 9 configuraciones regionales.",
        ],
      },
      {
        title: "3. Uso aceptable",
        items: [
          { text: "No utilices el servicio para acosar, perseguir, amenazar o perjudicar a otras personas." },
          { text: "No infrinjas leyes aplicables, derechos de terceros ni normas de plataformas." },
          { text: "No subas código malicioso, automatización abusiva ni contenido ilegal." },
          { text: "No intentes eludir protecciones, obtener acceso no autorizado ni interferir con el funcionamiento normal del servicio." },
        ],
      },
      {
        title: "4. Acceso equitativo y límites",
        paragraphs: [
          "Podemos aplicar controles técnicos, como límites de uso, bloqueos temporales o restricciones funcionales, para preservar la disponibilidad, proteger la infraestructura y mantener un acceso equitativo para las personas usuarias.",
        ],
      },
      {
        title: "5. Seguridad del dispositivo y del navegador",
        paragraphs: [
          "Por lo general, el servicio no requiere una cuenta de usuario, pero sigues siendo responsable de la seguridad de tu dispositivo, navegador, red y entorno local cuando lo utilizas.",
        ],
      },
      {
        title: "6. Propiedad intelectual",
        paragraphs: [
          "El servicio, su diseño, la marca, el software y el contenido original están protegidos por las leyes de propiedad intelectual aplicables. Salvo que la ley lo permita, no puedes copiar, reproducir, republicar ni crear obras derivadas de material protegido sin autorización.",
        ],
      },
      {
        title: "7. Datos y signos de terceros",
        paragraphs: [
          "Los resultados de búsqueda pueden incluir referencias a plataformas de terceros, nombres, logotipos u otros materiales. Esos derechos pertenecen a sus respectivos titulares, y no reclamamos propiedad sobre el contenido de plataformas de terceros.",
        ],
      },
      {
        title: "8. Contenido enviado por el usuario",
        paragraphs: [
          "Las preguntas, indicaciones y materiales similares que envíes al utilizar funciones de análisis pueden procesarse en la medida necesaria para prestar el servicio. Solo debes enviar contenido que tengas derecho a compartir y utilizar.",
        ],
      },
      {
        title: "9. Exclusión de garantías",
        paragraphs: [
          "El servicio se ofrece tal cual y según disponibilidad. La cobertura de búsqueda, las comprobaciones de disponibilidad, los materiales educativos y las salidas generadas por IA pueden cambiar con el tiempo, ser incompletos o contener errores.",
        ],
      },
      {
        title: "10. Limitación de responsabilidad",
        paragraphs: [
          "En la máxima medida permitida por la ley, whatismyname no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso del servicio. Las funciones gratuitas se ofrecen sin garantía de funcionamiento ininterrumpido.",
        ],
      },
      {
        title: "11. Servicios de terceros",
        paragraphs: [
          "El servicio puede integrarse con o depender de terceros, como API de búsqueda, servicios de IA, herramientas analíticas e infraestructura de alojamiento. No somos responsables de los términos, avisos de privacidad, disponibilidad o comportamiento de esos proveedores.",
        ],
      },
      {
        title: "12. Privacidad y protección de datos",
        paragraphs: [
          "Tu uso del servicio también está sujeto a nuestra Política de privacidad, que explica cómo puede tratarse la información en relación con el servicio.",
        ],
      },
      {
        title: "13. Modificaciones del servicio",
        paragraphs: [
          "Podemos modificar, suspender, limitar o interrumpir partes del servicio en cualquier momento para mantenerlo, adaptarnos a cambios de proveedores, mejorar funciones o atender cuestiones legales, operativas o de seguridad.",
        ],
      },
      {
        title: "14. Cambios en estos términos",
        paragraphs: [
          "Podemos actualizar estos Términos del servicio ocasionalmente. El uso continuado del servicio después de la entrada en vigor de los cambios significa que aceptas la versión revisada.",
        ],
      },
      {
        title: "15. Suspensión y terminación",
        paragraphs: [
          "Podemos suspender o restringir el acceso cuando sea razonablemente necesario, incluso por sospecha de abuso, cumplimiento legal, riesgos de seguridad o infracción de estos términos.",
        ],
      },
      {
        title: "16. Ley aplicable y disputas",
        paragraphs: [
          "Estos términos se rigen por las leyes de la jurisdicción en la que opera whatismyname, sin tener en cuenta normas sobre conflicto de leyes. Cualquier disputa relacionada con estos términos o con el servicio se resolverá ante los tribunales u órganos con jurisdicción competente según la ley aplicable.",
        ],
      },
      {
        title: "17. Indemnización",
        paragraphs: [
          "En la medida permitida por la ley, aceptas indemnizar y mantener indemne a whatismyname frente a reclamaciones, pérdidas, responsabilidades y gastos derivados de tu uso indebido del servicio, de tu incumplimiento de estos términos o de la vulneración de derechos de otra persona.",
        ],
      },
      {
        title: "18. Divisibilidad y acuerdo completo",
        paragraphs: [
          "Si alguna disposición de estos términos se considera inaplicable, las disposiciones restantes seguirán vigentes en la máxima medida permitida por la ley. Estos términos, junto con la Política de privacidad, constituyen el acuerdo completo sobre tu uso del servicio.",
        ],
      },
      {
        title: "19. Información de contacto",
        paragraphs: [
          "Si tienes preguntas sobre estos términos, puedes comunicarte con nosotros a través de los siguientes datos.",
        ],
        items: [
          { label: "Correo electrónico", text: "legal@whatismyname.org" },
          { label: "Sitio web", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. Uso legítimo y reconocimiento",
        paragraphs: [
          "El servicio está destinado a usos personales, educativos y de investigación que sean lícitos. Al utilizar whatismyname, reconoces que has leído y comprendido estos términos y nuestra Política de privacidad.",
        ],
      },
    ],
  },
  ja: {
    title: "利用規約",
    lastUpdatedLabel: "最終更新日：2024年12月14日",
    backToHome: "ホームに戻る",
    sections: [
      {
        title: "1. 規約への同意",
        paragraphs: [
          "whatismyname にアクセスまたは利用することにより、お客様は本利用規約に同意したものとみなされます。同意しない場合は、本サービスを利用しないでください。",
        ],
      },
      {
        title: "2. サービス内容",
        paragraphs: [
          "whatismyname は、ユーザー名検索、関連する発見ツール、AI 補助分析、および補助的な教育コンテンツを提供します。インターフェースおよびコンテンツは 9 つのロケールで利用できる場合があります。",
        ],
      },
      {
        title: "3. 適切な利用",
        items: [
          { text: "他者への嫌がらせ、付きまとい、脅迫、危害のために本サービスを利用しないでください。" },
          { text: "適用法、第三者の権利、または各プラットフォームの規則に違反しないでください。" },
          { text: "悪意あるコード、乱用的な自動化、違法なコンテンツを送信しないでください。" },
          { text: "保護の回避、無権限アクセスの取得、または通常の運用の妨害を試みないでください。" },
        ],
      },
      {
        title: "4. 公平なアクセスと利用制限",
        paragraphs: [
          "可用性の維持、インフラの保護、および利用者への公平なアクセスのため、当社はレート制御、一時的な遮断、機能制限などの技術的措置を適用する場合があります。",
        ],
      },
      {
        title: "5. 端末とブラウザの安全管理",
        paragraphs: [
          "本サービスは通常ユーザーアカウントを必要としませんが、利用時におけるお客様自身の端末、ブラウザ、ネットワーク、およびローカル環境の安全管理責任はお客様にあります。",
        ],
      },
      {
        title: "6. 知的財産",
        paragraphs: [
          "本サービス、そのデザイン、ブランド、ソフトウェア、および独自コンテンツは、適用される知的財産法によって保護されます。法令で認められる場合を除き、許可なく保護対象物を複製、転載、再公開、または派生物を作成することはできません。",
        ],
      },
      {
        title: "7. 第三者データおよび標章",
        paragraphs: [
          "検索結果には、第三者プラットフォームの名称、ロゴ、その他の素材への言及が含まれることがあります。これらの権利は各権利者に帰属し、当社は第三者プラットフォームの内容について所有権を主張しません。",
        ],
      },
      {
        title: "8. ユーザー送信コンテンツ",
        paragraphs: [
          "分析機能の利用時に送信される質問、プロンプト、類似資料は、サービス提供に必要な範囲で処理されることがあります。共有または利用する権利を有する内容のみ送信してください。",
        ],
      },
      {
        title: "9. 保証の否認",
        paragraphs: [
          "本サービスは現状有姿かつ提供可能な範囲で提供されます。検索対象範囲、利用可否チェック、教育資料、AI 生成出力は時間の経過により変化する可能性があり、不完全であったり誤りを含んだりする場合があります。",
        ],
      },
      {
        title: "10. 責任の制限",
        paragraphs: [
          "法令で認められる最大限の範囲で、whatismyname は本サービスの利用に起因する間接損害、付随損害、特別損害、結果的損害、懲罰的損害について責任を負いません。無料機能について継続的かつ中断のない動作は保証されません。",
        ],
      },
      {
        title: "11. 第三者サービス",
        paragraphs: [
          "本サービスは、検索 API、AI サービス、分析ツール、ホスティング基盤などの第三者サービスと連携し、またはそれらに依存する場合があります。これらの提供者の個別条件、プライバシー通知、可用性、または挙動について、当社は責任を負いません。",
        ],
      },
      {
        title: "12. プライバシーとデータ保護",
        paragraphs: [
          "本サービスの利用には、当社のプライバシーポリシーも適用されます。同ポリシーには、本サービスに関連して情報がどのように処理され得るかが記載されています。",
        ],
      },
      {
        title: "13. サービスの変更",
        paragraphs: [
          "サービス維持、提供者側の変更への対応、機能改善、または法務・運用・安全上の理由により、当社は本サービスの一部をいつでも変更、停止、制限、または終了できるものとします。",
        ],
      },
      {
        title: "14. 規約の変更",
        paragraphs: [
          "当社は本利用規約を随時更新することがあります。変更の効力発生後も本サービスの利用を継続した場合、改訂後の規約に同意したものとみなされます。",
        ],
      },
      {
        title: "15. 停止および終了",
        paragraphs: [
          "不正利用の疑い、法令遵守の必要性、セキュリティ上の危険、または本規約違反が合理的に認められる場合、当社はアクセスを停止または制限することがあります。",
        ],
      },
      {
        title: "16. 準拠法と紛争",
        paragraphs: [
          "本規約は、法の抵触に関する規則を除き、whatismyname が運営される法域の法律に準拠します。本規約または本サービスに関する紛争は、適用法の下で適切な管轄を有する裁判所または機関で取り扱われます。",
        ],
      },
      {
        title: "17. 補償",
        paragraphs: [
          "法令で認められる範囲で、お客様は、本サービスの不正利用、本規約違反、または第三者の権利侵害に起因する請求、損失、責任、費用について、whatismyname を補償し、免責することに同意するものとします。",
        ],
      },
      {
        title: "18. 分離可能性と完全合意",
        paragraphs: [
          "本規約の一部が執行不能と判断された場合でも、残りの条項は法令で認められる最大限の範囲で有効に存続します。本規約およびプライバシーポリシーは、本サービス利用に関する完全な合意を構成します。",
        ],
      },
      {
        title: "19. 連絡先情報",
        paragraphs: [
          "本規約に関するご質問は、以下の連絡先までお寄せください。",
        ],
        items: [
          { label: "メール", text: "legal@whatismyname.org" },
          { label: "ウェブサイト", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. 適正利用と確認",
        paragraphs: [
          "本サービスは、適法な個人的利用、教育目的、研究目的での利用を想定しています。whatismyname を利用することにより、お客様は本規約およびプライバシーポリシーを読み、理解したことを確認するものとします。",
        ],
      },
    ],
  },
  fr: {
    title: "Conditions d’utilisation",
    lastUpdatedLabel: "Dernière mise à jour : 14 décembre 2024",
    backToHome: "Retour à l’accueil",
    sections: [
      {
        title: "1. Acceptation des conditions",
        paragraphs: [
          "En accédant à whatismyname ou en l’utilisant, vous acceptez les présentes conditions d’utilisation. Si vous n’êtes pas d’accord, vous ne devez pas utiliser le service.",
        ],
      },
      {
        title: "2. Description du service",
        paragraphs: [
          "whatismyname fournit une recherche de noms d’utilisateur, des outils associés de découverte, une analyse assistée par IA et du contenu éducatif complémentaire. L’interface et le contenu peuvent être disponibles dans 9 paramètres régionaux.",
        ],
      },
      {
        title: "3. Utilisation acceptable",
        items: [
          { text: "N’utilisez pas le service pour harceler, traquer, menacer ou nuire à d’autres personnes." },
          { text: "Ne violez pas les lois applicables, les droits de tiers ou les règles des plateformes." },
          { text: "Ne téléversez pas de code malveillant, d’automatisation abusive ni de contenu illégal." },
          { text: "N’essayez pas de contourner les protections, d’obtenir un accès non autorisé ou de perturber le fonctionnement normal du service." },
        ],
      },
      {
        title: "4. Accès équitable et limites",
        paragraphs: [
          "Nous pouvons appliquer des mesures techniques telles que des limitations de débit, des blocages temporaires ou des restrictions fonctionnelles afin de préserver la disponibilité, protéger l’infrastructure et maintenir un accès équitable pour les utilisateurs.",
        ],
      },
      {
        title: "5. Sécurité de l’appareil et du navigateur",
        paragraphs: [
          "Le service ne nécessite généralement pas de compte utilisateur, mais vous restez responsable de la sécurité de votre appareil, de votre navigateur, de votre réseau et de votre environnement local lorsque vous l’utilisez.",
        ],
      },
      {
        title: "6. Propriété intellectuelle",
        paragraphs: [
          "Le service, son design, sa marque, son logiciel et son contenu original sont protégés par les lois applicables en matière de propriété intellectuelle. Sauf autorisation de la loi, vous ne pouvez pas copier, reproduire, republier ou créer des œuvres dérivées à partir de contenus protégés sans autorisation.",
        ],
      },
      {
        title: "7. Données et signes distinctifs de tiers",
        paragraphs: [
          "Les résultats de recherche peuvent contenir des références à des plateformes tierces, à des noms, à des logos ou à d’autres éléments. Ces droits appartiennent à leurs titulaires respectifs, et nous ne revendiquons aucun droit de propriété sur le contenu des plateformes tierces.",
        ],
      },
      {
        title: "8. Contenu soumis par l’utilisateur",
        paragraphs: [
          "Les questions, invites et éléments similaires que vous soumettez lors de l’utilisation des fonctions d’analyse peuvent être traités dans la mesure nécessaire à la fourniture du service. Vous ne devez soumettre que des contenus que vous êtes autorisé à partager et à utiliser.",
        ],
      },
      {
        title: "9. Exclusion de garanties",
        paragraphs: [
          "Le service est fourni en l’état et selon disponibilité. La couverture de recherche, les vérifications de disponibilité, les supports éducatifs et les sorties générées par IA peuvent évoluer dans le temps, être incomplets ou comporter des erreurs.",
        ],
      },
      {
        title: "10. Limitation de responsabilité",
        paragraphs: [
          "Dans toute la mesure permise par la loi, whatismyname ne pourra être tenu responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de l’utilisation du service. Les fonctionnalités gratuites sont fournies sans garantie de fonctionnement ininterrompu.",
        ],
      },
      {
        title: "11. Services tiers",
        paragraphs: [
          "Le service peut s’intégrer à des prestataires tiers ou dépendre d’eux, notamment des API de recherche, des services d’IA, des outils d’analyse et une infrastructure d’hébergement. Nous ne sommes pas responsables des conditions distinctes, des avis de confidentialité, de la disponibilité ou du comportement de ces prestataires.",
        ],
      },
      {
        title: "12. Confidentialité et protection des données",
        paragraphs: [
          "Votre utilisation du service est également soumise à notre politique de confidentialité, qui explique comment des informations peuvent être traitées dans le cadre du service.",
        ],
      },
      {
        title: "13. Modifications du service",
        paragraphs: [
          "Nous pouvons modifier, suspendre, limiter ou interrompre certaines parties du service à tout moment afin d’en assurer la maintenance, de nous adapter aux changements de fournisseurs, d’améliorer les fonctionnalités ou de répondre à des enjeux juridiques, opérationnels ou de sécurité.",
        ],
      },
      {
        title: "14. Modifications des présentes conditions",
        paragraphs: [
          "Nous pouvons mettre à jour les présentes conditions d’utilisation de temps à autre. Le fait de continuer à utiliser le service après l’entrée en vigueur des modifications signifie que vous acceptez la version révisée.",
        ],
      },
      {
        title: "15. Suspension et résiliation",
        paragraphs: [
          "Nous pouvons suspendre ou restreindre l’accès lorsque cela est raisonnablement nécessaire, notamment en cas d’abus suspecté, d’exigence légale, de risque de sécurité ou de violation des présentes conditions.",
        ],
      },
      {
        title: "16. Droit applicable et litiges",
        paragraphs: [
          "Les présentes conditions sont régies par les lois de la juridiction dans laquelle whatismyname opère, sans égard aux règles de conflit de lois. Tout litige relatif aux présentes conditions ou au service sera traité par les tribunaux ou instances disposant de la compétence appropriée en vertu du droit applicable.",
        ],
      },
      {
        title: "17. Indemnisation",
        paragraphs: [
          "Dans la mesure permise par la loi, vous acceptez d’indemniser et de dégager whatismyname de toute responsabilité à l’égard des réclamations, pertes, responsabilités et dépenses résultant de votre utilisation abusive du service, de la violation des présentes conditions ou de l’atteinte aux droits d’autrui.",
        ],
      },
      {
        title: "18. Divisibilité et accord intégral",
        paragraphs: [
          "Si une disposition des présentes conditions est jugée inapplicable, les autres dispositions resteront en vigueur dans toute la mesure permise par la loi. Les présentes conditions, conjointement avec la politique de confidentialité, constituent l’accord intégral concernant votre utilisation du service.",
        ],
      },
      {
        title: "19. Coordonnées de contact",
        paragraphs: [
          "Si vous avez des questions sur ces conditions, vous pouvez nous contacter aux coordonnées ci-dessous.",
        ],
        items: [
          { label: "Adresse e-mail", text: "legal@whatismyname.org" },
          { label: "Site web", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. Usage légitime et reconnaissance",
        paragraphs: [
          "Le service est destiné à un usage personnel, éducatif et de recherche conforme à la loi. En utilisant whatismyname, vous reconnaissez avoir lu et compris les présentes conditions ainsi que notre politique de confidentialité.",
        ],
      },
    ],
  },
  ko: {
    title: "서비스 이용약관",
    lastUpdatedLabel: "최종 업데이트: 2024년 12월 14일",
    backToHome: "홈으로 돌아가기",
    sections: [
      {
        title: "1. 약관 동의",
        paragraphs: [
          "whatismyname에 접속하거나 이를 이용함으로써 귀하는 본 서비스 이용약관에 동의하게 됩니다. 동의하지 않는 경우 서비스를 이용해서는 안 됩니다.",
        ],
      },
      {
        title: "2. 서비스 설명",
        paragraphs: [
          "whatismyname는 사용자 이름 검색, 관련 탐색 도구, AI 보조 분석 및 보조 교육 콘텐츠를 제공합니다. 인터페이스와 콘텐츠는 9개 로캘에서 제공될 수 있습니다.",
        ],
      },
      {
        title: "3. 허용되는 사용",
        items: [
          { text: "다른 사람을 괴롭히거나 추적하거나 위협하거나 해치는 용도로 서비스를 사용해서는 안 됩니다." },
          { text: "적용 법률, 제3자의 권리 또는 플랫폼 규칙을 위반해서는 안 됩니다." },
          { text: "악성 코드, 남용적 자동화 또는 불법 콘텐츠를 업로드해서는 안 됩니다." },
          { text: "보호 조치를 우회하거나 무단 접근을 시도하거나 정상적인 서비스 운영을 방해해서는 안 됩니다." },
        ],
      },
      {
        title: "4. 공정한 접근과 제한",
        paragraphs: [
          "가용성을 유지하고 인프라를 보호하며 이용자 간 공정한 접근을 지원하기 위해 당사는 속도 제한, 임시 차단 또는 기능 제한과 같은 기술적 통제를 적용할 수 있습니다.",
        ],
      },
      {
        title: "5. 기기 및 브라우저 보안",
        paragraphs: [
          "서비스는 일반적으로 사용자 계정을 요구하지 않지만, 서비스를 이용할 때 자신의 기기, 브라우저, 네트워크 및 로컬 환경의 보안은 귀하의 책임입니다.",
        ],
      },
      {
        title: "6. 지식재산권",
        paragraphs: [
          "서비스, 그 디자인, 브랜드, 소프트웨어 및 원본 콘텐츠는 적용되는 지식재산권법의 보호를 받습니다. 법률이 허용하는 경우를 제외하고, 허가 없이 보호된 자료를 복사, 복제, 재게시하거나 2차 저작물을 만들어서는 안 됩니다.",
        ],
      },
      {
        title: "7. 제3자 데이터와 표지",
        paragraphs: [
          "검색 결과에는 제3자 플랫폼, 이름, 로고 또는 기타 자료에 대한 언급이 포함될 수 있습니다. 해당 권리는 각 권리자에게 있으며, 당사는 제3자 플랫폼 콘텐츠에 대한 소유권을 주장하지 않습니다.",
        ],
      },
      {
        title: "8. 이용자 제출 콘텐츠",
        paragraphs: [
          "분석 기능 사용 시 귀하가 제출하는 질문, 프롬프트 및 유사 자료는 서비스 제공에 필요한 범위에서 처리될 수 있습니다. 귀하는 공유하고 사용할 권한이 있는 콘텐츠만 제출해야 합니다.",
        ],
      },
      {
        title: "9. 보증의 부인",
        paragraphs: [
          "서비스는 현재 상태 및 제공 가능한 범위에서 제공됩니다. 검색 범위, 가용성 확인, 교육 자료 및 AI 생성 출력은 시간에 따라 변할 수 있으며, 불완전하거나 오류가 있을 수 있습니다.",
        ],
      },
      {
        title: "10. 책임의 제한",
        paragraphs: [
          "법률이 허용하는 최대 범위에서 whatismyname는 서비스 이용으로 인해 발생하는 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 책임을 지지 않습니다. 무료 기능에 대해서는 중단 없는 운영을 보장하지 않습니다.",
        ],
      },
      {
        title: "11. 제3자 서비스",
        paragraphs: [
          "서비스는 검색 API, AI 서비스, 분석 도구 및 호스팅 인프라와 같은 제3자 제공업체와 통합되거나 이에 의존할 수 있습니다. 당사는 이러한 제공업체의 별도 약관, 개인정보 안내, 가용성 또는 행위에 대해 책임지지 않습니다.",
        ],
      },
      {
        title: "12. 개인정보 및 데이터 보호",
        paragraphs: [
          "서비스 이용에는 당사의 개인정보 처리방침도 적용되며, 해당 방침은 서비스와 관련하여 정보가 어떻게 처리될 수 있는지 설명합니다.",
        ],
      },
      {
        title: "13. 서비스 변경",
        paragraphs: [
          "서비스 유지, 제공업체 변경 대응, 기능 개선 또는 법적·운영상·보안상 문제 대응을 위해 당사는 언제든지 서비스의 일부를 수정, 중단, 제한 또는 종료할 수 있습니다.",
        ],
      },
      {
        title: "14. 약관 변경",
        paragraphs: [
          "당사는 본 서비스 이용약관을 수시로 업데이트할 수 있습니다. 변경이 효력을 가진 후에도 서비스를 계속 이용하면 수정된 약관을 수락한 것으로 간주됩니다.",
        ],
      },
      {
        title: "15. 정지 및 종료",
        paragraphs: [
          "남용이 의심되거나, 법적 준수가 필요하거나, 보안 위험이 있거나, 본 약관 위반이 있는 경우 등 합리적으로 필요한 상황에서 당사는 접근을 정지하거나 제한할 수 있습니다.",
        ],
      },
      {
        title: "16. 준거법 및 분쟁",
        paragraphs: [
          "본 약관은 whatismyname가 운영되는 관할 지역의 법률을 따르며, 법률 충돌 규정은 제외됩니다. 본 약관 또는 서비스와 관련된 분쟁은 적용 법률상 적절한 관할권을 가진 법원 또는 기관에서 처리됩니다.",
        ],
      },
      {
        title: "17. 면책 및 배상",
        paragraphs: [
          "법률이 허용하는 범위에서 귀하는 서비스 오용, 본 약관 위반 또는 타인의 권리 침해로 인해 발생하는 청구, 손실, 책임 및 비용으로부터 whatismyname를 면책하고 배상하는 데 동의합니다.",
        ],
      },
      {
        title: "18. 가분성 및 완전한 합의",
        paragraphs: [
          "본 약관의 일부 조항이 집행 불가능하다고 판단되더라도, 나머지 조항은 법률이 허용하는 최대 범위에서 계속 효력을 유지합니다. 본 약관과 개인정보 처리방침은 서비스 이용과 관련한 완전한 합의를 구성합니다.",
        ],
      },
      {
        title: "19. 연락처 정보",
        paragraphs: [
          "본 약관에 관한 질문이 있으면 아래 연락처로 문의해 주세요.",
        ],
        items: [
          { label: "이메일", text: "legal@whatismyname.org" },
          { label: "웹사이트", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. 정당한 사용과 확인",
        paragraphs: [
          "서비스는 적법한 개인적 이용, 교육 목적 및 연구 목적을 위해 제공됩니다. whatismyname를 이용함으로써 귀하는 본 약관과 개인정보 처리방침을 읽고 이해했음을 확인합니다.",
        ],
      },
    ],
  },
  de: {
    title: "Nutzungsbedingungen",
    lastUpdatedLabel: "Zuletzt aktualisiert: 14. Dezember 2024",
    backToHome: "Zur Startseite",
    sections: [
      {
        title: "1. Annahme der Bedingungen",
        paragraphs: [
          "Durch den Zugriff auf oder die Nutzung von whatismyname stimmst du diesen Nutzungsbedingungen zu. Wenn du nicht einverstanden bist, solltest du den Dienst nicht nutzen.",
        ],
      },
      {
        title: "2. Beschreibung des Dienstes",
        paragraphs: [
          "whatismyname bietet Benutzernamensuche, zugehörige Entdeckungswerkzeuge, KI-gestützte Analysen und begleitende Bildungsinhalte. Oberfläche und Inhalte können in 9 Sprach- und Regionsvarianten verfügbar sein.",
        ],
      },
      {
        title: "3. Zulässige Nutzung",
        items: [
          { text: "Nutze den Dienst nicht, um andere zu belästigen, zu verfolgen, zu bedrohen oder zu schädigen." },
          { text: "Verstoße nicht gegen anwendbares Recht, Rechte Dritter oder Plattformregeln." },
          { text: "Lade keinen Schadcode, missbräuchliche Automatisierung oder rechtswidrige Inhalte hoch." },
          { text: "Versuche nicht, Schutzmechanismen zu umgehen, unbefugten Zugriff zu erlangen oder den normalen Betrieb des Dienstes zu stören." },
        ],
      },
      {
        title: "4. Fairer Zugang und Beschränkungen",
        paragraphs: [
          "Wir können technische Kontrollen wie Ratenbegrenzungen, vorübergehende Sperren oder Funktionsbeschränkungen anwenden, um die Verfügbarkeit zu erhalten, die Infrastruktur zu schützen und einen fairen Zugang für Nutzende zu unterstützen.",
        ],
      },
      {
        title: "5. Sicherheit von Gerät und Browser",
        paragraphs: [
          "Der Dienst erfordert in der Regel kein Benutzerkonto, dennoch bleibst du für die Sicherheit deines eigenen Geräts, Browsers, Netzwerks und lokalen Umfelds bei der Nutzung verantwortlich.",
        ],
      },
      {
        title: "6. Geistiges Eigentum",
        paragraphs: [
          "Der Dienst, sein Design, seine Marke, seine Software und seine originären Inhalte sind durch anwendbare Gesetze zum geistigen Eigentum geschützt. Soweit gesetzlich nicht erlaubt, darfst du geschützte Materialien ohne Genehmigung nicht kopieren, vervielfältigen, erneut veröffentlichen oder daraus abgeleitete Werke erstellen.",
        ],
      },
      {
        title: "7. Daten und Kennzeichen Dritter",
        paragraphs: [
          "Suchergebnisse können Hinweise auf Plattformen Dritter, Namen, Logos oder andere Materialien enthalten. Diese Rechte verbleiben bei den jeweiligen Inhabern, und wir beanspruchen kein Eigentum an Inhalten von Plattformen Dritter.",
        ],
      },
      {
        title: "8. Vom Nutzer übermittelte Inhalte",
        paragraphs: [
          "Fragen, Eingaben und ähnliche Inhalte, die du bei der Nutzung von Analysefunktionen übermittelst, können verarbeitet werden, soweit dies zur Bereitstellung des Dienstes erforderlich ist. Du solltest nur Inhalte einreichen, die du rechtmäßig teilen und verwenden darfst.",
        ],
      },
      {
        title: "9. Gewährleistungsausschluss",
        paragraphs: [
          "Der Dienst wird in der vorliegenden Form und nach Verfügbarkeit bereitgestellt. Suchabdeckung, Verfügbarkeitsprüfungen, Bildungsinhalte und KI-generierte Ausgaben können sich im Laufe der Zeit ändern, unvollständig sein oder Fehler enthalten.",
        ],
      },
      {
        title: "10. Haftungsbeschränkung",
        paragraphs: [
          "Soweit gesetzlich zulässig, haftet whatismyname nicht für mittelbare, beiläufige, besondere, Folge- oder Strafschäden, die aus der Nutzung des Dienstes entstehen. Kostenlose Funktionen werden ohne Garantie eines unterbrechungsfreien Betriebs bereitgestellt.",
        ],
      },
      {
        title: "11. Dienste Dritter",
        paragraphs: [
          "Der Dienst kann sich mit Drittanbietern integrieren oder von ihnen abhängen, etwa Such-APIs, KI-Diensten, Analysetools und Hosting-Infrastruktur. Für die gesonderten Bedingungen, Datenschutzhinweise, die Verfügbarkeit oder das Verhalten dieser Anbieter sind wir nicht verantwortlich.",
        ],
      },
      {
        title: "12. Datenschutz und Datensicherheit",
        paragraphs: [
          "Deine Nutzung des Dienstes unterliegt auch unserer Datenschutzerklärung, die erläutert, wie Informationen im Zusammenhang mit dem Dienst verarbeitet werden können.",
        ],
      },
      {
        title: "13. Änderungen am Dienst",
        paragraphs: [
          "Wir können Teile des Dienstes jederzeit ändern, aussetzen, beschränken oder einstellen, um den Dienst zu warten, auf Änderungen bei Anbietern zu reagieren, Funktionen zu verbessern oder rechtliche, betriebliche oder sicherheitsbezogene Anliegen zu adressieren.",
        ],
      },
      {
        title: "14. Änderungen dieser Bedingungen",
        paragraphs: [
          "Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren. Wenn du den Dienst nach Inkrafttreten von Änderungen weiter nutzt, gilt dies als Annahme der überarbeiteten Bedingungen.",
        ],
      },
      {
        title: "15. Sperrung und Beendigung",
        paragraphs: [
          "Wir können den Zugang aussetzen oder beschränken, wenn dies vernünftigerweise erforderlich ist, insbesondere bei vermutetem Missbrauch, rechtlichen Anforderungen, Sicherheitsrisiken oder Verstößen gegen diese Bedingungen.",
        ],
      },
      {
        title: "16. Geltendes Recht und Streitigkeiten",
        paragraphs: [
          "Diese Bedingungen unterliegen dem Recht der Rechtsordnung, in der whatismyname betrieben wird, ohne Rücksicht auf Kollisionsnormen. Streitigkeiten im Zusammenhang mit diesen Bedingungen oder dem Dienst werden vor Gerichten oder Stellen behandelt, die nach anwendbarem Recht zuständig sind.",
        ],
      },
      {
        title: "17. Freistellung",
        paragraphs: [
          "Soweit gesetzlich zulässig, erklärst du dich damit einverstanden, whatismyname von Ansprüchen, Verlusten, Verbindlichkeiten und Aufwendungen freizustellen, die aus deinem Missbrauch des Dienstes, deinem Verstoß gegen diese Bedingungen oder der Verletzung von Rechten anderer entstehen.",
        ],
      },
      {
        title: "18. Salvatorische Klausel und vollständige Vereinbarung",
        paragraphs: [
          "Sollte eine Bestimmung dieser Bedingungen nicht durchsetzbar sein, bleiben die übrigen Bestimmungen im größtmöglichen gesetzlich zulässigen Umfang in Kraft. Diese Bedingungen bilden zusammen mit der Datenschutzerklärung die vollständige Vereinbarung über deine Nutzung des Dienstes.",
        ],
      },
      {
        title: "19. Kontaktinformationen",
        paragraphs: [
          "Wenn du Fragen zu diesen Bedingungen hast, kannst du uns über die folgenden Angaben kontaktieren.",
        ],
        items: [
          { label: "E-Mail", text: "legal@whatismyname.org" },
          { label: "Website", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. Zulässige Nutzung und Bestätigung",
        paragraphs: [
          "Der Dienst ist für rechtmäßige persönliche, Bildungs- und Forschungszwecke bestimmt. Durch die Nutzung von whatismyname bestätigst du, dass du diese Bedingungen und unsere Datenschutzerklärung gelesen und verstanden hast.",
        ],
      },
    ],
  },
  pt: {
    title: "Termos de Serviço",
    lastUpdatedLabel: "Última atualização: 14 de dezembro de 2024",
    backToHome: "Voltar para a página inicial",
    sections: [
      {
        title: "1. Aceitação dos termos",
        paragraphs: [
          "Ao acessar ou utilizar whatismyname, você concorda com estes Termos de Serviço. Se não concordar, não deve utilizar o serviço.",
        ],
      },
      {
        title: "2. Descrição do serviço",
        paragraphs: [
          "whatismyname oferece busca de nomes de usuário, ferramentas relacionadas de descoberta, análise assistida por IA e conteúdo educacional de apoio. A interface e o conteúdo podem estar disponíveis em 9 localidades.",
        ],
      },
      {
        title: "3. Uso aceitável",
        items: [
          { text: "Não utilize o serviço para assediar, perseguir, ameaçar ou prejudicar outras pessoas." },
          { text: "Não viole leis aplicáveis, direitos de terceiros ou regras de plataformas." },
          { text: "Não envie código malicioso, automação abusiva ou conteúdo ilegal." },
          { text: "Não tente contornar proteções, obter acesso não autorizado ou interferir no funcionamento normal do serviço." },
        ],
      },
      {
        title: "4. Acesso justo e limites",
        paragraphs: [
          "Podemos aplicar controles técnicos, como limitação de taxa, bloqueios temporários ou restrições de funcionalidades, para preservar a disponibilidade, proteger a infraestrutura e manter acesso justo às pessoas usuárias.",
        ],
      },
      {
        title: "5. Segurança do dispositivo e do navegador",
        paragraphs: [
          "O serviço geralmente não exige conta de usuário, mas você continua responsável pela segurança do seu dispositivo, navegador, rede e ambiente local ao utilizá-lo.",
        ],
      },
      {
        title: "6. Propriedade intelectual",
        paragraphs: [
          "O serviço, seu design, sua marca, seu software e seu conteúdo original são protegidos pelas leis aplicáveis de propriedade intelectual. Salvo quando permitido por lei, você não pode copiar, reproduzir, republicar ou criar obras derivadas de material protegido sem autorização.",
        ],
      },
      {
        title: "7. Dados e sinais distintivos de terceiros",
        paragraphs: [
          "Os resultados de busca podem conter referências a plataformas de terceiros, nomes, logotipos ou outros materiais. Esses direitos pertencem aos respectivos titulares, e não reivindicamos propriedade sobre o conteúdo de plataformas de terceiros.",
        ],
      },
      {
        title: "8. Conteúdo enviado pelo usuário",
        paragraphs: [
          "Perguntas, prompts e materiais semelhantes enviados por você ao utilizar recursos de análise podem ser processados conforme necessário para prestar o serviço. Você deve enviar apenas conteúdo que tenha direito de compartilhar e utilizar.",
        ],
      },
      {
        title: "9. Isenção de garantias",
        paragraphs: [
          "O serviço é fornecido no estado em que se encontra e conforme disponibilidade. A cobertura de busca, as verificações de disponibilidade, os materiais educacionais e as saídas geradas por IA podem mudar com o tempo, ser incompletos ou conter erros.",
        ],
      },
      {
        title: "10. Limitação de responsabilidade",
        paragraphs: [
          "Na máxima medida permitida por lei, whatismyname não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso do serviço. Os recursos gratuitos são oferecidos sem garantia de operação ininterrupta.",
        ],
      },
      {
        title: "11. Serviços de terceiros",
        paragraphs: [
          "O serviço pode integrar-se a fornecedores terceiros ou depender deles, como APIs de busca, serviços de IA, ferramentas analíticas e infraestrutura de hospedagem. Não somos responsáveis pelos termos separados, avisos de privacidade, disponibilidade ou comportamento desses fornecedores.",
        ],
      },
      {
        title: "12. Privacidade e proteção de dados",
        paragraphs: [
          "Seu uso do serviço também está sujeito à nossa Política de Privacidade, que explica como as informações podem ser processadas em conexão com o serviço.",
        ],
      },
      {
        title: "13. Modificações no serviço",
        paragraphs: [
          "Podemos modificar, suspender, limitar ou descontinuar partes do serviço a qualquer momento para manter o serviço, adaptar-nos a mudanças de fornecedores, melhorar recursos ou tratar de questões legais, operacionais ou de segurança.",
        ],
      },
      {
        title: "14. Alterações destes termos",
        paragraphs: [
          "Podemos atualizar estes Termos de Serviço periodicamente. O uso continuado do serviço após a vigência das alterações significa que você aceita a versão revisada.",
        ],
      },
      {
        title: "15. Suspensão e encerramento",
        paragraphs: [
          "Podemos suspender ou restringir o acesso quando isso for razoavelmente necessário, inclusive em caso de suspeita de abuso, obrigação legal, riscos de segurança ou violação destes termos.",
        ],
      },
      {
        title: "16. Lei aplicável e disputas",
        paragraphs: [
          "Estes termos são regidos pelas leis da jurisdição em que whatismyname opera, sem considerar regras de conflito de leis. Qualquer disputa relacionada a estes termos ou ao serviço será tratada pelos tribunais ou órgãos com jurisdição adequada segundo a lei aplicável.",
        ],
      },
      {
        title: "17. Indenização",
        paragraphs: [
          "Na medida permitida por lei, você concorda em indenizar e isentar whatismyname de reivindicações, perdas, responsabilidades e despesas decorrentes do seu uso indevido do serviço, da violação destes termos ou da violação de direitos de terceiros.",
        ],
      },
      {
        title: "18. Divisibilidade e acordo integral",
        paragraphs: [
          "Se qualquer disposição destes termos for considerada inexequível, as demais disposições permanecerão em vigor na máxima medida permitida por lei. Estes termos, juntamente com a Política de Privacidade, formam o acordo integral sobre o uso do serviço.",
        ],
      },
      {
        title: "19. Informações de contato",
        paragraphs: [
          "Se você tiver dúvidas sobre estes termos, pode entrar em contato conosco pelos dados abaixo.",
        ],
        items: [
          { label: "E-mail", text: "legal@whatismyname.org" },
          { label: "Site", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. Uso legítimo e confirmação",
        paragraphs: [
          "O serviço destina-se a uso pessoal, educacional e de pesquisa de forma lícita. Ao utilizar whatismyname, você reconhece que leu e compreendeu estes termos e nossa Política de Privacidade.",
        ],
      },
    ],
  },
  ru: {
    title: "Условия использования",
    lastUpdatedLabel: "Последнее обновление: 14 декабря 2024 г.",
    backToHome: "Вернуться на главную",
    sections: [
      {
        title: "1. Принятие условий",
        paragraphs: [
          "Получая доступ к whatismyname или используя его, вы соглашаетесь с настоящими условиями использования. Если вы не согласны, вам не следует пользоваться сервисом.",
        ],
      },
      {
        title: "2. Описание сервиса",
        paragraphs: [
          "whatismyname предоставляет поиск имён пользователей, связанные инструменты обнаружения, анализ с помощью ИИ и вспомогательные образовательные материалы. Интерфейс и контент могут быть доступны в 9 локалях.",
        ],
      },
      {
        title: "3. Допустимое использование",
        items: [
          { text: "Не используйте сервис для преследования, запугивания, угроз или причинения вреда другим людям." },
          { text: "Не нарушайте применимое законодательство, права третьих лиц или правила платформ." },
          { text: "Не загружайте вредоносный код, злоупотребляющую автоматизацию или незаконный контент." },
          { text: "Не пытайтесь обходить меры защиты, получать несанкционированный доступ или вмешиваться в нормальную работу сервиса." },
        ],
      },
      {
        title: "4. Справедливый доступ и ограничения",
        paragraphs: [
          "Мы можем применять технические меры, такие как ограничение частоты запросов, временные блокировки или ограничения функций, чтобы сохранять доступность, защищать инфраструктуру и поддерживать справедливый доступ для пользователей.",
        ],
      },
      {
        title: "5. Безопасность устройства и браузера",
        paragraphs: [
          "Сервис обычно не требует учётной записи пользователя, однако вы по-прежнему отвечаете за безопасность своего устройства, браузера, сети и локальной среды при использовании сервиса.",
        ],
      },
      {
        title: "6. Интеллектуальная собственность",
        paragraphs: [
          "Сервис, его дизайн, бренд, программное обеспечение и оригинальный контент защищены применимым законодательством об интеллектуальной собственности. За исключением случаев, разрешённых законом, вы не можете копировать, воспроизводить, повторно публиковать или создавать производные материалы на основе защищённого контента без разрешения.",
        ],
      },
      {
        title: "7. Данные и обозначения третьих лиц",
        paragraphs: [
          "Результаты поиска могут содержать ссылки на сторонние платформы, названия, логотипы и другие материалы. Права на них принадлежат соответствующим правообладателям, и мы не заявляем права собственности на контент сторонних платформ.",
        ],
      },
      {
        title: "8. Контент, отправляемый пользователем",
        paragraphs: [
          "Вопросы, подсказки и похожие материалы, которые вы отправляете при использовании функций анализа, могут обрабатываться в объёме, необходимом для предоставления сервиса. Вы должны отправлять только тот контент, которым вправе делиться и пользоваться.",
        ],
      },
      {
        title: "9. Отказ от гарантий",
        paragraphs: [
          "Сервис предоставляется по принципу «как есть» и «по мере доступности». Охват поиска, проверки доступности, образовательные материалы и результаты, созданные ИИ, могут со временем меняться, быть неполными или содержать ошибки.",
        ],
      },
      {
        title: "10. Ограничение ответственности",
        paragraphs: [
          "В максимально допустимой законом степени whatismyname не несёт ответственности за косвенные, случайные, специальные, последующие или штрафные убытки, возникающие в связи с использованием сервиса. Бесплатные функции предоставляются без гарантии непрерывной работы.",
        ],
      },
      {
        title: "11. Сторонние сервисы",
        paragraphs: [
          "Сервис может интегрироваться со сторонними поставщиками или зависеть от них, включая поисковые API, сервисы ИИ, аналитические инструменты и инфраструктуру хостинга. Мы не несём ответственности за отдельные условия, уведомления о конфиденциальности, доступность или поведение таких поставщиков.",
        ],
      },
      {
        title: "12. Конфиденциальность и защита данных",
        paragraphs: [
          "Использование сервиса также регулируется нашей политикой конфиденциальности, в которой объясняется, как информация может обрабатываться в связи с сервисом.",
        ],
      },
      {
        title: "13. Изменения сервиса",
        paragraphs: [
          "Мы можем изменять, приостанавливать, ограничивать или прекращать отдельные части сервиса в любое время для его поддержки, адаптации к изменениям у поставщиков, улучшения функций или решения юридических, операционных либо вопросов безопасности.",
        ],
      },
      {
        title: "14. Изменения условий",
        paragraphs: [
          "Мы можем время от времени обновлять настоящие условия использования. Продолжение использования сервиса после вступления изменений в силу означает принятие обновлённой версии условий.",
        ],
      },
      {
        title: "15. Приостановка и прекращение доступа",
        paragraphs: [
          "Мы можем приостановить или ограничить доступ, если это разумно необходимо, в том числе при подозрении на злоупотребление, для соблюдения закона, при рисках безопасности или нарушении настоящих условий.",
        ],
      },
      {
        title: "16. Применимое право и споры",
        paragraphs: [
          "Настоящие условия регулируются законодательством юрисдикции, в которой действует whatismyname, без учёта норм коллизионного права. Любые споры, связанные с этими условиями или сервисом, рассматриваются судами или органами, обладающими надлежащей юрисдикцией по применимому праву.",
        ],
      },
      {
        title: "17. Возмещение убытков",
        paragraphs: [
          "В пределах, допускаемых законом, вы соглашаетесь возмещать убытки и освобождать whatismyname от требований, потерь, обязательств и расходов, возникающих из-за вашего неправомерного использования сервиса, нарушения этих условий или нарушения прав другого лица.",
        ],
      },
      {
        title: "18. Делимость и полнота соглашения",
        paragraphs: [
          "Если какое-либо положение этих условий будет признано неисполнимым, остальные положения сохранят силу в максимально допустимой законом степени. Эти условия вместе с политикой конфиденциальности образуют полное соглашение относительно использования сервиса.",
        ],
      },
      {
        title: "19. Контактная информация",
        paragraphs: [
          "Если у вас есть вопросы об этих условиях, вы можете связаться с нами по следующим данным.",
        ],
        items: [
          { label: "Электронная почта", text: "legal@whatismyname.org" },
          { label: "Сайт", text: "https://whatismyname.org" },
        ],
      },
      {
        title: "20. Допустимое использование и подтверждение",
        paragraphs: [
          "Сервис предназначен для законного личного, образовательного и исследовательского использования. Используя whatismyname, вы подтверждаете, что прочитали и поняли эти условия и нашу политику конфиденциальности.",
        ],
      },
    ],
  },
};

const PRIVACY_LAST_UPDATED_LABELS: Record<AppLocale, string> = {
  en: "Last updated: July 28, 2026",
  zh: "最后更新：2026 年 7 月 28 日",
  es: "Última actualización: 28 de julio de 2026",
  ja: "最終更新日：2026年7月28日",
  fr: "Dernière mise à jour : 28 juillet 2026",
  ko: "최종 업데이트: 2026년 7월 28일",
  de: "Zuletzt aktualisiert: 28. Juli 2026",
  pt: "Última atualização: 28 de julho de 2026",
  ru: "Последнее обновление: 28 июля 2026 г.",
};

const ADVERTISING_PRIVACY_SECTIONS: Record<AppLocale, LegalSection> = {
  en: {
    title: "13. Advertising and Cookies",
    paragraphs: [
      "We may use Google AdSense to display advertising. When advertising is enabled, third parties, including Google, may place or read cookies, use web beacons, IP addresses, or similar identifiers to serve, measure, limit repetition of, and—where permitted—personalize ads.",
    ],
    items: [
      {
        text: "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's advertising cookies enable Google and its partners to serve ads based on visits to this site and other sites on the Internet.",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites",
        label: "How Google uses data",
        text: "Review how Google uses information from sites or apps that use its services.",
      },
      {
        href: "https://adssettings.google.com/",
        label: "Ad choices",
        text: "Manage or opt out of personalized advertising in Google Ads Settings.",
      },
    ],
  },
  zh: {
    title: "13. 广告与 Cookie",
    paragraphs: [
      "我们可能会使用 Google AdSense 展示广告。启用广告后，包括 Google 在内的第三方可能会设置或读取 Cookie，并使用网络信标、IP 地址或类似标识符来投放、衡量、限制重复展示，并在允许的情况下个性化广告。",
    ],
    items: [
      {
        text: "包括 Google 在内的第三方供应商会根据用户此前访问本网站或其他网站的情况，使用 Cookie 投放广告。Google 的广告 Cookie 可让 Google 及其合作伙伴根据用户访问本网站及互联网其他网站的情况投放广告。",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=zh-CN",
        label: "Google 如何使用数据",
        text: "了解 Google 如何使用来自采用其服务的网站或应用的信息。",
      },
      {
        href: "https://adssettings.google.com/",
        label: "广告选择",
        text: "在 Google 广告设置中管理或停用个性化广告。",
      },
    ],
  },
  es: {
    title: "13. Publicidad y cookies",
    paragraphs: [
      "Podemos usar Google AdSense para mostrar publicidad. Cuando la publicidad está habilitada, terceros, incluido Google, pueden colocar o leer cookies y usar balizas web, direcciones IP o identificadores similares para publicar, medir, limitar la repetición y, cuando esté permitido, personalizar anuncios.",
    ],
    items: [
      {
        text: "Los proveedores externos, incluido Google, usan cookies para publicar anuncios basados en visitas anteriores de una persona a este u otros sitios web. Las cookies publicitarias de Google permiten que Google y sus socios muestren anuncios según las visitas a este sitio y a otros sitios de Internet.",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=es",
        label: "Cómo usa Google los datos",
        text: "Consulta cómo utiliza Google la información de sitios o aplicaciones que usan sus servicios.",
      },
      {
        href: "https://adssettings.google.com/",
        label: "Opciones de anuncios",
        text: "Gestiona o desactiva la publicidad personalizada en la Configuración de anuncios de Google.",
      },
    ],
  },
  ja: {
    title: "13. 広告と Cookie",
    paragraphs: [
      "当サイトは広告表示に Google AdSense を使用することがあります。広告が有効な場合、Google を含む第三者は、広告の配信、測定、反復表示の制限、および許可される場合のパーソナライズのために、Cookie の設定や読み取り、ウェブビーコン、IP アドレス、または類似の識別子を使用することがあります。",
    ],
    items: [
      {
        text: "Google を含む第三者配信事業者は、このウェブサイトまたは他のウェブサイトへの過去のアクセスに基づいて広告を配信するため Cookie を使用します。Google の広告 Cookie により、Google とそのパートナーは、このサイトやインターネット上の他のサイトへのアクセスに基づく広告を配信できます。",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=ja",
        label: "Google によるデータの使用",
        text: "Google のサービスを利用するサイトやアプリからの情報の使用方法を確認できます。",
      },
      {
        href: "https://adssettings.google.com/",
        label: "広告の設定",
        text: "Google の広告設定でパーソナライズ広告を管理または無効にできます。",
      },
    ],
  },
  fr: {
    title: "13. Publicité et cookies",
    paragraphs: [
      "Nous pouvons utiliser Google AdSense pour afficher de la publicité. Lorsque la publicité est activée, des tiers, dont Google, peuvent déposer ou lire des cookies et utiliser des balises web, des adresses IP ou des identifiants similaires afin de diffuser et mesurer les annonces, d'en limiter la répétition et, lorsque cela est autorisé, de les personnaliser.",
    ],
    items: [
      {
        text: "Les fournisseurs tiers, dont Google, utilisent des cookies pour diffuser des annonces en fonction des visites antérieures d'un utilisateur sur ce site ou sur d'autres sites. Les cookies publicitaires de Google permettent à Google et à ses partenaires de diffuser des annonces selon les visites sur ce site et sur d'autres sites Internet.",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=fr",
        label: "Utilisation des données par Google",
        text: "Consultez la manière dont Google utilise les informations provenant des sites ou applications qui utilisent ses services.",
      },
      {
        href: "https://adssettings.google.com/",
        label: "Choix publicitaires",
        text: "Gérez ou désactivez la publicité personnalisée dans les paramètres des annonces Google.",
      },
    ],
  },
  ko: {
    title: "13. 광고 및 쿠키",
    paragraphs: [
      "당사는 광고를 표시하기 위해 Google AdSense를 사용할 수 있습니다. 광고가 활성화되면 Google을 포함한 제3자는 광고 제공, 측정, 반복 노출 제한 및 허용되는 경우 맞춤설정을 위해 쿠키를 설정하거나 읽고 웹 비콘, IP 주소 또는 유사한 식별자를 사용할 수 있습니다.",
    ],
    items: [
      {
        text: "Google을 포함한 제3자 공급업체는 사용자의 이 웹사이트 또는 다른 웹사이트에 대한 이전 방문 기록을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다. Google의 광고 쿠키를 통해 Google과 파트너는 이 사이트 및 인터넷상의 다른 사이트 방문 기록을 바탕으로 광고를 게재할 수 있습니다.",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=ko",
        label: "Google의 데이터 사용 방식",
        text: "Google 서비스를 사용하는 사이트 또는 앱의 정보를 Google이 사용하는 방식을 확인할 수 있습니다.",
      },
      {
        href: "https://adssettings.google.com/",
        label: "광고 선택",
        text: "Google 광고 설정에서 맞춤 광고를 관리하거나 사용 중지할 수 있습니다.",
      },
    ],
  },
  de: {
    title: "13. Werbung und Cookies",
    paragraphs: [
      "Wir können Google AdSense verwenden, um Werbung anzuzeigen. Wenn Werbung aktiviert ist, können Dritte, einschließlich Google, Cookies setzen oder auslesen und Web-Beacons, IP-Adressen oder ähnliche Kennungen verwenden, um Anzeigen auszuliefern, zu messen, Wiederholungen zu begrenzen und sie – soweit zulässig – zu personalisieren.",
    ],
    items: [
      {
        text: "Drittanbieter, einschließlich Google, verwenden Cookies zur Anzeigenschaltung auf Grundlage früherer Besuche eines Nutzers auf dieser oder anderen Websites. Die Werbe-Cookies von Google ermöglichen Google und seinen Partnern, Anzeigen auf Grundlage von Besuchen dieser Website und anderer Websites im Internet zu schalten.",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=de",
        label: "Datennutzung durch Google",
        text: "Lesen Sie, wie Google Informationen von Websites oder Apps verwendet, die Google-Dienste nutzen.",
      },
      {
        href: "https://adssettings.google.com/",
        label: "Anzeigeneinstellungen",
        text: "Personalisierte Werbung in den Google-Anzeigeneinstellungen verwalten oder deaktivieren.",
      },
    ],
  },
  pt: {
    title: "13. Publicidade e cookies",
    paragraphs: [
      "Podemos usar o Google AdSense para exibir publicidade. Quando a publicidade estiver ativada, terceiros, incluindo o Google, podem definir ou ler cookies e usar web beacons, endereços IP ou identificadores semelhantes para veicular e medir anúncios, limitar repetições e, quando permitido, personalizá-los.",
    ],
    items: [
      {
        text: "Fornecedores terceiros, incluindo o Google, usam cookies para veicular anúncios com base nas visitas anteriores de um usuário a este ou a outros sites. Os cookies de publicidade do Google permitem que o Google e seus parceiros veiculem anúncios com base nas visitas a este site e a outros sites na Internet.",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=pt-BR",
        label: "Como o Google usa os dados",
        text: "Consulte como o Google usa informações de sites ou aplicativos que utilizam seus serviços.",
      },
      {
        href: "https://adssettings.google.com/",
        label: "Opções de anúncios",
        text: "Gerencie ou desative a publicidade personalizada nas Configurações de anúncios do Google.",
      },
    ],
  },
  ru: {
    title: "13. Реклама и файлы cookie",
    paragraphs: [
      "Мы можем использовать Google AdSense для показа рекламы. Когда реклама включена, третьи лица, включая Google, могут устанавливать или считывать файлы cookie и использовать веб-маяки, IP-адреса или аналогичные идентификаторы для показа и измерения рекламы, ограничения повторов и, когда это разрешено, персонализации.",
    ],
    items: [
      {
        text: "Сторонние поставщики, включая Google, используют файлы cookie для показа рекламы с учетом предыдущих посещений пользователем этого или других сайтов. Рекламные файлы cookie Google позволяют Google и его партнерам показывать рекламу с учетом посещений этого сайта и других сайтов в Интернете.",
      },
      {
        href: "https://policies.google.com/technologies/partner-sites?hl=ru",
        label: "Как Google использует данные",
        text: "Узнайте, как Google использует информацию с сайтов и приложений, использующих его сервисы.",
      },
      {
        href: "https://adssettings.google.com/",
        label: "Настройки рекламы",
        text: "Управляйте персонализированной рекламой или отключите ее в настройках рекламы Google.",
      },
    ],
  },
};

export function getPrivacyDocument(locale: string) {
  const resolvedLocale = resolveLocale(locale);
  const document = PRIVACY_DOCS[resolvedLocale];

  return {
    ...document,
    lastUpdatedLabel: PRIVACY_LAST_UPDATED_LABELS[resolvedLocale],
    sections: [
      ...document.sections,
      ADVERTISING_PRIVACY_SECTIONS[resolvedLocale],
    ],
  };
}

export function getTermsDocument(locale: string) {
  return TERMS_DOCS[resolveLocale(locale)];
}
