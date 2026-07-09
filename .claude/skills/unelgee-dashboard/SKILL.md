---
name: unelgee-dashboard
description: "УИХ-ын Тамгын газрын 'Хуулийн хэрэгжилтийн үр дагаврын үнэлгээ' dashboard-ийг хөгжүүлэх дүрэм. index.html, css/style.css, js/app.js гэсэн 3 файлыг PDF эх загварын дагуу засварлах, ECharts график, bootbox modal, data-value анимаци, AJAX-д бэлэн бүтэц үүсгэх бүх тохиолдолд ашиглана."
---

# Хуулийн үнэлгээ — Dashboard хөгжүүлэлтийн дүрэм

Энэ төслийн dashboard-ийг засварлахад дараах дүрмийг мөрдөнө. Хэрэглэгч
нэг бүрчлэн давтан хэлэх шаардлагагүй — эдгээр нь стандарт.

## 1. Зөвхөн 3 файл засварлана
- `index.html` — бүтэц (semantic, ойлгомжтой)
- `css/style.css` — загвар
- `js/app.js` — логик

`js/libs/` доторх санг **бүү өөрчил**. Бэлэн байгаа сангууд:
- Bootstrap 5.3.8 (`js/libs/bootstrap/`)
- jQuery 3.7.1 (`js/libs/jquery-3.7.1.min.js`)
- bootbox 6.0.0 (`js/libs/bootbox/bootbox.min.js`) — Bootstrap 5-тай нийцтэй
- ECharts (`js/libs/echarts/dist/echarts.min.js`)
- bootstrap-icons (`css/bootstrap-icons/`) — `<i class="bi bi-...">`

## 2. Эх загвар = PDF
`docs/` доторх PDF-ийн **өнгө, фонт, текст, байршлыг 100% дагана**. Өнгө,
тооны утга зэрэгт эргэлзвэл PDF-ээс шалгана. Хэрэглэгч screenshot өгвөл
түүнээс өнгө/утгыг нь ав.

## 3. Загварын стандарт (CSS)
- **Суурь фонт: 12px**. Бусад хэмжээг үүнд тааруул.
- **Фонт жин: 600 (semibold)** голчлон хэрэглэ — хэт бүдүүн (700/800)
  зөвхөн лого зэрэг онцгой газар.
- Фонт: `"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Өнгийг **CSS хувьсагчаар** (`:root`) удирд. Үндсэн: цэнхэр `#2f6fed`,
  ногоон `#22c55e`, улаан `#ef4444`, улбар шар `#f59e0b`, текст `#1f2b44`,
  бүдэг `#8a94a6`.
- Картууд ижил өндөр (grid `align-items: stretch`, `min-height`).
- Гурван самбар ижил өндөр (`stretch` + `.panel { height:100% }`).
- **Footer дэлгэцийн доор**: `.dashboard { display:flex; flex-direction:column;
  min-height:100vh }` + footer-т `margin-top:auto`.
- Card доторх доод элемент (note, highlight)-ийг доор наахдаа: `.panel`-г
  flex багана болгож, тухайн элементэд `margin-top:auto`.

## 4. Тоонууд — data-value + анимаци
- Dashboard-ийн бүх тоог HTML tag-ийн **`data-value`** attribute дээр байрлуул.
- `animateNumbers()` нь `[data-value]`-г уншиж **0 → утга** руу easeOutCubic
  анимацитай өсгөнө.
- Нийлбэр/тотал утгыг **өгөгдлөөс тооцоол** (`reduce`), гараар бүү бич.

## 5. Огноо
Огноог **JavaScript-ээр тухайн өдрөөр** үүсгэнэ:
- Урт хэлбэр: `2026 оны долдугаар сарын 9-ний өдрийн байдлаар`
- Badge: `2026.07.09`

## 6. app.js бүтэц — цэгцтэй, AJAX-д бэлэн
Урсгал: **`loadData(done) → render(data)`**
```js
const DATA = { ... };            // 1. Бүх өгөгдөл нэг дор
const C = { ... }, FONT = '...'; // 2. Өнгө, фонт
function loadData(done){ done(DATA); }   // 3. одоо статик; AJAX болгоход:
                                          //    $.getJSON("api/...", done);
function render*(data){ ... }    // 4. дэлгэцэнд буулгах (data параметртэй)
```
- **Нэг эх сурвалж**: график ба хүснэгт ижил өгөгдлөөс (жишээ `DATA.trend`).
  Өгөгдлийг давхардуулж бүү бич.
- Render функц бүр `data`-г параметрээр авна — AJAX-аас ирсэн өгөгдлийг
  шууд дамжуулна.
- jQuery-г тууштай хэрэглэ.

## 7. ECharts график
- График бүрт **үндсэн фонтыг** өг (`option.textStyle = { fontFamily: FONT }`).
- Font size-уудыг 12px суурьт тааруул (тренд ~11px, combo ~10px).
- Бүх chart instance-ийг массивт хадгалж `resize`-д ашигла.

## 8. Bootbox modal
- Дэлгэрэнгүй мэдээллийг bootbox цонхоор.
- Modal нээх entity бүрд **`id`** өгч, мөрөнд `data-id` байрлуул.
- `openModal(id, name)` — id-г дараа нь **AJAX-аар дэлгэрэнгүй татахад** ашиглана.
- Аль элемент дарахад нээхийг хэрэглэгчийн зааврын дагуу (жишээ: жагсаалтын
  мөр нээнэ, гарчиг нээхгүй).

## 9. Хэл
Бүх UI текст болон **кодын тайлбарыг монголоор** бич.
