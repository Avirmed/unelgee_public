/* ============================================================
 * Хуулийн хэрэгжилтийн үр дагаврын үнэлгээ — Dashboard
 * ------------------------------------------------------------
 * Урсгал:  loadData()  →  render(data)
 *
 *   1. DATA     — өгөгдөл (одоо статик, дараа нь AJAX-аар унших)
 *   2. C        — графикийн нэгдсэн өнгө
 *   3. loadData — өгөгдөл татах цэг (AJAX солиход бэлэн)
 *   4. render*  — өгөгдлийг дэлгэцэнд буулгах функцууд
 *   5. charts   — ECharts графикууд
 *   6. init     — эхлүүлэх
 * ============================================================ */

"use strict";

/* ---------- 1. ӨГӨГДӨЛ ---------- */
const DATA = {

    // Статистик картуудын тоо (id : утга)
    stats: {
        total: 937, need: 346, notDue: 42, toAssess: 304,
        done: 170, notDone: 104, ongoing: 30, reports: 205
    },

    // Үнэлгээний байдал — гурилан диаграм
    unelehHууль: 304,
    hamralt: 55.9,
    byadal: [
        { name: "Үнэлгээ хийсэн",         value: 170, color: "#22c55e" },
        { name: "Үнэлгээ хийгээгүй",      value: 104, color: "#ef4444" },
        { name: "Үнэлгээ хийгдэж байгаа", value: 30,  color: "#f59e0b" }
    ],

    // Жил бүрийн тренд — график ба хүснэгт нэг эх сурвалжаас
    trend: {
        years:  [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
        values: [7, 1, 2, 18, 11, 20, 24, 74, 48]
    },

    // Хугацаа болсон байдал — багана + шугам
    hugatsaa: {
        years:   ["2022", "2023", "2024", "2025"],
        bolson:  [76, 54, 37, 56],
        unelsen: [46, 29, 19, 30],
        huvi:    [61, 54, 51, 54]
    },

    // Хариуцсан байгууллагаар топ 10 (id — modal-д дэлгэрэнгүй татахад ашиглана)
    orgs: [
        { id: 1,  name: "Хууль зүй, дотоод хэргийн яам",                count: 80 },
        { id: 2,  name: "Сангийн яам",                                  count: 34 },
        { id: 3,  name: "Гэр бүл, хөдөлмөр, нийгмийн хамгааллын яам",   count: 29 },
        { id: 4,  name: "ХХААХҮЯ",                                      count: 21 },
        { id: 5,  name: "Байгаль орчин, уур амьсгалын өөрчлөлтийн яам", count: 19 },
        { id: 6,  name: "Батлан хамгааллахын яам",                      count: 14 },
        { id: 7,  name: "Монголбанк",                                   count: 12 },
        { id: 8,  name: "Эрүүл мэндийн яам",                            count: 12 },
        { id: 9,  name: "Аж үйлдвэр, эрдэс баялгийн яам",               count: 12 },
        { id: 10, name: "Санхүүгийн зохицуулах хороо",                  count: 11 }
    ]
};

/* ---------- 2. ӨНГӨ, ФОНТ ---------- */
const C = {
    blue: "#2f6fed", green: "#22c55e", red: "#ef4444", orange: "#f59e0b",
    text: "#1f2b44", muted: "#8a94a6", track: "#e6e9f0"
};

// Графикийн фонт — үндсэн (CSS) фонттой ижил
const FONT = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/* ---------- 3. ӨГӨГДӨЛ ТАТАХ ----------
 * Одоо статик өгөгдөл буцаана. Сервертэй холбоход доорх мөрийг
 * идэвхжүүлж, статик хэсгийг устгахад л хангалттай:
 *     $.getJSON("api/dashboard.json", done);
 */
function loadData(done) {
    done(DATA);
}

/* ---------- 4. ДЭЛГЭЦЭНД БУУЛГАХ ---------- */

// 4.1 Огноог тухайн өдрөөр
const MONTHS = ["нэгдүгээр", "хоёрдугаар", "гуравдугаар", "дөрөвдүгээр",
    "тавдугаар", "зургадугаар", "долдугаар", "наймдугаар", "есдүгээр",
    "аравдугаар", "арван нэгдүгээр", "арван хоёрдугаар"];

function renderDate() {
    const d = new Date();
    const p = n => (n < 10 ? "0" + n : n);
    $("#reportDate").text(`${d.getFullYear()} оны ${MONTHS[d.getMonth()]} сарын ${d.getDate()}-ний өдрийн байдлаар`);
    $("#dateBadge").text(`${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`);
}

// 4.2 data-value бүхий тоонуудыг анимацитай харуулах
function animateNumbers() {
    $("[data-value]").each(function () {
        const el = this, target = +el.getAttribute("data-value"), t0 = performance.now();
        (function step(now) {
            const k = Math.min((now - t0) / 1400, 1);      // 0 → 1
            el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
        })(t0);
    });
}

// 4.3 Байгууллагын хүснэгт + нийт дүн (давхардсан тоогоор)
function renderOrgTable(orgs) {
    const html = orgs.map((o, i) =>
        `<tr data-id="${o.id}" data-org="${o.name}">
            <td class="rank">${i + 1}</td>
            <td>${o.name}</td>
            <td class="num count">${o.count}</td>
        </tr>`).join("");
    $("#orgTableBody").html(html);

    // Нийт — топ 10 байгууллагын хуулийн тооны нийлбэр
    const total = orgs.reduce((sum, o) => sum + o.count, 0);
    $("#orgTotal").attr("data-value", total);
}

// 4.4 Жил бүрийн трендийн хүснэгт (графиктай нэг эх сурвалж — DATA.trend)
function renderTrendTable(trend) {
    const total = trend.values.reduce((sum, v) => sum + v, 0);

    const head = "<tr><th>Жил</th>"
        + trend.years.map(y => `<th class="num">${y}</th>`).join("")
        + `<th class="num">Нийт</th></tr>`;

    const body = "<tr><td>Тоо</td>"
        + trend.values.map(v => `<td class="num">${v}</td>`).join("")
        + `<td class="num"><b>${total}</b></td></tr>`;

    $("#trendHead").html(head);
    $("#trendBody").html(body);
}

/* ---------- 5. ГРАФИКУУД ---------- */
const chartList = [];   // resize хийхэд ашиглана

function chart(id, option) {
    // Бүх графикт үндсэн фонтыг нэг мөр өгнө
    option.textStyle = { fontFamily: FONT };
    const c = echarts.init(document.getElementById(id));
    c.setOption(option);
    chartList.push(c);
}

function renderCharts(data) {

    // 5.1 Үнэлгээний байдал — гурилан диаграм
    chart("chartDonut", {
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        series: [{
            type: "pie",
            radius: ["60%", "84%"],
            avoidLabelOverlap: false,
            itemStyle: { borderColor: "#fff", borderWidth: 2 },
            label: {
                show: true, position: "center",
                formatter: `{v|${data.unelehHууль}}\n{t|Үнэлэх Хууль}`,
                rich: {
                    v: { fontSize: 20, fontWeight: 600, color: C.text, lineHeight: 24 },
                    t: { fontSize: 11, color: C.muted }
                }
            },
            labelLine: { show: false },
            data: data.byadal.map(d => ({ name: d.name, value: d.value, itemStyle: { color: d.color } }))
        }]
    });

    // 5.2 Үнэлгээний хамралт — gauge
    chart("chartGauge", {
        series: [{
            type: "gauge", startAngle: 220, endAngle: -40, min: 0, max: 100,
            radius: "90%", center: ["50%", "52%"],
            progress: { show: true, width: 16, roundCap: true, itemStyle: { color: C.green } },
            axisLine: { roundCap: true, lineStyle: { width: 16, color: [[1, C.track]] } },
            pointer: { show: false }, axisTick: { show: false },
            splitLine: { show: false }, axisLabel: { show: false },
            title: { offsetCenter: [0, "30%"], fontSize: 10, color: C.muted },
            detail: {
                offsetCenter: [0, "-5%"], fontSize: 20, fontWeight: 600,
                color: C.text, formatter: "{value}%"
            },
            data: [{ value: data.hamralt, name: "Үнэлгээний хамралт" }]
        }]
    });

    // 5.3 Жил бүрийн тренд — шугаман график
    chart("chartTrend", {
        grid: { top: 30, right: 18, bottom: 24, left: 18 },
        tooltip: { trigger: "axis" },
        xAxis: {
            type: "category",
            // Бүтэн жилээс богино шошго үүсгэнэ (2018 → "18")
            data: data.trend.years.map(y => String(y).slice(2)),
            axisLine: { lineStyle: { color: C.track } },
            axisTick: { show: false }, axisLabel: { color: C.muted }
        },
        yAxis: { type: "value", show: false, max: Math.max(...data.trend.values) + 15 },
        series: [{
            type: "line", data: data.trend.values,
            symbol: "circle", symbolSize: 8,
            lineStyle: { width: 3, color: C.blue },
            itemStyle: { color: C.blue, borderColor: "#fff", borderWidth: 2 },
            label: { show: true, position: "top", color: C.text, fontWeight: 600, fontSize: 11 },
            areaStyle: {
                color: {
                    type: "linear", x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: "rgba(47,111,237,.16)" },
                        { offset: 1, color: "rgba(47,111,237,0)" }
                    ]
                }
            }
        }]
    });

    // 5.4 Хугацаа болсон байдал — багана + шугам
    chart("chartCombo", {
        grid: { top: 26, right: 30, bottom: 26, left: 26 },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        xAxis: {
            type: "category", data: data.hugatsaa.years,
            axisLine: { lineStyle: { color: C.track } },
            axisTick: { show: false }, axisLabel: { color: C.muted }
        },
        // Зүүн тэнхлэг — багана, баруун тэнхлэг — шугам (хувь)
        // Шугамыг баганаас дээгүүр байлгахын тулд баруун max-ыг бага авав
        yAxis: [
            { type: "value", show: false, max: 95 },
            { type: "value", show: false, min: 0, max: 70 }
        ],
        barGap: "20%",
        series: [
            {
                name: "Хугацаа болсон", type: "bar", barWidth: 20,
                itemStyle: { color: C.blue, borderRadius: [3, 3, 0, 0] },
                label: { show: true, position: "top", color: C.blue, fontWeight: 600, fontSize: 10 },
                data: data.hugatsaa.bolson
            },
            {
                name: "Үүнээс: Үнэлсэн", type: "bar", barWidth: 20,
                itemStyle: { color: C.green, borderRadius: [3, 3, 0, 0] },
                label: { show: true, position: "top", color: C.green, fontWeight: 600, fontSize: 10 },
                data: data.hugatsaa.unelsen
            },
            {
                name: "Гүйцэтгэлийн хувь", type: "line", yAxisIndex: 1,
                symbol: "circle", symbolSize: 7,
                lineStyle: { width: 2.5, color: C.orange }, itemStyle: { color: C.orange },
                label: { show: true, position: "top", color: C.orange, fontWeight: 600, fontSize: 10, formatter: "{c}%" },
                data: data.hugatsaa.huvi
            }
        ]
    });
}

/* ---------- 6. ЭХЛҮҮЛЭХ ---------- */

// Байгууллагын дэлгэрэнгүй цонх
// id — дараа нь энэ id-гаар дэлгэрэнгүй мэдээллийг AJAX-аар татахад ашиглана
function openOrgModal(id, name) {
    bootbox.dialog({
        title: name || "Хариуцсан байгууллага",
        message: '<div class="text-muted">Дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.</div>',
        size: "large",
        buttons: { close: { label: "Хаах", className: "btn-secondary" } }
    });
}

$(function () {
    renderDate();

    loadData(function (data) {
        renderOrgTable(data.orgs);
        renderTrendTable(data.trend);
        renderCharts(data);
        animateNumbers();
    });

    // Жагсаалтын мөр дээр дарахад тухайн байгууллагын цонх нээх
    $("#orgTableBody").on("click", "tr", function () {
        openOrgModal($(this).data("id"), $(this).data("org"));
    });
    // Цонхны хэмжээ өөрчлөгдөхөд графикуудыг дахин байрлуулах
    $(window).on("resize", () => chartList.forEach(c => c.resize()));
});
