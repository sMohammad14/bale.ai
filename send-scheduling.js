(async function() {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // 🕐 بخش ۰: ابزار لاگ با مهر زمان
  // ══════════════════════════════════════════════════════════════
  function ts() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    return `[${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}:${ms}]`;
  }
  const L = (...args) => console.log(ts(), ...args);
  const W = (...args) => console.warn(ts(), ...args);
  const E = (...args) => console.error(ts(), ...args);

  // ══════════════════════════════════════════════════════════════
  // 📋 بخش ۱: آرایه‌های ورودی
  // ══════════════════════════════════════════════════════════════

  const TARGET_UID_LIST = ["1",
    "2142691231",
    "2134936063",
    "2134421634",
    "2130581937",
    "2130257868",
    "2126452401",
    "2118553653",
    "2117666506",
    "2115417546",
    "2115225837",
    "2114537703",
    "2112691387",
    "2108753529",
    "2096514126",
    "2090381510",
    "2086979689",
    "2082422078",
    "2082328127",
    "2081561741",
    "2",
    "2078134357",
    "2076501919",
    "2072973690",
    "2071706932",
    "1",
    "2069703540",
    "2067809855",
    "2067559416",
    "2065422402",
    "2058333300",
    "2054782330",
    "2051531353",
    "2051368723",
    "2044356459",
    "2043397028",
    "2042515853",
    "2041525049",
    "2041411516",
    "2034495333",
    "2033059422",
    "2030292792",
    "2027324594",
    "2026863790",
    "2025059610",
    "2023019125",
    "2020843366",
    "2018367386",
    "2013676627",
    "2011342428",
    "2010528338",
    "2009184707",
    "2007938136",
    "2003667954",
    "1997059031",
    "1996182770",
    "1995905561",
    "1990299052",
    "1988607781",
    "1987899895",
    "1986085688",
    "1982356708",
    "1975670284",
    "1975200967",
    "1972648219",
    "1971673705",
    "1968963859",
    "1968354149",
    "1967667592",
    "1967312535",
    "1965317968",
    "1964145303",
    "1962069556",
    "1957519780",
    "1957519657",
    "1957427617",
    "1957028507",
    "1955301256",
    "1954861821",
    "1947916403",
    "1947592811",
    "1944308850",
    "1943729713",
    "1943378914",
    "1942795786",
    "1940241562",
    "1939149158",
    "1935651520",
    "1934821992",
    "1933715235",
    "1933273749",
    "1923423593",
    "1920336742",
    "1917987237",
    "1916896563",
    "1913860062",
    "1911237568",
    "1911179261",
    "1907664303",
    "1902119803",
    "1901894662",
    "1901432356",
    "1900512895",
    "1899170961"
];

  const SKIP_UID_LIST = ["2126778571","2123734088","2122399226","2122303995","2120622682","2119635314","2116112485","2110651686","2109954776","2109460166","2108069395","2108067510","2106123705","2103414932","2098864796","2091511343","2090934543","2087982487","2080037670","2079633303","2073240086","2070967743","2068743921","2067829993","2061757087","2061242085","2057430497","2056305440","2053256086","2051924409","2051820753","2050601450","2049074123","2047349217","2044660377","2043362247","2043096116","2041398955","2038581199","2035850413","2031779959","2029755611","2029402257","2029025543","2028137168","2027145784","2025641444","2019314761","2015961910","2015830806","2014263789","2008368632","2005777642","2003273565","2001137732","1997954325","1995519215","1994895860","1986965297","1980279334","1976393114","1973713908","1969058050","1968051086","1966653008","1962858385","1962532985","1960088239","1956116593","1956050956","1951428501","1951428104","1950082289","1947820020","1946296587","1943548950","1940123159","1939620797","1935551888","1933917231","1931975511","1927788713","1925750683","1923562081","1919722894","1913785599","1912551094","1912292921","1908879766","1907855458","1905480244","1901975833","1901175967","1901011785","1900902610","1898704360","1895701072","1895490883","1892505341","1890849414","1887136727","1887057098","1884704167","1883868942","1883743421","1883567539","1883484753","1882111586","1881411938","1881341357","1881293441","1880846109","1879393902","1878845261","1872204032","1870778318","1866370523","1857662541","1853609076","1853514252","1848512380","1847452236","1847430731","1842523538","1840898750","1840823274","1834340790","1826180524","1820927736","1820375835","1820095891","1817779260","1812718145","1811048227","1810457859","1804680038","1804259037","1803444988","1800774487","1799608227","1799082180","1797395970","1794390141","1792024836","1791750005","1790272633","1787459762","1786622008","1786258817","1785466502","1784277355","1783143478","1782984247","1779508000","1770804678","1769965217","1769332800","1769185028","1766930822","1762724093","1761988687","1753860621","1753852242","1751899572","1750311281","1744957171","1744456294","1743445486","1738768321","1736380168","1734436699","1733031002","1730374883","1727629712","1727484933","1723982021","1718588166","1715694160","1715542677","1715426003","1713968820","1713541944","1712702730","1712514193","1711697658","1707854433","1703825984","1702433697","1702004602","1698797673","1697967190","1691758735","1691457570","1691097327","1687509524","1686644053","1686424945","1683288764","1682114420","1680276814","1679071879","1677391501","1675714865","1675442378","1672306347","1671943000","1670679984","1666584555","1666250529","1664966833","1663318805","1663159809","1662225639","1658512277","1657885615","1657791867","1656604726","1656572031","1649944424","1648116312","1647607830","1641780377","1640087538","1637251161","1635907320","1635431833","1634600780","1634356790","1634084431","1633821016","1632662358","1631846696","1629173297","1628423096","1623748305","1622899127","1618673920","1618153486","1616757762","1615919512","1611058006","1609200971","1609198179","1603274845","1598860344","1598157493","1595938870","1594846756","1592682719","1592665724","1591952943","1590385294","1588156893","1587425647","1586006210","1585159539","1584340568","1581540645","1581245391","1579873986","1577897681","1577151898","1572327611","1572321657","1571839835","1570842543","1570653965","1570249928","1568905856","1565565327","1562835198","1561688368","1560036019","1559298200","1557618955","1551763261","1548708149","1546881775","1546531646","1539232877","1538083743","1537500391","1535200445","1533153017","1532286876","1531915372","1531522223","1524124284","1523555711","1523467415","1522710549","1522171169","1520072031","1519043670","1517635135","1515256896","1514965762","1513781848","1511594811","1508447792","1508058776","1506962221","1504948688","1502650582","1500491825","1500294490","1499763126","1498897181","1493853565","1491472930","1491405544","1489176190","1485094317","1482684222","1480456017","1480348523","1475082060","1474489699","1465220615","1460194940","1454963641","1452981079","1451835105","1447022166","1444635850","1444036909","1441171114","1439251357","1436975899","1436830829","1436468575","1433893098","1425971456","1424059156","1422859553","1421817128","1412692075","1408113989","1404995734","1403509297","1400825815","1400655388","1399745590","1398678991","1398474143","1397420031","1396773181","1391943047","1391357579","1388425890","1388192001","1387189068","1385696564","1384623392","1384252305","1383931937","1382088298","1382034436","1380041713","1378826231","1377341109","1376751253","1374755808","1372915476","1372626390","1371470076","1370708985","1368990375","1365995586","1365018205","1363874189","1361817007","1361409988","1359741449","1356901713","1354958427","1346611428","1344185903","1343783748","1343636846","1342731371","1341465131","1339261073","1334880383","1327840319","1318343290","1318178641","1318148297","1316941124","1313569179","1311931595","1311893765","1310859888","1309716196","1307290428","1304744193","1301842539","1300785370","1297384173","1295977360","1295850156","1291613551","1289530513","1289208382","1287688720","1277799342","1277416315","1276930512","1276240376","1276142007","1275288544","1273859311","1273536104","1271249317","1270534042","1267627855","1266904089","1262711142","1262047484","1261145503","1258409575","1257559828","1255981347","1255979297","1254744468","1252025454","1251173576","1244026741","1238862224","1236181064","1235809804","1235374280","1233553098","1228373081","1226512376","1225966367","1224709006","1224351462","1220614885","1220415427","1218235462","1218113298","1216553103","1215397197","1215021172","1213956883","1213790161","1213168830","1212630475","1210003121","1209993077","1209737000","1209560441","1207179571","1205462405","1203930564","1203312092","1202402507","1200898320","1199663383","1198286090","1197770508","1194387202","1192969929","1192662024","1189977209","1189726712","1185338832","1185073327","1180734735","1180332889","1172542189","1172205216","1170997504","1170859685","1170666908","1170561987","1169997661","1168398869","1168244742","1163599494","1162885050","1160114175","1159453297","1158399584","1158233285","1156714701","1153034227","1152698524","1151560690","1146064910","1146023114","1144391213","1144319983","1142861916","1142001188","1139328372","1138765049","1135092864","1131217175","1128954271","1126282568","1125671857","1124550734","1121467637","1116966360","1115571452","1112479633","1111754869","1111686426","1111266074","1110703253","1102661124","1101802479","1098327421","1096839646","1096086209","1093355507","1092993650","1092438346","1091712391","1090433311","1090066560","1086975298","1082879944","1081327612","1078624945","1078515470","1077841540","1076392127","1072245475","1072096667","1072024527","1069420832","1068952532","1068419836","1067616739","1067503922","1066125505","1063565121","1063281437","1059786351","1057928447","1056233229","1055771842","1053491740","1051470507","1051402550","1050695788","1050396492","1047672594","1047438287","1045897930","1044924253","1042116844","1042104034","1042060418","1040604809","1036147457","1031742642","1027333213","1025851445","1024445805","1022567723","1022483559","1018243777","1014428963","1011434553","1007668177","1005753333","1004615185","995420318","993951597","992179836","990858013","986915111","985088906","980034765","979773317","977381869","970488179","966356643","965395525","965221638","960334268","958216800","957903719","955383192","949536405","948803302","948199034","947684719","946339740","944375727","944109542","939902563","932880171","929613879","929288713","928643078","927592186","927351720","922318589","919136616","919129241","918433544","914084718","910433714","909642048","907325226","898533225","894521341","893175426","893120789","892701495","891868587","891265045","890038769","889306676","886074856","885418117","885119316","884548693","882691326","881462822","876624111","876074566","875372646","873784544","866425850","864909510","860657571","857986680","857809350","857794603","855367811","854089929","853880351","853695008","852781688","851450256","851444180","850197889","849144035","848319510","847652949","847615079","846731583","844529664","840620857","838767925","836969659","833550513","831515738","824524782","822047950","818707760","817756620","817444850","813725213","804319152","802622018","799315345","798936293","797841337","796243941","794762526","791622314","790843718","790792988","789152544","787391414","783729392","780937485","780216286","778702700","777142751","775977533","773441933","762584336","762389840","762182963","761801480","756501567","754814891","750117273","749593796","746256012","744341575","741624654","740856523","740299840","738247854","736734779","734865418","733883566","732291506","728892147","722296845","722139614","719031443","716711400","713629515","708458282","706598274","704181322","701515186","699548783","697717388","697432427","696184671","695889298","693893331","693246201","690925222","687362899","686222672","685789712","683941951","681980519","680331263","679798242","679626112","676975460","675418470","674728664","674503512","670363741","669732332","667154458","665738165","663210828","662039832","661616148","657121208","654417237","653789802","653228073","649873524","649184684","646628064","643702663","642453343","641418313","639368874","638599608","636928337","635415252","634440664","626759761","626598338","625961408","625363589","624958443","624947585","622486590","618016139","614466879","614034387","613462783","610975910","608003740","607272105","606130534","605980093","605459072","605035987","603920680","603898616","600160575","598542633","598459287","596666104","596351653","594100990","593156054","589682182","588985422","585501028","584966423","583887815","579774690","579523134","575646287","574735135","574667047","572314987","570868174","570598834","568925658","567872404","567382521","565547621","564851177","560816029","559365955","559336199","559143700","554605492","554369670","549430645","549289887","547645092","545246371","544584850","543162357","542195760","541196172","540053232","536327241","535217308","532671955","532497453","531066523","527065230","524066230","523799026","523177734","523032694","521415964","518228774","515671024","513427185","513337826","512943132","512819196","509856993","509456107","508305343","504500724","503023863","500419593","500367660","493211832","491343255","488281205","487943739","486235986","483527058","482643724","476428194","475784852","473403167","471994405","466565038","465261424","462891419","462845430","462552565","459503677","458846268","456411817","454881487","453757514","453038754","452729808","448758429","448326491","442354170","440356953","436184113","435634210","433599315","431803597","429269558","428040381","427688731","427020244","424486641","419719086","418745314","416851136","415928904","413016190","410748271","408469712","399793748","394533958","393775825","393749012","391624692","389700346","386880919","381317053","379852537","377112057","376788849","373991869","370368019","368204222","362364055","362300497","360203714","359075289","353226297","352113881","350988370","345953493","343009111","337323420","335952049","331119565","329960113","321815464","319904016","318418380","308026927","307159785","299912534","297114845","291611895","284259008","284178693","283466099","277990761","274245443","271583887","267959228","262059679","259782820","244332083","241200637","237565008","237252142","236642672","235328056","233060952","231691170","225215586","221262644","215692874","212339134","206464898","204034634","202433977","194464249","194298294","194298259","193534433","192914873","191381912","187277659","186812929","182321660","170405523","168226434","167198732","164986685","164747544","162477736","162442892","160385630","159491577","154956673","153687152","151591333","150260015","147997845","147552726","144869938","144130277","138649599","136611885","136232733","132870552","130711490","125314055","124598511","124249524","121792501","118811366","114851046","114675981","109366670","108712560","105162710","103926346","100522885","100318689","99604954","98919168","95531421","94660069","90610464","84893096","82411839","82185660","78195338","76481298","76259668","69200672","69078510","68462569","63300270","63139794","62752171","61119432","59590641","58043294","57924339","52635995","51355568","47529636","46275510","43588398","39959910","38678245","31745723","31262421","22025135","19472326","18312591","13901680","11251230","9024249","8712554","3634991","1636335","554741"];
  const SKIP_UID_SET = new Set(SKIP_UID_LIST.map(String));

  const NOTIFICATION_UID = "722118412";

  const GROUP_NAME_MAP = {
    "1": "اسکان و مواکب اربعین",
    "2": "بلیط شهرهای زیارتی",
    "3": "وام اربعین",
    "4": "مداحی",
    "5": "ازدواج",
    "6": "کافه 69",
    "7": "عربی"
  };

  // ══════════════════════════════════════════════════════════════
  // 🔔 بخش ۳: کلیدهای localStorage
  // ══════════════════════════════════════════════════════════════
  // کلید fallback وقتی toastی ظاهر نشود
  const NO_TOAST_KEY = 'no_toast';

  // آرایه‌ی شکست‌های متوالی
  const CONSECUTIVE_FAILED_UIDS_KEY = 'consecutive_failed_uids';

  // آستانه‌ی تعداد شکست متوالی برای ذخیره و ریست
  const CONSECUTIVE_FAILURE_THRESHOLD = 10;

  // زیررشته‌ای که در متن toast نشان می‌دهد به سقف روزانه رسیده‌ایم
  // مثال: "به سقف ۵۰ پیام"
  const LIMIT_REACHED_TOAST_SUBSTRING = 'به سقف ۵۰ پیام';

  // بعد از رسیدن به top of minute، این مقدار صبر اضافه می‌کنیم (میلی‌ثانیه)
  // مثال: 2000 = ۲ ثانیه بعد از XX:XX:00
  const MINUTE_SYNC_OFFSET_MS = 2000;

  // میانگین زمان مصرفی هر پیام (میلی‌ثانیه) — مثال: 1000 = ۱ ثانیه
  const AVERAGE_MS_PER_MESSAGE = 1000;

  // بعد از هر چند پیام، توقف طولانی (بازه‌ی تصادفی)
  // مثال: "20-30" → بعد از هر ۲۰ تا ۳۰ پیام
  const PAUSE_AFTER_N_MESSAGES_RANGE = "20-30";

  // مدت توقف طولانی (میلی‌ثانیه) — مثال: "1000-3000" = ۱ تا ۳ ثانیه
  const PAUSE_DURATION_RANGE = "1000-3000";

  const REDIRECT_AFTER_SEND_URL = 'https://web.bale.ai/flow';
  const DELAY_AFTER_REDIRECT = 10000;

  const POLL_INTERVAL = 1;
  const TIMEOUT_CONTACT_NAME = 20000;
  const TIMEOUT_MESSAGE_BOX = 20000;
  const TIMEOUT_SEND_BUTTON = 20000;
  const TIMEOUT_SCHEDULE_MODAL = 20000;
  const TIMEOUT_CONTEXT_MENU = 2000;
  const TIMEOUT_TOAST = 6000;

  const NAVIGATION_NAME_CHANGE_TIMEOUT_MS = 3000;

  const DELAY_AFTER_NAVIGATION_RANGE = "1-100";
  const DELAY_BEFORE_TYPING_RANGE = "1-100";
  const DELAY_BEFORE_SEND_RANGE = "1-100";
  const CHAR_TYPING_DELAY_RANGE = "0-0";

  const DELAY_BEFORE_DAY_SELECTION_RANGE   = "1-100";
  const DELAY_AFTER_DAY_SELECTION_RANGE    = "1-100";
  const DELAY_AFTER_HOUR_SELECTION_RANGE   = "1-100";
  const DELAY_AFTER_MINUTE_SELECTION_RANGE = "1-100";
  const DELAY_BEFORE_CONFIRM_RANGE         = "1-100";

  const MAX_CONFIRM_ADJUST_ATTEMPTS = 2;
  const DELETED_ACCOUNT_TEXT = 'حساب پاک';
  const CONFIRM_DISABLED_CLASS = 'hcBT7B';
  const CONFIRM_LABEL_HINT = 'ارسال';
  const MODAL_SETTLE_DELAY_MS = 200;
  const SAFE_MODAL_OPEN_SECOND_LIMIT = 57;
  const MAX_DEFERRED_QUEUE = 50;

  const MESSAGE_TEMPLATES = [
    `سلام name_of_contact، وقت بخیر 🙏
شما تو گروه «name_of_group» عضو هستید. اعضا یه گروه دیگه درست کردن، گفتیم به شما هم بگیم اگر دوست داشتید تشریف بیارید. البته خدمتتون عرض کنیم این گروه جدید ارتباطی با مدیران اون گروه نداره، ولی اعضا و موضوعش مثل همون گروهه.
اسم گروه *«حسینیه ایران»* هست و چون لینکش عمومی نیست، موقت هست و عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک موقت منقضی شده بود، آخرین لینک توی این کانال‌ها همیشه هست:
🔎 بله: ble.ir/Hosseiniyeh_iran
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

خوشحال میشیم کنار بقیه اعضا ببینیمتون.`,

    `سلام name_of_contact، وقت شما بخیر 🙏
تو گروه «name_of_group» با شما هم‌گروه بودیم. چند نفر از اعضا یه گروه جدید راه انداختن و گفتیم این موضوع رو به شما هم اطلاع بدیم، اگه مایل بودید تشریف بیارید. فقط بدونید این گروه جدید هیچ ربطی به مدیران گروه قبلی نداره، اما موضوع و جمع اعضاش همون‌جوره.
اسمش *«حسینیه ایران»* هست. لینکش هم چون عمومی نیست موقته و هر چند وقت عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه این لینک دیگه کار نکرد، آخرین لینک توی این کانال‌ها موجوده:
🔎 بله: ble.ir/iran_hosseiniyeh
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم ببینیمتون.`,

    `سلام name_of_contact، احتراماً 🙏
شما از اعضای گروه «name_of_group» هستید. بچه‌های گروه یه گروه جدید ساختن و گفتن به شما هم اطلاع بدیم. عرض کنیم این گروه جدید به مدیران گروه قبلی ارتباطی نداره، ولی مثل همون گروه، اعضا و موضوعش همونه.
اسم گروه *«حسینیه ایران»* هست. چون لینک عمومی نیست، موقت هست و عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک بالا منقضی شده بود، آخرین لینک رو توی این کانال‌ها ببینید:
🔎 بله: ble.ir/iran_heroes
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

خوشحال میشیم حضور داشته باشید.`,

    `سلام name_of_contact، وقت بخیر 🙏
شما عضو گروه «name_of_group» هستید. چند نفر از اعضا یه گروه دیگه راه انداختن و گفتیم به شما هم بگیم، اگه دوست داشتید بیاید. این گروه جدید به مدیران گروه قبلی ربطی نداره، ولی جمع و موضوعش مثل همونه.
اسم گروه *«حسینیه ایران»* هست. چون لینکش عمومی نیست، موقته و عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه این لینک منقضی شد، آخرین لینک توی این کانال‌ها همیشه هست:
🔎 بله: ble.ir/Hosseiniyeh_iran
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم در کنار هم باشیم.`,

    `سلام name_of_contact، وقت شما بخیر 🙏
شما توی گروه «name_of_group» با ما بودید. اعضا یه گروه جدید درست کردن و گفتیم به شما هم خبر بدیم. توجه داشته باشید این گروه جدید ارتباطی با مدیران اون گروه نداره، ولی مثل همون‌جاست.
اسم گروه *«حسینیه ایران»* هست و لینکش هم چون عمومی نیست، موقت و متغیره.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک موقت منقضی شده بود، آخرین لینک توی این کانال‌ها قرار داره:
🔎 بله: ble.ir/iran_hosseiniyeh
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم شما رو ببینیم.`,

    `سلام name_of_contact، ارادت داریم 🙏
شما عضو گروه «name_of_group» هستید. اعضا تصمیم گرفتن یه گروه جدید کنارش راه بندازن، گفتیم به شما هم بگیم اگه مایل بودید تشریف بیارید. این گروه جدید به مدیران گروه قبلی کاری نداره، ولی موضوع و اعضاش مثل همونه.
اسم گروه *«حسینیه ایران»* هست. لینک گروه عمومی نیست، پس موقته و عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه این لینک کار نکرد، آخرین لینک توی این کانال‌ها همیشه در دسترسه:
🔎 بله: ble.ir/iran_heroes
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

خوشحال میشیم کنارتون باشیم.`,

    `سلام name_of_contact، وقت بخیر 🙏
شما از اعضای گروه «name_of_group» هستید. بچه‌ها یه گروه جدید ساختن و گفتن به شما هم اطلاع بدیم. عرض کنیم این گروه جدید ارتباطی به مدیران گروه قبلی نداره، ولی مثل همون گروه، اعضا و موضوعش همونه.
اسم گروه *«حسینیه ایران»* هست. چون لینک عمومی نیست، موقت هست و تغییر می‌کنه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک موقت بالا منقضی شده بود، آخرین لینک توی این کانال‌ها هست:
🔎 بله: ble.ir/Hosseiniyeh_iran
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

خوشحال میشیم ببینیمتون.`,

    `سلام name_of_contact، وقت شما بخیر 🙏
شما تو گروه «name_of_group» عضو هستید. چند نفر از اعضا یه گروه جدید راه انداختن، گفتیم به شما هم بگیم. فقط بدونید این گروه به مدیران گروه قبلی ربطی نداره، ولی اعضا و موضوعش مثل همون‌جاست.
اسم گروه *«حسینیه ایران»* هست و لینکش چون عمومی نیست، موقت و متغیره.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک بالا منقضی شده، آخرین لینک توی این کانال‌ها همیشه هست:
🔎 بله: ble.ir/iran_hosseiniyeh
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم در خدمتتون باشیم.`,

    `سلام name_of_contact، احتراماً 🙏
شما عضو گروه «name_of_group» هستید. اعضا یه گروه جدید درست کردن و گفتن به شما هم بگیم اگه دوست داشتید تشریف بیارید. توجه کنید این گروه جدید به مدیران گروه قبلی ارتباطی نداره، ولی مثل همون گروهه.
اسم گروه *«حسینیه ایران»* هست. چون لینک عمومی نیست، موقت هست و هر چند وقت عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه این لینک کار نکرد، آخرین لینک توی این کانال‌ها قرار داره:
🔎 بله: ble.ir/iran_heroes
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

خوشحال میشیم کنار هم باشیم.`,

    `سلام name_of_contact، وقت بخیر 🙏
شما توی گروه «name_of_group» با ما بودید. اعضا یه گروه جدید راه انداختن، گفتیم این موضوع رو به شما هم بگیم. عرض کنیم این گروه به مدیران گروه قبلی ربطی نداره، ولی موضوع و جمعش مثل همونه.
اسم گروه *«حسینیه ایران»* هست. لینک گروه عمومی نیست، پس موقت و متغیره.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک موقت منقضی شد، آخرین لینک توی این کانال‌ها موجوده:
🔎 بله: ble.ir/Hosseiniyeh_iran
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم ببینیمتون.`,

    `سلام name_of_contact، وقت شما بخیر 🙏
شما عضو گروه «name_of_group» هستید. بچه‌ها یه گروه جدید ساختن و گفتیم به شما هم اطلاع بدیم. توجه داشته باشید این گروه جدید ارتباطی با مدیران گروه قبلی نداره، ولی مثل همون‌جاست.
اسم گروه *«حسینیه ایران»* هست. لینکش هم چون عمومی نیست، موقته و عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه این لینک منقضی شده بود، آخرین لینک توی این کانال‌ها همیشه هست:
🔎 بله: ble.ir/iran_hosseiniyeh
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم در کنار هم باشیم.`,

    `سلام name_of_contact، ارادت داریم 🙏
شما از اعضای گروه «name_of_group» هستید. چند نفر از اعضا یه گروه جدید راه انداختن، گفتیم به شما هم بگیم. فقط بدونید این گروه به مدیران گروه قبلی کاری نداره، ولی مثل همون گروه، اعضا و موضوعش همونه.
اسم گروه *«حسینیه ایران»* هست. چون لینک عمومی نیست، موقت هست و تغییر می‌کنه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک بالا کار نکرد، آخرین لینک توی این کانال‌ها در دسترسه:
🔎 بله: ble.ir/iran_heroes
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

خوشحال میشیم کنارتون باشیم.`,

    `سلام name_of_contact، وقت بخیر 🙏
شما تو گروه «name_of_group» عضو هستید. اعضا یه گروه جدید ساختن، گفتیم به شما هم بگیم اگه دوست داشتید بیاید. خدمتتون عرض کنیم این گروه جدید ارتباطی به مدیران گروه قبلی نداره، ولی موضوع و اعضاش مثل همونه.
اسم گروه *«حسینیه ایران»* هست. لینک گروه چون عمومی نیست، موقت و متغیره.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه این لینک کار نکرد، آخرین لینک توی این کانال‌ها همیشه هست:
🔎 بله: ble.ir/Hosseiniyeh_iran
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم ببینیمتون.`,

    `سلام name_of_contact، احتراماً 🙏
شما عضو گروه «name_of_group» هستید. چند نفر از بچه‌ها یه گروه جدید درست کردن، گفتیم به شما هم اطلاع بدیم. توجه کنید این گروه جدید ارتباطی با مدیران گروه قبلی نداره، ولی مثل همون گروهه.
اسم گروه *«حسینیه ایران»* هست. لینکش چون عمومی نیست، موقت هست و عوض میشه.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه لینک موقت منقضی شده بود، آخرین لینک توی این کانال‌ها قرار داره:
🔎 بله: ble.ir/iran_hosseiniyeh
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

خوشحال میشیم در خدمتتون باشیم.`,

    `سلام name_of_contact، وقت شما بخیر 🙏
شما تو گروه «name_of_group» با ما بودید. اعضا یه گروه جدید راه انداختن، گفتیم به شما هم بگیم. فقط بدونید این گروه به مدیران گروه قبلی ارتباطی نداره، اما موضوع و اعضاش مثل همونه.
اسم گروه *«حسینیه ایران»* هست. لینک گروه عمومی نیست، پس موقت و متغیره.
لینک گروه *«حسینیه ایران»* _{موقت}_:
✨ ble.ir/join/AL3qEpYS7M
اگه این لینک منقضی شد، آخرین لینک توی این کانال‌ها در دسترسه:
🔎 بله: ble.ir/iran_heroes
🔎 روبیکا: rubika.ir/iran_hosseiniyeh
🔎 تلگرام: t.me/iran_hosseiniyeh

امیدواریم کنار هم باشیم.`
  ];

  function validateRange(name, val, minAllowed) {
    if (typeof val !== 'string') return `${name} باید رشته باشد (فرمت "min-max" یا "x").`;
    const parts = val.split('-');
    if (parts.length > 2) return `${name} فرمت نامعتبر: "${val}".`;
    const min = parseInt(parts[0], 10);
    const max = parts.length > 1 ? parseInt(parts[1], 10) : min;
    if (isNaN(min) || isNaN(max)) return `${name} شامل عدد نامعتبر: "${val}".`;
    if (min < 0 || max < 0) return `${name} نباید منفی باشد: "${val}".`;
    if (min > max) return `${name} min > max: "${val}".`;
    if (minAllowed !== undefined && min < minAllowed) return `${name} حداقل باید ${minAllowed} باشد: "${val}".`;
    return null;
  }

  function validateConfig() {
    const errors = [];

    if (!Array.isArray(TARGET_UID_LIST) || TARGET_UID_LIST.length === 0) {
      errors.push('TARGET_UID_LIST باید یک آرایه‌ی غیرخالی باشد.');
      return errors;
    }

    if (typeof GROUP_NAME_MAP !== 'object' || GROUP_NAME_MAP === null || Object.keys(GROUP_NAME_MAP).length === 0) {
      errors.push('GROUP_NAME_MAP باید یک آبجکت غیرخالی باشد.');
      return errors;
    }

    const firstItem = String(TARGET_UID_LIST[0]);
    if (!Object.prototype.hasOwnProperty.call(GROUP_NAME_MAP, firstItem)) {
      errors.push(`اولین عضو TARGET_UID_LIST باید یک marker باشد. مقدار فعلی: "${firstItem}"`);
    }

    if (!Number.isInteger(MAX_DEFERRED_QUEUE) || MAX_DEFERRED_QUEUE <= 0) {
      errors.push(`MAX_DEFERRED_QUEUE باید عدد صحیح مثبت باشد. مقدار فعلی: ${MAX_DEFERRED_QUEUE}`);
    }

    if (!Number.isInteger(CONSECUTIVE_FAILURE_THRESHOLD) || CONSECUTIVE_FAILURE_THRESHOLD <= 0) {
      errors.push(`CONSECUTIVE_FAILURE_THRESHOLD باید عدد صحیح مثبت باشد. مقدار فعلی: ${CONSECUTIVE_FAILURE_THRESHOLD}`);
    }

    if (!Number.isInteger(NAVIGATION_NAME_CHANGE_TIMEOUT_MS) || NAVIGATION_NAME_CHANGE_TIMEOUT_MS <= 0) {
      errors.push(`NAVIGATION_NAME_CHANGE_TIMEOUT_MS باید عدد صحیح مثبت باشد. مقدار فعلی: ${NAVIGATION_NAME_CHANGE_TIMEOUT_MS}`);
    }

    if (typeof NOTIFICATION_UID !== 'string' || NOTIFICATION_UID.length === 0) {
      errors.push('NOTIFICATION_UID باید یک رشته‌ی غیرخالی باشد.');
    }

    if (!Array.isArray(MESSAGE_TEMPLATES) || MESSAGE_TEMPLATES.length === 0) {
      errors.push('MESSAGE_TEMPLATES باید یک آرایه‌ی غیرخالی باشد.');
    } else {
      MESSAGE_TEMPLATES.forEach((tpl, i) => {
        if (typeof tpl !== 'string') { errors.push(`تمپلیت #${i + 1} رشته نیست.`); return; }
        if (!tpl.includes('name_of_contact')) errors.push(`تمپلیت #${i + 1} شامل "name_of_contact" نیست.`);
      });
    }

    const rangesToCheck = {
      'PAUSE_AFTER_N_MESSAGES_RANGE':      { val: PAUSE_AFTER_N_MESSAGES_RANGE, min: 1 },
      'PAUSE_DURATION_RANGE':              { val: PAUSE_DURATION_RANGE },
      'DELAY_AFTER_NAVIGATION_RANGE':      { val: DELAY_AFTER_NAVIGATION_RANGE },
      'DELAY_BEFORE_TYPING_RANGE':         { val: DELAY_BEFORE_TYPING_RANGE },
      'DELAY_BEFORE_SEND_RANGE':           { val: DELAY_BEFORE_SEND_RANGE },
      'CHAR_TYPING_DELAY_RANGE':           { val: CHAR_TYPING_DELAY_RANGE },
      'DELAY_BEFORE_DAY_SELECTION_RANGE':  { val: DELAY_BEFORE_DAY_SELECTION_RANGE },
      'DELAY_AFTER_DAY_SELECTION_RANGE':   { val: DELAY_AFTER_DAY_SELECTION_RANGE },
      'DELAY_AFTER_HOUR_SELECTION_RANGE':  { val: DELAY_AFTER_HOUR_SELECTION_RANGE },
      'DELAY_AFTER_MINUTE_SELECTION_RANGE':{ val: DELAY_AFTER_MINUTE_SELECTION_RANGE },
      'DELAY_BEFORE_CONFIRM_RANGE':        { val: DELAY_BEFORE_CONFIRM_RANGE },
    };
    for (const [name, { val, min }] of Object.entries(rangesToCheck)) {
      const err = validateRange(name, val, min);
      if (err) errors.push(err);
    }

    const numericChecks = {
      'MINUTE_SYNC_OFFSET_MS':  MINUTE_SYNC_OFFSET_MS,
      'AVERAGE_MS_PER_MESSAGE': AVERAGE_MS_PER_MESSAGE,
      'DELAY_AFTER_REDIRECT':   DELAY_AFTER_REDIRECT,
      'POLL_INTERVAL':          POLL_INTERVAL,
      'TIMEOUT_CONTACT_NAME':   TIMEOUT_CONTACT_NAME,
      'TIMEOUT_MESSAGE_BOX':    TIMEOUT_MESSAGE_BOX,
      'TIMEOUT_SEND_BUTTON':    TIMEOUT_SEND_BUTTON,
      'TIMEOUT_SCHEDULE_MODAL': TIMEOUT_SCHEDULE_MODAL,
      'TIMEOUT_CONTEXT_MENU':   TIMEOUT_CONTEXT_MENU,
      'TIMEOUT_TOAST':          TIMEOUT_TOAST,
    };
    for (const [name, val] of Object.entries(numericChecks)) {
      if (typeof val !== 'number' || isNaN(val) || val < 0) {
        errors.push(`${name} باید عدد غیرمنفی باشد. مقدار فعلی: ${val}`);
      }
    }

    if (typeof REDIRECT_AFTER_SEND_URL !== 'string' || !/^https?:\/\//.test(REDIRECT_AFTER_SEND_URL)) {
      errors.push('REDIRECT_AFTER_SEND_URL باید یک URL معتبر باشد.');
    }

    const realUIDs = TARGET_UID_LIST
      .map(String)
      .filter(x => !Object.prototype.hasOwnProperty.call(GROUP_NAME_MAP, x))
      .filter(x => x !== NOTIFICATION_UID)
      .filter(x => !SKIP_UID_SET.has(x));
    if (realUIDs.length === 0) {
      errors.push('بعد از فیلتر، هیچ UID واقعی برای ارسال باقی نمی‌ماند.');
    }

    return errors;
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let stopRequested = false;
  window.stopSending = () => {
    stopRequested = true;
    L('🛑 Stop requested by user.');
  };

  function interruptibleSleep(ms) {
    if (ms <= 300) return sleep(ms);
    return new Promise(resolve => {
      const start = Date.now();
      const tick = () => {
        if (stopRequested) return resolve('stopped');
        const remaining = ms - (Date.now() - start);
        if (remaining <= 0) return resolve('done');
        setTimeout(tick, Math.min(150, remaining));
      };
      tick();
    });
  }

  function getRandomDelay(rangeStr) {
    const parts = String(rangeStr).split('-');
    const min = parseInt(parts[0], 10);
    const max = parts.length > 1 ? parseInt(parts[1], 10) : min;
    if (isNaN(min) || isNaN(max)) return 1000;
    if (min === max) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function randomDelay(rangeStr, label) {
    const val = getRandomDelay(rangeStr);
    L(`⏱  ${label} = ${val} ms (range: ${rangeStr})`);
    await interruptibleSleep(val);
    return val;
  }

  function isElementVisible(el) {
    if (!el || !el.isConnected) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    return true;
  }

  async function waitForElement(selector, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (stopRequested) throw new Error('Stopped by user');
      const el = document.querySelector(selector);
      if (isElementVisible(el)) return el;
      await sleep(POLL_INTERVAL);
    }
    throw new Error(`Timeout waiting for ${selector}`);
  }

  function navigateToURL(url) {
    history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function navigateToContact(uid) {
    navigateToURL(`https://web.bale.ai/chat?uid=${uid}`);
  }

  async function navigateAndWaitForContact(uid, delayLabel) {
    const oldEl = document.querySelector('.nMlHDG');
    const oldText = oldEl ? (oldEl.textContent || '').trim() : '';

    navigateToContact(uid);
    await randomDelay(DELAY_AFTER_NAVIGATION_RANGE, delayLabel);

    const start = Date.now();
    while (Date.now() - start < NAVIGATION_NAME_CHANGE_TIMEOUT_MS) {
      if (stopRequested) throw new Error('Stopped by user');
      const el = document.querySelector('.nMlHDG');
      if (el && isElementVisible(el)) {
        const txt = (el.textContent || '').trim();
        if (txt !== oldText) return txt;
      }
      await sleep(POLL_INTERVAL);
    }

    const el = document.querySelector('.nMlHDG');
    if (el && el.isConnected && isElementVisible(el)) {
      const txt = (el.textContent || '').trim();
      W(`   ⚠️  Contact name did not change after navigation to ${uid} within ${NAVIGATION_NAME_CHANGE_TIMEOUT_MS} ms (name: "${txt}") — proceeding anyway.`);
      return txt;
    }

    throw new Error(`Timeout waiting for contact name after navigation to ${uid}`);
  }

  function formatTimeHMS(date) {
    const p = n => String(n).padStart(2, '0');
    return `${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
  }

  async function setMessageText(text) {
    const editable = document.querySelector('#editable-message-text');
    if (!editable) throw new Error('Message box not found.');
    editable.focus();
    editable.textContent = '';
    if (CHAR_TYPING_DELAY_RANGE === "0-0") {
      L(`⌨️  Pasting whole message (char delay = 0, paste mode)`);
      editable.textContent = text;
      editable.dispatchEvent(new InputEvent('input', { bubbles: true }));
      return;
    }
    L(`⌨️  Typing message char-by-char (char delay range: ${CHAR_TYPING_DELAY_RANGE})`);
    for (const char of text) {
      editable.textContent += char;
      editable.dispatchEvent(new InputEvent('input', { bubbles: true }));
      await sleep(getRandomDelay(CHAR_TYPING_DELAY_RANGE));
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 🍞 بخش جدید: تشخیص هوشمند toast با id
  // ══════════════════════════════════════════════════════════════
  // نکات کلیدی:
  //   • هر toast یه id عددی افزایشی داره (13، 14، 15، ...)
  //   • جدیدترین toast آخرین child در container هست (پایین‌ترین)
  //   • متن toast یه textNode مستقیم فرزند div اصلی toast هست
  //   • بنابراین با ذخیره‌ی بزرگ‌ترین id موجود و صبر برای id جدید،
  //     دقیقاً toast مربوط به این کلیک را تشخیص می‌دهیم.
  // ─────────────────────────────────────────────────────────────

  function getCurrentMaxToastId() {
    const toasts = document.querySelectorAll('.Toastify__toast');
    let maxId = 0;
    for (const t of toasts) {
      const idNum = parseInt(t.id, 10);
      if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
    }
    return maxId;
  }

  function extractToastText(toastEl) {
    if (!toastEl) return '';
    for (const node of toastEl.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = (node.textContent || '').trim();
        if (txt) return txt;
      }
    }
    return '';
  }

  async function waitForNewToast(previousMaxId, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (stopRequested) return null;
      const toasts = document.querySelectorAll('.Toastify__toast');
      let best = null;
      for (const t of toasts) {
        const idNum = parseInt(t.id, 10);
        if (!isNaN(idNum) && idNum > previousMaxId) {
          const text = extractToastText(t);
          if (text && (!best || idNum > best.id)) {
            best = { id: idNum, text };
          }
        }
      }
      if (best) return best;
      await sleep(50);
    }
    return null;
  }

  function isConfirmDisabled(btn) {
    return !!(btn && btn.classList && btn.classList.contains(CONFIRM_DISABLED_CLASS));
  }

  function isConfirmLabelValid(btn) {
    if (!btn) return false;
    const txt = (btn.textContent || '').trim();
    return txt.includes(CONFIRM_LABEL_HINT) && /[۰-۹0-9]/.test(txt);
  }

  async function waitForSafeModalWindow() {
    const now = new Date();
    const s = now.getSeconds();
    if (s >= SAFE_MODAL_OPEN_SECOND_LIMIT) {
      const waitMs = (60 - s) * 1000 - now.getMilliseconds() + MINUTE_SYNC_OFFSET_MS;
      L(`   ⏳ Too close to minute boundary (sec=${s}) — waiting ${waitMs} ms before opening modal...`);
      await interruptibleSleep(waitMs);
    }
  }

  async function scheduleCurrentChat() {
    await waitForSafeModalWindow();

    const sendBtn = await waitForElement('[aria-label="send-button"]', TIMEOUT_SEND_BUTTON);
    const rect = sendBtn.getBoundingClientRect();
    sendBtn.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true, cancelable: true, button: 2, buttons: 2,
      clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2,
    }));
    await sleep(700);

    await waitForElement('#context-menu-content', TIMEOUT_CONTEXT_MENU);
    let menuItem = null;
    for (const item of document.querySelectorAll('#context-menu-content > div > div')) {
      if (item.textContent.includes('زمان‌بندی پیام')) { menuItem = item; break; }
    }
    if (!menuItem) {
      L(`   ⚠️  Schedule menu item not found.`);
      closeOpenModal();
      return { ok: false, toast: null, limitReached: false };
    }
    menuItem.click();
    await sleep(1200);

    await waitForElement('[data-testid="confirm-button"]', TIMEOUT_SCHEDULE_MODAL);
    await sleep(MODAL_SETTLE_DELAY_MS);

    let confirmBtn = document.querySelector('[data-testid="confirm-button"]');
    if (!confirmBtn) {
      L(`   ⚠️  Confirm button not found after settle.`);
      closeOpenModal();
      return { ok: false, toast: null, limitReached: false };
    }

    if (isConfirmDisabled(confirmBtn) || !isConfirmLabelValid(confirmBtn)) {
      L(`   ⚠️  Confirm disabled or invalid — closing and deferring.`);
      closeOpenModal();
      await sleep(300);
      return { ok: false, toast: null, limitReached: false };
    }

    L(`   ⚡ Confirm ready — clicking immediately.`);

    const previousMaxId = getCurrentMaxToastId();
    L(`   🍞 Previous max toast id = ${previousMaxId}`);

    confirmBtn = document.querySelector('[data-testid="confirm-button"]');
    if (!confirmBtn) {
      L(`   ⚠️  Confirm button lost before click.`);
      closeOpenModal();
      return { ok: false, toast: null, limitReached: false };
    }
    L(`   🔘 Confirm label: "${confirmBtn.textContent.trim()}"`);
    confirmBtn.click();

    const newToast = await waitForNewToast(previousMaxId, TIMEOUT_TOAST);
    if (newToast) {
      const isLimitReached = newToast.text.includes(LIMIT_REACHED_TOAST_SUBSTRING);
      L(`   🍞 New toast [id=${newToast.id}]: "${newToast.text}"${isLimitReached ? ' [LIMIT REACHED]' : ''}`);
      return { ok: !isLimitReached, toast: newToast.text, limitReached: isLimitReached };
    }

    L(`   ⚠️  No new toast after click — deferring.`);
    return { ok: false, toast: null, limitReached: false };
  }

  function closeOpenModal() {
    try {
      document.body.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true,
      }));
    } catch (e) {}
  }

  function loadJSON(key, def) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; }
    catch (e) { return def; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function addUIDToArray(key, uid) {
    const k = String(key);
    const list = loadJSON(k, []);
    if (!list.includes(uid)) { list.push(uid); saveJSON(k, list); }
  }

  // ── حذف یک UID از آرایه (بدون تغییر در ساختار بقیه) ──
  function removeUIDFromArray(key, uid) {
    const k = String(key);
    const u = String(uid);
    const list = loadJSON(k, []);
    const filtered = list.filter(x => x !== u);
    saveJSON(k, filtered);
    return filtered;
  }

  // ── محاسبه‌ی زمان «دقیقه‌ی بعد + آفست» برای فلاش بعدی deferred ──
  function getNextMinuteFlushTime() {
    const now = new Date();
    const target = new Date(now);
    target.setSeconds(0, 0);
    target.setMinutes(target.getMinutes() + 1);
    target.setMilliseconds(MINUTE_SYNC_OFFSET_MS);
    return target.getTime();
  }

  function appendToConsecutiveFailedUIDs(uids) {
    const key = CONSECUTIVE_FAILED_UIDS_KEY;
    const list = loadJSON(key, []);
    for (const uid of uids) {
      if (!list.includes(uid)) list.push(uid);
    }
    saveJSON(key, list);
  }

  window.getToastArrays = function() {
    const result = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const val = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(val)) result[key] = val;
      } catch (e) {}
    }
    console.log(JSON.stringify(result, null, 2));
    if (navigator.clipboard) navigator.clipboard.writeText(JSON.stringify(result));
    return result;
  };

  window.getToastArray = function(text) {
    const list = loadJSON(String(text), []);
    console.log(JSON.stringify(list));
    if (navigator.clipboard) navigator.clipboard.writeText(JSON.stringify(list));
    return list;
  };

  window.clearToastArray = function(text) {
    localStorage.removeItem(String(text));
    L(`Array "${text}" cleared.`);
    return [];
  };

  window.removeUIDFromToastArray = function(text, uid) {
    const list = removeUIDFromArray(String(text), String(uid));
    L(`UID ${uid} removed from "${text}".`);
    return list;
  };

  window.clearAllToastArrays = function() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const val = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(val)) keysToRemove.push(key);
      } catch (e) {}
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    L(`Cleared ${keysToRemove.length} toast arrays.`);
    return keysToRemove;
  };

  window.downloadToastArray = function(text) {
    const list = loadJSON(String(text), []);
    if (!list.length) { L(`"${text}" is empty.`); return; }
    const blob = new Blob([JSON.stringify(list)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${text.replace(/[^\w\u0600-\u06FF]/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    L(`Downloaded "${text}" (${list.length}).`);
  };

  window.getConsecutiveFailedUIDs = function() {
    const list = loadJSON(CONSECUTIVE_FAILED_UIDS_KEY, []);
    console.log(JSON.stringify(list));
    if (navigator.clipboard) navigator.clipboard.writeText(JSON.stringify(list));
    return list;
  };

  window.clearConsecutiveFailedUIDs = function() {
    localStorage.removeItem(CONSECUTIVE_FAILED_UIDS_KEY);
    L(`Consecutive failed UIDs array cleared.`);
    return [];
  };

  // ══════════════════════════════════════════════════════════════
  // ⏳ بخش جدید: حلقه‌ی صبر و تلاش دوباره پس از رسیدن به سقف
  // ══════════════════════════════════════════════════════════════
  // وقتی toast «به سقف ۵۰ پیام» ظاهر می‌شود، دیگر نمی‌توان پیام زمان‌بندی
  // کرد تا دقیقه‌ی بعد (زمان ارسال پیام‌های زمان‌بندی‌شده‌ی قبلی).
  // این تابع:
  //   ۱) صبر می‌کند تا دقیقه‌ی بعد + MINUTE_SYNC_OFFSET_MS
  //   ۲) دوباره به چت UID می‌رود و پیام را تایپ می‌کند
  //   ۳) دوباره تلاش برای زمان‌بندی می‌کند
  //   ۴) اگر باز هم سقف خورد، این چرخه تکرار می‌شود
  // خروجی: { ok, toast, retries, stopped }
  // ─────────────────────────────────────────────────────────────
  async function runLimitRetryLoop(uid, finalMessage, logLabel) {
    let retries = 0;
    while (!stopRequested) {
      retries++;
      L(`   🚫 Limit reached — waiting for next minute (retry #${retries})...`);

      // صبر تا شروع دقیقه‌ی بعد + آفست
      await waitUntilTopOfMinuteWithOffset();

      if (stopRequested) return { ok: false, toast: null, retries, stopped: true };

      try {
        await navigateAndWaitForContact(uid, `Delay after navigation (${logLabel} limit retry #${retries})`);
        await waitForElement('#editable-message-text', TIMEOUT_MESSAGE_BOX);
        await randomDelay(DELAY_BEFORE_TYPING_RANGE, `Delay before typing (${logLabel} limit retry #${retries})`);
        await setMessageText(finalMessage);
        await randomDelay(DELAY_BEFORE_SEND_RANGE, `Delay before send (${logLabel} limit retry #${retries})`);

        const result = await scheduleCurrentChat();

        if (result.ok && result.toast && !result.limitReached) {
          return { ok: true, toast: result.toast, retries, stopped: false };
        }

        if (result.limitReached) {
          // ادامه‌ی حلقه → دوباره صبر و تلاش
          continue;
        }

        // خطای دیگر (مثلاً toast ناخواسته یا شکست مودال)
        return { ok: false, toast: null, retries, stopped: false };
      } catch (e) {
        W(`   ❌ ${logLabel} limit retry error: ${e.message}`);
        closeOpenModal();
        return { ok: false, toast: null, error: e.message, retries, stopped: false };
      }
    }
    return { ok: false, toast: null, retries, stopped: true };
  }

  // ══════════════════════════════════════════════════════════════
  // 📨 بخش ۸: ارسال پیام فوری نوتیفیکیشن
  // ══════════════════════════════════════════════════════════════
  async function sendImmediateMessage(targetUID, messageText) {
    if (!targetUID) return false;
    try {
      L(`\n📨 Sending immediate notification to UID ${targetUID}...`);
      const contactName = await navigateAndWaitForContact(targetUID, 'Delay after navigation (notification)');
      L(`   👤 Notification chat loaded — name: "${contactName}".`);

      await waitForElement('#editable-message-text', TIMEOUT_MESSAGE_BOX);
      await randomDelay(DELAY_BEFORE_TYPING_RANGE, 'Delay before typing (notification)');
      await setMessageText(messageText);

      await randomDelay(DELAY_BEFORE_SEND_RANGE, 'Delay before send (notification)');

      const sendButton = await waitForElement('[aria-label="send-button"]', TIMEOUT_SEND_BUTTON);
      sendButton.click();
      L(`   ✅ Notification sent to ${targetUID}.`);

      await randomDelay(DELAY_AFTER_NAVIGATION_RANGE, 'Delay after notification');
      return true;
    } catch (e) {
      W(`   ⚠️  Notification failed: ${e.message}`);
      closeOpenModal();
      return false;
    }
  }

  // ساخت متن نوتیفیکیشن پیشرفت — حالا به صورت scheduled/total
  function buildProgressNotification(scheduled, total, failed, deferred, lastUID, isFinal) {
    const lines = [
      `🔔 گزارش پیشرفت${isFinal ? ' (تمام)' : ''}`,
      `📊 Scheduled: ${scheduled}/${total}`,
      `❌ Failed: ${failed}`,
      `📌 Deferred: ${deferred}`,
      `🎯 Last UID: ${lastUID || 'N/A'}`,
      `🕐 Time: ${formatTimeHMS(new Date())}`,
    ];
    return lines.join('\n');
  }

  L('═══════════════════════════════════════════════');
  L('🚀 Scheduled Message Operation — Start');
  L('═══════════════════════════════════════════════');

  L('🔍 Validating configuration...');
  const validationErrors = validateConfig();
  if (validationErrors.length > 0) {
    E('❌ Configuration validation failed:');
    validationErrors.forEach(err => E(`   • ${err}`));
    E('🛑 Aborting. No action was performed.');
    return;
  }
  L('✅ Configuration is valid.');

  const cleanedList = TARGET_UID_LIST.map(String).filter(item => {
    const isMarker = Object.prototype.hasOwnProperty.call(GROUP_NAME_MAP, item);
    if (isMarker) return true;
    if (item === NOTIFICATION_UID) return false;
    return !SKIP_UID_SET.has(item);
  });

  const realUIDCount = cleanedList.filter(x => !Object.prototype.hasOwnProperty.call(GROUP_NAME_MAP, x)).length;
  const markerCount  = cleanedList.length - realUIDCount;

  L(`📋 Raw list size         : ${TARGET_UID_LIST.length}`);
  L(`📋 After skip filter     : ${cleanedList.length} (markers: ${markerCount}, real UIDs: ${realUIDCount})`);
  L(`📨 Templates available   : ${MESSAGE_TEMPLATES.length}`);
  L(`🏷️  Markers defined       : ${Object.keys(GROUP_NAME_MAP).length}`);
  L(`🔄 Deferred queue max     : ${MAX_DEFERRED_QUEUE}`);
  L(`🛡️  Safe window limit     : sec >= ${SAFE_MODAL_OPEN_SECOND_LIMIT} → wait`);
  L(`🔔 Notification UID      : ${NOTIFICATION_UID}`);
  L(`🆘 Consecutive fail limit: ${CONSECUTIVE_FAILURE_THRESHOLD}`);
  L(`🧭 Nav name-change wait   : ${NAVIGATION_NAME_CHANGE_TIMEOUT_MS} ms`);
  L(`🍞 Toast detection        : by incremental id`);
  L(`🚫 Limit substring        : "${LIMIT_REACHED_TOAST_SUBSTRING}"`);

  async function waitUntilTopOfMinuteWithOffset() {
    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + MINUTE_SYNC_OFFSET_MS;
    const targetTime = new Date(Date.now() + msToNextMinute);
    L(`⏳ Syncing to top of minute — waiting ${msToNextMinute} ms (until ${formatTimeHMS(targetTime)})...`);
    await interruptibleSleep(msToNextMinute);
    L(`✅ Synced at ${formatTimeHMS(new Date())}`);
  }

  L('🔄 Initial sync with top of next minute...');
  await waitUntilTopOfMinuteWithOffset();

  let templateIndex = 0;
  let currentGroupName = null;

  let totalScheduled = 0;
  let totalFailedMsgs = 0;
  let totalSkippedDeleted = 0;
  let totalMarkersProcessed = 0;
  let totalDeferred = 0;
  let totalRetrySucceeded = 0;
  let totalRetryFailed = 0;

  let globalUIDIndex = 0;

  const deferredQueue = [];

  // زمان بعدی فلاش deferred — اگر صف خالی باشد null
  let nextDeferredFlushTime = null;

  const recentFailedUIDs = [];

  let messagesSinceLastPause = 0;
  let nextPauseAfter = getRandomDelay(PAUSE_AFTER_N_MESSAGES_RANGE);
  L(`⏸  Next long pause after ${nextPauseAfter} messages.`);

  function recordConsecutiveFailure(uid) {
    recentFailedUIDs.push(uid);
    if (recentFailedUIDs.length >= CONSECUTIVE_FAILURE_THRESHOLD) {
      W(`\n🆘 ${CONSECUTIVE_FAILURE_THRESHOLD} consecutive failures reached — saving UIDs to array "${CONSECUTIVE_FAILED_UIDS_KEY}" and resetting counter.`);
      appendToConsecutiveFailedUIDs(recentFailedUIDs);
      recentFailedUIDs.length = 0;
    }
  }

  function resetConsecutiveFailures() {
    if (recentFailedUIDs.length > 0) recentFailedUIDs.length = 0;
  }

  // افزودن UID به صف deferred + ست‌کردن زمان فلاش بعدی در صورت لزوم
  function pushToDeferred(item) {
    if (deferredQueue.length < MAX_DEFERRED_QUEUE) {
      deferredQueue.push(item);
      if (nextDeferredFlushTime === null) {
        nextDeferredFlushTime = getNextMinuteFlushTime();
        L(`   ⏳ First deferred item → next flush at ${formatTimeHMS(new Date(nextDeferredFlushTime))}`);
      }
      return true;
    }
    return false;
  }

  async function processDeferredQueue() {
    if (deferredQueue.length === 0 || stopRequested) return;

    L(`\n${'─'.repeat(60)}`);
    L(`🔄 Processing deferred queue (${deferredQueue.length} UID(s))...`);
    L(`${'─'.repeat(60)}`);

    const queue = [...deferredQueue];
    deferredQueue.length = 0;

    for (let i = 0; i < queue.length; i++) {
      if (stopRequested) break;
      const item = queue[i];
      const retryStart = Date.now();

      L(`\n   🔁 [${i + 1}/${queue.length}] Retry UID ${item.uid} (#${item.globalIndex}/${realUIDCount}) (group: "${item.groupName}")`);

      try {
        const name = await navigateAndWaitForContact(item.uid, 'Delay after navigation (retry)');
        L(`      👤 Name: "${name}"`);

        if (name.includes(DELETED_ACCOUNT_TEXT)) {
          L(`      ⏭  Account is deleted — giving up.`);
          totalRetryFailed++;
          recordConsecutiveFailure(item.uid);
          continue;
        }

        await waitForElement('#editable-message-text', TIMEOUT_MESSAGE_BOX);
        await randomDelay(DELAY_BEFORE_TYPING_RANGE, 'Delay before typing (retry)');
        await setMessageText(item.finalMessage);
        await randomDelay(DELAY_BEFORE_SEND_RANGE, 'Delay before send (retry)');

        const result = await scheduleCurrentChat();

        if (result.limitReached) {
          // UID در آرایه‌ی toast سقف ذخیره کن + حلقه‌ی صبر
          const limitKey = result.toast;
          addUIDToArray(limitKey, item.uid);
          L(`      🚫 Limit reached for ${item.uid} — entering wait-retry loop`);

          const limitResult = await runLimitRetryLoop(item.uid, item.finalMessage, 'deferred');

          if (limitResult.ok && limitResult.toast) {
            // موفق شد → از آرایه‌ی سقف حذف + به آرایه‌ی toast موفق اضافه
            removeUIDFromArray(limitKey, item.uid);
            addUIDToArray(limitResult.toast, item.uid);
            totalScheduled++;
            totalRetrySucceeded++;
            lastUID = item.uid;
            resetConsecutiveFailures();
            L(`      ✅ Retry succeeded (after limit wait) → "${limitResult.toast}"`);
          } else if (limitResult.stopped) {
            break;
          } else {
            // شکست نهایی → از آرایه‌ی سقف حذف + به no_toast اضافه
            removeUIDFromArray(limitKey, item.uid);
            addUIDToArray(NO_TOAST_KEY, item.uid);
            totalRetryFailed++;
            totalFailedMsgs++;
            recordConsecutiveFailure(item.uid);
            W(`      ❌ Retry failed — saved under "${NO_TOAST_KEY}".`);
          }
        } else if (result.ok && result.toast) {
          addUIDToArray(result.toast, item.uid);
          totalScheduled++;
          totalRetrySucceeded++;
          lastUID = item.uid;
          resetConsecutiveFailures();
          L(`      ✅ Retry succeeded → "${result.toast}"`);
        } else {
          // یک بار تلاش، اگر ناموفق → مستقیم به no_toast (بدون retry دوباره)
          addUIDToArray(NO_TOAST_KEY, item.uid);
          totalRetryFailed++;
          totalFailedMsgs++;
          recordConsecutiveFailure(item.uid);
          W(`      ❌ Retry failed — saved under "${NO_TOAST_KEY}".`);
        }
      } catch (e) {
        W(`      ❌ Retry error: ${e.message}`);
        addUIDToArray(NO_TOAST_KEY, item.uid);
        totalRetryFailed++;
        totalFailedMsgs++;
        recordConsecutiveFailure(item.uid);
        closeOpenModal();
      }

      const elapsed = Date.now() - retryStart;
      const remaining = AVERAGE_MS_PER_MESSAGE - elapsed;
      if (remaining > 0) {
        const jitter = Math.floor(remaining * (Math.random() * 0.4 - 0.2));
        const finalWait = Math.max(0, remaining + jitter);
        L(`      ⏱  Compensating delay = ${finalWait} ms (elapsed: ${elapsed} ms)`);
        await interruptibleSleep(finalWait);
      }
    }

    L(`\n   ✅ Deferred queue processed.`);
  }

  // ══════════════════════════════════════════════════════════════
  // 🔁 حلقه‌ی اصلی
  // ══════════════════════════════════════════════════════════════
  let lastUID = null;

  mainLoop:
  for (let i = 0; i < cleanedList.length; i++) {
    if (stopRequested) break;

    // ── بررسی زمان فلاش deferred در ابتدای هر iteration ──
    if (deferredQueue.length > 0 && nextDeferredFlushTime !== null && Date.now() >= nextDeferredFlushTime) {
      L(`\n⏰ Deferred flush time reached — processing queue...`);
      await processDeferredQueue();
      if (deferredQueue.length === 0) {
        nextDeferredFlushTime = null;
        L(`   ✅ Deferred queue empty — timer cleared.`);
      } else {
        nextDeferredFlushTime = getNextMinuteFlushTime();
        L(`   ⏳ Remaining deferred items — next flush at ${formatTimeHMS(new Date(nextDeferredFlushTime))}`);
      }
      if (stopRequested) break;
    }

    const rawItem = String(cleanedList[i]);

    if (Object.prototype.hasOwnProperty.call(GROUP_NAME_MAP, rawItem)) {
      currentGroupName = GROUP_NAME_MAP[rawItem];
      totalMarkersProcessed++;
      L(`🔀 Group marker "${rawItem}" → current group = "${currentGroupName}"`);
      continue;
    }

    const uid = rawItem;
    globalUIDIndex++;
    const uidOrdinal = globalUIDIndex;
    const msgStartTime = Date.now();

    L(`\n   ▶️  [${i + 1}/${cleanedList.length}] UID #${uidOrdinal}/${realUIDCount}: ${uid} | group: "${currentGroupName}"`);

    let contactName = '';
    try {
      contactName = await navigateAndWaitForContact(uid, 'Delay after navigation');
      L(`      👤 Name: "${contactName}"`);
    } catch (e) {
      W(`      ⚠️  Contact name not found: ${e.message}`);
      addUIDToArray(NO_TOAST_KEY, uid);
      totalFailedMsgs++;
      recordConsecutiveFailure(uid);
      continue;
    }

    if (contactName.includes(DELETED_ACCOUNT_TEXT)) {
      L(`      ⏭  Deleted account detected — skipping immediately.`);
      totalSkippedDeleted++;
      continue;
    }

    try {
      const currentTemplateIdx = templateIndex;
      const template = MESSAGE_TEMPLATES[currentTemplateIdx];
      templateIndex = (templateIndex + 1) % MESSAGE_TEMPLATES.length;

      // اگر تمپلیت اصلاً name_of_group نداشت، اشکالی ندارد و همان پیام بدون جایگزینی ارسال می‌شود.
      // (replaceAll روی رشته‌ای که شامل name_of_group نیست، هیچ تغییری نمی‌دهد و خطا نمی‌دهد)
      const finalMessage = template
        .replaceAll('name_of_contact', contactName)
        .replaceAll('name_of_group', currentGroupName);
      L(`      📝 Template #${currentTemplateIdx + 1}/${MESSAGE_TEMPLATES.length}`);

      await waitForElement('#editable-message-text', TIMEOUT_MESSAGE_BOX);
      await randomDelay(DELAY_BEFORE_TYPING_RANGE, 'Delay before typing');
      await setMessageText(finalMessage);
      await randomDelay(DELAY_BEFORE_SEND_RANGE, 'Delay before send');

      const result = await scheduleCurrentChat();

      if (result.limitReached) {
        // ── سقف ۵۰ پیام ──
        // UID در آرایه‌ی toast با متن سقف ذخیره کن و وارد حلقه‌ی صبر و تلاش دوباره شو
        const limitKey = result.toast;
        addUIDToArray(limitKey, uid);
        L(`      🚫 Limit reached for ${uid} — entering wait-retry loop`);

        const limitResult = await runLimitRetryLoop(uid, finalMessage, 'main');

        if (limitResult.ok && limitResult.toast) {
          // موفق شد → از آرایه‌ی سقف حذف + به آرایه‌ی toast موفق اضافه
          removeUIDFromArray(limitKey, uid);
          addUIDToArray(limitResult.toast, uid);
          totalScheduled++;
          lastUID = uid;
          resetConsecutiveFailures();
          L(`      ✅ Limit-retry succeeded → "${limitResult.toast}"`);
        } else if (limitResult.stopped) {
          break mainLoop;
        } else {
          // شکست نهایی → از آرایه‌ی سقف حذف + به no_toast اضافه
          removeUIDFromArray(limitKey, uid);
          addUIDToArray(NO_TOAST_KEY, uid);
          totalFailedMsgs++;
          recordConsecutiveFailure(uid);
          W(`      ❌ Limit-retry failed — saved under "${NO_TOAST_KEY}".`);
        }
      } else if (result.ok && result.toast) {
        addUIDToArray(result.toast, uid);
        totalScheduled++;
        lastUID = uid;
        resetConsecutiveFailures();
        L(`      ✅ Scheduled → saved in array "${result.toast}"`);
      } else {
        if (pushToDeferred({ uid, groupName: currentGroupName, finalMessage, globalIndex: uidOrdinal })) {
          totalDeferred++;
          lastUID = uid;
          L(`      📌 Deferred (queue: ${deferredQueue.length}/${MAX_DEFERRED_QUEUE}) — will retry at next minute.`);
        } else {
          addUIDToArray(NO_TOAST_KEY, uid);
          totalFailedMsgs++;
          recordConsecutiveFailure(uid);
          W(`      ⚠️  Deferred queue full — giving up.`);
        }
      }

    } catch (e) {
      W(`      ❌ Failed: ${e.message}`);
      closeOpenModal();
      addUIDToArray(NO_TOAST_KEY, uid);
      totalFailedMsgs++;
      recordConsecutiveFailure(uid);
    }

    const elapsed = Date.now() - msgStartTime;
    const remaining = AVERAGE_MS_PER_MESSAGE - elapsed;
    if (remaining > 0) {
      const jitter = Math.floor(remaining * (Math.random() * 0.4 - 0.2));
      const finalWait = Math.max(0, remaining + jitter);
      L(`      ⏱  Compensating delay = ${finalWait} ms (target avg: ${AVERAGE_MS_PER_MESSAGE} ms, elapsed: ${elapsed} ms)`);
      await interruptibleSleep(finalWait);
    }

    messagesSinceLastPause++;
    if (messagesSinceLastPause >= nextPauseAfter && !stopRequested) {
      const pauseDuration = getRandomDelay(PAUSE_DURATION_RANGE);
      L(`\n   ⏸  Long pause after ${messagesSinceLastPause} messages = ${pauseDuration} ms`);

      L(`\n📨 Sending progress notification to UID ${NOTIFICATION_UID}...`);
      const notifText = buildProgressNotification(totalScheduled, realUIDCount, totalFailedMsgs, totalDeferred, lastUID, false);
      L(`   Notification content:\n${notifText.split('\n').map(l => '     ' + l).join('\n')}`);
      await sendImmediateMessage(NOTIFICATION_UID, notifText);

      navigateToURL(REDIRECT_AFTER_SEND_URL);
      await interruptibleSleep(pauseDuration);

      messagesSinceLastPause = 0;
      nextPauseAfter = getRandomDelay(PAUSE_AFTER_N_MESSAGES_RANGE);
      L(`   ▶️  Resume. Next pause after ${nextPauseAfter} messages.`);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 🧹 فلاش نهایی deferredها قبل از خلاصه
  // ══════════════════════════════════════════════════════════════
  if (deferredQueue.length > 0 && !stopRequested) {
    L(`\n⏰ Final deferred flush before summary (${deferredQueue.length} item(s))...`);
    await processDeferredQueue();
    if (deferredQueue.length === 0) {
      nextDeferredFlushTime = null;
    } else {
      nextDeferredFlushTime = getNextMinuteFlushTime();
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 📊 خلاصه و پیام پایانی
  // ══════════════════════════════════════════════════════════════
  L('\n═══════════════════════════════════════════════');
  L('📊 SUMMARY');
  L('═══════════════════════════════════════════════');
  L(`✅ Messages scheduled       : ${totalScheduled}/${realUIDCount}`);
  L(`📌 Deferred (queued)        : ${totalDeferred}`);
  L(`🔁 Retry succeeded          : ${totalRetrySucceeded}`);
  L(`❌ Retry failed             : ${totalRetryFailed}`);
  L(`❌ Messages failed (total)  : ${totalFailedMsgs}`);
  L(`⏭  Deleted accounts skip    : ${totalSkippedDeleted}`);
  L(`🔀 Markers processed        : ${totalMarkersProcessed}`);
  L(`🕐 Finished at              : ${formatTimeHMS(new Date())}`);
  L(`🆘 Remaining unhandled fails: ${recentFailedUIDs.length}`);

  L(`\n📨 Sending final "done" notification to UID ${NOTIFICATION_UID}...`);
  const finalText = `✅ عملیات تمام شد
✅ Scheduled: ${totalScheduled}/${realUIDCount}
❌ Failed: ${totalFailedMsgs}
📌 Deferred: ${totalDeferred}
🔄 Retry succeeded: ${totalRetrySucceeded}
❌ Retry failed: ${totalRetryFailed}
🕐 Finished at: ${formatTimeHMS(new Date())}`;
  await sendImmediateMessage(NOTIFICATION_UID, finalText);

  L('\n📚 Toast Arrays in localStorage:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const val = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(val)) {
        L(`   "${key}" : ${val.length} UID(s)`);
      }
    } catch (e) {}
  }

  L('\n💡 Console Commands:');
  L('   getToastArrays()                       - show all arrays');
  L('   getToastArray("text")                  - show one array');
  L('   clearToastArray("text")                - clear one array');
  L('   removeUIDFromToastArray("text","uid")  - remove a UID');
  L('   clearAllToastArrays()                  - clear all arrays');
  L('   downloadToastArray("text")             - download as txt');
  L('   getConsecutiveFailedUIDs()             - show consecutive failed');
  L('   clearConsecutiveFailedUIDs()           - clear consecutive failed');
  L('   stopSending()                          - stop the loop');

  L('\n🏁 Operation finished.');
})();
